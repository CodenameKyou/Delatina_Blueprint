import React from 'react';
import { ClippyMascot } from './ClippyMascot';
import { Play, Sparkles, Trophy, Video } from 'lucide-react';

interface LandingScreenProps {
  onStart?: () => void;
  onStartGame?: () => void;
  soundEnabled: boolean;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart, onStartGame }) => {
  const handleStart = onStart || onStartGame || (() => {});
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-8 bg-[#1a1033] text-[#fff4d6] relative overflow-hidden select-none">
      {/* Decorative Arcade Background Stars & Pixels */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-12 left-10 text-yellow-300 text-2xl animate-bounce">✦</div>
        <div className="absolute top-28 right-16 text-pink-400 text-3xl animate-pulse">★</div>
        <div className="absolute bottom-24 left-20 text-cyan-400 text-2xl animate-pulse">✦</div>
        <div className="absolute bottom-32 right-24 text-mint-400 text-3xl animate-bounce">★</div>
        <div className="absolute top-1/2 left-1/4 text-yellow-200 text-sm">■</div>
        <div className="absolute top-1/3 right-1/3 text-pink-300 text-sm">■</div>
      </div>

      {/* Top Arcade Marquee Header */}
      <header className="w-full max-w-4xl flex items-center justify-between border-b-4 border-black pb-4 z-10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#ff4fa3] border-2 border-black animate-ping" />
          <span className="font-arcade text-[10px] sm:text-xs text-[#ffd93b] tracking-wider">
            DELATINA, JOHN KENNETH (KYOUSUKENJI) PRESENTS
          </span>
        </div>
        <div className="font-arcade text-[10px] sm:text-xs text-[#35e0ff] border-2 border-black bg-black/40 px-3 py-1">
          HI-SCORE: 999,999
        </div>
      </header>

      {/* Center Game Title & Mascot Stage */}
      <main className="flex flex-col items-center justify-center my-auto text-center z-10 max-w-2xl">
        {/* Animated Mascot */}
        <div className="mb-4">
          <ClippyMascot
            mood="wave"
            size="xl"
            showSpeechBubble={true}
            customMessage="READY PLAYER ONE? LET'S BUILD YOUR CLIPPING EMPIRE!"
          />
        </div>

        {/* Creator Brand Logo Badge */}
        <div className="mb-3 inline-flex items-center gap-2.5 bg-[#26164a] border-4 border-black px-4 py-2 shadow-[4px_4px_0px_#000]">
          <div className="w-7 h-7 bg-gradient-to-br from-[#ffd93b] via-[#ff4fa3] to-[#35e0ff] border-2 border-black flex items-center justify-center font-arcade text-xs text-[#1a1033] font-black">
            JK
          </div>
          <div className="text-left">
            <span className="font-arcade text-[10px] sm:text-xs text-[#ffd93b] tracking-wider block">
              DELATINA, JOHN KENNETH
            </span>
            <span className="font-arcade text-[8px] text-[#5dffa8] tracking-widest block">
              (KYOUSUKENJI) • CREATOR LOGO
            </span>
          </div>
        </div>

        {/* Arcade Title Banner */}
        <div className="relative mb-6">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#ff4fa3] via-[#ffd93b] to-[#35e0ff] opacity-75 blur-none border-4 border-black transform -rotate-1"></div>
          <div className="relative bg-[#26164a] border-4 border-black px-6 sm:px-12 py-4 shadow-[8px_8px_0px_#000000]">
            <h1 className="font-arcade text-3xl sm:text-5xl md:text-6xl text-[#ffd93b] drop-shadow-[4px_4px_0px_#ff4fa3] tracking-widest">
              CLIPPER
              <br />
              <span className="text-[#35e0ff] drop-shadow-[4px_4px_0px_#1a1033]">QUEST</span>
            </h1>
          </div>
        </div>

        {/* Subtitle / Description */}
        <p className="font-vt text-xl sm:text-2xl text-[#fff4d6] max-w-lg mb-8 tracking-wide">
          The 8-bit learning hub & viral tracker for TikTok, Instagram Reels, and YouTube Shorts clippers.
        </p>

        {/* PRESS START Primary Action */}
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <button
            onClick={handleStart}
            className="w-full font-arcade text-sm sm:text-base bg-[#5dffa8] text-[#1a1033] py-4 px-6 border-4 border-black shadow-[6px_6px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000000] hover:bg-[#35e0ff] transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
            <span className="animate-blink">PRESS START</span>
          </button>

          <span className="font-arcade text-[10px] text-[#ff4fa3] uppercase tracking-widest">
            100% FREE • NO EXPERIENCE NEEDED
          </span>
        </div>

        {/* 3 Quick Game Features Bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-8 w-full">
          <div className="bg-[#2a1854] border-2 border-black p-2 shadow-[2px_2px_0px_#000000]">
            <Trophy className="w-4 h-4 mx-auto text-[#ffd93b] mb-1" />
            <div className="font-arcade text-[8px] sm:text-[9px] text-[#fff4d6]">XP & LEVELS</div>
          </div>
          <div className="bg-[#2a1854] border-2 border-black p-2 shadow-[2px_2px_0px_#000000]">
            <Video className="w-4 h-4 mx-auto text-[#35e0ff] mb-1" />
            <div className="font-arcade text-[8px] sm:text-[9px] text-[#fff4d6]">POST TRACKER</div>
          </div>
          <div className="bg-[#2a1854] border-2 border-black p-2 shadow-[2px_2px_0px_#000000]">
            <Sparkles className="w-4 h-4 mx-auto text-[#ff4fa3] mb-1" />
            <div className="font-arcade text-[8px] sm:text-[9px] text-[#fff4d6]">PROMPT VAULT</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center border-t-4 border-black pt-4 z-10">
        <p className="font-vt text-lg text-[#b9a9db]">
          Made for clippers, by clippers. Keep posting. Trust the process.
          <span className="animate-pulse font-bold text-[#ffd93b]"> _</span>
        </p>
      </footer>
    </div>
  );
};
