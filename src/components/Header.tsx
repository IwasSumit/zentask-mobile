import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { formatISTTimeString, getRhythmPhase, getCountdownToNextMilestone } from '../utils/istTime';
import { Clock, Bell, Sparkles, SlidersHorizontal, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onOpenSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSimulator }) => {
  const { istDate, simulatedTime, notifications, triggerMorningRoutine, triggerEveningRoutine, triggerMiddayNudge } = useTasks();
  const phaseInfo = getRhythmPhase(istDate);
  const countdown = getCountdownToNextMilestone(istDate);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-sm">
            ZT
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-base font-bold text-white tracking-tight leading-none">ZenTask</h1>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                IST RHYTHM
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center mt-0.5">
              <Clock className="w-3 h-3 mr-1 text-indigo-400 inline" />
              {formatISTTimeString(istDate)}
              {simulatedTime && (
                <span className="ml-1.5 text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded border border-amber-500/30">
                  Simulated
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenSimulator}
            className="flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition active:scale-95"
            title="Simulate 9 AM / 10 PM IST Routine"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline font-medium">Test Time</span>
          </button>

          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition active:scale-95"
            title="Routine Triggers"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Routine Phase Pill */}
      <div className="mt-2.5 flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-800">
        <div className="flex items-center space-x-1.5 truncate">
          <span className={`px-2 py-0.5 rounded-md font-medium text-[11px] border ${phaseInfo.badgeColor}`}>
            {phaseInfo.title}
          </span>
          <span className="text-slate-400 text-[11px] hidden xs:inline truncate">
            {phaseInfo.description}
          </span>
        </div>
        <div className="text-[11px] text-slate-400 whitespace-nowrap ml-2">
          Next: <span className="text-slate-200 font-medium">{countdown.timeRemaining}</span>
        </div>
      </div>

      {/* Quick Routine Trigger Drawer */}
      {showQuickActions && (
        <div className="mt-2.5 p-3 rounded-xl bg-slate-800/95 border border-slate-700 shadow-xl space-y-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Quick Rhythm Triggers</span>
            <button
              onClick={() => setShowQuickActions(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { triggerMorningRoutine(); setShowQuickActions(false); }}
              className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-left transition"
            >
              <div className="flex items-center space-x-1 text-amber-300 font-medium text-xs">
                <Sun className="w-3.5 h-3.5" />
                <span>9 AM</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Morning Kickoff</div>
            </button>

            <button
              onClick={() => { triggerMiddayNudge(); setShowQuickActions(false); }}
              className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-left transition"
            >
              <div className="flex items-center space-x-1 text-emerald-300 font-medium text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nudge</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Focus Reminder</div>
            </button>

            <button
              onClick={() => { triggerEveningRoutine(); setShowQuickActions(false); }}
              className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-left transition"
            >
              <div className="flex items-center space-x-1 text-indigo-300 font-medium text-xs">
                <Moon className="w-3.5 h-3.5" />
                <span>10 PM</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Evening Review</div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
