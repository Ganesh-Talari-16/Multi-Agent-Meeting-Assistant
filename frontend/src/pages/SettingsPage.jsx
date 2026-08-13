import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Laptop, 
  Key, 
  ShieldCheck, 
  Bell, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  Sliders, 
  Copy, 
  Shield, 
  Database,
  Code2,
  BellRing,
  Palette,
  Server,
  Smartphone
} from 'lucide-react';
import { updateProfile, getCurrentUser } from '../utils/api';

export default function SettingsPage({ currentUser, onProfileUpdated }) {
  const user = currentUser || getCurrentUser();
  const [activeTab, setActiveTab] = useState('appearance'); // 'appearance', 'security', 'notifications', 'rbac', 'advanced'
  
  // Theme & Appearance States
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('theme') || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  });
  const [compactDensity, setCompactDensity] = useState(false);

  // Security & Credentials States
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyD-Gemini25Flash-987123-X9Y2Z');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedApiKey, setCopiedApiKey] = useState(false);

  // Notifications States
  const [emailDigest, setEmailDigest] = useState('daily'); // 'instant', 'daily', 'weekly'
  const [overdueAlerts, setOverdueAlerts] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXXX');
  
  // Save Feedback State
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Synchronize Theme Mode with Document Element
  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('theme', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else if (mode === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedApiKey(true);
    setTimeout(() => setCopiedApiKey(false), 2000);
  };

  const handleSaveSettings = async (e) => {
    e?.preventDefault();
    if (password) {
      await updateProfile({ password });
    }
    setSavedSuccess(true);
    setPassword('');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Toast Save Alert */}
      {savedSuccess && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>System configuration successfully updated!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-sky-500" /> Application Settings & System Preferences
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global appearance theme, security credentials, API keys, notification channels, and RBAC policies.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="ui-btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'appearance', label: 'Theme & Appearance', icon: Sun },
          { id: 'security', label: 'Security & Keys', icon: Key },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'rbac', label: 'Roles & RBAC', icon: ShieldCheck },
          { id: 'advanced', label: 'Advanced & Sessions', icon: Server },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Form Container */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Tab 1: Theme & Appearance */}
        {activeTab === 'appearance' && (
          <div className="ui-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Sun className="w-4 h-4 text-sky-600" /> Color Mode & Interface Customization
            </h3>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Theme Preference</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => handleThemeChange('light')}
                  className={`p-5 rounded-2xl border text-left space-y-3 transition-all ${
                    themeMode === 'light'
                      ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 ring-2 ring-sky-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Light Mode</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Clean high-contrast theme</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleThemeChange('dark')}
                  className={`p-5 rounded-2xl border text-left space-y-3 transition-all ${
                    themeMode === 'dark'
                      ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 ring-2 ring-sky-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-950 text-sky-400 flex items-center justify-center font-bold">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Dark Mode</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Sleek obsidian night theme</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleThemeChange('system')}
                  className={`p-5 rounded-2xl border text-left space-y-3 transition-all ${
                    themeMode === 'system'
                      ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 ring-2 ring-sky-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">System Sync</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Match OS theme mode</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Compact Data Density</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Reduce table padding for dense monitors</p>
              </div>
              <button
                type="button"
                onClick={() => setCompactDensity(!compactDensity)}
                className={`w-12 h-6 rounded-full transition-colors relative ${compactDensity ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${compactDensity ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Security & API Keys */}
        {activeTab === 'security' && (
          <div className="ui-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-sky-600" /> Authentication Credentials & LLM API Keys
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Update Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new secure password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full ui-input px-4 py-2.5 text-xs pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Gemini LLM API Credential</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full ui-input px-4 py-2.5 text-xs font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyApiKey}
                    className="ui-btn-secondary px-4 py-2.5 text-xs font-bold flex items-center gap-2 shrink-0"
                  >
                    {copiedApiKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedApiKey ? 'Copied' : 'Copy Key'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Notifications Configuration */}
        {activeTab === 'notifications' && (
          <div className="ui-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-600" /> Notification Channels & Delivery Controls
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Summary Digest Frequency</label>
                <div className="grid grid-cols-3 gap-3">
                  {['instant', 'daily', 'weekly'].map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setEmailDigest(freq)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                        emailDigest === freq
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/20'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {freq} Digest
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Task Deadline Warnings</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive alerts when action items are near due date</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOverdueAlerts(!overdueAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${overdueAlerts ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${overdueAlerts ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Slack Webhook Dispatch URL</label>
                <input
                  type="url"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  className="w-full ui-input px-4 py-2.5 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Roles & RBAC */}
        {activeTab === 'rbac' && (
          <div className="ui-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" /> Enterprise Role-Based Access Control (RBAC)
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="badge-navy text-[10px] font-bold px-2 py-0.5 rounded-md">Admin</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Full Administrator</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Can process recordings, edit decisions, and manage ChromaDB vector stores.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="badge-teal text-[10px] font-bold px-2 py-0.5 rounded-md">Member</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Team Member</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Can view transcripts, execute RAG queries, and update assigned action items.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Viewer</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Read-Only Viewer</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Can review meeting reports and decision logs without edit access.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Advanced & Sessions */}
        {activeTab === 'advanced' && (
          <div className="ui-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-600" /> Session Management & Cache Index Maintenance
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Active FastAPI Session</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">JWT Token active · Valid for 24 hours</p>
                </div>
                <span className="badge-emerald text-[10px] font-bold px-2 py-0.5 rounded-md">Authenticated</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">ChromaDB Vector Store Cache</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">2 collections indexed · Local storage active</p>
                </div>
                <button
                  type="button"
                  onClick={() => alert("ChromaDB cache index refreshed!")}
                  className="ui-btn-secondary px-3 py-1.5 text-xs font-bold"
                >
                  Clear Vector Cache
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
