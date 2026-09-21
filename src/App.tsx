import React, { useState, useEffect, useCallback } from 'react';
import {
  PlayerProfile,
  QuestItem,
  PostLog,
  PromptItem,
  PostingSlot,
  LearningLogEntry,
  CommentaryChannel,
  ThemeMode,
} from './types';
import {
  loadProfile,
  saveProfile,
  loadQuests,
  saveQuests,
  loadPostLogs,
  savePostLogs,
  loadPrompts,
  savePrompts,
  loadPostingSlots,
  savePostingSlots,
  loadLearningLogs,
  saveLearningLogs,
  loadChannels,
  saveChannels,
  loadSettings,
  saveSettings,
} from './utils/storage';
import { play8BitSound } from './utils/sound';
import { LandingScreen } from './components/LandingScreen';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/views/DashboardView';
import { WorldViewer } from './components/views/WorldViewer';
import { PostingPlannerView } from './components/views/PostingPlannerView';
import { PromptVaultView } from './components/views/PromptVaultView';
import { UploadTrackerView } from './components/views/UploadTrackerView';
import { LearningLogView } from './components/views/LearningLogView';
import { CommentaryChannelsView } from './components/views/CommentaryChannelsView';
import { AccountsManagerView } from './components/views/AccountsManagerView';
import { CampaignTrackerView } from './components/views/CampaignTrackerView';
import { HookLabView } from './components/views/HookLabView';
import { AchievementsView } from './components/views/AchievementsView';
import { SettingsView } from './components/views/SettingsView';
import { DailyChestModal } from './components/DailyChestModal';
import { OnboardingModal } from './components/OnboardingModal';
import {
  Sparkles,
  Flame,
  Coins,
  Menu,
  X,
  PlusCircle,
  Trophy,
} from 'lucide-react';

export default function App() {
  // App View State: 'landing' or any app screen
  const [view, setView] = useState<string>('landing');

  // Persistence States
  const [profile, setProfile] = useState<PlayerProfile>(loadProfile);
  const [quests, setQuests] = useState<QuestItem[]>(loadQuests);
  const [posts, setPosts] = useState<PostLog[]>(loadPostLogs);
  const [prompts, setPrompts] = useState<PromptItem[]>(loadPrompts);
  const [slots, setSlots] = useState<PostingSlot[]>(loadPostingSlots);
  const [learnings, setLearnings] = useState<LearningLogEntry[]>(loadLearningLogs);
  const [channels, setChannels] = useState<CommentaryChannel[]>(loadChannels);
  const [appSettings, setAppSettings] = useState(loadSettings);

  // Daily Chest Modal
  const [isDailyChestOpen, setIsDailyChestOpen] = useState(false);

  // Onboarding Tutorial Modal
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Level Up Celebration Banner
  const [levelUpNotif, setLevelUpNotif] = useState<string | null>(null);

  // Mobile Drawer Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Apply theme to document body
  useEffect(() => {
    document.body.className = '';
    if (appSettings.theme === 'light') {
      document.body.classList.add('theme-light');
    } else if (appSettings.theme === 'cyberpunk') {
      document.body.classList.add('theme-cyberpunk');
    } else if (appSettings.theme === 'gameboy') {
      document.body.classList.add('theme-gameboy');
    } else if (appSettings.theme === 'arcade') {
      document.body.classList.add('theme-arcade');
    } else if (appSettings.theme === 'sunset') {
      document.body.classList.add('theme-sunset');
    } else if (appSettings.theme === 'vaporwave') {
      document.body.classList.add('theme-vaporwave');
    }
  }, [appSettings.theme]);

  // Check XP for Level Up
  const addXP = useCallback(
    (amount: number) => {
      setProfile((prev) => {
        const newXp = prev.xp + amount;
        const xpForNextLevel = prev.level * 150;

        let nextLevel = prev.level;
        let rank = prev.rankTitle;

        if (newXp >= xpForNextLevel) {
          nextLevel = prev.level + 1;
          play8BitSound('levelUp', appSettings.soundEnabled);

          // Update rank title based on level
          if (nextLevel >= 10) rank = 'Master Algorithm Conqueror';
          else if (nextLevel >= 7) rank = 'Viral Sensation';
          else if (nextLevel >= 5) rank = 'Retention Architect';
          else if (nextLevel >= 3) rank = 'Pacing Strategist';
          else if (nextLevel >= 2) rank = 'Curiosity Apprentice';

          setLevelUpNotif(`LEVEL UP! You are now Level ${nextLevel} (${rank})!`);
          setTimeout(() => setLevelUpNotif(null), 4000);
        } else {
          play8BitSound('questComplete', appSettings.soundEnabled);
        }

        const updated: PlayerProfile = {
          ...prev,
          xp: newXp,
          level: nextLevel,
          rankTitle: rank,
        };
        saveProfile(updated);
        return updated;
      });
    },
    [appSettings.soundEnabled]
  );

  // Toggle Quest Complete
  const handleToggleQuest = (questId: string) => {
    setQuests((prev) => {
      const updated = prev.map((q) => {
        if (q.id === questId) {
          const nextComp = !q.completed;
          if (nextComp) {
            addXP(q.xpReward);
          }
          return { ...q, completed: nextComp };
        }
        return q;
      });
      saveQuests(updated);
      return updated;
    });
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === '1' || e.key === 'd' || e.key === 'D') {
        setView('dashboard');
      } else if (e.key === 'p' || e.key === 'P') {
        setView('prompts');
      } else if (e.key === 'u' || e.key === 'U') {
        setView('tracker');
      } else if (e.key === 'l' || e.key === 'L') {
        setView('learning');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute countdown to next post window (Target: 7 PM, 12 AM, or 5 AM PHT)
  const [countdownString, setCountdownString] = useState('02:14:33');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Target upcoming peak slots
      const currentHours = now.getHours();
      let targetHour = 19; // 7 PM
      if (currentHours >= 19) targetHour = 24; // 12 AM next
      else if (currentHours < 5) targetHour = 5;
      else if (currentHours < 12) targetHour = 12;
      else if (currentHours < 19) targetHour = 19;

      const diffSec = (targetHour * 3600) - (currentHours * 3600 + now.getMinutes() * 60 + now.getSeconds());
      const safeSec = diffSec > 0 ? diffSec : 3600;
      const h = Math.floor(safeSec / 3600);
      const m = Math.floor((safeSec % 3600) / 60);
      const s = safeSec % 60;
      setCountdownString(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Claim Daily Login Chest
  const todayDateStr = new Date().toISOString().split('T')[0];
  const alreadyClaimedChest = profile.lastClaimedChestDate === todayDateStr;

  const handleClaimChest = (coins: number, xp: number) => {
    const updated: PlayerProfile = {
      ...profile,
      coins: profile.coins + coins,
      lastClaimedChestDate: todayDateStr,
    };
    saveProfile(updated);
    setProfile(updated);
    addXP(xp);
  };

  // Reload all data (e.g. after JSON import or Reset)
  const handleRefreshAllData = () => {
    setProfile(loadProfile());
    setQuests(loadQuests());
    setPosts(loadPostLogs());
    setPrompts(loadPrompts());
    setSlots(loadPostingSlots());
    setLearnings(loadLearningLogs());
    setChannels(loadChannels());
    setAppSettings(loadSettings());
  };

  // If user is on landing screen
  if (view === 'landing') {
    return (
      <div className={appSettings.crtEnabled ? 'crt-screen relative' : 'relative'}>
        {appSettings.crtEnabled && (
          <div className={`crt-overlay ${appSettings.crtFlicker ? 'crt-flicker' : ''}`} />
        )}
        <LandingScreen
          onStartGame={() => {
            play8BitSound('gameStart', appSettings.soundEnabled);
            setView('dashboard');
            if (!profile.onboardingCompleted) {
              setIsOnboardingOpen(true);
            }
          }}
          soundEnabled={appSettings.soundEnabled}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#1a1033] text-[#fff4d6] flex relative ${appSettings.crtEnabled ? 'crt-screen' : ''}`}>
      {/* CRT Scanline Overlay */}
      {appSettings.crtEnabled && (
        <div className={`crt-overlay ${appSettings.crtFlicker ? 'crt-flicker' : ''}`} />
      )}
      {/* Desktop Sidebar Navigation */}
      <Navigation
        currentView={view}
        onNavigate={(newView) => {
          play8BitSound('click', appSettings.soundEnabled);
          setView(newView);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 bg-[#26164a]/95 backdrop-blur-xs border-b-4 border-black px-4 sm:px-6 py-3 flex items-center justify-between shadow-[0px_4px_0px_#000000]">
          {/* Mobile Brand / Menu toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden bg-[#ffd93b] text-[#1a1033] p-1.5 border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => setView('dashboard')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#ffd93b] via-[#ff4fa3] to-[#35e0ff] border-2 border-black flex items-center justify-center font-arcade text-xs text-[#1a1033] font-black shadow-[2px_2px_0px_#000] flex-shrink-0">
                JK
              </div>
              <div className="flex flex-col">
                <span className="font-arcade text-[9px] sm:text-xs text-[#ffd93b] tracking-wider font-bold truncate max-w-[180px] xs:max-w-none">
                  DELATINA, JOHN KENNETH (KYOUSUKENJI)
                </span>
                <span className="font-vt text-xs text-[#35e0ff] leading-none hidden xs:inline">
                  CLIPPER QUEST • ARCHITECT
                </span>
              </div>
            </div>
          </div>

          {/* Player Mini Status */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 bg-black/50 border-2 border-black px-2.5 py-1">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span className="font-arcade text-[9px] text-[#ffd93b]">
                {profile.streakDays}D
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/50 border-2 border-black px-2.5 py-1">
              <Coins className="w-4 h-4 text-[#ffd93b]" />
              <span className="font-arcade text-[9px] text-[#5dffa8]">
                {profile.coins}
              </span>
            </div>

            <button
              onClick={() => {
                play8BitSound('click', appSettings.soundEnabled);
                setIsOnboardingOpen(true);
              }}
              className="flex items-center gap-1 bg-[#35e0ff] text-[#1a1033] border-2 border-black px-2 py-1 font-arcade text-[9px] hover:bg-[#5dffa8] cursor-pointer shadow-[2px_2px_0px_#000]"
              title="Arcade Guide / Tutorial"
            >
              <span>GUIDE</span>
            </button>

            <div
              onClick={() => setView('achievements')}
              className="flex items-center gap-1.5 bg-[#ff4fa3] text-[#fff4d6] border-2 border-black px-2.5 py-1 cursor-pointer hover:bg-[#ff71ce]"
            >
              <span className="font-arcade text-[9px]">LVL {profile.level}</span>
            </div>
          </div>
        </header>

        {/* Mobile Flyout Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#26164a] border-b-4 border-black p-4 space-y-3 z-30 shadow-[0px_4px_0px_#000000] animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 font-arcade text-[9px]">
              <button
                onClick={() => {
                  setView('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="p-2 border-2 border-black bg-[#1a1033] text-left hover:bg-[#ffd93b] hover:text-[#1a1033]"
              >
                1. DASHBOARD
              </button>
              <button
                onClick={() => {
                  setView('world-map');
                  setMobileMenuOpen(false);
                }}
                className="p-2 border-2 border-black bg-[#1a1033] text-left hover:bg-[#ffd93b] hover:text-[#1a1033]"
              >
                2. WORLD MAP
              </button>
              <button
                onClick={() => {
                  setView('world-3');
                  setMobileMenuOpen(false);
                }}
                className="p-2 border-2 border-black bg-[#1a1033] text-left hover:bg-[#ffd93b] hover:text-[#1a1033]"
              >
                3. TIME PLANNER
              </button>
              <button
                onClick={() => {
                  setView('prompts');
                  setMobileMenuOpen(false);
                }}
                className="p-2 border-2 border-black bg-[#1a1033] text-left hover:bg-[#ffd93b] hover:text-[#1a1033]"
              >
                4. PROMPTS
              </button>
              <button
                onClick={() => {
                  setView('tracker');
                  setMobileMenuOpen(false);
                }}
                className="p-2 border-2 border-black bg-[#1a1033] text-left hover:bg-[#ffd93b] hover:text-[#1a1033]"
              >
                5. UPLOADS
              </button>
              <button
                onClick={() => {
                  setView('learning');
                  setMobileMenuOpen(false);
                }}
                className="p-2 border-2 border-black bg-[#1a1033] text-left hover:bg-[#ffd93b] hover:text-[#1a1033]"
              >
                6. LEARNING LOG
              </button>
              <button
                onClick={() => {
                  setView('hooklab');
                  setMobileMenuOpen(false);
                }}
                className="p-2 border-2 border-black bg-[#1a1033] text-left hover:bg-[#ffd93b] hover:text-[#1a1033]"
              >
                7. HOOK LAB
              </button>
              <button
                onClick={() => {
                  setView('campaigns');
                  setMobileMenuOpen(false);
                }}
                className="p-2 border-2 border-black bg-[#1a1033] text-left hover:bg-[#ffd93b] hover:text-[#1a1033]"
              >
                8. CAMPAIGNS
              </button>
              <button
                onClick={() => {
                  setView('accounts');
                  setMobileMenuOpen(false);
                }}
                className="p-2 border-2 border-black bg-[#1a1033] text-left hover:bg-[#ffd93b] hover:text-[#1a1033]"
              >
                9. ACCOUNTS
              </button>
              <button
                onClick={() => {
                  setView('channels');
                  setMobileMenuOpen(false);
                }}
                className="p-2 border-2 border-black bg-[#1a1033] text-left hover:bg-[#ffd93b] hover:text-[#1a1033]"
              >
                10. BENCHMARKS
              </button>
              <button
                onClick={() => {
                  setView('achievements');
                  setMobileMenuOpen(false);
                }}
                className="p-2 border-2 border-black bg-[#1a1033] text-left hover:bg-[#ffd93b] hover:text-[#1a1033]"
              >
                11. TROPHIES
              </button>
              <button
                onClick={() => {
                  setView('settings');
                  setMobileMenuOpen(false);
                }}
                className="p-2 border-2 border-black bg-[#1a1033] text-left hover:bg-[#ffd93b] hover:text-[#1a1033]"
              >
                12. SETTINGS
              </button>
            </div>
          </div>
        )}

        {/* Level Up Banner Notification */}
        {levelUpNotif && (
          <div className="bg-[#ffd93b] text-[#1a1033] border-b-4 border-black p-3 text-center font-arcade text-xs sm:text-sm animate-bounce shadow-[0px_4px_0px_#000]">
            ⚡ {levelUpNotif} ⚡
          </div>
        )}

        {/* Dynamic Viewport Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* VIEW: DASHBOARD */}
          {view === 'dashboard' && (
            <DashboardView
              profile={profile}
              posts={posts}
              quests={quests}
              dailyGoal={profile.dailyGoal ?? 3}
              onNavigate={(v) => {
                play8BitSound('click', appSettings.soundEnabled);
                setView(v);
              }}
              onOpenLogPost={() => setView('tracker')}
              onOpenDailyReward={() => setIsDailyChestOpen(true)}
              nextPostCountdown={countdownString}
            />
          )}

          {/* VIEW: WORLD MAP & INDIVIDUAL WORLDS 1, 2, 4, 5, 6, 7, 8 */}
          {(view === 'world-map' ||
            view === 'world-1' ||
            view === 'world-2' ||
            view === 'world-4' ||
            view === 'world-5' ||
            view === 'world-6' ||
            view === 'world-7' ||
            view === 'world-8') && (
            <WorldViewer
              worldId={view === 'world-map' ? 'world-1' : view}
              quests={quests}
              onToggleQuest={handleToggleQuest}
            />
          )}

          {/* VIEW: WORLD 3 POSTING TIME PLANNER */}
          {view === 'world-3' && (
            <PostingPlannerView
              slots={slots}
              onSaveSlots={(newSlots) => {
                setSlots(newSlots);
                savePostingSlots(newSlots);
              }}
              nextPostCountdown={countdownString}
            />
          )}

          {/* VIEW: PROMPT VAULT */}
          {view === 'prompts' && (
            <PromptVaultView
              prompts={prompts}
              onSavePrompts={(newPrompts) => {
                setPrompts(newPrompts);
                savePrompts(newPrompts);
              }}
              onIncrementXP={addXP}
            />
          )}

          {/* VIEW: UPLOAD TRACKER */}
          {view === 'tracker' && (
            <UploadTrackerView
              posts={posts}
              onSavePosts={(newPosts) => {
                setPosts(newPosts);
                savePostLogs(newPosts);
              }}
              streakDays={profile.streakDays}
              dailyGoal={profile.dailyGoal ?? 3}
              onUpdateDailyGoal={(g) => {
                const updated = { ...profile, dailyGoal: g };
                setProfile(updated);
                saveProfile(updated);
              }}
              postIntervalHours={profile.postIntervalHours ?? 12}
              onUpdateIntervalHours={(h) => {
                const updated = { ...profile, postIntervalHours: h };
                setProfile(updated);
                saveProfile(updated);
              }}
              onIncrementXP={addXP}
            />
          )}

          {/* VIEW: LEARNING LOG */}
          {view === 'learning' && (
            <LearningLogView
              learnings={learnings}
              onSaveLearnings={(newL) => {
                setLearnings(newL);
                saveLearningLogs(newL);
              }}
              onIncrementXP={addXP}
            />
          )}

          {/* VIEW: COMMENTARY NICHE CHANNELS */}
          {view === 'channels' && (
            <CommentaryChannelsView
              channels={channels}
              onSaveChannels={(newC) => {
                setChannels(newC);
                saveChannels(newC);
              }}
              onIncrementXP={addXP}
            />
          )}

          {/* VIEW: ACCOUNTS MANAGER */}
          {view === 'accounts' && (
            <AccountsManagerView onIncrementXP={addXP} />
          )}

          {/* VIEW: CAMPAIGN TRACKER & EARNINGS */}
          {view === 'campaigns' && (
            <CampaignTrackerView onIncrementXP={addXP} />
          )}

          {/* VIEW: HOOK LAB */}
          {view === 'hooklab' && <HookLabView onIncrementXP={addXP} />}

          {/* VIEW: ACHIEVEMENTS & WARDROBE */}
          {view === 'achievements' && (
            <AchievementsView
              profile={profile}
              onUpdateProfile={(p) => {
                setProfile(p);
                saveProfile(p);
              }}
              onEquipHat={(hat) => {
                const updated = { ...profile, equippedHat: hat };
                setProfile(updated);
                saveProfile(updated);
              }}
            />
          )}

          {/* VIEW: SETTINGS */}
          {view === 'settings' && (
            <SettingsView
              profile={profile}
              onUpdateProfile={(p) => {
                setProfile(p);
                saveProfile(p);
              }}
              currentTheme={appSettings.theme}
              onThemeChange={(th) => {
                const updated = { ...appSettings, theme: th };
                setAppSettings(updated);
                saveSettings(updated);
              }}
              crtEnabled={appSettings.crtEnabled}
              onToggleCrt={() => {
                const updated = { ...appSettings, crtEnabled: !appSettings.crtEnabled };
                setAppSettings(updated);
                saveSettings(updated);
              }}
              soundEnabled={appSettings.soundEnabled}
              onToggleSound={() => {
                const updated = { ...appSettings, soundEnabled: !appSettings.soundEnabled };
                setAppSettings(updated);
                saveSettings(updated);
              }}
              onRefreshAllData={handleRefreshAllData}
              onOpenTutorial={() => setIsOnboardingOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Daily Chest Mystery Loot Modal */}
      <DailyChestModal
        isOpen={isDailyChestOpen}
        onClose={() => setIsDailyChestOpen(false)}
        onClaim={handleClaimChest}
        alreadyClaimedToday={alreadyClaimedChest}
        soundEnabled={appSettings.soundEnabled}
      />

      {/* Onboarding Tutorial Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(newName) => {
          const updated: PlayerProfile = {
            ...profile,
            name: newName || profile.name,
            onboardingCompleted: true,
            coins: profile.coins + 20,
          };
          setProfile(updated);
          saveProfile(updated);
          addXP(50);
          setIsOnboardingOpen(false);
        }}
        playerName={profile.name}
        soundEnabled={appSettings.soundEnabled}
      />
    </div>
  );
}
