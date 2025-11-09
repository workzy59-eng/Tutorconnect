import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole, Page } from '../types';
import { DEFAULT_AVATAR_URL } from '../constants';

interface HeaderProps {
  currentUser: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onNavigate, onLogout, theme, toggleTheme }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileNavigation = () => {
    if (!currentUser) return;
    const page = currentUser.role === UserRole.Teacher ? Page.TeacherOnboarding : Page.StudentProfile;
    onNavigate(page);
    setDropdownOpen(false);
  }

  const handleHomeNavigation = () => {
    const homePage = currentUser && currentUser.role === UserRole.Student ? Page.Search : (currentUser ? Page.TeacherOnboarding : Page.Home);
    onNavigate(homePage);
  }

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={handleHomeNavigation}>
            <svg className="h-9 w-9 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-5.747-8.995l11.494 8.995M6.253 18l11.494-8.995" />
            </svg>
            <span className="ml-2 text-2xl font-bold text-slate-800 dark:text-white">TutorConnect</span>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors">
              {theme === 'light' ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> : 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              }
            </button>
            {currentUser ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button onClick={() => onNavigate(Page.ChatList)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </button>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 focus:outline-none">
                    <img src={currentUser.avatarUrl || DEFAULT_AVATAR_URL} alt="user avatar" className="h-10 w-10 rounded-full ring-2 ring-offset-2 ring-indigo-400" />
                    <span className="hidden sm:inline font-semibold text-slate-700 dark:text-slate-200">{currentUser.name}</span>
                    <svg className={`w-5 h-5 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-xl z-50 py-1 ring-1 ring-black ring-opacity-5 dark:ring-white/10">
                      <a href="#" onClick={(e) => {e.preventDefault(); handleProfileNavigation()}} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">My Profile</a>
                      <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                      <a href="#" onClick={(e) => {e.preventDefault(); onLogout()}} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Logout</a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
               <div className="flex items-center space-x-2">
                  <button onClick={() => onNavigate(Page.Auth)} className="font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-4 py-2 rounded-lg transition-colors">
                    Log In
                  </button>
                  <button onClick={() => onNavigate(Page.Auth)} className="font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105">
                    Sign Up
                  </button>
               </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
