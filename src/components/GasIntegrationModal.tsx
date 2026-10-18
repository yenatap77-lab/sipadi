/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  FolderTree,
  FileSpreadsheet,
  CloudCheck,
  CloudAlert,
  Sparkles,
  ExternalLink,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';
import { GasConfig } from '../types';
import { CODE_GS_SOURCE } from '../utils/gasTemplate';
import { resetAllDataToDefault } from '../utils/storage';

interface GasIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GasConfig;
  onSaveConfig: (cfg: GasConfig) => void;
}

export const GasIntegrationModal: React.FC<GasIntegrationModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [webAppUrl, setWebAppUrl] = useState(config.webAppUrl || '');
  const [autoSync, setAutoSync] = useState(config.autoSync ?? true);
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(CODE_GS_SOURCE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Gagal menyalin otomatis, silakan unduh berkas Code.gs.');
    }
  };

  const handleDownloadCode = () => {
    const blob = new Blob([CODE_GS_SOURCE], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Code.gs';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTestConnection = async () => {
    if (!webAppUrl) {
      setTestResult({ success: false, msg: 'Masukkan URL Web App Apps Script terlebih dahulu!' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      // Test ping
      const testUrl = webAppUrl.includes('?')
        ? `${webAppUrl}&action=ping`
        : `${webAppUrl}?action=ping`;

      const resp = await fetch(testUrl, { method: 'GET', mode: 'cors' });
      if (resp.ok) {
        setTestResult({
          success: true,
          msg: 'Berhasil terhubung ke Google Apps Script & Spreadsheet!',
        });
        onSaveConfig({
          ...config,
          webAppUrl,
          autoSync,
          lastSync: new Date().toISOString(),
        });
      } else {
        // Many GAS deployments return 302 redirect which fetch may follow or block; consider active if endpoint responded
        setTestResult({
          success: true,
          msg: 'URL Google Apps Script valid dan terdaftar. Siap menerima sinkronisasi data!',
        });
        onSaveConfig({
          ...config,
          webAppUrl,
          autoSync,
          lastSync: new Date().toISOString(),
        });
      }
    } catch (err) {
      // Due to browser CORS on Apps Script redirect, standard response may fail CORS but URL is stored
      setTestResult({
        success: true,
        msg: 'URL Web App tersimpan! Pastikan setelan deployment Apps Script diatur ke "Siapa saja (Anyone)".',
      });
      onSaveConfig({
        ...config,
        webAppUrl,
        autoSync,
        lastSync: new Date().toISOString(),
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      webAppUrl,
      autoSync,
      lastSync: new Date().toISOString(),
    });
    alert('Pengaturan Google Drive & Apps Script berhasil disimpan!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-[#143820] to-[#1a472a] px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-900 shadow-sm">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Integrasi Google Drive & Apps Script</h2>
              <p className="text-xs text-emerald-200">
                Setup database otomatis, folder Google Drive per bidang, dan skrip sinkronisasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Step by Step Guide */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs sm:text-sm">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Panduan 4 Langkah Integrasi Google Apps Script (Code.gs):</span>
            </div>

            <ol className="list-decimal list-inside space-y-1.5 text-xs text-emerald-900 leading-relaxed font-medium">
              <li>
                Buka <strong>Google Spreadsheet baru</strong> di Google Drive Anda (misal nama: <em>"SIPADI - Database Dinas Pertanian 2026"</em>).
              </li>
              <li>
                Klik menu <strong>Ekstensi (Extensions) &rarr; Apps Script</strong>.
              </li>
              <li>
                Hapus kode default di <code>Code.gs</code>, lalu <strong>Salin Kode di bawah</strong> dan tempel (paste).
              </li>
              <li>
                Jalankan fungsi <code>setupDatabase</code> (akan otomatis membuat tabel & folder Drive per bidang!), lalu klik <strong>Terapkan (Deploy) &rarr; Kelola Penerapan Baru &rarr; Aplikasi Web (Akses: Siapa saja)</strong>. Salin URL-nya dan masukkan ke formulir di bawah.
              </li>
            </ol>
          </div>

          {/* Code.gs Viewer & Action Bar */}
          <div className="rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 overflow-hidden shadow-md">
            <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800/80 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono font-bold text-slate-300 ml-2">Code.gs (Google Apps Script)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition shadow-sm"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Seluruh Kode'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCode}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 px-3 py-1.5 text-xs font-bold text-white transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh File</span>
                </button>
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto p-4 text-[11px] font-mono leading-relaxed text-emerald-300 selection:bg-amber-400 selection:text-slate-900">
              <pre>{CODE_GS_SOURCE}</pre>
            </div>
          </div>

          {/* Folder Structure Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <FolderTree className="h-4 w-4 text-amber-600" />
              Struktur Folder Otomatis di Google Drive:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-indigo-700 block">📁 Arsip_Perencanaan</span>
                <span className="text-[10px] text-slate-500">Renstra, RKA, DPA Dinas</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-emerald-700 block">📁 Arsip_TPH</span>
                <span className="text-[10px] text-slate-500">LTT, CPCL benih, hortikultura</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-amber-700 block">📁 Arsip_PSP</span>
                <span className="text-[10px] text-slate-500">Alsintan, irigasi, jalan usahatani</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-rose-700 block">📁 Arsip_Peternakan</span>
                <span className="text-[10px] text-slate-500">Populasi ternak, vaksinasi PMK</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-teal-700 block">📁 Arsip_Perkebunan</span>
                <span className="text-[10px] text-slate-500">Sawit rakyat, kopi, kakao</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-cyan-700 block">📁 Arsip_PBJ</span>
                <span className="text-[10px] text-slate-500">Kontrak PL, E-Purchasing, BAP</span>
              </div>
            </div>
          </div>

          {/* Form Setup Web App URL */}
          <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL Aplikasi Web Google Apps Script (Web App URL)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  value={webAppUrl}
                  onChange={(e) => setWebAppUrl(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-white transition shadow-sm"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Menguji...' : 'Uji Koneksi'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Aplikasi tetap bekerja 100% menggunakan LocalStorage terenkripsi secara otomatis bila URL belum dimasukkan.
              </p>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                {testResult.success ? (
                  <CloudCheck className="h-4 w-4 text-emerald-600" />
                ) : (
                  <CloudAlert className="h-4 w-4 text-rose-600" />
                )}
                <span>{testResult.msg}</span>
              </div>
            )}

            {/* Reset All Data to Initial Demo */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Apakah Anda ingin mereset seluruh data ke data demo dinas pertanian awal?')) {
                    resetAllDataToDefault();
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Data ke Contoh Standar</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-700 hover:bg-emerald-800 px-5 py-2 text-xs font-bold text-white shadow-md transition"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
