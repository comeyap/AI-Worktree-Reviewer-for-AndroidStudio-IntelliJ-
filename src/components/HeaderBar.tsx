import React from 'react';
import { Play, Bug, Shield, Layout, Settings, RefreshCw, FolderOpen, PlaySquare, ChevronDown, Monitor } from 'lucide-react';
import { ThemeType } from '../types';

interface HeaderBarProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toolWindowOpen: boolean;
  setToolWindowOpen: (open: boolean) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onAddWorktree: () => void;
}

export default function HeaderBar({
  theme,
  setTheme,
  toolWindowOpen,
  setToolWindowOpen,
  onRefresh,
  isRefreshing,
  onAddWorktree
}: HeaderBarProps) {
  const isDark = theme === 'darcula';
  
  return (
    <div 
      id="ide-header"
      className={`h-11 border-b flex items-center justify-between px-3 select-none transition-colors ${
        isDark 
          ? 'bg-[#2B2D30] border-[#393B40] text-[#CED0D6]' 
          : 'bg-[#f7f8fa] border-[#ebecf0] text-[#333333]'
      }`}
    >
      {/* Left side: Menu items & branch */}
      <div className="flex items-center space-x-4 text-xs font-sans">
        <div className="flex items-center space-x-1.5 font-semibold">
          <svg className="w-4 h-4 text-[#3574F0]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
          </svg>
          <span className="ml-1 tracking-tight text-sm font-bold uppercase">Active Worktrees</span>
        </div>
        <div className="hidden md:flex items-center space-x-3 text-xs opacity-80">
          <span className="hover:text-[#3574F0] cursor-pointer">File</span>
          <span className="hover:text-[#3574F0] cursor-pointer">Edit</span>
          <span className="hover:text-[#3574F0] cursor-pointer">View</span>
          <span className="hover:text-[#3574F0] cursor-pointer">Navigate</span>
          <span className="hover:text-[#3574F0] cursor-pointer">Code</span>
          <span className="hover:text-[#3574F0] cursor-pointer">Git</span>
          <span className="hover:text-[#3574F0] cursor-pointer">Tools</span>
          <span className="hover:text-[#3574F0] cursor-pointer text-[#6A9FF5] font-medium">Worktree Reviewer (Alt+Shift+W)</span>
        </div>
      </div>

      {/* Middle: Run & Debug context */}
      <div className="flex items-center space-x-2 text-xs">
        <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded ${
          isDark ? 'bg-[#1E1F22] text-[#CED0D6] border border-[#393B40]' : 'bg-[#e3e4e8] text-[#333333]'
        }`}>
          <span className="w-2 h-2 rounded-full bg-[#59A869]"></span>
          <span className="font-mono text-[10px]">app</span>
          <ChevronDown size={12} className="opacity-70" />
        </div>
        <button className="p-1 hover:bg-[#3574F0] hover:text-white rounded text-[#59A869] transition-colors" title="Run 'app'">
          <Play size={14} fill="currentColor" />
        </button>
        <button className="p-1 hover:bg-[#3574F0] hover:text-white rounded text-[#848891]" title="Debug 'app'">
          <Bug size={14} fill="currentColor" />
        </button>
      </div>

      {/* Right side: Options and Tool Window toggle */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onAddWorktree}
          className="flex items-center space-x-1 px-2.5 py-1 text-[11px] rounded bg-[#3574F0] hover:bg-[#467FF2] text-white font-medium shadow-sm transition-all"
          title="Simulate Adding high-fidelity Git Worktree"
        >
          <span className="text-xs font-bold">+</span>
          <span>Add Worktree</span>
        </button>

        <button 
          onClick={onRefresh}
          className={`p-1.5 rounded transition-all hover:bg-opacity-20 ${
            isDark ? 'hover:bg-white text-gray-400' : 'hover:bg-gray-200 text-gray-600'
          } ${isRefreshing ? 'animate-spin text-[#3574F0]' : ''}`}
          title="Manual git worktree update"
        >
          <RefreshCw size={14} />
        </button>

        <div className="h-4 w-px bg-gray-500 opacity-20 inline-block"></div>

        {/* Theme Switcher Toggle */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'darcula')}
          className={`px-2 py-1 text-[10px] rounded border transition-all flex items-center space-x-1 font-mono ${
            isDark 
              ? 'border-[#393b40] bg-[#1E1F22] hover:bg-[#393b40] text-amber-400' 
              : 'border-[#d1d5db] bg-white hover:bg-gray-50 text-indigo-600'
          }`}
          title="Toggle UI Palette"
        >
          <span className="text-xs">{isDark ? '🌙 Darcula' : '☀️ Light Theme'}</span>
        </button>

        {/* Toggle Worktrees Tool Window Button */}
        <button
          onClick={() => setToolWindowOpen(!toolWindowOpen)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-medium rounded transition-all ${
            toolWindowOpen
              ? 'bg-[#3574F0]/20 text-[#6A9FF5] border border-[#3574F0]/30'
              : isDark
                ? 'bg-[#1E1F22] border border-[#393b40] hover:bg-[#393b40] text-[#CED0D6]'
                : 'bg-white border border-[#d1d5db] hover:bg-gray-100 text-gray-700'
          }`}
          title="Active Worktrees Sidebar (Alt+Shift+W)"
        >
          <Layout size={13} className={toolWindowOpen ? 'text-[#6A9FF5]' : ''} />
          <span className="hidden sm:inline">Active Worktrees</span>
          <span className={`text-[9px] px-1 py-0.2 rounded ${
            isDark ? 'bg-black/30' : 'bg-gray-100'
          }`}>Alt+Shift+W</span>
        </button>
      </div>
    </div>
  );
}
