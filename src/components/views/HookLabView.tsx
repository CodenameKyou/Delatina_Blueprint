import React, { useState } from 'react';
import {
  Dice5,
  Sparkles,
  Copy,
  Check,
  Zap,
  AlertCircle,
  CheckCircle2,
  Bookmark,
  Shuffle,
  FileText,
  ExternalLink,
  Code,
  Flame,
} from 'lucide-react';

const HOOK_OPENERS = [
  'Nobody is talking about how',
  'This is the exact moment when',
  'If you ever see this, do NOT',
  'Why does nobody know that',
  'I spent 30 hours analyzing why',
  'The dark truth behind',
  'This one mistake cost him',
  'What happens when you actually',
  'You have been lied to about',
  'This feels illegal to know, but',
];

const HOOK_SUBJECTS = [
  'the greatest NFL comeback in history',
  'how SunnyV2 secretly writes his hooks',
  'the scariest mystery in the ocean',
  'how this 19-year-old made $50k clipping',
  'why TikTok algorithm suddenly shadowbans you',
  'what pilots see at 35,000 feet',
  'the most terrifying psychological experiment',
  'why your retention drops after 3 seconds',
];

const HOOK_TWISTS = [
  '...and it ruined everything.',
  '...and nobody noticed until now.',
  '...in under 24 hours.',
  '...and the ending will shock you.',
  '...and it completely changed the game.',
  '...pay close attention to this frame.',
];

// Copyable Prompts Library for Hook Lab
interface CopyablePrompt {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  template: string;
  placeholderKey: string;
  defaultVal: string;
}

const COPYABLE_PROMPTS: CopyablePrompt[] = [
  {
    id: 'primary-hook-rephrase',
    title: 'OFFICIAL HOOK REPHRASER (GENZ + PRO)',
    badge: 'USER PRESET ★',
    badgeColor: 'bg-[#ff4fa3] text-[#fff4d6]',
    description: 'Under 12 words, 50% original tone + GenZ meme intrigue, high readability in 3 seconds.',
    placeholderKey: '[Paste Your Copied Hook Here]',
    defaultVal: 'This one mistake cost him his entire multimillion dollar career in 10 seconds',
    template: `Rephrase this hook

Hook: [Paste Your Copied Hook Here]

DO NOT make it long that it's like a complete sentence.
Keep it under <12 words only.
Make it sound Professional and keep 50% tone of the original hook and add some GENZ Meme words combined but DO NOT over do it.
It must be easy to read by the viewer in the first few 3 seconds.`,
  },
  {
    id: 'tagalog-hook-rephrase',
    title: 'TAGALOG / PINOY CLIPPER HOOK PROMPT',
    badge: 'TAGALOG 🇵🇭',
    badgeColor: 'bg-[#ffd93b] text-[#1a1033]',
    description: 'Pinoy viral hook formula: mabilis basahin, walang patay na oras, may curiosity gap.',
    placeholderKey: '[Ilagay ang hook dito]',
    defaultVal: 'Bakit bawal i-submit agad ang TikTok link pagka-post mo?',
    template: `I-rephrase mo itong hook para maging viral short-form video hook:

Hook: [Ilagay ang hook dito]

Bawal mahaba, hindi dapat mukhang buong paragraph.
Gawing under 12 words lang.
Panatilihing professional pero haluan ng GenZ / Taglish curiosity vibe.
Dapat kayang basahin ng viewer sa loob ng 1 hanggang 2 segundo bago mag-swipe.`,
  },
  {
    id: 'curiosity-spike-5',
    title: '5-IN-1 RETENTION SPIKE HOOK GENERATOR',
    badge: 'ALGORITHM HACK',
    badgeColor: 'bg-[#5dffa8] text-[#1a1033]',
    description: 'Generates 5 intense curiosity-driven hooks that lock viewers before 2 seconds.',
    placeholderKey: '[Enter topic or story summary here]',
    defaultVal: 'Terrifying mystery of a deep sea diver who disappeared without a trace',
    template: `Generate 5 viral short-form hooks based on this topic/story:
Topic: [Enter topic or story summary here]

Rules:
1. Must be under 12 words.
2. Must trigger an irresistible curiosity gap or emotional shock.
3. First 3 words must stop the thumb immediately.
4. Deliverable within 2 seconds of video playback.`,
  },
  {
    id: 'ig-seo-caption',
    title: 'INSTAGRAM CAPTION SEO OPTIMIZER',
    badge: 'SEARCH SEO',
    badgeColor: 'bg-[#35e0ff] text-[#1a1033]',
    description: 'Weaves high-traffic SEO keywords naturally into your reel captions for viral discovery.',
    placeholderKey: '[paste caption here]',
    defaultVal: 'NFL highlights from last night where Patrick Mahomes did the unthinkable in overtime.',
    template: `Rephrase the following Instagram caption with SEO keywords woven in naturally. Keep the same story, tone, and flow. Do not fact-check or correct any details. Rewrite every sentence in your own words, do NOT copy any part of the original caption word for word. Optimize for reach and discoverability. Add 2-3 relevant emojis and a CTA at the end. List the SEO keywords used at the bottom.

Caption: [paste caption here]`,
  },
  {
    id: 'quick-seo-no-bullets',
    title: 'QUICK SEO REPHRASE (NO BULLETS)',
    badge: 'CLEAN SEO',
    badgeColor: 'bg-[#b9a9db] text-[#1a1033]',
    description: 'Replaces generic wording with searchable algorithmic keywords without bullet formatting.',
    placeholderKey: '[Paste original text here]',
    defaultVal: 'How to warm up an Instagram account properly so you get views in the US.',
    template: `Rephrase this using SEO keywords.
Do not add bullet points.
Rewrite some words with SEO Keywords.

Text: [Paste original text here]`,
  },
  {
    id: 'hashtag-harvester',
    title: 'TARGETED HASHTAG HARVESTER',
    badge: 'TIKTOK & REELS',
    badgeColor: 'bg-[#ff71ce] text-[#1a1033]',
    description: '4 hyper-targeted niche tags + 1 broad tag, avoiding shadowbanned spam tags.',
    placeholderKey: '[Enter Niche Here]',
    defaultVal: 'NFL Football / Sports Edits',
    template: `Generate 4 highly specific, targeted hashtags and 1 broad hashtag for a short-form video in the [Enter Niche Here] niche.
Make sure none of them are banned or flagged.
Do not use generic spam hashtags like #fyp or #viral.`,
  },
  {
    id: 'dropoff-analytics-fix',
    title: 'ANALYTICS DROP-OFF SURGERY (MAG-BASE SA GRAPH)',
    badge: 'DROP SURGERY',
    badgeColor: 'bg-red-500 text-white',
    description: 'Fixes hooks that fail the first 3 seconds graph retention test in analytics.',
    placeholderKey: '[Paste current hook/opening script]',
    defaultVal: 'Today we are looking at why this streamer lost all his followers in one week.',
    template: `My short-form video dropped in retention at the first 3 seconds:
Current Hook: [Paste current hook/opening script]

Mag-base ka sa analytics drop-off: Ang goal ay mapigilan ang pag-swipe.
Rewrite this hook into 3 aggressive alternative hooks under 10 words that immediately lock the viewer's gaze and make swiping impossible.`,
  },
];

export const HookLabView: React.FC<{ onIncrementXP?: (amount: number) => void }> = ({
  onIncrementXP,
}) => {
  // Selected Copyable Prompt Tab
  const [activePromptId, setActivePromptId] = useState<string>('primary-hook-rephrase');
  const [promptCustomInput, setPromptCustomInput] = useState<string>('');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Slot Machine / Roulette State
  const [openerIndex, setOpenerIndex] = useState(0);
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [twistIndex, setTwistIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [copiedSlotHook, setCopiedSlotHook] = useState(false);

  // Hook Audit State
  const [userHookInput, setUserHookInput] = useState(
    'This one mistake cost him his entire multimillion dollar career in 10 seconds'
  );
  const [savedHooks, setSavedHooks] = useState<string[]>([
    'Nobody talks about what actually happened at 0:03...',
    'This is why 99% of short-form video clippers fail.',
    'Bakit bawal i-submit agad ang TikTok link pagka-post mo?',
    'This feels illegal to know, but SunnyV2 does this every video.',
  ]);

  const activePrompt = COPYABLE_PROMPTS.find((p) => p.id === activePromptId) || COPYABLE_PROMPTS[0];

  const getComputedPromptText = (prompt: CopyablePrompt) => {
    const inputVal = promptCustomInput.trim() || prompt.defaultVal;
    return prompt.template.replace(prompt.placeholderKey, inputVal);
  };

  const handleCopyPrompt = (prompt: CopyablePrompt, raw: boolean = false) => {
    const textToCopy = raw ? prompt.template : getComputedPromptText(prompt);
    navigator.clipboard.writeText(textToCopy);
    setCopiedPromptId(prompt.id);
    setTimeout(() => setCopiedPromptId(null), 2000);
    if (onIncrementXP) onIncrementXP(15);
  };

  const spinSlotMachine = () => {
    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      setOpenerIndex(Math.floor(Math.random() * HOOK_OPENERS.length));
      setSubjectIndex(Math.floor(Math.random() * HOOK_SUBJECTS.length));
      setTwistIndex(Math.floor(Math.random() * HOOK_TWISTS.length));
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        setIsSpinning(false);
        if (onIncrementXP) onIncrementXP(15);
      }
    }, 80);
  };

  const currentGeneratedHook = `${HOOK_OPENERS[openerIndex]} ${HOOK_SUBJECTS[subjectIndex]} ${HOOK_TWISTS[twistIndex]}`;

  // Word count calculation
  const words = userHookInput.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const isWordCountGood = wordCount <= 12 && wordCount > 0;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSlotHook(true);
    setTimeout(() => setCopiedSlotHook(false), 2000);
  };

  const handleSaveHook = () => {
    if (!userHookInput.trim()) return;
    setSavedHooks([userHookInput.trim(), ...savedHooks]);
    if (onIncrementXP) onIncrementXP(20);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-arcade text-xs bg-[#ff4fa3] text-[#fff4d6] px-2.5 py-0.5 border-2 border-black">
            VIRAL LAB
          </span>
          <span className="font-arcade text-xs text-[#5dffa8]">
            RETENTION FIRST
          </span>
          <span className="font-arcade text-[10px] bg-[#ffd93b] text-[#1a1033] px-2 py-0.5 border-2 border-black ml-auto">
            BY DELATINA, JOHN KENNETH
          </span>
        </div>
        <h2 className="font-arcade text-lg sm:text-2xl text-[#ffd93b] tracking-wider">
          HOOK LAB & COPYABLE AI PROMPTS
        </h2>
        <p className="font-vt text-xl text-[#fff4d6]">
          World 4 Rule: A hook MUST spark instant curiosity and be deliverable within 3 seconds (under 12 words).
          Copy battle-tested prompts straight into ChatGPT, Gemini, or Claude.
        </p>
      </div>

      {/* =========================================================================
          SECTION 1: COPYABLE AI HOOK PROMPTS (THE USER'S REQUESTED PROMPTS)
      ========================================================================= */}
      <div className="bg-[#2f1c5c] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-black pb-3 gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#ffd93b]" />
            <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b]">
              COPYABLE AI HOOK PROMPTS (1-CLICK COPY)
            </h3>
          </div>
          <span className="font-arcade text-[10px] text-[#5dffa8] bg-[#1a1033] border border-black px-2.5 py-1">
            ✓ ALL PROMPTS READY TO COPY
          </span>
        </div>

        <p className="font-vt text-xl text-[#fff4d6]">
          Select a prompt below, type your draft hook or text (or use default), and click <strong>COPY PROMPT</strong> to paste directly into AI.
        </p>

        {/* Prompt Selector Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {COPYABLE_PROMPTS.map((p) => {
            const isSelected = p.id === activePromptId;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActivePromptId(p.id);
                  setPromptCustomInput('');
                }}
                className={`font-arcade text-[9px] sm:text-[10px] px-3 py-2 border-2 border-black cursor-pointer transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#ffd93b] text-[#1a1033] font-bold shadow-[3px_3px_0px_#000] -translate-y-0.5'
                    : 'bg-[#1a1033] text-[#fff4d6] hover:bg-[#35e0ff] hover:text-[#1a1033]'
                }`}
              >
                <span className={`px-1.5 py-0.2 border border-black text-[8px] ${p.badgeColor}`}>
                  {p.badge}
                </span>
                <span>{p.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Prompt Interactive Card */}
        <div className="bg-[#1a1033] border-4 border-black p-5 shadow-[4px_4px_0px_#000] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-black pb-3 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-arcade text-[9px] px-2 py-0.5 border border-black ${activePrompt.badgeColor}`}>
                  {activePrompt.badge}
                </span>
                <h4 className="font-arcade text-xs sm:text-sm text-[#ffd93b]">
                  {activePrompt.title}
                </h4>
              </div>
              <p className="font-vt text-lg text-[#b9a9db] mt-1">
                {activePrompt.description}
              </p>
            </div>

            {/* Copy Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyPrompt(activePrompt, false)}
                className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2.5 px-4 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-1.5 font-bold"
              >
                {copiedPromptId === activePrompt.id ? (
                  <>
                    <Check className="w-4 h-4 text-[#1a1033]" />
                    <span>COPIED TO CLIPBOARD! (+15 XP)</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#1a1033]" />
                    <span>COPY FILLED PROMPT</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleCopyPrompt(activePrompt, true)}
                className="font-arcade text-[10px] bg-[#26164a] text-[#ffd93b] py-2.5 px-3 border-2 border-black hover:bg-black cursor-pointer"
                title="Copy raw template with brackets"
              >
                RAW
              </button>
            </div>
          </div>

          {/* Fill In Placeholder Live */}
          <div className="space-y-1">
            <label className="font-arcade text-[10px] text-[#35e0ff] flex items-center justify-between">
              <span>REPLACE {activePrompt.placeholderKey}:</span>
              <span className="text-[#b9a9db] text-[8px]">Type below to auto-inject into prompt</span>
            </label>
            <input
              type="text"
              value={promptCustomInput}
              onChange={(e) => setPromptCustomInput(e.target.value)}
              placeholder={`Default: "${activePrompt.defaultVal}"`}
              className="w-full font-vt text-xl bg-black text-[#fff4d6] border-2 border-black p-2.5 outline-none focus:border-[#5dffa8]"
            />
          </div>

          {/* Formatted Code Block of Prompt */}
          <div className="space-y-1">
            <div className="flex items-center justify-between font-arcade text-[9px] text-[#b9a9db]">
              <span>PROMPT PREVIEW (READY TO PASTE INTO CHATGPT / CLAUDE / GEMINI):</span>
            </div>
            <pre className="bg-black/90 border-2 border-black p-4 font-mono text-xs sm:text-sm text-[#5dffa8] whitespace-pre-wrap leading-relaxed overflow-x-auto shadow-inner">
              {getComputedPromptText(activePrompt)}
            </pre>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: 8-BIT SLOT MACHINE HOOK GENERATOR
      ========================================================================= */}
      <div className="bg-[#2f1c5c] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Dice5 className="w-6 h-6 text-[#ffd93b]" />
            <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b]">
              HOOK ROULETTE (SLOT MACHINE)
            </h3>
          </div>
          <span className="font-arcade text-[10px] text-[#35e0ff]">
            VIRAL FORMULA ENGINE
          </span>
        </div>

        {/* Slot Machine Display Windows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div className="bg-black border-4 border-[#ff4fa3] p-4 text-center min-h-[90px] flex items-center justify-center">
            <span
              className={`font-arcade text-xs sm:text-sm text-[#ff4fa3] ${
                isSpinning ? 'animate-pulse' : ''
              }`}
            >
              {HOOK_OPENERS[openerIndex]}
            </span>
          </div>

          <div className="bg-black border-4 border-[#ffd93b] p-4 text-center min-h-[90px] flex items-center justify-center">
            <span
              className={`font-arcade text-xs sm:text-sm text-[#ffd93b] ${
                isSpinning ? 'animate-pulse' : ''
              }`}
            >
              {HOOK_SUBJECTS[subjectIndex]}
            </span>
          </div>

          <div className="bg-black border-4 border-[#35e0ff] p-4 text-center min-h-[90px] flex items-center justify-center">
            <span
              className={`font-arcade text-xs sm:text-sm text-[#35e0ff] ${
                isSpinning ? 'animate-pulse' : ''
              }`}
            >
              {HOOK_TWISTS[twistIndex]}
            </span>
          </div>
        </div>

        {/* Result Hook Banner */}
        <div className="bg-[#1a1033] border-2 border-black p-4 my-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-vt text-2xl text-[#5dffa8] leading-tight text-center sm:text-left">
            "{currentGeneratedHook}"
          </p>

          <button
            onClick={() => handleCopy(currentGeneratedHook)}
            className="font-arcade text-xs bg-[#ffd93b] text-[#1a1033] py-2 px-4 border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#5dffa8] cursor-pointer flex items-center gap-1.5 flex-shrink-0"
          >
            {copiedSlotHook ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSlotHook ? 'COPIED!' : 'COPY HOOK'}</span>
          </button>
        </div>

        {/* Spin Button */}
        <div className="text-center pt-2">
          <button
            onClick={spinSlotMachine}
            disabled={isSpinning}
            className="font-arcade text-sm bg-[#5dffa8] text-[#1a1033] py-3.5 px-8 border-4 border-black shadow-[6px_6px_0px_#000000] hover:bg-[#35e0ff] active:translate-x-1 active:translate-y-1 cursor-pointer disabled:opacity-50"
          >
            {isSpinning ? 'SPINNING...' : '🎰 PULL LEVER / SPIN ROULETTE (+15 XP)'}
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: HOOK AUDIT & 12-WORD VALIDATOR TOOL
      ========================================================================= */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-black pb-3">
          <Zap className="w-5 h-5 text-[#ff4fa3]" />
          <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b]">
            12-WORD RETENTION AUDIT TOOL
          </h3>
        </div>

        <p className="font-vt text-xl text-[#fff4d6]">
          Viewers make up their mind in 2 seconds. If your on-screen hook takes more than 12 words to read, thumbs swipe away.
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-arcade text-[10px] text-[#35e0ff]">
              ENTER YOUR DRAFT HOOK:
            </label>
            <span
              className={`font-arcade text-xs px-2 py-0.5 border ${
                isWordCountGood
                  ? 'bg-[#5dffa8]/20 text-[#5dffa8] border-[#5dffa8]'
                  : 'bg-red-500/20 text-red-400 border-red-500'
              }`}
            >
              {wordCount} / 12 WORDS {isWordCountGood ? '✓ OPTIMAL' : '⚠ TOO WORDY'}
            </span>
          </div>

          <textarea
            rows={3}
            value={userHookInput}
            onChange={(e) => setUserHookInput(e.target.value)}
            className="w-full font-vt text-2xl bg-black text-[#fff4d6] border-2 border-black p-3 outline-none focus:border-[#ffd93b]"
          />
        </div>

        {/* Live Retention Feedback */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className={`p-3 border-2 border-black flex items-center gap-2 ${
              isWordCountGood ? 'bg-[#1a1033] text-[#5dffa8]' : 'bg-[#3b1220] text-red-300'
            }`}
          >
            {isWordCountGood ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#5dffa8]" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            )}
            <span className="font-vt text-lg">
              {isWordCountGood
                ? 'Hook length is punchy! Easily readable in under 3 seconds.'
                : 'Over 12 words! Cut out fluff words to stop the viewer from swiping.'}
            </span>
          </div>

          <div className="p-3 border-2 border-black bg-[#1a1033] text-[#ffd93b] flex items-center gap-2">
            <Sparkles className="w-5 h-5 flex-shrink-0" />
            <span className="font-vt text-lg">
              Curiosity rating: 9/10 (Creates open information loop).
            </span>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={handleSaveHook}
            className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2 px-4 border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#35e0ff] cursor-pointer"
          >
            + SAVE TO MY HOOKS (+20 XP)
          </button>
        </div>
      </div>

      {/* Saved Hooks Library */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <h3 className="font-arcade text-sm text-[#ffd93b] mb-4">
          SAVED HOOK VAULT ({savedHooks.length})
        </h3>
        <div className="space-y-2">
          {savedHooks.map((h, i) => (
            <div
              key={i}
              className="bg-[#1a1033] border-2 border-black p-3 flex items-center justify-between gap-2"
            >
              <span className="font-vt text-xl text-[#fff4d6]">"{h}"</span>
              <button
                onClick={() => handleCopy(h)}
                className="font-arcade text-[9px] bg-[#2a1854] text-[#ffd93b] px-2.5 py-1 border border-black hover:bg-[#ff4fa3] hover:text-white cursor-pointer"
              >
                COPY
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
