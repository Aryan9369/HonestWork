
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { ChatMessage, Mentor } from '../types';

const ChatRoom: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [mentor, setMentor] = useState<Mentor | undefined>(undefined);
    const [isSessionActive, setIsSessionActive] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Load & Refresh
    useEffect(() => {
        if (!sessionId) return;
        
        const fetchSessionData = () => {
            const session = storageService.getChatSession(sessionId);
            if (!session) {
                navigate('/');
                return;
            }

            if (session.status === 'PENDING_PAYMENT') {
                navigate(`/payment/${sessionId}`);
                return;
            }

            // Sync active status with storage
            setIsSessionActive(session.status === 'ACTIVE');

            if (!mentor) {
                 const m = storageService.getMentorById(session.mentorId);
                 setMentor(m);
            }

            setMessages(storageService.getChatMessages(sessionId));
        };

        fetchSessionData();
        
        // Listen for updates (received messages or status changes)
        window.addEventListener('chat-update', fetchSessionData);
        window.addEventListener('storage', fetchSessionData);
        
        return () => {
            window.removeEventListener('chat-update', fetchSessionData);
            window.removeEventListener('storage', fetchSessionData);
        };
    }, [sessionId, navigate, mentor]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !sessionId || !isSessionActive) return;

        storageService.addChatMessage(sessionId, 'user', inputText);
        setInputText('');

        // Simulate Mentor Reply after 2 seconds
        if (isSessionActive) {
            setTimeout(() => {
                const currentSession = storageService.getChatSession(sessionId);
                if (currentSession?.status !== 'ACTIVE') return;

                const replies = [
                    "That's a great question! Based on my experience...",
                    "Could you elaborate more on that?",
                    "Yes, absolutely. The interview process usually takes 3 rounds.",
                    "I'd recommend focusing on LeetCode Mediums for that role.",
                    "Let me check my schedule and get back to you properly."
                ];
                const randomReply = replies[Math.floor(Math.random() * replies.length)];
                storageService.addChatMessage(sessionId, 'mentor', randomReply);
            }, 2000);
        }
    };

    if (!mentor) return <div className="p-20 text-center">Loading Chat...</div>;

    return (
        <div className="max-w-3xl mx-auto h-[calc(100vh-80px)] flex flex-col bg-gray-50 md:border-x border-gray-200">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 md:hidden">
                        ←
                    </button>
                    <div className="relative">
                        <img src={mentor.avatar} alt={mentor.name} className={`w-10 h-10 rounded-full object-cover transition-all ${!isSessionActive && 'grayscale opacity-70'}`} />
                        {isSessionActive && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 leading-tight">{mentor.name}</h2>
                        <p className="text-xs text-gray-500">{mentor.role}</p>
                    </div>
                </div>
                
                <button 
                    onClick={() => navigate(-1)}
                    className="text-sm font-bold text-gray-600 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 border border-gray-200 transition-colors"
                >
                    Back
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                        <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div 
                                className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    isUser 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                }`}
                            >
                                {msg.text}
                                <div className={`text-[10px] mt-1 opacity-70 ${isUser ? 'text-indigo-200' : 'text-gray-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {!isSessionActive && (
                    <div className="flex justify-center my-6">
                        <span className="bg-gray-200 text-gray-600 text-xs px-4 py-2 rounded-full font-medium">Chat Session Ended</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
                {isSessionActive ? (
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type your message..." 
                            className="flex-grow p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                        <button 
                            type="submit" 
                            disabled={!inputText.trim()}
                            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-gray-500 text-sm mb-2">This session has ended.</p>
                        <button onClick={() => navigate(-1)} className="text-indigo-600 font-bold hover:underline text-sm">Go back</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatRoom;
