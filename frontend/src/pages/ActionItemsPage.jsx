import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  User, 
  Calendar, 
  Plus, 
  Filter, 
  Search,
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  Columns,
  Trash2,
  Edit2,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { createActionItem, updateActionItem, updateActionItemStatus, deleteActionItem } from '../utils/api';

export default function ActionItemsPage({ actionItems = [], refreshData }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'kanban'
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    task_description: '',
    assignee_name: '',
    priority: 'High',
    due_date: new Date().toISOString().split('T')[0],
    status: 'Pending'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const isOverdue = (item) => {
    if (!item.due_date || item.status === 'Completed' || item.status === 'Archived') return false;
    return item.due_date < todayStr;
  };

  const filteredItems = actionItems.filter(item => {
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || (item.priority || '').toLowerCase() === filterPriority.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      (item.task_description || '').toLowerCase().includes(query) ||
      (item.assignee_name || '').toLowerCase().includes(query);
    const matchesOverdue = !showOverdueOnly || isOverdue(item);
    return matchesStatus && matchesPriority && matchesSearch && matchesOverdue;
  });

  // KPI Analytics
  const totalTasks = actionItems.length;
  const pendingTasks = actionItems.filter(i => i.status === 'Pending' || i.status === 'In Progress').length;
  const completedTasks = actionItems.filter(i => i.status === 'Completed').length;
  const overdueTasks = actionItems.filter(i => isOverdue(i)).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleStatusToggle = async (item, newStatus) => {
    await updateActionItemStatus(item.id, newStatus);
    if (refreshData) refreshData();
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this action item?")) {
      await deleteActionItem(itemId);
      if (refreshData) refreshData();
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      task_description: '',
      assignee_name: '',
      priority: 'High',
      due_date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      task_description: item.task_description || '',
      assignee_name: item.assignee_name || '',
      priority: item.priority || 'High',
      due_date: item.due_date || new Date().toISOString().split('T')[0],
      status: item.status || 'Pending'
    });
    setShowCreateModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.task_description.trim()) return;
    setIsSubmitting(true);

    try {
      if (editingItem) {
        await updateActionItem(editingItem.id, formData);
      } else {
        await createActionItem(formData);
      }
      setIsSubmitting(false);
      setShowCreateModal(false);
      if (refreshData) refreshData();
    } catch (err) {
      console.error("Action item save error:", err);
      setIsSubmitting(false);
    }
  };

  const statusColumns = ['Pending', 'In Progress', 'Completed', 'Archived'];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-sky-500" /> Action Item Tracker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated AI task extraction, owner assignment, deadline alerts, and productivity analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" /> Grid View
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" /> Kanban Board
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="ui-card p-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tasks</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalTasks}</div>
        </div>

        <div className="ui-card p-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Pending</span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{pendingTasks}</div>
        </div>

        <div className="ui-card p-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overdue Tasks</span>
          <div className={`text-2xl font-extrabold ${overdueTasks > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
            {overdueTasks}
          </div>
        </div>

        <div className="ui-card p-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion Rate</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{completionRate}%</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by task or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ui-input pl-9 pr-3.5 py-2 text-xs"
            />
          </div>

          <button
            onClick={() => setShowOverdueOnly(!showOverdueOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              showOverdueOnly
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Overdue Only ({overdueTasks})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="ui-input px-3 py-1.5 text-xs font-semibold"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {['All', 'Pending', 'In Progress', 'Completed'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === s 
                    ? 'bg-sky-500 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const itemIsOverdue = isOverdue(item);
              const priorityStr = String(item.priority || '').toLowerCase();
              return (
                <div
                  key={item.id}
                  className="ui-card p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 relative group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                          priorityStr === 'critical' || priorityStr === 'high'
                            ? 'badge-rose'
                            : priorityStr === 'medium'
                            ? 'badge-amber'
                            : 'badge-teal'
                        }`}>
                          {item.priority || 'Normal'} Priority
                        </span>

                        {itemIsOverdue && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Overdue
                          </span>
                        )}
                      </div>

                      {/* Card Edit & Delete Controls */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 rounded-md text-slate-400 hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit Task"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                      {item.task_description || item.task}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 font-medium">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        <span className="truncate">Owner: <strong className="text-slate-900 dark:text-slate-200">{item.assignee_name || item.assignee || 'Unassigned'}</strong></span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {item.due_date || 'No Date'}
                      </span>
                    </div>
                  </div>

                  {/* Status Toggle Pills */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Status:</span>
                    <div className="flex items-center gap-1">
                      {['Pending', 'In Progress', 'Completed'].map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusToggle(item, st)}
                          className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                            item.status === st
                              ? st === 'Completed'
                                ? 'badge-emerald'
                                : st === 'In Progress'
                                ? 'badge-teal'
                                : 'badge-amber'
                              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full ui-card p-12 text-center text-xs text-slate-500 dark:text-slate-400 italic space-y-2">
              <CheckSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
              <p>No action items match the active filters.</p>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: KANBAN TASK BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statusColumns.map((colStatus) => {
            const colItems = filteredItems.filter(i => (i.status || 'Pending') === colStatus);
            return (
              <div key={colStatus} className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      colStatus === 'Completed' ? 'bg-emerald-500' : colStatus === 'In Progress' ? 'bg-sky-500' : colStatus === 'Archived' ? 'bg-slate-400' : 'bg-amber-500'
                    }`} />
                    {colStatus}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {colItems.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {colItems.map((item) => (
                    <div key={item.id} className="ui-card p-4 space-y-2 text-xs hover:scale-[1.01] transition-all relative group">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          String(item.priority).toLowerCase() === 'high' ? 'badge-rose' : 'badge-amber'
                        }`}>
                          {item.priority || 'Normal'}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenEdit(item)} className="p-1 text-slate-400 hover:text-sky-500"><Edit2 className="w-3 h-3" /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-rose-600"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>

                      <p className="font-bold text-slate-900 dark:text-white">{item.task_description || item.task}</p>

                      <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-medium">
                        <span>{item.assignee_name || 'Unassigned'}</span>
                        <span>Due: {item.due_date || 'N/A'}</span>
                      </div>
                    </div>
                  ))}

                  {colItems.length === 0 && (
                    <div className="text-center p-6 text-[11px] text-slate-400 italic">
                      No {colStatus.toLowerCase()} tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT TASK MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 w-full max-w-lg space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-sky-500" />
                {editingItem ? 'Edit Action Item' : 'Create New Action Item'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Task Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Complete ChromaDB vector store schema definition."
                  value={formData.task_description}
                  onChange={(e) => setFormData({ ...formData, task_description: e.target.value })}
                  className="w-full ui-input px-3.5 py-2.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Assignee / Owner</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.assignee_name}
                    onChange={(e) => setFormData({ ...formData, assignee_name: e.target.value })}
                    className="w-full ui-input px-3.5 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Priority Level</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full ui-input px-3.5 py-2 text-xs font-semibold"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full ui-input px-3.5 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full ui-input px-3.5 py-2 text-xs font-semibold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="ui-btn-secondary px-4 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ui-btn-primary px-5 py-2 text-xs font-bold"
                >
                  {isSubmitting ? 'Saving Task...' : editingItem ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
