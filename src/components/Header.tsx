/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  CloudCheck,
  CloudAlert,
  Bell,
  User,
  ShieldCheck,
  Download,
  Menu,
  ChevronDown,
  Sparkles,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { UserAccount, AppNotification, GasConfig } from '../types';
import { usePWAInstall } from '../utils/usePWAInstall';

interface HeaderProps {
  currentUser: UserAccount;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenUserModal: () => void;
  onOpenGasModal: () => void;
  onOpenProfileModal: () => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
  gasConfig: GasConfig;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  notifications,
  onOpenNotifications,
  onOpenUserModal,
  onOpenGasModal,
  onOpenProfileModal,
  onLogout,
  onToggleSidebar,
  gasConfig,
}) => {
  const [timeState, setTimeState] = useState({
    day: '',
    date: '',
    time: '',
  });

  const { isInstallable, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const day = days[now.getDay()];
      
      const date = now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const time = `${hours}:${minutes}:${seconds} WIB`;

      setTimeState({ day, date, time });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2c6e49]/40 bg-gradient-to-r from-[#143820]/95 via-[#1a472a]/95 to-[#245837]/95 backdrop-blur-md text-white shadow-lg">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        
        {/* Left: Mobile Sidebar Trigger & App Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-yellow-300 hover:bg-white/10 lg:hidden focus:outline-none"
            title="Buka Menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md ring-2 ring-yellow-300/40">
              <span className="text-xl">🌾</span>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-lg">SIPADI</span>
                <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-300/30">
                  DIGITAL v2.6
                </span>
              </div>
              <p className="text-[11px] font-medium text-emerald-200/90 leading-tight">
                Sistem Informasi Pertanian & Administrasi Digital
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Real-Time Date & Clock (Hari, Tanggal, Jam) */}
        <div className="hidden md:flex items-center gap-3 rounded-full bg-black/25 px-4 py-1.5 border border-white/10 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs text-emerald-200">
            <Calendar className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-semibold text-white">{timeState.day},</span>
            <span>{timeState.date}</span>
          </div>
          <span className="text-emerald-400/50">|</span>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
            <Clock className="h-3.5 w-3.5 animate-pulse text-amber-400" />
            <span>{timeState.time}</span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* PWA In-App Install Button */}
          {isInstallable && (
            <button
              onClick={install}
              className="hidden sm:flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-2.5 py-1.5 text-xs font-bold text-slate-900 shadow-sm transition transform active:scale-95"
              title="Pasang aplikasi SIPADI di perangkat"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Install App</span>
            </button>
          )}

          {isIOS && (
            <button
              onClick={() => setShowIOSModal(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 px-2.5 py-1.5 text-xs font-bold text-amber-200 transition"
              title="Panduan install di iPhone/iPad"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Install iOS</span>
            </button>
          )}

          {/* Google Drive & Spreadsheet Sync Status Button */}
          <button
            onClick={onOpenGasModal}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition ${
              gasConfig.webAppUrl
                ? 'bg-emerald-900/40 border-emerald-400/40 text-emerald-200 hover:bg-emerald-900/60'
                : 'bg-amber-900/30 border-amber-400/40 text-amber-200 hover:bg-amber-900/50'
            }`}
            title="Kelola Integrasi Google Drive & Apps Script Spreadsheet"
          >
            {gasConfig.webAppUrl ? (
              <CloudCheck className="h-4 w-4 text-emerald-400" />
            ) : (
              <CloudAlert className="h-4 w-4 text-amber-400" />
            )}
            <span className="hidden lg:inline">
              {gasConfig.webAppUrl ? 'Drive: Terhubung' : 'Integrasi Drive'}
            </span>
          </button>

          {/* Real-time Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative rounded-lg p-2 text-emerald-100 hover:bg-white/10 transition"
            title="Pemberitahuan Arsip & Sistem"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#143820]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Account / Role Badge */}
          <div className="flex items-center border-l border-emerald-700/50 pl-2 sm:pl-3">
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-2 sm:px-3 py-1.5 text-left border border-white/15 transition"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 font-bold text-xs shadow-inner">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden xl:block">
                <p className="text-xs font-semibold text-white leading-none line-clamp-1">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-amber-300" />
                  <span className="text-[10px] text-amber-200 font-medium line-clamp-1">
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-emerald-200" />
            </button>

            {/* Tombol Keluar / Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/70 border border-rose-400/30 text-rose-200 hover:text-white px-2.5 sm:px-3 py-1.5 text-xs font-bold transition ml-1.5 sm:ml-2 shadow-sm cursor-pointer"
              title="Keluar dari Aplikasi (Logout)"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-400" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Realtime Clock Bar */}
      <div className="flex md:hidden items-center justify-between px-3 py-1 bg-black/30 text-[11px] border-t border-white/5">
        <div className="flex items-center gap-1 text-emerald-200">
          <Calendar className="h-3 w-3 text-amber-400" />
          <span>{timeState.day}, {timeState.date}</span>
        </div>
        <div className="flex items-center gap-1 font-mono font-bold text-amber-300">
          <Clock className="h-3 w-3 text-amber-400" />
          <span>{timeState.time}</span>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                <Download className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Pasang di iPhone / iPad</h3>
                <p className="text-xs text-slate-500">Akses cepat SIPADI di Home Screen</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <p>1. Ketuk ikon <strong>Share</strong> (kotak panah ke atas) pada bilah Safari.</p>
              <p>2. Gulir ke bawah lalu pilih <strong>Tambahkan ke Layar Utama</strong> (Add to Home Screen).</p>
              <p>3. Ketuk <strong>Tambah</strong> di pojok kanan atas.</p>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 py-2.5 text-xs font-bold text-white transition"
            >
              Mengerti & Tutup
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
