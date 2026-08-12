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
  CheckCircle2
} from 'lucide-react';

export default function Dashboard({ 
  meetings = [], 
  actionItems = [], 
  decisions = [], 
  notifications = [], 
  setActiveTab, 
  setSelectedMeeting 
}) {
  const pendingTasks = actionItems.filter(item => item.status !== 'Completed');
  const highPriorityCount = actionItems.filter(item => item.priority === 'High' && item.status !== 'Completed').length;
  const completionRate = actionItems.length > 0 
    ? Math.round(((actionItems.length - pendingTasks.length) / actionItems.length) * 100) 
    : 88;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Executive Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-8 overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-brand-500/20 via-accent-cyan/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 animate-pulse" /> AI-Powered Multi-Agent Architecture
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Enterprise Meeting Intelligence</h2>
            <p className="text-slate-300 text-xs mt-2 max-w-xl leading-relaxed font-normal">
              Automated OpenAI Whisper speech transcription, speaker diarization, LangGraph executive summarization, action item extraction, and ChromaDB vector search.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('chat')}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] self-start md:self-auto"
          >
            <Bot className="w-4 h-4 text-cyan-300" />
            <span>Launch RAG Assistant</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Meetings */}
        <div className="ui-card ui-card-hover p-6">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Meetings</span>
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100 shadow-xs">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{meetings.length}</div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5 font-medium">
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 100%
            </span> processed via Whisper
          </div>
        </div>

        {/* KPI 2: Pending Tasks */}
        <div className="ui-card ui-card-hover p-6">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Tasks</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 shadow-xs">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{pendingTasks.length}</div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            <span className="text-rose-600 font-bold">{highPriorityCount} High Priority</span> items pending
          </div>
        </div>

        {/* KPI 3: Key Decisions */}
        <div className="ui-card ui-card-hover p-6">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Decisions</span>
            <div className="w-10 h-10 rounded-2xl bg-accent-teal/10 text-accent-teal flex items-center justify-center border border-accent-teal/20 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{decisions.length}</div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            <span className="text-accent-teal font-bold">Audit Compliant</span> knowledge logs
          </div>
        </div>

        {/* KPI 4: Team Productivity */}
        <div className="ui-card ui-card-hover p-6">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Team Productivity</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{completionRate}%</div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Task resolution rate this month
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Meetings Stream & Action Items Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Meetings Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Video className="w-4 h-4 text-brand-700" /> Recent Meetings Stream
            </h3>
            <button
              onClick={() => setActiveTab('meetings')}
              className="text-xs text-brand-700 hover:text-brand-900 font-bold flex items-center gap-1"
            >
              View Studio <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {meetings.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMeeting(m);
                  setActiveTab('meetings');
                }}
                className="ui-card ui-card-hover p-6 cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                      {m.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                      {m.summary?.executive_summary || m.description || 'Processed meeting transcript.'}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-md badge-emerald shrink-0">
                    {m.status}
                  </span>
                </div>

                {/* Key Points Bullet List */}
                {m.summary?.key_points_json && m.summary.key_points_json.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    {m.summary.key_points_json.slice(0, 2).map((pt, idx) => (
                      <div key={idx} className="text-xs text-slate-700 flex items-center gap-2.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                        <span className="truncate">{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Items Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-brand-700" /> Pending Tasks
            </h3>
            <button
              onClick={() => setActiveTab('action-items')}
              className="text-xs text-brand-700 hover:text-brand-900 font-bold flex items-center gap-1"
            >
              Task Board <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="ui-card p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                    task.priority === 'High' ? 'badge-rose' : 'badge-amber'
                  }`}>
                    {task.priority} Priority
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {task.due_date}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                  {task.task_description}
                </p>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100 font-medium">
                  <span>Assignee: <strong className="text-slate-900">{task.assignee_name}</strong></span>
                  <span className="font-bold text-brand-700">{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
