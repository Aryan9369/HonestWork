
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';

const AddSalary: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const company = id ? storageService.getCompanyById(id) : undefined;

  const [formData, setFormData] = useState({
    role: '',
    yearsOfExperience: 0,
    ctc: '',
    inHand: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!company) return <div>Company not found</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    storageService.addSalary(company.id, {
      id: Math.random().toString(36).substr(2, 9),
      companyId: company.id,
      role: formData.role,
      yearsOfExperience: formData.yearsOfExperience,
      ctc: parseInt(formData.ctc),
      inHand: parseInt(formData.inHand),
      location: formData.location,
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

      <h1 className="text-3xl font-extrabold mb-2">Salary Reality Check</h1>
      <p className="text-gray-500 mb-8">Help uncover the difference between offered CTC and real monthly cash.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Role</label>
          <input required type="text" className="w-full p-4 border border-gray-200 rounded-xl" placeholder="e.g. Product Manager" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Experience (Years)</label>
                <input required type="number" className="w-full p-4 border border-gray-200 rounded-xl" value={formData.yearsOfExperience} onChange={e => setFormData({...formData, yearsOfExperience: parseInt(e.target.value)})} />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                <input required type="text" className="w-full p-4 border border-gray-200 rounded-xl" placeholder="e.g. London" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
        </div>

        <div className="p-6 bg-green-50 rounded-2xl border border-green-100 space-y-6">
            <div>
                <label className="block text-sm font-bold text-green-800 uppercase tracking-wider mb-2">Annual CTC (Cost to Company)</label>
                <input required type="number" className="w-full p-4 border border-white rounded-xl" placeholder="Total package per year" value={formData.ctc} onChange={e => setFormData({...formData, ctc: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-bold text-green-800 uppercase tracking-wider mb-2">Monthly In-Hand (Cash)</label>
                <input required type="number" className="w-full p-4 border border-white rounded-xl" placeholder="What actually hits the bank account" value={formData.inHand} onChange={e => setFormData({...formData, inHand: e.target.value})} />
            </div>
        </div>

        <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all">
            {isSubmitting ? 'Submitting...' : 'Submit Salary'}
        </button>
      </form>
    </div>
  );
};

export default AddSalary;
