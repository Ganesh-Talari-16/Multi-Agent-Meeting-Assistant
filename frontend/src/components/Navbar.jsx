import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  Moon, 
  Sun, 
  ChevronDown, 
  Building2, 
  Command,
  User,
  LogOut,
  Sparkles
} from 'lucide-react';
import { logoutUser } from '../utils/api';

export default function Navbar({ 
  onOpenUploadModal, 
  onSearchClick, 
  unreadCount = 0, 
  currentUser, 
  onNavigateToProfile,
  onLogout 
}) {
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [workspace, setWorkspace] = useState('Acme Corp Enterprise');

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const initials = currentUser?.full_name 
    ? currentUser.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AC';

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-sky-100 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs transition-colors duration-300">
      {/* Left: Search Bar & Workspace Selector */}
      <div className="flex items-center gap-4">
        {/* Workspace Selector Dropdown */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-50/60 dark:bg-slate-900 border border-sky-100 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 cursor-pointer hover:bg-sky-50 dark:hover:bg-slate-850 transition-colors">
          <Building2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>{workspace}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Global Search Input */}
        <div className="relative w-80 hidden md:block">
          <Search className="w-4 h-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search meetings, action items, decisions..."
            onClick={onSearchClick}
            className="w-full bg-white/90 dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-lg pl-9 pr-12 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-sky-100 dark:border-slate-700 shadow-xs font-mono">
            <Command className="w-2.5 h-2.5" /> K
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Primary Action Button */}
        <button
          onClick={onOpenUploadModal}
          className="ui-btn-primary flex items-center gap-2 text-xs px-4 py-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Meeting</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-sky-900 dark:hover:text-sky-300 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-900 transition-colors"
          title="Toggle Light / Dark Mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-sky-900 dark:hover:text-sky-300 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-900 transition-colors">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950"></span>
          )}
        </button>

        {/* User Profile Avatar Navigation */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-sky-100 dark:border-slate-800">
          <button 
            onClick={onNavigateToProfile}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-xs hover:scale-105 transition-all ring-2 ring-sky-500/20"
            title="Open My Profile Page"
          >
            {initials}
          </button>
          <div 
            onClick={onNavigateToProfile}
            className="hidden lg:block text-left leading-tight cursor-pointer hover:opacity-80 transition-opacity"
            title="Open My Profile Page"
          >
            <div className="text-xs font-bold text-slate-900 dark:text-white">{currentUser?.full_name || 'Alex Chen'}</div>
            <div className="text-[10px] text-sky-700 dark:text-sky-400 font-semibold">{currentUser?.role || 'Product Lead'}</div>
          </div>

          <button
            onClick={() => {
              logoutUser();
              if (onLogout) onLogout();
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ml-1"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
