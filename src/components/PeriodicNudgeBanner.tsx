import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Bell, Sparkles, X, ArrowRight } from 'lucide-react';

interface PeriodicNudgeBannerProps {
  onSwitchToToday: () => void;
}

export const PeriodicNudgeBanner: React.FC<PeriodicNudgeBannerProps> = ({ onSwitchToToday }) => {
  const { isNudgeVisible, setIsNudgeVisible, nudgeMessage } = useTasks();

  if (!isNudgeVisible) return null;

  return (
    <div className="fixed top-14 left-3 right-3 z-40 max-w-md mx-auto animate-in slide-in-from-top-4 duration-300">
      <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-md flex items-start space-x-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bell className="w-4 h-4 animate-bounce" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Rhythm Focus Nudge</span>
            </span>
            <button
              onClick={() => setIsNudgeVisible(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-200 mt-1 leading-snug">
            {nudgeMessage || "Friendly nudge: How are today's tasks going? Take a moment to check your progress!"}
          </p>

          <div className="mt-2.5 flex items-center space-x-2">
            <button
              onClick={() => {
                setIsNudgeVisible(false);
                onSwitchToToday();
              }}
              className="text-xs px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center space-x-1 transition active:scale-95"
            >
              <span>View Today</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsNudgeVisible(false)}
              className="text-xs px-2.5 py-1 text-slate-400 hover:text-slate-200 font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
