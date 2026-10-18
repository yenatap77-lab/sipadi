/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Bell,
  CheckCheck,
  FolderArchive,
  ScrollText,
  ShoppingCart,
  Wheat,
  Sparkles,
} from 'lucide-react';
import { AppNotification } from '../types';
import { formatDateTimeIndo } from '../utils/formatters';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification?: (notif: AppNotification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'archive':
        return <FolderArchive className="h-4 w-4 text-emerald-600" />;
      case 'proposal':
        return <ScrollText className="h-4 w-4 text-amber-600" />;
      case 'pbj':
        return <ShoppingCart className="h-4 w-4 text-cyan-600" />;
      case 'teknis':
        return <Wheat className="h-4 w-4 text-emerald-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 p-0 sm:p-4 backdrop-blur-sm">
      <div className="h-full sm:h-[90vh] w-full max-w-md flex flex-col rounded-none sm:rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-900 px-5 py-4 text-white">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-400" />
            <h3 className="font-bold text-sm sm:text-base">Pemberitahuan Sistem & Arsip</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-emerald-200 hover:text-white underline flex items-center gap-1"
              title="Tandai semua dibaca"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Tandai Dibaca</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">
              <Bell className="h-8 w-8 mb-2 stroke-1" />
              <p className="text-xs">Belum ada notifikasi baru.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (onSelectNotification) onSelectNotification(n);
                }}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  n.read
                    ? 'bg-slate-50/70 border-slate-200 text-slate-600'
                    : 'bg-emerald-50/80 border-emerald-300 text-slate-900 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs line-clamp-1">{n.title}</h4>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-2">
                      {formatDateTimeIndo(n.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
