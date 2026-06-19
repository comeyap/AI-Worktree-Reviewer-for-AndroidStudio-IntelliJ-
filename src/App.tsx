import React, { useState, useEffect, useCallback } from 'react';
import { 
  Terminal as TerminalIcon, 
  HelpCircle, 
  Settings, 
  Info, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Volume2, 
  Monitor, 
  FolderMinus, 
  Plus, 
  CornerDownRight, 
  ThumbsUp, 
  Trash2, 
  AppWindow, 
  ExternalLink 
} from 'lucide-react';

import { Worktree, ChangedFile, ThemeType } from './types';
import { INITIAL_WORKTREES } from './data/mockWorktrees';

import HeaderBar from './components/HeaderBar';
import SidebarRail from './components/SidebarRail';
import ActiveWorktreesPanel from './components/ActiveWorktreesPanel';
import DiffViewer from './components/DiffViewer';
import TerminalConsole from './components/TerminalConsole';
import GuideWalkthrough from './components/GuideWalkthrough';
import KotlinPluginCodeExporter from './components/KotlinPluginCodeExporter';
import AddWorktreeModal from './components/AddWorktreeModal';

export default function App() {
  const [theme, setTheme] = useState<ThemeType>('darcula');
  const [worktrees, setWorktrees] = useState<Worktree[]>(INITIAL_WORKTREES);
  const [selectedWorktree, setSelectedWorktree] = useState<Worktree | null>(INITIAL_WORKTREES[0]);
  const [selectedFile, setSelectedFile] = useState<ChangedFile | null>(INITIAL_WORKTREES[0].files[0]);
  const [bottomTab, setBottomTab] = useState<string>('cli'); // cli, guide, code
  const [toolWindowOpen, setToolWindowOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Success merge celebrations
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Terminal commands history
  const [logs, setLogs] = useState<string[]>([
    'Initializing local Git process listener...',
    'System detected standard Gradle android structure in root workspace.',
    'Executing background process lookup:',
    '$ git worktree list --porcelain',
    '3 active worktrees found and mapped to Tool Window.'
  ]);

  // Show persistent toast messages
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Keyboard Alt+Shift+W shortcut to toggle Active Worktree Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle sidebar Alt+Shift+W
      if (e.altKey && e.shiftKey && e.key.toUpperCase() === 'W') {
        e.preventDefault();
        setToolWindowOpen(prev => !prev);
        triggerToast("Shortcut Key Detected: Toggle Active Worktrees Sidebar (Alt + Shift + W)");
        
        setLogs(prev => [
          ...prev,
          `$ Triggered action: ToggleActiveWorktrees`
        ]);
        return;
      }

      // Next / Previous File Traversal
      // Alt + ArrowRight -> Next File, Alt + ArrowLeft -> Previous File
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextFile();
      } else if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevFile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWorktree, selectedFile]);

  // Manual update callback
  const handleManualRefresh = useCallback(() => {
    setIsRefreshing(true);
    
    // Append console stream logs
    setLogs(prev => [
      ...prev,
      `$ git worktree list --porcelain`,
      `[Refresh subprocess running...]`
    ]);

    setTimeout(() => {
      setIsRefreshing(false);
      setLogs(prev => [
        ...prev,
        ...worktrees.map(wt => `[Updated cache stats branch ${wt.branch}]: ${wt.files.length} modifications.`)
      ]);
      triggerToast("Triggered refresh polling: Finished synchronization.");
    }, 700);
  }, [worktrees]);

  // Next / Previous file helpers
  const handleNextFile = () => {
    if (!selectedWorktree || !selectedFile) return;
    const files = selectedWorktree.files;
    const currentIdx = files.findIndex(f => f.filename === selectedFile.filename);
    if (currentIdx !== -1 && currentIdx < files.length - 1) {
      setSelectedFile(files[currentIdx + 1]);
      setLogs(p => [...p, `$ Traversing to next diff item: ${files[currentIdx + 1].filename}`]);
    } else {
      triggerToast("Already reviewing critical final modifications block.");
    }
  };

  const handlePrevFile = () => {
    if (!selectedWorktree || !selectedFile) return;
    const files = selectedWorktree.files;
    const currentIdx = files.findIndex(f => f.filename === selectedFile.filename);
    if (currentIdx > 0) {
      setSelectedFile(files[currentIdx - 1]);
      setLogs(p => [...p, `$ Traversing to previous diff item: ${files[currentIdx - 1].filename}`]);
    } else {
      triggerToast("Already viewing the primary item in this worktree.");
    }
  };

  // Removing standard worktree
  const handleRemoveWorktree = (id: string) => {
    const target = worktrees.find(wt => wt.id === id);
    if (!target) return;

    setLogs(prev => [
      ...prev,
      `$ git worktree remove ${target.path}`,
      `Removing folder and cleaning directories.`
    ]);

    setWorktrees(prev => prev.filter(wt => wt.id !== id));
    
    // Reset selected pointers if current was removed
    if (selectedWorktree?.id === id) {
      const remaining = worktrees.filter(wt => wt.id !== id);
      if (remaining.length > 0) {
        setSelectedWorktree(remaining[0]);
        setSelectedFile(remaining[0].files[0]);
      } else {
        setSelectedWorktree(null);
        setSelectedFile(null);
      }
    }

    triggerToast(`Wiped "${target.name}" and removed lock file completely.`);
  };

  // Simulate CLI command addition
  const handleAddWorktreeCmd = (name: string, branch: string) => {
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, '-');
    const cleanBranch = branch.trim();
    const folderPath = `/Users/developer/AndroidStudioProjects/MyAwesomeApp/worktrees/${cleanName}`;

    const mockFiles: ChangedFile[] = [
      {
        filename: `${name.charAt(0).toUpperCase() + name.slice(1)}ViewModel.kt`,
        filepath: `app/src/main/java/com/example/app/ui/${cleanName}/ViewModel.kt`,
        language: 'kotlin',
        originalContent: `package com.example.app.ui

class ViewModel {
    // legacy parameters
}`,
        modifiedContent: `package com.example.app.ui

import kotlinx.coroutines.flow.MutableStateFlow

class ViewModel {
    val loadingState = MutableStateFlow(false)
}`,
        addedLinesCount: 5,
        deletedLinesCount: 1
      }
    ];

    const newWt: Worktree = {
      id: `wt-${Date.now()}`,
      name: cleanName,
      branch: cleanBranch,
      path: folderPath,
      modifiedCount: 1,
      addedLines: 5,
      deletedLines: 1,
      files: mockFiles
    };

    setWorktrees(prev => [...prev, newWt]);
    setSelectedWorktree(newWt);
    setSelectedFile(mockFiles[0]);
  };

  // Open separate mock window frame (Feature 6)
  const handleOpenWorktreeInNewWindow = (wt: Worktree) => {
    setLogs(prev => [
      ...prev,
      `$ Launching separate Android Studio window frame for path: ${wt.path}`,
      `Starting background daemon initialization...`
    ]);
    
    // Show quick explanatory alert
    triggerToast(`✨ Opening Workspace: Launched separate IDE Window for "../worktrees/${wt.name}"`);
  };

  // Commit & Merge worktree (Feature 5 companion action / Developer shortcut)
  const handleCommitMerge = () => {
    if (!selectedWorktree) return;
    const name = selectedWorktree.name;
    const branch = selectedWorktree.branch;

    setLogs(p => [
      ...p,
      `$ git add .`,
      `$ git commit -m "feat: complete active files inside ${name}"`,
      `$ git checkout main`,
      `$ git merge ${branch}`,
      `$ git worktree remove ${selectedWorktree.path}`,
      `Successfully integrated worktree changes! Cleaned directory path.`
    ]);

    // Remove merged worktree automatically to simulate lifecycle
    setWorktrees(prev => prev.filter(wt => wt.id !== selectedWorktree.id));
    
    const remaining = worktrees.filter(wt => wt.id !== selectedWorktree.id);
    if (remaining.length > 0) {
      setSelectedWorktree(remaining[0]);
      setSelectedFile(remaining[0].files[0]);
    } else {
      setSelectedWorktree(null);
      setSelectedFile(null);
    }

    triggerToast(`🎉 Successfully Verified & Merged "${name}" into Repository!`);
  };

  const isDark = theme === 'darcula';

  // Compute total indices for file traversal list
  const currentWorktreeFiles = selectedWorktree ? selectedWorktree.files : [];
  const activeFileIndex = selectedFile && selectedWorktree 
    ? selectedWorktree.files.findIndex(f => f.filename === selectedFile.filename)
    : -1;

  return (
    <div className={`h-screen flex flex-col overflow-hidden leading-normal antialiased select-none font-sans ${
      isDark ? 'bg-[#1E1F22] text-[#CED0D6]' : 'bg-white text-[#333333]'
    }`}>
      
      {/* 1. Main Header ToolBar with Android Studio styling */}
      <HeaderBar 
        theme={theme}
        setTheme={setTheme}
        toolWindowOpen={toolWindowOpen}
        setToolWindowOpen={setToolWindowOpen}
        onRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
        onAddWorktree={() => setIsAddModalOpen(true)}
      />

      {/* Workspace Body container */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        
        {/* 2. Sleek left-gutter sidebar icons (Terminal, logs switcher) */}
        <SidebarRail 
          theme={theme}
          currentBottomTab={bottomTab}
          setCurrentBottomTab={setBottomTab}
        />

        {/* 3. Central Editing Stage & Logs panels split vertically */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          
          {/* Top Panel: Side-by-Side Unified Diff View */}
          <div className="flex-1 min-h-0 relative">
            <DiffViewer 
              theme={theme}
              selectedFile={selectedFile}
              currentIndex={activeFileIndex}
              totalFiles={currentWorktreeFiles.length}
              onNextFile={handleNextFile}
              onPrevFile={handlePrevFile}
              onCommitMerge={handleCommitMerge}
            />
          </div>

          {/* Draggable/Togglable Bottom panel (Logs, Guide, Code Templates) */}
          <div className={`h-64 border-t flex flex-col shrink-0 overflow-hidden ${
            isDark ? 'border-[#393B40] bg-[#1E1F22]' : 'border-[#d1d5db] bg-[#f7f8fa]'
          }`}>
            {/* Split panel tabs selection */}
            <div className={`h-8 border-b flex items-center justify-between px-3 select-none shrink-0 ${
              isDark ? 'bg-[#2B2D30] border-[#393B40]' : 'bg-gray-100 border-gray-200'
            }`}>
              <div className="flex space-x-1">
                <button
                  onClick={() => setBottomTab('cli')}
                  className={`text-[10px] px-3 py-1 font-bold rounded-t m-0 flex items-center space-x-1 ${
                    bottomTab === 'cli'
                      ? isDark 
                        ? 'bg-[#1E1F22] text-white border-t border-x border-[#3574F0]/30' 
                        : 'bg-white text-gray-900 border-t border-x border-gray-300'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <TerminalIcon size={12} className="text-[#3574F0]" />
                  <span>Sandbox Terminal</span>
                </button>
                <button
                  onClick={() => setBottomTab('guide')}
                  className={`text-[10px] px-3 py-1 font-bold rounded-t m-0 flex items-center space-x-1 ${
                    bottomTab === 'guide'
                      ? isDark 
                        ? 'bg-[#1E1F22] text-white border-t border-x border-[#3574F0]/30' 
                        : 'bg-white text-gray-900 border-t border-x border-gray-300'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <AppWindow size={12} className="text-[#3574F0]" />
                  <span>Review Workflow Guide</span>
                </button>
                <button
                  onClick={() => setBottomTab('code')}
                  className={`text-[10px] px-3 py-1 font-bold rounded-t m-0 flex items-center space-x-1 ${
                    bottomTab === 'code'
                      ? isDark 
                        ? 'bg-[#1E1F22] text-white border-t border-x border-[#3574F0]/30' 
                        : 'bg-white text-gray-900 border-t border-x border-gray-300'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Sparkles size={11} className="text-amber-500" />
                  <span>Plugin Kotlin Code</span>
                </button>
              </div>

              <div className="text-[10px] font-mono text-gray-400">
                Studio Port Mock: 3000
              </div>
            </div>

            {/* Split panels container */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {bottomTab === 'cli' && (
                <TerminalConsole 
                  theme={theme}
                  worktrees={worktrees}
                  onAddWorktreeCmd={handleAddWorktreeCmd}
                  onRemoveWorktreeCmd={handleRemoveWorktree}
                  logs={logs}
                  setLogs={setLogs}
                />
              )}
              {bottomTab === 'guide' && (
                <GuideWalkthrough theme={theme} />
              )}
              {bottomTab === 'code' && (
                <KotlinPluginCodeExporter theme={theme} />
              )}
            </div>
          </div>

        </div>

        {/* 4. Active Worktrees Docking Sidebar (Feature 1 - Tool Window) */}
        {toolWindowOpen && (
          <div className="w-80 shrink-0 h-full">
            <ActiveWorktreesPanel 
              theme={theme}
              worktrees={worktrees}
              selectedWorktree={selectedWorktree}
              onSelectWorktree={setSelectedWorktree}
              selectedFile={selectedFile}
              onSelectFile={setSelectedFile}
              onRemoveWorktree={handleRemoveWorktree}
              onOpenWorktree={handleOpenWorktreeInNewWindow}
              onManualRefresh={handleManualRefresh}
              isRefreshing={isRefreshing}
            />
          </div>
        )}

      </div>

      {/* Floating global temporary toasts alert */}
      {toastMessage && (
        <div id="status-toast" className="fixed bottom-6 right-6 z-50 bg-[#2B2D30]/95 hover:bg-black text-white px-4 py-3 rounded-lg border border-[#3574F0]/30 shadow-2xl space-y-1 select-none animate-slideUp text-xs font-sans max-w-sm">
          <div className="flex items-center space-x-2">
            <span className="p-0.5 bg-[#3574F0]/20 text-[#6A9FF5] rounded-full">
              <Check size={14} className="stroke-[2.5]" />
            </span>
            <span className="font-semibold text-[#6A9FF5] font-mono">WORKSPACE NOTIFIER</span>
          </div>
          <p className="text-[#CED0D6] leading-normal font-medium pl-6">
            {toastMessage}
          </p>
        </div>
      )}

      {/* Modal addition container */}
      <AddWorktreeModal 
        theme={theme}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(wt) => {
          setWorktrees(prev => [...prev, wt]);
          setSelectedWorktree(wt);
          if (wt.files.length > 0) {
            setSelectedFile(wt.files[0]);
          }
          setLogs(prev => [
            ...prev,
            `$ git worktree add ${wt.path} ${wt.branch}`,
            `Added simulated development branch ${wt.branch} with custom changes.`
          ]);
          triggerToast(`Created Worktree "${wt.name}" successfully!`);
        }}
      />

    </div>
  );
}
