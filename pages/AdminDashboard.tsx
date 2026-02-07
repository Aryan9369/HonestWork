
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Mentor, ChatSession } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mentors' | 'sessions'>('mentors');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = () => {
      setMentors(storageService.getAllMentors());
      setSessions(storageService.getAllChatSessions());
    };
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const getEntityName = (entityId: string) => {
    const c = storageService.getCompanyById(entityId);
    if (c) return c.name;
    const cl = storageService.getCollegeById(entityId);
    if (cl) return cl.name;
    const s = storageService.getSchoolById(entityId);
    if (s) return s.name;
    const g = storageService.getGovOrgById(entityId);
    if (g) return g.name;
    return 'Unknown Entity';
  };

  const getMentorName = (mentorId: string) => {
    const m = mentors.find(m => m.id === mentorId);
    return m ? m.name : 'Unknown Mentor';
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage mentorships and sessions</p>
        </div>
        <button onClick={() => navigate('/')} className="text-sm font-bold text-gray-500 hover:text-gray-900">Back to Home</button>
      </div>

      <div className="flex border-b border-gray-200 mb-8">
        <button 
            onClick={() => setActiveTab('mentors')} 
            className={`px-6 py-3 font-bold border-b-2 text-sm transition-colors ${activeTab === 'mentors' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
            All Mentors ({mentors.length})
        </button>
        <button 
            onClick={() => setActiveTab('sessions')} 
            className={`px-6 py-3 font-bold border-b-2 text-sm transition-colors ${activeTab === 'sessions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
            Chat Sessions ({sessions.length})
        </button>
      </div>

      {activeTab === 'mentors' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Mentor</th>
                            <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Organization</th>
                            <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {mentors.map(m => (
                            <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-6 flex items-center gap-4">
                                    <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                                    <span className="font-bold text-gray-900">{m.name}</span>
                                </td>
                                <td className="p-6 text-sm text-gray-600">{m.role}</td>
                                <td className="p-6 text-sm text-gray-600">{getEntityName(m.entityId)}</td>
                                <td className="p-6 font-mono font-bold text-gray-900">₹{m.price}</td>
                                <td className="p-6">
                                    {m.isVerified ? (
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase">Verified</span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full uppercase">Unverified</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {mentors.length === 0 && <div className="p-10 text-center text-gray-400">No mentors registered yet.</div>}
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">User Email</th>
                            <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Mentor</th>
                            <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Paid</th>
                            <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {sessions.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-6 text-sm text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                                <td className="p-6 text-sm font-medium text-gray-900">{s.userEmail}</td>
                                <td className="p-6 text-sm text-gray-600">{getMentorName(s.mentorId)}</td>
                                <td className="p-6 font-mono text-gray-900">₹{s.pricePaid}</td>
                                <td className="p-6">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                                        s.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                        s.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {s.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-6">
                                    {s.status !== 'PENDING_PAYMENT' && (
                                        <Link to={`/chat/${s.id}`} className="text-indigo-600 font-bold hover:underline text-sm">View Chat</Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {sessions.length === 0 && <div className="p-10 text-center text-gray-400">No chat sessions yet.</div>}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
