/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  FolderArchive,
  FileText,
  FilePlus2,
  ShoppingCart,
  Wheat,
  Tractor,
  Beef,
  Trees,
  ScrollText,
  Settings,
  UserCheck,
  ChevronRight,
  Sparkles,
  Layers,
  MapPin,
  LogOut,
} from 'lucide-react';
import { BidangType } from '../types';
import { BIDANG_CONFIG } from '../utils/formatters';

export type NavTab =
  | 'dashboard'
  | 'arsip-semua'
  | 'arsip-perencanaan'
  | 'arsip-tph'
  | 'arsip-psp'
  | 'arsip-peternakan'
  | 'arsip-perkebunan'
  | 'arsip-pbj'
  | 'input-pbj-langsung'
  | 'input-pbj-epurchasing'
  | 'input-teknis-tph'
  | 'input-teknis-peternakan'
  | 'input-teknis-perkebunan'
  | 'input-teknis-psp'
  | 'input-proposal'
  | 'pengaturan'
  | 'profil';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  archiveCounts: Record<BidangType, number>;
  proposalCount: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  archiveCounts,
  proposalCount,
  onLogout,
}) => {
  const handleItemClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel with Yellowish Olive Green Gradient */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 flex-col overflow-y-auto border-r border-[#2c6e49]/40 bg-gradient-to-b from-[#143820] via-[#1a472a] to-[#254d30] text-emerald-100 transition-transform duration-300 lg:static lg:flex lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">

          {/* Samping Dasbor Identitas Hijau Kekuningan */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-800/60 to-yellow-950/40 p-3.5 border border-yellow-400/25 shadow-md">
            <div className="flex items-center gap-2 text-yellow-300 mb-1">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold tracking-wide uppercase">Menu Navigasi Digital</span>
            </div>
            <p className="text-[11px] text-emerald-200/80 leading-relaxed">
              Pusat kearsipan pertanian, pengadaan barang jasa & proposal masyarakat.
            </p>
          </div>

          {/* 1. DASHBOARD UTAMA */}
          <div>
            <button
              onClick={() => handleItemClick('dashboard')}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                currentTab === 'dashboard'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-md ring-1 ring-yellow-300'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard Utama</span>
              </div>
              {currentTab === 'dashboard' && <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* 2. DATA ARSIP BIDANG (Warna Pembeda Per Arsip) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 text-[10px] font-extrabold uppercase tracking-wider text-yellow-300/80">
              <div className="flex items-center gap-1.5">
                <FolderArchive className="h-3.5 w-3.5" />
                <span>Data Arsip Dokumen</span>
              </div>
              <button
                onClick={() => handleItemClick('arsip-semua')}
                className="hover:underline text-[9px] text-amber-300"
              >
                Semua
              </button>
            </div>

            {/* Arsip Perencanaan */}
            <button
              onClick={() => handleItemClick('arsip-perencanaan')}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentTab === 'arsip-perencanaan'
                  ? 'bg-indigo-600/90 text-white font-bold shadow ring-1 ring-indigo-400'
                  : 'text-indigo-100 hover:bg-indigo-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-indigo-400" />
                <span>Arsip Perencanaan</span>
              </div>
              <span className="rounded-full bg-indigo-900/60 px-2 py-0.5 text-[10px] text-indigo-200 border border-indigo-400/30">
                {archiveCounts.perencanaan || 0}
              </span>
            </button>

            {/* Arsip TPH */}
            <button
              onClick={() => handleItemClick('arsip-tph')}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentTab === 'arsip-tph'
                  ? 'bg-emerald-600/90 text-white font-bold shadow ring-1 ring-emerald-300'
                  : 'text-emerald-100 hover:bg-emerald-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Arsip TPH</span>
              </div>
              <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] text-emerald-200 border border-emerald-400/30">
                {archiveCounts.tph || 0}
              </span>
            </button>

            {/* Arsip PSP */}
            <button
              onClick={() => handleItemClick('arsip-psp')}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentTab === 'arsip-psp'
                  ? 'bg-amber-600/90 text-white font-bold shadow ring-1 ring-amber-300'
                  : 'text-amber-100 hover:bg-amber-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Arsip PSP</span>
              </div>
              <span className="rounded-full bg-amber-900/60 px-2 py-0.5 text-[10px] text-amber-200 border border-amber-400/30">
                {archiveCounts.psp || 0}
              </span>
            </button>

            {/* Arsip Peternakan */}
            <button
              onClick={() => handleItemClick('arsip-peternakan')}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentTab === 'arsip-peternakan'
                  ? 'bg-rose-700/90 text-white font-bold shadow ring-1 ring-rose-400'
                  : 'text-rose-100 hover:bg-rose-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span>Arsip Peternakan</span>
              </div>
              <span className="rounded-full bg-rose-900/60 px-2 py-0.5 text-[10px] text-rose-200 border border-rose-400/30">
                {archiveCounts.peternakan || 0}
              </span>
            </button>

            {/* Arsip Perkebunan */}
            <button
              onClick={() => handleItemClick('arsip-perkebunan')}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentTab === 'arsip-perkebunan'
                  ? 'bg-teal-700/90 text-white font-bold shadow ring-1 ring-teal-400'
                  : 'text-teal-100 hover:bg-teal-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-teal-400" />
                <span>Arsip Perkebunan</span>
              </div>
              <span className="rounded-full bg-teal-900/60 px-2 py-0.5 text-[10px] text-teal-200 border border-teal-400/30">
                {archiveCounts.perkebunan || 0}
              </span>
            </button>

            {/* Arsip PBJ */}
            <button
              onClick={() => handleItemClick('arsip-pbj')}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentTab === 'arsip-pbj'
                  ? 'bg-cyan-700/90 text-white font-bold shadow ring-1 ring-cyan-400'
                  : 'text-cyan-100 hover:bg-cyan-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span>Arsip PBJ (PL & E-Katalog)</span>
              </div>
              <span className="rounded-full bg-cyan-900/60 px-2 py-0.5 text-[10px] text-cyan-200 border border-cyan-400/30">
                {archiveCounts.pbj || 0}
              </span>
            </button>
          </div>

          {/* 3. INPUT DATA PENGADAAN (PBJ) */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2 text-[10px] font-extrabold uppercase tracking-wider text-yellow-300/80">
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Input Pengadaan PBJ</span>
            </div>

            <button
              onClick={() => handleItemClick('input-pbj-langsung')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentTab === 'input-pbj-langsung'
                  ? 'bg-amber-400 text-slate-900 font-bold shadow'
                  : 'hover:bg-white/10 text-emerald-100'
              }`}
            >
              <FilePlus2 className="h-3.5 w-3.5 text-amber-300" />
              <span>Pengadaan Langsung (PL)</span>
            </button>

            <button
              onClick={() => handleItemClick('input-pbj-epurchasing')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentTab === 'input-pbj-epurchasing'
                  ? 'bg-amber-400 text-slate-900 font-bold shadow'
                  : 'hover:bg-white/10 text-emerald-100'
              }`}
            >
              <ShoppingCart className="h-3.5 w-3.5 text-amber-300" />
              <span>E-Purchasing (Katalog)</span>
            </button>
          </div>

          {/* 4. INPUT DATA TEKNIS PER BIDANG */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2 text-[10px] font-extrabold uppercase tracking-wider text-yellow-300/80">
              <Layers className="h-3.5 w-3.5" />
              <span>Data Teknis Pertanian</span>
            </div>

            <button
              onClick={() => handleItemClick('input-teknis-tph')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentTab === 'input-teknis-tph'
                  ? 'bg-emerald-500 text-slate-900 font-bold shadow'
                  : 'hover:bg-white/10 text-emerald-100'
              }`}
            >
              <Wheat className="h-3.5 w-3.5 text-emerald-300" />
              <span>TPH: LTT & Poktan</span>
            </button>

            <button
              onClick={() => handleItemClick('input-teknis-peternakan')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentTab === 'input-teknis-peternakan'
                  ? 'bg-rose-500 text-white font-bold shadow'
                  : 'hover:bg-white/10 text-emerald-100'
              }`}
            >
              <Beef className="h-3.5 w-3.5 text-rose-300" />
              <span>Peternakan: Populasi</span>
            </button>

            <button
              onClick={() => handleItemClick('input-teknis-perkebunan')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentTab === 'input-teknis-perkebunan'
                  ? 'bg-teal-500 text-white font-bold shadow'
                  : 'hover:bg-white/10 text-emerald-100'
              }`}
            >
              <Trees className="h-3.5 w-3.5 text-teal-300" />
              <span>Perkebunan: Komoditi</span>
            </button>

            <button
              onClick={() => handleItemClick('input-teknis-psp')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentTab === 'input-teknis-psp'
                  ? 'bg-amber-500 text-slate-900 font-bold shadow'
                  : 'hover:bg-white/10 text-emerald-100'
              }`}
            >
              <Tractor className="h-3.5 w-3.5 text-amber-300" />
              <span>PSP: Alsintan, Irigasi & JUT</span>
            </button>
          </div>

          {/* 5. PROPOSAL KELOMPOK TANI & INTEGRASI PBJ */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2 text-[10px] font-extrabold uppercase tracking-wider text-yellow-300/80">
              <ScrollText className="h-3.5 w-3.5" />
              <span>Proposal Kelompok Tani</span>
            </div>

            <button
              onClick={() => handleItemClick('input-proposal')}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentTab === 'input-proposal'
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-bold shadow ring-1 ring-yellow-200'
                  : 'hover:bg-white/10 text-emerald-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-amber-300" />
                <span>Proposal & Titik Peta</span>
              </div>
              <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] text-yellow-200">
                {proposalCount}
              </span>
            </button>
          </div>

          {/* 6. PENGATURAN & AKUN */}
          <div className="pt-2 border-t border-emerald-700/40 space-y-1">
            <button
              onClick={() => handleItemClick('pengaturan')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentTab === 'pengaturan'
                  ? 'bg-white/20 text-white font-bold'
                  : 'hover:bg-white/10 text-emerald-200'
              }`}
            >
              <Settings className="h-4 w-4 text-emerald-300" />
              <span>Pengaturan & Google Drive</span>
            </button>

            <button
              onClick={() => handleItemClick('profil')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentTab === 'profil'
                  ? 'bg-white/20 text-white font-bold'
                  : 'hover:bg-white/10 text-emerald-200'
              }`}
            >
              <UserCheck className="h-4 w-4 text-emerald-300" />
              <span>Profil Akun & Hak Akses</span>
            </button>

            {onLogout && (
              <button
                onClick={() => {
                  onCloseMobile();
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-900/40 hover:text-rose-100 transition mt-1 border border-rose-500/20"
                title="Keluar dari Aplikasi (Logout)"
              >
                <LogOut className="h-4 w-4 text-rose-400" />
                <span>Keluar Aplikasi</span>
              </button>
            )}
          </div>

        </div>
      </aside>
    </>
  );
};
