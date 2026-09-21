export type PlatformType = 'tiktok' | 'instagram' | 'youtube';

export type ThemeMode = 'dark' | 'light' | 'gameboy' | 'vaporwave' | 'sunset' | 'night' | 'cyberpunk' | 'arcade';

export interface PlayerProfile {
  name: string;
  avatarId: string;
  xp: number;
  level: number;
  rankTitle: string;
  coins: number;
  streakDays: number;
  lastLoginDate: string; // YYYY-MM-DD
  streakFreezes: number;
  hasStreakFreeze?: boolean;
  equippedHat: string;
  unlockedThemes: string[];
  unlockedHats: string[];
  unlockedAvatars: string[];
  inventory?: string[];
  lastClaimedChestDate?: string;
  dailyGoal?: number;
  postIntervalHours?: number;
  onboardingCompleted: boolean;
  dailyQuestProgress: {
    date: string;
    postsLoggedToday: number;
    hooksWrittenToday: number;
    analyticsReviewedToday: number;
    claimedDailyReward: boolean;
  };
}

export interface QuestItem {
  id: string;
  worldId: string;
  title: string;
  description?: string;
  completed: boolean;
  xpReward: number;
  category?: string;
}

export interface WorldData {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  tagline?: string;
  locked: boolean;
  minLevelRequired?: number;
  iconName: string;
}

export interface PostLog {
  id: string;
  platform: PlatformType;
  accountName: string;
  niche: string;
  campaign?: string;
  postedAt: string; // ISO string
  views?: number;
  link?: string;
  notes?: string;
}

export interface LearningLogEntry {
  id: string;
  title: string;
  platform: PlatformType;
  date: string;
  linkedPostId?: string;
  tags: string[]; // e.g., 'hook', 'pacing', 'audience', 'retention'
  notesWhatHappened: string;
  notesWhatILearned: string;
  notesWhatIllChange: string;
  imageId?: string; // IndexedDB key
  imageUrl?: string; // transient or data URL
  diagnosisDrop?: 'hook' | 'middle' | 'end' | 'completion' | 'none';
}

export interface PromptVersion {
  timestamp: string;
  body: string;
}

export interface PromptItem {
  id: string;
  title: string;
  category: 'Hooks' | 'Captions' | 'Hashtags' | 'Other';
  body: string;
  tags: string[];
  isFavorite: boolean;
  usedCount: number;
  history: PromptVersion[];
  createdAt: string;
}

export interface CommentaryChannel {
  id: string;
  name: string;
  url: string;
  platform: PlatformType;
  nicheTag: string;
  subNiche?: string;
  whyStudy?: string;
  notes?: string;
  userNotes?: string;
  isFavorite: boolean;
  isStudied: boolean;
  studied?: boolean;
  order: number;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface PostingSlot {
  id: string;
  day: DayOfWeek;
  time: string; // e.g., "6 PM"
}

export interface AccountItem {
  id: string;
  platform: PlatformType;
  handle: string;
  niche: string;
  creationDate: string; // YYYY-MM-DD
  warmUpDay: number;
  status: 'Warming up' | 'Ready' | 'Posting' | 'Flagged';
  notes: string;
  ageCountryDone: boolean;
  professionalModeDone: boolean;
  feedTrainingDone: boolean;
}

export interface CampaignItem {
  id: string;
  creatorName: string;
  ratePer1k: number;
  budget: number;
  platform: string;
  sourceLink: string;
  deadline: string;
  status: 'Active' | 'Completed' | 'Pending';
  currentViews: number;
}

export interface HookIdea {
  id: string;
  text: string;
  type: 'curiosity' | 'tension' | 'emotion';
  rating: number;
  tags: string[];
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  cosmeticReward?: string;
}

export interface DailyReward {
  day: number;
  type: 'coins' | 'xp' | 'avatar' | 'hat' | 'tip' | 'theme' | 'chest';
  label: string;
  value: string | number;
  claimed: boolean;
  description: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  crtEnabled: boolean;
  crtFlicker: boolean;
  theme: ThemeMode;
  timezone: string; // default "Asia/Manila"
  dailyGoal: number; // default 3
  postIntervalHours: number; // default 12
  nextPostCountdownTarget?: string | null;
}
