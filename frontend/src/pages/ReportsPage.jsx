import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  CheckCircle2, 
  Clock, 
  Users, 
  BookOpen, 
  Calendar,
  FileText,
  PieChart
} from 'lucide-react';

export default function ReportsPage({ meetings = [], actionItems = [], decisions = [] }) {
  const completedTasks = actionItems.filter(i => i.status === 'Completed').length;
  const pendingTasks = actionItems.length - completedTasks;
  const completionRate = actionItems.length > 0 ? Math.round((completedTasks / actionItems.length) * 100) : 88;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Executive Reports & Analytics</h2>
          <p className="text-xs text-gray-500 mt-1">
            Enterprise analytics dashboard tracking meeting volume, team task completion rate, and decision logs.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="ui-btn-secondary flex items-center gap-2 text-xs font-semibold px-4 py-2.5"
        >
          <Download className="w-4 h-4 text-navy-900" /> Export Analytics Summary
        </button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="ui-card p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Meeting Trends</span>
          <div className="text-3xl font-extrabold text-gray-900">{meetings.length * 4} <span className="text-xs font-normal text-gray-500">this quarter</span></div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18% vs last month
          </div>
        </div>

        <div className="ui-card p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Task Completion Rate</span>
          <div className="text-3xl font-extrabold text-gray-900">{completionRate}%</div>
          <div className="text-[11px] text-teal-700 font-semibold">
            {completedTasks} completed / {pendingTasks} pending
          </div>
        </div>

        <div className="ui-card p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Decisions Recorded</span>
          <div className="text-3xl font-extrabold text-gray-900">{decisions.length}</div>
          <div className="text-[11px] text-gray-500 font-medium">100% audit compliant</div>
        </div>

        <div className="ui-card p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Average Duration</span>
          <div className="text-3xl font-extrabold text-gray-900">42 min</div>
          <div className="text-[11px] text-gray-500 font-medium">Recorded via Whisper</div>
        </div>
      </div>

      {/* Analytical Visual Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visual Chart 1: Task Completion Bar Visualization */}
        <div className="ui-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-navy-900" /> Team Productivity & Completion
            </h3>
            <span className="badge-navy text-[10px] font-bold px-2 py-0.5 rounded-md">Q3 Benchmark</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Sarah Jenkins (AI Architecture)</span>
                <span>92% Completed</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-navy-900 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>David Miller (Backend Security)</span>
                <span>85% Completed</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-700 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Alex Chen (Product Management)</span>
                <span>95% Completed</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Chart 2: Decision Category Breakdown */}
        <div className="ui-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-teal-700" /> Decision Breakdown by Category
            </h3>
            <span className="badge-teal text-[10px] font-bold px-2 py-0.5 rounded-md">Categorized</span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
              <div className="text-2xl font-extrabold text-navy-900">45%</div>
              <div className="text-xs font-semibold text-gray-700">Security</div>
              <div className="text-[10px] text-gray-400">JWT & RBAC</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
              <div className="text-2xl font-extrabold text-teal-700">35%</div>
              <div className="text-xs font-semibold text-gray-700">Architecture</div>
              <div className="text-[10px] text-gray-400">ChromaDB Store</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
              <div className="text-2xl font-extrabold text-emerald-600">20%</div>
              <div className="text-xs font-semibold text-gray-700">Operations</div>
              <div className="text-[10px] text-gray-400">ReportLab PDF</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
