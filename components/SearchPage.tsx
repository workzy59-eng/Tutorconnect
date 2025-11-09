import React, { useState, useMemo } from 'react';
import { Teacher, Student } from '../types';
import { ALL_SUBJECTS } from '../constants';
import TeacherCard from './TeacherCard';

interface SearchPageProps {
  teachers: Teacher[];
  onSelectTeacher: (id: string) => void;
  currentUser: Student;
}

const SearchPage: React.FC<SearchPageProps> = ({ teachers, onSelectTeacher, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = teacher.name.toLowerCase().includes(searchLower);
      const headlineMatch = teacher.headline.toLowerCase().includes(searchLower);
      const subjectInProfile = teacher.subjects.some(s => s.toLowerCase().includes(searchLower));
      const searchMatch = nameMatch || headlineMatch || subjectInProfile;

      const subjectMatch = subjectFilter ? teacher.subjects.includes(subjectFilter) : true;
      
      return searchMatch && subjectMatch;
    });
  }, [teachers, searchTerm, subjectFilter]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-1/4 xl:w-1/5">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md sticky top-24">
            <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">Filters</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Keyword Search</label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Physics, Evelyn"
                  className="mt-1 block w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                <select
                  id="subject"
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="mt-1 block w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 text-slate-900 dark:text-slate-100"
                >
                  <option value="">All Subjects</option>
                  {ALL_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="lg:w-3/4 xl:w-4/5">
          <div className="mb-6 bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome back, {currentUser.name}!</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
               {filteredTeachers.length} {filteredTeachers.length === 1 ? 'teacher' : 'teachers'} found. Ready to start learning?
            </p>
          </div>
          {filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTeachers.map(teacher => (
                <TeacherCard key={teacher.id} teacher={teacher} onSelect={onSelectTeacher} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold text-slate-800 dark:text-white">No Teachers Found</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-2">Try adjusting your search filters to find the perfect match.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
