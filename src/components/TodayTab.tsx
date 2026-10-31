import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { formatISTDateReadable } from '../utils/istTime';
import { TaskCategory } from '../types';
import { Plus, Sparkles, Sun, CheckCircle2, Flame, ArrowRight } from 'lucide-react';

interface TodayTabProps {
  onOpenAddTask: () => void;
  onOpenMorningKickoff: () => void;
  onOpenEveningReview: () => void;
  onSwitchToBacklog: () => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({
  onOpenAddTask,
  onOpenMorningKickoff,
  onOpenEveningReview,
  onSwitchToBacklog,
}) => {
  const { todayTasks, backlogTasks, streakDays, istDate, runAIPrioritization } = useTasks();
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [isPrioritizing, setIsPrioritizing] = useState(false);

  const completedTasks = todayTasks.filter(t => t.status === 'completed');
  const pendingTasks = todayTasks.filter(t => t.status !== 'completed');

  const filteredPending = selectedCategory === 'all'
    ? pendingTasks
    : pendingTasks.filter(t => t.category === selectedCategory);

  const filteredCompleted = selectedCategory === 'all'
    ? completedTasks
    : completedTasks.filter(t => t.category === selectedCategory);

  const totalToday = todayTasks.length;
  const progressPercent = totalToday > 0 ? Math.round((completedTasks.length / totalToday) * 100) : 0;

  const handleAIPrioritize = () => {
    setIsPrioritizing(true);
    runAIPrioritization();
    setTimeout(() => setIsPrioritizing(false), 600);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Date & Streak Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Today's Focus
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {formatISTDateReadable(istDate)}
          </h2>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{streakDays} Day Rhythm</span>
        </div>
      </div>

      {/* Daily Progress Card */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/20 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">
              {completedTasks.length} of {totalToday} Tasks Completed
            </span>
          </div>
          <span className="text-xs font-bold text-indigo-300">{progressPercent}%</span>
        </div>

        {/* Progress Track */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick Backlog Warning if backlog is piling up */}
        {backlogTasks.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              <strong className="text-amber-400 font-semibold">{backlogTasks.length} tasks</strong> waiting in backlog
            </span>
            <button
              onClick={onSwitchToBacklog}
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1 transition"
            >
              <span>View Backlog</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* 9:00 AM Kickoff & 10:00 PM Review Banners */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOpenMorningKickoff}
          className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-left transition active:scale-[0.98]"
        >
          <div className="flex items-center space-x-1.5 text-amber-300 font-bold text-xs">
            <Sun className="w-4 h-4" />
            <span>9:00 AM Kickoff</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Plan or pull from backlog</p>
        </button>

        <button
          onClick={onOpenEveningReview}
          className="p-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 text-left transition active:scale-[0.98]"
        >
          <div className="flex items-center space-x-1.5 text-indigo-300 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>10:00 PM Review</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Status check & rollover</p>
        </button>
      </div>

      {/* Action Row & Category Filter */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenAddTask}
            className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/30 transition active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Task</span>
          </button>

          <button
            onClick={handleAIPrioritize}
            disabled={pendingTasks.length === 0 || isPrioritizing}
            className={`py-2.5 px-3 rounded-xl border font-semibold text-xs flex items-center space-x-1.5 transition active:scale-95 ${
              pendingTasks.length > 0
                ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/20 hover:from-violet-600/30 hover:to-indigo-600/30 text-indigo-200 border-indigo-500/30'
                : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 text-indigo-400 ${isPrioritizing ? 'animate-spin' : ''}`} />
            <span>{isPrioritizing ? 'Reasoning...' : 'AI Prioritize'}</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {(['all', 'work', 'personal', 'health', 'finance', 'learning'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg capitalize whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredPending.length === 0 && filteredCompleted.length === 0 && (
          <div className="text-center py-10 px-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
              <Sun className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-sm font-semibold text-slate-300">No tasks for today yet</p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Tap "Add Task" or use the 9:00 AM Kickoff to plan your day from scratch or your backlog.
            </p>
          </div>
        )}

        {/* Incomplete Tasks */}
        {filteredPending.map(task => (
          <TaskCard key={task.id} task={task} mode="today" />
        ))}

        {/* Completed Tasks Accordion */}
        {filteredCompleted.length > 0 && (
          <div className="pt-3">
            <h4 className="text-xs font-semibold text-slate-400 mb-2 flex items-center space-x-1.5">
              <span>Completed ({filteredCompleted.length})</span>
            </h4>
            <div className="space-y-2">
              {filteredCompleted.map(task => (
                <TaskCard key={task.id} task={task} mode="today" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
