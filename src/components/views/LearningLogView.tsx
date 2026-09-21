import React, { useState, useEffect } from 'react';
import { LearningLogEntry, PlatformType } from '../../types';
import {
  saveImageToDB,
  getImageFromDB,
  deleteImageFromDB,
  compressImageFile,
} from '../../utils/db';
import {
  Upload,
  Image as ImageIcon,
  Search,
  Filter,
  Columns2,
  Maximize2,
  X,
  Sparkles,
  Copy,
  Check,
  Trash2,
  HelpCircle,
  Plus,
  Tag,
} from 'lucide-react';

interface LearningLogViewProps {
  learnings: LearningLogEntry[];
  onSaveLearnings: (learnings: LearningLogEntry[]) => void;
  onIncrementXP?: (amount: number) => void;
}

export const LearningLogView: React.FC<LearningLogViewProps> = ({
  learnings,
  onSaveLearnings,
  onIncrementXP,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // New entry modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formPlatform, setFormPlatform] = useState<PlatformType>('instagram');
  const [formTags, setFormTags] = useState('hook, retention');
  const [formWhatHappened, setFormWhatHappened] = useState('');
  const [formWhatILearned, setFormWhatILearned] = useState('');
  const [formWhatIllChange, setFormWhatIllChange] = useState('');
  const [formDropType, setFormDropType] = useState<'hook' | 'middle' | 'end' | 'completion' | 'none'>('hook');
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);

  // Lightbox modal state
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  // Image cache loaded from IndexedDB
  const [loadedImages, setLoadedImages] = useState<{ [id: string]: string }>({});

  // Before/After comparison state
  const [compareMode, setCompareMode] = useState(false);
  const [compareLeftId, setCompareLeftId] = useState<string | null>(null);
  const [compareRightId, setCompareRightId] = useState<string | null>(null);

  // Load images from IndexedDB
  useEffect(() => {
    learnings.forEach(async (entry) => {
      if (entry.imageId && !loadedImages[entry.imageId]) {
        const dataUrl = await getImageFromDB(entry.imageId);
        if (dataUrl) {
          setLoadedImages((prev) => ({ ...prev, [entry.imageId!]: dataUrl }));
        }
      }
    });
  }, [learnings]);

  // Handle Drag & Drop / File Selection
  const handleFileChange = async (file: File) => {
    try {
      const compressedDataUrl = await compressImageFile(file, 1600);
      setFormImageFile(file);
      setFormImagePreview(compressedDataUrl);
    } catch (e) {
      alert('Failed to process image');
    }
  };

  // Handle Paste from clipboard
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          await handleFileChange(file);
        }
      }
    }
  };

  const handleSaveEntry = async () => {
    if (!formTitle.trim()) return;

    let newImageId: string | undefined = undefined;
    if (formImagePreview) {
      newImageId = `img-${Date.now()}`;
      await saveImageToDB(newImageId, formImagePreview);
      setLoadedImages((prev) => ({ ...prev, [newImageId!]: formImagePreview }));
    }

    const tagsArr = formTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const newEntry: LearningLogEntry = {
      id: `learn-${Date.now()}`,
      title: formTitle.trim(),
      platform: formPlatform,
      date: new Date().toISOString().split('T')[0],
      tags: tagsArr,
      notesWhatHappened: formWhatHappened.trim(),
      notesWhatILearned: formWhatILearned.trim(),
      notesWhatIllChange: formWhatIllChange.trim(),
      imageId: newImageId,
      imageUrl: formImagePreview || undefined,
      diagnosisDrop: formDropType,
    };

    onSaveLearnings([newEntry, ...learnings]);
    if (onIncrementXP) onIncrementXP(60);

    // Reset form
    setIsNewModalOpen(false);
    setFormTitle('');
    setFormWhatHappened('');
    setFormWhatILearned('');
    setFormWhatIllChange('');
    setFormImagePreview(null);
    setFormImageFile(null);
  };

  const handleDeleteEntry = async (entry: LearningLogEntry) => {
    if (confirm('Delete this learning log entry?')) {
      if (entry.imageId) {
        await deleteImageFromDB(entry.imageId);
      }
      onSaveLearnings(learnings.filter((l) => l.id !== entry.id));
    }
  };

  const handleCopyAIPrompt = (entry: LearningLogEntry) => {
    const promptText = `Hey AI, act as a top-tier short-form retention analyst. Here is my recent clip analytics:
Platform: ${entry.platform.toUpperCase()}
Title/Clip: ${entry.title}
Drop-off area noticed: ${entry.diagnosisDrop || 'First few seconds'}
What happened: ${entry.notesWhatHappened}
What I learned: ${entry.notesWhatILearned}
What I planned to change: ${entry.notesWhatIllChange}

Based on the viral clipping blueprints (retention timeline, pattern interrupts every 3s, zero dead air, high-contrast captions), audit my approach and give me 3 ruthless, punchy improvements for my next edit.`;

    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const filteredLearnings = learnings.filter((l) => {
    const matchesTag =
      selectedTag === 'All' || l.tags.includes(selectedTag.toLowerCase());
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.notesWhatHappened.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.notesWhatILearned.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  const leftCompareEntry = learnings.find((l) => l.id === compareLeftId);
  const rightCompareEntry = learnings.find((l) => l.id === compareRightId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-black pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-arcade text-xs bg-[#ffd93b] text-[#1a1033] px-2.5 py-0.5 border-2 border-black">
                ANALYTICS LAB
              </span>
              <span className="font-arcade text-xs text-[#5dffa8]">
                {learnings.length} STUDIES LOGGED
              </span>
            </div>
            <h2 className="font-arcade text-lg sm:text-2xl text-[#ffd93b] tracking-wider">
              LEARNING LOG & DIAGNOSTICS
            </h2>
            <p className="font-vt text-xl text-[#fff4d6]">
              Upload screenshots of your retention graphs, diagnose drops, and run before/after tests.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`font-arcade text-xs py-2.5 px-3 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1.5 ${
                compareMode
                  ? 'bg-[#35e0ff] text-[#1a1033]'
                  : 'bg-[#1a1033] text-[#35e0ff] hover:bg-black'
              }`}
            >
              <Columns2 className="w-4 h-4" />
              <span>{compareMode ? 'EXIT COMPARE' : 'COMPARE B/A'}</span>
            </button>

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2.5 px-4 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ LOG STUDY (+60 XP)</span>
            </button>
          </div>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#b9a9db] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search analytics notes..."
              className="w-full font-arcade text-[10px] bg-black text-[#fff4d6] border-2 border-black pl-9 pr-3 py-2 outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            {['All', 'Hook', 'Retention', 'Pacing', 'Audience'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`font-arcade text-[9px] px-3 py-1.5 border-2 border-black cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-[#ff4fa3] text-[#fff4d6] font-bold shadow-[2px_2px_0px_#000]'
                    : 'bg-[#1a1033] text-[#fff4d6] hover:bg-[#35e0ff] hover:text-[#1a1033]'
                }`}
              >
                {tag.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Before / After Comparison Panel */}
      {compareMode && (
        <div className="bg-[#2f1c5c] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] space-y-4">
          <h3 className="font-arcade text-sm text-[#35e0ff] flex items-center gap-2">
            <Columns2 className="w-4 h-4" />
            <span>SIDE-BY-SIDE BEFORE / AFTER COMPARISON</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Selection */}
            <div className="bg-[#1a1033] border-2 border-black p-4 space-y-3">
              <label className="font-arcade text-[10px] text-[#ffd93b] block">
                SELECT BEFORE ENTRY:
              </label>
              <select
                value={compareLeftId || ''}
                onChange={(e) => setCompareLeftId(e.target.value)}
                className="w-full font-arcade text-xs bg-black text-[#fff4d6] border border-gray-600 p-2 outline-none"
              >
                <option value="">-- Choose Study --</option>
                {learnings.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title} ({l.date})
                  </option>
                ))}
              </select>

              {leftCompareEntry && (
                <div className="space-y-2 mt-2">
                  <span className="font-arcade text-xs text-[#5dffa8]">
                    {leftCompareEntry.title}
                  </span>
                  {(leftCompareEntry.imageUrl ||
                    loadedImages[leftCompareEntry.imageId || '']) && (
                    <img
                      src={
                        loadedImages[leftCompareEntry.imageId || ''] ||
                        leftCompareEntry.imageUrl
                      }
                      alt="Before"
                      className="w-full h-40 object-cover border-2 border-black"
                    />
                  )}
                  <p className="font-vt text-base text-[#fff4d6]">
                    <strong>What Happened:</strong> {leftCompareEntry.notesWhatHappened}
                  </p>
                </div>
              )}
            </div>

            {/* Right Selection */}
            <div className="bg-[#1a1033] border-2 border-black p-4 space-y-3">
              <label className="font-arcade text-[10px] text-[#5dffa8] block">
                SELECT AFTER ENTRY:
              </label>
              <select
                value={compareRightId || ''}
                onChange={(e) => setCompareRightId(e.target.value)}
                className="w-full font-arcade text-xs bg-black text-[#fff4d6] border border-gray-600 p-2 outline-none"
              >
                <option value="">-- Choose Study --</option>
                {learnings.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title} ({l.date})
                  </option>
                ))}
              </select>

              {rightCompareEntry && (
                <div className="space-y-2 mt-2">
                  <span className="font-arcade text-xs text-[#5dffa8]">
                    {rightCompareEntry.title}
                  </span>
                  {(rightCompareEntry.imageUrl ||
                    loadedImages[rightCompareEntry.imageId || '']) && (
                    <img
                      src={
                        loadedImages[rightCompareEntry.imageId || ''] ||
                        rightCompareEntry.imageUrl
                      }
                      alt="After"
                      className="w-full h-40 object-cover border-2 border-black"
                    />
                  )}
                  <p className="font-vt text-base text-[#fff4d6]">
                    <strong>What Changed:</strong> {rightCompareEntry.notesWhatIllChange}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Cards Grid */}
      {filteredLearnings.length === 0 ? (
        <div className="bg-[#1a1033] border-4 border-dashed border-gray-600 p-8 text-center text-[#b9a9db]">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <h3 className="font-arcade text-sm text-[#ffd93b]">NO LEARNINGS FOUND</h3>
          <p className="font-vt text-lg mt-1">
            Upload your first analytics retention graph to unlock insights!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLearnings.map((entry) => {
            const displayImg =
              loadedImages[entry.imageId || ''] || entry.imageUrl;

            return (
              <div
                key={entry.id}
                className="bg-[#2f1c5c] border-4 border-black p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between hover:border-[#ffd93b] transition-all"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 border-b-2 border-black pb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-arcade text-[8px] bg-[#ff4fa3] text-[#fff4d6] px-2 py-0.5 border border-black uppercase">
                          {entry.platform}
                        </span>
                        <span className="font-arcade text-[8px] text-[#b9a9db]">
                          {entry.date}
                        </span>
                      </div>
                      <h4 className="font-arcade text-xs text-[#ffd93b]">
                        {entry.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleDeleteEntry(entry)}
                      className="text-[#b9a9db] hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Screenshot Image Thumbnail if available */}
                  {displayImg && (
                    <div
                      onClick={() => setLightboxImageUrl(displayImg)}
                      className="relative group cursor-pointer overflow-hidden border-2 border-black bg-black max-h-52 flex items-center justify-center"
                    >
                      <img
                        src={displayImg}
                        alt={entry.title}
                        className="w-full object-contain max-h-52 group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Maximize2 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}

                  {/* 3 Notes Fields */}
                  <div className="space-y-2 font-vt text-lg">
                    <div className="bg-[#1a1033] p-2.5 border border-black">
                      <span className="font-arcade text-[8px] text-[#ff4fa3] block mb-0.5">
                        WHAT HAPPENED?
                      </span>
                      <p className="text-[#fff4d6] leading-snug">
                        {entry.notesWhatHappened || 'No notes provided.'}
                      </p>
                    </div>

                    <div className="bg-[#1a1033] p-2.5 border border-black">
                      <span className="font-arcade text-[8px] text-[#ffd93b] block mb-0.5">
                        WHAT I LEARNED:
                      </span>
                      <p className="text-[#ffd93b] leading-snug">
                        {entry.notesWhatILearned || 'No notes provided.'}
                      </p>
                    </div>

                    <div className="bg-[#1a1033] p-2.5 border border-black">
                      <span className="font-arcade text-[8px] text-[#5dffa8] block mb-0.5">
                        WHAT I'LL CHANGE NEXT POST:
                      </span>
                      <p className="text-[#5dffa8] leading-snug">
                        {entry.notesWhatIllChange || 'No notes provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((t) => (
                      <span
                        key={t}
                        className="font-arcade text-[8px] bg-black/50 text-[#35e0ff] px-1.5 py-0.5 border border-black"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                  <span className="font-arcade text-[8px] text-[#b9a9db]">
                    DROP: {entry.diagnosisDrop?.toUpperCase() || 'NONE'}
                  </span>

                  <button
                    onClick={() => handleCopyAIPrompt(entry)}
                    className="font-arcade text-[9px] bg-[#1a1033] text-[#ffd93b] hover:bg-[#35e0ff] hover:text-[#1a1033] py-1.5 px-3 border border-black cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{copiedPrompt ? 'PROMPT COPIED!' : 'ASK AI FOR FEEDBACK'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          NEW LEARNING STUDY MODAL
      ========================================================================= */}
      {isNewModalOpen && (
        <div
          onPaste={handlePaste}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
        >
          <div className="bg-[#26164a] border-4 border-black p-6 shadow-[8px_8px_0px_#000000] max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-arcade text-sm text-[#ffd93b]">
                + LOG ANALYTICS STUDY
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
                  TITLE
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. FitFix Day 3 Retention Analysis"
                  className="w-full font-arcade text-xs bg-black text-[#ffd93b] border-2 border-black p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  UPLOAD SCREENSHOT (OR PASTE FROM CLIPBOARD)
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) {
                      handleFileChange(e.dataTransfer.files[0]);
                    }
                  }}
                  className="border-2 border-dashed border-[#5dffa8] p-4 text-center bg-black/40 cursor-pointer hover:bg-black/60"
                  onClick={() => document.getElementById('screenshot-input')?.click()}
                >
                  {formImagePreview ? (
                    <img
                      src={formImagePreview}
                      alt="Preview"
                      className="max-h-36 mx-auto border border-black"
                    />
                  ) : (
                    <div>
                      <Upload className="w-6 h-6 mx-auto text-[#5dffa8] mb-1" />
                      <p className="font-arcade text-[9px] text-[#fff4d6]">
                        DRAG & DROP OR CLICK TO UPLOAD
                      </p>
                      <p className="font-vt text-sm text-[#b9a9db]">
                        (You can also press CTRL+V / CMD+V to paste screenshot directly!)
                      </p>
                    </div>
                  )}
                  <input
                    id="screenshot-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                    PLATFORM
                  </label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value as PlatformType)}
                    className="w-full font-arcade text-xs bg-black text-[#35e0ff] border-2 border-black p-2 outline-none"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                    DROP-OFF ZONE
                  </label>
                  <select
                    value={formDropType}
                    onChange={(e) => setFormDropType(e.target.value as any)}
                    className="w-full font-arcade text-xs bg-black text-[#ff4fa3] border-2 border-black p-2 outline-none"
                  >
                    <option value="hook">First 1-3s (Weak hook)</option>
                    <option value="middle">Middle (Pacing slow)</option>
                    <option value="end">Climax / Payoff</option>
                    <option value="completion">Low completion</option>
                    <option value="none">No drop / viral peak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#ff4fa3] block mb-1">
                  1. WHAT HAPPENED?
                </label>
                <textarea
                  rows={2}
                  value={formWhatHappened}
                  onChange={(e) => setFormWhatHappened(e.target.value)}
                  placeholder="Drop-off happened at 0:02 after a 1 second silent buildup..."
                  className="w-full font-vt text-lg bg-black text-[#fff4d6] border-2 border-black p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#ffd93b] block mb-1">
                  2. WHAT I LEARNED:
                </label>
                <textarea
                  rows={2}
                  value={formWhatILearned}
                  onChange={(e) => setFormWhatILearned(e.target.value)}
                  placeholder="Mag base ka sa last video mo. Hook was too wordy..."
                  className="w-full font-vt text-lg bg-black text-[#fff4d6] border-2 border-black p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#5dffa8] block mb-1">
                  3. WHAT I'LL CHANGE NEXT POST:
                </label>
                <textarea
                  rows={2}
                  value={formWhatIllChange}
                  onChange={(e) => setFormWhatIllChange(e.target.value)}
                  placeholder="Cut directly to the visual punchline on frame 0."
                  className="w-full font-vt text-lg bg-black text-[#fff4d6] border-2 border-black p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  TAGS (comma-separated)
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="hook, pacing, retention"
                  className="w-full font-arcade text-xs bg-black text-[#fff4d6] border-2 border-black p-2 outline-none"
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
                onClick={handleSaveEntry}
                className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2 px-5 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] cursor-pointer"
              >
                SAVE STUDY (+60 XP)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {lightboxImageUrl && (
        <div
          onClick={() => setLightboxImageUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 cursor-zoom-out"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <img
              src={lightboxImageUrl}
              alt="Zoomed Analytics"
              className="max-h-[85vh] max-w-full object-contain border-4 border-black"
            />
            <button
              onClick={() => setLightboxImageUrl(null)}
              className="absolute top-2 right-2 bg-black text-white p-2 border-2 border-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
