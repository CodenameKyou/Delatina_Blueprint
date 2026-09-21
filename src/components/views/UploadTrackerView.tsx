import React, { useState } from 'react';
import { PostLog, PlatformType } from '../../types';
import {
  Video,
  PlusCircle,
  Flame,
  Calendar,
  BarChart2,
  ExternalLink,
  Edit2,
  Trash2,
  Clock,
  Award,
  CheckCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface UploadTrackerViewProps {
  posts: PostLog[];
  onSavePosts: (posts: PostLog[]) => void;
  streakDays: number;
  dailyGoal: number;
  onUpdateDailyGoal: (goal: number) => void;
  postIntervalHours: number;
  onUpdateIntervalHours: (hours: number) => void;
  onIncrementXP?: (amount: number) => void;
}

export const UploadTrackerView: React.FC<UploadTrackerViewProps> = ({
  posts,
  onSavePosts,
  streakDays,
  dailyGoal,
  onUpdateDailyGoal,
  postIntervalHours,
  onUpdateIntervalHours,
  onIncrementXP,
}) => {
  // Today's date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const postsToday = posts.filter(
    (p) => p.postedAt && p.postedAt.split('T')[0] === todayStr
  );
  const postsTodayCount = postsToday.length;

  // New Post Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostLog | null>(null);

  // Form Fields
  const [formPlatform, setFormPlatform] = useState<PlatformType>('instagram');
  const [formAccount, setFormAccount] = useState('@clip.velocity');
  const [formNiche, setFormNiche] = useState('Sports / NFL');
  const [formCampaign, setFormCampaign] = useState('');
  const [formViews, setFormViews] = useState<string>('');
  const [formLink, setFormLink] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Undo Toast state
  const [deletedPost, setDeletedPost] = useState<PostLog | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);

  // Calculate Streak Milestones
  const milestones = [
    { days: 3, label: '3-Day Fire', unlocked: streakDays >= 3 },
    { days: 7, label: '7-Day Week Warrior', unlocked: streakDays >= 7 },
    { days: 14, label: '14-Day Consistency God', unlocked: streakDays >= 14 },
    { days: 30, label: '30-Day Algorithm Legend', unlocked: streakDays >= 30 },
  ];

  // Calculate 30-Day Pixel Heatmap
  const getPast30Days = () => {
    const days: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = posts.filter(
        (p) => p.postedAt && p.postedAt.split('T')[0] === dateStr
      ).length;
      days.push({ date: dateStr, count });
    }
    return days;
  };

  const heatmapDays = getPast30Days();

  // Aggregate stats
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalPosts = posts.length;

  const handleOpenNewModal = () => {
    setEditingPost(null);
    setFormPlatform('instagram');
    setFormAccount('@clip.velocity');
    setFormNiche('Sports / NFL');
    setFormCampaign('');
    setFormViews('');
    setFormLink('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post: PostLog) => {
    setEditingPost(post);
    setFormPlatform(post.platform);
    setFormAccount(post.accountName);
    setFormNiche(post.niche);
    setFormCampaign(post.campaign || '');
    setFormViews(post.views ? String(post.views) : '');
    setFormLink(post.link || '');
    setFormNotes(post.notes || '');
    setIsModalOpen(true);
  };

  const handleSavePost = () => {
    if (!formAccount.trim()) return;

    const viewsNum = formViews ? parseInt(formViews, 10) : undefined;

    if (editingPost) {
      const updated = posts.map((p) =>
        p.id === editingPost.id
          ? {
              ...p,
              platform: formPlatform,
              accountName: formAccount.trim(),
              niche: formNiche.trim(),
              campaign: formCampaign.trim() || undefined,
              views: viewsNum,
              link: formLink.trim() || undefined,
              notes: formNotes.trim() || undefined,
            }
          : p
      );
      onSavePosts(updated);
    } else {
      const newPost: PostLog = {
        id: `post-${Date.now()}`,
        platform: formPlatform,
        accountName: formAccount.trim(),
        niche: formNiche.trim(),
        campaign: formCampaign.trim() || undefined,
        postedAt: new Date().toISOString(),
        views: viewsNum || 0,
        link: formLink.trim() || undefined,
        notes: formNotes.trim() || undefined,
      };
      onSavePosts([newPost, ...posts]);
      if (onIncrementXP) onIncrementXP(50);
    }

    setIsModalOpen(false);
  };

  const handleDeletePost = (post: PostLog) => {
    setDeletedPost(post);
    setShowUndoToast(true);
    const updated = posts.filter((p) => p.id !== post.id);
    onSavePosts(updated);
    setTimeout(() => {
      setShowUndoToast(false);
      setDeletedPost(null);
    }, 4000);
  };

  const handleUndoDelete = () => {
    if (deletedPost) {
      onSavePosts([deletedPost, ...posts]);
      setShowUndoToast(false);
      setDeletedPost(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Undo Toast */}
      {showUndoToast && deletedPost && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#ffd93b] text-[#1a1033] font-arcade text-xs p-4 border-4 border-black shadow-[6px_6px_0px_#000000] flex items-center gap-3">
          <span>Post deleted.</span>
          <button
            onClick={handleUndoDelete}
            className="bg-[#1a1033] text-[#5dffa8] px-3 py-1 border border-black hover:bg-black cursor-pointer font-bold"
          >
            UNDO
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-black pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] px-2.5 py-0.5 border-2 border-black">
                TRACKER
              </span>
              <span className="font-arcade text-xs text-[#35e0ff]">
                CONSISTENCY ENGINE
              </span>
            </div>
            <h2 className="font-arcade text-lg sm:text-2xl text-[#ffd93b] tracking-wider">
              UPLOAD TRACKER & STREAKS
            </h2>
            <p className="font-vt text-xl text-[#fff4d6]">
              "No missed days" rule. Log your clips, watch your views compound, and keep streaks alive.
            </p>
          </div>

          <button
            onClick={handleOpenNewModal}
            className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-3 px-5 border-2 border-black shadow-[4px_4px_0px_#000] hover:bg-[#35e0ff] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>+ LOG A POST (+50 XP)</span>
          </button>
        </div>

        {/* Big Arcade Counters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Posts Today */}
          <div className="bg-[#1a1033] border-2 border-black p-4 text-center">
            <span className="font-arcade text-[10px] text-[#b9a9db] block mb-1">
              POSTS TODAY
            </span>
            <div className="font-arcade text-3xl text-[#ffd93b]">
              {String(postsTodayCount).padStart(2, '0')} / {String(dailyGoal).padStart(2, '0')}
            </div>
            <div className="mt-2 flex items-center justify-center gap-1">
              <span className="font-vt text-sm text-[#b9a9db]">Goal:</span>
              <input
                type="number"
                min={1}
                max={10}
                value={dailyGoal}
                onChange={(e) => onUpdateDailyGoal(parseInt(e.target.value, 10) || 3)}
                className="font-arcade text-[9px] w-12 text-center bg-black text-[#5dffa8] border border-gray-600 p-0.5"
              />
              <span className="font-vt text-xs text-[#b9a9db]">/day</span>
            </div>
          </div>

          {/* Posting Streak */}
          <div className="bg-[#1a1033] border-2 border-black p-4 text-center">
            <span className="font-arcade text-[10px] text-[#b9a9db] block mb-1">
              POSTING STREAK
            </span>
            <div className="font-arcade text-3xl text-orange-400 flex items-center justify-center gap-1">
              <Flame className="w-6 h-6 fill-orange-400" />
              <span>{streakDays}</span>
              <span className="text-sm">DAYS</span>
            </div>
            <span className="font-vt text-sm text-[#5dffa8] block mt-1">
              Algorithm trust level high
            </span>
          </div>

          {/* Total Views */}
          <div className="bg-[#1a1033] border-2 border-black p-4 text-center">
            <span className="font-arcade text-[10px] text-[#b9a9db] block mb-1">
              TOTAL RECORDED VIEWS
            </span>
            <div className="font-arcade text-2xl text-[#35e0ff]">
              {totalViews.toLocaleString()}
            </div>
            <span className="font-vt text-sm text-[#b9a9db] block mt-1">
              Across {totalPosts} logged videos
            </span>
          </div>

          {/* Posting Interval Timer Config */}
          <div className="bg-[#1a1033] border-2 border-black p-4 text-center">
            <span className="font-arcade text-[10px] text-[#b9a9db] block mb-1">
              RECOMMENDED INTERVAL
            </span>
            <div className="font-arcade text-2xl text-[#ff4fa3]">
              {postIntervalHours} HOURS
            </div>
            <div className="mt-2 flex items-center justify-center gap-1">
              <select
                value={postIntervalHours}
                onChange={(e) => onUpdateIntervalHours(parseInt(e.target.value, 10))}
                className="font-arcade text-[9px] bg-black text-[#fff4d6] border border-gray-600 p-1"
              >
                <option value={3}>3h (Rin/TikTok)</option>
                <option value={4}>4h (Fast pace)</option>
                <option value={5}>5h (Rin Method)</option>
                <option value={12}>12h (Warm-up peak)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub-Style Consistency Heatmap */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#5dffa8]" />
            <h3 className="font-arcade text-sm text-[#ffd93b]">
              30-DAY CONSISTENCY HEATMAP
            </h3>
          </div>
          <div className="flex items-center gap-2 font-arcade text-[8px] text-[#b9a9db]">
            <span>LESS</span>
            <div className="w-3 h-3 bg-black border border-black" />
            <div className="w-3 h-3 bg-[#5dffa8]/40 border border-black" />
            <div className="w-3 h-3 bg-[#5dffa8] border border-black" />
            <span>MORE</span>
          </div>
        </div>

        {/* Heatmap 30-Day Squares Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2">
          {heatmapDays.map((d) => {
            const isToday = d.date === todayStr;
            const bgClass =
              d.count === 0
                ? 'bg-black/60 text-gray-600'
                : d.count < 3
                ? 'bg-[#5dffa8]/40 text-black font-bold'
                : 'bg-[#5dffa8] text-[#1a1033] font-bold';

            return (
              <div
                key={d.date}
                className={`p-2 border-2 border-black flex flex-col items-center justify-between h-14 ${bgClass} ${
                  isToday ? 'ring-2 ring-[#ffd93b]' : ''
                }`}
                title={`${d.date}: ${d.count} posts`}
              >
                <span className="font-arcade text-[7px]">
                  {d.date.slice(5)}
                </span>
                <span className="font-arcade text-xs">
                  {d.count > 0 ? d.count : '·'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Milestone Badges */}
        <div className="mt-6 pt-4 border-t-2 border-black grid grid-cols-2 sm:grid-cols-4 gap-3">
          {milestones.map((m) => (
            <div
              key={m.days}
              className={`p-3 border-2 border-black flex items-center gap-2.5 ${
                m.unlocked
                  ? 'bg-[#1a1033] text-[#5dffa8] border-[#5dffa8]'
                  : 'bg-black/30 text-gray-600'
              }`}
            >
              <Award
                className={`w-5 h-5 flex-shrink-0 ${
                  m.unlocked ? 'text-[#ffd93b]' : 'text-gray-600'
                }`}
              />
              <div>
                <span className="font-arcade text-[9px] block">
                  {m.label}
                </span>
                <span className="font-vt text-sm">
                  {m.unlocked ? 'UNLOCKED ✓' : `${m.days} DAYS REQUIRED`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logged Posts List */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <h3 className="font-arcade text-sm text-[#ffd93b]">
            RECENT POST LOGS ({posts.length})
          </h3>
          <span className="font-vt text-lg text-[#b9a9db]">
            Ordered by newest post
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-10 text-[#b9a9db]">
            <Video className="w-12 h-12 mx-auto mb-2 opacity-40" />
            <p className="font-arcade text-xs">NO POSTS LOGGED YET!</p>
            <p className="font-vt text-lg mt-1">
              Click the "+ LOG A POST" button above to record your first upload.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-[#1a1033] border-2 border-black p-4 shadow-[3px_3px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:border-[#ffd93b] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-arcade text-[8px] px-2 py-0.5 border border-black uppercase ${
                        post.platform === 'tiktok'
                          ? 'bg-[#ff4fa3] text-white'
                          : post.platform === 'instagram'
                          ? 'bg-[#ffd93b] text-black'
                          : 'bg-[#ff0000] text-white'
                      }`}
                    >
                      {post.platform}
                    </span>
                    <span className="font-arcade text-xs text-[#5dffa8]">
                      {post.accountName}
                    </span>
                    <span className="font-vt text-base text-[#b9a9db]">
                      • {post.niche}
                    </span>
                    {post.campaign && (
                      <span className="font-arcade text-[8px] bg-[#2a1854] text-[#35e0ff] px-2 py-0.5 border border-black">
                        {post.campaign}
                      </span>
                    )}
                  </div>

                  {post.notes && (
                    <p className="font-vt text-base text-[#fff4d6]">
                      "{post.notes}"
                    </p>
                  )}

                  <div className="font-arcade text-[8px] text-[#b9a9db]">
                    POSTED: {new Date(post.postedAt).toLocaleString()}
                  </div>
                </div>

                {/* Right side stats & actions */}
                <div className="flex items-center gap-4 self-end md:self-auto">
                  {post.views !== undefined && (
                    <div className="text-right">
                      <span className="font-arcade text-[8px] text-[#b9a9db] block">
                        VIEWS
                      </span>
                      <span className="font-arcade text-sm text-[#ffd93b]">
                        {post.views.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {post.link && (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#35e0ff] hover:text-[#5dffa8] p-1.5 border border-black bg-black"
                      title="Open Video Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => handleOpenEditModal(post)}
                    className="text-[#b9a9db] hover:text-[#ffd93b] p-1.5 border border-black bg-black cursor-pointer"
                    title="Edit Post Log"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeletePost(post)}
                    className="text-[#b9a9db] hover:text-red-400 p-1.5 border border-black bg-black cursor-pointer"
                    title="Delete Post Log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          LOG POST MODAL
      ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#26164a] border-4 border-black p-6 shadow-[8px_8px_0px_#000000] max-w-lg w-full space-y-4">
            <h3 className="font-arcade text-sm text-[#ffd93b] border-b-2 border-black pb-2">
              {editingPost ? 'EDIT POST LOG' : '+ LOG A CLIP POST'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  PLATFORM
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['instagram', 'tiktok', 'youtube'] as PlatformType[]).map((plat) => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setFormPlatform(plat)}
                      className={`font-arcade text-[9px] py-2 border-2 border-black cursor-pointer uppercase ${
                        formPlatform === plat
                          ? 'bg-[#ffd93b] text-[#1a1033] font-bold'
                          : 'bg-[#1a1033] text-[#fff4d6]'
                      }`}
                    >
                      {plat === 'youtube' ? 'YT SHORTS' : plat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  ACCOUNT HANDLE
                </label>
                <input
                  type="text"
                  value={formAccount}
                  onChange={(e) => setFormAccount(e.target.value)}
                  placeholder="@your_clipping_account"
                  className="w-full font-arcade text-xs bg-black text-[#5dffa8] border-2 border-black p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  NICHE
                </label>
                <input
                  type="text"
                  value={formNiche}
                  onChange={(e) => setFormNiche(e.target.value)}
                  placeholder="e.g. Sports, Terrifying History, Animals, FitFix"
                  className="w-full font-arcade text-xs bg-black text-[#fff4d6] border-2 border-black p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  CAMPAIGN / CREATOR NAME (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={formCampaign}
                  onChange={(e) => setFormCampaign(e.target.value)}
                  placeholder="e.g. Whop Creator Bounty"
                  className="w-full font-arcade text-xs bg-black text-[#35e0ff] border-2 border-black p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  VIEWS RECORDED (OPTIONAL)
                </label>
                <input
                  type="number"
                  value={formViews}
                  onChange={(e) => setFormViews(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full font-arcade text-xs bg-black text-[#ffd93b] border-2 border-black p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  VIDEO LINK (OPTIONAL)
                </label>
                <input
                  type="url"
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                  placeholder="https://tiktok.com/@clip/video/..."
                  className="w-full font-mono text-xs bg-black text-[#fff4d6] border-2 border-black p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  QUICK NOTES
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Hook test: curiosity vs tension. High retention."
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
                onClick={handleSavePost}
                className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2 px-5 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] cursor-pointer"
              >
                LOG POST (+50 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
