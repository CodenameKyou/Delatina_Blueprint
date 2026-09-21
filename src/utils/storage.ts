import {
  PlayerProfile,
  QuestItem,
  PostingSlot,
  PostLog,
  PromptItem,
  CommentaryChannel,
  LearningLogEntry,
  AccountItem,
  CampaignItem,
  HookIdea,
  Achievement,
  DailyReward,
  AppSettings,
} from '../types';
import {
  INITIAL_QUESTS,
  DEFAULT_POSTING_SLOTS,
  INITIAL_PROMPTS,
  INITIAL_COMMENTARY_CHANNELS,
  INITIAL_ACHIEVEMENTS,
  DAILY_REWARDS_LIST,
  RANK_TITLES,
} from '../data/initialData';

const STORAGE_KEYS = {
  PROFILE: 'cq_profile',
  QUESTS: 'cq_quests',
  SLOTS: 'cq_slots',
  POSTS: 'cq_posts',
  PROMPTS: 'cq_prompts',
  CHANNELS: 'cq_channels',
  LEARNINGS: 'cq_learnings',
  ACCOUNTS: 'cq_accounts',
  CAMPAIGNS: 'cq_campaigns',
  HOOKS: 'cq_hooks',
  ACHIEVEMENTS: 'cq_achievements',
  DAILY_REWARDS: 'cq_daily_rewards',
  SETTINGS: 'cq_settings',
};

export const DEFAULT_PROFILE: PlayerProfile = {
  name: 'PLAYER ONE',
  avatarId: 'pixel-boy',
  xp: 120,
  level: 1,
  rankTitle: 'Rookie Clipper',
  coins: 100,
  streakDays: 1,
  lastLoginDate: new Date().toISOString().split('T')[0],
  streakFreezes: 1,
  equippedHat: 'none',
  unlockedThemes: ['dark', 'light'],
  unlockedHats: ['none'],
  unlockedAvatars: ['pixel-boy', 'pixel-girl', 'pixel-ninja', 'pixel-robot', 'pixel-wizard', 'pixel-cat'],
  onboardingCompleted: false,
  dailyQuestProgress: {
    date: new Date().toISOString().split('T')[0],
    postsLoggedToday: 0,
    hooksWrittenToday: 0,
    analyticsReviewedToday: 0,
    claimedDailyReward: false,
  },
};

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: false, // off by default as per requirement
  crtEnabled: false,
  crtFlicker: false,
  theme: 'dark',
  timezone: 'Asia/Manila',
  dailyGoal: 3,
  postIntervalHours: 12,
  nextPostCountdownTarget: null,
};

export function getRankTitle(level: number): string {
  let title = 'Rookie Clipper';
  for (const rank of RANK_TITLES) {
    if (level >= rank.minLevel) {
      title = rank.title;
    }
  }
  return title;
}

export function calculateLevel(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
  // Each level requires 150 * level XP
  let level = 1;
  let accumulated = 0;

  while (true) {
    const requiredForNext = level * 150;
    if (xp < accumulated + requiredForNext) {
      const currentLevelXp = xp - accumulated;
      const progressPercent = Math.min(100, Math.round((currentLevelXp / requiredForNext) * 100));
      return { level, currentLevelXp, nextLevelXp: requiredForNext, progressPercent };
    }
    accumulated += requiredForNext;
    level++;
  }
}

export function loadProfile(): PlayerProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!saved) return DEFAULT_PROFILE;
    const parsed = JSON.parse(saved);
    const { level } = calculateLevel(parsed.xp || 0);
    parsed.level = level;
    parsed.rankTitle = getRankTitle(level);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch (e) {
    console.error('Failed to load profile', e);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    const { level } = calculateLevel(profile.xp);
    profile.level = level;
    profile.rankTitle = getRankTitle(level);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadQuests(): QuestItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.QUESTS);
    if (!saved) return INITIAL_QUESTS;
    return JSON.parse(saved);
  } catch {
    return INITIAL_QUESTS;
  }
}

export function saveQuests(quests: QuestItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  } catch (e) {
    console.error('Failed to save quests', e);
  }
}

export function loadPostingSlots(): PostingSlot[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SLOTS);
    if (!saved) return DEFAULT_POSTING_SLOTS;
    return JSON.parse(saved);
  } catch {
    return DEFAULT_POSTING_SLOTS;
  }
}

export function savePostingSlots(slots: PostingSlot[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
  } catch (e) {
    console.error('Failed to save slots', e);
  }
}

export function loadPosts(): PostLog[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!saved) {
      // Seed 2 sample posts to make the dashboard look active immediately
      const samplePosts: PostLog[] = [
        {
          id: 'post-seed-1',
          platform: 'instagram',
          accountName: '@clip.velocity',
          niche: 'Sports / NBA',
          campaign: 'Underdog Fantasy Clip',
          postedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
          views: 1420,
          notes: 'Hook dropped at 0:01 with high contrast captions.',
        },
        {
          id: 'post-seed-2',
          platform: 'tiktok',
          accountName: '@viraltales.hub',
          niche: 'History',
          campaign: 'Terrifying Lore Vol 1',
          postedAt: new Date(Date.now() - 3600 * 1000 * 16).toISOString(),
          views: 3800,
          notes: 'High retention loop back to start.',
        },
      ];
      return samplePosts;
    }
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function savePosts(posts: PostLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save posts', e);
  }
}

export function loadPrompts(): PromptItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROMPTS);
    if (!saved) return INITIAL_PROMPTS;
    return JSON.parse(saved);
  } catch {
    return INITIAL_PROMPTS;
  }
}

export function savePrompts(prompts: PromptItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(prompts));
  } catch (e) {
    console.error('Failed to save prompts', e);
  }
}

export function loadChannels(): CommentaryChannel[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CHANNELS);
    if (!saved) return INITIAL_COMMENTARY_CHANNELS;
    return JSON.parse(saved);
  } catch {
    return INITIAL_COMMENTARY_CHANNELS;
  }
}

export function saveChannels(channels: CommentaryChannel[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
  } catch (e) {
    console.error('Failed to save channels', e);
  }
}

export function loadLearnings(): LearningLogEntry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LEARNINGS);
    if (!saved) {
      return [
        {
          id: 'learn-seed-1',
          title: 'NBA Fastbreak Analysis Drop-off',
          platform: 'instagram',
          date: new Date().toISOString().split('T')[0],
          tags: ['hook', 'pacing', 'retention'],
          notesWhatHappened: 'Big 40% retention drop within the first 2.5 seconds because of a 1-second silent buildup.',
          notesWhatILearned: 'Taglish rule applied: Mag base ka sa last video mo, check mo san nag drop. Never leave dead air!',
          notesWhatIllChange: 'Lead directly with the rim slam audio hit on frame 0.',
          diagnosisDrop: 'hook',
        },
      ];
    }
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function saveLearnings(learnings: LearningLogEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LEARNINGS, JSON.stringify(learnings));
  } catch (e) {
    console.error('Failed to save learnings', e);
  }
}

export function loadAccounts(): AccountItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!saved) {
      return [
        {
          id: 'acc-1',
          platform: 'instagram',
          handle: '@alon_clip_sports',
          niche: 'Sports / NFL & NBA',
          creationDate: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
          warmUpDay: 4,
          status: 'Ready',
          notes: 'Minimum age set to 25 for Tier 2/3 country list. Clean feed.',
          ageCountryDone: true,
          professionalModeDone: true,
          feedTrainingDone: true,
        },
        {
          id: 'acc-2',
          platform: 'tiktok',
          handle: '@rin_history_daily',
          niche: 'Terrifying History',
          creationDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
          warmUpDay: 2,
          status: 'Warming up',
          notes: 'Actively browsing niche 15+ mins daily before posting.',
          ageCountryDone: true,
          professionalModeDone: false,
          feedTrainingDone: true,
        },
      ];
    }
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function saveAccounts(accounts: AccountItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts', e);
  }
}

export function loadCampaigns(): CampaignItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    if (!saved) {
      return [
        {
          id: 'camp-1',
          creatorName: 'FitFix Pro Community',
          ratePer1k: 2.5,
          budget: 500,
          platform: 'TikTok / IG Reels',
          sourceLink: 'https://drive.google.com/raw-fitfix-clips',
          deadline: '2026-10-15',
          status: 'Active',
          currentViews: 45000,
        },
        {
          id: 'camp-2',
          creatorName: 'Lore & Horror Podcast',
          ratePer1k: 3.0,
          budget: 750,
          platform: 'YouTube Shorts',
          sourceLink: 'https://drive.google.com/lore-raw',
          deadline: '2026-11-01',
          status: 'Active',
          currentViews: 12000,
        },
      ];
    }
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function saveCampaigns(campaigns: CampaignItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  } catch (e) {
    console.error('Failed to save campaigns', e);
  }
}

export function loadHooks(): HookIdea[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.HOOKS);
    if (!saved) {
      return [
        {
          id: 'hook-1',
          text: 'This was not supposed to happen...',
          type: 'tension',
          rating: 5,
          tags: ['viral', 'unsolved'],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'hook-2',
          text: 'Watch closely or you will miss it.',
          type: 'curiosity',
          rating: 4,
          tags: ['illusion', 'retention'],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'hook-3',
          text: 'Nobody expected him to actually survive this.',
          type: 'emotion',
          rating: 5,
          tags: ['high-stakes', 'sports'],
          createdAt: new Date().toISOString(),
        },
      ];
    }
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function saveHooks(hooks: HookIdea[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HOOKS, JSON.stringify(hooks));
  } catch (e) {
    console.error('Failed to save hooks', e);
  }
}

export function loadAchievements(): Achievement[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (!saved) return INITIAL_ACHIEVEMENTS;
    return JSON.parse(saved);
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function saveAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (e) {
    console.error('Failed to save achievements', e);
  }
}

export function loadDailyRewards(): DailyReward[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.DAILY_REWARDS);
    if (!saved) return DAILY_REWARDS_LIST;
    return JSON.parse(saved);
  } catch {
    return DAILY_REWARDS_LIST;
  }
}

export function saveDailyRewards(rewards: DailyReward[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_REWARDS, JSON.stringify(rewards));
  } catch (e) {
    console.error('Failed to save daily rewards', e);
  }
}

export function loadSettings(): AppSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!saved) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function exportAllDataJSON(): string {
  const exportData = {
    profile: loadProfile(),
    quests: loadQuests(),
    slots: loadPostingSlots(),
    posts: loadPosts(),
    prompts: loadPrompts(),
    channels: loadChannels(),
    learnings: loadLearnings(),
    accounts: loadAccounts(),
    campaigns: loadCampaigns(),
    hooks: loadHooks(),
    achievements: loadAchievements(),
    dailyRewards: loadDailyRewards(),
    settings: loadSettings(),
    exportDate: new Date().toISOString(),
    version: '1.0.0',
  };
  return JSON.stringify(exportData, null, 2);
}

export function importDataJSON(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.profile) saveProfile(data.profile);
    if (data.quests) saveQuests(data.quests);
    if (data.slots) savePostingSlots(data.slots);
    if (data.posts) savePosts(data.posts);
    if (data.prompts) savePrompts(data.prompts);
    if (data.channels) saveChannels(data.channels);
    if (data.learnings) saveLearnings(data.learnings);
    if (data.accounts) saveAccounts(data.accounts);
    if (data.campaigns) saveCampaigns(data.campaigns);
    if (data.hooks) saveHooks(data.hooks);
    if (data.achievements) saveAchievements(data.achievements);
    if (data.dailyRewards) saveDailyRewards(data.dailyRewards);
    if (data.settings) saveSettings(data.settings);
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
}

export function resetAllProgress(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

// Aliases for component compatibility
export const loadPostLogs = loadPosts;
export const savePostLogs = savePosts;
export const loadLearningLogs = loadLearnings;
export const saveLearningLogs = saveLearnings;
export const importDataFromJSON = importDataJSON;
export const resetAllData = resetAllProgress;

export function exportAllDataAsJSON(): string {
  const jsonStr = exportAllDataJSON();
  try {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clipper-quest-save-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Download trigger error', e);
  }
  return jsonStr;
}
