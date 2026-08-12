import React, { useState } from 'react';
import { Database, Upload, FileText, CheckCircle2, Shield, Layers } from 'lucide-react';
import { uploadKnowledgeDoc } from '../utils/api';

export default function KnowledgePage({ docs = [], refreshDocs }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'SOP', content: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    setIsSubmitting(true);

    const bodyData = new FormData();
    bodyData.append('title', formData.title);
    bodyData.append('category', formData.category);
    bodyData.append('content', formData.content);

    await uploadKnowledgeDoc(bodyData);
    setIsSubmitting(false);
    setShowUploadModal(false);
    setFormData({ title: '', category: 'SOP', content: '' });
    if (refreshDocs) refreshDocs();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Organizational Knowledge Vault</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Index standard operating procedures (SOPs), technical specs, and policies into ChromaDB for RAG context retrieval.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-md"
        >
          <Upload className="w-4 h-4" /> Add Document to Index
        </button>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="glass-panel rounded-xl p-5 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {doc.category}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Indexed in ChromaDB
              </span>
            </div>

            <h3 className="text-sm font-bold text-white">{doc.title}</h3>

            <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-3">
              <span>Vector Chunks: <strong className="text-slate-200">{doc.chunk_count}</strong></span>
              <span className="font-mono">{doc.created_at?.slice(0, 10) || '2026-08-12'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" /> Index Document into Vector Store
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Security Architecture SOP"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="SOP">SOP</option>
                  <option value="Policy">Policy</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Specification">Specification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document Content *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste policy document, SOP guidelines, or project documentation..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2 rounded-lg transition-all shadow-md"
                >
                  {isSubmitting ? 'Indexing Vectors...' : 'Chunk & Index in ChromaDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
