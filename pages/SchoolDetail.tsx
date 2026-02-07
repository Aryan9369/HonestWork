
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Review, Question, Mentor } from '../types';
import StarRating from '../components/StarRating';
import { storageService } from '../services/storageService';

const SchoolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'parents' | 'teachers' | 'students' | 'qa' | 'mentors'>('overview');
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);

  // Q&A State
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState<{qid: string, text: string} | null>(null);

  const school = id ? storageService.getSchoolById(id) : undefined;

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
      teachers: calc('teachersRating'),
      safety: calc('safetyRating'),
      sports: calc('sportsRating'),
      parents: calc('parentsInteractionRating')
    };
  }, [reviews]);

  const teacherReviews = reviews.filter(r => r.department === 'Teaching');
  const parentReviews = reviews.filter(r => r.department === 'Parent');
  const studentReviews = reviews.filter(r => r.department === 'Student');

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
      const userEmail = userSession.verifiedEmail || "guest_parent@example.com";
      const sessionId = storageService.createChatSession(mentorId, userEmail, price);
      navigate(`/payment/${sessionId}`);
  };

  const handleUpvote = (reviewId: string) => {
      storageService.upvoteReview(reviewId);
  };

  // Helper to render review list
  const renderReviews = (list: Review[], emptyMsg: string) => (
      <div className="space-y-6">
          {list.map(r => (
            <div key={r.id} className="p-6 border rounded-2xl bg-white shadow-sm">
                <div className="flex justify-between mb-2">
                    <div>
                        <h3 className="font-bold text-lg">{r.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                             <StarRating rating={r.rating} size="sm" />
                             <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${r.department === 'Parent' ? 'bg-purple-100 text-purple-700' : r.department === 'Teaching' ? 'bg-orange-100 text-orange-700' : r.department === 'Student' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>
                                 {r.department === 'Teaching' ? 'Teacher' : r.department}
                             </span>
                        </div>
                    </div>
                    {r.isVerified && <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full h-fit font-bold">Verified</span>}
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
          {list.length === 0 && <div className="p-8 bg-gray-50 rounded-2xl text-center text-gray-400">{emptyMsg}</div>}
      </div>
  );

  if (!school) return <div>School not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <button onClick={() => navigate('/')} className="text-gray-400 mb-8">← Back</button>
      <div className="flex gap-8 mb-10">
        <img src={school.logo} className="w-32 h-32 rounded-3xl object-cover shadow-lg" alt={school.name}/>
        <div>
           <h1 className="text-4xl font-extrabold mb-2">{school.name}</h1>
           <p className="text-lg text-gray-500 mb-2">{school.board} • {school.city}</p>
           <p className="text-gray-500">{school.description}</p>
        </div>
      </div>

      <div className="flex border-b mb-8 overflow-x-auto">
         <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 font-bold border-b-2 whitespace-nowrap ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>Overview</button>
         <button onClick={() => setActiveTab('parents')} className={`px-6 py-3 font-bold border-b-2 whitespace-nowrap ${activeTab === 'parents' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>Parent Reviews ({parentReviews.length})</button>
         <button onClick={() => setActiveTab('teachers')} className={`px-6 py-3 font-bold border-b-2 whitespace-nowrap ${activeTab === 'teachers' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500'}`}>Teacher Reviews ({teacherReviews.length})</button>
         <button onClick={() => setActiveTab('students')} className={`px-6 py-3 font-bold border-b-2 whitespace-nowrap ${activeTab === 'students' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>Student Reviews ({studentReviews.length})</button>
         <button onClick={() => setActiveTab('qa')} className={`px-6 py-3 font-bold border-b-2 whitespace-nowrap ${activeTab === 'qa' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>Q&A</button>
         <button onClick={() => setActiveTab('mentors')} className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'mentors' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Mentorship <span className="ml-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">NEW</span></button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Latest Reviews</h2>
                    <Link to={`/company/${id}/review`} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold">Write Review</Link>
                </div>
                {renderReviews(reviews.slice(0, 5), "No reviews yet.")}
                {reviews.length > 5 && <button className="w-full py-2 text-center text-indigo-600 font-bold bg-indigo-50 rounded-xl">Load More</button>}
            </div>
            <div>
                {stats && (
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4 sticky top-24">
                        <h3 className="font-bold text-gray-400 uppercase tracking-wider text-sm">Report Card</h3>
                        {Object.entries(stats).map(([k, v]) => (
                            <div key={k} className="flex justify-between items-center">
                                <span className="capitalize font-medium text-gray-700">{k}</span>
                                <span className="font-bold text-indigo-600 text-xl">{v}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      )}

      {activeTab === 'parents' && (
          <div className="max-w-3xl">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-purple-900">What Parents Say</h2>
                  <Link to={`/company/${id}/review`} className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold">Add Parent Review</Link>
              </div>
              {renderReviews(parentReviews, "No parent reviews yet.")}
          </div>
      )}

      {activeTab === 'teachers' && (
          <div className="max-w-3xl">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-orange-900">Teacher's Lounge</h2>
                  <Link to={`/company/${id}/review`} className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold">Add Teacher Review</Link>
              </div>
              {renderReviews(teacherReviews, "No teacher reviews yet.")}
          </div>
      )}

      {activeTab === 'students' && (
          <div className="max-w-3xl">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-blue-900">Student Voices</h2>
                  <Link to={`/company/${id}/review`} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">Add Student Review</Link>
              </div>
              {renderReviews(studentReviews, "No student reviews yet.")}
          </div>
      )}

      {activeTab === 'qa' && (
          <div className="max-w-3xl animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">School Q&A</h2>
              <p className="text-gray-500 mb-8">Questions answered by teachers, parents, and students.</p>

              <form onSubmit={handleAskQuestion} className="flex gap-4 mb-10">
                  <input 
                    type="text" 
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Ask something (e.g. Is the bus service reliable?)" 
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
                  {questions.length === 0 && <p className="text-gray-400">No questions yet. Be the first to ask!</p>}
              </div>
          </div>
      )}

      {/* TAB CONTENT: MENTORSHIP */}
      {activeTab === 'mentors' && (
          <div className="max-w-4xl animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold mb-2">Paid Mentorship</h2>
                    <p className="text-gray-500">Connect with teachers and experienced parents.</p>
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
                                  <span className="bg-green-50 text-green-700 p-1.5 rounded-full" title="Verified">
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
                      <p className="text-sm text-gray-400">Are you a teacher or experienced parent? <Link to="/verification" className="text-indigo-600 underline">Verify now</Link> to become a mentor.</p>
                  </div>
              )}
          </div>
      )}
    </div>
  );
};

export default SchoolDetail;
