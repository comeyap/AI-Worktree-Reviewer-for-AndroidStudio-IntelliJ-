import React, { useState } from 'react';
import { X, Plus, Folder, GitBranch, Terminal } from 'lucide-react';
import { Worktree, ThemeType } from '../types';

interface AddWorktreeModalProps {
  theme: ThemeType;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (worktree: Worktree) => void;
}

export default function AddWorktreeModal({ theme, isOpen, onClose, onAdd }: AddWorktreeModalProps) {
  const isDark = theme === 'darcula';
  const [name, setName] = useState('feature-checkout');
  const [branch, setBranch] = useState('feature/cart-checkout-v2');
  const [topic, setTopic] = useState('billing'); // templates

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !branch) return;

    // Generate dynamic mock code based on user inputs!
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, '-');
    const cleanBranch = branch.trim();
    const folderPath = `/Users/developer/AndroidStudioProjects/MyAwesomeApp/worktrees/${cleanName}`;

    // Dynamic mock file construction based on chosen template theme
    const mockFiles = [
      {
        filename: `${name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Controller.kt`,
        filepath: `app/src/main/java/com/example/app/data/controller/${cleanName.replace(/-/g, '')}/Controller.kt`,
        language: 'kotlin',
        originalContent: `package com.example.app.data.controller

class Controller {
    // Legacy single thread processing
    fun process() {
        System.out.println("Processing event details...")
    }
}`,
        modifiedContent: `package com.example.app.data.controller

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class Controller {
    // Enhanced coroutines processing context
    suspend fun process() = withContext(Dispatchers.IO) {
        println("Processing securely inside background Thread.")
        performComplexValidation()
    }

    private fun performComplexValidation() {
        // Double check parameters to avoid race-conditions 
        println("Validation parameters verified.")
    }
}`,
        addedLinesCount: 14,
        deletedLinesCount: 4,
      },
      {
        filename: `${name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Service.kt`,
        filepath: `app/src/main/java/com/example/app/domain/service/${cleanName}/Service.kt`,
        language: 'kotlin',
        originalContent: `package com.example.app.domain.service

class Service {
    fun execute() = false
}`,
        modifiedContent: `package com.example.app.domain.service

import android.util.Log

class Service {
    fun execute(): Boolean {
        Log.d("Service", "Triggering service pipeline")
        return true
    }
}`,
        addedLinesCount: 9,
        deletedLinesCount: 2,
      }
    ];

    const addedLines = mockFiles.reduce((acc, f) => acc + f.addedLinesCount, 0);
    const deletedLines = mockFiles.reduce((acc, f) => acc + f.deletedLinesCount, 0);

    const newWorktree: Worktree = {
      id: `wt-${Date.now()}`,
      name: cleanName,
      branch: cleanBranch,
      path: folderPath,
      modifiedCount: mockFiles.length,
      addedLines,
      deletedLines,
      files: mockFiles
    };

    onAdd(newWorktree);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-fadeIn">
      <div className={`w-full max-w-md rounded-lg shadow-2xl border flex flex-col overflow-hidden transition-colors ${
        isDark ? 'bg-[#2b2d30] border-[#393b40] text-[#bcbec4]' : 'bg-white border-[#ebecf0] text-[#333333]'
      }`}>
        
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${
          isDark ? 'bg-[#1e1f22]/50 border-[#393b40]' : 'bg-gray-50 border-gray-100'
        }`}>
          <div className="flex items-center space-x-2">
            <Plus size={16} className="text-emerald-500" />
            <h3 className="font-semibold text-sm">Add Simulated Git Worktree</h3>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 rounded transition-colors ${
              isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-black'
            }`}
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium opacity-80">
              Worktree Directory Name (Git folder)
            </label>
            <div className="relative">
              <Folder size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. feature-search-filter"
                className={`w-full pl-8 pr-3 py-2 rounded border focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono text-[11.5px] ${
                  isDark 
                    ? 'bg-[#1e1f22] border-[#393b40] text-white focus:border-emerald-500' 
                    : 'bg-white border-gray-300 text-black focus:border-emerald-500'
                }`}
              />
            </div>
            <p className="text-[10px] text-gray-400">
              Corresponds to the folder created via `git worktree add`.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium opacity-80">
              Branch Name
            </label>
            <div className="relative">
              <GitBranch size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              <input 
                type="text"
                required
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. feature/search-autofill"
                className={`w-full pl-8 pr-3 py-2 rounded border focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono text-[11.5px] ${
                  isDark 
                    ? 'bg-[#1e1f22] border-[#393b40] text-white focus:border-emerald-500' 
                    : 'bg-white border-gray-300 text-black focus:border-emerald-500'
                }`}
              />
            </div>
          </div>

          {/* Code presets info */}
          <div className={`p-3 rounded border text-xs leading-relaxed flex items-start space-x-2.5 ${
            isDark ? 'bg-[#1e1f22]/60 border-[#393b40] text-gray-300' : 'bg-gray-50 border-gray-100 text-gray-600'
          }`}>
            <Terminal size={15} className="mt-0.5 shrink-0 text-emerald-500 animate-pulse" />
            <div className="space-y-1">
              <span className="font-semibold block text-[11px] text-emerald-500">Live Simulator Engine Integration:</span>
              <span>Adding this will inject 2 custom-aligned side-by-side files. You will immediately be able to examine diff changes in real-time, step through with Arrow buttons, and delete or merge!</span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-3 py-1.5 rounded transition-all font-medium ${
                isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded shadow transition-all flex items-center space-x-1"
            >
              <span>Create Worktree</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
