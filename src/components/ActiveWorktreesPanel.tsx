import React, { useState, useEffect } from 'react';
import { Search, RotateCw, Trash2, ExternalLink, GitBranch, Files, AlertTriangle, PlaySquare, Settings, Check, Clock } from 'lucide-react';
import { Worktree, ThemeType, ChangedFile } from '../types';

interface ActiveWorktreesPanelProps {
  theme: ThemeType;
  worktrees: Worktree[];
  selectedWorktree: Worktree | null;
  onSelectWorktree: (wt: Worktree | null) => void;
  selectedFile: ChangedFile | null;
  onSelectFile: (file: ChangedFile) => void;
  onRemoveWorktree: (id: string) => void;
  onOpenWorktree: (wt: Worktree) => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
}

export default function ActiveWorktreesPanel({
  theme,
  worktrees,
  selectedWorktree,
  onSelectWorktree,
  selectedFile,
  onSelectFile,
  onRemoveWorktree,
  onOpenWorktree,
  onManualRefresh,
  isRefreshing
}: ActiveWorktreesPanelProps) {
  const isDark = theme === 'darcula';
  const [searchVal, setSearchVal] = useState('');
  const [pollInterval, setPollInterval] = useState<number>(0); // 0 = manual, 5 = 5s, 10 = 10s
  const [countdown, setCountdown] = useState<number>(0);

  // Filter word match on worktrees
  const filteredWorktrees = worktrees.filter(wt => 
    wt.name.toLowerCase().includes(searchVal.toLowerCase()) || 
    wt.branch.toLowerCase().includes(searchVal.toLowerCase())
  );

  // Auto polling tick
  useEffect(() => {
    if (pollInterval === 0) {
      setCountdown(0);
      return;
    }

    setCountdown(pollInterval);
    const intervalId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onManualRefresh(); // trigger real mock refresh log outputs!
          return pollInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [pollInterval, onManualRefresh]);

  const handleRemoveClick = (e: React.MouseEvent, wtId: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to run 'git worktree remove' on this branch folder? This will delete all local untracked modified caches but safe-keeps remote tracking.")) {
      onRemoveWorktree(wtId);
    }
  };

  return (
    <div className={`h-full flex flex-col border-l shrink-0 overflow-hidden font-sans text-xs select-none ${
      isDark 
        ? 'bg-[#1E1F22] border-[#393B40] text-[#CED0D6]' 
        : 'bg-[#f7f8fa] border-[#ebecf0] text-gray-800'
    }`}>
      
      {/* Panel header controls */}
      <div className={`p-3 border-b space-y-2 shrink-0 ${
        isDark ? 'bg-[#2B2D30]/40 border-[#393B40]' : 'bg-gray-100/60 border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 font-bold text-[11px] tracking-tight">
            <span>● Active Worktrees</span>
            <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
              isDark ? 'bg-black/30 text-gray-400' : 'bg-white text-gray-500 border border-gray-200'
            }`}>
              {worktrees.length} items
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Countdown or Refresh Indicator */}
            {pollInterval > 0 && (
              <div className="flex items-center space-x-1 text-[9.5px] font-mono text-[#3574F0] font-semibold max-w-[60px]" title="Auto-refreshing polling status">
                <Clock size={11} className="animate-spin" />
                <span>{countdown}s</span>
              </div>
            )}

            {/* Interval drop down setter */}
            <div className="flex items-center space-x-1">
              <span className="text-[9.5px] text-gray-400">Poll:</span>
              <select
                value={pollInterval}
                onChange={(e) => setPollInterval(Number(e.target.value))}
                className={`text-[9.5px] p-0.5 rounded border focus:outline-hidden ${
                  isDark 
                    ? 'bg-[#1E1F22] border-[#393B40] text-white' 
                    : 'bg-white border-gray-300 text-black'
                }`}
                title="Configure 'git worktree list --porcelain' auto-polling interval"
              >
                <option value={0}>Off</option>
                <option value={5}>5s</option>
                <option value={10}>10s</option>
              </select>
            </div>
          </div>
        </div>

        {/* Local Project Search bar */}
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder="Filter list by name..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className={`w-full pl-8 pr-2.5 py-1 text-[11px] rounded border focus:outline-hidden ${
              isDark 
                ? 'bg-[#1E1F22] border-[#393B40] text-[#CED0D6] focus:border-[#3574F0]' 
                : 'bg-white border-gray-200 text-black focus:border-[#3574F0]'
            }`}
          />
        </div>
      </div>

      {/* Main panel viewport: Scroll of active Worktrees */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
        {filteredWorktrees.length === 0 ? (
          <div className="text-center py-8 text-gray-400 italic text-[10.5px]">
            No worktrees found. Add one with "Add Worktree" button or create in terminal!
          </div>
        ) : (
          filteredWorktrees.map((wt) => {
            const isSelected = selectedWorktree?.id === wt.id;
            return (
              <div
                key={wt.id}
                onClick={() => {
                  onSelectWorktree(wt);
                  // Auto-select first file if available
                  if (wt.files.length > 0) {
                    onSelectFile(wt.files[0]);
                  }
                }}
                className={`p-2.5 rounded-md border text-left cursor-pointer transition-all group relative flex flex-col space-y-1.5 ${
                  isSelected
                    ? isDark
                      ? 'bg-[#3574F0]/10 border-[#3574F0]/40 text-white'
                      : 'bg-blue-50 border-blue-300 text-blue-900'
                    : isDark
                      ? 'bg-[#2B2D30]/25 border-transparent hover:border-[#393B40] text-gray-300 hover:bg-[#2B2D30]/40'
                      : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {/* Branch metadata */}
                <div className="flex items-center justify-between min-w-0">
                  <div className="font-semibold text-[11.5px] tracking-tight truncate flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3574F0] shrink-0"></span>
                    <span className="truncate">{wt.name}</span>
                  </div>

                  {/* Actions buttons displayed on demand */}
                  <div className="flex items-center space-x-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenWorktree(wt);
                      }}
                      className={`p-1 rounded transition-colors ${
                        isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-700 hover:text-black'
                      }`}
                      title="Open Worktree as separate Android Studio frame"
                    >
                      <ExternalLink size={12} />
                    </button>
                    <button
                      onClick={(e) => handleRemoveClick(e, wt.id)}
                      className="p-1 rounded text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                      title="Delete worktree (cleans up untrusted edits)"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Sub branch visual indicator */}
                <div className="flex items-center space-x-1 font-mono text-[10px] text-gray-400 truncate opacity-80 pl-3">
                  <GitBranch size={10} className="shrink-0 text-[#3574F0]/80" />
                  <span className="truncate">{wt.branch}</span>
                </div>

                {/* Line count badges */}
                <div className="flex items-center justify-between text-[10px] pl-3">
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Files size={10} />
                    <span>{wt.files.length} changed files</span>
                  </div>
                  <div className="flex items-center space-x-1.5 font-mono">
                    <span className="text-green-500 font-bold">+{wt.addedLines}</span>
                    <span className="text-red-500 font-bold">-{wt.deletedLines}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER DETAIL BLOCK: Shows changed file items of selected worktree */}
      {selectedWorktree && (
        <div className={`p-3 border-t shrink-0 flex flex-col max-h-[170px] ${
          isDark ? 'bg-[#2B2D30]/35 border-[#393B40]' : 'bg-gray-100/50 border-gray-200'
        }`}>
          <div className="font-semibold text-[10.5px] uppercase tracking-wider text-gray-400 mb-2 truncate flex items-center space-x-1">
            <span>Files inside "{selectedWorktree.name}":</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 max-h-[110px] pr-0.5">
            {selectedWorktree.files.map((file, idx) => {
              const isFileSelected = selectedFile?.filename === file.filename;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectFile(file)}
                  className={`w-full text-left p-1.5 px-2 rounded font-mono text-[10.5px] truncate flex items-center justify-between border ${
                    isFileSelected
                      ? isDark
                        ? 'bg-[#3574F0]/15 border-[#3574F0]/30 text-[#6A9FF5] font-bold'
                        : 'bg-blue-100/50 border-blue-300 text-blue-900 font-bold'
                      : isDark
                        ? 'border-transparent text-gray-300 hover:bg-gray-500/5'
                        : 'border-transparent text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="truncate mr-2 pointer-events-none">{file.filename}</span>
                  <span className="text-[9.5px] shrink-0 font-bold pointer-events-none space-x-1">
                    <span className="text-green-500">+{file.addedLinesCount}</span>
                    <span className="text-red-500">-{file.deletedLinesCount}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
