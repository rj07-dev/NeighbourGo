export type Urgency = 'low' | 'medium' | 'high' | 'critical';
export type Category = 'food' | 'transport' | 'tutoring' | 'translation' | 'eldercare' | 'housing' | 'other';
export type Status = 'open' | 'pending' | 'completed' | 'flagged';

export interface SupportRequest {
  id: string;
  userId: string;
  userName: string;
  title: string;
  originalDescription: string;
  aiOptimizedDescription: string;
  category: Category;
  urgency: Urgency;
  location: string;
  tags: string[];
  status: Status;
  language: string;
  createdAt: string;
}

export interface VolunteerOffer {
  id: string;
  userId: string;
  userName: string;
  skills: string[];
  languages: string[];
  availability: string;
  bio: string;
  status: 'active' | 'inactive';
}

export interface Resource {
  id: string;
  title: string;
  type: 'food-bank' | 'shelter' | 'clinic' | 'legal' | 'library';
  address: string;
  phone: string;
  description: string;
}

export interface CommunityNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'alert' | 'event' | 'info';
}

export interface AIAnalysisResult {
  category: Category;
  urgency: Urgency;
  isSafe: boolean;
  optimizedText: string;
  tags: string[];
  detectedLanguage: string;
  reasoning?: string;
}
