import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Play, Sparkles, Terminal, Trash2 } from 'lucide-react';
import { Worktree, ThemeType } from '../types';

interface TerminalConsoleProps {
  theme: ThemeType;
  worktrees: Worktree[];
  onAddWorktreeCmd: (name: string, branch: string) => void;
  onRemoveWorktreeCmd: (name: string) => void;
  logs: string[];
  setLogs: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TerminalConsole({
  theme,
  worktrees,
  onAddWorktreeCmd,
  onRemoveWorktreeCmd,
  logs,
  setLogs
}: TerminalConsoleProps) {
  const isDark = theme === 'darcula';
  const [inputVal, setInputVal] = useState('');
  const terminalBufferRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (terminalBufferRef.current) {
      terminalBufferRef.current.scrollTop = terminalBufferRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const cmd = inputVal.trim();
    setInputVal('');

    // Append user input
    setLogs((prev) => [...prev, `developer@studio-cli:~$ ${cmd}`]);

    const parts = cmd.split(/\s+/);
    const baseCmd = parts[0];

    if (baseCmd === 'clear') {
      setLogs([]);
      return;
    }

    if (baseCmd === 'help') {
      setLogs((prev) => [
        ...prev,
        'Supported Sandbox Interactive Triggers:',
        '  git worktree list           - List registered development worktrees',
        '  git worktree add [n] [b]    - Simulate creating high fidelity worktree',
        '  git worktree remove [name]  - Wipe selected worktree from active scope',
        '  git branch --show-current   - Display active branch',
        '  clear                       - Empty terminal scrolls',
        '  help                        - Learn about mock shell parameters'
      ]);
      return;
    }

    if (cmd === 'git worktree list') {
      const output = worktrees.map(wt => `${wt.path}\t${wt.branch}\t[modified: ${wt.files.length} files]`);
      setLogs((prev) => [
        ...prev,
        ...output.length ? output : ['No active mock worktrees registered. Use "git worktree add [folder-name] [branch-name]" to register.']
      ]);
      return;
    }

    if (cmd.startsWith('git worktree add')) {
      // e.g., git worktree add feature-test feature/mock-test
      if (parts.length < 5) {
        setLogs((prev) => [...prev, 'Error: Invalid parameters. Usage: git worktree add [folder-name] [branch-name]']);
        return;
      }
      const wtName = parts[3];
      const wtBranch = parts[4];
      onAddWorktreeCmd(wtName, wtBranch);
      setLogs((prev) => [
        ...prev,
        `Preparing worktree: ${wtName}...`,
        `Branch mapping: refs/heads/${wtBranch}...`,
        `git worktree add: registered successfully at /Users/developer/AndroidStudioProjects/MyAwesomeApp/worktrees/${wtName}`
      ]);
      return;
    }

    if (cmd.startsWith('git worktree remove')) {
      if (parts.length < 4) {
        setLogs((prev) => [...prev, 'Error: Please specify target. Usage: git worktree remove [folder-name]']);
        return;
      }
      const targetName = parts[3];
      const target = worktrees.find(wt => wt.name === targetName);
      if (!target) {
        setLogs((prev) => [...prev, `Error: Worktree "${targetName}" not found in current directory.`]);
        return;
      }
      onRemoveWorktreeCmd(target.id);
      setLogs((prev) => [
        ...prev,
        `Removing worktree folders block at path: ${target.path}...`,
        `git worktree remove: success! Cleaned lock metadata files.`
      ]);
      return;
    }

    if (cmd === 'git branch --show-current') {
      setLogs((prev) => [...prev, 'main']);
      return;
    }

    // Default response for other inputs
    setLogs((prev) => [
      ...prev,
      `bash: command "${baseCmd}" not found. Type "help" to list available sandbox commands.`
    ]);
  };

  return (
    <div className={`h-full flex flex-col font-mono text-[11px] ${
      isDark ? 'bg-[#1E1F22] text-[#CED0D6]' : 'bg-gray-950 text-emerald-400'
    }`}>
      
      {/* Terminal Title Bar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b select-none ${
        isDark ? 'bg-[#2B2D30] border-[#393B40] text-[#CED0D6]' : 'bg-gray-900 border-gray-800 text-gray-400'
      }`}>
        <div className="flex items-center space-x-2">
          <Terminal size={12} className="text-[#3574F0]" />
          <span className="font-sans text-[10.5px] font-semibold">Local Terminal Shell Emulator</span>
        </div>
        <div className="flex items-center space-x-3 text-[10px] font-sans opacity-70">
          <span className="text-emerald-400">Status: Running</span>
          <button 
            onClick={() => setLogs([])}
            className="hover:text-red-500 flex items-center space-x-1 p-0.5 rounded transition-all"
            title="Empty Console Stream"
          >
            <Trash2 size={11} />
            <span>Clear Log</span>
          </button>
        </div>
      </div>

      {/* Terminal Scrolls Area */}
      <div 
        ref={terminalBufferRef}
        className="flex-1 p-4 overflow-y-auto space-y-1.5 select-text min-h-0"
      >
        <div className="text-gray-500 text-[10px] pb-2 border-b border-gray-800/40 font-sans leading-relaxed font-normal">
          🐾 <b>Interactive Git Worktree Sandbox CLI</b>: This local system mimics standard Kotlin ProcessBuilder subprocess invocations.
          Type <code className="bg-[#3574F0]/10 px-1 py-0.2 rounded text-[#6A9FF5]">help</code> to display the mock CLI trigger guide.
        </div>
        
        {logs.map((log, idx) => {
          let lineClass = "whitespace-pre-wrap leading-relaxed";
          if (log.startsWith('developer@')) {
            lineClass = "text-sky-400 font-semibold";
          } else if (log.startsWith('Error:')) {
            lineClass = "text-red-400 font-semibold";
          } else if (log.startsWith('$ ')) {
            lineClass = "text-[#6A9FF5] opacity-90";
          } else if (log.includes('registered successfully') || log.includes('git worktree remove: success!')) {
            lineClass = "text-[#10b981] font-medium";
          }

          return (
            <div key={`log-${idx}`} className={lineClass}>
              {log}
            </div>
          );
        })}
      </div>

      {/* Input box */}
      <form 
        onSubmit={handleCommandSubmit}
        className={`flex items-center px-4 py-2 border-t ${
          isDark ? 'bg-[#1E1F22] border-[#393B40]' : 'bg-gray-900 border-gray-800'
        }`}
      >
        <span className="text-sky-400 select-none mr-2 font-semibold font-mono shrink-0">
          developer@studio-cli:~$
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type git command, or 'help'..."
          className="flex-1 bg-transparent border-none outline-hidden focus:ring-0 font-mono text-[11px] text-white selection:bg-[#3574F0]/30 font-medium"
          autoFocus={false}
        />
        <button
          type="submit"
          className="p-1 hover:bg-[#3574F0]/10 hover:text-[#6A9FF5] rounded transition-colors text-gray-400"
          title="Execute Command"
        >
          <ArrowUp size={13} />
        </button>
      </form>
    </div>
  );
}
