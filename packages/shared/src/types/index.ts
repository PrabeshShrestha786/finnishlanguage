export type FinnishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type NativeLanguage =
  | 'ENGLISH' | 'NEPALI' | 'HINDI' | 'ARABIC' | 'URDU'
  | 'SPANISH' | 'FRENCH' | 'GERMAN' | 'RUSSIAN' | 'CHINESE'
  | 'JAPANESE' | 'KOREAN' | 'PORTUGUESE' | 'ITALIAN' | 'SWEDISH' | 'OTHER';
export type LessonType =
  | 'READING' | 'WRITING' | 'LISTENING' | 'SPEAKING'
  | 'VOCABULARY' | 'GRAMMAR' | 'YKI_PREP' | 'CONVERSATION'
  | 'PRONUNCIATION' | 'TRANSLATION';
export type ExerciseType =
  | 'MCQ' | 'FILL_BLANK' | 'DRAG_DROP' | 'MATCH_PAIRS'
  | 'REARRANGE' | 'TYPING' | 'PRONUNCIATION' | 'DICTATION'
  | 'ESSAY' | 'TRANSLATION' | 'FLASHCARD' | 'MEMORY_GAME';
export type SubscriptionPlan = 'FREE' | 'PRO' | 'PREMIUM' | 'TEAM';
export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: Role;
  nativeLanguage: NativeLanguage;
  finnishLevel: FinnishLevel;
  targetLevel: FinnishLevel;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  subscription?: Subscription;
  createdAt: string;
}

export interface Subscription {
  plan: SubscriptionPlan;
  status: string;
  currentPeriodEnd?: string;
  trialEnd?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  level: FinnishLevel;
  difficulty: string;
  content: Record<string, unknown>;
  audioUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  estimatedMinutes: number;
  xpReward: number;
  isFree: boolean;
  isPublished: boolean;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  instructions?: string;
  options?: string[] | Record<string, string>;
  correctAnswer: string | string[];
  explanation?: string;
  hint?: string;
  audioUrl?: string;
  imageUrl?: string;
  points: number;
}

export interface VocabWord {
  id: string;
  finnish: string;
  english: string;
  translation: Record<string, string>;
  pronunciation?: string;
  audioUrl?: string;
  partOfSpeech?: string;
  category?: string;
  level: FinnishLevel;
  exampleSentence?: string;
}

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  iconUrl?: string;
  xpReward: number;
  rarity: string;
  earnedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  xp: number;
  league: string;
  currentStreak: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ProgressStats {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  exercisesCompleted: number;
  wordsLearned: number;
  studyMinutesTotal: number;
  weeklyXP: number[];
  levelProgress: number;
  currentLevel: FinnishLevel;
  nextLevel: FinnishLevel;
}
