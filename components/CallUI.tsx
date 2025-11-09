import React from 'react';
import { Call, CallState } from '../types';

interface CallUIProps {
    call: Call;
    duration: number;
    onEndCall: () => void;
}

const getDefaultAvatar = (id: number | string) => `https://i.pravatar.cc/150?u=${id}`;

const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

const CallUI: React.FC<CallUIProps> = ({ call, duration, onEndCall }) => {
    const { participant, state } = call;

    const getStatusText = () => {
        switch (state) {
            case CallState.Outgoing:
                return "Calling...";
            case CallState.Connected:
                return formatDuration(duration);
            default:
                return "";
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center animate-fade-in">
            <div className="flex flex-col items-center text-white">
                <img
                    src={participant.avatarUrl || getDefaultAvatar(participant.id)}
                    alt={participant.name}
                    className="w-40 h-40 rounded-full object-cover ring-8 ring-white/20 shadow-2xl"
                />
                <h2 className="text-4xl font-bold mt-8">{participant.name}</h2>
                <p className="text-xl text-slate-300 mt-2 tracking-widest">{getStatusText()}</p>

                <div className="absolute bottom-20">
                    <button
                        onClick={onEndCall}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-5 transition-all transform hover:scale-110 shadow-lg"
                        aria-label="End call"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" style={{ transform: 'rotate(135deg)', transformOrigin: 'center' }}/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallUI;
