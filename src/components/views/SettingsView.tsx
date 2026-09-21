import React, { useState } from 'react';
import { PlayerProfile, ThemeMode } from '../../types';
import { play8BitSound } from '../../utils/sound';
import { exportAllDataAsJSON, importDataFromJSON, resetAllData } from '../../utils/storage';
import {
  Settings,
  Volume2,
  VolumeX,
  Monitor,
  Download,
  Upload,
  RotateCcw,
  Palette,
  Sparkles,
  Keyboard,
  Check,
} from 'lucide-react';

interface SettingsViewProps {
  profile: PlayerProfile;
  onUpdateProfile: (profile: PlayerProfile) => void;
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRefreshAllData: () => void;
  onOpenTutorial?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  currentTheme,
  onThemeChange,
  crtEnabled,
  onToggleCrt,
  soundEnabled,
  onToggleSound,
  onRefreshAllData,
  onOpenTutorial,
}) => {
  const [playerNameInput, setPlayerNameInput] = useState(profile.name);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  const handleSaveProfileName = () => {
    if (!playerNameInput.trim()) return;
    onUpdateProfile({ ...profile, name: playerNameInput.trim() });
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2000);
  };

  const handleTestSound = () => {
    play8BitSound('questComplete', soundEnabled);
  };

  const handleExport = () => {
    exportAllDataAsJSON();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const jsonStr = event.target?.result as string;
      const success = importDataFromJSON(jsonStr);
      if (success) {
        alert('All game progress, logs, and prompts restored!');
        onRefreshAllData();
      } else {
        alert('Failed to parse import JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (
      confirm(
        'WARNING: Are you sure you want to start a NEW GAME+? This resets quests, streaks, and posts back to initial state.'
      )
    ) {
      resetAllData();
      onRefreshAllData();
      alert('Game data reset!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-[#ffd93b]" />
          <span className="font-arcade text-xs text-[#5dffa8]">
            CONFIGURATION
          </span>
        </div>
        <h2 className="font-arcade text-lg sm:text-2xl text-[#ffd93b] tracking-wider">
          SETTINGS & SYSTEM CONFIG
        </h2>
        <p className="font-vt text-xl text-[#fff4d6]">
          Customise your arcade aesthetic, audio triggers, CRT filters, and export game save files.
        </p>
      </div>

      {/* Theme Selection */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-black pb-2">
          <Palette className="w-5 h-5 text-[#ff4fa3]" />
          <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b]">
            VISUAL THEME PALETTE
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 'night', name: 'Deep Night (#1a1033)', desc: 'Neon purple, pink, cyan arcade darkness' },
            { id: 'cyberpunk', name: 'Cyberpunk Neon', desc: 'Electric blue and hot magenta punch' },
            { id: 'gameboy', name: 'Game Boy DMG-01', desc: 'Retro 4-shade greenish LCD phosphor' },
            { id: 'arcade', name: 'Retro 80s Arcade', desc: 'High saturation golden yellow and CRT red' },
            { id: 'light', name: 'Paper Light Mode', desc: 'Card cream and high-contrast clean ink' },
          ].map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme.id as ThemeMode)}
                className={`p-4 border-4 border-black text-left cursor-pointer transition-all shadow-[4px_4px_0px_#000] ${
                  isSelected
                    ? 'bg-[#5dffa8] text-[#1a1033] -translate-y-1'
                    : 'bg-[#1a1033] text-[#fff4d6] hover:border-[#ffd93b]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-arcade text-xs">{theme.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#1a1033]" />}
                </div>
                <p className="font-vt text-base opacity-80">{theme.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio, CRT & Display Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CRT Scanline Toggle */}
        <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-3">
              <Monitor className="w-5 h-5 text-[#35e0ff]" />
              <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b]">
                CRT MONITOR SCANLINES
              </h3>
            </div>
            <p className="font-vt text-lg text-[#fff4d6] mb-4">
              Toggle subtle authentic retro scanlines and cathode-ray vignette overlay across the viewport.
            </p>
          </div>

          <button
            onClick={onToggleCrt}
            className={`font-arcade text-xs py-3 px-4 border-2 border-black cursor-pointer shadow-[3px_3px_0px_#000] ${
              crtEnabled
                ? 'bg-[#5dffa8] text-[#1a1033]'
                : 'bg-[#1a1033] text-[#b9a9db]'
            }`}
          >
            {crtEnabled ? '✓ CRT SCANLINES ON' : '✕ CRT SCANLINES OFF'}
          </button>
        </div>

        {/* 8-Bit Audio Synth Toggle */}
        <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-[#5dffa8]" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-500" />
              )}
              <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b]">
                8-BIT SYNTH SOUND EFFECTS
              </h3>
            </div>
            <p className="font-vt text-lg text-[#fff4d6] mb-4">
              Real Web Audio API synthesizer chiptune clicks, quest jingles, and level up fanfares.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onToggleSound}
              className={`w-full font-arcade text-xs py-3 px-4 border-2 border-black cursor-pointer shadow-[3px_3px_0px_#000] ${
                soundEnabled
                  ? 'bg-[#5dffa8] text-[#1a1033]'
                  : 'bg-[#1a1033] text-[#b9a9db]'
              }`}
            >
              {soundEnabled ? '✓ AUDIO ENABLED' : '✕ AUDIO MUTED'}
            </button>

            <button
              onClick={handleTestSound}
              className="font-arcade text-xs bg-[#ffd93b] text-[#1a1033] py-3 px-4 border-2 border-black cursor-pointer shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff]"
            >
              TEST SFX
            </button>
          </div>
        </div>
      </div>

      {/* Player Profile Configuration */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] space-y-4">
        <h3 className="font-arcade text-sm text-[#ffd93b]">
          PLAYER PROFILE CONFIG
        </h3>

        <div className="flex flex-col sm:flex-row items-end gap-3 max-w-md">
          <div className="w-full">
            <label className="font-arcade text-[9px] text-[#fff4d6] block mb-1">
              CALLSIGN / PLAYER NAME
            </label>
            <input
              type="text"
              value={playerNameInput}
              onChange={(e) => setPlayerNameInput(e.target.value)}
              className="w-full font-arcade text-xs bg-black text-[#5dffa8] border-2 border-black p-2.5 outline-none"
            />
          </div>

          <button
            onClick={handleSaveProfileName}
            className="font-arcade text-xs bg-[#5dffa8] text-[#1a1033] py-2.5 px-5 border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#35e0ff] cursor-pointer flex-shrink-0"
          >
            {saveSuccessToast ? 'SAVED!' : 'UPDATE'}
          </button>
        </div>
      </div>

      {/* Save Game Data & Backup Management */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000] space-y-4">
        <h3 className="font-arcade text-sm text-[#ffd93b]">
          SAVE MEMORY CARD (BACKUP & RESTORE)
        </h3>
        <p className="font-vt text-lg text-[#fff4d6]">
          All your game data is stored in browser storage. Download a backup JSON file or import a saved game on another device.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExport}
            className="font-arcade text-xs bg-[#35e0ff] text-[#1a1033] py-2.5 px-4 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#5dffa8] cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT SAVE FILE (.JSON)</span>
          </button>

          <label className="font-arcade text-xs bg-[#ffd93b] text-[#1a1033] py-2.5 px-4 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#35e0ff] cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>RESTORE FROM JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          {onOpenTutorial && (
            <button
              onClick={onOpenTutorial}
              className="font-arcade text-xs bg-[#ff4fa3] text-white py-2.5 px-4 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#ff71ce] cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>REPLAY TUTORIAL</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="font-arcade text-xs bg-red-900 text-red-200 py-2.5 px-4 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-red-800 cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>NEW GAME+ (WIPE DATA)</span>
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Guide */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex items-center gap-2 mb-3">
          <Keyboard className="w-5 h-5 text-[#ffd93b]" />
          <h3 className="font-arcade text-sm text-[#ffd93b]">
            ARCADE KEYBOARD CONTROLS
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-arcade text-[9px]">
          <div className="bg-[#1a1033] p-2.5 border border-black flex justify-between">
            <span className="text-[#35e0ff]">D / 1</span>
            <span className="text-[#fff4d6]">Dashboard</span>
          </div>
          <div className="bg-[#1a1033] p-2.5 border border-black flex justify-between">
            <span className="text-[#35e0ff]">P</span>
            <span className="text-[#fff4d6]">Prompt Vault</span>
          </div>
          <div className="bg-[#1a1033] p-2.5 border border-black flex justify-between">
            <span className="text-[#35e0ff]">U</span>
            <span className="text-[#fff4d6]">Upload Tracker</span>
          </div>
          <div className="bg-[#1a1033] p-2.5 border border-black flex justify-between">
            <span className="text-[#35e0ff]">L</span>
            <span className="text-[#fff4d6]">Learning Log</span>
          </div>
        </div>
      </div>
    </div>
  );
};
