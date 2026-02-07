
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Review, Question, Mentor } from '../types';
import StarRating from '../components/StarRating';
import { getCompanyReviewSummary } from '../services/geminiService';
import { storageService } from '../services/storageService';

const CollegeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'qa' | 'mentors'>('overview');
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');

  const [reviews, setReviews] = useState<Review[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState<{qid: string, text: string} | null>(null);

  const college = id ? storageService.getCollegeById(id) : undefined;

  const loadAllData = () => {
    if (id) {
      setReviews(storageService.getReviewsForCompany(id)); // Reusing review storage
      setQuestions(storageService.getQuestionsForCompany(id)); // Reusing Q&A storage
      setMentors(storageService.getMentorsForEntity(id));
    }
  };

  useEffect(() => {
    loadAllData();
    window.addEventListener('storage', loadAllData);
    return () => window.removeEventListener('storage', loadAllData);
  }, [id]);

  useEffect(() => {
    if (college && reviews.length > 0) {
      setIsSummaryLoading(true);
      getCompanyReviewSummary(college.name, reviews).then(summary => {
        setAiSummary(summary);
        setIsSummaryLoading(false);
      });
    }
  }, [college, reviews.length]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return total / reviews.length;
  }, [reviews]);

  // --- Sorting Logic ---
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    if (sortBy === 'recent') {
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'helpful') {
        return sorted.sort((a, b) => (b.helpfulVotes || 0) - (a.helpfulVotes || 0));
    } else if (sortBy === 'rating') {
        return sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }, [reviews, sortBy]);

  const handleUpvote = (reviewId: string) => {
    storageService.upvoteReview(reviewId);
  };

  // Specific College Stats Calculation
  const collegeStats = useMemo(() => {
      if (reviews.length === 0) return null;
      const sums = reviews.reduce((acc, r) => ({
          mess: acc.mess + (r.messRating || 0),
          wifi: acc.wifi + (r.wifiRating || 0),
          infra: acc.infra + (r.infrastructureRating || 0),
          placement: acc.placement + (r.placementRating || 0),
          strictness: acc.strictness + (r.strictnessRating || 0),
          count: acc.count + 1
      }), { mess: 0, wifi: 0, infra: 0, placement: 0, strictness: 0, count: 0 });

      return {
          mess: sums.count ? (sums.mess / sums.count).toFixed(1) : 0,
          wifi: sums.count ? (sums.wifi / sums.count).toFixed(1) : 0,
          infra: sums.count ? (sums.infra / sums.count).toFixed(1) : 0,
          placement: sums.count ? (sums.placement / sums.count).toFixed(1) : 0,
          strictness: sums.count ? (sums.strictness / sums.count).toFixed(1) : 0
      };
  }, [reviews]);

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim() && id) {
      storageService.addQuestion(id, newQuestion);
      setNewQuestion('');
    }
  };

  const handleAnswerSubmit = (qid: string, isVerified: boolean) => {
    if (newAnswer && newAnswer.qid === qid && newAnswer.text.trim() && id) {
      storageService.addAnswer(id, qid, newAnswer.text, isVerified);
      setNewAnswer(null);
    }
  };

  const handleBookMentor = (mentorId: string, price: number) => {
      const userSession = storageService.getUserSession();
      const userEmail = userSession.verifiedEmail || "guest_student@example.com";
      const sessionId = storageService.createChatSession(mentorId, userEmail, price);
      navigate(`/payment/${sessionId}`);
  };

  if (!college) return <div className="p-20 text-center">College not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <button 
        onClick={() => navigate('/')} 
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-600 mb-8 transition-colors group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to search
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
        <img src={college.logo} alt={college.name} className="w-24 h-24 md:w-32 md:h-32 rounded-3xl shadow-lg object-cover" />
        <div className="flex-grow">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">{college.name}</h1>
          <p className="text-lg text-gray-500 font-light mb-4">{college.description}</p>
          <div className="text-sm text-gray-400 mb-4">{college.city}, {college.state}</div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <StarRating rating={avgRating} size="md" />
                <span className="font-bold text-2xl text-gray-800">{avgRating.toFixed(1)}</span>
             </div>
             <span className="text-sm text-gray-400">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-100 mb-8 overflow-x-auto">
        <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Overview & Reviews</button>
        <button onClick={() => setActiveTab('qa')} className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'qa' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Ask a Student</button>
        <button onClick={() => setActiveTab('mentors')} className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'mentors' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Mentorship <span className="ml-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">NEW</span></button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Detailed Stats */}
            {collegeStats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { l: 'Placement', v: collegeStats.placement },
                        { l: 'Mess Food', v: collegeStats.mess },
                        { l: 'Wi-Fi', v: collegeStats.wifi },
                        { l: 'Infrastructure', v: collegeStats.infra },
                        { l: 'Strictness', v: collegeStats.strictness, reverse: true }, // Higher strictness might be red
                    ].map(s => (
                        <div key={s.l} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                            <div className="text-xs text-gray-400 font-bold uppercase mb-1">{s.l}</div>
                            <div className={`text-xl font-bold ${s.reverse ? (Number(s.v) > 3 ? 'text-red-500' : 'text-green-600') : (Number(s.v) > 3 ? 'text-green-600' : 'text-orange-500')}`}>
                                {s.v}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold">Reviews</h2>
               <div className="flex gap-4">
                  <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 border rounded-xl text-sm font-medium text-gray-600 focus:outline-none"
                  >
                      <option value="recent">Most Recent</option>
                      <option value="helpful">Most Helpful</option>
                      <option value="rating">Highest Rated</option>
                  </select>
                  <Link to={`/company/${id}/review`} className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 transition-colors">Write Review</Link>
               </div>
            </div>
            
            {sortedReviews.map(review => (
              <div key={review.id} className="p-8 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{review.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <StarRating rating={review.rating} size="sm" />
                      <span>{review.department}</span>
                      <span className="text-gray-300">•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {/* Privacy Logic: Show 'Verified Student' if anonymous but verified */}
                   {review.isVerified ? (
                       <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                           Verified Student {review.batchYear ? `, ${review.batchYear} Batch` : ''}
                       </span>
                   ) : (
                       <span className="text-gray-400 text-xs">{review.userEmail.split('@')[0]}</span>
                   )}
                </div>
                <div className="space-y-4 mb-4">
                  <p><span className="font-bold text-green-600 text-sm uppercase">Pros: </span><span className="text-gray-600">{review.pros}</span></p>
                  <p><span className="font-bold text-red-600 text-sm uppercase">Cons: </span><span className="text-gray-600">{review.cons}</span></p>
                  {review.advice && <p><span className="font-bold text-indigo-600 text-sm uppercase">Advice to Juniors: </span><span className="text-gray-600 italic">"{review.advice}"</span></p>}
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleUpvote(review.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${review.isUpvoted ? 'text-indigo-600 bg-indigo-50 border border-indigo-200' : 'text-gray-500 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600'}`}
                    >
                        <svg className="w-4 h-4" fill={review.isUpvoted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                        Helpful ({review.helpfulVotes || 0})
                    </button>
                </div>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-gray-400">No reviews yet. Be the first!</p>}
          </div>

          <div className="space-y-8">
             {/* AI Summary */}
             <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                <h3 className="font-bold text-indigo-900 mb-2">AI Summary</h3>
                <p className="text-indigo-800/80 text-sm leading-relaxed">{isSummaryLoading ? 'Analyzing...' : (aiSummary || "Not enough data yet.")}</p>
             </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Q&A */}
      {activeTab === 'qa' && (
          <div className="max-w-3xl animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">Ask a Student</h2>
              <p className="text-gray-500 mb-8">Anonymous questions answered by verified students.</p>

              <form onSubmit={handleAskQuestion} className="flex gap-4 mb-10">
                  <input 
                    type="text" 
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Ask something (e.g. How is the dorm food?)" 
                    className="flex-grow p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button type="submit" className="px-6 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors">Ask</button>
              </form>

              <div className="space-y-8">
                  {questions.map(q => (
                      <div key={q.id} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                          <h3 className="text-lg font-bold mb-4">{q.text}</h3>
                          
                          <div className="space-y-4 pl-4 border-l-2 border-indigo-100 mb-4">
                              {q.answers.map(a => (
                                  <div key={a.id} className="bg-gray-50 p-4 rounded-xl">
                                      <p className="text-gray-800 mb-2">{a.text}</p>
                                      <div className="flex items-center gap-2 text-xs">
                                          {a.isVerifiedEmployee ? (
                                              <span className="flex items-center gap-1 text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">
                                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                  Verified
                                              </span>
                                          ) : <span className="text-gray-400">Public User</span>}
                                          <span className="text-gray-300">•</span>
                                          <span className="text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</span>
                                      </div>
                                  </div>
                              ))}
                              {q.answers.length === 0 && <p className="text-sm text-gray-400 italic">No answers yet.</p>}
                          </div>

                          <div className="mt-4 flex gap-2">
                             <input 
                                type="text" 
                                placeholder="Answer this..." 
                                className="flex-grow p-3 text-sm border border-gray-200 rounded-xl"
                                value={newAnswer?.qid === q.id ? newAnswer.text : ''}
                                onChange={(e) => setNewAnswer({qid: q.id, text: e.target.value})}
                             />
                             <button 
                                onClick={() => handleAnswerSubmit(q.id, true)} 
                                className="px-4 py-2 text-xs font-bold bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200"
                             >
                                Verified Answer
                             </button>
                             <button 
                                onClick={() => handleAnswerSubmit(q.id, false)} 
                                className="px-4 py-2 text-xs font-bold bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
                             >
                                Public Answer
                             </button>
                          </div>
                      </div>
                  ))}
                  {questions.length === 0 && <p className="text-gray-400">No questions yet. Ask something!</p>}
              </div>
          </div>
      )}

      {/* TAB CONTENT: MENTORSHIP */}
      {activeTab === 'mentors' && (
          <div className="max-w-4xl animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold mb-2">Paid Senior Mentorship</h2>
                    <p className="text-gray-500 mt-2">Skip the generic advice. Book a private 1:1 chat.</p>
                  </div>
                  <Link to={`/add-mentor/${id}`} className="px-5 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-black transition-all flex items-center gap-2">
                      <span>Become a Mentor</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {mentors.map(mentor => (
                      <div key={mentor.id} className="border border-gray-100 rounded-3xl p-6 bg-white hover:shadow-xl transition-shadow flex flex-col">
                          <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                  <img src={mentor.avatar} alt={mentor.name} className="w-16 h-16 rounded-2xl object-cover" />
                                  <div>
                                      <h3 className="font-bold text-lg text-gray-900">{mentor.name}</h3>
                                      <p className="text-indigo-600 font-medium text-sm">{mentor.role}</p>
                                  </div>
                              </div>
                              {mentor.isVerified && (
                                  <span className="bg-green-50 text-green-700 p-1.5 rounded-full" title="Verified Employee">
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                  </span>
                              )}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">{mentor.bio}</p>
                          
                          <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                              <div>
                                  <p className="text-xs text-gray-400 font-bold uppercase">Price</p>
                                  <p className="text-2xl font-extrabold text-gray-900">₹{mentor.price}</p>
                              </div>
                              <button 
                                onClick={() => handleBookMentor(mentor.id, mentor.price)}
                                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                              >
                                  Book Chat
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
              
              {mentors.length === 0 && (
                  <div className="p-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <p className="text-gray-400 text-lg mb-2">No mentors available yet.</p>
                      <p className="text-sm text-gray-400">Are you an employee here? <Link to="/verification" className="text-indigo-600 underline">Verify now</Link> to become a mentor.</p>
                  </div>
              )}
          </div>
      )}
    </div>
  );
};

export default CollegeDetail;
