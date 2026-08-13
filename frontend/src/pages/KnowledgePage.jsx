import React, { useState } from 'react';
import { Database, Upload, FileText, CheckCircle2, Shield, Layers, Plus } from 'lucide-react';
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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Organizational Knowledge Vault</h2>
          <p className="text-xs text-gray-500 mt-1">
            Index standard operating procedures (SOPs), technical specs, and corporate policies into ChromaDB for RAG retrieval.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="ui-btn-primary flex items-center gap-2 text-xs font-semibold px-4 py-2.5"
        >
          <Upload className="w-4 h-4" /> Add Document to Index
        </button>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="ui-card p-6 hover:border-gray-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md badge-teal">
                  {doc.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ChromaDB Indexed
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900 leading-snug">{doc.title}</h3>
            </div>

            <div className="text-xs text-gray-500 flex items-center justify-between border-t border-gray-100 pt-3 font-medium">
              <span>Vector Chunks: <strong className="text-navy-900">{doc.chunk_count}</strong></span>
              <span className="font-mono text-[11px] text-gray-400">{doc.created_at?.slice(0, 10) || '2026-08-12'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-7 w-full max-w-lg space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-700" /> Index Document into Vector Store
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold text-xs flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Security Architecture SOP"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full ui-input px-3.5 py-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full ui-input px-3.5 py-2.5 text-xs font-semibold text-gray-800"
                >
                  <option value="SOP">SOP</option>
                  <option value="Policy">Policy</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Specification">Specification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Document Content *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste policy document, SOP guidelines, or project documentation..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full ui-input px-3.5 py-2.5 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ui-btn-primary px-5 py-2.5 text-xs font-bold"
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
