
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_COMPANIES, INITIAL_REVIEWS } from '../constants';
import { Review } from '../types';
import StarRating from '../components/StarRating';
import { getCompanyReviewSummary } from '../services/geminiService';

const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const company = MOCK_COMPANIES.find(c => c.id === id);

  useEffect(() => {
    // Load reviews from "db"
    const stored = localStorage.getItem(`reviews_${id}`);
    const localReviews = stored ? JSON.parse(stored) : [];
    const initial = INITIAL_REVIEWS.filter(r => r.companyId === id);
    setReviews([...initial, ...localReviews]);
  }, [id]);

  useEffect(() => {
    if (company && reviews.length > 0) {
      setIsSummaryLoading(true);
      getCompanyReviewSummary(company.name, reviews).then(summary => {
        setAiSummary(summary);
        setIsSummaryLoading(false);
      });
    }
  }, [company, reviews]);

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      avg: total / reviews.length,
      count: reviews.length
    };
  }, [reviews]);

  if (!company) return <div className="p-20 text-center">Company not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-16">
        <img src={company.logo} alt={company.name} className="w-24 h-24 md:w-32 md:h-32 rounded-3xl shadow-lg object-cover" />
        <div className="flex-grow">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-extrabold tracking-tight">{company.name}</h1>
            <a href={`https://${company.domain}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
          <p className="text-lg text-gray-500 font-light mb-4">{company.description}</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <StarRating rating={stats.avg} size="md" />
              <span className="font-bold text-lg">{stats.avg.toFixed(1)}</span>
            </div>
            <div className="text-gray-400 font-medium">
              {stats.count} {stats.count === 1 ? 'Review' : 'Reviews'}
            </div>
          </div>
        </div>
        <Link
          to={`/company/${id}/review`}
          className="w-full md:w-auto text-center px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          Add a Review
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold mb-6">Recent Reviews</h2>
          {reviews.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-gray-100 rounded-3xl text-center">
              <p className="text-gray-400">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(review => (
              <div key={review.id} className="p-8 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{review.title}</h3>
                    <div className="flex items-center gap-3">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                      {review.isVerified && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          Verified Employee
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-2">Pros</h4>
                    <p className="text-gray-600 leading-relaxed">{review.pros}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-2">Cons</h4>
                    <p className="text-gray-600 leading-relaxed">{review.cons}</p>
                  </div>
                  {review.advice && (
                    <div className="pt-4 border-t border-gray-50">
                      <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Advice to Management</h4>
                      <p className="text-gray-500 italic leading-relaxed">"{review.advice}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="font-bold text-indigo-900">AI Insight Summary</h3>
            </div>
            {isSummaryLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-indigo-200 rounded w-full"></div>
                <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
              </div>
            ) : (
              <p className="text-indigo-800/80 text-sm leading-relaxed">
                {aiSummary}
              </p>
            )}
          </div>

          <div className="p-8 bg-white border border-gray-100 rounded-3xl">
            <h3 className="font-bold mb-4">Trust & Verification</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Reviews with the <span className="text-green-600 font-bold">Verified</span> badge come from employees who authenticated using a corporate email address matching the company domain.
            </p>
            <div className="h-[1px] bg-gray-50 my-4" />
            <p className="text-xs text-gray-400 italic">
              * Verification logic: Your email domain (e.g., user@stripe.com) must match the company's website domain (stripe.com).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
