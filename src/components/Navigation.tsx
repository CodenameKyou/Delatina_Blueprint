import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Calendar,
  Sparkles,
  Video,
  BookOpen,
  Tv,
  Calculator,
  Dice5,
  Users,
  Trophy,
  Settings,
  ChevronRight,
} from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  unreadCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard, category: 'main' },
    { id: 'world-map', label: 'WORLD MAP', icon: Compass, category: 'blueprints' },
    { id: 'world-1', label: 'W1: BEGINNER', icon: ChevronRight, category: 'worlds' },
    { id: 'world-2', label: 'W2: WARM-UP', icon: ChevronRight, category: 'worlds' },
    { id: 'world-3', label: 'W3: PLANNER', icon: Calendar, category: 'worlds' },
    { id: 'world-4', label: 'W4: IG GROWTH', icon: ChevronRight, category: 'worlds' },
    { id: 'world-5', label: 'W5: YT SHORTS', icon: ChevronRight, category: 'worlds' },
    { id: 'world-6', label: 'W6: TIKTOK', icon: ChevronRight, category: 'worlds' },
    { id: 'world-7', label: 'W7: IG ALON', icon: ChevronRight, category: 'worlds' },
    { id: 'world-8', label: 'W8: RIN METHOD', icon: ChevronRight, category: 'worlds' },
    { id: 'prompts', label: 'PROMPT VAULT', icon: Sparkles, category: 'tools' },
    { id: 'tracker', label: 'POST TRACKER', icon: Video, category: 'tools' },
    { id: 'learning', label: 'LEARNING LOG', icon: BookOpen, category: 'tools' },
    { id: 'hooklab', label: 'HOOK LAB', icon: Dice5, category: 'tools' },
    { id: 'campaigns', label: 'CAMPAIGNS', icon: Calculator, category: 'tools' },
    { id: 'accounts', label: 'ACCOUNTS', icon: Users, category: 'tools' },
    { id: 'channels', label: 'BENCHMARKS', icon: Tv, category: 'tools' },
    { id: 'achievements', label: 'TROPHIES', icon: Trophy, category: 'main' },
    { id: 'settings', label: 'SETTINGS', icon: Settings, category: 'main' },
  ];

  // Mobile Bottom Tab Bar 5 quick icons
  const mobileTabs = [
    { id: 'dashboard', label: 'HOME', icon: LayoutDashboard },
    { id: 'world-map', label: 'WORLDS', icon: Compass },
    { id: 'tracker', label: 'LOG', icon: Video },
    { id: 'prompts', label: 'SPELLS', icon: Sparkles },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
  ];

  return (
    <>
      {/* =========================================================================
          DESKTOP SIDEBAR (Visible on md and up)
      ========================================================================= */}
      <aside className="hidden md:flex flex-col w-64 bg-[#26164a] border-r-4 border-black h-screen sticky top-0 overflow-y-auto shadow-[4px_0px_0px_#000000] z-20">
        {/* Arcade Brand Header & Official Creator Logo */}
        <div className="p-3.5 border-b-4 border-black bg-[#1a1033]">
          <div
            onClick={() => onNavigate('dashboard')}
            className="cursor-pointer group flex items-center gap-2.5"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#ffd93b] via-[#ff4fa3] to-[#35e0ff] border-2 border-black flex items-center justify-center font-arcade text-xs text-[#1a1033] font-black shadow-[2px_2px_0px_#000] flex-shrink-0 group-hover:rotate-6 transition-transform">
              JK
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-arcade text-[9px] text-[#ffd93b] tracking-wider leading-tight group-hover:text-[#5dffa8] truncate">
                DELATINA, JOHN KENNETH
              </span>
              <span className="font-arcade text-[8px] text-[#5dffa8] tracking-wide">
                (KYOUSUKENJI)
              </span>
              <span className="font-vt text-sm text-[#35e0ff] leading-none mt-0.5">
                CLIPPER QUEST • ARCHITECT
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div className="p-3 space-y-4 flex-1">
          {/* Main Group */}
          <div>
            <span className="font-arcade text-[8px] text-[#ff4fa3] px-2 block mb-1">
              COMMAND
            </span>
            <div className="space-y-1">
              {navItems
                .filter((i) => i.category === 'main')
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 border-2 border-black font-arcade text-[10px] cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#ffd93b] text-[#1a1033] font-bold translate-x-1 shadow-[3px_3px_0px_#000]'
                          : 'bg-[#1a1033] text-[#fff4d6] hover:bg-[#35e0ff] hover:text-[#1a1033]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Worlds / Quests Blueprint Group */}
          <div>
            <span className="font-arcade text-[8px] text-[#35e0ff] px-2 block mb-1">
              BLUEPRINT WORLDS
            </span>
            <div className="space-y-1">
              {navItems
                .filter((i) => i.category === 'worlds' || i.category === 'blueprints')
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 border border-black font-arcade text-[9px] cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#5dffa8] text-[#1a1033] font-bold translate-x-1 shadow-[2px_2px_0px_#000]'
                          : 'bg-[#1a1033] text-[#b9a9db] hover:bg-[#ff4fa3] hover:text-[#fff4d6]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Tools & Vaults Group */}
          <div>
            <span className="font-arcade text-[8px] text-[#5dffa8] px-2 block mb-1">
              CREATOR ARSENAL
            </span>
            <div className="space-y-1">
              {navItems
                .filter((i) => i.category === 'tools')
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 border-2 border-black font-arcade text-[9px] cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#35e0ff] text-[#1a1033] font-bold translate-x-1 shadow-[2px_2px_0px_#000]'
                          : 'bg-[#1a1033] text-[#fff4d6] hover:bg-[#ffd93b] hover:text-[#1a1033]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer with Creator Signature */}
        <div className="p-2.5 border-t-2 border-black bg-[#1a1033] text-center">
          <span className="font-arcade text-[8px] text-[#ffd93b] block">
            DELATINA, JOHN KENNETH
          </span>
          <span className="font-vt text-xs text-[#5dffa8]">
            Kyousukenji • Clipper Quest v1.0
          </span>
        </div>
      </aside>

      {/* =========================================================================
          MOBILE BOTTOM TAB BAR (Visible on mobile only)
      ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#26164a] border-t-4 border-black z-40 px-2 py-1 shadow-[0px_-4px_0px_#000000]">
        <div className="grid grid-cols-5 gap-1">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 border-2 border-black transition-all ${
                  isActive
                    ? 'bg-[#ffd93b] text-[#1a1033] font-bold shadow-[2px_2px_0px_#000]'
                    : 'bg-[#1a1033] text-[#fff4d6] hover:bg-[#35e0ff] hover:text-[#1a1033]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-arcade text-[7px] mt-0.5 whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
