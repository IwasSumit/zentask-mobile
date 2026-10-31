import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskCategory, TaskPriority } from '../../types';
import { Plus, X, Calendar, Inbox, Clock, Sparkles } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTarget?: 'today' | 'backlog';
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  defaultTarget = 'today',
}) => {
  const { addTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('work');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
  const [target, setTarget] = useState<'today' | 'backlog'>(defaultTarget);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      estimatedMinutes,
      target,
    });

    setTitle('');
    setDescription('');
    setEstimatedMinutes(30);
    onClose();
  };

  const templates = [
    { label: 'Deep Work (60m)', title: 'Deep Work: ', min: 60, prio: 'high' as const, cat: 'work' as const },
    { label: 'Quick Call (15m)', title: 'Sync call with ', min: 15, prio: 'medium' as const, cat: 'work' as const },
    { label: 'Workout (45m)', title: 'Daily workout & stretch', min: 45, prio: 'high' as const, cat: 'health' as const },
    { label: 'Read & Learn (30m)', title: 'Read 20 pages of ', min: 30, prio: 'low' as const, cat: 'learning' as const },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">Create New Task</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Templates */}
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Quick Starters
          </span>
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {templates.map(tmpl => (
              <button
                key={tmpl.label}
                type="button"
                onClick={() => {
                  setTitle(tmpl.title);
                  setEstimatedMinutes(tmpl.min);
                  setPriority(tmpl.prio);
                  setCategory(tmpl.cat);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 whitespace-nowrap transition"
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Target: Today vs Backlog */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Destination</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTarget('today')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center space-x-2 text-xs font-medium transition ${
                  target === 'today'
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                    : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Today's List</span>
              </button>

              <button
                type="button"
                onClick={() => setTarget('backlog')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center space-x-2 text-xs font-medium transition ${
                  target === 'backlog'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                    : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Inbox className="w-4 h-4 text-amber-400" />
                <span>Backlog Pile</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="What needs to get done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add key context, links, or expectations..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TaskCategory)}
                className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500 capitalize"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="finance">Finance</option>
                <option value="learning">Learning</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500 capitalize"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Duration Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Estimated Duration
            </label>
            <div className="flex items-center space-x-1.5">
              {[15, 30, 45, 60, 90].map(mins => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setEstimatedMinutes(mins)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition ${
                    estimatedMinutes === mins
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{target === 'today' ? 'Add to Today' : 'Add to Backlog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
