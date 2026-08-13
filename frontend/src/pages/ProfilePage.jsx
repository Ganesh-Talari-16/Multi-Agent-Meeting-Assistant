import React, { useState } from 'react';
import {
  User,
  Mail,
  Building2,
  ShieldCheck,
  Save,
  CheckCircle2,
  Award,
  Video,
  CheckSquare,
  BookOpen,
  MessageSquare,
  LogOut,
  MapPin,
  Briefcase
} from 'lucide-react';
import { updateProfile, getCurrentUser } from '../utils/api';

export default function ProfilePage({ currentUser, onProfileUpdated, onLogout, setActiveTab }) {
  const user = currentUser || getCurrentUser();
  const [activeSubTab, setActiveSubTab] = useState('info'); // 'info' | 'activity'
  
  // Profile Form State
  const [fullName, setFullName] = useState(user.full_name || 'Alex Chen');
  const [email, setEmail] = useState(user.email || 'alex.chen@company.com');
  const [role, setRole] = useState(user.role || 'Product Lead (Admin)');
  const [organization, setOrganization] = useState('Acme Corp Enterprise');
  const [department, setDepartment] = useState('AI Engineering & Product');
  const [location, setLocation] = useState('San Francisco, CA');
  const [bio, setBio] = useState('Leading multi-agent meeting AI workflows, ChromaDB vector search indexing, and automated decision tracking.');
  const [avatarGradient, setAvatarGradient] = useState('from-sky-600 via-blue-600 to-indigo-600');
  const [savedMessage, setSavedMessage] = useState('');

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    const updated = await updateProfile({
      full_name: fullName,
      email: email,
      role: role,
      organization: organization
    });
    if (onProfileUpdated) onProfileUpdated(updated);
    setSavedMessage('Profile updated successfully!');
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
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
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
        <div className="h-36 bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-800 relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-xs" />
        </div>

        {/* Profile Card Header Info */}
        <div className="p-6 sm:p-8 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Avatar */}
            <div className="relative group">
              <div className={`w-24 h-24 rounded-3xl bg-gradient-to-tr ${avatarGradient} text-white font-extrabold text-2xl flex items-center justify-center shadow-2xl ring-4 ring-white dark:ring-slate-900`}>
                {initials}
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" title="Active User" />
            </div>

            {/* Title & Badges */}
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{fullName}</h1>
                <span className="badge-navy px-3 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> Active Account
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
          { id: 'activity', label: 'Activity & Stats', icon: Award }
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
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
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
              <User className="w-4 h-4 text-sky-600" /> Identity & Profile Information
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Department / Team</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full ui-input px-4 py-2.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Office Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full ui-input px-4 py-2.5 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Professional Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full ui-input px-4 py-2.5 text-xs font-medium"
              />
            </div>

            {/* Avatar Theme Style Picker */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Avatar Gradient Preset</label>
              <div className="flex flex-wrap gap-3">
                {avatarOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarGradient(opt.class)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                      avatarGradient === opt.class
                        ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
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

        {/* Tab 2: Activity & Stats */}
        {activeSubTab === 'activity' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="ui-card p-5 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-sky-500" /> Meetings Joined
                </span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">24 Sessions</div>
              </div>

              <div className="ui-card p-5 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> Action Items Owned
                </span>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">18 Tasks</div>
              </div>

              <div className="ui-card p-5 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Decisions Contributed
                </span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">12 Logs</div>
              </div>

              <div className="ui-card p-5 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-sky-500" /> RAG Queries Run
                </span>
                <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">142 Queries</div>
              </div>
            </div>

            <div className="ui-card p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-sky-500" /> Enterprise Role Badges & Status
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white">Platform Role: Admin</span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Full access to ChromaDB stores, meeting pipelines, and user administration.</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white">Account Status: Verified Active</span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">OAuth2 JWT token authentication active across FastAPI endpoints.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
