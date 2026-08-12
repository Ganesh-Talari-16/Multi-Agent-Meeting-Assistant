import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Building2,
  ShieldCheck,
  Key,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  Save,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Sparkles,
  Camera,
  Award,
  Video,
  CheckSquare,
  BookOpen,
  MessageSquare,
  LogOut,
  Bell,
  Palette
} from 'lucide-react';
import { updateProfile, getCurrentUser, logoutUser } from '../utils/api';

export default function ProfilePage({ currentUser, onProfileUpdated, onLogout, setActiveTab }) {
  const user = currentUser || getCurrentUser();
  const [activeSubTab, setActiveSubTab] = useState('info'); // 'info', 'appearance', 'security', 'activity', 'rbac'
  
  // Profile Form State
  const [fullName, setFullName] = useState(user.full_name || 'Alex Chen');
  const [email, setEmail] = useState(user.email || 'alex.chen@company.com');
  const [role, setRole] = useState(user.role || 'Product Lead (Admin)');
  const [organization, setOrganization] = useState('Acme Corp Enterprise');
  const [department, setDepartment] = useState('AI Engineering & Product');
  const [location, setLocation] = useState('San Francisco, CA');
  const [bio, setBio] = useState('Leading multi-agent meeting AI workflows, ChromaDB vector search indexing, and automated decision tracking.');
  const [avatarGradient, setAvatarGradient] = useState('from-sky-600 via-blue-600 to-indigo-600');

  // Theme & Appearance State
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [accentColor, setAccentColor] = useState('sky');

  // Security Form State
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyD-Gemini25Flash-987123-X9Y2Z');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedApiKey, setCopiedApiKey] = useState(false);

  // Notification Toast State
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const handleToggleTheme = (mode) => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else if (mode === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      }
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedApiKey(true);
    setTimeout(() => setCopiedApiKey(false), 2000);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const updated = await updateProfile({
      full_name: fullName,
      email: email,
      role: role,
      organization: organization,
      password: password || undefined
    });
    if (onProfileUpdated) onProfileUpdated(updated);
    setSavedMessage('Profile updated successfully!');
    setPassword('');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const initials = fullName
    ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AC';

  const avatarOptions = [
    { label: 'Sky Blue', class: 'from-sky-600 via-blue-600 to-indigo-600' },
    { label: 'Emerald Mint', class: 'from-emerald-500 via-teal-600 to-cyan-600' },
    { label: 'Royal Violet', class: 'from-purple-600 via-violet-600 to-indigo-700' },
    { label: 'Sunset Coral', class: 'from-amber-500 via-rose-500 to-red-600' },
  ];

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Toast Alert */}
      {savedMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Header Banner & Profile Card */}
      <div className="ui-card rounded-3xl overflow-hidden shadow-xl relative border border-slate-200 dark:border-slate-800">
        {/* Cover Banner */}
        <div className="h-40 bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-800 relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-xs" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleToggleTheme(isDark ? 'light' : 'dark')}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/30"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-sky-200" />}
              <span>{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
            </button>
          </div>
        </div>

        {/* Profile Card Header Info */}
        <div className="p-6 sm:p-8 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Avatar */}
            <div className="relative group">
              <div className={`w-28 h-28 rounded-3xl bg-gradient-to-tr ${avatarGradient} text-white font-extrabold text-3xl flex items-center justify-center shadow-2xl ring-4 ring-white dark:ring-slate-900`}>
                {initials}
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" title="Active Account" />
            </div>

            {/* Title & Badges */}
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{fullName}</h1>
                <span className="badge-navy px-3 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> Verified Admin
                </span>
              </div>
              <p className="text-xs font-bold text-sky-700 dark:text-sky-400 flex items-center gap-2">
                <span>{role}</span>
                <span>•</span>
                <span>{organization}</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {email}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {department}</span>
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveProfile}
              className="ui-btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Profile
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'info', label: 'Personal Information', icon: User },
          { id: 'appearance', label: 'Theme & Appearance', icon: Sun },
          { id: 'security', label: 'Security & API Keys', icon: Key },
          { id: 'activity', label: 'Activity & Stats', icon: Award },
          { id: 'rbac', label: 'RBAC Permissions', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Tab 1: Personal Info */}
        {activeSubTab === 'info' && (
          <div className="ui-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
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

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full ui-input px-4 py-2.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full ui-input px-4 py-2.5 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Executive Bio & Responsibilities</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full ui-input px-4 py-2.5 text-xs leading-relaxed"
              />
            </div>

            {/* Avatar Gradient Picker */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">Avatar Theme Gradient</label>
              <div className="flex flex-wrap gap-3">
                {avatarOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarGradient(opt.class)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 border transition-all ${
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

        {/* Tab 2: Theme & Appearance Center */}
        {activeSubTab === 'appearance' && (
          <div className="ui-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <Sun className="w-4 h-4 text-sky-600" /> Interface Theme & Aesthetics
              </h3>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                Active: {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>

            {/* Theme Mode Selector Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-4">Choose Color Theme</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Light Mode Card */}
                <div
                  onClick={() => handleToggleTheme('light')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    !isDark
                      ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/40 ring-2 ring-sky-500/30 shadow-lg'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="w-full h-28 rounded-xl bg-slate-100 border border-slate-200 p-3 mb-3 flex flex-col justify-between shadow-inner">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-sky-600" />
                      <div className="w-16 h-2 bg-slate-300 rounded" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="w-full h-2.5 bg-white rounded shadow-xs" />
                      <div className="w-3/4 h-2.5 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Light Mode</span>
                    </div>
                    {!isDark && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                  </div>
                </div>

                {/* Dark Mode Card */}
                <div
                  onClick={() => handleToggleTheme('dark')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isDark
                      ? 'border-sky-500 bg-sky-950/60 ring-2 ring-sky-500/30 shadow-lg'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="w-full h-28 rounded-xl bg-slate-950 border border-slate-800 p-3 mb-3 flex flex-col justify-between shadow-inner">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-sky-400" />
                      <div className="w-16 h-2 bg-slate-800 rounded" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="w-full h-2.5 bg-slate-900 rounded" />
                      <div className="w-3/4 h-2.5 bg-slate-850 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Moon className="w-4 h-4 text-sky-400" />
                      <span>Dark Mode</span>
                    </div>
                    {isDark && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                  </div>
                </div>

                {/* System Preference */}
                <div
                  onClick={() => handleToggleTheme('system')}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="w-full h-28 rounded-xl bg-gradient-to-r from-slate-100 to-slate-950 border border-slate-300 dark:border-slate-700 p-3 mb-3 flex flex-col justify-between shadow-inner">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="w-full h-2 bg-slate-400/40 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Laptop className="w-4 h-4 text-indigo-500" />
                      <span>Sync OS System</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Credentials */}
        {activeSubTab === 'security' && (
          <div className="ui-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-sky-600" /> Security Credentials & AI Tokens
            </h3>

            {/* Change Password */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Update Password</label>
              <div className="relative max-w-md">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password (leave blank to keep current)"
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

            {/* Gemini API Key */}
            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Google Gemini API Key</label>
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
                Used by multi-agent tasks (Summarizer, Action Tracker, Decisions, ChromaDB RAG search).
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Activity & Stats */}
        {activeSubTab === 'activity' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="ui-card p-5 text-center space-y-1">
                <Video className="w-6 h-6 text-sky-600 mx-auto mb-2" />
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">24</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Meetings Analyzed</div>
              </div>
              <div className="ui-card p-5 text-center space-y-1">
                <CheckSquare className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">18</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Action Items Closed</div>
              </div>
              <div className="ui-card p-5 text-center space-y-1">
                <BookOpen className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">12</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Decisions Documented</div>
              </div>
              <div className="ui-card p-5 text-center space-y-1">
                <MessageSquare className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">142</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">RAG Assistant Queries</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: RBAC Permissions */}
        {activeSubTab === 'rbac' && (
          <div className="ui-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Role-Based Access Control (RBAC)
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block text-slate-900 dark:text-slate-100">Administrator Privilege</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Full authorization to manage users, API keys, and meeting archives.</span>
                </div>
                <span className="badge-navy text-[10px] font-bold px-3 py-1 rounded-full">Active</span>
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
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
