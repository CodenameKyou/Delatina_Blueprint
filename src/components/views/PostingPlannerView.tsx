import React, { useState, useEffect } from 'react';
import { PostingSlot, DayOfWeek } from '../../types';
import { DEFAULT_POSTING_SLOTS, PRESET_SCHEDULES } from '../../data/initialData';
import {
  Clock,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Bell,
  Globe,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface PostingPlannerViewProps {
  slots: PostingSlot[];
  onSaveSlots: (slots: PostingSlot[]) => void;
  nextPostCountdown: string;
}

const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const PostingPlannerView: React.FC<PostingPlannerViewProps> = ({
  slots,
  onSaveSlots,
  nextPostCountdown,
}) => {
  // Current local day
  const currentDayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const currentDayName: DayOfWeek =
    currentDayIndex === 0 ? 'Sunday' : DAYS_OF_WEEK[currentDayIndex - 1];

  // Inline editing slot state
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [editingTimeText, setEditingTimeText] = useState<string>('');

  // Add new slot state
  const [addingDay, setAddingDay] = useState<DayOfWeek | null>(null);
  const [newTimeInput, setNewTimeInput] = useState<string>('6 PM');

  // Time converter state
  const [converterPHTTime, setConverterPHTTime] = useState<string>('7 PM');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Convert PHT to US EST / PST
  const calculateConvertedTime = (phtStr: string) => {
    // PHT is UTC+8. EST is UTC-5 (13h behind). PST is UTC-8 (16h behind).
    return {
      pht: phtStr,
      est: phtStr.includes('7 PM')
        ? '7:00 AM EST (Morning commute)'
        : phtStr.includes('12 AM')
        ? '12:00 PM EST (Lunch scroll)'
        : phtStr.includes('5 AM')
        ? '5:00 PM EST (Evening peak)'
        : 'Approx. 13 hours earlier (US East)',
      pst: phtStr.includes('7 PM')
        ? '4:00 AM PST'
        : phtStr.includes('12 AM')
        ? '9:00 AM PST'
        : phtStr.includes('5 AM')
        ? '2:00 PM PST'
        : 'Approx. 16 hours earlier (US West)',
    };
  };

  const handleStartEdit = (slot: PostingSlot) => {
    setEditingSlotId(slot.id);
    setEditingTimeText(slot.time);
  };

  const handleSaveEdit = (slotId: string) => {
    if (!editingTimeText.trim()) return;
    const updated = slots.map((s) =>
      s.id === slotId ? { ...s, time: editingTimeText.trim() } : s
    );
    onSaveSlots(updated);
    setEditingSlotId(null);
    showToast('Time slot updated!');
  };

  const handleDeleteSlot = (slotId: string) => {
    const updated = slots.filter((s) => s.id !== slotId);
    onSaveSlots(updated);
    showToast('Slot removed.');
  };

  const handleAddSlot = (day: DayOfWeek) => {
    if (!newTimeInput.trim()) return;
    const newSlot: PostingSlot = {
      id: `slot-user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      day,
      time: newTimeInput.trim(),
    };
    onSaveSlots([...slots, newSlot]);
    setAddingDay(null);
    setNewTimeInput('6 PM');
    showToast(`Added ${newSlot.time} to ${day}!`);
  };

  const handleResetDefaults = () => {
    onSaveSlots(DEFAULT_POSTING_SLOTS);
    showToast('Reset back to standard IG Reels defaults!');
  };

  const applyPreset = (presetKey: keyof typeof PRESET_SCHEDULES) => {
    const preset = PRESET_SCHEDULES[presetKey];
    if ('slots' in preset) {
      onSaveSlots(preset.slots);
    } else if ('times' in preset) {
      // populate all days with these times
      const newSlots: PostingSlot[] = [];
      DAYS_OF_WEEK.forEach((d) => {
        preset.times.forEach((t, i) => {
          newSlots.push({
            id: `slot-preset-${d}-${i}-${Date.now()}`,
            day: d,
            time: t,
          });
        });
      });
      onSaveSlots(newSlots);
    }
    showToast(`Applied preset: ${preset.name}!`);
  };

  const handleRequestNotifications = async () => {
    if (!('Notification' in window)) {
      showToast('Browser notifications are not supported.');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotificationsEnabled(true);
        new Notification('CLIPPER QUEST', {
          body: 'Posting window notifications armed! We will alert you before peak drops.',
        });
        showToast('Notifications enabled!');
      } else {
        showToast('Notification permission denied.');
      }
    } catch {
      showToast('Could not enable notifications.');
    }
  };

  const converted = calculateConvertedTime(converterPHTTime);

  return (
    <div className="space-y-6">
      {/* Toast message */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#5dffa8] text-[#1a1033] font-arcade text-xs px-4 py-3 border-4 border-black shadow-[4px_4px_0px_#000000] animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Header card with next countdown */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b-4 border-black pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-arcade text-xs bg-[#ffd93b] text-[#1a1033] px-2.5 py-0.5 border-2 border-black">
                WORLD 3
              </span>
              <span className="font-arcade text-xs text-[#35e0ff]">
                INTERACTIVE PLANNER
              </span>
            </div>
            <h2 className="font-arcade text-lg sm:text-2xl text-[#ffd93b] tracking-wider">
              POSTING TIME PLANNER (PHT)
            </h2>
            <p className="font-vt text-xl text-[#fff4d6]">
              All times are fully editable chips. Click to edit, remove, or add new windows.
            </p>
          </div>

          {/* Live countdown display */}
          <div className="bg-black/60 border-2 border-black p-3 text-center w-full lg:w-auto min-w-[220px]">
            <div className="flex items-center justify-center gap-1.5 font-arcade text-[10px] text-[#ff4fa3] mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>NEXT POST WINDOW</span>
            </div>
            <div className="font-arcade text-xl sm:text-2xl text-[#5dffa8] tracking-widest font-bold">
              {nextPostCountdown || '02:14:33'}
            </div>
            <span className="font-vt text-sm text-[#b9a9db]">
              (Targeted to Peak US Traffic)
            </span>
          </div>
        </div>

        {/* Schedule Controls & Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-arcade text-[10px] text-[#ffd93b] mr-1">
              PRESETS:
            </span>
            <button
              onClick={() => applyPreset('defaultIG')}
              className="font-arcade text-[9px] bg-[#1a1033] text-[#fff4d6] border-2 border-black px-2.5 py-1.5 hover:bg-[#ff4fa3] cursor-pointer"
            >
              Default IG
            </button>
            <button
              onClick={() => applyPreset('alonIG')}
              className="font-arcade text-[9px] bg-[#1a1033] text-[#fff4d6] border-2 border-black px-2.5 py-1.5 hover:bg-[#ffd93b] hover:text-[#1a1033] cursor-pointer"
            >
              Alon 6-Slot
            </button>
            <button
              onClick={() => applyPreset('rinMethod')}
              className="font-arcade text-[9px] bg-[#1a1033] text-[#fff4d6] border-2 border-black px-2.5 py-1.5 hover:bg-[#35e0ff] hover:text-[#1a1033] cursor-pointer"
            >
              Rin 3-Interval
            </button>
            <button
              onClick={() => applyPreset('warmUpPeak')}
              className="font-arcade text-[9px] bg-[#1a1033] text-[#fff4d6] border-2 border-black px-2.5 py-1.5 hover:bg-[#5dffa8] hover:text-[#1a1033] cursor-pointer"
            >
              12am-2am Peak
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRequestNotifications}
              className={`font-arcade text-[9px] border-2 border-black px-2.5 py-1.5 flex items-center gap-1.5 cursor-pointer ${
                notificationsEnabled
                  ? 'bg-[#5dffa8] text-[#1a1033]'
                  : 'bg-[#1a1033] text-[#ffd93b] hover:bg-black'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{notificationsEnabled ? 'NOTIFS ARMED' : 'ENABLE NOTIFS'}</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="font-arcade text-[9px] bg-[#1a1033] text-red-300 border-2 border-black px-2.5 py-1.5 hover:bg-red-950 cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const isToday = day === currentDayName;
          const daySlots = slots.filter((s) => s.day === day);

          return (
            <div
              key={day}
              className={`border-4 border-black p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between ${
                isToday
                  ? 'bg-[#2a1854] border-[#5dffa8] ring-2 ring-[#5dffa8]'
                  : 'bg-[#1a1033]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                  <h3
                    className={`font-arcade text-xs ${
                      isToday ? 'text-[#5dffa8]' : 'text-[#ffd93b]'
                    }`}
                  >
                    {day.toUpperCase()}
                  </h3>
                  {isToday && (
                    <span className="font-arcade text-[8px] bg-[#5dffa8] text-[#1a1033] px-1.5 py-0.5 border border-black font-bold">
                      TODAY
                    </span>
                  )}
                </div>

                {/* Slots List */}
                <div className="space-y-2">
                  {daySlots.length === 0 ? (
                    <p className="font-vt text-sm text-[#b9a9db] italic">
                      No slots set yet.
                    </p>
                  ) : (
                    daySlots.map((slot) => {
                      const isEditing = editingSlotId === slot.id;

                      if (isEditing) {
                        return (
                          <div
                            key={slot.id}
                            className="bg-black/70 p-1.5 border-2 border-[#ffd93b] flex items-center gap-1"
                          >
                            <input
                              type="text"
                              value={editingTimeText}
                              onChange={(e) => setEditingTimeText(e.target.value)}
                              className="font-arcade text-[10px] bg-transparent text-[#ffd93b] outline-none w-full px-1"
                              placeholder="e.g. 6 PM"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(slot.id)}
                              className="text-[#5dffa8] hover:scale-110 p-0.5 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="text-red-400 hover:scale-110 p-0.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={slot.id}
                          className="group relative bg-[#26164a] border-2 border-black px-2.5 py-1.5 flex items-center justify-between shadow-[2px_2px_0px_#000] hover:border-[#ffd93b] transition-colors"
                        >
                          <span className="font-arcade text-[10px] text-[#fff4d6] group-hover:text-[#ffd93b]">
                            {slot.time}
                          </span>

                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                            <button
                              onClick={() => handleStartEdit(slot)}
                              className="text-[#b9a9db] hover:text-[#35e0ff] p-0.5 cursor-pointer"
                              title="Edit time"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="text-[#b9a9db] hover:text-red-400 p-0.5 cursor-pointer"
                              title="Delete slot"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Add Slot Button / Form */}
              <div className="mt-4 pt-2 border-t border-black/40">
                {addingDay === day ? (
                  <div className="space-y-1.5 bg-black/60 p-2 border border-black">
                    <input
                      type="text"
                      value={newTimeInput}
                      onChange={(e) => setNewTimeInput(e.target.value)}
                      placeholder="e.g. 10 PM"
                      className="w-full font-arcade text-[9px] bg-black text-[#fff4d6] border border-gray-600 px-2 py-1 outline-none"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleAddSlot(day)}
                        className="w-full font-arcade text-[8px] bg-[#5dffa8] text-[#1a1033] py-1 border border-black cursor-pointer"
                      >
                        SAVE
                      </button>
                      <button
                        onClick={() => setAddingDay(null)}
                        className="w-full font-arcade text-[8px] bg-gray-700 text-white py-1 border border-black cursor-pointer"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingDay(day)}
                    className="w-full font-arcade text-[8px] bg-[#1a1033] text-[#b9a9db] hover:text-[#5dffa8] hover:border-[#5dffa8] py-1.5 px-2 border border-dashed border-gray-600 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3" /> ADD TIME
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PHT <-> US TIME CONVERTER CALCULATOR */}
      <div className="bg-[#26164a] border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-[#35e0ff]" />
          <h3 className="font-arcade text-sm sm:text-base text-[#ffd93b]">
            PHT ↔ US EASTERN / PACIFIC TIME CONVERTER
          </h3>
        </div>
        <p className="font-vt text-lg text-[#b9a9db] mb-4">
          Most viral clipping campaigns target US audiences. Enter a Philippine Time (PHT) to see when your post drops in North America:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="bg-[#1a1033] border-2 border-black p-4">
            <label className="font-arcade text-[10px] text-[#ffd93b] block mb-2">
              SELECT OR TYPE PHT TIME:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={converterPHTTime}
                onChange={(e) => setConverterPHTTime(e.target.value)}
                className="w-full font-arcade text-xs bg-black text-[#5dffa8] border-2 border-black p-2 outline-none"
                placeholder="e.g. 7 PM or 12 AM"
              />
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {['7 PM', '12 AM', '5 AM', '6 AM', '2 PM', '10 PM'].map((presetTime) => (
                <button
                  key={presetTime}
                  onClick={() => setConverterPHTTime(presetTime)}
                  className="font-arcade text-[8px] bg-[#2a1854] text-[#fff4d6] px-2 py-1 border border-black hover:bg-[#ff4fa3] cursor-pointer"
                >
                  {presetTime}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#1a1033] border-2 border-black p-4">
            <span className="font-arcade text-[10px] text-[#35e0ff] block mb-1">
              🇺🇸 US EASTERN TIME (EST)
            </span>
            <div className="font-arcade text-xs sm:text-sm text-[#fff4d6] mb-1">
              {converted.est}
            </div>
            <span className="font-vt text-base text-[#b9a9db]">
              Prime viewing: 7-9 AM morning & 6-10 PM prime time
            </span>
          </div>

          <div className="bg-[#1a1033] border-2 border-black p-4">
            <span className="font-arcade text-[10px] text-[#ff4fa3] block mb-1">
              🇺🇸 US PACIFIC TIME (PST)
            </span>
            <div className="font-arcade text-xs sm:text-sm text-[#fff4d6] mb-1">
              {converted.pst}
            </div>
            <span className="font-vt text-base text-[#b9a9db]">
              West coast audience commute & evening scroll
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
