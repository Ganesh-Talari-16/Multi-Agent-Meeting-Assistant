import React from 'react';
import { 
  Video, 
  CheckSquare, 
  BookOpen, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  Sparkles, 
  Bot, 
  ChevronRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Plus,
  FileText,
  Check,
  Layers
} from 'lucide-react';

export default function Dashboard({ 
  meetings = [], 
  actionItems = [], 
  decisions = [], 
  notifications = [], 
  setActiveTab, 
  setSelectedMeeting,
  loading = false,
  error = null,
  onRefreshData,
  onOpenUploadModal
}) {
  // Real-time Database Metrics Calculation
  const totalMeetingsCount = meetings.length;
  const processedMeetings = meetings.filter(m => {
    const s = String(m.status || '').toLowerCase();
    return s === 'completed' || s === 'processed';
  });
  const processingMeetings = meetings.filter(m => {
    const s = String(m.status || '').toLowerCase();
    return ['transcribing', 'summarizing', 'processing', 'in progress'].includes(s);
  });
  const processedPercentage = totalMeetingsCount > 0 
    ? Math.round((processedMeetings.length / totalMeetingsCount) * 100) 
    : 0;

  const pendingTasks = actionItems.filter(item => String(item.status || '').toLowerCase() !== 'completed');
  const completedTasks = actionItems.filter(item => String(item.status || '').toLowerCase() === 'completed');
  const highPriorityPending = pendingTasks.filter(item => String(item.priority || '').toLowerCase() === 'high');
  const completionRate = actionItems.length > 0 
    ? Math.round((completedTasks.length / actionItems.length) * 100) 
    : 0;

  const totalDecisionsCount = decisions.length;

  const handleMeetingClick = (meeting) => {
    if (setSelectedMeeting) setSelectedMeeting(meeting);
    if (setActiveTab) setActiveTab('meetings');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Error Alert Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <div className="text-xs font-bold">Data Synchronization Alert</div>
              <div className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">{error}</div>
            </div>
          </div>
          {onRefreshData && (
            <button
              onClick={onRefreshData}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          )}
        </div>
      )}

      {/* Executive Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-sky-950 text-white p-8 overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-sky-500/20 via-cyan-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 animate-pulse" /> AI-Powered Multi-Agent Architecture
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Enterprise Meeting Intelligence</h2>
            <p className="text-slate-300 text-xs mt-2 max-w-xl leading-relaxed font-normal">
              Automated OpenAI Whisper speech transcription, speaker diarization, LangGraph executive summarization, action item extraction, and ChromaDB vector search.
            </p>
          </div>
          
          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {onRefreshData && (
              <button
                onClick={onRefreshData}
                disabled={loading}
                className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-sm"
                title="Refresh Workspace Data"
              >
                <RefreshCw className={`w-4 h-4 text-sky-400 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}

            <button
              onClick={() => {
                if (onOpenUploadModal) onOpenUploadModal();
                else if (setActiveTab) setActiveTab('meetings');
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold px-4 py-3 rounded-2xl transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 text-sky-300" />
              <span>Upload Meeting</span>
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab('chat')}
              className="flex items-center gap-2 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Bot className="w-4 h-4 text-white" />
              <span>Launch RAG Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (Real DB Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Meetings */}
        <div className="ui-card ui-card-hover p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Meetings</span>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-800 shadow-xs">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{totalMeetingsCount}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
            {totalMeetingsCount > 0 ? (
              <>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> {processedPercentage}%
                </span>
                <span>processed ({processedMeetings.length} of {totalMeetingsCount})</span>
              </>
            ) : (
              <span className="text-slate-400">No meetings uploaded yet</span>
            )}
          </div>
        </div>

        {/* KPI 2: Pending Tasks */}
        <div className="ui-card ui-card-hover p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Pending Tasks</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-800 shadow-xs">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{pendingTasks.length}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {highPriorityPending.length > 0 ? (
              <span className="text-rose-600 dark:text-rose-400 font-bold">{highPriorityPending.length} High Priority</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Zero Urgent</span>
            )}
            <span className="ml-1">pending items</span>
          </div>
        </div>

        {/* KPI 3: Key Decisions */}
        <div className="ui-card ui-card-hover p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Key Decisions</span>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-800 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{totalDecisionsCount}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {totalDecisionsCount > 0 ? (
              <span className="text-teal-600 dark:text-teal-400 font-bold">Audit Compliant</span>
            ) : (
              <span className="text-slate-400">No decisions recorded</span>
            )}
            <span className="ml-1">knowledge logs</span>
          </div>
        </div>

        {/* KPI 4: Team Productivity */}
        <div className="ui-card ui-card-hover p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Team Productivity</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{completionRate}%</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {actionItems.length > 0 ? (
              <span>{completedTasks.length} of {actionItems.length} tasks completed</span>
            ) : (
              <span>No task data available</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid: Meetings Stream & Pending Tasks Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Meetings Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Video className="w-4 h-4 text-sky-600 dark:text-sky-400" /> Recent Meetings Stream
            </h3>
            <button
              onClick={() => setActiveTab && setActiveTab('meetings')}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-bold flex items-center gap-1"
            >
              View Studio <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Skeleton Loader during initial data fetch */}
          {loading && meetings.length === 0 ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="ui-card p-6 space-y-3 animate-pulse">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : meetings.length === 0 ? (
            /* Empty State for Meetings */
            <div className="ui-card p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 mx-auto flex items-center justify-center border border-sky-100 dark:border-sky-800">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Meetings Uploaded Yet</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                  Upload audio files or Zoom recordings to automatically generate speaker diarization, executive summaries, action items, and ChromaDB vector embeddings.
                </p>
              </div>
              <button
                onClick={() => {
                  if (onOpenUploadModal) onOpenUploadModal();
                  else if (setActiveTab) setActiveTab('meetings');
                }}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Upload First Meeting</span>
              </button>
            </div>
          ) : (
            /* Real Meetings List */
            <div className="space-y-4">
              {meetings.map((m) => {
                const statusStr = String(m.status || '').toLowerCase();
                const isCompleted = statusStr === 'completed' || statusStr === 'processed';
                const isProcessing = ['transcribing', 'summarizing', 'processing', 'in progress'].includes(statusStr);

                return (
                  <div
                    key={m.id}
                    onClick={() => handleMeetingClick(m)}
                    className="ui-card ui-card-hover p-6 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {m.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                          {m.summary?.executive_summary || m.description || 'Processed meeting transcript.'}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-md shrink-0 flex items-center gap-1.5 ${
                        isCompleted
                          ? 'badge-emerald'
                          : isProcessing
                          ? 'badge-amber'
                          : 'badge-rose'
                      }`}>
                        {isProcessing && <RefreshCw className="w-3 h-3 animate-spin" />}
                        <span>{m.status || 'Processed'}</span>
                      </span>
                    </div>

                    {/* Key Points Bullet List */}
                    {m.summary?.key_points_json && m.summary.key_points_json.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        {m.summary.key_points_json.slice(0, 2).map((pt, idx) => (
                          <div key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                            <span className="truncate">{pt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Items Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" /> Pending Tasks
            </h3>
            <button
              onClick={() => setActiveTab && setActiveTab('action-items')}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-bold flex items-center gap-1"
            >
              Task Board <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading && pendingTasks.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="ui-card p-4 space-y-2 animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : pendingTasks.length === 0 ? (
            /* Empty State for Action Items */
            <div className="ui-card p-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">All Tasks Resolved!</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  No pending action items found in your queue.
                </p>
              </div>
            </div>
          ) : (
            /* Real Action Items List */
            <div className="space-y-3">
              {pendingTasks.slice(0, 5).map((task) => {
                const priorityStr = String(task.priority || '').toLowerCase();
                const isHigh = priorityStr === 'high';
                const isMedium = priorityStr === 'medium';

                return (
                  <div key={task.id} className="ui-card p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                        isHigh ? 'badge-rose' : isMedium ? 'badge-amber' : 'badge-teal'
                      }`}>
                        {task.priority || 'Normal'} Priority
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {task.due_date || 'No Date'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {task.task_description}
                    </p>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 font-medium">
                      <span>Assignee: <strong className="text-slate-900 dark:text-slate-200">{task.assignee_name || 'Unassigned'}</strong></span>
                      <span className="font-bold text-sky-600 dark:text-sky-400">{task.status || 'Pending'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
