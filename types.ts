export enum UserRole {
  Student = 'Student',
  Teacher = 'Teacher',
}

export enum Page {
  Home = 'Home',
  Search = 'Search',
  TeacherProfile = 'TeacherProfile',
  TeacherOnboarding = 'TeacherOnboarding',
  Auth = 'Auth',
  Chat = 'Chat',
  ChatList = 'ChatList',
  StudentProfile = 'StudentProfile',
}

export interface Review {
  id: number;
  studentName: string;
  rating: number;
  comment: string;
}

// Base User Interface
export interface User {
  id: string; // Changed from number
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

// Student-specific properties
export interface Student extends User {
  role: UserRole.Student;
  gradeLevel: string;
  learningGoals?: string;
}

// Teacher-specific properties
export interface Teacher extends User {
  role: UserRole.Teacher;
  headline: string;
  subjects: string[];
  bio: string;
  rating: number;
  reviews: Review[];
  hourlyRate: number;
  resumeUrl?: string;
  profileViews?: number; // New feature
}

// Chat interfaces
export interface Message {
  id: string; // Changed from number
  conversationId: string; // Changed from number
  senderId: string; // Changed from number
  text: string;
  timestamp: any; // Changed from string
}

export interface Conversation {
  id: string; // Changed from number
  participantIds: string[]; // Changed from number[]
  lastMessageTimestamp: any; // Changed from string
}

// Fix: Add Call and CallState types for the CallUI component.
export enum CallState {
  Outgoing = 'Outgoing',
  Connected = 'Connected',
}

export interface Call {
  participant: User;
  state: CallState;
}
