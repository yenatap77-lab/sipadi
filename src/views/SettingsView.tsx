/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings,
  Users,
  FileSpreadsheet,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  FolderTree,
  Sparkles,
  Check,
  Copy,
} from 'lucide-react';
import { GasConfig, UserAccount } from '../types';
import { CODE_GS_SOURCE } from '../utils/gasTemplate';
import { resetAllDataToDefault } from '../utils/storage';

interface SettingsViewProps {
  gasConfig: GasConfig;
  onOpenGasModal: () => void;
  onOpenUserManagement: () => void;
  users: UserAccount[];
  currentUser: UserAccount;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  gasConfig,
  onOpenGasModal,
  onOpenUserManagement,
  users,
  currentUser,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(CODE_GS_SOURCE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Gagal menyalin kode, silakan unduh berkas Code.gs.');
    }
  };

  const handleExportJSON = () => {
    const dataBackup = {
      timestamp: new Date().toISOString(),
      localStorageDump: { ...localStorage },
    };
    const blob = new Blob([JSON.stringify(dataBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIPADI_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="rounded-2xl glass-panel p-5 shadow-lg border-l-4 border-l-emerald-600">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
          <Settings className="h-4 w-4" />
          <span>Pengaturan Sistem & Konfigurasi Cloud</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Pengaturan Aplikasi SIPADI
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Integrasi Google Drive, Google Sheets Apps Script, manajemen pengguna dan cadangan data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Google Apps Script & Google Drive */}
        <div className="rounded-2xl glass-panel p-6 shadow-md border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Google Drive & Apps Script
                </h3>
                <p className="text-xs text-slate-500">
                  {gasConfig.webAppUrl ? 'Status: Terhubung' : 'Status: Local Database Aktif'}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenGasModal}
              className="rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 text-xs font-bold transition shadow-xs"
            >
              Kelola Integrasi
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Menghubungkan SIPADI ke Google Drive dan Google Sheets melalui Web App Apps Script (Code.gs).
            Dokumen arsip otomatis disimpan di folder Google Drive bidang masing-masing.
          </p>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-950 truncate max-w-[200px]">
              {gasConfig.webAppUrl || 'Belum diatur URL Web App'}
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Tersalin' : 'Salin Code.gs'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Manajemen Pengguna & Hak Akses */}
        <div className="rounded-2xl glass-panel p-6 shadow-md border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Sistem Akses & Multi-Role
                </h3>
                <p className="text-xs text-slate-500">{users.length} Akun Pengguna Terdaftar</p>
              </div>
            </div>

            <button
              onClick={onOpenUserManagement}
              className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 text-xs font-bold transition shadow-xs"
            >
              Kelola Pengguna
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Sistem login kustom untuk menambah role baru, operator bidang (TPH, PSP, Peternakan, Perkebunan), pejabat pengadaan barang jasa (PBJ), dan penyuluh lapangan.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">Pengguna Aktif:</span>
            <span className="font-bold text-slate-900">{currentUser.name} ({currentUser.role})</span>
          </div>
        </div>

        {/* Card 3: Cadangan Data & Ekspor */}
        <div className="rounded-2xl glass-panel p-6 shadow-md border border-slate-200 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Ekspor Cadangan Data (JSON)
              </h3>
              <p className="text-xs text-slate-500">Backup seluruh arsip dan inputan data lokal</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Unduh seluruh database arsip, pengadaan PBJ, dan proposal ke format file JSON cadangan untuk arsip offline.
          </p>

          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-white py-2.5 text-xs font-bold transition shadow-xs"
          >
            <Download className="h-4 w-4" />
            <span>Unduh Cadangan Database (JSON)</span>
          </button>
        </div>

        {/* Card 4: Pemulihan / Reset Data Standar */}
        <div className="rounded-2xl glass-panel p-6 shadow-md border border-slate-200 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Reset Data ke Contoh Standar
              </h3>
              <p className="text-xs text-slate-500">Kembalikan ke data awal dinas pertanian</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Menyetel ulang seluruh arsip, paket PBJ, dan proposal ke contoh bawaan awal SIPADI bila diperlukan untuk demo atau uji coba.
          </p>

          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin mengatur ulang data ke data awal?')) {
                resetAllDataToDefault();
              }
            }}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 py-2.5 text-xs font-bold transition"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset ke Data Awal</span>
          </button>
        </div>

      </div>

    </div>
  );
};
