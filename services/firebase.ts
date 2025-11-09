import { initializeApp } from "firebase/app";
import {
    getAuth,
    onAuthStateChanged as fbOnAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    User as FirebaseUser,
} from "firebase/auth";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    addDoc,
    onSnapshot,
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp,
    updateDoc,
    Timestamp,
} from "firebase/firestore";

import { User, UserRole, Teacher, Student, Conversation, Message } from '../types';
import { GRADE_LEVELS } from '../constants';

// Firebase configuration from user.
const firebaseConfig = {
  apiKey: "AIzaSyBTCmNT5iDSynRLOh3Dydn0RCrF9VgWjvw",
  authDomain: "tustu-d29a7.firebaseapp.com",
  projectId: "tustu-d29a7",
  storageBucket: "tustu-d29a7.firebasestorage.app",
  messagingSenderId: "481683179753",
  appId: "1:481683179753:web:d817c2e7ec4aeb8caa4878",
  measurementId: "G-0NLC7JTTHQ"
};


export const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE" && firebaseConfig.projectId !== "YOUR_PROJECT_ID_HERE";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const usersCollection = collection(db, 'users');
const conversationsCollection = collection(db, 'conversations');

// --- USER PROFILE FUNCTIONS ---

const getUserProfile = async (uid: string): Promise<User | null> => {
    if (!isFirebaseConfigured) return null;
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        return { ...data, id: userDocSnap.id } as User;
    }
    return null;
};

const createUserProfile = async (firebaseUser: FirebaseUser, details: { name: string; role: UserRole; }): Promise<User> => {
    let newUserProfile: Omit<Teacher, 'id'> | Omit<Student, 'id'>;

    if (details.role === UserRole.Teacher) {
        newUserProfile = {
            name: details.name,
            email: firebaseUser.email!,
            role: UserRole.Teacher,
            headline: "New Teacher! Ready to inspire students.",
            subjects: [],
            bio: "",
            rating: 0,
            reviews: [],
            hourlyRate: 20,
            profileViews: 0,
            ...(firebaseUser.photoURL && { avatarUrl: firebaseUser.photoURL }),
        };
    } else {
        newUserProfile = {
            name: details.name,
            email: firebaseUser.email!,
            role: UserRole.Student,
            gradeLevel: GRADE_LEVELS[2],
            learningGoals: "",
            ...(firebaseUser.photoURL && { avatarUrl: firebaseUser.photoURL }),
        };
    }

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userDocRef, newUserProfile);

    return { ...newUserProfile, id: firebaseUser.uid } as User;
};

export const getAllUsers = async (): Promise<(Teacher | Student)[]> => {
    if (!isFirebaseConfigured) return [];
    const querySnapshot = await getDocs(usersCollection);
    const users: (Teacher | Student)[] = [];
    querySnapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() } as (Teacher | Student));
    });
    return users;
};

export const updateUserProfile = async (userId: string, profileData: Partial<User>): Promise<void> => {
    const userDocRef = doc(db, 'users', userId);
    // Exclude fields that shouldn't be updated directly from a profile form
    const { id, email, role, ...updatableData } = profileData;
    
    // Firestore doesn't allow `undefined` values. We need to clean the object.
    const cleanData = Object.fromEntries(
      Object.entries(updatableData).filter(([_, v]) => v !== undefined)
    );

    await updateDoc(userDocRef, cleanData);
};


// --- AUTH FUNCTIONS ---

export const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
    if (!isFirebaseConfigured) {
        callback(null);
        return () => {}; // Return a no-op unsubscribe function
    }
    return fbOnAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            const userProfile = await getUserProfile(firebaseUser.uid);
            callback(userProfile);
        } else {
            callback(null);
        }
    });
};

export const signInWithEmail = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (details: { name: string; email: string; role: UserRole; password: string }): Promise<void> => {
    const userCredential = await createUserWithEmailAndPassword(auth, details.email, details.password);
    await createUserProfile(userCredential.user, { name: details.name, role: details.role });
};

export const signInWithGoogle = async (): Promise<void> => {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    
    const userProfile = await getUserProfile(firebaseUser.uid);
    if (!userProfile) {
        // Default new Google signups to Student.
        await createUserProfile(firebaseUser, {
            name: firebaseUser.displayName || 'New User',
            role: UserRole.Student
        });
    }
};

export const signOutUser = (): Promise<void> => {
    return signOut(auth);
};


// --- CHAT FUNCTIONS ---

export const getConversationsForUser = async (userId: string): Promise<Conversation[]> => {
    if (!isFirebaseConfigured) return [];
    const q = query(conversationsCollection, where('participantIds', 'array-contains', userId));
    const querySnapshot = await getDocs(q);
    const convos: Conversation[] = [];
    querySnapshot.forEach(doc => {
        const data = doc.data();
        convos.push({
            id: doc.id,
            ...data,
            lastMessageTimestamp: (data.lastMessageTimestamp as Timestamp)?.toDate()
        } as Conversation);
    });
    return convos.sort((a, b) => (b.lastMessageTimestamp?.getTime() || 0) - (a.lastMessageTimestamp?.getTime() || 0));
};


export const onMessagesSnapshot = (conversationId: string, callback: (msgs: Message[]) => void): (() => void) => {
    const messagesCollection = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesCollection, orderBy('timestamp', 'asc'));

    return onSnapshot(q, (querySnapshot) => {
        const msgs: Message[] = [];
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const timestamp = (data.timestamp as Timestamp)?.toDate();
            msgs.push({
                id: doc.id,
                conversationId: conversationId,
                senderId: data.senderId,
                text: data.text,
                timestamp: timestamp ? timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'sending...'
            });
        });
        callback(msgs);
    });
};

export const sendMessage = async (conversationId: string, text: string, senderId: string): Promise<void> => {
    const messagesCollection = collection(db, 'conversations', conversationId, 'messages');
    await addDoc(messagesCollection, {
        text,
        senderId,
        timestamp: serverTimestamp()
    });
    const conversationDocRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationDocRef, {
        lastMessageTimestamp: serverTimestamp()
    });
};

export const createOrFindConversation = async (studentId: string, teacherId: string): Promise<Conversation> => {
    const participantIds = [studentId, teacherId].sort();
    
    const q = query(conversationsCollection, where('participantIds', '==', participantIds));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Conversation;
    } else {
        const newConvoData = {
            participantIds: participantIds,
            lastMessageTimestamp: serverTimestamp()
        };
        const newConvoRef = await addDoc(conversationsCollection, newConvoData);
        return {
            id: newConvoRef.id,
            participantIds: participantIds,
            lastMessageTimestamp: new Date()
        } as Conversation;
    }
};