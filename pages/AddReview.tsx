
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Department } from '../types';

const AddReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find Entity Type
  const company = storageService.getCompanyById(id || '');
  const college = storageService.getCollegeById(id || '');
  const school = storageService.getSchoolById(id || '');
  const gov = storageService.getGovOrgById(id || '');
  
  const entity = company || college || school || gov;
  const type = company ? 'company' : college ? 'college' : school ? 'school' : 'gov';

  const [formData, setFormData] = useState({
    rating: 5,
    department: 'Other' as Department,
    title: '',
    pros: '',
    cons: '',
    advice: '',
    email: '',
    isAnonymous: true,
    // Type Specific
    placementRating: 3, messRating: 3, wifiRating: 3, infrastructureRating: 3, strictnessRating: 3,
    teachersRating: 3, safetyRating: 3, sportsRating: 3, parentsInteractionRating: 3,
    jobSecurityRating: 3, workLifeBalanceRating: 3, transparencyRating: 3, benefitsRating: 3
  });

  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'sending' | 'otp_sent' | 'verified'>('idle');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const session = storageService.getUserSession();
    if (session.isVerified && session.verifiedOrgId === id && session.verifiedEmail) {
      setFormData(prev => ({ ...prev, email: session.verifiedEmail!, isVerified: true } as any));
      setVerificationStatus('verified');
    }
  }, [id]);

  if (!entity) return <div>Entity not found.</div>;

  const handleSendCode = async () => {
    // ... (Simplified verification logic for brevity)
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setVerificationStatus('otp_sent');
  };

  const handleVerifyOtp = () => {
      if (otp === generatedOtp) setVerificationStatus('verified');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newReview: any = {
      id: Math.random().toString(36).substr(2, 9),
      companyId: entity.id,
      rating: formData.rating,
      department: formData.department,
      title: formData.title,
      pros: formData.pros,
      cons: formData.cons,
      advice: formData.advice,
      userEmail: formData.email,
      isVerified: verificationStatus === 'verified',
      isAnonymous: formData.isAnonymous,
      createdAt: new Date().toISOString(),
      helpfulVotes: 0
    };

    if (type === 'college') {
        Object.assign(newReview, {
            placementRating: formData.placementRating,
            messRating: formData.messRating,
            wifiRating: formData.wifiRating,
            infrastructureRating: formData.infrastructureRating,
            strictnessRating: formData.strictnessRating
        });
    } else if (type === 'school') {
        Object.assign(newReview, {
            teachersRating: formData.teachersRating,
            safetyRating: formData.safetyRating,
            sportsRating: formData.sportsRating,
            parentsInteractionRating: formData.parentsInteractionRating
        });
    } else if (type === 'gov') {
        Object.assign(newReview, {
            jobSecurityRating: formData.jobSecurityRating,
            workLifeBalanceRating: formData.workLifeBalanceRating,
            transparencyRating: formData.transparencyRating,
            benefitsRating: formData.benefitsRating
        });
    }

    storageService.addReview(entity.id, newReview);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/${type}/${id}`);
    }, 800);
  };

  const renderSliders = (items: {key: string, label: string}[]) => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8">
          {items.map(item => (
              <div key={item.key}>
                  <div className="flex justify-between mb-2">
                      <label className="font-bold text-gray-700">{item.label}</label>
                      <span className="font-bold text-indigo-600">{(formData as any)[item.key]}/5</span>
                  </div>
                  <input type="range" min="1" max="5" value={(formData as any)[item.key]} onChange={(e) => setFormData({...formData, [item.key]: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
              </div>
          ))}
      </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="text-gray-400 mb-8">← Back</button>
      <h1 className="text-4xl font-extrabold mb-8">Review {entity.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Overall Rating</label>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <button key={num} type="button" onClick={() => setFormData({ ...formData, rating: num })} className={`w-12 h-12 rounded-xl font-bold text-lg ${formData.rating === num ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>{num}</button>
            ))}
          </div>
        </div>

        {/* School Specific: Role Selection */}
        {type === 'school' && (
            <div>
                 <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">I am a...</label>
                 <div className="flex gap-4">
                     {['Student', 'Parent', 'Teaching', 'Other'].map(role => (
                         <button 
                            key={role} 
                            type="button" 
                            onClick={() => setFormData({...formData, department: role as any})}
                            className={`px-6 py-3 rounded-xl font-bold border-2 ${formData.department === role ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-500'}`}
                        >
                            {role === 'Teaching' ? 'Teacher' : role}
                        </button>
                     ))}
                 </div>
            </div>
        )}

        {type === 'college' && renderSliders([
            {key: 'placementRating', label: 'Placements'}, {key: 'messRating', label: 'Mess Food'}, {key: 'wifiRating', label: 'Wi-Fi'}, {key: 'infrastructureRating', label: 'Infrastructure'}, {key: 'strictnessRating', label: 'Strictness'}
        ])}

        {type === 'school' && renderSliders([
            {key: 'teachersRating', label: 'Teachers'}, {key: 'safetyRating', label: 'Safety'}, {key: 'sportsRating', label: 'Sports'}, {key: 'parentsInteractionRating', label: 'Parent Interaction'}
        ])}

        {type === 'gov' && renderSliders([
            {key: 'jobSecurityRating', label: 'Job Security'}, {key: 'workLifeBalanceRating', label: 'Work Life Balance'}, {key: 'transparencyRating', label: 'Transparency'}, {key: 'benefitsRating', label: 'Benefits'}
        ])}

        <input required type="text" className="w-full p-4 border rounded-xl" placeholder="Review Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        <textarea required rows={3} className="w-full p-4 border rounded-xl border-green-200 bg-green-50" placeholder="Pros" value={formData.pros} onChange={e => setFormData({...formData, pros: e.target.value})} />
        <textarea required rows={3} className="w-full p-4 border rounded-xl border-red-200 bg-red-50" placeholder="Cons" value={formData.cons} onChange={e => setFormData({...formData, cons: e.target.value})} />

        {/* Simplified Verification UI for brevity */}
        <div className={`p-6 rounded-xl border ${verificationStatus === 'verified' ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
            <label className="block font-bold mb-2">Email Verification (Required for verified badge)</label>
            <div className="flex gap-2">
                <input type="email" disabled={verificationStatus !== 'idle'} className="flex-grow p-3 border rounded-xl" placeholder="Official Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                {verificationStatus === 'idle' && <button type="button" onClick={handleSendCode} className="px-4 bg-indigo-600 text-white rounded-xl">Send Code</button>}
                {verificationStatus === 'otp_sent' && <button type="button" onClick={() => setOtp(generatedOtp || '')} className="px-4 bg-yellow-500 text-white rounded-xl">Demo Fill OTP</button>}
                {verificationStatus === 'otp_sent' && <button type="button" onClick={handleVerifyOtp} className="px-4 bg-indigo-600 text-white rounded-xl">Verify</button>}
            </div>
        </div>

        <button disabled={isSubmitting} type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg">Submit Review</button>
      </form>
    </div>
  );
};

export default AddReview;
