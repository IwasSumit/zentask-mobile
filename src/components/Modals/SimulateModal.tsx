import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { formatISTTimeString } from '../../utils/istTime';
import { SlidersHorizontal, Sun, Moon, Bell, RotateCcw, X, Info } from 'lucide-react';

interface SimulateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulateModal: React.FC<SimulateModalProps> = ({ isOpen, onClose }) => {
  const {
    istDate,
    simulatedTime,
    setSimulatedTime,
    triggerMorningRoutine,
    triggerEveningRoutine,
    triggerMiddayNudge,
  } = useTasks();

  if (!isOpen) return null;

  const handleSimulate9AM = () => {
    setSimulatedTime({ hour: 9, minute: 0 });
    triggerMorningRoutine();
    onClose();
  };

  const handleSimulateMidday = () => {
    setSimulatedTime({ hour: 14, minute: 30 });
    triggerMiddayNudge();
    onClose();
  };

  const handleSimulate10PM = () => {
    setSimulatedTime({ hour: 22, minute: 0 });
    triggerEveningRoutine();
    onClose();
  };

  const handleResetLive = () => {
    setSimulatedTime(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Rhythm Simulator & Testing
              </h2>
              <span className="text-[11px] text-slate-400">
                Instant test mode for IST schedules
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status banner */}
        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Active IST Clock</span>
            <div className="text-sm font-bold font-mono text-white mt-0.5">
              {formatISTTimeString(istDate)}
            </div>
          </div>
          {simulatedTime ? (
            <button
              onClick={handleResetLive}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center space-x-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Live</span>
            </button>
          ) : (
            <span className="text-[11px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Live System Time
            </span>
          )}
        </div>

        <div className="flex items-start space-x-2 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200">
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Instead of waiting for actual 9 AM or 10 PM IST on the clock, tap any scenario below to immediately trigger the notification sounds, modals, and automatic backlog rollover!
          </p>
        </div>

        {/* Simulation Buttons */}
        <div className="space-y-2.5">
          {/* 9:00 AM IST */}
          <button
            onClick={handleSimulate9AM}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 to-amber-600/10 hover:from-amber-500/25 hover:to-amber-600/20 border border-amber-500/30 text-left transition active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                <Sun className="w-4 h-4" />
                <span>Simulate 9:00 AM IST Morning Kickoff</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400/80 group-hover:text-amber-300">
                Run Now →
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-normal">
              Notifies you, plays morning chime, and opens morning planning to add today's tasks or pull from backlog.
            </p>
          </button>

          {/* 2:30 PM Midday Nudge */}
          <button
            onClick={handleSimulateMidday}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-emerald-600/10 hover:from-emerald-500/25 hover:to-emerald-600/20 border border-emerald-500/30 text-left transition active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                <Bell className="w-4 h-4" />
                <span>Simulate Periodic Midday Nudge</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400/80 group-hover:text-emerald-300">
                Run Now →
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-normal">
              Plays subtle audio alert and reminds you of incomplete tasks to keep your focus intact.
            </p>
          </button>

          {/* 10:00 PM IST Evening Review */}
          <button
            onClick={handleSimulate10PM}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/15 to-purple-600/10 hover:from-indigo-500/25 hover:to-purple-600/20 border border-indigo-500/30 text-left transition active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs">
                <Moon className="w-4 h-4" />
                <span>Simulate 10:00 PM IST Evening Review</span>
              </div>
              <span className="text-[10px] font-mono text-indigo-400/80 group-hover:text-indigo-300">
                Run Now →
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-normal">
              Asks for final status of the day. Incomplete tasks will automatically move to backlog and pile up!
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
