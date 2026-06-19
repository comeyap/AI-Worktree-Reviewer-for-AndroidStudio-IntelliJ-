import React, { useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, FileText, CornerDownRight, ThumbsUp, GitCommit } from 'lucide-react';
import { ChangedFile, ThemeType } from '../types';
import { alignDiffLines } from '../utils/diffAligner';

interface DiffViewerProps {
  theme: ThemeType;
  selectedFile: ChangedFile | null;
  currentIndex: number;
  totalFiles: number;
  onNextFile: () => void;
  onPrevFile: () => void;
  onCommitMerge: () => void;
}

export default function DiffViewer({
  theme,
  selectedFile,
  currentIndex,
  totalFiles,
  onNextFile,
  onPrevFile,
  onCommitMerge
}: DiffViewerProps) {
  const isDark = theme === 'darcula';
  const containerRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the top of the diff viewer when switching files
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [selectedFile]);

  // Use our real LCS alignment!
  const alignedLines = useMemo(() => {
    if (!selectedFile) return [];
    return alignDiffLines(selectedFile.originalContent, selectedFile.modifiedContent);
  }, [selectedFile]);

  if (!selectedFile) {
    return (
      <div className={`h-full flex flex-col items-center justify-center p-8 text-center select-none ${
        isDark ? 'bg-[#1e1f22] text-gray-500' : 'bg-white text-gray-400'
      }`}>
        <div className="max-w-md space-y-4">
          <div className="flex justify-center">
            <div className={`p-4 rounded-full ${isDark ? 'bg-[#2b2d30]' : 'bg-gray-100'}`}>
              <FileText size={48} className="stroke-[1.5] text-gray-400" />
            </div>
          </div>
          <h3 className={`text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No File Selected</h3>
          <p className="text-xs">
            Select a modified worktree on the right pane, then choose a file below to start visual revision in side-by-side view.
          </p>
          <div className="flex flex-col items-center justify-center space-y-2 mt-2">
            <span className="text-[10px] px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono">
              Key Shortcut: Alt + Shift + W
            </span>
            <span className="text-[10px] text-gray-400">
              Toggle "Active Worktrees" Sidebar immediately
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Count lines changed in aligned state
  const addedCount = selectedFile.addedLinesCount;
  const deletedCount = selectedFile.deletedLinesCount;

  return (
    <div className="h-full flex flex-col select-none">
      {/* Diff Header Panel */}
      <div className={`h-12 border-b flex items-center justify-between px-4 shrink-0 font-sans ${
        isDark ? 'bg-[#2B2D30] border-[#393B40] text-[#CED0D6]' : 'bg-[#f7f8fa] border-[#ebecf0] text-gray-700'
      }`}>
        <div className="flex items-center space-x-2 truncate">
          <CornerDownRight size={14} className="text-[#3574F0]" />
          <span className="font-mono text-xs font-semibold truncate hover:underline" title={selectedFile.filepath}>
            {selectedFile.filename}
          </span>
          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase ${
            selectedFile.language === 'kotlin' 
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
          }`}>
            {selectedFile.language}
          </span>
          <span className="ml-2 flex items-center space-x-1.5 text-[11px] font-mono">
            <span className="text-green-500 font-bold">+{addedCount}</span>
            <span className="text-red-500 font-bold">-{deletedCount}</span>
          </span>
        </div>

        {/* PR-style Traverser and Action buttons */}
        <div className="flex items-center space-x-3 text-xs shrink-0">
          <div className="flex items-center space-x-1 border border-gray-500/20 rounded overflow-hidden">
            <button
              onClick={onPrevFile}
              className={`p-1 hover:bg-opacity-20 flex items-center ${
                isDark ? 'hover:bg-white text-gray-300' : 'hover:bg-gray-200 text-gray-700'
              }`}
              title="Previous modified file (Alt + ←)"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[11px] px-2.5 font-mono select-none">
              File {currentIndex + 1} of {totalFiles}
            </span>
            <button
              onClick={onNextFile}
              className={`p-1 hover:bg-opacity-20 flex items-center ${
                isDark ? 'hover:bg-white text-gray-300' : 'hover:bg-gray-200 text-gray-700'
              }`}
              title="Next modified file (Alt + →)"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={onCommitMerge}
            className="flex items-center space-x-1 px-3 py-1 bg-[#3574F0] hover:bg-[#467FF2] text-white font-medium rounded shadow-sm text-xs transition-colors"
            title="Mark as reviewed, commit & merge this worktree"
          >
            <GitCommit size={13} className="text-blue-100" />
            <span>Commit & Merge</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Unified Window */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-auto font-mono text-[11.5px] leading-relaxed select-text ${
          isDark ? 'bg-[#1E1F22] text-[#cfd1d6]' : 'bg-white text-[#2a2c2f]'
        }`}
      >
        <div className="flex min-w-[700px] w-full divide-x divide-gray-500/10 min-h-full">
          
          {/* LEFT: ORIGINAL SOURCE (MAIN) */}
          <div className="w-1/2 flex flex-col shrink-0">
            {/* Split panel title */}
            <div className={`p-1.5 text-[10px] font-sans border-b uppercase font-semibold text-center select-none ${
              isDark ? 'bg-[#2B2D30]/50 border-white/5 text-red-400' : 'bg-red-50 border-gray-100 text-red-600'
            }`}>
              Original Code (Local Head / Repository Base)
            </div>
            
            {alignedLines.map((line, idx) => {
              const isDeletion = line.type === 'deletion';
              const isAddedPlaceholder = line.type === 'addition'; // right was added, left needs empty placeholder
              
              const rowBg = isDeletion 
                ? (isDark ? 'bg-red-950/40 text-red-200' : 'bg-red-50 text-red-900Unified') 
                : isAddedPlaceholder 
                  ? (isDark ? 'bg-[#2B2D30]/20' : 'bg-gray-50/50')
                  : 'hover:bg-gray-500/5';

              return (
                <div key={`orig-${idx}`} className={`flex items-stretch min-h-[20px] ${rowBg}`}>
                  {/* Line Number Gutter */}
                  <div className={`w-10 text-right pr-2 text-[10px] select-none shrink-0 border-r py-0.5 opacity-40 ${
                    isDark ? 'bg-[#1E1F22] border-white/5' : 'bg-gray-50 border-gray-100'
                  }`}>
                    {line.originalIndex !== null ? line.originalIndex : ''}
                  </div>
                  {/* Line Code */}
                  <pre className={`pl-3 pr-2 py-0.5 font-mono whitespace-pre overflow-x-auto select-all flex-1 ${
                    isDeletion ? (isDark ? 'bg-red-950/20' : 'bg-red-100/60') : ''
                  }`}>
                    {isAddedPlaceholder ? (
                      <span className="text-gray-500/30 font-sans italic text-[10px] select-none">~ aligned buffer ~</span>
                    ) : (
                      line.originalText || ' '
                    )}
                  </pre>
                </div>
              );
            })}
          </div>

          {/* RIGHT: MODIFIED SOURCE (WORKTREE) */}
          <div className="w-1/2 flex flex-col shrink-0">
            {/* Split panel title */}
            <div className={`p-1.5 text-[10px] font-sans border-b uppercase font-semibold text-center select-none ${
              isDark ? 'bg-[#2B2D30]/50 border-white/5 text-[#6A9FF5]' : 'bg-emerald-50 border-gray-100 text-emerald-700'
            }`}>
              Worktree Modification Code (Simulated / Live Workspace)
            </div>

            {alignedLines.map((line, idx) => {
              const isAddition = line.type === 'addition';
              const isDeletedPlaceholder = line.type === 'deletion'; // left was deleted, right needs empty placeholder
              
              const rowBg = isAddition 
                ? (isDark ? 'bg-emerald-950/40 text-emerald-200' : 'bg-emerald-50 text-emerald-900') 
                : isDeletedPlaceholder 
                  ? (isDark ? 'bg-[#2B2D30]/20' : 'bg-gray-50/50')
                  : 'hover:bg-gray-500/5';

              return (
                <div key={`mod-${idx}`} className={`flex items-stretch min-h-[20px] ${rowBg}`}>
                  {/* Line Number Gutter */}
                  <div className={`w-10 text-right pr-2 text-[10px] select-none shrink-0 border-r py-0.5 opacity-40 ${
                    isDark ? 'bg-[#1E1F22] border-white/5' : 'bg-gray-50 border-gray-100'
                  }`}>
                    {line.modifiedIndex !== null ? line.modifiedIndex : ''}
                  </div>
                  {/* Line Code */}
                  <pre className={`pl-3 pr-2 py-0.5 font-mono whitespace-pre overflow-x-auto select-all flex-1 ${
                    isAddition ? (isDark ? 'bg-emerald-950/20' : 'bg-[#e6fcf5]') : ''
                  }`}>
                    {isDeletedPlaceholder ? (
                      <span className="text-gray-500/30 font-sans italic text-[10px] select-none">~ aligned buffer ~</span>
                    ) : (
                      line.modifiedText || ' '
                    )}
                  </pre>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Floating Instructions Banner */}
      <div className={`p-2 border-t text-[11px] font-sans flex items-center justify-between select-none ${
        isDark ? 'bg-[#1E1F22] border-[#393B40] text-gray-400' : 'bg-[#f7f8fa] border-[#ebecf0] text-gray-500'
      }`}>
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-[#3574F0]">PRO TIP:</span>
          <span>Press <kbd className="bg-gray-700 text-white px-1 rounded text-[9px] font-mono">Alt + Left / Right</kbd> to rapidly traverse changed files.</span>
        </div>
        <div className="flex items-center space-x-1.5 font-mono text-[10px]">
          <Check size={12} className="text-[#3574F0]" />
          <span>Sync Scrolling Auto-Locked</span>
        </div>
      </div>
    </div>
  );
}
