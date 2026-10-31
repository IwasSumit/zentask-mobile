import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isFrameEnabled, setIsFrameEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4 font-sans select-none">
      {/* Viewport Mode Switcher for Desktop */}
      <div className="hidden sm:flex items-center space-x-2 mb-3 bg-slate-900/90 border border-slate-800 rounded-full px-3 py-1 shadow-lg text-xs">
        <span className="text-slate-400 font-medium mr-1">Preview Mode:</span>
        <button
          onClick={() => setIsFrameEnabled(true)}
          className={`px-2.5 py-1 rounded-full flex items-center space-x-1.5 transition ${
            isFrameEnabled
              ? 'bg-indigo-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile Device</span>
        </button>
        <button
          onClick={() => setIsFrameEnabled(false)}
          className={`px-2.5 py-1 rounded-full flex items-center space-x-1.5 transition ${
            !isFrameEnabled
              ? 'bg-indigo-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Responsive Web</span>
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 relative ${
          isFrameEnabled
            ? 'sm:max-w-[420px] sm:h-[880px] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] sm:ring-1 sm:ring-slate-700/60 overflow-hidden flex flex-col bg-slate-900'
            : 'max-w-2xl min-h-screen sm:min-h-[850px] sm:rounded-2xl sm:border sm:border-slate-800 overflow-hidden flex flex-col bg-slate-900'
        }`}
      >
        {/* Dynamic Island / Notch on Desktop Mobile Frame */}
        {isFrameEnabled && (
          <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 z-40 w-28 h-5 bg-black rounded-full items-center justify-between px-3 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900/90 border border-slate-800 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-indigo-500/80" />
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-900" />
          </div>
        )}

        {/* Scrollable App Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-none flex flex-col">
          {children}
        </div>

        {/* iOS Home Indicator Bar */}
        {isFrameEnabled && (
          <div className="hidden sm:block absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-600/50 rounded-full pointer-events-none z-40" />
        )}
      </div>
    </div>
  );
};
