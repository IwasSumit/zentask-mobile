import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { requestNotificationPermission, soundManager } from '../utils/notifications';
import { Settings, Bell, Volume2, VolumeX, ShieldCheck, RotateCcw, Clock, Zap, Flame, Award } from 'lucide-react';

interface SettingsTabProps {
  onOpenSimulator: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onOpenSimulator }) => {
  const {
    settings,
    updateSettings,
    streakDays,
    totalCompletedCount,
    backlogTasks,
    resetAllData,
  } = useTasks();

  const [notifGranted, setNotifGranted] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  const handleRequestNotif = async () => {
    const granted = await requestNotificationPermission();
    setNotifGranted(granted);
    updateSettings({ browserNotificationsEnabled: granted });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
          <Settings className="w-3.5 h-3.5" />
          <span>Rhythm Preferences</span>
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">
          Schedules & Preferences
        </h2>
      </div>

      {/* Routine Blueprint Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/20 shadow-lg space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-indigo-200">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Active Daily IST Protocol</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-start space-x-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="font-bold text-amber-300 font-mono text-[11px] min-w-[70px]">
              09:00 AM IST
            </span>
            <div className="text-slate-300">
              <strong>Morning Kickoff:</strong> Nudge to set intentions and rescue backlog items.
            </div>
          </div>

          <div className="flex items-start space-x-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="font-bold text-emerald-300 font-mono text-[11px] min-w-[70px]">
              Midday
            </span>
            <div className="text-slate-300">
              <strong>Periodic Nudge:</strong> Re-evaluates remaining tasks to keep pace.
            </div>
          </div>

          <div className="flex items-start space-x-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="font-bold text-indigo-300 font-mono text-[11px] min-w-[70px]">
              10:00 PM IST
            </span>
            <div className="text-slate-300">
              <strong>Evening Review:</strong> Final check. Unfinished tasks automatically pile into Backlog.
            </div>
          </div>
        </div>

        <button
          onClick={onOpenSimulator}
          className="w-full py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Launch Rhythm Simulator</span>
        </button>
      </div>

      {/* Notifications & Audio */}
      <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 shadow-lg space-y-3">
        <h3 className="text-xs font-bold text-slate-200">Alerts & Sound Synthesis</h3>

        {/* Browser Notifications */}
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
              <Bell className="w-3.5 h-3.5 text-indigo-400" />
              <span>System / Browser Push Alerts</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {notifGranted ? 'Notifications Allowed' : 'Allow notifications for 9 AM & 10 PM'}
            </div>
          </div>

          {notifGranted ? (
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
              Active
            </span>
          ) : (
            <button
              onClick={handleRequestNotif}
              className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition active:scale-95"
            >
              Enable
            </button>
          )}
        </div>

        {/* Audio Effects */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
              {settings.soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>Web Audio Chimes</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Gentle melodic reminders synthesized in real-time
            </div>
          </div>

          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Audio Test Row */}
        {settings.soundEnabled && (
          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Test Sound:</span>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => soundManager.playMorningChime()}
                className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px]"
              >
                9 AM Chime
              </button>
              <button
                onClick={() => soundManager.playCompleteDing()}
                className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px]"
              >
                Complete Ding
              </button>
              <button
                onClick={() => soundManager.playEveningChime()}
                className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px]"
              >
                10 PM Chime
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lifetime Stats & Data Reset */}
      <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 shadow-lg space-y-3">
        <h3 className="text-xs font-bold text-slate-200">Track Record</h3>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-white">{streakDays} Days</div>
            <div className="text-[10px] text-slate-400">Streak</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <Award className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-white">{totalCompletedCount}</div>
            <div className="text-[10px] text-slate-400">Done All-Time</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-white">{backlogTasks.length}</div>
            <div className="text-[10px] text-slate-400">In Backlog</div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">Need a fresh start?</span>
          <button
            onClick={() => {
              if (window.confirm('Reset all tasks back to the starter demo data?')) {
                resetAllData();
              }
            }}
            className="text-xs px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg font-medium flex items-center space-x-1 transition active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
