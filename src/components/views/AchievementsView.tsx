import React from 'react';
import { PlayerProfile } from '../../types';
import { ClippyMascot } from '../ClippyMascot';
import {
  Trophy,
  Award,
  Crown,
  Sparkles,
  ShoppingBag,
  Coins,
  Check,
  Shield,
  Zap,
} from 'lucide-react';

interface AchievementsViewProps {
  profile: PlayerProfile;
  onUpdateProfile: (profile: PlayerProfile) => void;
  onEquipHat: (hat: 'none' | 'crown' | 'cap' | 'wizard') => void;
}

interface ShopItem {
  id: string;
  name: string;
  cost: number;
  type: 'hat' | 'item';
  hatValue?: 'crown' | 'cap' | 'wizard';
  description: string;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'hat-cap',
    name: 'Retro Arcade Cap',
    cost: 50,
    type: 'hat',
    hatValue: 'cap',
    description: 'A classic 90s visor cap for Clippy.',
  },
  {
    id: 'hat-wizard',
    name: 'Prompt Wizard Hat',
    cost: 100,
    type: 'hat',
    hatValue: 'wizard',
    description: 'Channel your inner prompt engineer.',
  },
  {
    id: 'hat-crown',
    name: 'Algorithm Golden Crown',
    cost: 150,
    type: 'hat',
    hatValue: 'crown',
    description: 'Reserved for true virality royalty.',
  },
  {
    id: 'streak-freeze',
    name: 'Streak Freeze Shield',
    cost: 75,
    type: 'item',
    description: 'Automatically saves your streak if you miss a day.',
  },
];

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  profile,
  onUpdateProfile,
  onEquipHat,
}) => {
  const achievements = [
    {
      id: 'first-post',
      title: 'First Clip Dropped',
      desc: 'Log your first clip upload in the tracker.',
      unlocked: profile.xp >= 50,
      reward: '50 XP',
    },
    {
      id: 'streak-3',
      title: '3-Day Fire',
      desc: 'Maintain a 3-day consecutive posting streak.',
      unlocked: profile.streakDays >= 3,
      reward: '75 XP',
    },
    {
      id: 'level-5',
      title: 'Algorithm Apprentice',
      desc: 'Reach Player Level 5.',
      unlocked: profile.level >= 5,
      reward: '150 XP',
    },
    {
      id: 'scholar',
      title: 'Commentary Scholar',
      desc: 'Study 5 top commentary channels.',
      unlocked: true,
      reward: '100 XP',
    },
    {
      id: 'retention-detective',
      title: 'Retention Detective',
      desc: 'Upload an analytics study to the Learning Log.',
      unlocked: true,
      reward: '100 XP',
    },
    {
      id: '100k-club',
      title: '100,000 Views Club',
      desc: 'Cross 100k views on your logged posts.',
      unlocked: false,
      reward: '500 XP',
    },
  ];

  const handleBuyOrEquip = (item: ShopItem) => {
    const currentInventory = profile.inventory || [];
    if (item.type === 'hat' && item.hatValue) {
      const alreadyOwned = currentInventory.includes(item.id);
      if (alreadyOwned) {
        // Toggle or equip hat
        if (profile.equippedHat === item.hatValue) {
          onEquipHat('none');
        } else {
          onEquipHat(item.hatValue);
        }
      } else {
        // Buy hat
        if (profile.coins >= item.cost) {
          onUpdateProfile({
            ...profile,
            coins: profile.coins - item.cost,
            inventory: [...currentInventory, item.id],
            equippedHat: item.hatValue,
          });
        } else {
          alert('Not enough coins! Complete daily quests to earn coins.');
        }
      }
    } else if (item.id === 'streak-freeze') {
      if (profile.coins >= item.cost) {
        onUpdateProfile({
          ...profile,
          coins: profile.coins - item.cost,
          streakFreezes: profile.streakFreezes + 1,
          hasStreakFreeze: true,
          inventory: [...currentInventory, item.id],
        });
        alert('Streak Freeze Shield acquired! Your next missed day is protected.');
      } else {
        alert('Not enough coins!');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-black pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-arcade text-xs bg-[#ffd93b] text-[#1a1033] px-2.5 py-0.5 border-2 border-black">
                HALL OF FAME
              </span>
              <span className="font-arcade text-xs text-[#5dffa8]">
                LEVEL {profile.level} • {profile.rankTitle}
              </span>
            </div>
            <h2 className="font-arcade text-lg sm:text-2xl text-[#ffd93b] tracking-wider">
              ACHIEVEMENTS & CLIPPY WARDROBE
            </h2>
            <p className="font-vt text-xl text-[#fff4d6]">
              Unlock arcade trophies and spend your hard-earned coins on Clippy cosmetics.
            </p>
          </div>

          <div className="bg-black/60 border-2 border-black px-4 py-2 flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#ffd93b]" />
            <span className="font-arcade text-sm text-[#5dffa8]">
              {profile.coins} COINS
            </span>
          </div>
        </div>
      </div>

      {/* Clippy Wardrobe & Arcade Shop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clippy Live Preview */}
        <div className="bg-[#fff4d6] text-[#1a1033] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] flex flex-col items-center justify-center text-center">
          <span className="font-arcade text-[10px] text-[#ff4fa3] mb-4">
            EQUIPPED COMPANION
          </span>
          <ClippyMascot
            hasPostedToday={true}
            hat={profile.equippedHat}
            size="lg"
            showSpeechBubble={false}
          />
          <div className="mt-4">
            <h4 className="font-arcade text-xs text-[#1a1033]">
              COACH CLIPPY
            </h4>
            <span className="font-vt text-lg text-[#26164a]">
              Hat: {profile.equippedHat?.toUpperCase() || 'NONE'}
            </span>
          </div>
        </div>

        {/* Arcade Item Shop */}
        <div className="lg:col-span-2 bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#5dffa8]" />
              <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b]">
                ARCADE ITEM SHOP
              </h3>
            </div>
            <span className="font-vt text-lg text-[#b9a9db]">
              Earn coins by logging in daily & checking quests
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SHOP_ITEMS.map((item) => {
              const owned = (profile.inventory || []).includes(item.id);
              const isEquipped =
                item.type === 'hat' && profile.equippedHat === item.hatValue;

              return (
                <div
                  key={item.id}
                  className="bg-[#1a1033] border-2 border-black p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-arcade text-xs text-[#ffd93b]">
                        {item.name}
                      </span>
                      <span className="font-arcade text-[10px] text-[#5dffa8]">
                        {item.cost} COINS
                      </span>
                    </div>
                    <p className="font-vt text-base text-[#fff4d6] mb-3">
                      {item.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleBuyOrEquip(item)}
                    className={`font-arcade text-[10px] py-2 px-3 border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] ${
                      isEquipped
                        ? 'bg-[#5dffa8] text-[#1a1033]'
                        : owned
                        ? 'bg-[#35e0ff] text-[#1a1033]'
                        : 'bg-[#ff4fa3] text-white hover:bg-[#ff71ce]'
                    }`}
                  >
                    {isEquipped
                      ? '✓ EQUIPPED'
                      : owned
                      ? 'EQUIP'
                      : `BUY (${item.cost} COINS)`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <h3 className="font-arcade text-sm text-[#ffd93b] mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#ffd93b]" />
          <span>TROPHY CABINET</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 border-2 border-black flex items-start gap-3 ${
                ach.unlocked
                  ? 'bg-[#1a1033] text-[#fff4d6] border-[#5dffa8]'
                  : 'bg-black/40 text-gray-600 border-gray-800 opacity-60'
              }`}
            >
              <Award
                className={`w-7 h-7 flex-shrink-0 mt-0.5 ${
                  ach.unlocked ? 'text-[#ffd93b]' : 'text-gray-600'
                }`}
              />
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-arcade text-xs">
                    {ach.title}
                  </h4>
                  <span className="font-arcade text-[8px] bg-black/60 px-1.5 py-0.5 text-[#5dffa8]">
                    {ach.reward}
                  </span>
                </div>
                <p className="font-vt text-base mt-1 text-[#b9a9db]">
                  {ach.desc}
                </p>
                <span className="font-arcade text-[8px] text-[#5dffa8] block mt-2">
                  {ach.unlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
