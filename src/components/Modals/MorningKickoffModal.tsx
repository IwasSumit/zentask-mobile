import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Sun, Sparkles, Plus, ArrowUpRight, Check, X } from 'lucide-react';
import { TaskCategory, TaskPriority } from '../../types';

interface MorningKickoffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MorningKickoffModal: React.FC<MorningKickoffModalProps> = ({ isOpen, onClose }) => {
  const { backlogTasks, moveToToday, addTask } = useTasks();
  const [newTitle, setNewTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('work');
  const [priority, setPriority] = useState<TaskPriority>('high');

  if (!isOpen) return null;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      addTask({
        title: newTitle.trim(),
        category,
        priority,
        target: 'today',
      });
      setNewTitle('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                9:00 AM IST Morning Kickoff
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Plan Today's Intentions
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

        <p className="text-xs text-slate-300 leading-relaxed">
          Starting your morning with clarity sets your day's momentum. Pull critical tasks from your backlog and declare 1 to 3 key priorities for today.
        </p>

        {/* Section 1: Backlog Rescue */}
        {backlogTasks.length > 0 && (
          <div className="space-y-2 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-300">
                Rescue from Backlog ({backlogTasks.length} pending)
              </span>
              <span className="text-[10px] text-slate-400">Pick max 1-2</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {backlogTasks.slice(0, 3).map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-slate-200 truncate">{task.title}</p>
                    <span className="text-[10px] text-amber-400 font-medium">
                      Rolled over {task.rolloverCount}x
                    </span>
                  </div>
                  <button
                    onClick={() => moveToToday(task.id)}
                    className="flex-shrink-0 px-2 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-[11px] font-semibold flex items-center space-x-1 transition"
                  >
                    <ArrowUpRight className="w-3 h-3" />
                    <span>Pull</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Quick Add Today's Goal */}
        <form onSubmit={handleQuickAdd} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-200">
            Add a Fresh Priority for Today:
          </label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="e.g. Finish client proposal by 2 PM..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center space-x-2">
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TaskCategory)}
                className="bg-slate-950 text-slate-300 text-xs rounded-xl px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500 capitalize"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="finance">Finance</option>
                <option value="learning">Learning</option>
              </select>

              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="bg-slate-950 text-slate-300 text-xs rounded-xl px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500 capitalize"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </form>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Start My Focused Day</span>
        </button>
      </div>
    </div>
  );
};
