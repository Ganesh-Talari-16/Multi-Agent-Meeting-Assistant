import React from 'react';
import { Bell, AlertCircle, Info, CheckCircle2, Clock, Calendar } from 'lucide-react';

export default function NotificationsPage({ notifications = [] }) {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications & Activity Feed</h2>
        <p className="text-xs text-gray-500 mt-1">
          Notification Agent alert streams, task deadline reminders, and system notifications.
        </p>
      </div>

      {/* Notifications Feed List */}
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`ui-card p-5 transition-all flex items-start justify-between gap-4 ${
              notif.notification_type === 'deadline'
                ? 'border-rose-200 bg-rose-50/20'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                notif.notification_type === 'deadline'
                  ? 'bg-rose-50 text-rose-600 border-rose-100'
                  : 'bg-navy-50 text-navy-900 border-navy-100'
              }`}>
                {notif.notification_type === 'deadline' ? <AlertCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900">{notif.title}</h4>
                  {!notif.is_read && (
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  )}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {notif.message}
                </p>
                <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5 pt-1">
                  <Clock className="w-3 h-3" /> {notif.created_at?.slice(0, 16) || '2026-08-12 09:50'}
                </div>
              </div>
            </div>

            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
              notif.notification_type === 'deadline' ? 'badge-rose' : 'badge-navy'
            }`}>
              {notif.notification_type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
