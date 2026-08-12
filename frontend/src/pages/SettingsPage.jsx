import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  UserCheck, 
  Bell, 
  ShieldCheck, 
  Save, 
  Database, 
  Building2 
} from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('********************************');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Workspace & AI Settings</h2>
        <p className="text-xs text-gray-500 mt-1">
          Configure API connections, RBAC permissions, vector store paths, and notification rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: LLM & Vector Store Credentials */}
        <div className="ui-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <Key className="w-4 h-4 text-navy-900" /> AI LLM & Vector Store Configuration
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Google Gemini API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full ui-input px-3 py-2 text-xs font-mono"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Used by Summarizer, Action Item, Decision, and RAG Query agents.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ChromaDB Store Directory</label>
              <input
                type="text"
                readOnly
                value="./chroma_db_store"
                className="w-full ui-input px-3 py-2 text-xs font-mono bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Role-Based Access Control (RBAC) */}
        <div className="ui-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-teal-700" /> Role-Based Access Control (RBAC)
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="text-xs font-bold text-gray-900 block">Administrator Scope</span>
                <span className="text-[11px] text-gray-500">Full access to upload, re-process, and delete meeting records.</span>
              </div>
              <span className="badge-navy text-[10px] font-bold px-2.5 py-0.5 rounded-md">Active</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="text-xs font-bold text-gray-900 block">Member Scope</span>
                <span className="text-[11px] text-gray-500">View summaries, query RAG assistant, and toggle task status.</span>
              </div>
              <span className="badge-teal text-[10px] font-bold px-2.5 py-0.5 rounded-md">Enabled</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
              ✓ Settings saved successfully!
            </span>
          ) : <span />}

          <button
            type="submit"
            className="ui-btn-primary px-6 py-2.5 text-xs font-semibold flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
