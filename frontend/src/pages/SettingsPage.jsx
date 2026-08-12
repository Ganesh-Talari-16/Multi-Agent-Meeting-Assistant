import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  UserCheck, 
  Bell, 
  ShieldCheck, 
  Save, 
  Database, 
  User, 
  Lock 
} from 'lucide-react';
import { updateProfile, getCurrentUser } from '../utils/api';

export default function SettingsPage({ currentUser, onProfileUpdated }) {
  const user = currentUser || getCurrentUser();
  const [fullName, setFullName] = useState(user.full_name || 'Alex Chen');
  const [role, setRole] = useState(user.role || 'Product Lead (Admin)');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('********************************');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    const updated = await updateProfile({
      full_name: fullName,
      role: role,
      password: password || undefined
    });
    if (onProfileUpdated) onProfileUpdated(updated);
    setSavedSuccess(true);
    setPassword('');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-sky-100 pb-5">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Workspace & User Profile Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage user credentials, RBAC roles, Gemini API keys, and notification rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Profile Section */}
        <div className="ui-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-sky-700" /> Account Profile Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full ui-input px-3.5 py-2.5 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full ui-input px-3.5 py-2.5 text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Update Password (Optional)</label>
            <input
              type="password"
              placeholder="Leave blank to keep current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full ui-input px-3.5 py-2.5 text-xs"
            />
          </div>
        </div>

        {/* Section 2: LLM & Vector Store Credentials */}
        <div className="ui-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Key className="w-4 h-4 text-sky-700" /> AI LLM & Vector Store Configuration
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Google Gemini API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full ui-input px-3.5 py-2.5 text-xs font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Used by Summarizer, Action Item, Decision, and RAG Query agents.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ChromaDB Store Directory</label>
              <input
                type="text"
                readOnly
                value="./chroma_db_store"
                className="w-full ui-input px-3.5 py-2.5 text-xs font-mono bg-sky-50/50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Role-Based Access Control (RBAC) */}
        <div className="ui-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-accent-teal" /> Role-Based Access Control (RBAC)
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Administrator Scope</span>
                <span className="text-[11px] text-slate-500">Full authorization to upload, re-process, and manage enterprise meeting records.</span>
              </div>
              <span className="badge-navy text-[10px] font-bold px-2.5 py-0.5 rounded-md">Active</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Member Scope</span>
                <span className="text-[11px] text-slate-500">View summaries, query RAG assistant, and update action task status.</span>
              </div>
              <span className="badge-teal text-[10px] font-bold px-2.5 py-0.5 rounded-md">Enabled</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              ✓ Settings and profile updated successfully!
            </span>
          ) : <span />}

          <button
            type="submit"
            className="ui-btn-primary px-6 py-3 text-xs font-bold flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Profile & Settings
          </button>
        </div>
      </form>
    </div>
  );
}
