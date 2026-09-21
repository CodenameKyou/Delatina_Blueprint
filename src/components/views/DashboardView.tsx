import React from 'react';
import {
  PlayerProfile,
  PostLog,
  QuestItem,
} from '../../types';
import { WORLDS } from '../../data/initialData';
import { ClippyMascot } from '../ClippyMascot';
import {
  Flame,
  Coins,
  Trophy,
  PlusCircle,
  Clock,
  Sparkles,
  BookOpen,
  TrendingUp,
  Award,
  Video,
  ExternalLink,
  CheckCircle2,
  Shield,
  Zap,
  Dice5,
  Calculator,
} from 'lucide-react';

interface DashboardViewProps {
  profile: PlayerProfile;
  posts: PostLog[];
  quests: QuestItem[];
  dailyGoal: number;
  onNavigate: (view: string) => void;
  onOpenLogPost: () => void;
  onOpenDailyReward: () => void;
  nextPostCountdown: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  posts,
  quests,
  dailyGoal,
  onNavigate,
  onOpenLogPost,
  onOpenDailyReward,
  nextPostCountdown,
}) => {
  // Today's date YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const postsToday = posts.filter(
    (p) => p.postedAt && p.postedAt.split('T')[0] === todayStr
  );
  const postsTodayCount = postsToday.length;
  const hasPostedToday = postsTodayCount > 0;

  // Calculate overall quest progress
  const completedQuestsCount = quests.filter((q) => q.completed).length;
  const totalQuests = quests.length;
  const questPercent = Math.round((completedQuestsCount / (totalQuests || 1)) * 100);

  // Helper for world completion
  const getWorldProgress = (worldId: string) => {
    const worldQuests = quests.filter((q) => q.worldId === worldId);
    if (worldQuests.length === 0) return 0;
    const completed = worldQuests.filter((q) => q.completed).length;
    return Math.round((completed / worldQuests.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Player Profile HUD */}
      <div className="bg-[#26164a] border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_#000000] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Avatar & Player Info */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#ffd93b] border-4 border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center overflow-hidden">
                <span className="font-arcade text-2xl sm:text-3xl text-[#1a1033]">
                  {profile.name.charAt(0).toUpperCase() || 'P'}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#ff4fa3] text-[#fff4d6] border-2 border-black font-arcade text-[9px] px-1.5 py-0.5">
                LVL {profile.level}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-arcade text-base sm:text-lg text-[#ffd93b] tracking-wider">
                  {profile.name}
                </h2>
                <span className="bg-[#35e0ff]/20 text-[#35e0ff] border-2 border-[#35e0ff] font-arcade text-[9px] px-2 py-0.5">
                  {profile.rankTitle}
                </span>
              </div>

              {/* XP Progress Bar */}
              <div className="mt-2 w-full max-w-md">
                <div className="flex justify-between font-arcade text-[9px] text-[#b9a9db] mb-1">
                  <span>XP: {profile.xp}</span>
                  <span>NEXT LVL: {profile.level * 150} XP</span>
                </div>
                <div className="h-4 w-full bg-black border-2 border-black p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff4fa3] via-[#ffd93b] to-[#5dffa8] transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(((profile.xp % 150) / 150) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Player Currencies & Streak Stats */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 bg-black/40 border-2 border-black px-3 py-2 shadow-[2px_2px_0px_#000000]">
              <Flame className="w-5 h-5 text-orange-400 fill-orange-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="font-arcade text-[9px] text-[#b9a9db]">STREAK</span>
                <span className="font-arcade text-xs text-[#ffd93b]">
                  {profile.streakDays} DAYS
                </span>
              </div>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1.5 bg-black/40 border-2 border-black px-3 py-2 shadow-[2px_2px_0px_#000000]">
              <Coins className="w-5 h-5 text-[#ffd93b]" />
              <div className="flex flex-col">
                <span className="font-arcade text-[9px] text-[#b9a9db]">COINS</span>
                <span className="font-arcade text-xs text-[#5dffa8]">
                  {profile.coins}
                </span>
              </div>
            </div>

            {/* Daily Chest Trigger */}
            <button
              onClick={onOpenDailyReward}
              className="font-arcade text-[10px] bg-[#ff4fa3] text-[#fff4d6] border-2 border-black px-3 py-2.5 shadow-[3px_3px_0px_#000000] hover:bg-[#ff71ce] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-1.5 animate-bounce"
            >
              <Trophy className="w-4 h-4 text-[#ffd93b]" />
              <span>DAILY CHEST</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Grid: Posts Today Counter + Clippy Stage + Next Window Countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts Today Arcade Counter */}
        <div className="bg-[#2f1c5c] border-4 border-black p-5 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
              <span className="font-arcade text-xs text-[#35e0ff]">POST TRACKER</span>
              <span className="font-vt text-lg text-[#b9a9db]">TODAY</span>
            </div>

            <div className="text-center my-4">
              <div className="font-arcade text-3xl sm:text-4xl text-[#ffd93b] tracking-widest drop-shadow-[2px_2px_0px_#000]">
                {String(postsTodayCount).padStart(2, '0')} / {String(dailyGoal).padStart(2, '0')}
              </div>
              <p className="font-vt text-xl text-[#fff4d6] mt-1">
                {postsTodayCount >= dailyGoal
                  ? '🔥 DAILY GOAL CRUSHED! GG!'
                  : `${dailyGoal - postsTodayCount} more posts to keep the algorithm stoked`}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={onOpenLogPost}
              className="w-full font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-3 px-4 border-2 border-black shadow-[4px_4px_0px_#000] hover:bg-[#35e0ff] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#000] cursor-pointer flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ LOG A POST (+50 XP)</span>
            </button>

            <button
              onClick={() => onNavigate('tracker')}
              className="w-full font-arcade text-[10px] bg-[#1a1033] text-[#fff4d6] py-2 px-3 border-2 border-black hover:bg-black cursor-pointer text-center"
            >
              VIEW HEATMAP & STREAKS →
            </button>
          </div>
        </div>

        {/* Clippy Mascot Companion */}
        <div className="bg-[#fff4d6] text-[#1a1033] border-4 border-black p-5 shadow-[6px_6px_0px_#000000] flex flex-col items-center justify-center text-center">
          <ClippyMascot
            hasPostedToday={hasPostedToday}
            hat={profile.equippedHat}
            size="md"
            showSpeechBubble={true}
          />
          <div className="mt-2 text-center">
            <span className="font-arcade text-[9px] text-[#ff4fa3] uppercase">
              COACH CLIPPY • RETENTION GUARDIAN
            </span>
          </div>
        </div>

        {/* Next Post Window & Live Countdown */}
        <div className="bg-[#2f1c5c] border-4 border-black p-5 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
              <span className="font-arcade text-xs text-[#ff4fa3]">NEXT POST WINDOW</span>
              <Clock className="w-4 h-4 text-[#ffd93b]" />
            </div>

            <div className="bg-black/50 border-2 border-black p-4 text-center my-3">
              <span className="font-arcade text-[10px] text-[#35e0ff] block mb-1">
                COUNTDOWN (PHT)
              </span>
              <div className="font-arcade text-2xl text-[#5dffa8] tracking-widest font-bold animate-pulse">
                {nextPostCountdown || '02:14:33'}
              </div>
              <span className="font-vt text-lg text-[#b9a9db] block mt-1">
                Peak US morning / doomscroll interval
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('world-3')}
            className="w-full font-arcade text-xs bg-[#ffd93b] text-[#1a1033] py-2.5 px-3 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-center"
          >
            EDIT POSTING SCHEDULE →
          </button>
        </div>
      </div>

      {/* Quick Access Vaults Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate('prompts')}
          className="bg-[#26164a] border-2 border-black p-3 shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] hover:text-[#1a1033] group transition-colors cursor-pointer text-left"
        >
          <Sparkles className="w-5 h-5 text-[#ffd93b] group-hover:text-[#1a1033] mb-1" />
          <div className="font-arcade text-[10px] font-bold">PROMPT VAULT</div>
          <div className="font-vt text-base text-[#b9a9db] group-hover:text-[#1a1033]">
            Fill & Copy AI Prompts
          </div>
        </button>

        <button
          onClick={() => onNavigate('hooklab')}
          className="bg-[#26164a] border-2 border-black p-3 shadow-[3px_3px_0px_#000] hover:bg-[#ff4fa3] hover:text-[#fff4d6] group transition-colors cursor-pointer text-left"
        >
          <Dice5 className="w-5 h-5 text-[#ff4fa3] group-hover:text-[#fff4d6] mb-1" />
          <div className="font-arcade text-[10px] font-bold">HOOK LAB</div>
          <div className="font-vt text-base text-[#b9a9db] group-hover:text-[#fff4d6]">
            Roulette & 12-Word Check
          </div>
        </button>

        <button
          onClick={() => onNavigate('campaigns')}
          className="bg-[#26164a] border-2 border-black p-3 shadow-[3px_3px_0px_#000] hover:bg-[#5dffa8] hover:text-[#1a1033] group transition-colors cursor-pointer text-left"
        >
          <Calculator className="w-5 h-5 text-[#5dffa8] group-hover:text-[#1a1033] mb-1" />
          <div className="font-arcade text-[10px] font-bold">CAMPAIGN HUB</div>
          <div className="font-vt text-base text-[#b9a9db] group-hover:text-[#1a1033]">
            Earnings & 10m Timer
          </div>
        </button>

        <button
          onClick={() => onNavigate('channels')}
          className="bg-[#26164a] border-2 border-black p-3 shadow-[3px_3px_0px_#000] hover:bg-[#ffd93b] hover:text-[#1a1033] group transition-colors cursor-pointer text-left"
        >
          <ExternalLink className="w-5 h-5 text-[#35e0ff] group-hover:text-[#1a1033] mb-1" />
          <div className="font-arcade text-[10px] font-bold">REFERENCE CHANNELS</div>
          <div className="font-vt text-base text-[#b9a9db] group-hover:text-[#1a1033]">
            20 Commentary Models
          </div>
        </button>
      </div>

      {/* World Map Progression Overview */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-black pb-4 mb-6 gap-2">
          <div>
            <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b] tracking-wider">
              WORLD MAP: QUEST BLUEPRINTS
            </h3>
            <p className="font-vt text-xl text-[#b9a9db]">
              Level up by checking off quests, studying algorithms, and mastering each world.
            </p>
          </div>
          <div className="font-arcade text-xs text-[#5dffa8] bg-black/40 border-2 border-black px-3 py-1.5">
            TOTAL QUESTS: {completedQuestsCount} / {totalQuests} ({questPercent}%)
          </div>
        </div>

        {/* 8 World Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WORLDS.map((w) => {
            const prog = getWorldProgress(w.id);
            const isCompleted = prog === 100;
            return (
              <div
                key={w.id}
                onClick={() => onNavigate(w.id)}
                className="bg-[#1a1033] border-4 border-black p-4 shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:border-[#ffd93b] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-arcade text-[9px] text-[#ff4fa3] bg-black px-2 py-0.5 border border-black">
                      WORLD {w.number}
                    </span>
                    {isCompleted ? (
                      <span className="font-arcade text-[9px] text-[#5dffa8] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> GG
                      </span>
                    ) : (
                      <span className="font-arcade text-[9px] text-[#b9a9db]">
                        {prog}%
                      </span>
                    )}
                  </div>

                  <h4 className="font-arcade text-xs text-[#fff4d6] group-hover:text-[#ffd93b] line-clamp-1 mb-1">
                    {w.title}
                  </h4>
                  <p className="font-vt text-base text-[#b9a9db] line-clamp-2">
                    {w.subtitle}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="h-2.5 w-full bg-black border border-black">
                    <div
                      className={`h-full ${
                        isCompleted ? 'bg-[#5dffa8]' : 'bg-[#35e0ff]'
                      }`}
                      style={{ width: `${prog}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
