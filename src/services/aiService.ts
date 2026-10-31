import { Task } from '../types';

export interface AIPrioritizationResult {
  taskId: string;
  recommendedPriority: 'high' | 'medium' | 'low';
  reasoning: string;
  suggestedOrder: number;
}

export interface AIBriefing {
  headline: string;
  focusRecommendation: string;
  momentumTip: string;
  backlogAdvice?: string;
}

/**
 * Intelligent local reasoning engine for task prioritization
 */
export function prioritizeWithLocalReasoning(tasks: Task[]): AIPrioritizationResult[] {
  return tasks.map((task, index) => {
    let score = 50;
    const reasons: string[] = [];

    // 1. Rollover penalty & urgency
    if (task.rolloverCount >= 3) {
      score += 40;
      reasons.push(`Rolled over ${task.rolloverCount}x. High procrastination risk—tackle early!`);
    } else if (task.rolloverCount > 0) {
      score += 20;
      reasons.push(`Carried over from yesterday.`);
    }

    // 2. Explicit priority
    if (task.priority === 'high') {
      score += 30;
      reasons.push('Marked urgent by user.');
    } else if (task.priority === 'low') {
      score -= 20;
    }

    // 3. Category heuristics
    if (task.category === 'work' || task.category === 'finance') {
      score += 15;
    } else if (task.category === 'health') {
      score += 10;
      reasons.push('Vital habit for sustaining daily energy.');
    }

    // 4. Time estimation heuristic
    if (task.estimatedMinutes && task.estimatedMinutes <= 20) {
      score += 15;
      reasons.push('Quick win (<20m) to generate positive morning momentum.');
    } else if (task.estimatedMinutes && task.estimatedMinutes >= 90) {
      reasons.push('Deep work block: Schedule during peak morning focus.');
    }

    // Determine final recommended priority
    let recommendedPriority: 'high' | 'medium' | 'low' = 'medium';
    if (score >= 75) {
      recommendedPriority = 'high';
    } else if (score < 40) {
      recommendedPriority = 'low';
    }

    const reasoning = reasons.length > 0 
      ? reasons.join(' ') 
      : 'Balanced task: complete during regular midday work rhythm.';

    return {
      taskId: task.id,
      recommendedPriority,
      reasoning,
      suggestedOrder: 100 - score + index,
    };
  }).sort((a, b) => a.suggestedOrder - b.suggestedOrder);
}

/**
 * Generate AI daily briefing based on tasks and backlog status
 */
export function generateLocalBriefing(todayTasks: Task[], backlogTasks: Task[]): AIBriefing {
  const incompleteToday = todayTasks.filter(t => t.status !== 'completed');
  const highPriority = incompleteToday.filter(t => t.priority === 'high');
  const chronicRollovers = backlogTasks.filter(t => t.rolloverCount >= 2);

  let headline = "Ready for a focused, rhythmic day!";
  let focusRecommendation = "Start by knocking out your most demanding task right after 9 AM.";
  let momentumTip = "Use the 2-minute rule: if a task takes under 15 minutes, finish it first.";
  let backlogAdvice: string | undefined;

  if (incompleteToday.length === 0 && backlogTasks.length === 0) {
    headline = "Clear Canvas!";
    focusRecommendation = "You have no active tasks. Add 2 to 3 high-impact goals for today.";
    momentumTip = "Keep today's plan lean and realistic.";
  } else if (chronicRollovers.length > 0) {
    headline = `Attention: ${chronicRollovers.length} task(s) are stagnating in backlog`;
    focusRecommendation = `"${chronicRollovers[0].title}" has rolled over multiple times. Break it into 15-minute subtasks.`;
    backlogAdvice = `Backlog has ${backlogTasks.length} items. Rescue just 1 item into today instead of letting it pile up indefinitely.`;
  } else if (highPriority.length > 0) {
    headline = `Top priority: "${highPriority[0].title}"`;
    focusRecommendation = `Dedicate your first 90-minute block to "${highPriority[0].title}" before checking messages.`;
  }

  return {
    headline,
    focusRecommendation,
    momentumTip,
    backlogAdvice,
  };
}

/**
 * Smart Subtask Decomposer: breaks a complex task title into manageable chunks
 */
export function decomposeTaskLocal(taskTitle: string): string[] {
  const lower = taskTitle.toLowerCase();
  
  if (lower.includes('project') || lower.includes('report') || lower.includes('presentation')) {
    return [
      `Define clear objective and outline for "${taskTitle}" (15m)`,
      'Draft key points and collect required references (30m)',
      'Review, polish, and verify final checklist (20m)',
      'Share with team / archive completed outcome (10m)'
    ];
  }

  if (lower.includes('email') || lower.includes('call') || lower.includes('meeting')) {
    return [
      'Prepare agenda / bullet points to communicate (5m)',
      'Conduct call or send message draft (15m)',
      'Document next actions and log response (5m)'
    ];
  }

  if (lower.includes('tax') || lower.includes('finance') || lower.includes('budget') || lower.includes('bill')) {
    return [
      'Gather statements, receipts, and invoice documents (15m)',
      'Calculate totals and verify discrepancies (20m)',
      'Submit payment or file records into storage (10m)'
    ];
  }

  if (lower.includes('clean') || lower.includes('organize') || lower.includes('declutter')) {
    return [
      'Clear visible surface clutter and discard trash (10m)',
      'Categorize and return items to designated spots (15m)',
      'Wipe down surfaces and finalize tidy state (10m)'
    ];
  }

  return [
    `Stage 1: Gather resources and prep workspace for "${taskTitle}" (10m)`,
    `Stage 2: Execute core execution sprint (25m)`,
    `Stage 3: Inspect results, test, and mark finished (10m)`
  ];
}

/**
 * Real Gemini API caller (if user provides an API key)
 */
export async function callGeminiAPI(apiKey: string, prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('No response text received from Gemini');
  }
  return text;
}
