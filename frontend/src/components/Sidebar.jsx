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
  Sparkles,
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
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none shadow-xs">
      <div>
        {/* Brand Logo Header */}
        <div className="p-5 flex items-center gap-3.5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-900 via-brand-700 to-accent-cyan p-0.5 shadow-md shadow-brand-700/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent-cyan animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight leading-none text-slate-900">Meeting Assistant</h1>
            <span className="text-[10px] font-bold text-brand-700 tracking-wider uppercase mt-1 block">
              Enterprise AI Platform
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                    ? 'bg-gradient-to-r from-brand-50 to-indigo-50/60 text-brand-900 font-bold border border-brand-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold bg-accent-teal/10 text-accent-teal px-2 py-0.5 rounded-md border border-accent-teal/20">
                    {item.badge}
                  </span>
                )}
                {item.count > 0 && (
                  <span className="text-xs font-bold bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full border border-rose-200">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Enterprise Workspace Card Footer */}
      <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-brand-950 text-white shadow-md border border-slate-800">
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
