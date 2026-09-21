import React, { useState } from 'react';
import { PlatformType } from '../../types';
import {
  Users,
  Shield,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
  Flame,
  CheckSquare,
  Square,
  Sparkles,
  X,
} from 'lucide-react';

interface ClipperAccount {
  id: string;
  handle: string;
  platform: PlatformType;
  niche: string;
  status: 'warming-up' | 'active' | 'shadowbanned' | 'testing';
  warmupDay: number; // 1, 2, 3, or 4 (done)
  followers: number;
  totalPosts: number;
  minAgeConfigured: boolean;
  algoKeywordsConfigured: boolean;
  notes?: string;
}

const DEFAULT_ACCOUNTS: ClipperAccount[] = [
  {
    id: 'acc-1',
    handle: '@nfl.insanity.clips',
    platform: 'instagram',
    niche: 'Sports / NFL',
    status: 'active',
    warmupDay: 4,
    followers: 1240,
    totalPosts: 28,
    minAgeConfigured: true,
    algoKeywordsConfigured: true,
    notes: 'Warm-up completed with Alon method. Posting at 7 PM and 12 AM PHT.',
  },
  {
    id: 'acc-2',
    handle: '@darkhistory.vault',
    platform: 'tiktok',
    niche: 'Terrifying History',
    status: 'warming-up',
    warmupDay: 2,
    followers: 85,
    totalPosts: 3,
    minAgeConfigured: false,
    algoKeywordsConfigured: true,
    notes: 'Day 2 of warm-up: browsing 10 mins and commenting.',
  },
];

export const AccountsManagerView: React.FC<{ onIncrementXP?: (amount: number) => void }> = ({
  onIncrementXP,
}) => {
  const [accounts, setAccounts] = useState<ClipperAccount[]>(() => {
    try {
      const saved = localStorage.getItem('clipper_quest_accounts');
      return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  });

  const saveAccounts = (accs: ClipperAccount[]) => {
    setAccounts(accs);
    localStorage.setItem('clipper_quest_accounts', JSON.stringify(accs));
  };

  // Add modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ClipperAccount | null>(null);

  const [formHandle, setFormHandle] = useState('@');
  const [formPlatform, setFormPlatform] = useState<PlatformType>('instagram');
  const [formNiche, setFormNiche] = useState('Sports');
  const [formStatus, setFormStatus] = useState<'warming-up' | 'active' | 'shadowbanned' | 'testing'>('warming-up');
  const [formWarmupDay, setFormWarmupDay] = useState('1');
  const [formFollowers, setFormFollowers] = useState('0');
  const [formMinAge, setFormMinAge] = useState(false);
  const [formAlgoWords, setFormAlgoWords] = useState(false);
  const [formNotes, setFormNotes] = useState('');

  const handleOpenNew = () => {
    setEditingAccount(null);
    setFormHandle('@');
    setFormPlatform('instagram');
    setFormNiche('Sports');
    setFormStatus('warming-up');
    setFormWarmupDay('1');
    setFormFollowers('0');
    setFormMinAge(false);
    setFormAlgoWords(false);
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc: ClipperAccount) => {
    setEditingAccount(acc);
    setFormHandle(acc.handle);
    setFormPlatform(acc.platform);
    setFormNiche(acc.niche);
    setFormStatus(acc.status);
    setFormWarmupDay(String(acc.warmupDay));
    setFormFollowers(String(acc.followers));
    setFormMinAge(acc.minAgeConfigured);
    setFormAlgoWords(acc.algoKeywordsConfigured);
    setFormNotes(acc.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveAccount = () => {
    if (!formHandle.trim() || formHandle === '@') return;

    if (editingAccount) {
      const updated = accounts.map((a) =>
        a.id === editingAccount.id
          ? {
              ...a,
              handle: formHandle.trim(),
              platform: formPlatform,
              niche: formNiche.trim(),
              status: formStatus,
              warmupDay: parseInt(formWarmupDay, 10) || 1,
              followers: parseInt(formFollowers, 10) || 0,
              minAgeConfigured: formMinAge,
              algoKeywordsConfigured: formAlgoWords,
              notes: formNotes.trim() || undefined,
            }
          : a
      );
      saveAccounts(updated);
    } else {
      const newAcc: ClipperAccount = {
        id: `acc-${Date.now()}`,
        handle: formHandle.trim(),
        platform: formPlatform,
        niche: formNiche.trim(),
        status: formStatus,
        warmupDay: parseInt(formWarmupDay, 10) || 1,
        followers: parseInt(formFollowers, 10) || 0,
        totalPosts: 0,
        minAgeConfigured: formMinAge,
        algoKeywordsConfigured: formAlgoWords,
        notes: formNotes.trim() || undefined,
      };
      saveAccounts([newAcc, ...accounts]);
      if (onIncrementXP) onIncrementXP(35);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this account from your fleet?')) {
      saveAccounts(accounts.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-black pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-arcade text-xs bg-[#35e0ff] text-[#1a1033] px-2.5 py-0.5 border-2 border-black">
                FLEET COMMAND
              </span>
              <span className="font-arcade text-xs text-[#5dffa8]">
                {accounts.length} ACCOUNTS MANAGED
              </span>
            </div>
            <h2 className="font-arcade text-lg sm:text-2xl text-[#ffd93b] tracking-wider">
              ACCOUNTS MANAGER & FLEET
            </h2>
            <p className="font-vt text-xl text-[#fff4d6]">
              Track your warming-up burners, geo-filtering checklist, and active scaling handles.
            </p>
          </div>

          <button
            onClick={handleOpenNew}
            className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2.5 px-4 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ ADD ACCOUNT (+35 XP)</span>
          </button>
        </div>

        {/* Fleet Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="bg-[#1a1033] border-2 border-black p-3 text-center">
            <span className="font-arcade text-[9px] text-[#b9a9db] block mb-1">
              ACTIVE ACCOUNTS
            </span>
            <span className="font-arcade text-2xl text-[#5dffa8]">
              {accounts.filter((a) => a.status === 'active').length}
            </span>
          </div>

          <div className="bg-[#1a1033] border-2 border-black p-3 text-center">
            <span className="font-arcade text-[9px] text-[#b9a9db] block mb-1">
              WARMING UP
            </span>
            <span className="font-arcade text-2xl text-[#ffd93b]">
              {accounts.filter((a) => a.status === 'warming-up').length}
            </span>
          </div>

          <div className="bg-[#1a1033] border-2 border-black p-3 text-center">
            <span className="font-arcade text-[9px] text-[#b9a9db] block mb-1">
              TOTAL FOLLOWERS
            </span>
            <span className="font-arcade text-2xl text-[#35e0ff]">
              {accounts.reduce((s, a) => s + a.followers, 0).toLocaleString()}
            </span>
          </div>

          <div className="bg-[#1a1033] border-2 border-black p-3 text-center">
            <span className="font-arcade text-[9px] text-[#b9a9db] block mb-1">
              TIKTOK / IG / SHORTS
            </span>
            <span className="font-arcade text-2xl text-[#ff4fa3]">
              {accounts.length}
            </span>
          </div>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-[#2f1c5c] border-4 border-black p-5 shadow-[4px_4px_0px_#000000] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 border-b-2 border-black pb-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`font-arcade text-[8px] px-2 py-0.5 border border-black uppercase ${
                        acc.platform === 'tiktok'
                          ? 'bg-[#ff4fa3] text-white'
                          : acc.platform === 'instagram'
                          ? 'bg-[#ffd93b] text-black'
                          : 'bg-[#ff0000] text-white'
                      }`}
                    >
                      {acc.platform}
                    </span>
                    <span
                      className={`font-arcade text-[8px] px-2 py-0.5 border border-black uppercase ${
                        acc.status === 'active'
                          ? 'bg-[#5dffa8]/20 text-[#5dffa8] border-[#5dffa8]'
                          : acc.status === 'warming-up'
                          ? 'bg-[#ffd93b]/20 text-[#ffd93b] border-[#ffd93b]'
                          : 'bg-red-500/20 text-red-400 border-red-500'
                      }`}
                    >
                      {acc.status}
                    </span>
                  </div>
                  <h3 className="font-arcade text-sm text-[#fff4d6]">
                    {acc.handle}
                  </h3>
                  <span className="font-vt text-base text-[#b9a9db]">
                    Niche: {acc.niche}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(acc)}
                    className="p-1.5 bg-black text-[#35e0ff] border border-black hover:text-[#ffd93b] cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(acc.id)}
                    className="p-1.5 bg-black text-red-400 border border-black hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Warm-Up Day Progress */}
              <div className="bg-[#1a1033] border-2 border-black p-3 space-y-2 mb-3">
                <div className="flex items-center justify-between font-arcade text-[9px]">
                  <span className="text-[#b9a9db]">WARM-UP STATUS:</span>
                  <span className="text-[#ffd93b]">
                    {acc.warmupDay >= 4 ? 'COMPLETED (SCALING)' : `DAY ${acc.warmupDay} OF 3`}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 text-center font-arcade text-[8px]">
                  <div
                    className={`p-1 border border-black ${
                      acc.warmupDay >= 1 ? 'bg-[#5dffa8] text-[#1a1033]' : 'bg-black text-gray-500'
                    }`}
                  >
                    DAY 1
                  </div>
                  <div
                    className={`p-1 border border-black ${
                      acc.warmupDay >= 2 ? 'bg-[#5dffa8] text-[#1a1033]' : 'bg-black text-gray-500'
                    }`}
                  >
                    DAY 2
                  </div>
                  <div
                    className={`p-1 border border-black ${
                      acc.warmupDay >= 3 ? 'bg-[#5dffa8] text-[#1a1033]' : 'bg-black text-gray-500'
                    }`}
                  >
                    DAY 3
                  </div>
                </div>

                {/* Checklist chips */}
                <div className="flex gap-2 pt-1">
                  <span
                    className={`font-arcade text-[8px] px-2 py-0.5 border ${
                      acc.minAgeConfigured
                        ? 'bg-[#5dffa8]/20 text-[#5dffa8] border-[#5dffa8]'
                        : 'bg-black text-gray-500 border-gray-700'
                    }`}
                  >
                    {acc.minAgeConfigured ? '✓ MIN AGE SET' : '✕ MIN AGE MISSING'}
                  </span>
                  <span
                    className={`font-arcade text-[8px] px-2 py-0.5 border ${
                      acc.algoKeywordsConfigured
                        ? 'bg-[#35e0ff]/20 text-[#35e0ff] border-[#35e0ff]'
                        : 'bg-black text-gray-500 border-gray-700'
                    }`}
                  >
                    {acc.algoKeywordsConfigured ? '✓ ALGO BAR SET' : '✕ ALGO BAR MISSING'}
                  </span>
                </div>
              </div>

              {acc.notes && (
                <p className="font-vt text-base text-[#fff4d6] italic mb-2">
                  "{acc.notes}"
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-black/40 flex items-center justify-between font-arcade text-[9px] text-[#b9a9db]">
              <span>FOLLOWERS: {acc.followers.toLocaleString()}</span>
              <span>POSTS: {acc.totalPosts}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#26164a] border-4 border-black p-6 shadow-[8px_8px_0px_#000000] max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-arcade text-sm text-[#ffd93b]">
                {editingAccount ? 'EDIT CLIPPER ACCOUNT' : '+ ADD ACCOUNT TO FLEET'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#b9a9db] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  HANDLE / USERNAME
                </label>
                <input
                  type="text"
                  value={formHandle}
                  onChange={(e) => setFormHandle(e.target.value)}
                  placeholder="@your_clipping_handle"
                  className="w-full font-arcade text-xs bg-black text-[#5dffa8] border-2 border-black p-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                    PLATFORM
                  </label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value as PlatformType)}
                    className="w-full font-arcade text-xs bg-black text-[#ffd93b] border-2 border-black p-2 outline-none"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                    STATUS
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full font-arcade text-xs bg-black text-[#35e0ff] border-2 border-black p-2 outline-none"
                  >
                    <option value="warming-up">Warming Up</option>
                    <option value="active">Active / Scaling</option>
                    <option value="shadowbanned">Shadowbanned / Resting</option>
                    <option value="testing">Testing / Burner</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                    NICHE
                  </label>
                  <input
                    type="text"
                    value={formNiche}
                    onChange={(e) => setFormNiche(e.target.value)}
                    placeholder="e.g. Sports, History, Podcasts"
                    className="w-full font-arcade text-xs bg-black text-[#fff4d6] border-2 border-black p-2 outline-none"
                  />
                </div>

                <div>
                  <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                    WARM-UP STAGE
                  </label>
                  <select
                    value={formWarmupDay}
                    onChange={(e) => setFormWarmupDay(e.target.value)}
                    className="w-full font-arcade text-xs bg-black text-[#ff4fa3] border-2 border-black p-2 outline-none"
                  >
                    <option value="1">Day 1 (Browse feed)</option>
                    <option value="2">Day 2 (Like & comment)</option>
                    <option value="3">Day 3 (Post 1st clip)</option>
                    <option value="4">Done / Full Scale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  CURRENT FOLLOWERS
                </label>
                <input
                  type="number"
                  value={formFollowers}
                  onChange={(e) => setFormFollowers(e.target.value)}
                  className="w-full font-arcade text-xs bg-black text-[#ffd93b] border-2 border-black p-2 outline-none"
                />
              </div>

              {/* Geo filter checkboxes */}
              <div className="space-y-2 pt-1">
                <label
                  onClick={() => setFormMinAge(!formMinAge)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {formMinAge ? (
                    <CheckSquare className="w-5 h-5 text-[#5dffa8]" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-arcade text-[9px] text-[#fff4d6]">
                    MINIMUM AGE 25 COUNTRIES CONFIGURED (ALON RULE)
                  </span>
                </label>

                <label
                  onClick={() => setFormAlgoWords(!formAlgoWords)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {formAlgoWords ? (
                    <CheckSquare className="w-5 h-5 text-[#5dffa8]" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-arcade text-[9px] text-[#fff4d6]">
                    REELS ALGORITHM BAR KEYWORDS TRAINED
                  </span>
                </label>
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  NOTES & STRATEGY
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. 5-hour interval Rin method"
                  className="w-full font-vt text-lg bg-black text-[#fff4d6] border-2 border-black p-2 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="font-arcade text-xs bg-gray-800 text-white py-2 px-4 border-2 border-black cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveAccount}
                className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2 px-5 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] cursor-pointer"
              >
                SAVE ACCOUNT (+35 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
