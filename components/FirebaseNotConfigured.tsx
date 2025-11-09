import React from 'react';

const FirebaseNotConfigured: React.FC = () => (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-8 max-w-2xl w-full text-center border-4 border-red-500">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">Firebase Not Configured</h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                It looks like your Firebase project credentials are still set to the placeholder values. To run this application, you need to set up a Firebase project and add your configuration details.
            </p>
            <div className="mt-6 text-left bg-slate-100 dark:bg-slate-900 p-4 rounded-md font-mono text-sm text-slate-700 dark:text-slate-200 overflow-x-auto">
                <p className="font-bold mb-2">Steps to fix:</p>
                <p>1. Go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">Firebase project console</a>.</p>
                <p>2. Navigate to Project Settings <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block align-middle" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> &gt; General.</p>
                <p>3. In the "Your apps" card, find your web app and its configuration snippet.</p>
                <p>4. Copy the config object and paste it into the <code className="bg-slate-200 dark:bg-slate-700 p-1 rounded">services/firebase.ts</code> file, replacing the placeholder values.</p>
            </div>
            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                After updating the configuration, the application should connect to Firebase automatically.
            </p>
        </div>
    </div>
);

export default FirebaseNotConfigured;
