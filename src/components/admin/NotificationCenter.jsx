// src/components/admin/NotificationCenter.jsx
import React from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';

export default function NotificationCenter({ notifications, onMarkAllRead, onClearAll, onNotificationClick, onClose }) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-x-3 top-20 z-[60] w-auto overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl font-sans md:absolute md:inset-x-auto md:right-8 md:top-16 md:w-96">
      <div className="flex items-center justify-between p-3.5 bg-zinc-950 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-red-500" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-200">Notifications Center</h3>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={onMarkAllRead} className="text-[11px] font-semibold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer">
              <Check size={12} /> Mark Read
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={onClearAll} className="text-[11px] font-semibold text-zinc-400 hover:text-red-400 flex items-center gap-1 cursor-pointer">
              <Trash2 size={12} /> Clear
            </button>
          )}
          <button onClick={onClose} className="rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-white" aria-label="Close notifications">
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/60">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-zinc-500 text-xs font-medium">
            No notifications yet.
          </div>
        ) : (
          notifications.map((noti) => (
            <div
              key={noti.id}
              onClick={() => onNotificationClick(noti)}
              className={`p-3.5 transition cursor-pointer hover:bg-zinc-800/50 flex flex-col gap-1 ${
                noti.read ? 'opacity-60 bg-zinc-900' : 'bg-zinc-900/90 border-l-4 border-red-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-500">{noti.title}</span>
                <span className="text-[10px] text-zinc-500">{noti.time}</span>
              </div>
              <p className="text-xs text-zinc-300 font-medium leading-relaxed">{noti.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
