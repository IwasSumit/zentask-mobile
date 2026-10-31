import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Task, TaskPriority, TaskCategory, RoutineSettings, RhythmNotification } from '../types';
import { getISTDate, formatISTDateKey } from '../utils/istTime';
import { soundManager, sendWebNotification } from '../utils/notifications';
import { prioritizeWithLocalReasoning, decomposeTaskLocal } from '../services/aiService';

interface TaskContextType {
  tasks: Task[];
  todayTasks: Task[];
  backlogTasks: Task[];
  simulatedTime: { hour: number; minute: number } | null;
  setSimulatedTime: (time: { hour: number; minute: number } | null) => void;
  istDate: Date;
  settings: RoutineSettings;
  updateSettings: (newSettings: Partial<RoutineSettings>) => void;
  notifications: RhythmNotification[];
  clearNotification: (id: string) => void;
  
  // Modals & Banners state
  isMorningModalOpen: boolean;
  setIsMorningModalOpen: (open: boolean) => void;
  isEveningModalOpen: boolean;
  setIsEveningModalOpen: (open: boolean) => void;
  isNudgeVisible: boolean;
  setIsNudgeVisible: (visible: boolean) => void;
  nudgeMessage: string;

  // Task actions
  addTask: (data: {
    title: string;
    description?: string;
    category: TaskCategory;
    priority: TaskPriority;
    estimatedMinutes?: number;
    target: 'today' | 'backlog';
  }) => void;
  toggleTaskStatus: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  moveToBacklog: (taskId: string) => void;
  moveToToday: (taskId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  
  // Routine actions
  triggerMorningRoutine: () => void;
  triggerEveningRoutine: () => void;
  triggerMiddayNudge: () => void;
  finalizeEveningReview: () => void;
  
  // AI actions
  runAIPrioritization: () => void;
  decomposeTask: (taskId: string) => void;
  
  // Stats
  streakDays: number;
  totalCompletedCount: number;
  resetAllData: () => void;
}

const STORAGE_KEY_TASKS = 'zentask_mobile_tasks_v1';
const STORAGE_KEY_SETTINGS = 'zentask_mobile_settings_v1';
const STORAGE_KEY_STREAK = 'zentask_mobile_streak_v1';

const DEFAULT_SETTINGS: RoutineSettings = {
  morningTimeIST: '09:00',
  eveningTimeIST: '22:00',
  nudgeIntervalHours: 3,
  soundEnabled: true,
  browserNotificationsEnabled: true,
  useMockAI: true,
};

const INITIAL_SEED_TASKS: Task[] = [
  {
    id: 'seed-1',
    title: 'Prepare product launch roadmap review',
    description: 'Finalize slides for the team sync and address Q4 KPIs',
    category: 'work',
    priority: 'high',
    status: 'todo',
    createdAt: new Date().toISOString(),
    scheduledForDate: formatISTDateKey(getISTDate()),
    rolloverCount: 0,
    estimatedMinutes: 60,
    aiReasoning: 'Critical milestone: Complete early while cognitive focus is sharp.',
    aiRecommendedPriority: 'high',
    subtasks: [
      { id: 'sub-1', title: 'Outline key milestones', completed: true },
      { id: 'sub-2', title: 'Check resource bandwidth', completed: false },
      { id: 'sub-3', title: 'Design summary slide', completed: false },
    ],
  },
  {
    id: 'seed-2',
    title: '30-minute cardio & mobility session',
    description: 'Brisk walk or light jog to reset energy levels',
    category: 'health',
    priority: 'medium',
    status: 'completed',
    createdAt: new Date().toISOString(),
    scheduledForDate: formatISTDateKey(getISTDate()),
    completedAt: new Date().toISOString(),
    rolloverCount: 0,
    estimatedMinutes: 30,
    aiReasoning: 'Habit anchor: Great for sustaining stamina through afternoon.',
    aiRecommendedPriority: 'medium',
    subtasks: [],
  },
  {
    id: 'seed-3',
    title: 'Review quarterly cloud infrastructure bill',
    description: 'Audit unused instances and check auto-scaling configurations',
    category: 'finance',
    priority: 'medium',
    status: 'todo',
    createdAt: new Date().toISOString(),
    scheduledForDate: formatISTDateKey(getISTDate()),
    rolloverCount: 0,
    estimatedMinutes: 20,
    aiReasoning: 'Quick win (<20m): High financial return on minimal effort.',
    aiRecommendedPriority: 'high',
    subtasks: [],
  },
  // Backlog items demonstrating pile-up
  {
    id: 'seed-backlog-1',
    title: 'Organize Google Drive archives & client folder structure',
    description: 'Clean up root directory and archive 2025 finished contracts',
    category: 'work',
    priority: 'low',
    status: 'backlog',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    scheduledForDate: '2026-10-27',
    backlogSince: '2026-10-28',
    rolloverCount: 3,
    estimatedMinutes: 45,
    aiReasoning: 'Rolled over 3x! Stagnating in backlog. Break down or prune.',
    aiRecommendedPriority: 'medium',
    subtasks: [
      { id: 'sub-b1', title: 'Delete duplicate temp files', completed: false },
      { id: 'sub-b2', title: 'Move 2025 folders to Archive', completed: false }
    ],
  },
  {
    id: 'seed-backlog-2',
    title: 'Research smart home air purifier filters',
    description: 'Compare HEPA replacement costs and delivery times',
    category: 'personal',
    priority: 'low',
    status: 'backlog',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    scheduledForDate: '2026-10-29',
    backlogSince: '2026-10-30',
    rolloverCount: 2,
    estimatedMinutes: 25,
    aiReasoning: 'Rolled over 2x. Low urgency, ideal for weekend backlog sweep.',
    aiRecommendedPriority: 'low',
    subtasks: [],
  },
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      return saved ? JSON.parse(saved) : INITIAL_SEED_TASKS;
    } catch {
      return INITIAL_SEED_TASKS;
    }
  });

  const [settings, setSettings] = useState<RoutineSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STREAK);
      return saved ? Number(saved) : 4;
    } catch {
      return 4;
    }
  });

  const [simulatedTime, setSimulatedTime] = useState<{ hour: number; minute: number } | null>(null);
  const [istDate, setIstDate] = useState<Date>(() => getISTDate(simulatedTime));

  const [isMorningModalOpen, setIsMorningModalOpen] = useState(false);
  const [isEveningModalOpen, setIsEveningModalOpen] = useState(false);
  const [isNudgeVisible, setIsNudgeVisible] = useState(false);
  const [nudgeMessage, setNudgeMessage] = useState('');
  const [notifications, setNotifications] = useState<RhythmNotification[]>([]);

  // Update IST Clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setIstDate(getISTDate(simulatedTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [simulatedTime]);

  // Persist tasks & settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STREAK, String(streakDays));
    } catch (e) {
      console.error('Failed to save streak', e);
    }
  }, [streakDays]);

  const updateSettings = (newSettings: Partial<RoutineSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Filter tasks
  const todayKey = formatISTDateKey(istDate);
  const todayTasks = tasks.filter(t => t.scheduledForDate === todayKey && t.status !== 'backlog');
  const backlogTasks = tasks.filter(t => t.status === 'backlog');
  const totalCompletedCount = tasks.filter(t => t.status === 'completed').length;

  // Add a task
  const addTask = (data: {
    title: string;
    description?: string;
    category: TaskCategory;
    priority: TaskPriority;
    estimatedMinutes?: number;
    target: 'today' | 'backlog';
  }) => {
    const isBacklog = data.target === 'backlog';
    const newTask: Task = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title: data.title.trim(),
      description: data.description?.trim(),
      category: data.category,
      priority: data.priority,
      status: isBacklog ? 'backlog' : 'todo',
      createdAt: new Date().toISOString(),
      scheduledForDate: todayKey,
      rolloverCount: 0,
      estimatedMinutes: data.estimatedMinutes || 30,
      backlogSince: isBacklog ? todayKey : undefined,
      subtasks: [],
    };

    setTasks(prev => [newTask, ...prev]);

    if (settings.soundEnabled) {
      soundManager.playNudge();
    }
  };

  // Toggle complete / todo
  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
        if (nextStatus === 'completed') {
          // Play celebration sound & trigger confetti!
          if (settings.soundEnabled) soundManager.playCompleteDing();
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899']
            });
          } catch {
            // ignore
          }
          return {
            ...t,
            status: nextStatus,
            completedAt: new Date().toISOString()
          };
        } else {
          return {
            ...t,
            status: nextStatus,
            completedAt: undefined
          };
        }
      }
      return t;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  const moveToBacklog = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'backlog',
          backlogSince: todayKey,
          rolloverCount: t.rolloverCount + 1,
        };
      }
      return t;
    }));
  };

  const moveToToday = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'todo',
          scheduledForDate: todayKey,
          backlogSince: undefined,
        };
      }
      return t;
    }));
    if (settings.soundEnabled) soundManager.playNudge();
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
        return { ...t, subtasks: updated };
      }
      return t;
    }));
  };

  const addSubtask = (taskId: string, title: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newSub = {
          id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substr(2, 3),
          title: title.trim(),
          completed: false,
        };
        return { ...t, subtasks: [...t.subtasks, newSub] };
      }
      return t;
    }));
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, subtasks: t.subtasks.filter(s => s.id !== subtaskId) };
      }
      return t;
    }));
  };

  // --- Routine Triggers ---

  // 1. Morning 9:00 AM IST Routine
  const triggerMorningRoutine = () => {
    if (settings.soundEnabled) soundManager.playMorningChime();
    if (settings.browserNotificationsEnabled) {
      sendWebNotification(
        '☀️ 9:00 AM IST Morning Kickoff!',
        'Time to plan your day. Set your top goals and tackle priorities!'
      );
    }
    const newNotif: RhythmNotification = {
      id: 'notif-morning-' + Date.now(),
      type: 'morning_kickoff',
      title: '☀️ 9:00 AM Morning Kickoff',
      message: 'Plan today’s tasks. Review and pull urgent items from backlog.',
      timestamp: new Date().toLocaleTimeString(),
      read: false,
      actionLabel: 'Plan Day',
    };
    setNotifications(prev => [newNotif, ...prev]);
    setIsMorningModalOpen(true);
  };

  // 2. Evening 10:00 PM IST Routine
  const triggerEveningRoutine = () => {
    if (settings.soundEnabled) soundManager.playEveningChime();
    if (settings.browserNotificationsEnabled) {
      sendWebNotification(
        '🌙 10:00 PM IST Evening Review!',
        'Wrap up your day! Review task progress; incomplete items will roll over to Backlog.'
      );
    }
    const newNotif: RhythmNotification = {
      id: 'notif-evening-' + Date.now(),
      type: 'evening_review',
      title: '🌙 10:00 PM Daily Wrap-up',
      message: 'Time for final status check. Incomplete tasks will move to backlog.',
      timestamp: new Date().toLocaleTimeString(),
      read: false,
      actionLabel: 'Review Status',
    };
    setNotifications(prev => [newNotif, ...prev]);
    setIsEveningModalOpen(true);
  };

  // 3. Periodic Nudge
  const triggerMiddayNudge = () => {
    if (settings.soundEnabled) soundManager.playNudge();
    const incompleteToday = tasks.filter(t => t.scheduledForDate === todayKey && t.status === 'todo');
    const msg = incompleteToday.length > 0
      ? `Friendly nudge! You have ${incompleteToday.length} task(s) remaining for today. Keep moving forward!`
      : 'Great job staying on top of today! Check your backlog or enjoy a well-deserved break.';
    
    if (settings.browserNotificationsEnabled) {
      sendWebNotification('🔔 Daily Focus Nudge', msg);
    }
    setNudgeMessage(msg);
    setIsNudgeVisible(true);
  };

  // Finalize evening review: move incomplete tasks to Backlog!
  const finalizeEveningReview = () => {
    let rolledOverCount = 0;
    setTasks(prev => prev.map(t => {
      if (t.scheduledForDate === todayKey && t.status !== 'completed' && t.status !== 'backlog') {
        rolledOverCount++;
        return {
          ...t,
          status: 'backlog',
          backlogSince: todayKey,
          rolloverCount: t.rolloverCount + 1,
        };
      }
      return t;
    }));

    // Update streak if user checked off at least one task or reviewed
    setStreakDays(prev => prev + 1);
    setIsEveningModalOpen(false);

    // Confirmation sound
    if (settings.soundEnabled) soundManager.playEveningChime();
  };

  // AI Prioritization
  const runAIPrioritization = () => {
    const results = prioritizeWithLocalReasoning(todayTasks);
    setTasks(prev => prev.map(task => {
      const match = results.find(r => r.taskId === task.id);
      if (match) {
        return {
          ...task,
          aiRecommendedPriority: match.recommendedPriority,
          aiReasoning: match.reasoning,
        };
      }
      return task;
    }));

    if (settings.soundEnabled) soundManager.playCompleteDing();
  };

  // AI Task Decomposition
  const decomposeTask = (taskId: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    const subtaskTitles = decomposeTaskLocal(target.title);
    
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const generatedSubs = subtaskTitles.map((title, idx) => ({
          id: 'ai-sub-' + Date.now() + '-' + idx,
          title,
          completed: false,
        }));
        return {
          ...t,
          subtasks: [...t.subtasks, ...generatedSubs],
          aiReasoning: 'Decomposed into bite-sized actionable steps by AI reasoning.',
        };
      }
      return t;
    }));

    if (settings.soundEnabled) soundManager.playNudge();
  };

  const resetAllData = () => {
    setTasks(INITIAL_SEED_TASKS);
    setStreakDays(4);
    setSettings(DEFAULT_SETTINGS);
    setSimulatedTime(null);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        todayTasks,
        backlogTasks,
        simulatedTime,
        setSimulatedTime,
        istDate,
        settings,
        updateSettings,
        notifications,
        clearNotification,
        isMorningModalOpen,
        setIsMorningModalOpen,
        isEveningModalOpen,
        setIsEveningModalOpen,
        isNudgeVisible,
        setIsNudgeVisible,
        nudgeMessage,
        addTask,
        toggleTaskStatus,
        deleteTask,
        updateTask,
        moveToBacklog,
        moveToToday,
        toggleSubtask,
        addSubtask,
        deleteSubtask,
        triggerMorningRoutine,
        triggerEveningRoutine,
        triggerMiddayNudge,
        finalizeEveningReview,
        runAIPrioritization,
        decomposeTask,
        streakDays,
        totalCompletedCount,
        resetAllData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
