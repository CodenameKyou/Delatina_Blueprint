import React, { useState } from 'react';
import { CommentaryChannel } from '../../types';
import {
  ExternalLink,
  Search,
  CheckCircle,
  Square,
  Sparkles,
  Dice5,
  Plus,
  Trash2,
  Tv,
  Bookmark,
  Edit2,
  X,
} from 'lucide-react';

interface CommentaryChannelsViewProps {
  channels: CommentaryChannel[];
  onSaveChannels: (channels: CommentaryChannel[]) => void;
  onIncrementXP?: (amount: number) => void;
}

export const CommentaryChannelsView: React.FC<CommentaryChannelsViewProps> = ({
  channels,
  onSaveChannels,
  onIncrementXP,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubNiche, setSelectedSubNiche] = useState<string>('All');

  // Random channel challenge modal
  const [randomModalChannel, setRandomModalChannel] = useState<CommentaryChannel | null>(null);

  // New Channel Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formSubNiche, setFormSubNiche] = useState('Internet Culture');
  const [formWhyStudy, setFormWhyStudy] = useState('');
  const [formUrl, setFormUrl] = useState('');

  // Channel notes editing state
  const [editingNotesChannelId, setEditingNotesChannelId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');

  const subNiches = [
    'All',
    'Studied',
    'Internet Culture',
    'Documentary & Visual',
    'Finance & Business',
    'Science & Curiosity',
    'Drama & Scams',
  ];

  const handleToggleStudied = (channelId: string) => {
    const updated = channels.map((c) => {
      if (c.id === channelId) {
        const nextStudied = !c.studied;
        if (nextStudied && onIncrementXP) onIncrementXP(25);
        return { ...c, studied: nextStudied };
      }
      return c;
    });
    onSaveChannels(updated);
  };

  const handleSaveNotes = (channelId: string) => {
    const updated = channels.map((c) =>
      c.id === channelId ? { ...c, userNotes: notesInput.trim() } : c
    );
    onSaveChannels(updated);
    setEditingNotesChannelId(null);
  };

  const handleAddChannel = () => {
    if (!formName.trim() || !formUrl.trim()) return;

    const newChannel: CommentaryChannel = {
      id: `chan-custom-${Date.now()}`,
      name: formName.trim(),
      subNiche: formSubNiche.trim(),
      whyStudy: formWhyStudy.trim() || 'Custom benchmark creator.',
      url: formUrl.trim(),
      studied: false,
      isStudied: false,
      platform: 'youtube',
      nicheTag: formSubNiche.trim() || 'General',
      isFavorite: false,
      order: channels.length,
    };

    onSaveChannels([...channels, newChannel]);
    if (onIncrementXP) onIncrementXP(30);
    setIsAddModalOpen(false);
    setFormName('');
    setFormUrl('');
    setFormWhyStudy('');
  };

  const handleDeleteChannel = (channelId: string) => {
    if (confirm('Delete this channel reference?')) {
      onSaveChannels(channels.filter((c) => c.id !== channelId));
    }
  };

  const pickRandomChannel = () => {
    const randomIndex = Math.floor(Math.random() * channels.length);
    setRandomModalChannel(channels[randomIndex]);
  };

  const filteredChannels = channels.filter((c) => {
    const subNicheText = (c.subNiche || c.nicheTag || '').toLowerCase();
    const whyStudyText = (c.whyStudy || c.notes || '').toLowerCase();
    const isChannelStudied = c.studied ?? c.isStudied ?? false;

    const matchesCategory =
      selectedSubNiche === 'All' ||
      (selectedSubNiche === 'Studied' && isChannelStudied) ||
      subNicheText.includes(selectedSubNiche.toLowerCase());
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      whyStudyText.includes(searchQuery.toLowerCase()) ||
      subNicheText.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const studiedCount = channels.filter((c) => c.studied ?? c.isStudied).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-black pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-arcade text-xs bg-[#35e0ff] text-[#1a1033] px-2.5 py-0.5 border-2 border-black">
                BENCHMARKS
              </span>
              <span className="font-arcade text-xs text-[#5dffa8]">
                {studiedCount} / {channels.length} STUDIED
              </span>
            </div>
            <h2 className="font-arcade text-lg sm:text-2xl text-[#ffd93b] tracking-wider">
              COMMENTARY NICHE REFERENCE CHANNELS
            </h2>
            <p className="font-vt text-xl text-[#fff4d6]">
              Master the pacing, sound design, hooks, and retention tricks of the top 20 commentary gods.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={pickRandomChannel}
              className="font-arcade text-xs bg-[#ff4fa3] text-[#fff4d6] py-2.5 px-3 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#ff71ce] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
            >
              <Dice5 className="w-4 h-4" />
              <span>RANDOM STUDY TARGET</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2.5 px-3 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>+ ADD CHANNEL</span>
            </button>
          </div>
        </div>

        {/* Search & Sub-niche Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#b9a9db] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by creator name or niche..."
              className="w-full font-arcade text-[10px] bg-black text-[#fff4d6] border-2 border-black pl-9 pr-3 py-2 outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            {subNiches.map((sn) => (
              <button
                key={sn}
                onClick={() => setSelectedSubNiche(sn)}
                className={`font-arcade text-[9px] px-3 py-1.5 border-2 border-black cursor-pointer transition-colors ${
                  selectedSubNiche === sn
                    ? 'bg-[#ffd93b] text-[#1a1033] font-bold shadow-[2px_2px_0px_#000]'
                    : 'bg-[#1a1033] text-[#fff4d6] hover:bg-[#35e0ff] hover:text-[#1a1033]'
                }`}
              >
                {sn === 'Studied' ? '✓ STUDIED' : sn.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChannels.map((c) => {
          const isEditingNotes = editingNotesChannelId === c.id;
          const isStudied = c.studied ?? c.isStudied ?? false;
          const subNiche = c.subNiche || c.nicheTag || 'General';
          const whyStudy = c.whyStudy || c.notes || 'Benchmark commentary creator.';
          const userNotes = c.userNotes || '';

          return (
            <div
              key={c.id}
              className={`border-4 border-black p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between transition-all ${
                isStudied
                  ? 'bg-[#1a1033] border-[#5dffa8]/80'
                  : 'bg-[#2f1c5c] hover:border-[#ffd93b]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b-2 border-black pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStudied(c.id)}
                      className="text-[#5dffa8] cursor-pointer"
                      title={isStudied ? 'Studied' : 'Mark as Studied'}
                    >
                      {isStudied ? (
                        <CheckCircle className="w-5 h-5 fill-[#5dffa8] text-black" />
                      ) : (
                        <Square className="w-5 h-5 text-[#ffd93b]" />
                      )}
                    </button>

                    <div>
                      <h4
                        className={`font-arcade text-xs sm:text-sm ${
                          isStudied ? 'text-[#5dffa8]' : 'text-[#ffd93b]'
                        }`}
                      >
                        {c.name}
                      </h4>
                      <span className="font-arcade text-[8px] bg-black/50 text-[#35e0ff] px-2 py-0.5 border border-black">
                        {subNiche}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-black text-[#35e0ff] hover:text-[#5dffa8] p-1.5 border border-black flex items-center gap-1 font-arcade text-[8px]"
                    >
                      <span>VISIT</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {c.id.startsWith('chan-custom') && (
                      <button
                        onClick={() => handleDeleteChannel(c.id)}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-[#1a1033] border-2 border-black p-3 my-2">
                  <span className="font-arcade text-[8px] text-[#ff4fa3] block mb-1">
                    WHY STUDY THIS CREATOR:
                  </span>
                  <p className="font-vt text-lg text-[#fff4d6] leading-relaxed">
                    {whyStudy}
                  </p>
                </div>

                {/* User Notes Section */}
                <div className="mt-3">
                  {isEditingNotes ? (
                    <div className="space-y-1.5 bg-black/60 p-2 border border-black">
                      <textarea
                        rows={2}
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        placeholder="Write what you noticed (e.g. they use swoosh SFX every 3s)..."
                        className="w-full font-vt text-base bg-black text-[#fff4d6] border border-gray-600 p-1.5 outline-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingNotesChannelId(null)}
                          className="font-arcade text-[8px] bg-gray-700 text-white px-2 py-1 border border-black cursor-pointer"
                        >
                          CANCEL
                        </button>
                        <button
                          onClick={() => handleSaveNotes(c.id)}
                          className="font-arcade text-[8px] bg-[#5dffa8] text-[#1a1033] px-2.5 py-1 border border-black cursor-pointer"
                        >
                          SAVE NOTES
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[#b9a9db]">
                      <span className="font-vt text-base line-clamp-1 italic">
                        {userNotes
                          ? `Note: ${userNotes}`
                          : 'No study notes recorded yet.'}
                      </span>
                      <button
                        onClick={() => {
                          setEditingNotesChannelId(c.id);
                          setNotesInput(userNotes);
                        }}
                        className="font-arcade text-[8px] text-[#ffd93b] hover:text-[#fff4d6] flex items-center gap-1 cursor-pointer ml-2 flex-shrink-0"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>{userNotes ? 'EDIT NOTE' : '+ NOTE'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-black/40 flex items-center justify-between">
                <span className="font-arcade text-[8px] text-[#b9a9db]">
                  STATUS: {isStudied ? 'COMPLETED (+25 XP)' : 'PENDING STUDY'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Random Channel Challenge Modal */}
      {randomModalChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#26164a] border-4 border-black p-6 shadow-[8px_8px_0px_#000000] max-w-md w-full text-center space-y-4">
            <Dice5 className="w-12 h-12 text-[#ffd93b] mx-auto animate-bounce" />
            <div>
              <span className="font-arcade text-[9px] bg-[#ff4fa3] text-white px-2 py-0.5 border border-black">
                15-MINUTE DAILY STUDY TARGET
              </span>
              <h3 className="font-arcade text-base sm:text-lg text-[#ffd93b] mt-2">
                {randomModalChannel.name}
              </h3>
              <span className="font-arcade text-[9px] text-[#35e0ff]">
                {randomModalChannel.subNiche || randomModalChannel.nicheTag}
              </span>
            </div>

            <div className="bg-[#1a1033] border-2 border-black p-4 text-left">
              <span className="font-arcade text-[9px] text-[#5dffa8] block mb-1">
                KEY LESSON:
              </span>
              <p className="font-vt text-xl text-[#fff4d6]">
                {randomModalChannel.whyStudy || randomModalChannel.notes || 'Benchmark creator lesson.'}
              </p>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <a
                href={randomModalChannel.url}
                target="_blank"
                rel="noreferrer"
                className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2.5 px-4 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] flex items-center gap-1.5"
              >
                <span>OPEN CHANNEL</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setRandomModalChannel(null)}
                className="font-arcade text-xs bg-gray-800 text-white py-2.5 px-4 border-2 border-black cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Channel Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#26164a] border-4 border-black p-6 shadow-[8px_8px_0px_#000000] max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-arcade text-sm text-[#ffd93b]">
                + ADD BENCHMARK CHANNEL
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#b9a9db] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  CHANNEL / CREATOR NAME
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Fern or Kurzgesagt"
                  className="w-full font-arcade text-xs bg-black text-[#ffd93b] border-2 border-black p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  SUB-NICHE
                </label>
                <input
                  type="text"
                  value={formSubNiche}
                  onChange={(e) => setFormSubNiche(e.target.value)}
                  placeholder="e.g. Science, Documentary, Gaming"
                  className="w-full font-arcade text-xs bg-black text-[#35e0ff] border-2 border-black p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  URL / CHANNEL LINK
                </label>
                <input
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://youtube.com/@channel"
                  className="w-full font-mono text-xs bg-black text-[#fff4d6] border-2 border-black p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  WHY STUDY (EDITING STYLE, HOOKS, RETENTION)
                </label>
                <textarea
                  rows={3}
                  value={formWhyStudy}
                  onChange={(e) => setFormWhyStudy(e.target.value)}
                  placeholder="Incredible pacing and sound effects..."
                  className="w-full font-vt text-lg bg-black text-[#fff4d6] border-2 border-black p-2 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="font-arcade text-xs bg-gray-800 text-white py-2 px-4 border-2 border-black cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleAddChannel}
                className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2 px-5 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] cursor-pointer"
              >
                SAVE CHANNEL (+30 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
