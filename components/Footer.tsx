import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center">
               <svg className="h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-5.747-8.995l11.494 8.995M6.253 18l11.494-8.995" />
              </svg>
              <span className="ml-2 text-xl font-bold text-slate-800 dark:text-white">TutorConnect</span>
            </div>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm">Connecting students and teachers worldwide for a better learning experience.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase">Solutions</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-indigo-500">Find a Tutor</a></li>
              <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-indigo-500">Become a Tutor</a></li>
              <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-indigo-500">Subjects</a></li>
            </ul>
          </div>
           <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-indigo-500">Help Center</a></li>
              <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-indigo-500">Contact Us</a></li>
              <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-indigo-500">Privacy Policy</a></li>
            </ul>
          </div>
           <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-indigo-500">About</a></li>
              <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-indigo-500">Blog</a></li>
              <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-indigo-500">Careers</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">&copy; {new Date().getFullYear()} TutorConnect. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
             {/* Add social icons here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;