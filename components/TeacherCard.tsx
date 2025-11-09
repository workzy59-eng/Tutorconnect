import React from 'react';
import { Teacher } from '../types';

interface TeacherCardProps {
  teacher: Teacher;
  onSelect: (id: string) => void;
}

const getDefaultAvatar = (id: string) => `https://i.pravatar.cc/150?u=${id}`;

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onSelect }) => {
  return (
    <div 
      className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-2xl dark:hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col cursor-pointer group"
      onClick={() => onSelect(teacher.id)}
    >
      <div className="relative h-48">
        <img src={teacher.avatarUrl || getDefaultAvatar(teacher.id)} alt={teacher.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute top-0 right-0 m-3 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm px-3 py-1 rounded-full text-2xl font-bold text-slate-800 dark:text-slate-100">
          ${teacher.hourlyRate}<span className="text-sm font-medium text-slate-600 dark:text-slate-300">/hr</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{teacher.name}</h3>
        <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm mt-1">{teacher.headline}</p>
        <div className="flex items-center mt-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < Math.round(teacher.rating)} />)}
          </div>
          <span className="text-slate-600 dark:text-slate-400 text-sm ml-2">{teacher.rating.toFixed(1)} ({teacher.reviews.length} reviews)</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {teacher.subjects.slice(0, 2).map(subject => (
            <span key={subject} className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-full">{subject}</span>
          ))}
          {teacher.subjects.length > 2 && (
             <span className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-full">+{teacher.subjects.length - 2} more</span>
          )}
        </div>
        <div className="mt-auto pt-5">
           <button className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md dark:hover:bg-indigo-500">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
