import React, { useState, useEffect, useRef } from 'react';
import { User, Page, Message, Conversation } from '../types';
import { onMessagesSnapshot, sendMessage } from '../services/firebase';

interface ChatPageProps {
    conversation: Conversation;
    currentUser: User;
    users: User[];
    onNavigate: (page: Page) => void;
}

const getDefaultAvatar = (id: number | string) => `https://i.pravatar.cc/150?u=${id}`;

const ChatPage: React.FC<ChatPageProps> = ({ conversation, currentUser, users, onNavigate }) => {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const otherParticipantId = conversation.participantIds.find(id => id !== currentUser.id);
    const otherParticipant = users.find(u => u.id === otherParticipantId);

    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = onMessagesSnapshot(conversation.id, (msgs) => {
            setMessages(msgs);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [conversation.id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if(newMessage.trim() === '') return;
        
        await sendMessage(conversation.id, newMessage, currentUser.id);
        setNewMessage('');
    };

    if (!otherParticipant) {
        return <div>Error: Chat partner not found.</div>;
    }

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-12rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
             {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center">
                    <img src={otherParticipant.avatarUrl || getDefaultAvatar(otherParticipant.id)} alt={otherParticipant.name} className="w-12 h-12 rounded-full object-cover"/>
                    <div className="ml-4">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{otherParticipant.name}</h2>
                        <p className="text-sm text-green-500 font-semibold">Online</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => onNavigate(Page.ChatList)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-900">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full"><p>Loading messages...</p></div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg) => {
                           const isCurrentUser = msg.senderId === currentUser.id;
                           const sender = isCurrentUser ? currentUser : otherParticipant;
                           return (
                             <div key={msg.id} className={`flex items-end gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                {!isCurrentUser && <img src={sender.avatarUrl || getDefaultAvatar(sender.id)} alt={sender.name} className="w-8 h-8 rounded-full object-cover"/>}
                                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm ${isCurrentUser ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <span className={`text-xs mt-1 block ${isCurrentUser ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'} text-right`}>{msg.timestamp}</span>
                                </div>
                                {isCurrentUser && <img src={sender.avatarUrl || getDefaultAvatar(sender.id)} alt={sender.name} className="w-8 h-8 rounded-full object-cover"/>}
                            </div>
                           )
                        })}
                        <div ref={chatEndRef} />
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input 
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 block w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-2 text-slate-900 dark:text-slate-100"
                    />
                    <button type="submit" className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors shadow-md transform hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </form>
            </div>
        </div>
      </div>
    );
};

export default ChatPage;
