import React, { useState, useEffect, useRef } from 'react';
import { Teacher } from '../types';
import { ALL_SUBJECTS } from '../constants';

interface TeacherOnboardingPageProps {
  onSave: (profile: Teacher) => void;
  teacherToEdit: Teacher;
}

const AvatarPlaceholder: React.FC = () => (
    <span className="flex items-center justify-center h-full w-full bg-slate-100 dark:bg-slate-700 rounded-full">
        <svg className="w-16 h-16 text-slate-400 dark:text-slate-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    </span>
);

const TeacherOnboardingPage: React.FC<TeacherOnboardingPageProps> = ({ onSave, teacherToEdit }) => {
  const [profile, setProfile] = useState<Teacher>(teacherToEdit);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setProfile(teacherToEdit);
  }, [teacherToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: name === 'hourlyRate' ? Number(value) : value }));
  };

  const handleSubjectChange = (subject: string) => {
    setProfile(prev => ({ ...prev, subjects: prev.subjects.includes(subject) ? prev.subjects.filter(s => s !== subject) : [...prev.subjects, subject] }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setProfile(prev => ({...prev, avatarUrl: loadEvent.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfile(prev => ({...prev, resumeUrl: file.name }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Teacher Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Keep your profile updated to attract more students.</p>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
             <section className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Profile Statistics</h2>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Profile Views</span>
                        <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{profile.profileViews || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Search Appearances</span>
                        <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{(profile.profileViews || 0) * 3}</span>
                    </div>
                </div>
            </section>
            <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Profile Picture</h2>
                <div className="flex flex-col items-center gap-4">
                     <div className="h-40 w-40 rounded-full ring-4 ring-indigo-200 dark:ring-indigo-500 ring-offset-2 dark:ring-offset-slate-800 overflow-hidden">
                        {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar Preview" className="h-full w-full object-cover" /> : <AvatarPlaceholder />}
                     </div>
                     <input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarUpload} className="hidden" />
                     <button type="button" onClick={() => avatarInputRef.current?.click()} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Upload Photo</button>
                </div>
            </section>
          </div>

          <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Your Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                        <input type="text" name="name" id="name" value={profile.name} onChange={handleInputChange} className="mt-1 block w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 text-slate-900 dark:text-slate-100" required />
                    </div>
                    <div>
                        <label htmlFor="headline" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Profile Headline</label>
                        <input type="text" name="headline" id="headline" value={profile.headline} onChange={handleInputChange} placeholder="e.g. PhD in Physics" className="mt-1 block w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 text-slate-900 dark:text-slate-100" required />
                    </div>
                     <div>
                        <label htmlFor="hourlyRate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Hourly Rate ($)</label>
                        <input type="number" name="hourlyRate" id="hourlyRate" value={profile.hourlyRate} onChange={handleInputChange} min="10" className="mt-1 block w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 text-slate-900 dark:text-slate-100" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Resume/CV</label>
                        <div className="mt-1 flex items-center gap-4">
                             <label htmlFor="resume-upload" className="cursor-pointer bg-white dark:bg-slate-700 py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600">
                                 <span>{profile.resumeUrl ? "Change file" : "Upload file"}</span>
                                 <input id="resume-upload" name="resume-upload" type="file" onChange={handleResumeUpload} className="sr-only" accept=".pdf,.doc,.docx" />
                             </label>
                             {profile.resumeUrl && <p className="text-sm text-green-600 dark:text-green-400 font-medium truncate">{profile.resumeUrl}</p>}
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Your Expertise</h2>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select your subjects</label>
                    <div className="flex flex-wrap gap-2">
                        {ALL_SUBJECTS.map(subject => (
                            <button type="button" key={subject} onClick={() => handleSubjectChange(subject)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${profile.subjects.includes(subject) ? 'bg-indigo-600 text-white shadow' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>{subject}</button>
                        ))}
                    </div>
                </div>
            </section>
             <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">About Me</h2>
                <textarea name="bio" id="bio" value={profile.bio} onChange={handleInputChange} rows={6} className="block w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 text-slate-900 dark:text-slate-100" placeholder="Write a warm, engaging, and professional 'About Me' section..." required></textarea>
            </section>
             <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
              <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-md">Save Profile</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherOnboardingPage;