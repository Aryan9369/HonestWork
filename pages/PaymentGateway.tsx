
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Mentor } from '../types';

const PaymentGateway: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [mentor, setMentor] = useState<Mentor | undefined>(undefined);
    const [session, setSession] = useState<any>(undefined);

    useEffect(() => {
        if(sessionId) {
            const sess = storageService.getChatSession(sessionId);
            if(sess) {
                setSession(sess);
                setMentor(storageService.getMentorById(sess.mentorId));
            } else {
                navigate('/');
            }
        }
    }, [sessionId, navigate]);

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate API call to PG
        setTimeout(() => {
            if(sessionId) {
                storageService.confirmPayment(sessionId);
                navigate(`/chat/${sessionId}`);
            }
        }, 2000);
    };

    if (!mentor || !session) return <div className="p-10 text-center">Loading Payment Details...</div>;

    return (
        <div className="max-w-md mx-auto px-6 py-20">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-indigo-600 p-6 text-white text-center">
                    <h2 className="text-xl font-bold mb-1">Confirm Payment</h2>
                    <p className="text-indigo-200 text-sm">Secure Checkout</p>
                </div>
                
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                        <img src={mentor.avatar} alt={mentor.name} className="w-16 h-16 rounded-full object-cover" />
                        <div>
                            <p className="text-sm text-gray-500">Mentorship Session with</p>
                            <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
                            <p className="text-xs text-indigo-600 font-medium">{mentor.role}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-8">
                        <span className="text-gray-600">Total Amount</span>
                        <span className="text-3xl font-bold text-gray-900">₹{mentor.price}</span>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl mb-8">
                        <p className="text-xs text-yellow-800 text-center">
                            ⚠️ This is a demo. No real money will be deducted. Click Pay to proceed.
                        </p>
                    </div>

                    <button 
                        onClick={handlePayment} 
                        disabled={isProcessing}
                        className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all flex justify-center items-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Processing...
                            </>
                        ) : (
                            `Pay ₹${mentor.price}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentGateway;
