import React, { useState } from 'react';
import { Task, TaskPriority, TaskCategory } from '../types';
import { useTasks } from '../context/TaskContext';
import { Check, Trash2, ArrowUpRight, ArrowDownLeft, Clock, Sparkles, ChevronDown, ChevronUp, Plus, AlertTriangle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  mode: 'today' | 'backlog';
}

const PRIORITY_STYLES: Record<TaskPriority, { badge: string; text: string }> = {
  high: { badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30', text: 'High' },
  medium: { badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30', text: 'Med' },
  low: { badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30', text: 'Low' },
};

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  work: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  personal: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  health: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  finance: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  learning: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  other: 'bg-slate-700/50 text-slate-300 border-slate-600',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, mode }) => {
  const { toggleTaskStatus, deleteTask, moveToBacklog, moveToToday, toggleSubtask, addSubtask, deleteSubtask, decomposeTask } = useTasks();
  const [showSubtasks, setShowSubtasks] = useState(task.subtasks.length > 0);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const isCompleted = task.status === 'completed';
  const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
  const categoryStyle = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.other;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      addSubtask(task.id, newSubtaskTitle);
      setNewSubtaskTitle('');
      setIsAddingSubtask(false);
      setShowSubtasks(true);
    }
  };

  const completedSubtasksCount = task.subtasks.filter(s => s.completed).length;

  return (
    <div
      className={`relative group rounded-2xl p-3.5 transition-all duration-200 border ${
        isCompleted
          ? 'bg-slate-900/40 border-slate-800/60 opacity-65'
          : task.rolloverCount >= 2
          ? 'bg-slate-800/80 border-amber-500/40 shadow-sm'
          : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/60 hover:border-slate-600'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox (Only for Today tasks or status toggle) */}
        {mode === 'today' ? (
          <button
            onClick={() => toggleTaskStatus(task.id)}
            className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-transform active:scale-90 ${
              isCompleted
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-slate-500 hover:border-indigo-400 bg-slate-900/60'
            }`}
            aria-label={isCompleted ? 'Mark incomplete' : 'Mark completed'}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>
        ) : (
          <div className="mt-1 flex-shrink-0">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h3
              className={`text-sm font-semibold tracking-tight transition-all leading-snug break-words ${
                isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
              }`}
            >
              {task.title}
            </h3>

            {/* Quick Actions */}
            <div className="flex items-center space-x-1 opacity-90 sm:opacity-75 sm:group-hover:opacity-100 transition">
              {mode === 'today' ? (
                <button
                  onClick={() => moveToBacklog(task.id)}
                  title="Move to Backlog"
                  className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 transition"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => moveToToday(task.id)}
                  title="Rescue to Today"
                  className="px-2 py-0.5 rounded-md bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-medium flex items-center space-x-1 transition"
                >
                  <ArrowUpRight className="w-3 h-3" />
                  <span>Today</span>
                </button>
              )}

              <button
                onClick={() => deleteTask(task.id)}
                title="Delete task"
                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Badges & Meta Row */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
            {/* Priority */}
            <span className={`px-2 py-0.5 rounded-md font-medium border ${priorityStyle.badge}`}>
              {priorityStyle.text}
            </span>

            {/* Category */}
            <span className={`px-2 py-0.5 rounded-md font-medium border capitalize ${categoryStyle}`}>
              {task.category}
            </span>

            {/* Estimated Minutes */}
            {task.estimatedMinutes && (
              <span className="flex items-center space-x-1 text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-700/60">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{task.estimatedMinutes}m</span>
              </span>
            )}

            {/* Rollover Pile-up Warning */}
            {task.rolloverCount > 0 && (
              <span className="flex items-center space-x-1 text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30 font-medium">
                <AlertTriangle className="w-3 h-3" />
                <span>Rolled over {task.rolloverCount}x</span>
              </span>
            )}

            {/* Subtasks Count Badge / Toggle */}
            {task.subtasks.length > 0 && (
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="flex items-center space-x-1 text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 hover:bg-indigo-500/20 transition"
              >
                <span>
                  {completedSubtasksCount}/{task.subtasks.length} steps
                </span>
                {showSubtasks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* AI Reasoning Pill */}
          {task.aiReasoning && (
            <div className="mt-2 text-[11px] p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-200 flex items-start space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <span className="leading-tight">{task.aiReasoning}</span>
            </div>
          )}

          {/* Subtasks section */}
          {showSubtasks && (
            <div className="mt-2.5 pt-2 border-t border-slate-700/60 space-y-1.5 animate-in fade-in">
              {task.subtasks.map(subtask => (
                <div key={subtask.id} className="flex items-center justify-between text-xs py-0.5 group/sub">
                  <label className="flex items-center space-x-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(task.id, subtask.id)}
                      className="rounded border-slate-600 text-indigo-600 focus:ring-0 bg-slate-900 w-3.5 h-3.5"
                    />
                    <span className={`truncate ${subtask.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                      {subtask.title}
                    </span>
                  </label>
                  <button
                    onClick={() => deleteSubtask(task.id, subtask.id)}
                    className="opacity-0 group-hover/sub:opacity-100 text-slate-500 hover:text-rose-400 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Subtasks Actions Bar */}
          <div className="mt-2 flex items-center space-x-2 text-[11px]">
            {!isAddingSubtask ? (
              <>
                <button
                  onClick={() => setIsAddingSubtask(true)}
                  className="text-slate-400 hover:text-indigo-300 flex items-center space-x-1 py-0.5 transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add step</span>
                </button>

                {task.subtasks.length === 0 && (
                  <button
                    onClick={() => decomposeTask(task.id)}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 py-0.5 transition font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>AI Breakdown</span>
                  </button>
                )}
              </>
            ) : (
              <form onSubmit={handleAddSubtask} className="flex-1 flex items-center space-x-1.5 mt-1">
                <input
                  type="text"
                  placeholder="New step..."
                  value={newSubtaskTitle}
                  onChange={e => setNewSubtaskTitle(e.target.value)}
                  autoFocus
                  className="flex-1 bg-slate-900 text-slate-200 text-xs rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingSubtask(false)}
                  className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
