
import { Company, College, School, GovOrg, Review, InterviewReview, SalarySubmission, Question, Mentor } from './types';

export const MOCK_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'Google',
    domain: 'google.com',
    industry: 'Technology',
    description: 'A global leader in search, advertising, and cloud computing.',
    logo: 'https://picsum.photos/seed/google/200'
  },
  {
    id: '2',
    name: 'Apple',
    domain: 'apple.com',
    industry: 'Technology',
    description: 'Pioneering consumer electronics, software, and services.',
    logo: 'https://picsum.photos/seed/apple/200'
  },
  {
    id: '3',
    name: 'Stripe',
    domain: 'stripe.com',
    industry: 'Fintech',
    description: 'Financial infrastructure for the internet.',
    logo: 'https://picsum.photos/seed/stripe/200'
  },
  {
    id: '7',
    name: 'Zomato',
    domain: 'zomato.com',
    industry: 'Food Tech',
    description: 'Indian multinational restaurant aggregator and food delivery company.',
    logo: 'https://picsum.photos/seed/zomato/200'
  }
];

export const MOCK_COLLEGES: College[] = [
  {
    id: 'c1',
    name: 'MIT',
    city: 'Cambridge',
    state: 'MA',
    website: 'mit.edu',
    allowedEmailDomains: ['mit.edu'],
    description: 'A world-class research university focused on science and technology.',
    logo: 'https://picsum.photos/seed/mit/200'
  },
  {
    id: 'c4',
    name: 'IIT Bombay',
    city: 'Mumbai',
    state: 'Maharashtra',
    website: 'iitb.ac.in',
    allowedEmailDomains: ['iitb.ac.in'],
    description: 'Recognized worldwide as a leader in the field of engineering education and research.',
    logo: 'https://picsum.photos/seed/iitb/200'
  }
];

export const MOCK_SCHOOLS: School[] = [
  {
    id: 's1',
    name: 'Delhi Public School, RK Puram',
    city: 'New Delhi',
    state: 'Delhi',
    board: 'CBSE',
    website: 'dpsrkp.net',
    allowedEmailDomains: ['dpsrkp.net'],
    description: 'A premier co-educational day-cum-boarding school in India.',
    logo: 'https://picsum.photos/seed/dps/200'
  },
  {
    id: 's2',
    name: 'The Doon School',
    city: 'Dehradun',
    state: 'Uttarakhand',
    board: 'IB/ISC',
    website: 'doonschool.com',
    allowedEmailDomains: ['doonschool.com'],
    description: 'An all-boys boarding school specializing in holistic education.',
    logo: 'https://picsum.photos/seed/doon/200'
  }
];

export const MOCK_GOV_ORGS: GovOrg[] = [
  {
    id: 'g1',
    name: 'State Bank of India',
    type: 'Bank',
    website: 'sbi.co.in',
    description: 'The largest public sector bank in India.',
    allowedEmailDomains: ['sbi.co.in'],
    logo: 'https://picsum.photos/seed/sbi/200'
  },
  {
    id: 'g2',
    name: 'ISRO',
    type: 'Ministry',
    website: 'isro.gov.in',
    description: 'Indian Space Research Organisation.',
    allowedEmailDomains: ['isro.gov.in'],
    logo: 'https://picsum.photos/seed/isro/200'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    companyId: '1',
    rating: 4,
    department: 'Engineering',
    title: 'Great perks, slow processes',
    pros: 'The food and benefits are unmatched. Amazing colleagues.',
    cons: 'Bureaucracy can be stifling for fast movers.',
    advice: 'Try to cut down on middle management layers.',
    userEmail: 'dev@google.com',
    isVerified: true,
    isAnonymous: true,
    createdAt: '2024-03-01',
    helpfulVotes: 12
  },
  {
    id: 'cr1',
    companyId: 'c1',
    rating: 5,
    department: 'Computer Science',
    title: 'Intense but rewarding',
    pros: 'Incredible research opportunities and peers.',
    cons: 'Very high workload, little sleep.',
    advice: 'Find a study group early.',
    userEmail: 'student@mit.edu',
    isVerified: true,
    isAnonymous: true,
    createdAt: '2024-01-20',
    placementRating: 5,
    messRating: 3,
    wifiRating: 5,
    infrastructureRating: 5,
    strictnessRating: 3,
    batchYear: '2025',
    helpfulVotes: 8
  },
  {
    id: 'sr1',
    companyId: 's1',
    rating: 4,
    department: 'Teaching',
    title: 'Excellent academic environment',
    pros: 'Smart students, good facilities.',
    cons: 'High pressure on teachers for results.',
    advice: 'Focus more on teacher well-being.',
    userEmail: 'teacher@dpsrkp.net',
    isVerified: true,
    isAnonymous: true,
    createdAt: '2024-02-10',
    teachersRating: 5,
    safetyRating: 4,
    sportsRating: 5,
    parentsInteractionRating: 3,
    helpfulVotes: 5
  },
  {
    id: 'gr1',
    companyId: 'g1',
    rating: 4,
    department: 'Finance',
    title: 'Secure job, decent balance',
    pros: 'Job security is the best. Timings are fixed.',
    cons: 'Technology is outdated. Slow promotions.',
    advice: 'Upgrade the internal software stack.',
    userEmail: 'clerk@sbi.co.in',
    isVerified: true,
    isAnonymous: true,
    createdAt: '2024-03-05',
    jobSecurityRating: 5,
    workLifeBalanceRating: 4,
    transparencyRating: 3,
    benefitsRating: 5,
    helpfulVotes: 20
  }
];

export const INITIAL_INTERVIEWS: InterviewReview[] = [
  {
    id: 'i1',
    companyId: '1',
    role: 'Senior Software Engineer',
    experience: 'Positive',
    difficulty: 4,
    wasGhosted: false,
    createdAt: '2024-02-10'
  },
];

export const INITIAL_SALARIES: SalarySubmission[] = [
  {
    id: 's1',
    companyId: '1',
    role: 'L4 Software Engineer',
    yearsOfExperience: 3,
    ctc: 250000,
    inHand: 12000,
    location: 'Mountain View',
    createdAt: '2024-01-15'
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'cq2',
    companyId: 'c4',
    text: 'Is attendance compulsory?',
    createdAt: '2024-08-10',
    answers: [
      {
        id: 'a2',
        text: 'Depends on the prof, but usually 75% rule applies.',
        authorType: 'Public',
        isVerifiedEmployee: false,
        createdAt: '2024-08-11'
      }
    ]
  }
];

export const MOCK_MENTORS: Mentor[] = [
  {
    id: 'm1',
    entityId: '1', // Google
    name: 'Sarah Chen',
    role: 'Staff Engineer (L6)',
    bio: '8 years at Google. Can help with System Design and promotion packets.',
    price: 99,
    isVerified: true,
    avatar: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    id: 'm3',
    entityId: 'c4', // IIT Bombay
    name: 'Rohan Gupta',
    role: 'Final Year CSE',
    bio: 'Cracked Day 1 placement at HFT. Ask me about competitive coding.',
    price: 49,
    isVerified: true,
    avatar: 'https://i.pravatar.cc/150?u=rohan'
  },
  {
    id: 'm4',
    entityId: 'g1', // SBI
    name: 'Amit Verma',
    role: 'Probationary Officer',
    bio: 'Cleared IBPS PO in first attempt. Can guide on exam strategy.',
    price: 39,
    isVerified: true,
    avatar: 'https://i.pravatar.cc/150?u=amit'
  }
];
