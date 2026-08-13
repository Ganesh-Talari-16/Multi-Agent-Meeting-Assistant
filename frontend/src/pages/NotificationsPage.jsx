import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Clock, 
  Calendar,
  CheckSquare,
  BookOpen,
  ShieldAlert,
  Server,
  Video,
  Check,
  Trash2,
  Filter,
  ArrowRight,
  User,
  Sparkles,
  Layers,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { markNotificationRead, markAllNotificationsRead, deleteNotificationApi } from '../utils/api';

export default function NotificationsPage({ 
  notifications = [], 
  setNotifications, 
  setActiveTab, 
  setSelectedMeeting, 
  refreshNotifications 
}) {
  const [activeFilter, setActiveFilter] = useState('All'); // All, Unread, Tasks, Meetings, Decisions, System, Security

  // Analytics Metrics
  const totalNotifications = notifications.length;
  const unreadNotifications = notifications.filter(n => !n.is_read).length;
  const taskAlerts = notifications.filter(n => ['tasks', 'deadline', 'task'].includes(String(n.notification_type).toLowerCase())).length;
  const systemSecurityAlerts = notifications.filter(n => ['security', 'system', 'alert'].includes(String(n.notification_type).toLowerCase())).length;

  // Filtered Feed List
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Unread') return !notif.is_read;
      const typeStr = String(notif.notification_type || '').toLowerCase();
      if (activeFilter === 'Tasks') return ['tasks', 'deadline', 'task'].includes(typeStr);
      if (activeFilter === 'Meetings') return ['meetings', 'meeting'].includes(typeStr);
      if (activeFilter === 'Decisions') return ['decisions', 'decision'].includes(typeStr);
      if (activeFilter === 'System') return ['system', 'info'].includes(typeStr);
      if (activeFilter === 'Security') return ['security', 'alert'].includes(typeStr);
      return true;
    });
  }, [notifications, activeFilter]);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    if (setNotifications) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    }
    if (refreshNotifications) refreshNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    if (setNotifications) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
    if (refreshNotifications) refreshNotifications();
  };

  const handleDelete = async (id) => {
    await deleteNotificationApi(id);
    if (setNotifications) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
    if (refreshNotifications) refreshNotifications();
  };

  const handleNavigateRelated = (notif) => {
    const typeStr = String(notif.notification_type || '').toLowerCase();
    if (typeStr.includes('meeting')) {
      if (setActiveTab) setActiveTab('meetings');
    } else if (typeStr.includes('task') || typeStr.includes('deadline')) {
      if (setActiveTab) setActiveTab('action-items');
    } else if (typeStr.includes('decision')) {
      if (setActiveTab) setActiveTab('decisions');
    } else {
      if (setActiveTab) setActiveTab('dashboard');
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'Just now';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  // Activity Timeline Events
  const activityTimeline = [
    { id: 'act-1', user: 'Sarah Jenkins', action: 'Completed Action Item', target: 'ChromaDB vector store schema setup', time: '10m ago', type: 'task' },
    { id: 'act-2', user: 'AI Pipeline', action: 'Processed Meeting', target: 'Q3 Product & Architecture Sync', time: '1h ago', type: 'meeting' },
    { id: 'act-3', user: 'David Miller', action: 'Recorded Decision', target: 'Adopt OAuth2 JWT with RBAC scopes', time: '2h ago', type: 'decision' },
    { id: 'act-4', user: 'Alex Chen', action: 'Uploaded Knowledge Doc', target: 'Enterprise Security Policy (SOP-042)', time: '4h ago', type: 'system' }
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-sky-500" /> Notifications & Activity Stream
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time alert center, task deadline warnings, system security events, and audit activity feeds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadNotifications > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              <Check className="w-4 h-4" /> Mark All as Read
            </button>
          )}

          <button
            onClick={() => refreshNotifications && refreshNotifications()}
            className="ui-btn-secondary flex items-center gap-2 text-xs font-bold px-4 py-2.5"
            title="Refresh Notifications"
          >
            <RefreshCw className="w-4 h-4 text-sky-600 dark:text-sky-400" /> Refresh Stream
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="ui-card p-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Alerts</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalNotifications}</div>
        </div>

        <div className="ui-card p-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unread Alerts</span>
          <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">{unreadNotifications}</div>
        </div>

        <div className="ui-card p-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Task & Overdue</span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{taskAlerts}</div>
        </div>

        <div className="ui-card p-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System & Security</span>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">{systemSecurityAlerts}</div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {['All', 'Unread', 'Tasks', 'Meetings', 'Decisions', 'System', 'Security'].map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                isActive
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              {cat} {cat === 'Unread' && unreadNotifications > 0 ? `(${unreadNotifications})` : ''}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Notification Cards Stream + Activity Timeline Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Notification Feed List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => {
              const typeStr = String(notif.notification_type || '').toLowerCase();
              const isTask = ['tasks', 'deadline', 'task'].includes(typeStr);
              const isMeeting = ['meetings', 'meeting'].includes(typeStr);
              const isDecision = ['decisions', 'decision'].includes(typeStr);
              const isSecurity = ['security', 'alert'].includes(typeStr);

              return (
                <div
                  key={notif.id}
                  className={`ui-card p-5 transition-all flex items-start justify-between gap-4 relative group ${
                    !notif.is_read ? 'border-sky-500/30 bg-sky-500/5 dark:bg-sky-500/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Category Icon Badge */}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isSecurity
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                        : isTask
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        : isMeeting
                        ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                    }`}>
                      {isSecurity ? <ShieldAlert className="w-5 h-5" /> : isTask ? <CheckSquare className="w-5 h-5" /> : isMeeting ? <Video className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{notif.title}</h4>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping shrink-0" title="Unread Alert" />
                        )}
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {formatTimestamp(notif.created_at)}
                        </span>

                        <button
                          onClick={() => handleNavigateRelated(notif)}
                          className="text-sky-600 dark:text-sky-400 font-bold hover:underline flex items-center gap-1"
                        >
                          View Entity <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Badge */}
                  <div className="flex flex-col items-end justify-between gap-3 shrink-0">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                      isSecurity ? 'badge-rose' : isTask ? 'badge-amber' : isMeeting ? 'badge-teal' : 'badge-emerald'
                    }`}>
                      {notif.notification_type || 'Alert'}
                    </span>

                    <div className="flex items-center gap-1">
                      {!notif.is_read && (
                        <button
                          onClick={() => handleMarkRead(notif.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Mark as Read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="ui-card p-12 text-center text-xs text-slate-500 dark:text-slate-400 italic space-y-2">
              <Bell className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
              <p>No notifications match the active filter criteria.</p>
            </div>
          )}
        </div>

        {/* Right Column: Activity Timeline Side Panel */}
        <div className="space-y-4">
          <div className="ui-card p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-500" /> Platform Activity Timeline
            </h4>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {activityTimeline.map((item) => (
                <div key={item.id} className="relative pl-7 space-y-1">
                  <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-sky-500 ring-4 ring-white dark:ring-slate-900" />
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="font-bold text-slate-900 dark:text-slate-200">{item.user}</span>
                    <span>{item.time}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.action}: <strong className="text-slate-900 dark:text-white">{item.target}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
