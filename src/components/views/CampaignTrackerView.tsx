import React, { useState, useEffect } from 'react';
import {
  Calculator,
  DollarSign,
  Clock,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  Skull,
  Play,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';

interface CampaignItem {
  id: string;
  name: string;
  creatorOrPlatform: string;
  payRatePer1k: number; // e.g. $1.50 per 1k views
  fixedBounty?: number; // e.g. $50 for hitting 100k
  currentViews: number;
  submissionUrl?: string;
  status: 'active' | 'completed' | 'paused';
  notes?: string;
}

const DEFAULT_CAMPAIGNS: CampaignItem[] = [
  {
    id: 'camp-1',
    name: 'Whop Creator Growth Bounty',
    creatorOrPlatform: 'Whop Community',
    payRatePer1k: 1.5,
    currentViews: 48500,
    submissionUrl: 'https://whop.com',
    status: 'active',
    notes: 'Submit within 24h. Minimum 10k views to trigger payout.',
  },
  {
    id: 'camp-2',
    name: 'FitFix Apparel Launch',
    creatorOrPlatform: 'TikTok Creator Marketplace',
    payRatePer1k: 2.0,
    fixedBounty: 100,
    currentViews: 112000,
    status: 'completed',
    notes: 'Tier 1 US views only.',
  },
];

export const CampaignTrackerView: React.FC<{ onIncrementXP?: (amount: number) => void }> = ({
  onIncrementXP,
}) => {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(() => {
    try {
      const saved = localStorage.getItem('clipper_quest_campaigns');
      return saved ? JSON.parse(saved) : DEFAULT_CAMPAIGNS;
    } catch {
      return DEFAULT_CAMPAIGNS;
    }
  });

  // Save campaigns
  const saveCampaigns = (camps: CampaignItem[]) => {
    setCampaigns(camps);
    localStorage.setItem('clipper_quest_campaigns', JSON.stringify(camps));
  };

  // Calculator state
  const [calcViews, setCalcViews] = useState<string>('50000');
  const [calcRpm, setCalcRpm] = useState<string>('1.50');
  const [calcBounty, setCalcBounty] = useState<string>('0');

  // 10-Minute Cooldown Timer
  const [timerSeconds, setTimerSeconds] = useState(600);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let int: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      int = setInterval(() => setTimerSeconds((p) => p - 1), 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(int);
  }, [timerRunning, timerSeconds]);

  // Modal for new campaign
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPlatform, setFormPlatform] = useState('TikTok / IG');
  const [formPayRate, setFormPayRate] = useState('1.50');
  const [formViews, setFormViews] = useState('0');
  const [formFixed, setFormFixed] = useState('0');
  const [formUrl, setFormUrl] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Calculate earnings in calculator
  const viewsNum = parseFloat(calcViews) || 0;
  const rpmNum = parseFloat(calcRpm) || 0;
  const bountyNum = parseFloat(calcBounty) || 0;
  const projectedEarnings = (viewsNum / 1000) * rpmNum + bountyNum;

  // Total earnings across all active campaigns
  const totalCampaignEarnings = campaigns.reduce((sum, c) => {
    const ratePay = (c.currentViews / 1000) * c.payRatePer1k;
    const fixedPay = c.fixedBounty || 0;
    return sum + ratePay + fixedPay;
  }, 0);

  const handleAddCampaign = () => {
    if (!formName.trim()) return;
    const newCamp: CampaignItem = {
      id: `camp-${Date.now()}`,
      name: formName.trim(),
      creatorOrPlatform: formPlatform.trim(),
      payRatePer1k: parseFloat(formPayRate) || 0,
      fixedBounty: parseFloat(formFixed) || 0,
      currentViews: parseInt(formViews, 10) || 0,
      submissionUrl: formUrl.trim() || undefined,
      status: 'active',
      notes: formNotes.trim() || undefined,
    };
    saveCampaigns([newCamp, ...campaigns]);
    if (onIncrementXP) onIncrementXP(40);
    setIsNewModalOpen(false);
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Delete this campaign?')) {
      saveCampaigns(campaigns.filter((c) => c.id !== id));
    }
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-black pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] px-2.5 py-0.5 border-2 border-black">
                MONETIZATION
              </span>
              <span className="font-arcade text-xs text-[#ffd93b]">
                TOTAL EARNINGS: ${totalCampaignEarnings.toFixed(2)}
              </span>
            </div>
            <h2 className="font-arcade text-lg sm:text-2xl text-[#ffd93b] tracking-wider">
              CAMPAIGN TRACKER & EARNINGS
            </h2>
            <p className="font-vt text-xl text-[#fff4d6]">
              Track clip bounties, calculate RPM payouts, and obey the 10-minute TikTok submission rule.
            </p>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2.5 px-4 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ ADD CAMPAIGN (+40 XP)</span>
          </button>
        </div>

        {/* Top Monetization HUD */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#1a1033] border-2 border-black p-4 text-center">
            <span className="font-arcade text-[10px] text-[#b9a9db] block mb-1">
              ESTIMATED BOUNTY EARNINGS
            </span>
            <div className="font-arcade text-3xl text-[#5dffa8]">
              ${totalCampaignEarnings.toFixed(2)}
            </div>
            <span className="font-vt text-sm text-[#ffd93b]">
              Across {campaigns.length} campaigns
            </span>
          </div>

          <div className="bg-[#1a1033] border-2 border-black p-4 text-center">
            <span className="font-arcade text-[10px] text-[#b9a9db] block mb-1">
              TOTAL BOUNTY VIEWS
            </span>
            <div className="font-arcade text-3xl text-[#35e0ff]">
              {campaigns
                .reduce((s, c) => s + c.currentViews, 0)
                .toLocaleString()}
            </div>
            <span className="font-vt text-sm text-[#b9a9db]">
              Monetized short-form traffic
            </span>
          </div>

          <div className="bg-[#1a1033] border-2 border-black p-4 text-center">
            <span className="font-arcade text-[10px] text-[#b9a9db] block mb-1">
              ACTIVE CAMPAIGNS
            </span>
            <div className="font-arcade text-3xl text-[#ffd93b]">
              {campaigns.filter((c) => c.status === 'active').length}
            </div>
            <span className="font-vt text-sm text-[#5dffa8]">
              Currently earning per view
            </span>
          </div>
        </div>
      </div>

      {/* Interactive RPM Earnings Calculator + 10M Safety Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RPM Calculator */}
        <div className="bg-[#2f1c5c] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b-2 border-black pb-3 mb-4">
              <Calculator className="w-5 h-5 text-[#ffd93b]" />
              <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b]">
                RPM PAYOUT CALCULATOR
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  PROJECTED OR RECORDED VIEWS
                </label>
                <input
                  type="number"
                  value={calcViews}
                  onChange={(e) => setCalcViews(e.target.value)}
                  placeholder="50000"
                  className="w-full font-arcade text-sm bg-black text-[#5dffa8] border-2 border-black p-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                    RPM ($ PER 1K VIEWS)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    value={calcRpm}
                    onChange={(e) => setCalcRpm(e.target.value)}
                    placeholder="1.50"
                    className="w-full font-arcade text-xs bg-black text-[#ffd93b] border-2 border-black p-2 outline-none"
                  />
                </div>

                <div>
                  <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                    FIXED BONUS ($)
                  </label>
                  <input
                    type="number"
                    value={calcBounty}
                    onChange={(e) => setCalcBounty(e.target.value)}
                    placeholder="0"
                    className="w-full font-arcade text-xs bg-black text-[#35e0ff] border-2 border-black p-2 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1033] border-2 border-[#5dffa8] p-4 text-center mt-4">
            <span className="font-arcade text-[10px] text-[#b9a9db] block mb-1">
              ESTIMATED CLIP PAYOUT
            </span>
            <div className="font-arcade text-3xl sm:text-4xl text-[#5dffa8] tracking-wider">
              ${projectedEarnings.toFixed(2)}
            </div>
            <span className="font-vt text-base text-[#ffd93b]">
              Formula: ({viewsNum.toLocaleString()} / 1,000) × ${rpmNum} + ${bountyNum}
            </span>
          </div>
        </div>

        {/* 10-Minute Safety Submission Timer Tool */}
        <div className="bg-[#4d1027] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#ff4fa3] border-b-2 border-black pb-3 mb-3">
              <Skull className="w-6 h-6" />
              <h3 className="font-arcade text-sm sm:text-base">
                10-MINUTE SUBMISSION COOLDOWN
              </h3>
            </div>
            <p className="font-vt text-lg text-[#fff4d6] leading-relaxed">
              When submitting a clipped post to a campaign dashboard (Whop, Discord, etc.), <strong>never share the link immediately</strong> after posting. Wait 10 minutes so TikTok doesn't flag external link sharing as bot activity!
            </p>
          </div>

          <div className="bg-black/60 border-2 border-black p-4 text-center my-4">
            <span className="font-arcade text-[10px] text-[#35e0ff] block mb-1">
              SAFE SUBMISSION TIMER
            </span>
            <div className="font-arcade text-3xl sm:text-4xl text-[#ffd93b] tracking-widest my-1">
              {formatTimer(timerSeconds)}
            </div>
            <span className="font-vt text-lg text-[#5dffa8]">
              {timerSeconds === 0
                ? '✓ SAFE TO SUBMIT LINK TO CAMPAIGN!'
                : 'Cooldown active: keep TikTok closed.'}
            </span>
          </div>

          <div className="flex gap-2 justify-center">
            {!timerRunning ? (
              <button
                onClick={() => setTimerRunning(true)}
                className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2.5 px-6 border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#35e0ff] cursor-pointer"
              >
                START 10-MIN TIMER
              </button>
            ) : (
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(600);
                }}
                className="font-arcade text-xs bg-[#ff4fa3] text-[#fff4d6] py-2.5 px-6 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                RESET TIMER
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <h3 className="font-arcade text-sm text-[#ffd93b] mb-4">
          YOUR ACTIVE CAMPAIGNS ({campaigns.length})
        </h3>

        <div className="space-y-3">
          {campaigns.map((c) => {
            const earnings =
              (c.currentViews / 1000) * c.payRatePer1k + (c.fixedBounty || 0);

            return (
              <div
                key={c.id}
                className="bg-[#1a1033] border-2 border-black p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-arcade text-xs text-[#ffd93b]">
                      {c.name}
                    </span>
                    <span className="font-arcade text-[8px] bg-[#2a1854] text-[#35e0ff] px-2 py-0.5 border border-black">
                      {c.creatorOrPlatform}
                    </span>
                    <span className="font-arcade text-[8px] bg-[#5dffa8]/20 text-[#5dffa8] px-2 py-0.5 border border-[#5dffa8]">
                      ${c.payRatePer1k.toFixed(2)} / 1K VIEWS
                    </span>
                  </div>

                  {c.notes && (
                    <p className="font-vt text-base text-[#b9a9db]">
                      {c.notes}
                    </p>
                  )}

                  <div className="font-arcade text-[8px] text-[#b9a9db]">
                    RECORDED VIEWS: {c.currentViews.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto">
                  <div className="text-right">
                    <span className="font-arcade text-[8px] text-[#b9a9db] block">
                      TOTAL EARNED
                    </span>
                    <span className="font-arcade text-sm sm:text-base text-[#5dffa8]">
                      ${earnings.toFixed(2)}
                    </span>
                  </div>

                  {c.submissionUrl && (
                    <a
                      href={c.submissionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-black text-[#35e0ff] hover:text-[#5dffa8] p-2 border border-black"
                      title="Open Submission Portal"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => handleDeleteCampaign(c.id)}
                    className="text-red-400 hover:text-red-300 p-2 border border-black bg-black cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Campaign Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#26164a] border-4 border-black p-6 shadow-[8px_8px_0px_#000000] max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-arcade text-sm text-[#ffd93b]">
                + ADD NEW CAMPAIGN
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-[#b9a9db] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  CAMPAIGN TITLE
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Whop Creator Bounty"
                  className="w-full font-arcade text-xs bg-black text-[#ffd93b] border-2 border-black p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  PLATFORM / SPONSOR
                </label>
                <input
                  type="text"
                  value={formPlatform}
                  onChange={(e) => setFormPlatform(e.target.value)}
                  placeholder="e.g. Whop, FitFix, Rin Sports"
                  className="w-full font-arcade text-xs bg-black text-[#35e0ff] border-2 border-black p-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                    RPM ($ / 1K VIEWS)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    value={formPayRate}
                    onChange={(e) => setFormPayRate(e.target.value)}
                    className="w-full font-arcade text-xs bg-black text-[#5dffa8] border-2 border-black p-2 outline-none"
                  />
                </div>

                <div>
                  <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                    FIXED BONUS ($)
                  </label>
                  <input
                    type="number"
                    value={formFixed}
                    onChange={(e) => setFormFixed(e.target.value)}
                    className="w-full font-arcade text-xs bg-black text-[#ffd93b] border-2 border-black p-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  CURRENT ACCUMULATED VIEWS
                </label>
                <input
                  type="number"
                  value={formViews}
                  onChange={(e) => setFormViews(e.target.value)}
                  className="w-full font-arcade text-xs bg-black text-[#fff4d6] border-2 border-black p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  SUBMISSION URL
                </label>
                <input
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full font-mono text-xs bg-black text-[#fff4d6] border-2 border-black p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  CAMPAIGN RULES & NOTES
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Submit link within 24h of posting..."
                  className="w-full font-vt text-lg bg-black text-[#fff4d6] border-2 border-black p-2 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="font-arcade text-xs bg-gray-800 text-white py-2 px-4 border-2 border-black cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleAddCampaign}
                className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2 px-5 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] cursor-pointer"
              >
                SAVE CAMPAIGN (+40 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
