import React, { useState, useMemo } from 'react';
import { Cpu, FileCode2, Copy, Check, Info, Search, HelpCircle, HardDriveDownload } from 'lucide-react';
import { KOTLIN_PLUGIN_FILES, KotlinFile } from '../data/kotlinCode';
import { ThemeType } from '../types';

interface KotlinPluginCodeExporterProps {
  theme: ThemeType;
}

export default function KotlinPluginCodeExporter({ theme }: KotlinPluginCodeExporterProps) {
  const isDark = theme === 'darcula';
  const [selectedFile, setSelectedFile] = useState<KotlinFile>(KOTLIN_PLUGIN_FILES[1]); // Default to plugin.xml
  const [copied, setCopied] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = useMemo(() => {
    return KOTLIN_PLUGIN_FILES.filter(file => {
      return (
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  const handleCopy = (content: string, filename: string) => {
    navigator.clipboard.writeText(content);
    setCopied(filename);
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  return (
    <div className={`h-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x select-none ${
      isDark ? 'bg-[#1e1f22] text-[#bcbec4] divide-[#2b2d30]' : 'bg-white text-gray-800 divide-gray-100'
    }`}>
      
      {/* LEFT: Files structure list */}
      <div className="w-full md:w-80 shrink-0 flex flex-col p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-xs flex items-center space-x-1">
            <Cpu size={14} className="text-emerald-500 animate-pulse" />
            <span>Plugin Kotlin Templates</span>
          </h3>
          <p className="text-[10px] text-gray-400">
            Copy these production-ready Kotlin files directly into your IntelliJ IDEA Gradle plugin project.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search code files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 text-[11px] rounded border focus:outline-none ${
              isDark 
                ? 'bg-[#2b2d30] border-[#393b40] text-white focus:border-emerald-500' 
                : 'bg-gray-50 border-gray-200 text-black focus:border-[#4f46e5]'
            }`}
          />
        </div>

        {/* List items */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-[180px] md:max-h-full">
          {filteredFiles.map((file) => {
            const isSelected = selectedFile.name === file.name;
            return (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-2 rounded transition-all flex flex-col space-y-0.5 border ${
                  isSelected
                    ? isDark
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : isDark
                      ? 'border-transparent hover:bg-gray-500/5 text-gray-300'
                      : 'border-transparent hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-mono text-[10.5px] font-semibold">
                  <FileCode2 size={13} className={isSelected ? 'text-emerald-500' : 'text-gray-400'} />
                  <span className="truncate">{file.name}</span>
                </div>
                <span className="text-[9px] text-gray-400 truncate w-full pl-5">
                  {file.path}
                </span>
              </button>
            );
          })}
        </div>

        {/* Compilation Guides Banner */}
        <div className={`p-3 rounded border text-xs leading-relaxed space-y-2 mt-auto select-none ${
          isDark ? 'bg-[#2b2d30]/60 border-[#393b40] text-gray-300' : 'bg-gray-50 border-gray-100 text-gray-600'
        }`}>
          <div className="flex items-center space-x-1 text-sky-500">
            <Info size={13} />
            <span className="font-semibold text-[10.5px]">How to Run Local?</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-[9.5px]">
            <li>Open IntelliJ & Create a Plugin project.</li>
            <li>Use <b>Kotlin DSL</b> gradle build framework.</li>
            <li>Paste these files in their matching directories.</li>
            <li>Run Gradle task: <code className="bg-black/30 px-1 py-0.2 rounded font-mono text-emerald-500">:runIde</code></li>
          </ol>
        </div>
      </div>

      {/* RIGHT: Selected Code Editor Block */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Code info block */}
        <div className={`p-3 px-4 border-b flex items-center justify-between ${
          isDark ? 'bg-[#2b2d30]/30 border-[#2b2d30]' : 'bg-gray-50/50 border-gray-100'
        }`}>
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider font-mono">
              Target Path: {selectedFile.path}
            </span>
            <p className="text-[10px] text-gray-400 max-w-xl">
              {selectedFile.description}
            </p>
          </div>

          <button
            onClick={() => handleCopy(selectedFile.content, selectedFile.name)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded transition-all text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
          >
            {copied === selectedFile.name ? (
              <>
                <Check size={13} className="text-emerald-100 animate-bounce" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} className="text-emerald-100" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Embedded Code block scrollable */}
        <div className={`flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed select-text ${
          isDark ? 'bg-[#18191b] text-emerald-400' : 'bg-gray-50 text-gray-800'
        }`}>
          <pre className="whitespace-pre pl-1">{selectedFile.content}</pre>
        </div>
      </div>

    </div>
  );
}
