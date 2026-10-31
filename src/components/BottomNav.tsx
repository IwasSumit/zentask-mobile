import React from 'react';
import { Calendar, Inbox, Sparkles, Settings } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export type NavTab = 'today' | 'backlog' | 'ai' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { todayTasks, backlogTasks } = useTasks();

  const incompleteTodayCount = todayTasks.filter(t => t.status !== 'completed').length;
  const backlogCount = backlogTasks.length;

  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    {
      id: 'today',
      label: 'Today',
      icon: Calendar,
      badge: incompleteTodayCount > 0 ? incompleteTodayCount : undefined,
      badgeColor: 'bg-indigo-500 text-white',
    },
    {
      id: 'backlog',
      label: 'Backlog',
      icon: Inbox,
      badge: backlogCount > 0 ? backlogCount : undefined,
      badgeColor: backlogCount >= 3 ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-500 text-slate-900 font-bold',
    },
    {
      id: 'ai',
      label: 'AI Advisor',
      icon: Sparkles,
    },
    {
      id: 'settings',
      label: 'Rhythm',
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 pb-[env(safe-area-inset-bottom,8px)] pt-2 px-3">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition duration-150 ${
                isActive
                  ? 'text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-indigo-400' : ''}`} />
                {tab.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-bold ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
