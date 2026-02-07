
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Company, College, School, GovOrg } from '../types';

const Verification: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [matchedEntity, setMatchedEntity] = useState<Company | College | School | GovOrg | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('processing');
    
    // Simulate network delay
    setTimeout(() => {
        const domain = email.split('@')[1].toLowerCase();

        // 1. Search Companies
        const companies = storageService.getAllCompanies();
        let foundEntity: Company | College | School | GovOrg | undefined = companies.find(c => 
            c.domain.toLowerCase().includes(domain) || domain.includes(c.domain.toLowerCase())
        );
        let roleType = 'Employee';

        // 2. Search Colleges
        if (!foundEntity) {
            const colleges = storageService.getAllColleges();
            foundEntity = colleges.find(c => c.allowedEmailDomains.some(d => domain.includes(d.toLowerCase())));
            roleType = 'Student/Alumni';
        }

        // 3. Search Schools
        if (!foundEntity) {
            const schools = storageService.getAllSchools();
            foundEntity = schools.find(s => s.allowedEmailDomains.some(d => domain.includes(d.toLowerCase())));
            roleType = 'Teacher/Student/Parent';
        }

        // 4. Search Gov Orgs
        if (!foundEntity) {
            const govOrgs = storageService.getAllGovOrgs();
            foundEntity = govOrgs.find(g => g.allowedEmailDomains.some(d => domain.includes(d.toLowerCase())));
            roleType = 'Official';
        }

        if (foundEntity) {
            setMatchedEntity(foundEntity);
            storageService.updateUserSession({ 
                isVerified: true, 
                verifiedEmail: email, 
                verifiedOrgId: foundEntity.id,
                invitesLeft: 5 
            });
            setStatus('success');
            setMessage(`Verified as ${roleType} at ${foundEntity.name}`);
        } else {
            setStatus('error');
            setMessage(`We couldn't find an organization matching @${domain}. Please add it to the platform first.`);
        }
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Get Verified</h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Unlock full access to reviews, salaries, and mentorship. We support employees, college students, school teachers, parents, students, and government officials.
            </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl max-w-xl mx-auto">
            {status === 'success' ? (
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Verification Successful!</h2>
                        <p className="text-green-600 font-medium mt-2">{message}</p>
                    </div>
                    <div className="pt-4">
                        <button onClick={() => navigate(-1)} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors">
                            Continue to Platform
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleVerify} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Work or Institute Email</label>
                        <input 
                            type="email" 
                            required
                            placeholder="you@company.com or you@college.edu" 
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                        />
                        <p className="text-xs text-gray-400 mt-2">We send a one-time magic link. No password required.</p>
                    </div>

                    {status === 'error' && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                            {message} 
                            {message.includes('add it') && <Link to="/add-new" className="underline ml-1 font-bold">Add Organization</Link>}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={status === 'processing'}
                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
                    >
                        {status === 'processing' ? 'Verifying Domain...' : 'Verify Identity'}
                    </button>
                </form>
            )}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="text-2xl mb-2">💼</div>
                <div className="font-bold text-gray-900">Employees</div>
                <div className="text-xs text-gray-500">MNCs & Startups</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="text-2xl mb-2">🎓</div>
                <div className="font-bold text-gray-900">Students</div>
                <div className="text-xs text-gray-500">Colleges & Universities</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="text-2xl mb-2">🏫</div>
                <div className="font-bold text-gray-900">Parents, Teachers & Students</div>
                <div className="text-xs text-gray-500">K-12 Schools</div>
            </div>
             <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="text-2xl mb-2">🏛️</div>
                <div className="font-bold text-gray-900">Officials</div>
                <div className="text-xs text-gray-500">Govt & PSUs</div>
            </div>
        </div>
    </div>
  );
};

export default Verification;
