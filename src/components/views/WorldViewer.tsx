import React, { useState, useEffect } from 'react';
import { QuestItem, WorldData } from '../../types';
import { WORLDS, PRE_POST_CHECKLIST_ITEMS } from '../../data/initialData';
import {
  CheckSquare,
  Square,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Skull,
  Timer,
  Shield,
  Zap,
  Target,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  DollarSign,
  Clock,
  Globe,
  Copy,
  Check,
  Eye,
  Share2,
  Award,
  BookOpen,
} from 'lucide-react';

interface WorldViewerProps {
  worldId: string;
  quests: QuestItem[];
  onToggleQuest: (questId: string) => void;
  onDiagnoseClip?: (dropType: string) => void;
  onNavigateToPrompt?: (promptId: string) => void;
}

export const WorldViewer: React.FC<WorldViewerProps> = ({
  worldId,
  quests,
  onToggleQuest,
  onNavigateToPrompt,
}) => {
  const world = WORLDS.find((w) => w.id === worldId) || WORLDS[0];
  const worldQuests = quests.filter((q) => q.worldId === world.id);

  // Active Tab for Blueprint Clarity: 'visual' | 'tagalog' | 'quests'
  const [activeBlueprintTab, setActiveBlueprintTab] = useState<'visual' | 'tagalog' | 'quests'>('visual');

  // World 1 Calculator State
  const [estimatedViews, setEstimatedViews] = useState<number>(50000);
  const [campaignRpm, setCampaignRpm] = useState<number>(1.2);

  // World 3 Time Converter State
  const [selectedPhtHour, setSelectedPhtHour] = useState<number>(0); // 12:00 AM PHT

  // TikTok 10-Minute submission timer state for World 6
  const [timerSeconds, setTimerSeconds] = useState<number>(600); // 10 minutes
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Pre-post checklist state for World 4
  const [prePostChecks, setPrePostChecks] = useState<{ [key: string]: boolean }>({});
  const [checklistResetToast, setChecklistResetToast] = useState(false);

  // Diagnose My Clip state for World 4
  const [selectedDrop, setSelectedDrop] = useState<string | null>(null);

  // Geo-Filter Countries Copy state for World 7
  const [copiedCountries, setCopiedCountries] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const startTimer = () => {
    setTimerSeconds(600);
    setTimerActive(true);
  };

  const resetTimer = () => {
    setTimerSeconds(600);
    setTimerActive(false);
  };

  const completedCount = worldQuests.filter((q) => q.completed).length;
  const progressPercent = Math.round((completedCount / (worldQuests.length || 1)) * 100);

  const geoCountriesList = [
    'Egypt',
    'India',
    'Indonesia',
    'Philippines',
    'Iraq',
    'Iran',
    'Malaysia',
    'Bangladesh',
    'Pakistan',
  ];

  const handleCopyGeoCountries = () => {
    navigator.clipboard.writeText(geoCountriesList.join(', '));
    setCopiedCountries(true);
    setTimeout(() => setCopiedCountries(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* World Header Card */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-black pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-arcade text-xs bg-[#ff4fa3] text-[#fff4d6] px-2.5 py-0.5 border-2 border-black">
                WORLD {world.number}
              </span>
              <span className="font-arcade text-xs text-[#35e0ff]">
                QUEST PROGRESS: {completedCount} / {worldQuests.length}
              </span>
              <span className="font-arcade text-[10px] bg-[#ffd93b] text-[#1a1033] px-2 py-0.5 border-2 border-black ml-auto">
                BY DELATINA, JOHN KENNETH
              </span>
            </div>
            <h2 className="font-arcade text-lg sm:text-2xl text-[#ffd93b] tracking-wider">
              {world.title}
            </h2>
            <p className="font-vt text-xl text-[#fff4d6]">{world.subtitle}</p>
          </div>

          <div className="w-full sm:w-48 text-right">
            <div className="font-arcade text-xs text-[#5dffa8] mb-1">
              {progressPercent}% COMPLETED
            </div>
            <div className="h-4 w-full bg-black border-2 border-black p-0.5">
              <div
                className="h-full bg-[#5dffa8] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {world.tagline && (
          <p className="font-vt text-lg text-[#b9a9db] italic">
            "{world.tagline}"
          </p>
        )}

        {/* Blueprint Mode Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t-2 border-black">
          <button
            onClick={() => setActiveBlueprintTab('visual')}
            className={`font-arcade text-xs px-4 py-2 border-2 border-black cursor-pointer transition-all flex items-center gap-1.5 ${
              activeBlueprintTab === 'visual'
                ? 'bg-[#ffd93b] text-[#1a1033] font-bold shadow-[3px_3px_0px_#000] -translate-y-0.5'
                : 'bg-[#1a1033] text-[#fff4d6] hover:bg-[#35e0ff] hover:text-[#1a1033]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>VISUAL PIPELINE & TOOLS</span>
          </button>

          <button
            onClick={() => setActiveBlueprintTab('tagalog')}
            className={`font-arcade text-xs px-4 py-2 border-2 border-black cursor-pointer transition-all flex items-center gap-1.5 ${
              activeBlueprintTab === 'tagalog'
                ? 'bg-[#5dffa8] text-[#1a1033] font-bold shadow-[3px_3px_0px_#000] -translate-y-0.5'
                : 'bg-[#1a1033] text-[#fff4d6] hover:bg-[#5dffa8] hover:text-[#1a1033]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>PALIWANAG SA TAGALOG 🇵🇭</span>
          </button>

          <button
            onClick={() => setActiveBlueprintTab('quests')}
            className={`font-arcade text-xs px-4 py-2 border-2 border-black cursor-pointer transition-all flex items-center gap-1.5 ${
              activeBlueprintTab === 'quests'
                ? 'bg-[#ff4fa3] text-[#fff4d6] font-bold shadow-[3px_3px_0px_#000] -translate-y-0.5'
                : 'bg-[#1a1033] text-[#fff4d6] hover:bg-[#ff4fa3] hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>MISSION LOG & QUESTS ({completedCount}/{worldQuests.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 3: MISSION LOG & QUESTS */}
      {activeBlueprintTab === 'quests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-arcade text-sm text-[#ffd93b] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff4fa3]" />
              <span>WORLD OBJECTIVES & QUEST LOG</span>
            </h3>
            <span className="font-arcade text-[10px] text-[#5dffa8]">
              CLICK TO TOGGLE PROGRESS (+XP)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {worldQuests.map((q) => {
              return (
                <div
                  key={q.id}
                  onClick={() => onToggleQuest(q.id)}
                  className={`border-4 border-black p-4 shadow-[4px_4px_0px_#000000] cursor-pointer transition-all ${
                    q.completed
                      ? 'bg-[#1e1338] opacity-90 border-[#5dffa8]'
                      : 'bg-[#2f1c5c] hover:border-[#ffd93b] hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      className="mt-0.5 text-[#5dffa8] flex-shrink-0 cursor-pointer"
                      aria-label={q.completed ? 'Completed' : 'Mark as complete'}
                    >
                      {q.completed ? (
                        <CheckSquare className="w-6 h-6 fill-[#5dffa8] text-black" />
                      ) : (
                        <Square className="w-6 h-6 text-[#ffd93b]" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`font-arcade text-xs sm:text-sm ${
                            q.completed
                              ? 'line-through text-[#b9a9db]'
                              : 'text-[#ffd93b]'
                          }`}
                        >
                          {q.title}
                        </h4>
                        <span className="font-arcade text-[10px] text-[#ff4fa3] bg-black/50 px-2 py-0.5 border border-black flex-shrink-0">
                          +{q.xpReward} XP
                        </span>
                      </div>

                      {q.description && (
                        <p className="font-vt text-lg text-[#fff4d6] mt-2 leading-relaxed">
                          {q.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 1: VISUAL PIPELINE & INTERACTIVE WORLD TOOLS
      ========================================================================= */}
      {activeBlueprintTab === 'visual' && (
        <div className="space-y-6">
          {/* WORLD 1: BEGINNER BLUEPRINT VISUAL PIPELINE & EARNINGS ESTIMATOR */}
          {world.id === 'world-1' && (
            <div className="space-y-6">
              {/* 4-Stage Visual Flowchart */}
              <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
                <h3 className="font-arcade text-sm text-[#ffd93b] mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff4fa3]" />
                  <span>THE 4-STAGE ZERO-RISK CLIPPING PIPELINE</span>
                </h3>
                <p className="font-vt text-lg text-[#b9a9db] mb-4">
                  How a complete beginner goes from zero to their first $100 payout without showing their face or spending money.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-[#1a1033] border-2 border-black p-4">
                    <span className="font-arcade text-[10px] bg-[#ff4fa3] text-white px-2 py-0.5 border border-black inline-block mb-2">
                      STAGE 1
                    </span>
                    <h4 className="font-arcade text-xs text-[#ffd93b] mb-1">DEAL DISCOVERY</h4>
                    <p className="font-vt text-lg text-[#fff4d6]">
                      Pick campaigns with solid budgets ($1k+ remaining) and clear RPM ($1.00-$2.50 per 1k views).
                    </p>
                  </div>

                  <div className="bg-[#1a1033] border-2 border-black p-4">
                    <span className="font-arcade text-[10px] bg-[#35e0ff] text-[#1a1033] px-2 py-0.5 border border-black inline-block mb-2">
                      STAGE 2
                    </span>
                    <h4 className="font-arcade text-xs text-[#35e0ff] mb-1">RAW SOURCING</h4>
                    <p className="font-vt text-lg text-[#fff4d6]">
                      Download high bitrate VODs or podcasts. Never rip clips that already have watermarks.
                    </p>
                  </div>

                  <div className="bg-[#1a1033] border-2 border-black p-4">
                    <span className="font-arcade text-[10px] bg-[#5dffa8] text-[#1a1033] px-2 py-0.5 border border-black inline-block mb-2">
                      STAGE 3
                    </span>
                    <h4 className="font-arcade text-xs text-[#5dffa8] mb-1">PUNCHY EDITING</h4>
                    <p className="font-vt text-lg text-[#fff4d6]">
                      Cut all dead pauses. Under 12 words on screen in first 2s. Animate dynamic captions in CapCut.
                    </p>
                  </div>

                  <div className="bg-[#1a1033] border-2 border-black p-4">
                    <span className="font-arcade text-[10px] bg-[#ffd93b] text-[#1a1033] px-2 py-0.5 border border-black inline-block mb-2">
                      STAGE 4
                    </span>
                    <h4 className="font-arcade text-xs text-[#ffd93b] mb-1">PAYOUT HARVEST</h4>
                    <p className="font-vt text-lg text-[#fff4d6]">
                      Post during US peak times (12 AM PHT). Submit link after 10 min cooldown. Withdraw bounties!
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Earnings Simulator */}
              <div className="bg-[#2f1c5c] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-[#5dffa8]" />
                    <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b]">
                      CAMPAIGN BOUNTY & PAYOUT ESTIMATOR
                    </h3>
                  </div>
                  <span className="font-arcade text-[10px] text-[#5dffa8]">
                    REAL-TIME MATH
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between font-arcade text-[10px] text-[#35e0ff] mb-1">
                        <span>ESTIMATED QUALIFIED VIEWS:</span>
                        <span className="text-[#ffd93b]">{estimatedViews.toLocaleString()} VIEWS</span>
                      </div>
                      <input
                        type="range"
                        min={5000}
                        max={500000}
                        step={5000}
                        value={estimatedViews}
                        onChange={(e) => setEstimatedViews(Number(e.target.value))}
                        className="w-full accent-[#5dffa8] cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-arcade text-[10px] text-[#35e0ff] mb-1">
                        <span>CAMPAIGN RPM ($ PER 1K VIEWS):</span>
                        <span className="text-[#ffd93b]">${campaignRpm.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min={0.5}
                        max={3.0}
                        step={0.1}
                        value={campaignRpm}
                        onChange={(e) => setCampaignRpm(Number(e.target.value))}
                        className="w-full accent-[#ffd93b] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="bg-[#1a1033] border-4 border-black p-5 text-center shadow-[4px_4px_0px_#000]">
                    <span className="font-arcade text-[10px] text-[#b9a9db] block mb-1">
                      PROJECTED CLIPPER REWARD:
                    </span>
                    <div className="font-arcade text-3xl sm:text-4xl text-[#5dffa8] my-2">
                      ${((estimatedViews / 1000) * campaignRpm).toFixed(2)} USD
                    </div>
                    <div className="font-vt text-2xl text-[#ffd93b]">
                      ≈ ₱{Math.round((estimatedViews / 1000) * campaignRpm * 57).toLocaleString()} PHP
                    </div>
                    <span className="font-vt text-base text-[#fff4d6] block mt-2">
                      Based on standard US Tier-1 viewer distribution (₱57/USD exchange rate).
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

      {/* WORLD 2: WARM-UP POWER-UPS */}
      {world.id === 'world-2' && (
        <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] space-y-4">
          <h3 className="font-arcade text-sm sm:text-base text-[#5dffa8]">
            ⚡ 5 POWER-UP RULES BREAKDOWN
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1a1033] border-2 border-black p-4">
              <span className="font-arcade text-[10px] text-[#ff4fa3] block mb-1">
                RULE 1: TIER 1 ENGAGEMENT
              </span>
              <p className="font-vt text-lg text-[#fff4d6]">
                Only like, repost, comment, save, follow when a video is obviously made by a Tier 1 creator or has a Tier 1 audience in the comments.
              </p>
            </div>

            <div className="bg-[#1a1033] border-2 border-black p-4">
              <span className="font-arcade text-[10px] text-[#ffd93b] block mb-1">
                RULE 2: CONTENT IMPROVEMENT
              </span>
              <p className="font-vt text-lg text-[#5dffa8] italic">
                "Mag base ka sa last video mo, check mo san nag drop yung graph and you edit from there and see for the next post if mag iimprove ang Analytics mo."
              </p>
            </div>

            <div className="bg-[#1a1033] border-2 border-black p-4">
              <span className="font-arcade text-[10px] text-[#35e0ff] block mb-1">
                RULE 3: PEAK TIME POSTING
              </span>
              <p className="font-vt text-lg text-[#fff4d6]">
                Recommended posting time is 12am-2am, and only then. Give the algorithm space to find the right audience, so use 12-hour intervals.
              </p>
            </div>

            <div className="bg-[#1a1033] border-2 border-black p-4">
              <span className="font-arcade text-[10px] text-[#5dffa8] block mb-1">
                RULE 4: CONSISTENT POSTING
              </span>
              <p className="font-vt text-lg text-[#fff4d6]">
                At first you'll see little progress, analytics not rising. Just keep posting. The platform is still learning what audience your content belongs to. Each new post upgrades platform trust!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* WORLD 4: IG GROWTH BLUEPRINT TIMELINE + DIAGNOSE WIDGET + PRE-POST CHECKLIST */}
      {world.id === 'world-4' && (
        <div className="space-y-6">
          {/* Basic Structure Timeline Bar */}
          <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
            <h3 className="font-arcade text-sm text-[#ffd93b] mb-2">
              ⏱️ 30-SECOND RETENTION TIMELINE BAR
            </h3>
            <p className="font-vt text-lg text-[#b9a9db] mb-4">
              Hook 0-3s, Build-up 3-12s, Climax 12-24s, Payoff 24-27s (under 3 sec), Loop 27-30s.
            </p>

            <div className="grid grid-cols-12 gap-1 bg-black p-2 border-2 border-black font-arcade text-[9px] text-center text-[#1a1033]">
              <div className="col-span-1 bg-[#ff4fa3] p-2 flex flex-col items-center justify-center font-bold">
                <span>HOOK</span>
                <span className="text-[7px]">0-3s</span>
              </div>
              <div className="col-span-4 bg-[#ffd93b] p-2 flex flex-col items-center justify-center font-bold">
                <span>BUILD-UP</span>
                <span className="text-[7px]">3-12s</span>
              </div>
              <div className="col-span-4 bg-[#35e0ff] p-2 flex flex-col items-center justify-center font-bold">
                <span>CLIMAX</span>
                <span className="text-[7px]">12-24s</span>
              </div>
              <div className="col-span-1 bg-[#5dffa8] p-2 flex flex-col items-center justify-center font-bold">
                <span>PAYOFF</span>
                <span className="text-[7px]">&lt;3s</span>
              </div>
              <div className="col-span-2 bg-[#ff71ce] p-2 flex flex-col items-center justify-center font-bold">
                <span>LOOP</span>
                <span className="text-[7px]">27-30s</span>
              </div>
            </div>
          </div>

          {/* DIAGNOSE MY CLIP INTERACTIVE WIDGET */}
          <div className="bg-[#2f1c5c] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-[#ffd93b]" />
              <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b]">
                DIAGNOSE MY CLIP (ANALYTICS HELPER)
              </h3>
            </div>
            <p className="font-vt text-lg text-[#fff4d6] mb-4">
              Where did the retention graph drop on your clip? Click below to reveal the blueprint fix:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <button
                onClick={() => setSelectedDrop('hook')}
                className={`font-arcade text-xs p-3 border-2 border-black cursor-pointer text-left transition-all ${
                  selectedDrop === 'hook'
                    ? 'bg-[#ff4fa3] text-[#fff4d6] translate-x-1 translate-y-1'
                    : 'bg-[#1a1033] text-[#fff4d6] hover:bg-[#ff4fa3]/30'
                }`}
              >
                1. BIG DROP IN FIRST 3 SEC
              </button>

              <button
                onClick={() => setSelectedDrop('middle')}
                className={`font-arcade text-xs p-3 border-2 border-black cursor-pointer text-left transition-all ${
                  selectedDrop === 'middle'
                    ? 'bg-[#ffd93b] text-[#1a1033] translate-x-1 translate-y-1'
                    : 'bg-[#1a1033] text-[#fff4d6] hover:bg-[#ffd93b]/30'
                }`}
              >
                2. DROP IN THE MIDDLE
              </button>

              <button
                onClick={() => setSelectedDrop('completion')}
                className={`font-arcade text-xs p-3 border-2 border-black cursor-pointer text-left transition-all ${
                  selectedDrop === 'completion'
                    ? 'bg-[#35e0ff] text-[#1a1033] translate-x-1 translate-y-1'
                    : 'bg-[#1a1033] text-[#fff4d6] hover:bg-[#35e0ff]/30'
                }`}
              >
                3. LOW COMPLETION RATE
              </button>
            </div>

            {selectedDrop && (
              <div className="bg-[#1a1033] border-2 border-[#5dffa8] p-4 animate-fadeIn">
                <span className="font-arcade text-xs text-[#5dffa8] block mb-2">
                  🛠️ DIAGNOSIS & ACTIONABLE FIX:
                </span>
                {selectedDrop === 'hook' && (
                  <p className="font-vt text-xl text-[#fff4d6]">
                    <strong className="text-[#ff4fa3]">WEAK HOOK DETECTED:</strong> You gave the audience zero curiosity in the first 2 seconds or started with a slow transition.
                    <br />
                    <span className="text-[#ffd93b]">→ Fix:</span> Cut straight to the most insane visual or question. Use the GenZ Hook Rephraser from the Prompt Vault!
                  </p>
                )}
                {selectedDrop === 'middle' && (
                  <p className="font-vt text-xl text-[#fff4d6]">
                    <strong className="text-[#ffd93b]">PACING TOO SLOW:</strong> Viewer brains got bored. Dead air, quiet breathing pauses, or unmoving visual frames.
                    <br />
                    <span className="text-[#5dffa8]">→ Fix:</span> Add a pattern interrupt every 3 seconds: punch-in zoom, sound effect hit, high-contrast B-roll clip, or text pop.
                  </p>
                )}
                {selectedDrop === 'completion' && (
                  <p className="font-vt text-xl text-[#fff4d6]">
                    <strong className="text-[#35e0ff]">PAYOFF NOT STRONG ENOUGH:</strong> The build-up promised something insane, but the ending was drawn out or disappointing.
                    <br />
                    <span className="text-[#ffd93b]">→ Fix:</span> Keep the payoff punchy (under 3 seconds) and loop the final phrase straight back into the hook!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* PRE-POST CHECKLIST INTERACTIVE MODULE */}
          <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <div>
                <h3 className="font-arcade text-sm sm:text-base text-[#5dffa8]">
                  📋 PRE-POST QUALITY CHECKLIST
                </h3>
                <p className="font-vt text-lg text-[#b9a9db]">
                  Audited before every upload. Resets per post.
                </p>
              </div>

              <button
                onClick={() => {
                  setPrePostChecks({});
                  setChecklistResetToast(true);
                  setTimeout(() => setChecklistResetToast(false), 2000);
                }}
                className="font-arcade text-[10px] bg-[#1a1033] text-[#ffd93b] border-2 border-black px-3 py-1.5 hover:bg-black cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> RESET LIST
              </button>
            </div>

            {checklistResetToast && (
              <div className="bg-[#5dffa8] text-[#1a1033] font-arcade text-xs p-2 border-2 border-black mb-3">
                ✓ CHECKLIST CLEARED FOR NEW POST!
              </div>
            )}

            <div className="space-y-2">
              {PRE_POST_CHECKLIST_ITEMS.map((item) => {
                const checked = !!prePostChecks[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() =>
                      setPrePostChecks((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }))
                    }
                    className={`flex items-center gap-3 p-2.5 border-2 border-black cursor-pointer transition-all ${
                      checked
                        ? 'bg-[#1a1033] text-[#5dffa8] border-[#5dffa8]'
                        : 'bg-[#2f1c5c] text-[#fff4d6] hover:bg-[#3f257a]'
                    }`}
                  >
                    {checked ? (
                      <CheckCircle className="w-5 h-5 text-[#5dffa8] flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-[#b9a9db] flex-shrink-0" />
                    )}
                    <span
                      className={`font-vt text-lg ${
                        checked ? 'line-through opacity-80' : ''
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* WORLD 5: YT SHORTS BOSS STATS CARDS */}
      {world.id === 'world-5' && (
        <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] space-y-4">
          <h3 className="font-arcade text-sm sm:text-base text-[#ff4fa3]">
            👾 YT SHORTS ALGORITHM BOSS STATS
          </h3>
          <p className="font-vt text-lg text-[#fff4d6]">
            YT does not care about subscriber count or how hard you worked on the edit. It only cares whether people watched or swiped away.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#1a1033] border-2 border-black p-4">
              <span className="font-arcade text-xs text-[#ff4fa3] block mb-1">
                SWIPE AWAY RATE
              </span>
              <p className="font-vt text-lg text-[#fff4d6]">
                Swipes in the first 1-2 sec kill the video. You must earn their thumb stop instantly.
              </p>
            </div>

            <div className="bg-[#1a1033] border-2 border-black p-4">
              <span className="font-arcade text-xs text-[#5dffa8] block mb-1">
                COMPLETION RATE
              </span>
              <p className="font-vt text-lg text-[#fff4d6]">
                Watched fully or looped &rarr; YT automatically pushes to the next test batch of viewers.
              </p>
            </div>

            <div className="bg-[#1a1033] border-2 border-black p-4">
              <span className="font-arcade text-xs text-[#ffd93b] block mb-1">
                REPLAYS
              </span>
              <p className="font-vt text-lg text-[#fff4d6]">
                Like a standing ovation. Build endings people rewatch without realizing.
              </p>
            </div>

            <div className="bg-[#1a1033] border-2 border-black p-4">
              <span className="font-arcade text-xs text-[#35e0ff] block mb-1">
                ENGAGEMENT
              </span>
              <p className="font-vt text-lg text-[#fff4d6]">
                Likes, comments, shares come AFTER completion rate. Never beg for likes in the first 5s.
              </p>
            </div>

            <div className="bg-[#1a1033] border-2 border-black p-4 col-span-1 sm:col-span-2">
              <span className="font-arcade text-xs text-red-400 block mb-1">
                "NOT INTERESTED" TAPS
              </span>
              <p className="font-vt text-lg text-red-200">
                Actively bury your video into algorithm oblivion. Misleading clickbait hooks and bad quality trigger these.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* WORLD 6: TIKTOK GROWTH & 10-MINUTE SAFETY TIMER */}
      {world.id === 'world-6' && (
        <div className="space-y-6">
          {/* Attention Reminder Box */}
          <div className="bg-[#ffd93b] text-[#1a1033] border-4 border-black p-4 shadow-[4px_4px_0px_#000000]">
            <h4 className="font-arcade text-xs uppercase mb-1">
              ⭐ GOLDEN REMINDER
            </h4>
            <p className="font-vt text-2xl font-bold">
              "Proper warm-up doesn't mean you'll get views easily. It proves you're not a bot. It's about your format/content and who pays attention. Money will come at ATTENTION."
            </p>
          </div>

          {/* TikTok Retention Tier Progression Ladder */}
          <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
            <h3 className="font-arcade text-sm text-[#35e0ff] mb-2">
              📈 HOW TIKTOK SCALES YOUR ACCOUNT (TIER LADDER)
            </h3>
            <p className="font-vt text-lg text-[#fff4d6] mb-4">
              It is a trade: you give content people finish watching, TikTok gives distribution back.
            </p>

            <div className="space-y-3">
              <div className="bg-[#1a1033] border-2 border-black p-3 flex items-center justify-between">
                <span className="font-arcade text-xs text-[#b9a9db]">TIER 1: INITIAL TEST</span>
                <span className="font-vt text-xl text-[#fff4d6]">200 - 500 Views (Bot check & immediate retention)</span>
              </div>
              <div className="bg-[#1a1033] border-2 border-black p-3 flex items-center justify-between">
                <span className="font-arcade text-xs text-[#ffd93b]">TIER 2: TARGETED PUSH</span>
                <span className="font-vt text-xl text-[#ffd93b]">1k - 5k Views (High completion & shares)</span>
              </div>
              <div className="bg-[#1a1033] border-2 border-black p-3 flex items-center justify-between">
                <span className="font-arcade text-xs text-[#5dffa8]">TIER 3: VIRAL COMPOUNDING</span>
                <span className="font-vt text-xl text-[#5dffa8]">10k - 50k+ Views (Rewatches & sustained comments)</span>
              </div>
            </div>
          </div>

          {/* CAMPAIGN WARNING & 10-MINUTE COOLDOWN TIMER */}
          <div className="bg-[#4d1027] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
            <div className="flex items-center gap-2 mb-2 text-[#ff4fa3]">
              <Skull className="w-6 h-6" />
              <h3 className="font-arcade text-sm sm:text-base">
                WARNING: IF POSTING CAMPAIGNS ON TIKTOK
              </h3>
            </div>
            <p className="font-vt text-xl text-[#fff4d6] mb-4 leading-relaxed">
              Don't submit right after posting! Wait at least <strong>10 minutes</strong> before submitting your link, because TikTok can detect you sharing the video immediately and may shadowban it or stop pushing it.
            </p>

            {/* Countdown widget */}
            <div className="bg-black/60 border-2 border-black p-4 text-center max-w-sm mx-auto">
              <span className="font-arcade text-[10px] text-[#35e0ff] block mb-1">
                CAMPAIGN SUBMISSION COOLDOWN
              </span>
              <div className="font-arcade text-3xl sm:text-4xl text-[#ffd93b] tracking-widest my-2">
                {formatTimer(timerSeconds)}
              </div>
              <div className="font-vt text-lg text-[#5dffa8] mb-3">
                {timerSeconds === 0 ? '✓ SAFE TO SUBMIT NOW!' : 'Safe to submit in ' + formatTimer(timerSeconds)}
              </div>

              <div className="flex gap-2 justify-center">
                {!timerActive ? (
                  <button
                    onClick={startTimer}
                    className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2 px-4 border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#35e0ff] cursor-pointer"
                  >
                    START 10M TIMER
                  </button>
                ) : (
                  <button
                    onClick={resetTimer}
                    className="font-arcade text-xs bg-[#ff4fa3] text-[#fff4d6] py-2 px-4 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                  >
                    RESET
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Locked Quest Coming Soon */}
          <div className="bg-[#1a1033] border-4 border-dashed border-gray-600 p-4 opacity-75">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-arcade text-[10px] bg-red-900 text-red-300 px-2 py-0.5 border border-red-500">
                  LOCKED QUEST
                </span>
                <span className="font-arcade text-xs text-[#fff4d6]">
                  How To Set Up A Fresh USA TikTok Account Properly
                </span>
              </div>
              <span className="font-arcade text-[9px] text-[#ffd93b] bg-black px-2 py-1">
                COMING SOON
              </span>
            </div>
          </div>
        </div>
      )}

      {/* WORLD 7: INSTAGRAM WARM-UP (ALON METHOD) */}
      {world.id === 'world-7' && (
        <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] space-y-6">
          <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b]">
            🛡️ STEP-BY-STEP ACCOUNT CREATION & GEO-FILTERING (ALON METHOD)
          </h3>

          <div className="space-y-4">
            <div className="bg-[#1a1033] border-2 border-black p-4">
              <h4 className="font-arcade text-xs text-[#ff4fa3] mb-2">
                1. PRE-CREATION STEPS
              </h4>
              <ul className="font-vt text-lg text-[#fff4d6] space-y-1 list-disc pl-5">
                <li>Turn off Bluetooth before creating the account.</li>
                <li>Make sure your MAIN IG account is logged out.</li>
                <li>Using an old Gmail that already has IG accounts linked is NOT recommended.</li>
                <li>Avoid VPN/Proxy during warm-up (alters feed behavior).</li>
              </ul>
            </div>

            <div className="bg-[#1a1033] border-2 border-black p-4">
              <h4 className="font-arcade text-xs text-[#5dffa8] mb-2">
                2. ACCOUNT SETTINGS: MINIMUM AGE FILTER
              </h4>
              <p className="font-vt text-lg text-[#fff4d6] mb-2">
                Go to: Account type & tools → Other → Minimum Age → Add countries:
              </p>
              <div className="bg-black/60 border border-black p-3 font-mono text-sm text-[#ffd93b] flex flex-wrap gap-2">
                {[
                  'Egypt',
                  'India',
                  'Indonesia',
                  'Philippines',
                  'Iraq',
                  'Iran',
                  'Malaysia',
                  'Bangladesh',
                  'Pakistan',
                ].map((c) => (
                  <span key={c} className="bg-[#2a1854] px-2 py-1 border border-[#ff4fa3]">
                    {c} (Age 25)
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1033] border-2 border-black p-4">
              <h4 className="font-arcade text-xs text-[#35e0ff] mb-2">
                3. FEED TRAINING & ALGORITHM BAR
              </h4>
              <p className="font-vt text-lg text-[#fff4d6]">
                Open the Algorithm bar in the Reels area. Add niche keywords under "what you want to see more of", and opposite-niche keywords under "what you want to see less of" (e.g. gaming niche → add podcast/TV as opposite).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* WORLD 8: RIN METHOD MISSION CARDS */}
      {world.id === 'world-8' && (
        <div className="space-y-6">
          <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
            <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b] mb-2">
              🎯 RIN METHOD: 3 NICHES & VIRAL GOALS
            </h3>
            <p className="font-vt text-lg text-[#fff4d6] mb-4">
              Source content from famous creators 1 time, then post your own edited videos 2 times = 3 vids/day, 5-hour interval.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sports Mission Card */}
              <div className="bg-[#1a1033] border-4 border-black p-5 shadow-[4px_4px_0px_#000]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-arcade text-xs text-[#5dffa8]">NICHE: SPORTS</span>
                  <span className="font-arcade text-[10px] bg-black px-2 py-0.5 text-[#ffd93b]">
                    3 POSTS / DAY
                  </span>
                </div>
                <p className="font-vt text-lg text-[#fff4d6] mb-3">
                  Search NFL edits, NBA edits, or any sports edits. Post at 4-5 hr interval.
                </p>
                <div className="bg-[#2a1854] p-3 border-2 border-black">
                  <span className="font-arcade text-[10px] text-[#ff4fa3] block mb-1">
                    WEEK 1 GOAL:
                  </span>
                  <p className="font-vt text-xl text-[#ffd93b] font-bold">
                    100,000 Views + 100 Followers
                  </p>
                </div>
              </div>

              {/* History Mission Card */}
              <div className="bg-[#1a1033] border-4 border-black p-5 shadow-[4px_4px_0px_#000]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-arcade text-xs text-[#ff4fa3]">NICHE: HISTORY</span>
                  <span className="font-arcade text-[10px] bg-black px-2 py-0.5 text-[#ffd93b]">
                    9 POSTS / DAY
                  </span>
                </div>
                <p className="font-vt text-lg text-[#fff4d6] mb-3">
                  Source from "Terrifying History" on IG. 3 per interval, 5-6 hr interval.
                </p>
                <div className="bg-[#2a1854] p-3 border-2 border-black">
                  <span className="font-arcade text-[10px] text-[#5dffa8] block mb-1">
                    WEEK 1 GOAL:
                  </span>
                  <p className="font-vt text-xl text-[#ffd93b] font-bold">
                    1,000,000 Views + 1,000 Followers
                  </p>
                </div>
              </div>

              {/* Gore / Dark Mystery Mission Card */}
              <div className="bg-[#1a1033] border-4 border-black p-5 shadow-[4px_4px_0px_#000]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-arcade text-xs text-[#35e0ff]">NICHE: GORE / DARK</span>
                  <span className="font-arcade text-[10px] bg-black px-2 py-0.5 text-[#ffd93b]">
                    HIGH HOOK
                  </span>
                </div>
                <p className="font-vt text-lg text-[#fff4d6] mb-3">
                  Morbid curiosities, deep-sea horror, and shocking real-life stories. Blur graphic parts!
                </p>
                <div className="bg-[#2a1854] p-3 border-2 border-black">
                  <span className="font-arcade text-[10px] text-[#35e0ff] block mb-1">
                    WEEK 1 GOAL:
                  </span>
                  <p className="font-vt text-xl text-[#ffd93b] font-bold">
                    High Shares & Viral Loops
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: PALIWANAG SA TAGALOG (PINOY CLIPPER MASTER GUIDE)
      ========================================================================= */}
      {activeBlueprintTab === 'tagalog' && (
        <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#ffd93b]" />
              <div>
                <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b]">
                  PALIWANAG SA TAGALOG: {world.title.toUpperCase()}
                </h3>
                <p className="font-vt text-lg text-[#5dffa8]">
                  Lahat ng mahahalagang bilin at paalala para sa Pinoy clippers.
                </p>
              </div>
            </div>
            <span className="font-arcade text-[10px] bg-[#ffd93b] text-[#1a1033] px-2 py-1 border border-black hidden sm:inline-block">
              PINOY CLIPPER VAULT
            </span>
          </div>

          {/* World-by-World Tagalog Wisdom */}
          {world.id === 'world-1' && (
            <div className="space-y-4">
              <div className="bg-[#1a1033] border-2 border-black p-4">
                <h4 className="font-arcade text-xs text-[#ffd93b] mb-2">
                  🇵🇭 PAANO MAGSIMULA AT BAKIT ZERO-RISK ITO?
                </h4>
                <p className="font-vt text-xl text-[#fff4d6] leading-relaxed">
                  Ang clipping ay <strong>Zero-Risk</strong> dahil wala kang ilalabas na kahit piso. Hindi mo kailangang magpakita ng mukha, hindi mo kailangan ng mamahaling camera. Cellphone o lumang laptop lang at CapCut, pwede ka nang kumita ng dolyar mula sa mga US brand at streamer campaigns.
                </p>
              </div>

              <div className="bg-[#1a1033] border-2 border-black p-4">
                <h4 className="font-arcade text-xs text-[#ff4fa3] mb-2">
                  ⚠️ MAHALAGANG PAALALA SA ACCOUNT:
                </h4>
                <p className="font-vt text-xl text-[#fff4d6] leading-relaxed">
                  <strong>Huwag na huwag</strong> gagamitin ang iyong personal account na may mga kamag-anak o kaibigan. Gumawa ng bagong Gmail at bagong account para malinis ang algorithm at US viewers agad ang makakita ng video mo.
                </p>
              </div>
            </div>
          )}

          {world.id === 'world-2' && (
            <div className="space-y-4">
              <div className="bg-[#1a1033] border-2 border-black p-4">
                <h4 className="font-arcade text-xs text-[#ffd93b] mb-2">
                  🇵🇭 BAKIT KAILANGAN MAG-WARM UP?
                </h4>
                <p className="font-vt text-xl text-[#fff4d6] leading-relaxed">
                  Kapag nag-post ka agad sa bagong gawang account, ituturing ka ng TikTok at Instagram na <strong>SPAM BOT</strong>. Kaya ma-stuck ka sa 0 views o 200 views jail. Kailangan mo munang manood, mag-save, at mag-comment sa mga Tier 1 (US) creators para patunayan sa algorithm na totoong tao ka.
                </p>
              </div>

              <div className="bg-[#2f1c5c] border-2 border-black p-4">
                <h4 className="font-arcade text-xs text-[#5dffa8] mb-2">
                  ⭐ GOLDEN RULE SA ANALYTICS (ISAPUSO MO ITO):
                </h4>
                <p className="font-vt text-2xl text-[#ffd93b] italic leading-relaxed">
                  "Mag base ka sa last video mo, check mo san nag drop yung graph and you edit from there and see for the next post if mag iimprove ang Analytics mo."
                </p>
              </div>
            </div>
          )}

          {world.id === 'world-3' && (
            <div className="space-y-4">
              <div className="bg-[#1a1033] border-2 border-black p-4">
                <h4 className="font-arcade text-xs text-[#ffd93b] mb-2">
                  🇵🇭 BAKIT HATINGGABI O MADALING ARAW MAGPO-POST?
                </h4>
                <p className="font-vt text-xl text-[#fff4d6] leading-relaxed">
                  Dahil ang target audience natin ay mga kano sa Estados Unidos (US). Kapag 12:00 AM (hatinggabi) sa Pilipinas, 12:00 PM (tanghalian) naman sa New York. Yan ang oras na nagse-cellphone ang mga kano habang kumakain ng lunch! Kapag tulog ang mga kano (tanghali sa Pinas), wag kang mag-post dahil walang manonood.
                </p>
              </div>

              <div className="bg-[#1a1033] border-2 border-black p-4">
                <h4 className="font-arcade text-xs text-[#35e0ff] mb-2">
                  🕒 ANG 3 GINTONG ORAS (PHILIPPINE TIME):
                </h4>
                <ul className="font-vt text-xl text-[#fff4d6] space-y-2 list-disc pl-5">
                  <li><strong>7:00 PM PHT:</strong> Kaggising pa lang ng mga taga-East Coast US (7:00 AM EST).</li>
                  <li><strong>12:00 AM PHT (Pinakamalakas):</strong> Lunch break sa US (12:00 PM EST / 9:00 AM PST).</li>
                  <li><strong>5:00 AM PHT:</strong> Uwian mula sa trabaho at eskwela sa US (5:00 PM EST).</li>
                </ul>
              </div>
            </div>
          )}

          {world.id === 'world-4' && (
            <div className="space-y-4">
              <div className="bg-[#1a1033] border-2 border-black p-4">
                <h4 className="font-arcade text-xs text-[#ffd93b] mb-2">
                  🇵🇭 PAANO AYUSIN ANG RETENTION (30-SEGUNDO FORMULA)
                </h4>
                <p className="font-vt text-xl text-[#fff4d6] leading-relaxed">
                  Sa short-form video, 2 segundo lang ang meron ka. Pag hindi naintindihan ng viewer ang hook sa unang 2 segundo, mag-i-swipe up agad sila.
                </p>
                <p className="font-vt text-xl text-[#5dffa8] mt-2">
                  ✓ <strong>Hook:</strong> Bawal lumagpas ng 12 words. Gamitin ang Hook Lab para makuha ang pinakamalupit na opening.<br />
                  ✓ <strong>Payoff:</strong> Wag patagalin! Dapat under 3 seconds lang ang resolusyon para hindi maiinip ang nanonood.
                </p>
              </div>
            </div>
          )}

          {world.id === 'world-5' && (
            <div className="space-y-4">
              <div className="bg-[#1a1033] border-2 border-black p-4">
                <h4 className="font-arcade text-xs text-[#ffd93b] mb-2">
                  🇵🇭 ANG SIKRETO SA YOUTUBE SHORTS
                </h4>
                <p className="font-vt text-xl text-[#fff4d6] leading-relaxed">
                  Walang pakialam si YouTube kung ilan ang subscribers mo. Ang tinitingnan lang ng algorithm ay kung pinanood ba o ini-swipe palayo ang video mo. Kapag 80% pataas ang nanood at hindi nag-swipe, sigurado ang daan-daang libong views!
                </p>
              </div>
            </div>
          )}

          {world.id === 'world-6' && (
            <div className="space-y-4">
              <div className="bg-[#4d1027] border-2 border-black p-4">
                <h4 className="font-arcade text-xs text-[#ff4fa3] mb-2">
                  🚨 BABALA: HUWAG AGAD I-SUBMIT ANG TIKTOK LINK!
                </h4>
                <p className="font-vt text-2xl text-[#ffd93b] leading-relaxed font-bold">
                  "Huwag na huwag isusumite agad ang TikTok link pagka-post mo! Maghintay ng at least 10 minutes dahil nade-detect ng TikTok kapag nagmamadali kang i-share ang video, at maaari itong i-shadowban o ihinto ang pagtulak sa For You Page."
                </p>
              </div>

              <div className="bg-[#1a1033] border-2 border-black p-4">
                <h4 className="font-arcade text-xs text-[#5dffa8] mb-2">
                  💡 MONEY WILL COME AT ATTENTION
                </h4>
                <p className="font-vt text-xl text-[#fff4d6] leading-relaxed">
                  Ang warm-up ay hindi garantiya ng instant views. Ang warm-up ay patunay lang na hindi ka bot. Ang views at pera ay dumarating sa <strong>ATTENTION</strong> na kayang hawakan ng content mo.
                </p>
              </div>
            </div>
          )}

          {world.id === 'world-7' && (
            <div className="space-y-4">
              <div className="bg-[#1a1033] border-2 border-black p-4">
                <h4 className="font-arcade text-xs text-[#ffd93b] mb-2">
                  🇵🇭 ALON METHOD: PAANO MAGING 100% US ANG REELS MO
                </h4>
                <p className="font-vt text-xl text-[#fff4d6] leading-relaxed">
                  1. I-off ang Bluetooth bago gawin ang account.<br />
                  2. I-logout ang mga personal na IG account.<br />
                  3. Wag gumamit ng lumang Gmail na may dati nang IG.<br />
                  4. Huwag mag-VPN para hindi magulo ang algorithm.<br />
                  5. Ilagay ang 9 countries sa Minimum Age (Age 25): Egypt, India, Indonesia, Philippines, Iraq, Iran, Malaysia, Bangladesh, Pakistan.
                </p>
              </div>
            </div>
          )}

          {world.id === 'world-8' && (
            <div className="space-y-4">
              <div className="bg-[#1a1033] border-2 border-black p-4">
                <h4 className="font-arcade text-xs text-[#ffd93b] mb-2">
                  🇵🇭 RIN METHOD: 3 VIDEOS A DAY SYSTEM
                </h4>
                <p className="font-vt text-xl text-[#fff4d6] leading-relaxed">
                  Mag-post ng 3 beses bawat araw na may 5 oras na pagitan (7 PM, 12 AM, 5 AM). Pumili ng subok na niche tulad ng NFL/Sports, Terrifying History, o Dark Mysteries. Sa loob ng 1 linggo, makikita mo ang pag-compound ng algorithm!
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
