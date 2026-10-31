// Indian Standard Time (IST) is UTC + 5 hours 30 minutes
export const IST_OFFSET_MINUTES = 5 * 60 + 30; // 330 minutes

/**
 * Returns current Date adjusted to IST timezone
 */
export function getISTDate(simulatedTime?: { hour: number; minute: number } | null): Date {
  const now = new Date();
  // Get UTC milliseconds
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  // IST Date object
  const istDate = new Date(utcMs + (IST_OFFSET_MINUTES * 60000));

  if (simulatedTime) {
    istDate.setHours(simulatedTime.hour, simulatedTime.minute, 0, 0);
  }

  return istDate;
}

/**
 * Format IST Date to YYYY-MM-DD
 */
export function formatISTDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format time to display: e.g. "09:00 AM IST"
 */
export function formatISTTimeString(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const formattedHours = hours < 10 ? '0' + hours : hours;
  return `${formattedHours}:${formattedMinutes} ${ampm} IST`;
}

/**
 * Format readable date: e.g. "Saturday, 31 Oct"
 */
export function formatISTDateReadable(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
}

/**
 * Determines current rhythm phase based on IST hour
 * 09:00 - 11:59 -> morning_kickoff
 * 12:00 - 21:59 -> midday_focus
 * 22:00 - 23:59 -> evening_review
 * 00:00 - 08:59 -> night_rest
 */
export function getRhythmPhase(date: Date): {
  phase: 'morning_kickoff' | 'midday_focus' | 'evening_review' | 'night_rest';
  title: string;
  badgeColor: string;
  description: string;
} {
  const hour = date.getHours();

  if (hour >= 9 && hour < 12) {
    return {
      phase: 'morning_kickoff',
      title: 'Morning Kickoff (9 AM)',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      description: 'Set your key intentions & plan the day.'
    };
  } else if (hour >= 12 && hour < 22) {
    return {
      phase: 'midday_focus',
      title: 'Midday Focus & Nudges',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Stay on track. Keep chipping away at priorities.'
    };
  } else if (hour >= 22) {
    return {
      phase: 'evening_review',
      title: 'Evening Review (10 PM)',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      description: 'Wrap up your day. Incomplete tasks move to backlog.'
    };
  } else {
    return {
      phase: 'night_rest',
      title: 'Night Rest / Early Prep',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      description: 'Recharge. Morning planning starts at 9:00 AM IST.'
    };
  }
}

/**
 * Calculate countdown string to next major milestone (9 AM or 10 PM IST)
 */
export function getCountdownToNextMilestone(date: Date): { label: string; timeRemaining: string } {
  const currentHours = date.getHours();
  const currentMinutes = date.getMinutes();
  const currentSeconds = date.getSeconds();

  const totalCurrentSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

  const morningSeconds = 9 * 3600; // 09:00:00
  const eveningSeconds = 22 * 3600; // 22:00:00

  let targetSeconds: number;
  let label: string;

  if (totalCurrentSeconds < morningSeconds) {
    // Before 9 AM
    targetSeconds = morningSeconds;
    label = 'Morning Kickoff (9 AM)';
  } else if (totalCurrentSeconds < eveningSeconds) {
    // Between 9 AM and 10 PM
    targetSeconds = eveningSeconds;
    label = 'Evening Review (10 PM)';
  } else {
    // After 10 PM, target next day 9 AM
    targetSeconds = morningSeconds + 24 * 3600;
    label = 'Tomorrow Kickoff (9 AM)';
  }

  const diffSeconds = targetSeconds - totalCurrentSeconds;
  const hoursLeft = Math.floor(diffSeconds / 3600);
  const minutesLeft = Math.floor((diffSeconds % 3600) / 60);

  return {
    label,
    timeRemaining: `${hoursLeft}h ${minutesLeft}m`
  };
}
