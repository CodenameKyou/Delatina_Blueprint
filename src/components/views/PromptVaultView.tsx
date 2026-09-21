import React, { useState } from 'react';
import { PromptItem, PromptVersion } from '../../types';
import {
  Sparkles,
  Copy,
  Check,
  Star,
  Plus,
  Trash2,
  Edit,
  History,
  Search,
  Filter,
  Download,
  Upload,
  BookOpen,
  Wand2,
  X,
} from 'lucide-react';

interface PromptVaultViewProps {
  prompts: PromptItem[];
  onSavePrompts: (prompts: PromptItem[]) => void;
  onIncrementXP?: (amount: number) => void;
}

export const PromptVaultView: React.FC<PromptVaultViewProps> = ({
  prompts,
  onSavePrompts,
  onIncrementXP,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fill & Copy Modal state
  const [fillModalPrompt, setFillModalPrompt] = useState<PromptItem | null>(null);
  const [placeholderValues, setPlaceholderValues] = useState<{ [key: string]: string }>({});

  // New / Edit Prompt Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Hooks' | 'Captions' | 'Hashtags' | 'Other'>('Hooks');
  const [formBody, setFormBody] = useState('');
  const [formTags, setFormTags] = useState('');

  // Version history modal state
  const [historyPrompt, setHistoryPrompt] = useState<PromptItem | null>(null);

  // Extract placeholders [LIKE THIS]
  const extractPlaceholders = (text: string): string[] => {
    const regex = /\[(.*?)\]/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  };

  const handleOpenFillModal = (prompt: PromptItem) => {
    const placeholders = extractPlaceholders(prompt.body);
    const initialVals: { [key: string]: string } = {};
    placeholders.forEach((p) => {
      initialVals[p] = '';
    });
    setPlaceholderValues(initialVals);
    setFillModalPrompt(prompt);
  };

  const getFilledPromptText = (prompt: PromptItem) => {
    let result = prompt.body;
    Object.keys(placeholderValues).forEach((ph) => {
      const val = placeholderValues[ph] || `[${ph}]`;
      result = result.split(`[${ph}]`).join(val);
    });
    return result;
  };

  const handleCopyFilled = (prompt: PromptItem) => {
    const textToCopy = getFilledPromptText(prompt);
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);

    // Increment used count
    const updated = prompts.map((p) =>
      p.id === prompt.id ? { ...p, usedCount: (p.usedCount || 0) + 1 } : p
    );
    onSavePrompts(updated);
    if (onIncrementXP) onIncrementXP(15);
    setFillModalPrompt(null);
  };

  const handleQuickCopy = (prompt: PromptItem) => {
    navigator.clipboard.writeText(prompt.body);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);

    const updated = prompts.map((p) =>
      p.id === prompt.id ? { ...p, usedCount: (p.usedCount || 0) + 1 } : p
    );
    onSavePrompts(updated);
    if (onIncrementXP) onIncrementXP(10);
  };

  const handleToggleFavorite = (promptId: string) => {
    const updated = prompts.map((p) =>
      p.id === promptId ? { ...p, isFavorite: !p.isFavorite } : p
    );
    onSavePrompts(updated);
  };

  const handleDeletePrompt = (promptId: string) => {
    if (confirm('Are you sure you want to discard this spell from your vault?')) {
      const updated = prompts.filter((p) => p.id !== promptId);
      onSavePrompts(updated);
    }
  };

  const handleOpenNewModal = () => {
    setEditingPrompt(null);
    setFormTitle('');
    setFormCategory('Hooks');
    setFormBody('');
    setFormTags('');
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (prompt: PromptItem) => {
    setEditingPrompt(prompt);
    setFormTitle(prompt.title);
    setFormCategory(prompt.category);
    setFormBody(prompt.body);
    setFormTags(prompt.tags.join(', '));
    setIsEditModalOpen(true);
  };

  const handleSaveForm = () => {
    if (!formTitle.trim() || !formBody.trim()) return;

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingPrompt) {
      // Save version in history
      const prevVersions: PromptVersion[] = editingPrompt.history || [];
      const updatedHistory: PromptVersion[] = [
        { timestamp: new Date().toISOString(), body: editingPrompt.body },
        ...prevVersions,
      ].slice(0, 5); // keep last 5 edits

      const updated = prompts.map((p) =>
        p.id === editingPrompt.id
          ? {
              ...p,
              title: formTitle.trim(),
              category: formCategory,
              body: formBody.trim(),
              tags: tagsArray,
              history: updatedHistory,
            }
          : p
      );
      onSavePrompts(updated);
    } else {
      // Create new prompt
      const newPrompt: PromptItem = {
        id: `prompt-user-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        body: formBody.trim(),
        tags: tagsArray,
        isFavorite: false,
        usedCount: 0,
        history: [],
        createdAt: new Date().toISOString(),
      };
      onSavePrompts([newPrompt, ...prompts]);
      if (onIncrementXP) onIncrementXP(30);
    }

    setIsEditModalOpen(false);
  };

  // Export Prompts
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(prompts, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clipper-quest-prompts-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Prompts
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          onSavePrompts([...imported, ...prompts]);
          alert(`Successfully imported ${imported.length} prompts into the vault!`);
        }
      } catch {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Filtering
  const filteredPrompts = prompts.filter((p) => {
    const matchesCat =
      selectedCategory === 'All' ||
      (selectedCategory === 'Favorites' && p.isFavorite) ||
      p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-black pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-arcade text-xs bg-[#ff4fa3] text-[#fff4d6] px-2.5 py-0.5 border-2 border-black">
                SPELLBOOK
              </span>
              <span className="font-arcade text-xs text-[#5dffa8]">
                {prompts.length} PROMPTS READY
              </span>
            </div>
            <h2 className="font-arcade text-lg sm:text-2xl text-[#ffd93b] tracking-wider">
              PROMPT VAULT
            </h2>
            <p className="font-vt text-xl text-[#fff4d6]">
              Store, reuse, and customize your viral AI prompts with Fill & Copy variables.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleOpenNewModal}
              className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2.5 px-4 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ NEW PROMPT</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="font-arcade text-[10px] bg-[#1a1033] text-[#35e0ff] border-2 border-black p-2.5 hover:bg-black cursor-pointer"
              title="Export Prompts as JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <label
              className="font-arcade text-[10px] bg-[#1a1033] text-[#ffd93b] border-2 border-black p-2.5 hover:bg-black cursor-pointer"
              title="Import Prompts JSON"
            >
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#b9a9db] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts by keyword or tag..."
              className="w-full font-arcade text-[10px] bg-black text-[#fff4d6] border-2 border-black pl-9 pr-3 py-2 outline-none focus:border-[#ffd93b]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            {['All', 'Favorites', 'Hooks', 'Captions', 'Hashtags', 'Other'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`font-arcade text-[9px] px-3 py-1.5 border-2 border-black cursor-pointer transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#ffd93b] text-[#1a1033] font-bold shadow-[2px_2px_0px_#000]'
                      : 'bg-[#1a1033] text-[#fff4d6] hover:bg-[#35e0ff] hover:text-[#1a1033]'
                  }`}
                >
                  {cat === 'Favorites' ? '★ FAVS' : cat.toUpperCase()}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Prompts Cards Grid */}
      {filteredPrompts.length === 0 ? (
        <div className="bg-[#1a1033] border-4 border-dashed border-gray-600 p-8 text-center">
          <BookOpen className="w-12 h-12 text-[#b9a9db] mx-auto mb-2 opacity-50" />
          <h3 className="font-arcade text-sm text-[#ffd93b]">NO SPELLS FOUND</h3>
          <p className="font-vt text-lg text-[#b9a9db] mt-1">
            Nothing here yet, player one! Try adjusting your search or add a new prompt.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPrompts.map((p) => {
            const hasPlaceholders = extractPlaceholders(p.body).length > 0;
            const isCopied = copiedId === p.id;

            return (
              <div
                key={p.id}
                className="bg-[#2f1c5c] border-4 border-black p-5 shadow-[4px_4px_0px_#000000] flex flex-col justify-between hover:border-[#ffd93b] transition-all group"
              >
                <div>
                  {/* Top card header */}
                  <div className="flex items-start justify-between gap-2 border-b-2 border-black pb-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-arcade text-[9px] bg-[#ff4fa3] text-[#fff4d6] px-2 py-0.5 border border-black">
                        {p.category.toUpperCase()}
                      </span>
                      <h4 className="font-arcade text-xs text-[#ffd93b]">
                        {p.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleFavorite(p.id)}
                        className={`p-1 cursor-pointer hover:scale-110 ${
                          p.isFavorite ? 'text-[#ffd93b]' : 'text-gray-500'
                        }`}
                        title="Toggle Favorite"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            p.isFavorite ? 'fill-[#ffd93b]' : ''
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="text-[#b9a9db] hover:text-[#35e0ff] p-1 cursor-pointer"
                        title="Edit Prompt"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {p.history && p.history.length > 0 && (
                        <button
                          onClick={() => setHistoryPrompt(p)}
                          className="text-[#b9a9db] hover:text-[#5dffa8] p-1 cursor-pointer"
                          title="Version History"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeletePrompt(p.id)}
                        className="text-[#b9a9db] hover:text-red-400 p-1 cursor-pointer"
                        title="Delete Prompt"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body text preview */}
                  <div className="bg-[#1a1033] border-2 border-black p-3 my-2 max-h-48 overflow-y-auto">
                    <pre className="font-mono text-xs text-[#fff4d6] whitespace-pre-wrap leading-relaxed select-all">
                      {p.body}
                    </pre>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="font-arcade text-[8px] bg-black/40 text-[#35e0ff] px-1.5 py-0.5 border border-black"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t-2 border-black">
                  <span className="font-arcade text-[9px] text-[#b9a9db]">
                    USED {p.usedCount || 0} TIMES
                  </span>

                  <div className="flex items-center gap-2">
                    {hasPlaceholders && (
                      <button
                        onClick={() => handleOpenFillModal(p)}
                        className="font-arcade text-[9px] bg-[#ffd93b] text-[#1a1033] py-2 px-3 border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#35e0ff] cursor-pointer flex items-center gap-1"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>FILL & COPY</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleQuickCopy(p)}
                      className={`font-arcade text-[9px] py-2 px-3 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1 ${
                        isCopied
                          ? 'bg-[#5dffa8] text-[#1a1033]'
                          : 'bg-[#ff4fa3] text-[#fff4d6] hover:bg-[#ff71ce]'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3" /> COPIED!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> QUICK COPY
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          FILL & COPY MODAL
      ========================================================================= */}
      {fillModalPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#26164a] border-4 border-black p-6 shadow-[8px_8px_0px_#000000] max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-[#ffd93b]" />
                <h3 className="font-arcade text-sm text-[#ffd93b]">
                  FILL & COPY PROMPT
                </h3>
              </div>
              <button
                onClick={() => setFillModalPrompt(null)}
                className="text-[#b9a9db] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-vt text-lg text-[#fff4d6]">
              Fill in the placeholder variables below to craft your personalized prompt:
            </p>

            {/* Input fields for placeholders */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {extractPlaceholders(fillModalPrompt.body).map((ph) => (
                <div key={ph} className="bg-[#1a1033] border-2 border-black p-3">
                  <label className="font-arcade text-[9px] text-[#5dffa8] block mb-1">
                    [{ph}]
                  </label>
                  <textarea
                    rows={2}
                    value={placeholderValues[ph] || ''}
                    onChange={(e) =>
                      setPlaceholderValues((prev) => ({
                        ...prev,
                        [ph]: e.target.value,
                      }))
                    }
                    placeholder={`Enter your ${ph}...`}
                    className="w-full font-mono text-xs bg-black text-[#fff4d6] border border-gray-700 p-2 outline-none focus:border-[#ffd93b]"
                  />
                </div>
              ))}
            </div>

            {/* Preview of final text */}
            <div className="bg-black/60 border-2 border-black p-3">
              <span className="font-arcade text-[9px] text-[#b9a9db] block mb-1">
                PREVIEW:
              </span>
              <pre className="font-mono text-xs text-[#35e0ff] whitespace-pre-wrap max-h-32 overflow-y-auto">
                {getFilledPromptText(fillModalPrompt)}
              </pre>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setFillModalPrompt(null)}
                className="font-arcade text-xs bg-gray-800 text-white py-2.5 px-4 border-2 border-black cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={() => handleCopyFilled(fillModalPrompt)}
                className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2.5 px-5 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] cursor-pointer flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                <span>COPY TO CLIPBOARD (+15 XP)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          NEW / EDIT PROMPT MODAL
      ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#26164a] border-4 border-black p-6 shadow-[8px_8px_0px_#000000] max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-arcade text-sm text-[#ffd93b]">
                {editingPrompt ? 'EDIT PROMPT SPELL' : '+ NEW PROMPT SPELL'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
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
                  placeholder="e.g. 3-Second Hook Hookup"
                  className="w-full font-arcade text-xs bg-black text-[#ffd93b] border-2 border-black p-2 outline-none focus:border-[#ffd93b]"
                />
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  CATEGORY
                </label>
                <select
                  value={formCategory}
                  onChange={(e) =>
                    setFormCategory(
                      e.target.value as 'Hooks' | 'Captions' | 'Hashtags' | 'Other'
                    )
                  }
                  className="w-full font-arcade text-xs bg-black text-[#35e0ff] border-2 border-black p-2 outline-none"
                >
                  <option value="Hooks">Hooks</option>
                  <option value="Captions">Captions</option>
                  <option value="Hashtags">Hashtags</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
                  BODY (Use [PLACEHOLDER] for fill-in variables)
                </label>
                <textarea
                  rows={6}
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  placeholder="Rephrase this hook: [Paste hook here]..."
                  className="w-full font-mono text-xs bg-black text-[#fff4d6] border-2 border-black p-2 outline-none focus:border-[#5dffa8]"
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
                  placeholder="hook, viral, genz"
                  className="w-full font-arcade text-xs bg-black text-[#fff4d6] border-2 border-black p-2 outline-none focus:border-[#ffd93b]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="font-arcade text-xs bg-gray-800 text-white py-2 px-4 border-2 border-black cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveForm}
                className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2 px-5 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] cursor-pointer"
              >
                SAVE SPELL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VERSION HISTORY MODAL
      ========================================================================= */}
      {historyPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#26164a] border-4 border-black p-6 shadow-[8px_8px_0px_#000000] max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#5dffa8]" />
                <h3 className="font-arcade text-sm text-[#ffd93b]">
                  VERSION HISTORY (LAST 5 EDITS)
                </h3>
              </div>
              <button
                onClick={() => setHistoryPrompt(null)}
                className="text-[#b9a9db] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {historyPrompt.history.map((h, i) => (
                <div key={i} className="bg-[#1a1033] border-2 border-black p-3">
                  <div className="flex items-center justify-between font-arcade text-[8px] text-[#b9a9db] mb-1">
                    <span>EDIT #{i + 1}</span>
                    <span>{new Date(h.timestamp).toLocaleString()}</span>
                  </div>
                  <pre className="font-mono text-xs text-[#fff4d6] whitespace-pre-wrap">
                    {h.body}
                  </pre>
                </div>
              ))}
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setHistoryPrompt(null)}
                className="font-arcade text-xs bg-[#ffd93b] text-[#1a1033] py-2 px-4 border-2 border-black cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
