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
  Users,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Tag,
  Layers,
  ArrowRight
} from 'lucide-react';
import { uploadMeeting } from '../utils/api';

export default function MeetingsPage({ 
  meetings = [], 
  actionItems = [],
  decisions = [],
  selectedMeeting, 
  setSelectedMeeting, 
  refreshMeetings 
}) {
  const [activeSubTab, setActiveSubTab] = useState('summary'); // summary, transcript, tasks, decisions
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ summary: true, points: true, topics: true });
  const [formData, setFormData] = useState({ title: '', description: '', raw_transcript: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  const currentMeeting = selectedMeeting || (meetings.length > 0 ? meetings[0] : null);

  // Link real meeting-specific action items & decisions
  const meetingActionItems = currentMeeting
    ? (currentMeeting.action_items && currentMeeting.action_items.length > 0
        ? currentMeeting.action_items
        : actionItems.filter(item => item.meeting_id === currentMeeting.id))
    : [];

  const meetingDecisions = currentMeeting
    ? (currentMeeting.decisions && currentMeeting.decisions.length > 0
        ? currentMeeting.decisions
        : decisions.filter(d => d.meeting_id === currentMeeting.id))
    : [];

  // Extract dynamic participant names from diarized segments or metadata
  const diarizedSegments = currentMeeting?.transcript?.diarized_segments_json || [];
  const participants = currentMeeting
    ? Array.from(new Set([
        ...(currentMeeting.participants || []),
        ...diarizedSegments.map(s => s.speaker)
      ])).filter(Boolean)
    : [];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setIsSubmitting(true);

    try {
      const bodyData = new FormData();
      bodyData.append('title', formData.title);
      bodyData.append('description', formData.description);
      if (formData.raw_transcript) bodyData.append('raw_transcript', formData.raw_transcript);
      if (selectedFile) bodyData.append('file', selectedFile);

      const created = await uploadMeeting(bodyData);
      setIsSubmitting(false);
      setShowUploadModal(false);
      setFormData({ title: '', description: '', raw_transcript: '' });
      setSelectedFile(null);
      if (refreshMeetings) await refreshMeetings();
      if (created && setSelectedMeeting) setSelectedMeeting(created);
    } catch (err) {
      console.error("Failed to upload meeting:", err);
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!currentMeeting) return;
    window.open(`/api/v1/reports/meeting/${currentMeeting.id}/pdf`, '_blank');
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Meeting Studio & Player</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Speech-to-text transcript viewer, speaker diarization, executive summaries, and action item tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <Upload className="w-4 h-4" /> Upload Recording / Transcript
          </button>

          {currentMeeting && (
            <button
              onClick={handleDownloadPDF}
              className="ui-btn-secondary flex items-center gap-2 text-xs font-bold px-4 py-2.5"
              title="Download PDF Minutes"
            >
              <Download className="w-4 h-4 text-sky-600 dark:text-sky-400" /> Export PDF Minutes
            </button>
          )}
        </div>
      </div>

      {/* Meeting Selector Bar */}
      {meetings.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
          {meetings.map((m) => {
            const isSelected = currentMeeting?.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMeeting(m)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <Video className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-sky-500'}`} />
                <span>{m.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {currentMeeting ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Main Viewer Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Mode Sub-tabs */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              {[
                { key: 'summary', label: 'Executive Summary', icon: Sparkles },
                { key: 'transcript', label: 'Diarized Transcript', icon: FileText },
                { key: 'tasks', label: `Action Items (${meetingActionItems.length})`, icon: CheckSquare },
                { key: 'decisions', label: `Decisions (${meetingDecisions.length})`, icon: BookOpen }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveSubTab(tab.key)}
                    className={`flex-1 text-xs font-bold py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      isActive
                        ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SUB-TAB 1: EXECUTIVE SUMMARY */}
            {activeSubTab === 'summary' && (
              <div className="space-y-5">
                {/* Executive Summary Card */}
                <div className="ui-card p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-sky-500" /> Summarizer Agent Output
                    </div>
                    <button
                      onClick={() => toggleSection('summary')}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {expandedSections.summary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{currentMeeting.title}</h3>
                  
                  {expandedSections.summary && (
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 font-medium">
                      {currentMeeting.summary?.executive_summary || currentMeeting.description || 'Executive summary generated by multi-agent analysis.'}
                    </p>
                  )}
                </div>

                {/* Key Discussion Highlights Section */}
                <div className="ui-card p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Key Discussion Highlights
                    </h4>
                    <button
                      onClick={() => toggleSection('points')}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {expandedSections.points ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {expandedSections.points && (
                    <ul className="space-y-2.5">
                      {(currentMeeting.summary?.key_points_json || []).length > 0 ? (
                        currentMeeting.summary.key_points_json.map((pt, i) => (
                          <li key={i} className="flex items-start gap-3 text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))
                      ) : (
                        <div className="text-xs text-slate-500 dark:text-slate-400 italic p-3">
                          No specific discussion highlights extracted.
                        </div>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* SUB-TAB 2: DIARIZED TRANSCRIPT TIMELINE */}
            {activeSubTab === 'transcript' && (
              <div className="ui-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-500" /> Speaker Diarization Timeline
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md badge-teal">
                    Whisper Transcribed
                  </span>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {diarizedSegments.length > 0 ? (
                    diarizedSegments.map((seg, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 flex items-center justify-center text-[10px] font-bold">
                              {seg.speaker ? seg.speaker[0] : 'S'}
                            </div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{seg.speaker || 'Speaker'}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {seg.start != null ? `${seg.start}s` : ''} {seg.end != null ? `- ${seg.end}s` : ''}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-4 border-l-2 border-sky-500 font-medium">
                          {seg.text}
                        </p>
                      </div>
                    ))
                  ) : currentMeeting.transcript?.raw_text ? (
                    <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {currentMeeting.transcript.raw_text}
                    </div>
                  ) : (
                    <div className="text-center p-8 text-xs text-slate-500 dark:text-slate-400 italic">
                      No diarized transcript segments available for this meeting.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUB-TAB 3: ACTION ITEMS */}
            {activeSubTab === 'tasks' && (
              <div className="ui-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-sky-500" /> Action Item Agent Tasks ({meetingActionItems.length})
                  </div>
                </div>

                {meetingActionItems.length > 0 ? (
                  <div className="space-y-3">
                    {meetingActionItems.map((item, idx) => {
                      const priorityStr = String(item.priority || '').toLowerCase();
                      const isHigh = priorityStr === 'high';
                      const isMedium = priorityStr === 'medium';
                      return (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                              isHigh ? 'badge-rose' : isMedium ? 'badge-amber' : 'badge-teal'
                            }`}>
                              {item.priority || 'Normal'} Priority
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" /> Due: {item.due_date || 'N/A'}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{item.task_description || item.task}</p>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between font-medium">
                            <span>Assignee: <strong className="text-slate-900 dark:text-slate-200">{item.assignee_name || item.assignee || 'Unassigned'}</strong></span>
                            <span className="font-bold text-sky-600 dark:text-sky-400">{item.status || 'Pending'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center p-8 text-xs text-slate-500 dark:text-slate-400 italic">
                    No action items extracted for this meeting yet.
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB 4: DECISIONS */}
            {activeSubTab === 'decisions' && (
              <div className="ui-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-500" /> Decision Tracker Agent Logs ({meetingDecisions.length})
                  </div>
                </div>

                {meetingDecisions.length > 0 ? (
                  <div className="space-y-3">
                    {meetingDecisions.map((dec, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-2">
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md badge-teal">
                          {dec.category || 'General'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{dec.topic}</h4>
                        <p className="text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 font-medium">
                          {dec.decision_text || dec.decision}
                        </p>
                        {dec.rationale && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">Rationale: {dec.rationale}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 text-xs text-slate-500 dark:text-slate-400 italic">
                    No formal decisions logged for this meeting yet.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Metadata Side Panel */}
          <div className="space-y-5">
            <div className="ui-card p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-500" /> Meeting Metadata
              </h4>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Title</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentMeeting.title}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">Status</span>
                  <span className={`inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${
                    String(currentMeeting.status).toLowerCase() === 'completed' || String(currentMeeting.status).toLowerCase() === 'processed'
                      ? 'badge-emerald'
                      : ['transcribing', 'summarizing', 'processing'].includes(String(currentMeeting.status).toLowerCase())
                      ? 'badge-amber'
                      : 'badge-rose'
                  }`}>
                    {currentMeeting.status || 'Processed'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Duration</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatDuration(currentMeeting.duration_seconds)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Date Processed</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatDate(currentMeeting.created_at)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1.5">Participants</span>
                  {participants.length > 0 ? (
                    <div className="space-y-1.5">
                      {participants.map((p, i) => (
                        <div key={i} className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                          <span className="truncate">{p}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs italic">No speaker diarization data</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State when no meetings exist at all */
        <div className="ui-card p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 mx-auto flex items-center justify-center border border-sky-100 dark:border-sky-800">
            <Video className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Meetings Available in Studio</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              Upload an audio recording or paste direct transcript text to kick off speech-to-text processing, summarization, and action item extraction.
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload First Meeting</span>
          </button>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 w-full max-w-lg space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-500" /> Upload Meeting Recording / Transcript
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Meeting Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Architectural Sync"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full ui-input px-3.5 py-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional background details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full ui-input px-3.5 py-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Direct Transcript Text (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Paste raw transcript if available..."
                  value={formData.raw_transcript}
                  onChange={(e) => setFormData({ ...formData, raw_transcript: e.target.value })}
                  className="w-full ui-input px-3.5 py-2.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Audio / Video File (Optional)</label>
                <input
                  type="file"
                  accept="audio/*,video/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full ui-input px-3.5 py-2 text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-500 file:text-white hover:file:bg-sky-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="ui-btn-secondary px-4 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ui-btn-primary px-5 py-2 text-xs font-bold flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing Pipeline...
                    </>
                  ) : (
                    'Process Meeting'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
