import React, { useState, useEffect } from 'react';
import { Conversation, User, Page } from '../types';
import { getConversationsForUser } from '../services/firebase';

interface ChatListPageProps {
    currentUser: User;
    users: User[];
    onSelectConversation: (conversation: Conversation) => void;
}

const getDefaultAvatar = (id: number | string) => `https://i.pravatar.cc/150?u=${id}`;

const ChatListPage: React.FC<ChatListPageProps> = ({ currentUser, users, onSelectConversation }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            setIsLoading(true);
            const convos = await getConversationsForUser(currentUser.id);
            // Fix: The conversation ID is a string and cannot be used for arithmetic sort.
            // The `getConversationsForUser` function already sorts conversations by last message timestamp.
            setConversations(convos);
            setIsLoading(false);
        };
        fetchConversations();
    }, [currentUser.id]);

    const getParticipant = (convo: Conversation) => {
        const otherId = convo.participantIds.find(id => id !== currentUser.id);
        return users.find(u => u.id === otherId);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Your Messages</h1>
                    {isLoading ? (
                        <p className="text-slate-500 dark:text-slate-400">Loading conversations...</p>
                    ) : conversations.length > 0 ? (
                        <div className="space-y-4">
                            {conversations.map(convo => {
                                const participant = getParticipant(convo);
                                if (!participant) return null;
                                return (
                                    <div
                                        key={convo.id}
                                        onClick={() => onSelectConversation(convo)}
                                        className="flex items-center p-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                                    >
                                        <img
                                            src={participant.avatarUrl || getDefaultAvatar(participant.id)}
                                            alt={participant.name}
                                            className="h-14 w-14 rounded-full object-cover"
                                        />
                                        <div className="ml-4 flex-grow">
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{participant.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Click to view messages...</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">{convo.lastMessageTimestamp}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-10">
                            You have no messages yet. Start a conversation from a teacher's profile.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatListPage;
