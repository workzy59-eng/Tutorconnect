import React from 'react';
import { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactElement; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-xl dark:hover:shadow-indigo-500/20 transition-shadow duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500 text-white">
            {icon}
        </div>
        <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-300">{children}</p>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in">
        {/* Hero Section */}
        <section className="relative bg-white dark:bg-slate-900 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Unlock Your Potential.
                        <span className="block text-indigo-600 dark:text-indigo-400">Connect, Learn, Grow.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300">
                        TutorConnect is the premier platform to find expert teachers for any subject, or to share your knowledge with students around the world.
                    </p>
                    <div className="mt-10 flex justify-center gap-4 flex-wrap">
                        <button onClick={() => onNavigate(Page.Auth)} className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg">
                           Find Your Teacher
                        </button>
                        <button onClick={() => onNavigate(Page.Auth)} className="bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all transform hover:scale-105 shadow-lg ring-1 ring-inset ring-indigo-200 dark:ring-indigo-700">
                           Become a Teacher
                        </button>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why Choose TutorConnect?</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Everything you need for a seamless learning experience.</p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                        title="Expert Search"
                    >
                        Our powerful search and filtering tools help you find the perfect teacher based on subject, price, and rating in seconds.
                    </FeatureCard>
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                        title="Seamless Communication"
                    >
                        Integrated messaging allows you to connect with teachers, ask questions, and schedule sessions with ease.
                    </FeatureCard>
                     <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        title="Verified Tutors"
                    >
                        Every tutor on our platform is vetted for expertise and experience, ensuring you learn from the best.
                    </FeatureCard>
                </div>
            </div>
        </section>
    </div>
  );
};

export default HomePage;
