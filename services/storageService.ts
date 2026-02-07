
import { Company, College, School, GovOrg, Review, InterviewReview, SalarySubmission, Question, UserSession, Mentor, ChatSession, ChatMessage } from '../types';
import { MOCK_COMPANIES, MOCK_COLLEGES, MOCK_SCHOOLS, MOCK_GOV_ORGS, INITIAL_REVIEWS, INITIAL_INTERVIEWS, INITIAL_SALARIES, INITIAL_QUESTIONS, MOCK_MENTORS } from '../constants';

const CUSTOM_COMPANIES_KEY = 'honestwork_custom_companies';
const CUSTOM_COLLEGES_KEY = 'honestwork_custom_colleges';
const CUSTOM_SCHOOLS_KEY = 'honestwork_custom_schools';
const CUSTOM_GOV_ORGS_KEY = 'honestwork_custom_gov_orgs';

const USER_SESSION_KEY = 'honestwork_user_session';
const CHAT_SESSIONS_KEY = 'honestwork_chat_sessions';
const CHAT_MESSAGES_KEY = 'honestwork_chat_messages';
const REVIEW_VOTES_KEY = 'honestwork_review_votes';
const USER_UPVOTES_KEY = 'honestwork_user_upvotes'; // New key to track what the user voted on
const CUSTOM_MENTORS_KEY = 'honestwork_custom_mentors';

export const storageService = {
  // --- User Session & Verification ---
  getUserSession: (): UserSession => {
    try {
      const stored = localStorage.getItem(USER_SESSION_KEY);
      return stored ? JSON.parse(stored) : { isVerified: false, invitesLeft: 0 };
    } catch {
      return { isVerified: false, invitesLeft: 0 };
    }
  },

  updateUserSession: (session: Partial<UserSession>) => {
    const current = storageService.getUserSession();
    const updated = { ...current, ...session };
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  },

  validateInviteCode: (code: string): boolean => {
    // Mock valid invites
    const validCodes = ['HONEST-1', 'COLLEGE-24', 'TRUTH-5'];
    return validCodes.includes(code);
  },

  // --- Companies ---
  getAllCompanies: (): Company[] => {
    try {
      const stored = localStorage.getItem(CUSTOM_COMPANIES_KEY);
      const custom = stored ? JSON.parse(stored) : [];
      return [...MOCK_COMPANIES, ...custom];
    } catch (e) {
      return MOCK_COMPANIES;
    }
  },

  getCompanyById: (id: string): Company | undefined => {
    return storageService.getAllCompanies().find(c => c.id === id);
  },

  addCompany: (company: Company): void => {
    try {
      const stored = localStorage.getItem(CUSTOM_COMPANIES_KEY);
      const custom = stored ? JSON.parse(stored) : [];
      custom.push(company);
      localStorage.setItem(CUSTOM_COMPANIES_KEY, JSON.stringify(custom));
      window.dispatchEvent(new Event('storage'));
    } catch (e) { console.error(e); }
  },

  // --- Colleges ---
  getAllColleges: (): College[] => {
    try {
      const stored = localStorage.getItem(CUSTOM_COLLEGES_KEY);
      const custom = stored ? JSON.parse(stored) : [];
      return [...MOCK_COLLEGES, ...custom];
    } catch (e) {
      return MOCK_COLLEGES;
    }
  },

  getCollegeById: (id: string): College | undefined => {
    return storageService.getAllColleges().find(c => c.id === id);
  },

  addCollege: (college: College): void => {
    try {
      const stored = localStorage.getItem(CUSTOM_COLLEGES_KEY);
      const custom = stored ? JSON.parse(stored) : [];
      custom.push(college);
      localStorage.setItem(CUSTOM_COLLEGES_KEY, JSON.stringify(custom));
      window.dispatchEvent(new Event('storage'));
    } catch (e) { console.error(e); }
  },

  // --- Schools ---
  getAllSchools: (): School[] => {
    try {
      const stored = localStorage.getItem(CUSTOM_SCHOOLS_KEY);
      const custom = stored ? JSON.parse(stored) : [];
      return [...MOCK_SCHOOLS, ...custom];
    } catch (e) { return MOCK_SCHOOLS; }
  },

  getSchoolById: (id: string): School | undefined => {
    return storageService.getAllSchools().find(s => s.id === id);
  },

  addSchool: (school: School): void => {
    try {
      const stored = localStorage.getItem(CUSTOM_SCHOOLS_KEY);
      const custom = stored ? JSON.parse(stored) : [];
      custom.push(school);
      localStorage.setItem(CUSTOM_SCHOOLS_KEY, JSON.stringify(custom));
      window.dispatchEvent(new Event('storage'));
    } catch (e) { console.error(e); }
  },

  // --- Gov Orgs ---
  getAllGovOrgs: (): GovOrg[] => {
    try {
      const stored = localStorage.getItem(CUSTOM_GOV_ORGS_KEY);
      const custom = stored ? JSON.parse(stored) : [];
      return [...MOCK_GOV_ORGS, ...custom];
    } catch (e) { return MOCK_GOV_ORGS; }
  },

  getGovOrgById: (id: string): GovOrg | undefined => {
    return storageService.getAllGovOrgs().find(g => g.id === id);
  },

  addGovOrg: (org: GovOrg): void => {
    try {
      const stored = localStorage.getItem(CUSTOM_GOV_ORGS_KEY);
      const custom = stored ? JSON.parse(stored) : [];
      custom.push(org);
      localStorage.setItem(CUSTOM_GOV_ORGS_KEY, JSON.stringify(custom));
      window.dispatchEvent(new Event('storage'));
    } catch (e) { console.error(e); }
  },

  // --- Reviews (Shared) ---
  getReviewsForCompany: (companyId: string): Review[] => {
    try {
      const key = `honestwork_reviews_${companyId}`;
      const stored = localStorage.getItem(key);
      const customReviews = stored ? JSON.parse(stored) : [];
      
      const votesMap = JSON.parse(localStorage.getItem(REVIEW_VOTES_KEY) || '{}');
      const userUpvotes = JSON.parse(localStorage.getItem(USER_UPVOTES_KEY) || '[]');
      
      const initialReviews = INITIAL_REVIEWS.filter(r => r.companyId === companyId);
      
      const processed = [...initialReviews, ...customReviews].map(r => ({
        ...r,
        department: r.department || 'Other',
        helpfulVotes: (r.helpfulVotes || 0) + (votesMap[r.id] || 0),
        isUpvoted: userUpvotes.includes(r.id)
      }));
      
      return processed;
    } catch (e) {
      return [];
    }
  },

  addReview: (companyId: string, review: Review): void => {
    try {
      const key = `honestwork_reviews_${companyId}`;
      const stored = localStorage.getItem(key);
      const customReviews = stored ? JSON.parse(stored) : [];
      customReviews.push(review);
      localStorage.setItem(key, JSON.stringify(customReviews));
      window.dispatchEvent(new Event('storage'));
    } catch (e) { console.error(e); }
  },

  upvoteReview: (reviewId: string): void => {
      try {
        const votesMap = JSON.parse(localStorage.getItem(REVIEW_VOTES_KEY) || '{}');
        const userUpvotes = JSON.parse(localStorage.getItem(USER_UPVOTES_KEY) || '[]');
        
        if (userUpvotes.includes(reviewId)) {
            // Already upvoted -> Toggle Off (Decrement)
            votesMap[reviewId] = (votesMap[reviewId] || 0) - 1;
            const index = userUpvotes.indexOf(reviewId);
            if (index > -1) {
                userUpvotes.splice(index, 1);
            }
        } else {
            // Not upvoted -> Toggle On (Increment)
            votesMap[reviewId] = (votesMap[reviewId] || 0) + 1;
            userUpvotes.push(reviewId);
        }

        localStorage.setItem(REVIEW_VOTES_KEY, JSON.stringify(votesMap));
        localStorage.setItem(USER_UPVOTES_KEY, JSON.stringify(userUpvotes));
        window.dispatchEvent(new Event('storage'));
      } catch (e) { console.error(e); }
  },

  // --- Interviews (Ghosting Meter) ---
  getInterviewsForCompany: (companyId: string): InterviewReview[] => {
    try {
      const key = `honestwork_interviews_${companyId}`;
      const stored = localStorage.getItem(key);
      const customInterviews = stored ? JSON.parse(stored) : [];
      const initialInterviews = INITIAL_INTERVIEWS.filter(i => i.companyId === companyId);
      return [...initialInterviews, ...customInterviews];
    } catch (e) { return []; }
  },

  addInterview: (companyId: string, interview: InterviewReview): void => {
    try {
      const key = `honestwork_interviews_${companyId}`;
      const stored = localStorage.getItem(key);
      const customInterviews = stored ? JSON.parse(stored) : [];
      customInterviews.push(interview);
      localStorage.setItem(key, JSON.stringify(customInterviews));
      window.dispatchEvent(new Event('storage'));
    } catch (e) { console.error(e); }
  },

  // --- Salaries ---
  getSalariesForCompany: (companyId: string): SalarySubmission[] => {
    try {
      const key = `honestwork_salaries_${companyId}`;
      const stored = localStorage.getItem(key);
      const customSalaries = stored ? JSON.parse(stored) : [];
      const initialSalaries = INITIAL_SALARIES.filter(s => s.companyId === companyId);
      return [...initialSalaries, ...customSalaries];
    } catch (e) { return []; }
  },

  addSalary: (companyId: string, salary: SalarySubmission): void => {
    try {
      const key = `honestwork_salaries_${companyId}`;
      const stored = localStorage.getItem(key);
      const customSalaries = stored ? JSON.parse(stored) : [];
      customSalaries.push(salary);
      localStorage.setItem(key, JSON.stringify(customSalaries));
      window.dispatchEvent(new Event('storage'));
    } catch (e) { console.error(e); }
  },

  // --- Q&A (Shared) ---
  getQuestionsForCompany: (companyId: string): Question[] => {
    try {
      const key = `honestwork_questions_${companyId}`;
      const stored = localStorage.getItem(key);
      const customQuestions = stored ? JSON.parse(stored) : [];
      const initialQuestions = INITIAL_QUESTIONS.filter(q => q.companyId === companyId);
      return [...initialQuestions, ...customQuestions];
    } catch (e) { return []; }
  },

  addQuestion: (companyId: string, text: string): void => {
    const key = `honestwork_questions_${companyId}`;
    const stored = localStorage.getItem(key);
    const questions = stored ? JSON.parse(stored) : [];
    
    questions.push({
      id: Math.random().toString(36).substr(2, 9),
      companyId,
      text,
      createdAt: new Date().toISOString(),
      answers: []
    });
    localStorage.setItem(key, JSON.stringify(questions));
    window.dispatchEvent(new Event('storage'));
  },

  addAnswer: (companyId: string, questionId: string, text: string, isVerified: boolean): void => {
    const key = `honestwork_questions_${companyId}`;
    const stored = localStorage.getItem(key);
    const customQuestions: Question[] = stored ? JSON.parse(stored) : [];
    
    // Check if it's a custom question
    const qIndex = customQuestions.findIndex(q => q.id === questionId);
    
    if (qIndex > -1) {
      customQuestions[qIndex].answers.push({
        id: Math.random().toString(36).substr(2, 9),
        text,
        authorType: isVerified ? 'Employee' : 'Public',
        isVerifiedEmployee: isVerified,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(key, JSON.stringify(customQuestions));
    } else {
      const initialQ = INITIAL_QUESTIONS.find(q => q.id === questionId);
      if (initialQ) {
        const newQCopy = { ...initialQ, answers: [...initialQ.answers] };
        newQCopy.answers.push({
          id: Math.random().toString(36).substr(2, 9),
          text,
          authorType: isVerified ? 'Employee' : 'Public',
          isVerifiedEmployee: isVerified,
          createdAt: new Date().toISOString()
        });
        customQuestions.push(newQCopy);
        localStorage.setItem(key, JSON.stringify(customQuestions));
      }
    }
    window.dispatchEvent(new Event('storage'));
  },

  // --- Mentorship & Chat ---
  
  getMentorsForEntity: (entityId: string): Mentor[] => {
      const stored = localStorage.getItem(CUSTOM_MENTORS_KEY);
      const customMentors: Mentor[] = stored ? JSON.parse(stored) : [];
      const entityCustomMentors = customMentors.filter(m => m.entityId === entityId);
      const entityMockMentors = MOCK_MENTORS.filter(m => m.entityId === entityId);
      return [...entityMockMentors, ...entityCustomMentors];
  },

  getAllMentors: (): Mentor[] => {
      const stored = localStorage.getItem(CUSTOM_MENTORS_KEY);
      const customMentors: Mentor[] = stored ? JSON.parse(stored) : [];
      return [...MOCK_MENTORS, ...customMentors];
  },

  addMentor: (mentor: Mentor): void => {
      const stored = localStorage.getItem(CUSTOM_MENTORS_KEY);
      const customMentors: Mentor[] = stored ? JSON.parse(stored) : [];
      customMentors.push(mentor);
      localStorage.setItem(CUSTOM_MENTORS_KEY, JSON.stringify(customMentors));
      window.dispatchEvent(new Event('storage'));
  },

  getMentorById: (mentorId: string): Mentor | undefined => {
      const stored = localStorage.getItem(CUSTOM_MENTORS_KEY);
      const customMentors: Mentor[] = stored ? JSON.parse(stored) : [];
      const foundCustom = customMentors.find(m => m.id === mentorId);
      if (foundCustom) return foundCustom;
      return MOCK_MENTORS.find(m => m.id === mentorId);
  },

  createChatSession: (mentorId: string, userEmail: string, price: number): string => {
      const sessions = storageService.getAllChatSessions();
      const newSession: ChatSession = {
          id: Math.random().toString(36).substr(2, 9),
          mentorId,
          userEmail,
          status: 'PENDING_PAYMENT',
          createdAt: new Date().toISOString(),
          pricePaid: price
      };
      sessions.push(newSession);
      localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
      return newSession.id;
  },

  getAllChatSessions: (): ChatSession[] => {
      const stored = localStorage.getItem(CHAT_SESSIONS_KEY);
      return stored ? JSON.parse(stored) : [];
  },

  getChatSession: (sessionId: string): ChatSession | undefined => {
      return storageService.getAllChatSessions().find(s => s.id === sessionId);
  },

  confirmPayment: (sessionId: string) => {
      const sessions = storageService.getAllChatSessions();
      const index = sessions.findIndex(s => s.id === sessionId);
      if (index > -1) {
          sessions[index].status = 'ACTIVE';
          localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
          storageService.addChatMessage(sessionId, 'mentor', "Hi! I'm here to help. Ask me anything.");
      }
  },

  endChatSession: (sessionId: string) => {
      const sessions = storageService.getAllChatSessions();
      const index = sessions.findIndex(s => s.id === sessionId);
      if (index > -1) {
          sessions[index].status = 'COMPLETED';
          localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
          window.dispatchEvent(new Event('chat-update'));
      }
  },

  getChatMessages: (sessionId: string): ChatMessage[] => {
      const stored = localStorage.getItem(CHAT_MESSAGES_KEY);
      const allMessages: ChatMessage[] = stored ? JSON.parse(stored) : [];
      return allMessages.filter(m => m.sessionId === sessionId).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  addChatMessage: (sessionId: string, sender: 'user' | 'mentor', text: string) => {
      const stored = localStorage.getItem(CHAT_MESSAGES_KEY);
      const allMessages: ChatMessage[] = stored ? JSON.parse(stored) : [];
      
      const newMessage: ChatMessage = {
          id: Math.random().toString(36).substr(2, 9),
          sessionId,
          sender,
          text,
          timestamp: new Date().toISOString()
      };
      
      allMessages.push(newMessage);
      localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(allMessages));
      window.dispatchEvent(new Event('chat-update'));
  }
};
