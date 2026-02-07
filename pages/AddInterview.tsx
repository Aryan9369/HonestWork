
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';

const AddInterview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const company = id ? storageService.getCompanyById(id) : undefined;

  const [formData, setFormData] = useState({
    role: '',
    experience: 'Neutral',
    difficulty: 3,
    wasGhosted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!company) return <div>Company not found</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    storageService.addInterview(company.id, {
      id: Math.random().toString(36).substr(2, 9),
      companyId: company.id,
      role: formData.role,
      experience: formData.experience as any,
      difficulty: formData.difficulty,
      wasGhosted: formData.wasGhosted,
      createdAt: new Date().toISOString()
    });

    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/company/${id}`);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-indigo-600 mb-8 flex items-center gap-2">
         <span>←</span> Back to {company.name}
      </button>

      <h1 className="text-3xl font-extrabold mb-8">Add Interview Experience</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Role Applied For</label>
          <input required type="text" className="w-full p-4 border border-gray-200 rounded-xl" placeholder="e.g. Senior Frontend Engineer" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
        </div>

        <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Did they ghost you?</label>
            <div className="flex gap-4">
                <button type="button" onClick={() => setFormData({...formData, wasGhosted: false})} className={`flex-1 py-4 rounded-xl border-2 font-bold ${!formData.wasGhosted ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}>
                    No, I got a response
                </button>
                <button type="button" onClick={() => setFormData({...formData, wasGhosted: true})} className={`flex-1 py-4 rounded-xl border-2 font-bold ${formData.wasGhosted ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 text-gray-400'}`}>
                    Yes, Ghosted 👻
                </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Ghosting means the recruiter stopped responding abruptly after an interview or screening without a final decision.</p>
        </div>

        <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Interview Difficulty (1-5)</label>
            <input type="range" min="1" max="5" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
            <div className="flex justify-between text-xs text-gray-400">
                <span>Easy</span>
                <span>Average</span>
                <span>Very Hard</span>
            </div>
        </div>

        <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
            {isSubmitting ? 'Submitting...' : 'Submit Interview'}
        </button>
      </form>
    </div>
  );
};

export default AddInterview;
