export enum Page {
  Home = 'home',
  Kids = 'kids',
  Parents = 'parents',
  Tracker = 'tracker',
  MyJourney = 'my_journey',
  SmartChoices = 'smart_choices',
  Community = 'community',
  Games = 'games',
  Educational = 'educational',
  Contact = 'contact',
  InsulinFriend = 'insulin_friend',
  StarCollection = 'star_collection',
}

export interface SugarReading {
  day: string;
  before: number | null;
  after: number | null;
  notes: string;
}

export interface CommunityPost {
  id: number;
  emoji: string;
  message: string;
  timestamp: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  mood: 'happy' | 'neutral' | 'sad';
  food: 'healthy' | 'soso' | 'sweets';
  insulin: 'yes' | 'no';
}