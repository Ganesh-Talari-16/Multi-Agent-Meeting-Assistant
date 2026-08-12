import React, { useState } from 'react';
import { CheckSquare, Clock, User, Calendar, Plus, Filter } from 'lucide-react';
import { updateActionItemStatus } from '../utils/api';

export default function ActionItemsPage({ actionItems = [], refreshData }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchAssignee, setSearchAssignee] = useState('');

  const filteredItems = actionItems.filter(item => {
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchesAssignee = !searchAssignee || item.assignee_name.toLowerCase().includes(searchAssignee.toLowerCase());
    return matchesStatus && matchesAssignee;
  });

  const handleStatusToggle = async (item, newStatus) => {
    await updateActionItemStatus(item.id, newStatus);
    if (refreshData) refreshData();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Action Item Tracker</h2>
          <p className="text-xs text-gray-500 mt-1">
            Automated task extraction, owner assignment, deadline management, and status tracking.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter by owner..."
            value={searchAssignee}
            onChange={(e) => setSearchAssignee(e.target.value)}
            className="ui-input px-3.5 py-1.5 text-xs"
          />

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
            {['All', 'Pending', 'In Progress', 'Completed'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === s ? 'bg-navy-900 text-white shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Grid Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="ui-card p-5 hover:border-gray-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                  item.priority === 'High'
                    ? 'badge-rose'
                    : item.priority === 'Medium'
                    ? 'badge-amber'
                    : 'badge-emerald'
                }`}>
                  {item.priority} Priority
                </span>

                <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-400" /> {item.due_date || 'No Date'}
                </span>
              </div>

              <p className="text-xs font-semibold text-gray-900 leading-relaxed">
                {item.task_description}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-200 font-medium">
                <User className="w-3.5 h-3.5 text-navy-900" />
                <span>Owner: <strong className="text-gray-900">{item.assignee_name}</strong></span>
              </div>
            </div>

            {/* Status Selector Bar */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Status:</span>
              <div className="flex items-center gap-1">
                {['Pending', 'In Progress', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusToggle(item, st)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                      item.status === st
                        ? st === 'Completed'
                          ? 'badge-emerald font-bold'
                          : st === 'In Progress'
                          ? 'badge-navy font-bold'
                          : 'badge-amber font-bold'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
