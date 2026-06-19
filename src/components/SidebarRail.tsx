import React from 'react';
import { FolderGit2, History, Construction, Terminal, ShieldAlert, Cpu, AppWindow } from 'lucide-react';
import { ThemeType } from '../types';

interface SidebarRailProps {
  theme: ThemeType;
  currentBottomTab: string;
  setCurrentBottomTab: (tab: string) => void;
}

export default function SidebarRail({ theme, currentBottomTab, setCurrentBottomTab }: SidebarRailProps) {
  const isDark = theme === 'darcula';
  
  const railItems = [
    { id: 'cli', label: 'Terminal CLI', icon: Terminal },
    { id: 'guide', label: 'Workflow Guide', icon: AppWindow },
    { id: 'code', label: 'Plugin source (Kotlin)', icon: Cpu },
  ];

  return (
    <div 
      id="ide-sidebar-rail"
      className={`w-12 h-full flex flex-col justify-between items-center py-2 border-r select-none transition-colors ${
        isDark 
          ? 'bg-[#2B2D30] border-[#393B40] text-[#CED0D6]' 
          : 'bg-[#f7f8fa] border-[#ebecf0] text-gray-700'
      }`}
    >
      {/* Top Section Icons */}
      <div className="flex flex-col space-y-4 items-center w-full">
        {/* Project Explorer Button - Simulated */}
        <div 
          className="group relative cursor-pointer p-2 rounded-lg hover:bg-[#3574F0]/10 hover:text-[#6A9FF5] transition-all text-[#3574F0]" 
          title="Project Workspace"
        >
          <FolderGit2 size={18} />
          <div className="absolute left-14 top-2 bg-black/80 hover:visible text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
            Project Folder Home
          </div>
        </div>

        {/* Git Local History */}
        <div 
          className="group relative cursor-pointer p-2 rounded-lg text-gray-400 hover:bg-gray-500/10 hover:text-white transition-all" 
          title="Git History Logs"
        >
          <History size={18} />
          <div className="absolute left-14 top-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
            Git History Log
          </div>
        </div>
      </div>

      {/* Bottom Section - Toggle current tabs directly from left rail */}
      <div className="flex flex-col space-y-3 items-center w-full">
        {railItems.map((item) => {
          const IconComp = item.icon;
          const isActive = currentBottomTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentBottomTab(item.id)}
              className={`group relative p-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#3574F0]/20 text-[#6A9FF5] border border-[#3574F0]/30'
                  : isDark 
                    ? 'text-gray-400 hover:bg-gray-500/10 hover:text-white' 
                    : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title={item.label}
            >
              <IconComp size={18} />
              <div className="absolute left-14 bottom-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
