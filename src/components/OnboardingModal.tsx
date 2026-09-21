import React, { useState } from 'react';
import { ClippyMascot } from './ClippyMascot';
import { play8BitSound } from '../utils/sound';
import {
  Sparkles,
  Trophy,
  Compass,
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  Gamepad2,
  X,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (newName?: string) => void;
  playerName: string;
  soundEnabled: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  playerName,
  soundEnabled,
}) => {
  const [step, setStep] = useState<number>(0);
  const [tempName, setTempName] = useState(playerName);

  if (!isOpen) return null;

  const totalSteps = 4;

  const handleNext = () => {
    play8BitSound('click', soundEnabled);
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      play8BitSound('levelup', soundEnabled);
      onComplete(tempName.trim() || playerName);
    }
  };

  const handleBack = () => {
    play8BitSound('click', soundEnabled);
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
      <div className="bg-[#26164a] border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_#000000] max-w-xl w-full text-[#fff4d6] relative animate-scaleUp">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b-4 border-black pb-3 mb-6">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-[#ffd93b]" />
            <span className="font-arcade text-xs sm:text-sm text-[#ffd93b]">
              HOW TO PLAY • STEP {step + 1}/{totalSteps}
            </span>
          </div>

          <button
            onClick={() => {
              play8BitSound('click', soundEnabled);
              onClose();
            }}
            className="text-[#b9a9db] hover:text-white border-2 border-black bg-black/40 p-1 cursor-pointer"
            title="Skip Tutorial"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="min-h-[280px] flex flex-col justify-between">
          {/* STEP 0: WELCOME & IDENTITY */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ClippyMascot mood="wave" size="lg" />
                <div>
                  <h3 className="font-arcade text-base text-[#5dffa8] mb-1">
                    WELCOME TO CLIPPER QUEST!
                  </h3>
                  <p className="font-vt text-xl text-[#b9a9db] leading-relaxed">
                    I am Clippy, your 8-bit clipping companion! Ready to turn raw footage
                    into millions of viral views and build your creator empire?
                  </p>
                </div>
              </div>

              <div className="bg-[#1a1033] border-2 border-black p-4 mt-2">
                <label className="font-arcade text-[9px] text-[#ffd93b] block mb-2">
                  CHOOSE YOUR CLIPPER CALLSIGN:
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  maxLength={18}
                  placeholder="e.g. NeoClipper"
                  className="w-full font-arcade text-sm bg-black text-[#5dffa8] p-2.5 border-2 border-[#ff4fa3] outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 1: THE 8 WORLDS */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Compass className="w-8 h-8 text-[#35e0ff] flex-shrink-0" />
                <div>
                  <h3 className="font-arcade text-sm sm:text-base text-[#35e0ff]">
                    CONQUER THE 8 WORLDS
                  </h3>
                  <p className="font-vt text-lg text-[#b9a9db]">
                    A structured step-by-step masterclass disguised as an arcade game.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left bg-[#1a1033] border-2 border-black p-3">
                <div className="p-2 border border-black bg-[#2f1c5c]">
                  <span className="font-arcade text-[9px] text-[#ffd93b] block">WORLD 1-2</span>
                  <span className="font-vt text-base text-[#fff4d6]">Niche Hunting & Editing Flow</span>
                </div>
                <div className="p-2 border border-black bg-[#2f1c5c]">
                  <span className="font-arcade text-[9px] text-[#ff4fa3] block">WORLD 3-4</span>
                  <span className="font-vt text-base text-[#fff4d6]">Prime Times & Account Setup</span>
                </div>
                <div className="p-2 border border-black bg-[#2f1c5c]">
                  <span className="font-arcade text-[9px] text-[#35e0ff] block">WORLD 5-6</span>
                  <span className="font-vt text-base text-[#fff4d6]">Hook Mastery & 100K Views</span>
                </div>
                <div className="p-2 border border-black bg-[#2f1c5c]">
                  <span className="font-arcade text-[9px] text-[#5dffa8] block">WORLD 7-8</span>
                  <span className="font-vt text-base text-[#fff4d6]">Monetization & Viral Empire</span>
                </div>
              </div>

              <p className="font-vt text-lg text-[#ffd93b]">
                Complete interactive checkboxes to earn XP, level up, and unlock new world maps!
              </p>
            </div>
          )}

          {/* STEP 2: FLEET & WARM-UP RULES */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-[#ff4fa3] flex-shrink-0" />
                <div>
                  <h3 className="font-arcade text-sm sm:text-base text-[#ff4fa3]">
                    FLEET MANAGEMENT & WARM-UP
                  </h3>
                  <p className="font-vt text-lg text-[#b9a9db]">
                    Never get shadowbanned on Day 1.
                  </p>
                </div>
              </div>

              <div className="bg-[#1a1033] border-2 border-black p-3 space-y-2 text-left">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-[#5dffa8] border border-black mt-1 flex-shrink-0" />
                  <p className="font-vt text-lg text-[#fff4d6]">
                    <span className="text-[#5dffa8] font-bold">Rule 1:</span> Set minimum age to 25+ for Tier 2/3 countries to protect RPM rates.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-[#ffd93b] border border-black mt-1 flex-shrink-0" />
                  <p className="font-vt text-lg text-[#fff4d6]">
                    <span className="text-[#ffd93b] font-bold">Rule 2:</span> Spend 15 minutes daily browsing your niche to train the algorithm feed.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-[#35e0ff] border border-black mt-1 flex-shrink-0" />
                  <p className="font-vt text-lg text-[#fff4d6]">
                    <span className="text-[#35e0ff] font-bold">Rule 3:</span> Only start posting on Day 3 or 4 when your account is marked "Ready"!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LOGGING & REWARDS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-[#ffd93b] flex-shrink-0" />
                <div>
                  <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b]">
                    LOG POSTS, EARN LOOT & LEVEL UP
                  </h3>
                  <p className="font-vt text-lg text-[#b9a9db]">
                    Consistency is your ultimate multiplier.
                  </p>
                </div>
              </div>

              <div className="bg-[#1a1033] border-2 border-black p-4 space-y-2 text-left">
                <p className="font-vt text-xl text-[#fff4d6]">
                  ★ <strong className="text-[#5dffa8]">Track Uploads:</strong> Log videos to preserve streaks and trigger the 12-hour rest countdown timer.
                </p>
                <p className="font-vt text-xl text-[#fff4d6]">
                  ★ <strong className="text-[#35e0ff]">Retention Auditor:</strong> Analyze where viewers drop off and write post-mortem insights.
                </p>
                <p className="font-vt text-xl text-[#fff4d6]">
                  ★ <strong className="text-[#ff4fa3]">Arcade Item Shop:</strong> Spend earned coins on retro hats, shields, and custom pixel themes!
                </p>
              </div>

              <div className="border border-[#ffd93b] bg-black/50 p-2 text-center">
                <span className="font-arcade text-xs text-[#ffd93b] animate-pulse">
                  REWARD FOR FINISHING: +50 XP & +20 COINS!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation & Progress Dots */}
        <div className="flex items-center justify-between border-t-4 border-black pt-4 mt-6">
          {step > 0 ? (
            <button
              onClick={handleBack}
              className="font-arcade text-xs bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 border-2 border-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK</span>
            </button>
          ) : (
            <div />
          )}

          {/* Progress Indicators */}
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 border-2 border-black ${
                  idx === step
                    ? 'bg-[#ffd93b] shadow-[1px_1px_0px_#000]'
                    : idx < step
                    ? 'bg-[#5dffa8]'
                    : 'bg-black/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="font-arcade text-xs bg-[#5dffa8] hover:bg-[#35e0ff] text-[#1a1033] py-2 px-4 border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] flex items-center gap-1 cursor-pointer font-bold"
          >
            <span>{step === totalSteps - 1 ? 'START QUEST' : 'NEXT'}</span>
            {step === totalSteps - 1 ? (
              <Check className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
