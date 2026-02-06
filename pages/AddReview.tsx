
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_COMPANIES } from '../constants';

const AddReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const company = MOCK_COMPANIES.find(c => c.id === id);

  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    pros: '',
    cons: '',
    advice: '',
    email: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!company) return <div>Company not found.</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Verification Logic:
    // We check if the email domain matches the company domain.
    const emailDomain = formData.email.split('@')[1];
    const isVerified = emailDomain === company.domain;

    const newReview = {
      id: Math.random().toString(36).substr(2, 9),
      companyId: company.id,
      rating: formData.rating,
      title: formData.title,
      pros: formData.pros,
      cons: formData.cons,
      advice: formData.advice,
      userEmail: formData.email,
      isVerified: isVerified,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Save to simulated database (localStorage)
    const stored = localStorage.getItem(`reviews_${id}`);
    const reviews = stored ? JSON.parse(stored) : [];
    localStorage.setItem(`reviews_${id}`, JSON.stringify([...reviews, newReview]));

    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/company/${id}`);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link to={`/company/${id}`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-600 mb-8 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to {company.name}
      </Link>

      <h1 className="text-4xl font-extrabold tracking-tight mb-2">Write a review for {company.name}</h1>
      <p className="text-gray-500 mb-10">Help others make informed career decisions. Your anonymity is respected.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Overall Rating</label>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setFormData({ ...formData, rating: num })}
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${
                  formData.rating === num 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Review Title</label>
          <input
            required
            type="text"
            className="w-full p-4 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-200 transition-all"
            placeholder="Summarize your experience"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-green-600 mb-3">Pros</label>
            <textarea
              required
              rows={4}
              className="w-full p-4 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-50/50 focus:border-green-200 transition-all"
              placeholder="What did you love?"
              value={formData.pros}
              onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-red-600 mb-3">Cons</label>
            <textarea
              required
              rows={4}
              className="w-full p-4 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-50/50 focus:border-red-200 transition-all"
              placeholder="What could be better?"
              value={formData.cons}
              onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Advice to Management (Optional)</label>
          <textarea
            rows={3}
            className="w-full p-4 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-200 transition-all"
            placeholder="Share direct feedback"
            value={formData.advice}
            onChange={(e) => setFormData({ ...formData, advice: e.target.value })}
          />
        </div>

        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
          <label className="block text-sm font-bold text-gray-600 mb-2">Work Email Address</label>
          <p className="text-xs text-gray-400 mb-4">Provide your work email to get a "Verified Employee" badge. We will never show your email to anyone.</p>
          <input
            required
            type="email"
            className="w-full p-4 border border-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-200 transition-all"
            placeholder={`e.g. name@${company.domain}`}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 disabled:bg-gray-300 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default AddReview;
