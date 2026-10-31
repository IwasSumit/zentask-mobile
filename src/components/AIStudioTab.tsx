import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { generateLocalBriefing, decomposeTaskLocal, callGeminiAPI } from '../services/aiService';
import { Sparkles, Brain, Wand2, Lightbulb, Key, Check, Plus, RefreshCw, Compass } from 'lucide-react';

interface AIStudioTabProps {
  onSwitchToToday: () => void;
}

export const AIStudioTab: React.FC<AIStudioTabProps> = ({ onSwitchToToday }) => {
  const { todayTasks, backlogTasks, addTask, settings, updateSettings, runAIPrioritization } = useTasks();
  
  const [bigGoal, setBigGoal] = useState('');
  const [decomposedSteps, setDecomposedSteps] = useState<string[]>([]);
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(settings.geminiApiKey || '');
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [isLiveGenerating, setIsLiveGenerating] = useState(false);
  const [liveAIAdvice, setLiveAIAdvice] = useState<string | null>(null);

  const briefing = generateLocalBriefing(todayTasks, backlogTasks);

  const handleDecompose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bigGoal.trim()) return;

    setIsDecomposing(true);
    if (settings.geminiApiKey && !settings.useMockAI) {
      try {
        const prompt = `Break down this task into 3-4 concrete, actionable subtasks with estimated minutes: "${bigGoal}". Return each subtask on a new line without markdown formatting.`;
        const res = await callGeminiAPI(settings.geminiApiKey, prompt);
        const steps = res.split('\n').filter(s => s.trim().length > 0).map(s => s.replace(/^[-*•0-9.)\s]+/, ''));
        setDecomposedSteps(steps);
      } catch (err) {
        console.warn('Falling back to local AI decomposer', err);
        setDecomposedSteps(decomposeTaskLocal(bigGoal));
      }
    } else {
      setTimeout(() => {
        setDecomposedSteps(decomposeTaskLocal(bigGoal));
        setIsDecomposing(false);
      }, 350);
      return;
    }
    setIsDecomposing(false);
  };

  const handleSaveDecomposedAsTask = (target: 'today' | 'backlog') => {
    if (!bigGoal.trim()) return;
    addTask({
      title: bigGoal.trim(),
      category: 'work',
      priority: 'high',
      target,
      estimatedMinutes: decomposedSteps.length * 15,
    });
    setBigGoal('');
    setDecomposedSteps([]);
    if (target === 'today') {
      onSwitchToToday();
    }
  };

  const handleSaveApiKey = () => {
    updateSettings({ geminiApiKey: apiKeyInput.trim(), useMockAI: !apiKeyInput.trim() });
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2000);
  };

  const handleGenerateLiveAdvice = async () => {
    if (!settings.geminiApiKey) {
      setLiveAIAdvice(
        "💡 Using High-Speed Built-in AI Reasoning: Focus on high-urgency items before 1:00 PM IST. Break chronic backlog tasks into 15m micro-sprints."
      );
      return;
    }
    setIsLiveGenerating(true);
    try {
      const summaryToday = todayTasks.map(t => t.title).join(', ') || 'No tasks';
      const summaryBacklog = backlogTasks.map(t => t.title).join(', ') || 'No backlog';
      const prompt = `You are an elite productivity coach for Indian Standard Time (IST) rhythms. User has Today tasks: [${summaryToday}] and Backlog tasks: [${summaryBacklog}]. Provide a concise, motivational 2-sentence tactical recommendation for right now.`;
      const advice = await callGeminiAPI(settings.geminiApiKey, prompt);
      setLiveAIAdvice(advice);
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : 'Unknown error';
      setLiveAIAdvice(`Error contacting Gemini API: ${errorMsg}`);
    } finally {
      setIsLiveGenerating(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
          <Brain className="w-3.5 h-3.5" />
          <span>Cognitive Rhythm Engine</span>
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">
          AI Reasoning & Advisor
        </h2>
      </div>

      {/* 1. Daily Coaching Briefing */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-indigo-200">Daily Rhythm Briefing</span>
          </div>
          <button
            onClick={() => { runAIPrioritization(); onSwitchToToday(); }}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center space-x-1 transition active:scale-95"
          >
            <span>Prioritize Today</span>
          </button>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">{briefing.headline}</h3>
          <p className="text-xs text-indigo-200/90 mt-1 leading-relaxed">
            {briefing.focusRecommendation}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-start space-x-2 text-xs text-slate-300">
          <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold text-amber-300">Momentum Tip: </span>
            {briefing.momentumTip}
          </p>
        </div>

        {briefing.backlogAdvice && (
          <div className="pt-2 border-t border-slate-800 flex items-start space-x-2 text-xs text-rose-300">
            <Compass className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              {briefing.backlogAdvice}
            </p>
          </div>
        )}
      </div>

      {/* 2. Interactive Task Decomposer Lab */}
      <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 shadow-lg space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
          <Wand2 className="w-4 h-4 text-purple-400" />
          <span>Smart Subtask Decomposer</span>
        </div>
        <p className="text-xs text-slate-400">
          Got an intimidating or vague goal? Type it here and AI will deconstruct it into bite-sized 15-minute execution steps.
        </p>

        <form onSubmit={handleDecompose} className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="e.g., Prepare quarterly board presentation..."
              value={bigGoal}
              onChange={e => setBigGoal(e.target.value)}
              className="flex-1 bg-slate-900 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!bigGoal.trim() || isDecomposing}
              className="px-3.5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isDecomposing ? 'animate-spin' : ''}`} />
              <span>Break Down</span>
            </button>
          </div>
        </form>

        {decomposedSteps.length > 0 && (
          <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2 animate-in fade-in">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">
              Generated Action Steps:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {decomposedSteps.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex items-center space-x-2">
              <button
                onClick={() => handleSaveDecomposedAsTask('today')}
                className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Today</span>
              </button>
              <button
                onClick={() => handleSaveDecomposedAsTask('backlog')}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Send to Backlog
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Live AI Coach Interaction */}
      <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>IST Rhythm Coach On-Demand</span>
          </div>
          <button
            onClick={handleGenerateLiveAdvice}
            disabled={isLiveGenerating}
            className="text-xs px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-medium flex items-center space-x-1 transition active:scale-95"
          >
            <RefreshCw className={`w-3 h-3 ${isLiveGenerating ? 'animate-spin' : ''}`} />
            <span>{isLiveGenerating ? 'Thinking...' : 'Get Advice'}</span>
          </button>
        </div>

        {liveAIAdvice && (
          <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/20 text-xs text-slate-200 leading-relaxed animate-in fade-in">
            {liveAIAdvice}
          </div>
        )}
      </div>

      {/* 4. Gemini API Key Configuration (Optional) */}
      <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 font-semibold text-slate-300">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Gemini API Key (Optional)</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {settings.geminiApiKey ? '✅ Key Active' : '⚡ Local AI Mode'}
          </span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          The app includes an intelligent deterministic AI reasoning engine that works 100% offline. To enable live Gemini Flash calls, enter your Google AI Studio API key below:
        </p>

        <div className="flex items-center space-x-2 pt-1">
          <input
            type="password"
            placeholder="AIzaSy..."
            value={apiKeyInput}
            onChange={e => setApiKeyInput(e.target.value)}
            className="flex-1 bg-slate-900 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSaveApiKey}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium text-xs flex items-center space-x-1 transition"
          >
            {apiKeySaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <span>Save</span>}
          </button>
        </div>
      </div>
    </div>
  );
};
