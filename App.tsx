import React, { useState, useEffect } from 'react';
import { Page, Teacher, User, Student, UserRole, Conversation } from './types';
import { onAuthStateChanged, signOutUser, createOrFindConversation, getAllUsers, updateUserProfile, isFirebaseConfigured } from './services/firebase';

import Header from './components/Header';
import Footer from './components/Footer';
import SearchPage from './components/SearchPage';
import TeacherProfilePage from './components/TeacherProfilePage';
import TeacherOnboardingPage from './components/TeacherOnboardingPage';
import AuthPage from './components/AuthPage';
import ChatPage from './components/ChatPage';
import StudentProfilePage from './components/StudentProfilePage';
import HomePage from './components/HomePage';
import ChatListPage from './components/ChatListPage';
import FirebaseNotConfigured from './components/FirebaseNotConfigured';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>('light');

  const [users, setUsers] = useState<(Teacher | Student)[]>([]);
  const teachers = users.filter(u => u.role === UserRole.Teacher) as Teacher[];
  
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const storedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);
  
  useEffect(() => {
      if (!isFirebaseConfigured) return;
      const fetchUsers = async () => {
          const allUsers = await getAllUsers();
          setUsers(allUsers);
      };
      fetchUsers();
  }, [currentUser]); // Refetch users when auth state changes


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(user => {
      setCurrentUser(user);
      if (user) {
        if (user.role === UserRole.Student) navigateTo(Page.Search);
        else if (user.role === UserRole.Teacher) navigateTo(Page.TeacherOnboarding);
      } else {
        navigateTo(Page.Home);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSelectTeacher = (id: string) => {
    setSelectedTeacherId(id);
    navigateTo(Page.TeacherProfile);
  };

  const handleStartChat = async (teacherId: string) => {
    if (!currentUser || currentUser.role !== UserRole.Student) return;
    const conversation = await createOrFindConversation(currentUser.id, teacherId);
    setActiveConversation(conversation);
    navigateTo(Page.Chat);
  };
  
  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    navigateTo(Page.Chat);
  }

  const handleSaveProfile = async (profile: User) => {
    await updateUserProfile(profile.id, profile);
    setCurrentUser(profile); // Optimistic update
    showToast('Profile saved successfully!');
    
    // Refetch all users to get the updated profile in lists
    const allUsers = await getAllUsers();
    setUsers(allUsers);
    
    if (profile.role === UserRole.Teacher) navigateTo(Page.TeacherOnboarding);
    else navigateTo(Page.StudentProfile);
  };
  
  const handleLogout = async () => {
    await signOutUser();
    setCurrentUser(null);
    navigateTo(Page.Home);
  };
  
  const renderContent = () => {
    if (isAuthLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    if (!currentUser) {
       switch (currentPage) {
          case Page.Auth: return <AuthPage onAuthSuccess={() => {}} />;
          case Page.Home: default: return <HomePage onNavigate={navigateTo} />;
       }
    }

    const studentUser = currentUser as Student;
    const teacherUser = currentUser as Teacher;

    switch (currentPage) {
      case Page.Search:
        return <SearchPage teachers={teachers} onSelectTeacher={handleSelectTeacher} currentUser={studentUser} />;
      case Page.TeacherProfile:
        const teacher = teachers.find(t => t.id === selectedTeacherId);
        return teacher ? <TeacherProfilePage teacher={teacher} onNavigate={navigateTo} onStartChat={handleStartChat} currentUser={currentUser} /> : <SearchPage teachers={teachers} onSelectTeacher={handleSelectTeacher} currentUser={studentUser} />;
      case Page.TeacherOnboarding:
        return currentUser.role === UserRole.Teacher ? <TeacherOnboardingPage onSave={handleSaveProfile as (p: Teacher) => void} teacherToEdit={teacherUser} /> : <SearchPage teachers={teachers} onSelectTeacher={handleSelectTeacher} currentUser={studentUser} />;
      case Page.StudentProfile:
        return currentUser.role === UserRole.Student ? <StudentProfilePage onSave={handleSaveProfile as (p: Student) => void} studentToEdit={studentUser} /> : <SearchPage teachers={teachers} onSelectTeacher={handleSelectTeacher} currentUser={studentUser} />;
      case Page.ChatList:
        return <ChatListPage currentUser={currentUser} onSelectConversation={handleSelectConversation} users={users}/>;
      case Page.Chat:
        if (activeConversation) {
           return <ChatPage conversation={activeConversation} currentUser={currentUser} users={users} onNavigate={navigateTo} />
        }
        return <ChatListPage currentUser={currentUser} onSelectConversation={handleSelectConversation} users={users}/>;
      default:
        return currentUser.role === UserRole.Student ? <SearchPage teachers={teachers} onSelectTeacher={handleSelectTeacher} currentUser={studentUser} /> : <TeacherOnboardingPage onSave={handleSaveProfile as (p: Teacher) => void} teacherToEdit={teacherUser} />;
    }
  };
  
  if (!isFirebaseConfigured) {
    return <FirebaseNotConfigured />;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col font-sans text-slate-800 dark:text-slate-200 selection:bg-indigo-500 selection:text-white">
      <Header currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-bounce z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default App;
