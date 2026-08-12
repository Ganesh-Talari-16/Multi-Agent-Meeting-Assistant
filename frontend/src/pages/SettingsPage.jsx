import React, { useState, useEffect } from 'react';
import { 
  User, 
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
  Mail, 
  Building2, 
  Shield, 
  Database,
  Code2,
  BellRing
} from 'lucide-react';
import { updateProfile, getCurrentUser } from '../utils/api';

export default function SettingsPage({ currentUser, onProfileUpdated }) {
  const user = currentUser || getCurrentUser();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'appearance', 'security', 'rbac', 'notifications'
  
  // Profile Form States
  const [fullName, setFullName] = useState(user.full_name || 'Alex Chen');
  const [email, setEmail] = useState(user.email || 'alex.chen@company.com');
  const [role, setRole] = useState(user.role || 'Product Lead (Admin)');
  const [organization, setOrganization] = useState('Acme Corp Enterprise');
  const [bio, setBio] = useState('Product Lead overseeing multi-agent AI architecture, ChromaDB vector RAG search, and automated meeting workflows.');
  const [avatarGradient, setAvatarGradient] = useState('from-sky-600 to-cyan-500');

  // Theme & Appearance States
  const [themeMode, setThemeMode] = useState(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
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

  const handleSave = async (e) => {
    e.preventDefault();
    const updated = await updateProfile({
      full_name: fullName,
      email: email,
      role: role,
      organization: organization,
      password: password || undefined
    });
    if (onProfileUpdated) onProfileUpdated(updated);
    setSavedSuccess(true);
    setPassword('');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const initials = fullName
    ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AC';

  const avatarColorOptions = [
    { label: 'Cyan Sky', class: 'from-sky-600 to-cyan-500' },
    { label: 'Indigo Purple', class: 'from-indigo-600 to-violet-600' },
    { label: 'Emerald Teal', class: 'from-emerald-500 to-teal-600' },
    { label: 'Sunset Amber', class: 'from-amber-500 to-rose-500' },
  ];

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Toast Save Alert */}
      {savedSuccess && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>Profile & Settings successfully updated!</span>
        </div>
      )}

      {/* Profile Header Hero Card */}
      <div className="ui-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-400/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Avatar Circle */}
            <div className="relative">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${avatarGradient} text-white font-extrabold text-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform`}>
                {initials}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" title="Online & Active" />
            </div>

            {/* Profile Info */}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold tracking-tight">{fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold badge-navy">
                  Verified User
                </span>
              </div>
              <p className="text-xs font-semibold text-sky-700 dark:text-sky-400 mt-0.5 flex items-center gap-2">
                <span>{role}</span>
                <span>•</span>
                <span>{organization}</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {email}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleThemeChange(themeMode === 'dark' ? 'light' : 'dark')}
              className="ui-btn-secondary px-4 py-2.5 text-xs flex items-center gap-2"
              title="Toggle Light / Dark Theme"
            >
              {themeMode === 'dark' ? (
                <><Sun className="w-4 h-4 text-amber-400" /> Light Mode</>
              ) : (
                <><Moon className="w-4 h-4 text-sky-600" /> Dark Mode</>
              )}
            </button>
            <button
              onClick={handleSave}
              className="ui-btn-primary px-5 py-2.5 text-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'profile', label: 'User Profile', icon: User },
          { id: 'appearance', label: 'Theme & Appearance', icon: Sun },
          { id: 'security', label: 'Security & API Keys', icon: Key },
          { id: 'rbac', label: 'Roles & RBAC', icon: ShieldCheck },
          { id: 'notifications', label: 'Notifications', icon: Bell },
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
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Profile Details */}
        {activeTab === 'profile' && (
          <div className="ui-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="w-4 h-4 text-sky-600" /> Account Profile Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full ui-input px-4 py-2.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Work Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full ui-input px-4 py-2.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Job Title / Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full ui-input px-4 py-2.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Organization / Enterprise</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full ui-input px-4 py-2.5 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">User Bio / Executive Note</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full ui-input px-4 py-2.5 text-xs leading-relaxed"
              />
            </div>

            {/* Avatar Color Accent Picker */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Avatar Color Gradient Accent</label>
              <div className="flex flex-wrap gap-3">
                {avatarColorOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarGradient(opt.class)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                      avatarGradient === opt.class
                        ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-gradient-to-tr ${opt.class}`} />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Theme & Appearance */}
        {activeTab === 'appearance' && (
          <div className="ui-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sun className="w-4 h-4 text-sky-600" /> Interface Theme & Display Settings
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">Color Theme Preference</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Light Theme Card */}
                <div
                  onClick={() => handleThemeChange('light')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    themeMode === 'light'
                      ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/30 ring-2 ring-sky-500/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="w-full h-24 rounded-xl bg-slate-100 border border-slate-200 p-3 mb-3 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-sky-600" />
                      <div className="w-16 h-2 bg-slate-300 rounded" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="w-full h-2 bg-white rounded shadow-xs" />
                      <div className="w-3/4 h-2 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Light Theme</span>
                    </div>
                    {themeMode === 'light' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                  </div>
                </div>

                {/* Dark Theme Card */}
                <div
                  onClick={() => handleThemeChange('dark')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    themeMode === 'dark'
                      ? 'border-sky-500 bg-sky-950/40 ring-2 ring-sky-500/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="w-full h-24 rounded-xl bg-slate-950 border border-slate-800 p-3 mb-3 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-sky-400" />
                      <div className="w-16 h-2 bg-slate-800 rounded" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="w-full h-2 bg-slate-900 rounded" />
                      <div className="w-3/4 h-2 bg-slate-850 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Moon className="w-4 h-4 text-sky-400" />
                      <span>Dark Theme</span>
                    </div>
                    {themeMode === 'dark' && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                  </div>
                </div>

                {/* System Theme Card */}
                <div
                  onClick={() => handleThemeChange('system')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    themeMode === 'system'
                      ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/30 ring-2 ring-sky-500/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="w-full h-24 rounded-xl bg-gradient-to-r from-slate-100 to-slate-900 border border-slate-300 dark:border-slate-700 p-3 mb-3 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="w-full h-2 bg-slate-400/40 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Laptop className="w-4 h-4 text-indigo-500" />
                      <span>System Default</span>
                    </div>
                    {themeMode === 'system' && <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Security & API Keys */}
        {activeTab === 'security' && (
          <div className="ui-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Key className="w-4 h-4 text-sky-600" /> Security Credentials & AI API Keys
            </h3>

            {/* Change Password */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-sky-600" /> Update Password
              </h4>
              <div className="relative max-w-md">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password (leave empty to keep current)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full ui-input px-4 py-2.5 text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Google Gemini API Key */}
            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" /> Google Gemini API Key
                </h4>
                <button
                  type="button"
                  onClick={handleCopyApiKey}
                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  {copiedApiKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedApiKey ? 'Copied!' : 'Copy Key'}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full ui-input px-4 py-2.5 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Used by Summarizer Agent, Action Item Agent, Decision Agent, and ChromaDB RAG query engine.
              </p>
            </div>

            {/* Vector Database Storage Path */}
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-5">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-indigo-500" /> Vector DB Directory (ChromaDB)
              </h4>
              <input
                type="text"
                readOnly
                value="./chroma_db_store"
                className="w-full ui-input px-4 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {/* Tab 4: RBAC & Permissions */}
        {activeTab === 'rbac' && (
          <div className="ui-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Role-Based Access Control (RBAC)
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block text-slate-900 dark:text-slate-100">Administrator Scope</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Full authority to upload meetings, re-process transcripts, and manage workspace settings.</span>
                </div>
                <span className="badge-navy text-[10px] font-bold px-3 py-1 rounded-full">Active Role</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block text-slate-900 dark:text-slate-100">Engineering Member Scope</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Upload audio, query RAG assistant, and update assigned action items.</span>
                </div>
                <span className="badge-teal text-[10px] font-bold px-3 py-1 rounded-full">Enabled</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block text-slate-900 dark:text-slate-100">Executive Auditor Scope</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Read-only access to decision logs and PDF executive report downloads.</span>
                </div>
                <span className="badge-indigo text-[10px] font-bold px-3 py-1 rounded-full">Enabled</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Notifications */}
        {activeTab === 'notifications' && (
          <div className="ui-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Bell className="w-4 h-4 text-sky-600" /> Notification & Alert Rules
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Email Digest Frequency</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'instant', label: 'Instant Alerts' },
                    { id: 'daily', label: 'Daily Digest' },
                    { id: 'weekly', label: 'Weekly Executive Summary' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setEmailDigest(opt.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        emailDigest === opt.id
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                <div>
                  <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">Overdue Action Item Warnings</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Receive automated background notifications 24h before task deadlines.</span>
                </div>
                <input
                  type="checkbox"
                  checked={overdueAlerts}
                  onChange={(e) => setOverdueAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Slack Webhook Integration URL</label>
                <input
                  type="text"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  className="w-full ui-input px-4 py-2.5 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Footer Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Last saved: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            type="submit"
            className="ui-btn-primary px-7 py-3 text-xs font-bold flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Profile & Settings
          </button>
        </div>
      </form>
    </div>
  );
}
