import React, { useState, useEffect, useRef } from 'react';
import { Student } from '../types';
import { GRADE_LEVELS } from '../constants';

interface StudentProfilePageProps {
  onSave: (profile: Student) => void;
  studentToEdit: Student;
}

const AvatarPlaceholder: React.FC = () => (
    <span className="flex items-center justify-center h-full w-full bg-slate-100 dark:bg-slate-700 rounded-full">
        <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    </span>
);

const StudentProfilePage: React.FC<StudentProfilePageProps> = ({ onSave, studentToEdit }) => {
  const [profile, setProfile] = useState<Student>(studentToEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfile(studentToEdit);
  }, [studentToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setProfile(prev => ({ ...prev, avatarUrl: loadEvent.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };

  const inputClasses = "mt-1 block w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">Your Student Profile</h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8">Keep your information up to date.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div
              className="h-32 w-32 rounded-full ring-4 ring-indigo-200 dark:ring-indigo-500 ring-offset-2 dark:ring-offset-slate-800 overflow-hidden cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar Preview" className="h-full w-full object-cover" /> : <AvatarPlaceholder />}
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              Change Photo
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input type="text" name="name" id="name" value={profile.name} onChange={handleInputChange} className={inputClasses} required />
            </div>
             <div>
              <label htmlFor="gradeLevel" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Current Grade Level</label>
              <select id="gradeLevel" name="gradeLevel" value={profile.gradeLevel} onChange={handleInputChange} className={inputClasses}>
                {GRADE_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>
            <div>
                <label htmlFor="learningGoals" className="block text-sm font-medium text-slate-700 dark:text-slate-300">My Learning Goals</label>
                <textarea name="learningGoals" id="learningGoals" value={profile.learningGoals || ''} onChange={handleInputChange} rows={4} className={inputClasses} placeholder="e.g., Prepare for AP exams, improve my essay writing..."></textarea>
            </div>
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <input type="email" name="email" id="email" value={profile.email} className={`${inputClasses} bg-slate-100 dark:bg-slate-700/50 cursor-not-allowed`} required disabled />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Email cannot be changed.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-md">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfilePage;