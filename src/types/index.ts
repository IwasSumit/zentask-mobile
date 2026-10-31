export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'finance' | 'other';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'backlog';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string; // ISO string
  scheduledForDate: string; // YYYY-MM-DD (IST)
  completedAt?: string;
  backlogSince?: string; // Date string when moved to backlog
  rolloverCount: number; // Number of times it rolled over at 10 PM
  estimatedMinutes?: number;
  aiReasoning?: string;
  aiRecommendedPriority?: TaskPriority;
  subtasks: Subtask[];
}

export type RhythmPhase = 'morning_kickoff' | 'midday_focus' | 'evening_review' | 'night_rest';

export interface RoutineSettings {
  morningTimeIST: string; // "09:00"
  eveningTimeIST: string; // "22:00"
  nudgeIntervalHours: number; // e.g. 3
  soundEnabled: boolean;
  browserNotificationsEnabled: boolean;
  geminiApiKey?: string;
  useMockAI: boolean;
}

export interface RhythmNotification {
  id: string;
  type: 'morning_kickoff' | 'periodic_nudge' | 'evening_review' | 'ai_tip';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  completed: number;
  rolledOver: number;
  totalPlanned: number;
}
