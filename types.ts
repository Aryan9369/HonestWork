
export interface Company {
  id: string;
  name: string;
  domain: string;
  description: string;
  logo: string;
  industry: string;
}

export interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  website: string;
  description: string;
  logo: string;
  allowedEmailDomains: string[]; 
}

export interface School {
  id: string;
  name: string;
  city: string;
  state: string;
  board: string; // CBSE, ICSE, IB, State
  website: string;
  description: string;
  logo: string;
  allowedEmailDomains: string[];
}

export interface GovOrg {
  id: string;
  name: string;
  type: 'PSU' | 'Ministry' | 'Bank' | 'Defense' | 'Other';
  website: string;
  description: string;
  logo: string;
  allowedEmailDomains: string[];
}

export type Department = 'Engineering' | 'Product' | 'Sales' | 'Marketing' | 'HR' | 'Support' | 'Operations' | 'Finance' | 'Computer Science' | 'Business' | 'Electrical Engineering' | 'Arts' | 'Medicine' | 'Teaching' | 'Administration' | 'Civil Services' | 'Parent' | 'Student' | 'Other';

export interface Review {
  id: string;
  companyId: string; // Used for all Entity IDs
  rating: number; // Overall rating
  department: Department;
  title: string;
  pros: string;
  cons: string;
  advice: string;
  userEmail: string;
  isVerified: boolean;
  isAnonymous: boolean;
  createdAt: string;
  helpfulVotes: number;
  isUpvoted?: boolean; // Track if current user upvoted
  
  // College Specific
  placementRating?: number;
  messRating?: number;
  wifiRating?: number;
  infrastructureRating?: number;
  strictnessRating?: number;
  batchYear?: string;

  // School Specific
  teachersRating?: number;
  safetyRating?: number;
  sportsRating?: number;
  parentsInteractionRating?: number;

  // Gov Org Specific
  jobSecurityRating?: number;
  workLifeBalanceRating?: number;
  transparencyRating?: number; // Corruption/Bureaucracy inverse
  benefitsRating?: number;
}

export interface InterviewReview {
  id: string;
  companyId: string;
  role: string;
  experience: 'Positive' | 'Neutral' | 'Negative';
  difficulty: number; // 1-5
  wasGhosted: boolean;
  createdAt: string;
}

export interface SalarySubmission {
  id: string;
  companyId: string;
  role: string;
  yearsOfExperience: number;
  ctc: number; // Annual Cost to Company
  inHand: number; // Monthly In-Hand
  location: string;
  createdAt: string;
}

export interface Answer {
  id: string;
  text: string;
  authorType: 'Employee' | 'Public';
  isVerifiedEmployee: boolean;
  createdAt: string;
}

export interface Question {
  id: string;
  companyId: string;
  text: string;
  createdAt: string;
  answers: Answer[];
}

// Mentorship Models
export interface Mentor {
  id: string;
  entityId: string; 
  name: string;
  role: string; 
  bio: string;
  price: number; 
  isVerified: boolean;
  avatar: string;
}

export interface ChatSession {
  id: string;
  mentorId: string;
  userEmail: string; 
  status: 'PENDING_PAYMENT' | 'ACTIVE' | 'COMPLETED';
  createdAt: string;
  pricePaid: number;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
}

export interface UserSession {
  isVerified: boolean;
  verifiedOrgId?: string; 
  verifiedEmail?: string; 
  invitesLeft: number;
}
