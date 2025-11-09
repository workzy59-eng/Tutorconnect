import React from 'react';
import { Teacher, Page, User, UserRole } from '../types';

interface TeacherProfilePageProps {
  teacher: Teacher;
  onNavigate: (page: Page) => void;
  onStartChat: (teacherId: string) => void;
  currentUser: User | null;
}

const getDefaultAvatar = (id: string) => `https://i.pravatar.cc/150?u=${id}`;

const StarIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className = 'w-5 h-5' }) => (
    <svg className={`${className} ${filled ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


const TeacherProfilePage: React.FC<TeacherProfilePageProps> = ({ teacher, onNavigate, onStartChat, currentUser }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Left Side: Profile & CTA */}
          <div className="md:w-1/3 p-8 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
              <img className="rounded-full h-40 w-40 object-cover ring-4 ring-indigo-300 dark:ring-indigo-500 shadow-md" src={teacher.avatarUrl || getDefaultAvatar(teacher.id)} alt={teacher.name} />
              <h1 className="text-3xl font-bold mt-4 text-slate-900 dark:text-white">{teacher.name}</h1>
              <p className="text-md text-indigo-600 dark:text-indigo-400 font-semibold mt-1">{teacher.headline}</p>
              <div className="flex items-center mt-3">
                  <div className="flex items-center">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < Math.round(teacher.rating)} />)}
                  </div>
                  <span className="text-slate-600 dark:text-slate-400 text-sm ml-2">{teacher.rating.toFixed(1)} ({teacher.reviews.length} reviews)</span>
              </div>
              <div className="mt-6 text-4xl font-extrabold text-slate-800 dark:text-slate-100">
                  ${teacher.hourlyRate}<span className="text-lg font-normal text-slate-500 dark:text-slate-400">/hr</span>
              </div>
              {currentUser && currentUser.role === UserRole.Student && (
                <button 
                  onClick={() => onStartChat(teacher.id)}
                  className="mt-6 w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Start Chat
                </button>
              )}
              <button onClick={() => onNavigate(Page.Search)} className="mt-4 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  &larr; Back to search
              </button>
          </div>

          {/* Right Side: Details & Reviews */}
          <div className="md:w-2/3 p-8">
              <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b-2 border-slate-200 dark:border-slate-700 pb-2">About Me</h2>
                  <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{teacher.bio || "No biography provided."}</p>
              </div>
               <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Subjects</h3>
                  <div className="mt-3 flex flex-wrap gap-3">
                      {teacher.subjects.map(subject => (
                          <span key={subject} className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 text-sm font-semibold px-3 py-1.5 rounded-full">{subject}</span>
                      ))}
                  </div>
              </div>

              <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b-2 border-slate-200 dark:border-slate-700 pb-2">Student Reviews</h2>
                  {teacher.reviews.length > 0 ? (
                    <div className="mt-4 space-y-6">
                        {teacher.reviews.map(review => (
                            <div key={review.id} className="border-l-4 border-indigo-200 dark:border-indigo-700 pl-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < review.rating} className="w-4 h-4"/>)}
                                    <span className="ml-3 font-bold text-slate-800 dark:text-slate-200">{review.studentName}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 mt-2 italic">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-slate-500 dark:text-slate-400">No reviews yet.</p>
                  )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;