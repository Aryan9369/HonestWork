
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Review, Question, Mentor } from '../types';
import StarRating from '../components/StarRating';
import { storageService } from '../services/storageService';

const GovDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'qa' | 'mentors'>('overview');
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  
  // Q&A State
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState<{qid: string, text: string} | null>(null);

  const gov = id ? storageService.getGovOrgById(id) : undefined;

  const loadData = () => {
    if (id) {
        setReviews(storageService.getReviewsForCompany(id));
        setQuestions(storageService.getQuestionsForCompany(id));
        setMentors(storageService.getMentorsForEntity(id));
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [id]);

  const stats = useMemo(() => {
    if (reviews.length === 0) return null;
    const calc = (key: keyof Review) => (reviews.reduce((acc, r) => acc + (r[key] as number || 0), 0) / reviews.length).toFixed(1);
    return {
      'Job Security': calc('jobSecurityRating'),
      'Work Life Balance': calc('workLifeBalanceRating'),
      'Transparency': calc('transparencyRating'),
      'Benefits': calc('benefitsRating')
    };
  }, [reviews]);

  // Q&A Handlers
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

  // Mentorship
  const handleBookMentor = (mentorId: string, price: number) => {
      const userSession = storageService.getUserSession();
      const userEmail = userSession.verifiedEmail || "guest_official@example.com";
      const sessionId = storageService.createChatSession(mentorId, userEmail, price);
      navigate(`/payment/${sessionId}`);
  };

  const handleUpvote = (reviewId: string) => {
    storageService.upvoteReview(reviewId);
  };

  if (!gov) return <div>Organization not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <button onClick={() => navigate('/')} className="text-gray-400 mb-8">← Back</button>
      <div className="flex gap-8 mb-10">
        <img src={gov.logo} className="w-32 h-32 rounded-3xl object-cover shadow-lg" alt={gov.name}/>
        <div>
           <h1 className="text-4xl font-extrabold mb-2">{gov.name}</h1>
           <p className="text-lg text-gray-500 mb-2">{gov.type} • Government of India</p>
           <p className="text-gray-500">{gov.description}</p>
        </div>
      </div>

      <div className="flex border-b mb-8">
         <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 font-bold border-b-2 ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>Overview</button>
         <button onClick={() => setActiveTab('qa')} className={`px-6 py-3 font-bold border-b-2 ${activeTab === 'qa' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>Ask an Official</button>
         <button onClick={() => setActiveTab('mentors')} className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'mentors' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Mentorship <span className="ml-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">NEW</span></button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold">Employee Reviews</h2>
                    <Link to={`/company/${id}/review`} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold">Write Review</Link>
                </div>
                {reviews.map(r => (
                    <div key={r.id} className="p-6 border rounded-2xl bg-white">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-bold">{r.title}</h3>
                            <StarRating rating={r.rating} size="sm" />
                        </div>
                        <p className="text-sm text-gray-600 mb-2"><strong>Pros:</strong> {r.pros}</p>
                        <p className="text-sm text-gray-600 mb-4"><strong>Cons:</strong> {r.cons}</p>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => handleUpvote(r.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${r.isUpvoted ? 'text-indigo-600 bg-indigo-50 border border-indigo-200' : 'text-gray-500 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600'}`}
                            >
                                <svg className="w-4 h-4" fill={r.isUpvoted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                                Helpful ({r.helpfulVotes || 0})
                            </button>
                        </div>
                    </div>
                ))}
                {reviews.length === 0 && <p className="text-gray-400 p-8 border rounded-2xl text-center">No reviews yet.</p>}
            </div>
            <div>
                {stats && (
                    <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 space-y-4">
                        <h3 className="font-bold text-orange-800 uppercase tracking-wider text-sm">Gov Reality Check</h3>
                        {Object.entries(stats).map(([k, v]) => (
                            <div key={k} className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">{k}</span>
                                <span className="font-bold text-orange-600 text-xl">{v}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      )}

      {activeTab === 'qa' && (
          <div className="max-w-3xl animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">Ask an Official</h2>
              <p className="text-gray-500 mb-8">Questions about bureaucracy, exams, and work culture answered.</p>

              <form onSubmit={handleAskQuestion} className="flex gap-4 mb-10">
                  <input 
                    type="text" 
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Ask something (e.g. Is the workload manageable?)" 
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
                                                  Verified Official
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
                                Answer
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
                    <h2 className="text-3xl font-extrabold mb-2">Paid Official Mentorship</h2>
                    <p className="text-gray-500">Get advice on exams and work culture.</p>
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
                                  <span className="bg-green-50 text-green-700 p-1.5 rounded-full" title="Verified Official">
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
                      <p className="text-sm text-gray-400">Are you working here? <Link to="/verification" className="text-indigo-600 underline">Verify now</Link> to become a mentor.</p>
                  </div>
              )}
          </div>
      )}
    </div>
  );
};

export default GovDetail;
