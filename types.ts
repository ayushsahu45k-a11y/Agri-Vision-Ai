export interface User {
  id?: string; // Added for tracking
  name: string;
  email: string;
  cropType: string;
  fieldSize: number;
  soilType: string;
  photoUrl: string | null;
  lastActive?: number; // Timestamp for admin tracking
  joinedDate?: string;
}

export interface AnalysisResult {
  id: string;
  date: string;
  imageUrl: string;
  cropDetected: string;
  healthScore: number;
  condition: 'Healthy' | 'Disease Detected' | 'Nutrient Deficiency' | 'Unknown';
  diagnosis: string;
  reasoning: string;
  treatmentPlan?: string; 
}

export interface SocialUser {
  id: string;
  name: string;
  location: string;
  cropSpecialty: string;
  isFriend: boolean;
  avatarUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum View {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  ANALYZE = 'ANALYZE',
  HISTORY = 'HISTORY',
  SOCIAL = 'SOCIAL',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE',
  ABOUT = 'ABOUT',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export type Theme = 'emerald' | 'sunset' | 'ocean';
export type Language = 'en' | 'hi';

export type TranslationDictionary = {
  [key: string]: {
    en: string;
    hi: string;
  };
};