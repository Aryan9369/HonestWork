
import { Company, Review } from './types';

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
    id: '4',
    name: 'Netflix',
    domain: 'netflix.com',
    industry: 'Entertainment',
    description: 'The world\'s leading streaming entertainment service.',
    logo: 'https://picsum.photos/seed/netflix/200'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    companyId: '1',
    rating: 4,
    title: 'Great perks, slow processes',
    pros: 'The food and benefits are unmatched. Amazing colleagues.',
    cons: 'Bureaucracy can be stifling for fast movers.',
    advice: 'Try to cut down on middle management layers.',
    userEmail: 'dev@google.com',
    isVerified: true,
    createdAt: '2024-03-01'
  },
  {
    id: 'r2',
    companyId: '3',
    rating: 5,
    title: 'The best engineering culture',
    pros: 'High talent density, clear documentation, great tools.',
    cons: 'High expectations and can lead to burnout if not careful.',
    advice: 'Keep the culture of writing everything down.',
    userEmail: 'engineer@stripe.com',
    isVerified: true,
    createdAt: '2024-05-15'
  }
];
