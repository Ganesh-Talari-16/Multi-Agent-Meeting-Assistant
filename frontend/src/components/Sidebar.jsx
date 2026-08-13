import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Bot, 
  CheckSquare, 
  BookOpen, 
  BarChart3, 
  Bell, 
  Settings,
  User,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, unreadCount = 0 }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'meetings', label: 'Meetings', icon: Video },
    { id: 'chat', label: 'AI Assistant', icon: Bot, badge: 'RAG' },
    { id: 'action-items', label: 'Action Items', icon: CheckSquare },
    { id: 'decisions', label: 'Decisions', icon: BookOpen },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadCount },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none shadow-xs transition-colors duration-300">
      <div>
        {/* Brand Logo Header */}
        <div 
          className="p-5 flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800/80 cursor-pointer" 
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 p-0.5 shadow-md shadow-sky-600/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight leading-none text-slate-900 dark:text-white">Meeting Assistant</h1>
            <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 tracking-wider uppercase mt-1 block">
              Enterprise AI Platform
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Workspace Nav
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-50 to-indigo-50/60 dark:from-sky-950/60 dark:to-indigo-950/40 text-sky-950 dark:text-sky-200 font-bold border border-sky-200/80 dark:border-sky-800/80 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-700 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800">
                    {item.badge}
                  </span>
                )}
                {item.count > 0 && (
                  <span className="text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Enterprise Workspace Card Footer */}
      <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-sky-950 text-white shadow-md border border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold tracking-tight">Multi-Agent Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
          LangGraph Multi-Agent & Gemini 2.5 Flash active.
        </p>
      </div>
    </aside>
  );
}
