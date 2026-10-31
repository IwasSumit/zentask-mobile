# ZenTask — IST Daily Rhythm & Task Tracker Mobile App

A focused mobile task tracker designed around the Indian Standard Time (IST) daily rhythm with intelligent AI reasoning, morning 9:00 AM intentions, periodic focus nudges, 10:00 PM wrap-up reviews, and automated backlog debt management.

---

## 🌟 Key Features

### 1. ☀️ 9:00 AM IST Morning Kickoff
- **Morning Chime & Notification**: Synthesized gentle morning chimes and native push notification.
- **Backlog Rescue**: Prompts you to pick 1 or 2 critical stagnating items from your backlog.
- **Daily Intentions**: Set your 1–3 top priorities for the day to build momentum.

### 2. ⚡ Periodic Midday Focus Nudges
- Periodic reminders (e.g., every 3 hours or on-demand) assessing your progress and encouraging you to tackle high-impact items.

### 3. 🌙 10:00 PM IST Evening Review & Backlog Pile-up
- **Daily Wrap-up**: Review tasks completed throughout the day and celebrate with confetti and chime audio.
- **Automatic Backlog Rollover**: Any task left incomplete automatically transitions into the **Backlog**.
- **Pile-up Tracking**: Rollover counts (`Rolled over 3x`), task age, and estimated time debt indicators ensure unfinished tasks don't quietly get lost.

### 4. 🧠 AI Reasoning Engine
- **AI Task Prioritization**: Evaluates task urgency, rollover count, estimated duration, and cognitive energy levels to recommend optimal sequencing and provide transparent reasoning notes.
- **AI Daily Briefing**: Morning strategy briefing highlighting top focus, energy pacing, and anti-procrastination advice.
- **Smart Subtask Decomposer**: Enter any complex goal (e.g. *"Prepare board presentation"* or *"File quarterly taxes"*) and AI automatically deconstructs it into bite-sized 15-minute execution steps.
- **Dual AI Mode**: Works 100% offline using a deterministic heuristic reasoning algorithm, or connect your Google AI Studio Gemini API key for live LLM reasoning.

### 5. 🕹️ Instant Rhythm Simulator & Time Travel
- No need to wait until tomorrow at 9 AM or tonight at 10 PM to test the app!
- One-click buttons to simulate **9:00 AM IST**, **2:30 PM Midday Nudge**, or **10:00 PM IST Evening Review & Rollover**.

### 6. 📱 Mobile First Experience
- **Mobile Device Frame**: iPhone/Android mockup frame with dynamic island and status bar on desktop, with a one-click toggle to full-screen responsive mode.
- **Native Look & Feel**: Touch-friendly cards, swipe actions, bottom tab bar navigation with badge counters, and installable PWA manifest.

---

## 🚀 How to Run

1. Open a terminal in the project directory:
   ```bash
   cd C:\Users\sumit\.gemini\antigravity\scratch\task-tracker-mobile
   ```

2. Start the development server:
   ```bash
   npm run dev -- --host
   ```

3. Open in your browser:
   - **On your PC**: `http://localhost:5173/`
   - **On your Mobile Phone (same Wi-Fi)**: `http://192.168.0.100:5173/` (or your local IP)
