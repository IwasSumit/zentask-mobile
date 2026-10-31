import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { Moon, Check, AlertTriangle, ArrowDownLeft, X, Sparkles } from 'lucide-react';

interface EveningReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EveningReviewModal: React.FC<EveningReviewModalProps> = ({ isOpen, onClose }) => {
  const { todayTasks, toggleTaskStatus, finalizeEveningReview } = useTasks();

  if (!isOpen) return null;

  const completedToday = todayTasks.filter(t => t.status === 'completed');
  const incompleteToday = todayTasks.filter(t => t.status !== 'completed');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wide">
                10:00 PM IST Evening Review
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Daily Status & Backlog Rollover
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Highlights */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Completed Today</span>
            <div className="text-lg font-bold text-emerald-400">{completedToday.length} Tasks</div>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Incomplete (Rollover)</span>
            <div className="text-lg font-bold text-rose-400">{incompleteToday.length} Tasks</div>
          </div>
        </div>

        {/* Incomplete Tasks Review */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">
              Check off any last-minute finishes:
            </span>
            <span className="text-[10px] text-amber-400 font-medium flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Unchecked go to Backlog</span>
            </span>
          </div>

          {incompleteToday.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-center text-xs text-emerald-300 font-medium">
              🎉 Outstanding! Everything planned for today was completed! Zero backlog rollover.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {incompleteToday.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs"
                >
                  <label className="flex items-center space-x-2.5 flex-1 min-w-0 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => toggleTaskStatus(task.id)}
                      className="w-5 h-5 rounded-full border border-slate-600 hover:border-emerald-400 flex items-center justify-center bg-slate-900 transition flex-shrink-0"
                    >
                      <Check className="w-3 h-3 opacity-0 hover:opacity-100 text-emerald-400" />
                    </button>
                    <span className="truncate text-slate-200 font-medium">
                      {task.title}
                    </span>
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono flex-shrink-0 pl-2">
                    → Backlog ({task.rolloverCount + 1}x)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Closing your evening intentionally prevents unfinished work from creating mental fatigue. Incomplete tasks will remain safely stored in your Backlog for tomorrow's 9:00 AM planning.
        </p>

        {/* Finalize Button */}
        <button
          onClick={finalizeEveningReview}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>
            {incompleteToday.length > 0
              ? `Move ${incompleteToday.length} Incomplete to Backlog & Wrap Up`
              : 'Complete Evening Review & Rest'}
          </span>
        </button>
      </div>
    </div>
  );
};
