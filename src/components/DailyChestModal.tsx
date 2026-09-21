import React, { useState } from 'react';
import { Trophy, Coins, Sparkles, X, Gift } from 'lucide-react';
import { play8BitSound } from '../utils/sound';

interface DailyChestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (coins: number, xp: number) => void;
  alreadyClaimedToday: boolean;
  soundEnabled: boolean;
}

export const DailyChestModal: React.FC<DailyChestModalProps> = ({
  isOpen,
  onClose,
  onClaim,
  alreadyClaimedToday,
  soundEnabled,
}) => {
  const [opened, setOpened] = useState(false);
  const [rewardWon, setRewardWon] = useState<{ coins: number; xp: number } | null>(null);

  if (!isOpen) return null;

  const handleOpenChest = () => {
    if (alreadyClaimedToday || opened) return;

    // Random coins (25 to 50) and XP (50 to 100)
    const coins = Math.floor(Math.random() * 26) + 25;
    const xp = Math.floor(Math.random() * 51) + 50;

    play8BitSound('questComplete', soundEnabled);
    setOpened(true);
    setRewardWon({ coins, xp });
    onClaim(coins, xp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[8px_8px_0px_#000000] max-w-sm w-full text-center space-y-4 animate-scaleUp">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#ffd93b]" />
            <h3 className="font-arcade text-xs sm:text-sm text-[#ffd93b]">
              DAILY MYSTERY CHEST
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#b9a9db] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pixel Chest Graphic */}
        <div className="py-4">
          <div
            onClick={handleOpenChest}
            className={`w-28 h-28 mx-auto border-4 border-black flex flex-col items-center justify-center shadow-[4px_4px_0px_#000] cursor-pointer transition-transform ${
              opened
                ? 'bg-[#5dffa8] scale-105'
                : alreadyClaimedToday
                ? 'bg-gray-800 opacity-60 cursor-not-allowed'
                : 'bg-[#ffd93b] hover:scale-105 animate-bounce'
            }`}
          >
            {opened ? (
              <Sparkles className="w-12 h-12 text-[#1a1033]" />
            ) : alreadyClaimedToday ? (
              <Trophy className="w-10 h-10 text-gray-500" />
            ) : (
              <Gift className="w-12 h-12 text-[#1a1033]" />
            )}
            <span className="font-arcade text-[8px] text-[#1a1033] mt-1 font-bold">
              {opened ? 'OPENED!' : alreadyClaimedToday ? 'CLAIMED' : 'TAP TO OPEN'}
            </span>
          </div>
        </div>

        {/* Results Banner */}
        {opened && rewardWon ? (
          <div className="bg-[#1a1033] border-2 border-[#5dffa8] p-4 space-y-2">
            <span className="font-arcade text-xs text-[#5dffa8] block">
              LOOT UNLOCKED!
            </span>
            <div className="flex justify-center gap-4 font-arcade text-sm">
              <span className="text-[#ffd93b]">+{rewardWon.coins} COINS</span>
              <span className="text-[#35e0ff]">+{rewardWon.xp} XP</span>
            </div>
            <p className="font-vt text-lg text-[#fff4d6]">
              Keep returning daily to build your clipping empire!
            </p>
          </div>
        ) : alreadyClaimedToday ? (
          <p className="font-vt text-xl text-[#b9a9db]">
            You have already opened today's chest! Check back tomorrow for more loot.
          </p>
        ) : (
          <p className="font-vt text-xl text-[#fff4d6]">
            Open your daily login supply drop for bonus coins and XP!
          </p>
        )}

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full font-arcade text-xs bg-[#ffd93b] text-[#1a1033] py-2.5 px-4 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] cursor-pointer"
          >
            {opened ? 'COLLECT & RESUME QUEST' : 'CLOSE'}
          </button>
        </div>
      </div>
    </div>
  );
};
