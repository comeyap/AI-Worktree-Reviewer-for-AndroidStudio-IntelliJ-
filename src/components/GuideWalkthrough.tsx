import React, { useState } from 'react';
import { AppWindow, CheckCircle2, ChevronRight, CornerDownRight, ArrowRightLeft, GitCompare, Layout, Trash2, FolderSync } from 'lucide-react';
import { ThemeType } from '../types';

interface GuideWalkthroughProps {
  theme: ThemeType;
}

export default function GuideWalkthrough({ theme }: GuideWalkthroughProps) {
  const isDark = theme === 'darcula';
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: 'Git Worktree as "Ready Review State"',
      description: 'Avoid loading multiple IDE windows or constantly checking out branches. In our workflow, Git Worktree existence is the absolute source of truth. When an AI developer or session completes a module, it leaves a separate folders worktree directory.',
      benefit: 'Zero database schema drift or cache mismatches from frequent branch checkouts.',
      icon: FolderSync,
    },
    {
      title: 'Side-by-Side Review directly in Android Studio',
      description: 'Activate the list panel with Alt+Shift+W shortcut. Pick the worktree corresponding to your Claude Session to immediately fetch details. Select any modified file to spin open the internal Side-by-Side Diff tab showing exact changes.',
      benefit: 'Review any files across any worktrees inside a single editor instantly.',
      icon: GitCompare,
    },
    {
      title: 'Quick Verification & 1-Click Cleanups',
      description: 'Examine changes, commit and merge them directly in your branch, or complete actions inside the Terminal. When you delete the worktree via the red "Wipe" button in our panel, the plugin securely executes the git command under the hood, cleaning up metadata caches instantly.',
      benefit: 'Maintains extreme cleanliness of development project workspaces.',
      icon: Trash2,
    }
  ];

  return (
    <div className={`p-5 overflow-y-auto h-full space-y-5 select-none ${
      isDark ? 'bg-[#1e1f22] text-[#bcbec4]' : 'bg-white text-gray-800'
    }`}>
      
      {/* Overview Card banner */}
      <div className={`p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between border ${
        isDark ? 'bg-[#2b2d30]/50 border-white/5' : 'bg-[#e0f1fe]/40 border-[#bae6fd]'
      }`}>
        <div className="space-y-1.5 max-w-2xl">
          <h3 className={`text-sm font-bold flex items-center space-x-1.5 ${
            isDark ? 'text-white' : 'text-sky-900'
          }`}>
            <AppWindow size={15} className="text-sky-500 animate-pulse" />
            <span>Interactive Android Studio Review Flow</span>
          </h3>
          <p className="text-[11.5px] leading-relaxed text-gray-400">
            IntelliJ Platform SDK plugins execute shell processes using safe internal runtime wrappers to maintain UI smoothness.
            Browse our step-by-step review blueprint to master this integration.
          </p>
        </div>
        <div className="text-[11px] font-mono text-sky-500 font-semibold shrink-0 mt-3 md:mt-0 flex items-center space-x-1 border border-sky-500/20 px-2.5 py-1 rounded-full">
          <span>Alt + Shift + W Target Key</span>
        </div>
      </div>

      {/* Grid: Left - Step Navigator, Right - Detailed Preview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Step List (Left 5 cols) */}
        <div className="md:col-span-4 space-y-2">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start space-x-3 ${
                  isSelected
                    ? isDark
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-semibold'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                    : isDark
                      ? 'bg-[#2b2d30]/20 border-white/5 hover:bg-[#2b2d30]/50 text-gray-300'
                      : 'bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600'
                }`}
              >
                <div className={`p-1.5 rounded-md shrink-0 ${
                  isSelected ? 'bg-emerald-500 text-white' : 'bg-gray-500/10'
                }`}>
                  <StepIcon size={14} />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11.5px] tracking-tight">{step.title}</div>
                  <div className="text-[9.5px] text-gray-400 opacity-90 line-clamp-1">
                    {step.benefit}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected step details (Right 8 cols) */}
        <div className={`md:col-span-8 p-5 rounded-lg border flex flex-col justify-between space-y-4 ${
          isDark ? 'bg-[#2b2d30]/20 border-white/5' : 'bg-gray-50/50 border-gray-100'
        }`}>
          <div className="space-y-3">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-500">
              <CornerDownRight size={13} />
              <span>Step-by-Step Interactive walkthrough</span>
            </div>
            
            <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              {steps[activeStep].title}
            </h4>

            <p className="text-[11.5px] leading-relaxed text-gray-400">
              {steps[activeStep].description}
            </p>
          </div>

          <div className={`p-3 rounded-md text-[10.5px] flex items-start space-x-2 border leading-relaxed ${
            isDark ? 'bg-[#1e1f22] border-white/5 text-gray-300' : 'bg-emerald-50/40 border-emerald-100 text-emerald-900'
          }`}>
            <span className="text-emerald-500 font-bold shrink-0">√ Advantage:</span>
            <span>{steps[activeStep].benefit}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
