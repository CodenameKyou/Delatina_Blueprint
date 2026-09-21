import React, { useState, useEffect } from 'react';
import { MASCOT_TIPS } from '../data/initialData';

interface ClippyMascotProps {
  mood?: 'idle' | 'wave' | 'celebrate' | 'sleepy';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  customMessage?: string;
  hat?: string;
  hasPostedToday?: boolean;
  onBubbleClick?: () => void;
  className?: string;
}

export const ClippyMascot: React.FC<ClippyMascotProps> = ({
  mood: propMood,
  size = 'md',
  showSpeechBubble = true,
  customMessage,
  hat = 'none',
  hasPostedToday = true,
  onBubbleClick,
  className = '',
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  // Determine actual mood
  const currentMood = propMood || (hasPostedToday ? 'idle' : 'sleepy');

  // Rotate tips periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % MASCOT_TIPS.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Blinking cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3500);
    return () => clearInterval(blinkInterval);
  }, []);

  const sizePixels = {
    sm: 64,
    md: 96,
    lg: 128,
    xl: 160,
  }[size];

  const speechText = customMessage || MASCOT_TIPS[tipIndex];

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div
          onClick={onBubbleClick}
          className="cursor-pointer group mb-2 max-w-xs relative bg-[#fff4d6] text-[#1a1033] border-4 border-black px-3 py-2 shadow-[4px_4px_0px_#000000] transition-transform hover:-translate-y-1"
          style={{ imageRendering: 'pixelated' }}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-arcade text-[#ff4fa3] uppercase mb-0.5 tracking-wider">
            <span>👾 CLIPPY SAYS</span>
            <span className="text-[8px] text-gray-500 font-mono">(click for tip)</span>
          </div>
          <p className="font-vt text-lg leading-tight font-bold text-[#1a1033]">
            "{speechText}"
          </p>
          {/* Pixelated downward tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[8px] border-x-transparent border-t-[8px] border-t-black" />
          <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-[#fff4d6]" />
        </div>
      )}

      {/* Clippy SVG Pixel Art Character */}
      <div
        className={`relative transition-transform duration-300 ${
          currentMood === 'celebrate'
            ? 'animate-bounce'
            : currentMood === 'sleepy'
            ? 'opacity-85'
            : 'animate-pulse hover:scale-105'
        }`}
        style={{ width: sizePixels, height: sizePixels }}
      >
        <svg
          viewBox="0 0 48 48"
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ shapeRendering: 'crispEdges' }}
        >
          {/* Hat accessories */}
          {hat.includes('propeller') && (
            <g id="propeller-hat">
              <rect x="22" y="2" width="4" height="4" fill="#ffd93b" />
              <rect x="14" y="2" width="8" height="2" fill="#ff4fa3" />
              <rect x="26" y="2" width="8" height="2" fill="#35e0ff" />
              <rect x="20" y="6" width="8" height="2" fill="#ffd93b" />
            </g>
          )}
          {hat.includes('Crown') && (
            <g id="crown">
              <polygon points="16,8 20,3 24,7 28,3 32,8 32,10 16,10" fill="#ffd93b" stroke="#000" strokeWidth="1" />
              <rect x="18" y="5" width="2" height="2" fill="#ff4fa3" />
              <rect x="28" y="5" width="2" height="2" fill="#35e0ff" />
            </g>
          )}
          {hat.includes('Wizard') && (
            <g id="wizard-hat">
              <polygon points="24,1 15,10 33,10" fill="#5dffa8" stroke="#000" strokeWidth="1" />
              <rect x="22" y="5" width="4" height="2" fill="#ffd93b" />
            </g>
          )}

          {/* Top Film Reel Gears */}
          <rect x="14" y="8" width="8" height="8" rx="0" fill="#35e0ff" stroke="#000" strokeWidth="2" />
          <rect x="16" y="10" width="4" height="4" fill="#1a1033" />
          <rect x="26" y="8" width="8" height="8" rx="0" fill="#ff4fa3" stroke="#000" strokeWidth="2" />
          <rect x="28" y="10" width="4" height="4" fill="#1a1033" />
          <rect x="20" y="12" width="8" height="4" fill="#000" />

          {/* Main Camera Body (Pixel Box) */}
          <rect x="10" y="15" width="28" height="24" fill="#ffd93b" stroke="#000" strokeWidth="2" />
          {/* Inner Screen Bezel */}
          <rect x="14" y="18" width="20" height="15" fill="#1a1033" stroke="#000" strokeWidth="1" />

          {/* Lens on the right side */}
          <rect x="38" y="21" width="5" height="12" fill="#ff4fa3" stroke="#000" strokeWidth="2" />
          <rect x="40" y="24" width="2" height="6" fill="#35e0ff" />

          {/* Eyes inside Screen */}
          {isBlinking || currentMood === 'sleepy' ? (
            // Closed / Sleepy Eyes
            <g>
              <rect x="17" y="26" width="5" height="2" fill="#5dffa8" />
              <rect x="26" y="26" width="5" height="2" fill="#5dffa8" />
              {currentMood === 'sleepy' && (
                <text x="31" y="20" fill="#5dffa8" fontSize="6" fontFamily="monospace" fontWeight="bold">
                  zZ
                </text>
              )}
            </g>
          ) : (
            // Big Cute Expressive Eyes
            <g>
              {/* Left Eye */}
              <rect x="16" y="22" width="6" height="7" fill="#ffffff" />
              <rect x="18" y="24" width="4" height="5" fill="#35e0ff" />
              <rect x="19" y="25" width="2" height="2" fill="#1a1033" />
              <rect x="17" y="23" width="2" height="2" fill="#ffffff" />

              {/* Right Eye */}
              <rect x="26" y="22" width="6" height="7" fill="#ffffff" />
              <rect x="26" y="24" width="4" height="5" fill="#35e0ff" />
              <rect x="27" y="25" width="2" height="2" fill="#1a1033" />
              <rect x="29" y="23" width="2" height="2" fill="#ffffff" />

              {/* Cheek blush */}
              <rect x="14" y="28" width="2" height="2" fill="#ff4fa3" />
              <rect x="32" y="28" width="2" height="2" fill="#ff4fa3" />
            </g>
          )}

          {/* Mouth / Film Strip smile */}
          {currentMood === 'celebrate' ? (
            // Big open smile
            <g>
              <rect x="20" y="30" width="8" height="2" fill="#ff4fa3" />
              <rect x="22" y="32" width="4" height="2" fill="#ff4fa3" />
            </g>
          ) : currentMood === 'sleepy' ? (
            // Small sleepy line
            <rect x="21" y="30" width="6" height="1" fill="#b9a9db" />
          ) : (
            // Cute tiny pixel smile
            <g>
              <rect x="20" y="30" width="1" height="1" fill="#5dffa8" />
              <rect x="21" y="31" width="6" height="1" fill="#5dffa8" />
              <rect x="27" y="30" width="1" height="1" fill="#5dffa8" />
            </g>
          )}

          {/* Rec Button / LED indicator */}
          <circle cx="13" cy="18" r="1.5" fill="#ff4fa3" />

          {/* Arms / Hands */}
          {currentMood === 'wave' ? (
            <g>
              {/* Waving left arm up */}
              <rect x="6" y="16" width="4" height="3" fill="#ffd93b" stroke="#000" strokeWidth="1" />
              <rect x="4" y="13" width="3" height="4" fill="#ffd93b" stroke="#000" strokeWidth="1" />
              {/* Right arm normal */}
              <rect x="38" y="32" width="4" height="3" fill="#ffd93b" stroke="#000" strokeWidth="1" />
            </g>
          ) : currentMood === 'celebrate' ? (
            <g>
              {/* Both arms up cheering */}
              <rect x="5" y="16" width="5" height="3" fill="#ffd93b" stroke="#000" strokeWidth="1" />
              <rect x="3" y="13" width="3" height="4" fill="#ffd93b" stroke="#000" strokeWidth="1" />
              <rect x="40" y="16" width="5" height="3" fill="#ffd93b" stroke="#000" strokeWidth="1" />
              <rect x="42" y="13" width="3" height="4" fill="#ffd93b" stroke="#000" strokeWidth="1" />
            </g>
          ) : (
            <g>
              {/* Normal cute resting arms */}
              <rect x="6" y="27" width="4" height="4" fill="#ffd93b" stroke="#000" strokeWidth="1" />
              <rect x="37" y="31" width="3" height="4" fill="#ffd93b" stroke="#000" strokeWidth="1" />
            </g>
          )}

          {/* Legs / Tripod feet */}
          <rect x="15" y="39" width="4" height="5" fill="#000" />
          <rect x="13" y="44" width="8" height="2" fill="#35e0ff" stroke="#000" strokeWidth="1" />

          <rect x="29" y="39" width="4" height="5" fill="#000" />
          <rect x="27" y="44" width="8" height="2" fill="#35e0ff" stroke="#000" strokeWidth="1" />
        </svg>
      </div>

      {/* Sleepy status warning if no posts today */}
      {!hasPostedToday && (
        <span className="mt-1 font-arcade text-[8px] bg-red-950 text-red-400 px-2 py-0.5 border border-red-500 animate-pulse">
          💤 NO POSTS TODAY!
        </span>
      )}
    </div>
  );
};
