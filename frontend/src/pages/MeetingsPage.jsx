import React, { useState } from 'react';
import { 
  Video, 
  Download, 
  Upload, 
  User, 
  Sparkles, 
  Clock, 
  CheckSquare, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Users 
} from 'lucide-react';
import { uploadMeeting } from '../utils/api';

export default function MeetingsPage({ meetings = [], selectedMeeting, setSelectedMeeting, refreshMeetings }) {
  const [activeSubTab, setActiveSubTab] = useState('summary'); // summary, transcript, tasks, decisions
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ summary: true, points: true, topics: true });
  const [formData, setFormData] = useState({ title: '', description: '', raw_transcript: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  const currentMeeting = selectedMeeting || meetings[0];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setIsSubmitting(true);

    const bodyData = new FormData();
    bodyData.append('title', formData.title);
    bodyData.append('description', formData.description);
    if (formData.raw_transcript) bodyData.append('raw_transcript', formData.raw_transcript);
    if (selectedFile) bodyData.append('file', selectedFile);

    await uploadMeeting(bodyData);
    setIsSubmitting(false);
    setShowUploadModal(false);
    setFormData({ title: '', description: '', raw_transcript: '' });
    setSelectedFile(null);
    if (refreshMeetings) refreshMeetings();
  };

  const handleDownloadPDF = () => {
    if (!currentMeeting) return;
    window.open(`/api/v1/reports/meeting/${currentMeeting.id}/pdf`, '_blank');
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Meeting Studio & Player</h2>
          <p className="text-xs text-gray-500 mt-1">
            Speech-to-text transcript viewer, speaker diarization, executive summaries, and action item tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all"
          >
            <Upload className="w-4 h-4" /> Upload Recording / Transcript
          </button>
          {currentMeeting && (
            <button
              onClick={handleDownloadPDF}
              className="ui-btn-secondary flex items-center gap-2 text-xs font-semibold px-4 py-2.5"
            >
              <Download className="w-4 h-4 text-teal-700" /> Export PDF Minutes
            </button>
          )}
        </div>
      </div>

      {/* Meeting Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {meetings.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedMeeting(m)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              currentMeeting?.id === m.id
                ? 'bg-navy-900 text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {m.title}
          </button>
        ))}
      </div>

      {currentMeeting ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Main Viewer Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Mode Sub-tabs */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
              {['summary', 'transcript', 'tasks', 'decisions'].map((tabKey) => (
                <button
                  key={tabKey}
                  onClick={() => setActiveSubTab(tabKey)}
                  className={`flex-1 text-xs font-semibold py-2 rounded-lg capitalize transition-all ${
                    activeSubTab === tabKey
                      ? 'bg-white text-navy-900 shadow-xs font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tabKey === 'tasks' ? 'Action Items' : tabKey}
                </button>
              ))}
            </div>

            {/* SUB-TAB 1: EXECUTIVE SUMMARY */}
            {activeSubTab === 'summary' && (
              <div className="space-y-5">
                {/* Executive Summary Card */}
                <div className="ui-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-navy-900 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-teal-600" /> Summarizer Agent Output
                    </div>
                    <button
                      onClick={() => toggleSection('summary')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedSections.summary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{currentMeeting.title}</h3>
                  
                  {expandedSections.summary && (
                    <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200/80 font-medium">
                      {currentMeeting.summary?.executive_summary || 'Executive summary generated by Gemini LLM.'}
                    </p>
                  )}
                </div>

                {/* Key Takeaways Section */}
                <div className="ui-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Key Discussion Highlights
                    </h4>
                    <button
                      onClick={() => toggleSection('points')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedSections.points ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {expandedSections.points && (
                    <ul className="space-y-2.5">
                      {(currentMeeting.summary?.key_points_json || [
                        "ChromaDB selected as standard enterprise vector store.",
                        "OAuth2 JWT authentication mandatory across all API endpoints.",
                        "PDF meeting minutes automatically dispatched upon processing completion."
                      ]).map((pt, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200/80 font-medium">
                          <span className="w-2 h-2 rounded-full bg-navy-900 mt-1 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* SUB-TAB 2: DIARIZED TRANSCRIPT TIMELINE */}
            {activeSubTab === 'transcript' && (
              <div className="ui-card p-6 space-y-4 max-h-[600px] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Speaker Diarization Timeline
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md badge-teal">
                    Whisper Transcribed
                  </span>
                </div>

                <div className="space-y-4">
                  {(currentMeeting.transcript?.diarized_segments_json || [
                    { speaker: "Alex Chen (Product Lead)", start: 0.0, end: 14.5, text: "Good morning team. Let's start our quarterly roadmap review. First, regarding the AI search optimization project, Sarah will lead the ChromaDB integration by Friday." },
                    { speaker: "Sarah Jenkins (Senior AI Engineer)", start: 15.0, end: 28.2, text: "Sounds good, I will set up the vector store schema and document chunking pipeline by August 15th." },
                    { speaker: "David Miller (Backend Architect)", start: 29.0, end: 35.8, text: "What about the OAuth2 authorization and RBAC integration for API security?" },
                    { speaker: "Alex Chen (Product Lead)", start: 36.0, end: 52.4, text: "We formally decided to implement JWT tokens with role-based access control across all microservices. David will take ownership of the FastAPI auth endpoints with deadline of August 18th." }
                  ]).map((seg, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-navy-900" />
                          <span className="text-xs font-bold text-gray-900">{seg.speaker}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {seg.start}s - {seg.end}s
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed pl-5 border-l-2 border-navy-900 font-medium">
                        {seg.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 3: ACTION ITEMS */}
            {activeSubTab === 'tasks' && (
              <div className="ui-card p-6 space-y-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Action Item Agent Extracted Tasks
                </div>
                <div className="space-y-3">
                  {[
                    { task: "Set up ChromaDB vector store schema and document chunking pipeline for RAG search.", assignee: "Sarah Jenkins", priority: "High", date: "2026-08-15" },
                    { task: "Implement OAuth2 JWT authentication and role-based access control (RBAC) in FastAPI backend.", assignee: "David Miller", priority: "High", date: "2026-08-18" },
                    { task: "Configure PDF meeting report generation service and signed URL cloud storage.", assignee: "Alex Chen", priority: "Medium", date: "2026-08-20" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                          item.priority === 'High' ? 'badge-rose' : 'badge-amber'
                        }`}>
                          {item.priority} Priority
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">Due: {item.date}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-900">{item.task}</p>
                      <div className="text-[11px] text-gray-500 pt-2 border-t border-gray-200/60">
                        Assignee: <strong className="text-gray-900">{item.assignee}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 4: DECISIONS */}
            {activeSubTab === 'decisions' && (
              <div className="ui-card p-6 space-y-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Decision Tracker Agent Formal Logs
                </div>
                <div className="space-y-3">
                  {[
                    { topic: "Authentication & Authorization Architecture", decision: "Adopt JWT tokens paired with Role-Based Access Control (RBAC) across FastAPI endpoints.", rationale: "Ensures stateless API scaling and consistent permission enforcement for enterprise tenants.", category: "Security" },
                    { topic: "Vector Database Selection", decision: "Standardize on ChromaDB as the primary vector store for document and transcript embeddings.", rationale: "Offers high performant local embedding indexing with seamless LangChain and Python integration.", category: "Architecture" }
                  ].map((dec, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md badge-teal">
                        {dec.category}
                      </span>
                      <h4 className="text-xs font-bold text-gray-900">{dec.topic}</h4>
                      <p className="text-xs text-gray-800 bg-white p-3 rounded-lg border border-gray-200 font-medium">
                        {dec.decision}
                      </p>
                      <p className="text-[11px] text-gray-500 italic">Rationale: {dec.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Metadata Side Panel */}
          <div className="space-y-5">
            <div className="ui-card p-6 space-y-4">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
                Meeting Metadata
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Title</span>
                  <span className="font-semibold text-gray-900">{currentMeeting.title}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Status</span>
                  <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-md badge-emerald mt-1">
                    {currentMeeting.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Duration</span>
                  <span className="font-semibold text-gray-800">{currentMeeting.duration_seconds || 320} seconds</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Participants</span>
                  <div className="space-y-1 mt-1">
                    {['Alex Chen (Product Lead)', 'Sarah Jenkins (AI Eng)', 'David Miller (Architect)'].map((p, i) => (
                      <div key={i} className="text-xs text-gray-700 font-medium flex items-center gap-1.5">
                        <User className="w-3 h-3 text-navy-900" /> {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-modal">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-navy-900" /> Upload Meeting Recording / Transcript
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Meeting Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Architectural Sync"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full ui-input px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional background details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full ui-input px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Direct Transcript Text (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Paste raw transcript if available..."
                  value={formData.raw_transcript}
                  onChange={(e) => setFormData({ ...formData, raw_transcript: e.target.value })}
                  className="w-full ui-input px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Audio / Video File (Optional)</label>
                <input
                  type="file"
                  accept="audio/*,video/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full ui-input px-3 py-2 text-xs text-gray-600 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-navy-900 file:text-white hover:file:bg-navy-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="ui-btn-secondary px-4 py-2 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ui-btn-primary px-5 py-2 text-xs font-semibold"
                >
                  {isSubmitting ? 'Processing Pipeline...' : 'Process Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
