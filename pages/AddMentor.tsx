
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';

const AddMentor: React.FC = () => {
  const { entityId } = useParams<{ entityId: string }>();
  const navigate = useNavigate();

  // Find Entity (Company, College, etc.)
  const company = storageService.getCompanyById(entityId || '');
  const college = storageService.getCollegeById(entityId || '');
  const school = storageService.getSchoolById(entityId || '');
  const gov = storageService.getGovOrgById(entityId || '');
  
  const entity = company || college || school || gov;
  const type = company ? 'company' : college ? 'college' : school ? 'school' : 'gov';

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    price: 49,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifiedUser, setIsVerifiedUser] = useState(false);

  useEffect(() => {
    const session = storageService.getUserSession();
    setIsVerifiedUser(session.isVerified);
    if(session.isVerified && session.verifiedOrgId === entityId) {
        // Pre-fill if we knew their name (we don't store name in session currently, just email)
    }
  }, [entityId]);

  if (!entity) return <div className="p-20 text-center">Entity not found. Please navigate from a specific company/college page.</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newMentor = {
        id: `m-${Math.random().toString(36).substr(2, 9)}`,
        entityId: entity.id,
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        price: Number(formData.price),
        isVerified: isVerifiedUser, // Trust the session status
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
    };

    storageService.addMentor(newMentor);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/${type}/${entityId}`);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-indigo-600 mb-8 flex items-center gap-2">
         <span>←</span> Back to {entity.name}
      </button>

      <div className="mb-8">
          <h1 className="text-3xl font-extrabold mb-2">Become a Mentor</h1>
          <p className="text-gray-500">Share your experience at {entity.name} and earn money guiding others.</p>
      </div>

      {!isVerifiedUser && (
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl mb-8 flex gap-3 items-start">
              <span className="text-xl">⚠️</span>
              <div>
                  <p className="text-sm text-yellow-800 font-bold">You are not verified.</p>
                  <p className="text-xs text-yellow-700 mt-1">
                      You can still register, but you won't get the <span className="font-bold">Verified Badge</span> on your profile. 
                      It's highly recommended to <span onClick={() => navigate('/verification')} className="underline cursor-pointer">verify your email</span> first.
                  </p>
              </div>
          </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
          <input 
            required 
            type="text" 
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            placeholder="e.g. Alex Johnson" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Current Role / Title</label>
          <input 
            required 
            type="text" 
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            placeholder="e.g. Senior Software Engineer or Final Year CSE" 
            value={formData.role} 
            onChange={e => setFormData({...formData, role: e.target.value})} 
          />
        </div>

        <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Short Bio</label>
            <textarea 
                required 
                rows={4}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="How can you help? e.g. 'I can help with resume reviews, mock interviews, and understanding the team culture.'" 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
            />
        </div>

        <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Price per Session (₹)</label>
            <div className="relative">
                <span className="absolute left-4 top-4 text-gray-400">₹</span>
                <input 
                    required 
                    type="number" 
                    min="0"
                    className="w-full pl-8 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} 
                />
            </div>
            <p className="text-xs text-gray-400 mt-2">Set a fair price for a 30-minute chat session.</p>
        </div>

        <button 
            disabled={isSubmitting} 
            type="submit" 
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all mt-4"
        >
            {isSubmitting ? 'Registering...' : 'Register as Mentor'}
        </button>
      </form>
    </div>
  );
};

export default AddMentor;
