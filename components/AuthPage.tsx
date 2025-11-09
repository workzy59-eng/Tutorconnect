import React, { useState } from 'react';
import { UserRole } from '../types';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../services/firebase';

interface AuthPageProps {
    onAuthSuccess: () => void;
}

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.81C34.553 5.917 29.613 3.5 24 3.5C11.7 3.5 1.5 13.7 1.5 26S11.7 48.5 24 48.5c12.187 0 21.82-9.25 21.82-21.82c0-1.423-.153-2.822-.409-4.175z"></path><path fill="#FF3D00" d="M6.306 14.691c2.258-3.447 6.044-5.895 10.398-6.393V3.5h-1.077C13.434 3.5 8.416 6.01 4.793 10.318l3.393 4.373z"></path><path fill="#4CAF50" d="M24 48.5c5.337 0 9.92-1.928 13.188-5.075l-4.244-3.32c-1.895 1.228-4.29 1.95-6.944 1.95c-5.232 0-9.673-3.383-11.233-7.96l-4.17 3.193C8.02 44.385 15.39 48.5 24 48.5z"></path><path fill="#1976D2" d="M43.611 20.083H24v8h19.611c.313-1.724.489-3.508.489-5.333c0-1.898-.19-3.75-.523-5.551z"></path></svg>
);

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.Student);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');
        try {
            await signInWithGoogle();
            onAuthSuccess();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (activeTab === 'signin') {
                await signInWithEmail(email, password);
            } else {
                if (!name || !email || !password) {
                    throw new Error('Please fill all fields.');
                }
                await signUpWithEmail({name, email, role, password});
            }
            onAuthSuccess();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const inputClasses = "appearance-none rounded-md relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

    return (
        <div className="flex items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-xl">
                <div>
                     <div className="flex items-center justify-center">
                        <svg className="h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-5.747-8.995l11.494 8.995M6.253 18l11.494-8.995" /></svg>
                        <span className="ml-3 text-3xl font-bold text-slate-800 dark:text-white">TutorConnect</span>
                    </div>
                    <h2 className="mt-6 text-center text-2xl font-extrabold text-slate-900 dark:text-white">
                        {activeTab === 'signin' ? 'Sign in to your account' : 'Create a new account'}
                    </h2>
                </div>

                <div className="flex border-b border-slate-200 dark:border-slate-700">
                    <button onClick={() => setActiveTab('signin')} className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'signin' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>Sign In</button>
                    <button onClick={() => setActiveTab('signup')} className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'signup' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>Sign Up</button>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
                    {activeTab === 'signup' && (
                         <div>
                            <label htmlFor="name" className="sr-only">Full Name</label>
                            <input id="name" name="name" type="text" value={name} onChange={e => setName(e.target.value)} required className={inputClasses} placeholder="Full Name" />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input id="email-address" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required className={inputClasses} placeholder="Email address" />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required className={inputClasses} placeholder="Password" />
                    </div>

                    {activeTab === 'signup' && (
                        <div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">I am a...</span>
                            <div className="mt-2 flex items-center space-x-4">
                               <label className="flex items-center">
                                    <input type="radio" value={UserRole.Student} checked={role === UserRole.Student} onChange={() => setRole(UserRole.Student)} className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500 bg-slate-300"/>
                                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Student</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" value={UserRole.Teacher} checked={role === UserRole.Teacher} onChange={() => setRole(UserRole.Teacher)} className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500 bg-slate-300"/>
                                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Teacher</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <div>
                        <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                            {isLoading ? 'Processing...' : (activeTab === 'signin' ? 'Sign In' : 'Create Account')}
                        </button>
                    </div>
                </form>

                 <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-300 dark:border-slate-700" /></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">Or continue with</span></div>
                </div>

                <div>
                    <button onClick={handleGoogleSignIn} disabled={isLoading} className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800">
                        <GoogleIcon />
                        Sign in with Google
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;
