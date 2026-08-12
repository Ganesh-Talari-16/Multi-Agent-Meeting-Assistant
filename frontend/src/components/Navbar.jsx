import React, { useState } from 'react';
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
  LogIn
} from 'lucide-react';
import { logoutUser } from '../utils/api';

export default function Navbar({ 
  onOpenUploadModal, 
  onSearchClick, 
  unreadCount = 0, 
  currentUser, 
  onOpenAuthModal, 
  onLogout 
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [workspace, setWorkspace] = useState('Acme Corp Enterprise');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
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
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-sky-100 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left: Search Bar & Workspace Selector */}
      <div className="flex items-center gap-4">
        {/* Workspace Selector Dropdown */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-50/60 border border-sky-100 text-xs font-semibold text-sky-950 cursor-pointer hover:bg-sky-50 transition-colors">
          <Building2 className="w-3.5 h-3.5 text-sky-700" />
          <span>{workspace}</span>
          <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
        </div>

        {/* Global Search Input */}
        <div className="relative w-80 hidden md:block">
          <Search className="w-4 h-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search meetings, action items, decisions..."
            onClick={onSearchClick}
            className="w-full bg-white/90 border border-sky-100 rounded-lg pl-9 pr-12 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100 shadow-xs font-mono">
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
          className="p-2 text-slate-500 hover:text-sky-900 rounded-lg hover:bg-sky-50 transition-colors"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 text-slate-500 hover:text-sky-900 rounded-lg hover:bg-sky-50 transition-colors">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          )}
        </button>

        {/* User Profile Avatar & Auth Control */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-sky-100">
          <button 
            onClick={onOpenAuthModal}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-xs hover:scale-105 transition-all"
            title="User Profile & Security Settings"
          >
            {initials}
          </button>
          <div className="hidden lg:block text-left leading-tight">
            <div className="text-xs font-bold text-slate-900">{currentUser?.full_name || 'Alex Chen'}</div>
            <div className="text-[10px] text-sky-700 font-semibold">{currentUser?.role || 'Product Lead'}</div>
          </div>

          <button
            onClick={() => {
              logoutUser();
              if (onLogout) onLogout();
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-1"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
