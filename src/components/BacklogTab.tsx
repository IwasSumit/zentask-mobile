import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { Inbox, AlertTriangle, Sparkles, Plus, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface BacklogTabProps {
  onOpenAddTask: () => void;
  onSwitchToToday: () => void;
}

export const BacklogTab: React.FC<BacklogTabProps> = ({ onOpenAddTask, onSwitchToToday }) => {
  const { backlogTasks, moveToToday, decomposeTask } = useTasks();
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'chronic' | 'fresh'>('all');

  const chronicRollovers = backlogTasks.filter(t => t.rolloverCount >= 2);
  const freshBacklog = backlogTasks.filter(t => t.rolloverCount < 2);

  const filteredTasks = filterSeverity === 'all'
    ? backlogTasks
    : filterSeverity === 'chronic'
    ? chronicRollovers
    : freshBacklog;

  const totalEstimatedMinutes = backlogTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 30), 0);
  const totalHours = (totalEstimatedMinutes / 60).toFixed(1);

  // AI Rescue pick: pick highest priority or highest rollover
  const recommendedRescue = backlogTasks.slice().sort((a, b) => b.rolloverCount - a.rolloverCount)[0];

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Inbox className="w-3.5 h-3.5" />
          <span>Task Debt Buffer</span>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Backlog Pile-up
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
            {backlogTasks.length} {backlogTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      </div>

      {/* Pile-up Stat & Advice Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/90 border border-slate-700/60 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400">Total Backlog Load</span>
            <div className="text-sm font-bold text-slate-200">
              ~{totalHours} hours estimated work
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400">Stagnating (2x+)</span>
            <div className="text-sm font-bold text-rose-400">
              {chronicRollovers.length} tasks
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Incomplete tasks from 10:00 PM IST automatically accumulate here. Regular review keeps your backlog from turning into an overwhelming graveyard!
        </p>
      </div>

      {/* AI Backlog Rescue Card (if items exist) */}
      {recommendedRescue && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/70 to-purple-950/70 border border-indigo-500/30 shadow-md">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-300 mb-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI Backlog Rescue Recommendation</span>
          </div>

          <p className="text-xs text-slate-200 font-medium">
            "{recommendedRescue.title}"
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Has rolled over {recommendedRescue.rolloverCount} times. Rather than letting it sit, pull it into Today or break it into bite-sized steps.
          </p>

          <div className="mt-2.5 flex items-center space-x-2">
            <button
              onClick={() => {
                moveToToday(recommendedRescue.id);
                onSwitchToToday();
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1 transition active:scale-95"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Rescue to Today</span>
            </button>

            {recommendedRescue.subtasks.length === 0 && (
              <button
                onClick={() => decomposeTask(recommendedRescue.id)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center space-x-1 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Subtask Breakdown</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Actions & Filters */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1 text-xs">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filterSeverity === 'all'
                ? 'bg-amber-500 text-slate-900 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All ({backlogTasks.length})
          </button>
          <button
            onClick={() => setFilterSeverity('chronic')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filterSeverity === 'chronic'
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Stagnant ({chronicRollovers.length})
          </button>
        </div>

        <button
          onClick={onOpenAddTask}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center space-x-1 transition"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>Add to Backlog</span>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-800/30 border border-slate-800/80 space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-200">No Backlog Pile-up!</p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              You are completely caught up. Incomplete tasks from 10:00 PM IST will automatically roll in here.
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} mode="backlog" />
          ))
        )}
      </div>
    </div>
  );
};
