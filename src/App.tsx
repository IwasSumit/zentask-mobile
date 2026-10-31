import React, { useState } from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { TodayTab } from './components/TodayTab';
import { BacklogTab } from './components/BacklogTab';
import { AIStudioTab } from './components/AIStudioTab';
import { SettingsTab } from './components/SettingsTab';
import { PeriodicNudgeBanner } from './components/PeriodicNudgeBanner';
import { MorningKickoffModal } from './components/Modals/MorningKickoffModal';
import { EveningReviewModal } from './components/Modals/EveningReviewModal';
import { AddTaskModal } from './components/Modals/AddTaskModal';
import { SimulateModal } from './components/Modals/SimulateModal';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('today');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [addTaskTarget, setAddTaskTarget] = useState<'today' | 'backlog'>('today');
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);

  const {
    isMorningModalOpen,
    setIsMorningModalOpen,
    isEveningModalOpen,
    setIsEveningModalOpen,
  } = useTasks();

  const handleOpenAddTask = (target: 'today' | 'backlog' = 'today') => {
    setAddTaskTarget(target);
    setIsAddTaskOpen(true);
  };

  return (
    <MobileFrame>
      {/* Top Header */}
      <Header onOpenSimulator={() => setIsSimulateOpen(true)} />

      {/* Periodic Nudge Floating Banner */}
      <PeriodicNudgeBanner onSwitchToToday={() => setActiveTab('today')} />

      {/* Main Content Body */}
      <main className="flex-1 px-4 pt-3.5 pb-24">
        {activeTab === 'today' && (
          <TodayTab
            onOpenAddTask={() => handleOpenAddTask('today')}
            onOpenMorningKickoff={() => setIsMorningModalOpen(true)}
            onOpenEveningReview={() => setIsEveningModalOpen(true)}
            onSwitchToBacklog={() => setActiveTab('backlog')}
          />
        )}

        {activeTab === 'backlog' && (
          <BacklogTab
            onOpenAddTask={() => handleOpenAddTask('backlog')}
            onSwitchToToday={() => setActiveTab('today')}
          />
        )}

        {activeTab === 'ai' && (
          <AIStudioTab onSwitchToToday={() => setActiveTab('today')} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab onOpenSimulator={() => setIsSimulateOpen(true)} />
        )}
      </main>

      {/* Bottom Mobile Tab Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      <MorningKickoffModal
        isOpen={isMorningModalOpen}
        onClose={() => setIsMorningModalOpen(false)}
      />

      <EveningReviewModal
        isOpen={isEveningModalOpen}
        onClose={() => setIsEveningModalOpen(false)}
      />

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        defaultTarget={addTaskTarget}
      />

      <SimulateModal
        isOpen={isSimulateOpen}
        onClose={() => setIsSimulateOpen(false)}
      />
    </MobileFrame>
  );
};

export function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;
