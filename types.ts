
export interface Company {
  id: string;
  name: string;
  domain: string;
  description: string;
  logo: string;
  industry: string;
}

export interface Review {
  id: string;
  companyId: string;
  rating: number;
  title: string;
  pros: string;
  cons: string;
  advice: string;
  userEmail: string;
  isVerified: boolean;
  createdAt: string;
}

export interface CompanyStats {
  averageRating: number;
  reviewCount: number;
}
