/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  Plus,
  FileText,
  Download,
  Edit3,
  Trash2,
  Eye,
  Filter,
  Calendar,
  Folder,
  List,
  LayoutGrid,
  QrCode,
} from 'lucide-react';
import { ArsipItem, BidangType } from '../types';
import { BIDANG_CONFIG, formatDateIndo } from '../utils/formatters';

interface ArsipListViewProps {
  archives: ArsipItem[];
  selectedBidangFilter?: BidangType | 'semua';
  onSelectBidangFilter: (bidang: BidangType | 'semua') => void;
  onOpenNewArsipModal: (bidang?: BidangType) => void;
  onViewArchive: (item: ArsipItem) => void;
  onEditArchive?: (item: ArsipItem) => void;
  onDeleteArchive: (id: string) => void;
}

export const ArsipListView: React.FC<ArsipListViewProps> = ({
  archives,
  selectedBidangFilter = 'semua',
  onSelectBidangFilter,
  onOpenNewArsipModal,
  onViewArchive,
  onEditArchive,
  onDeleteArchive,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const handleDownloadArchive = (item: ArsipItem) => {
    if (item.fileDataUrl) {
      const a = document.createElement('a');
      a.href = item.fileDataUrl;
      a.download = item.fileName || `${item.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const meta = BIDANG_CONFIG[item.bidang];
      const content = `========================================================\nDINAS PERTANIAN DAN KETAHANAN PANGAN\nARSIP RESMI SIPADI DIGITAL\n========================================================\n\nJUDUL ARSIP     : ${item.title}\nNOMOR SURAT     : ${item.nomorSurat}\nTANGGAL SURAT   : ${formatDateIndo(item.tanggalSurat)}\nBIDANG DINAS    : ${meta.label}\nSUB-KATEGORI    : ${item.subKategori}\nFOLDER DRIVE    : ${item.driveFolder}\nNAMA BERKAS     : ${item.fileName}\nUKURAN BERKAS   : ${item.fileSize}\nPENGUNGGAH      : ${item.uploaderName} (${item.uploaderRole})\nWAKTU UPLOAD    : ${formatDateIndo(item.createdAt)}\n\nURAIAN DOKUMEN:\n${item.uraian || '-'}\n\n========================================================\nDokumen resmi dinas tersimpan aman di Google Drive SIPADI.\n========================================================\n`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.fileName || 'Arsip_SIPADI'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleExportAllArchives = () => {
    if (filteredArchives.length === 0) return;
    const header = ['No', 'Tanggal Surat', 'Bidang', 'Judul Arsip', 'Nomor Surat', 'Sub Kategori', 'Folder Drive', 'Uraian', 'Pengunggah', 'Ukuran Berkas'];
    const rows = filteredArchives.map((a, idx) => [
      idx + 1,
      a.tanggalSurat,
      BIDANG_CONFIG[a.bidang].label,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.nomorSurat.replace(/"/g, '""')}"`,
      `"${a.subKategori.replace(/"/g, '""')}"`,
      `"${a.driveFolder.replace(/"/g, '""')}"`,
      `"${(a.uraian || '').replace(/"/g, '""')}"`,
      `"${a.uploaderName}"`,
      a.fileSize,
    ]);
    const csvContent = '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Arsip_SIPADI_${selectedBidangFilter}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredArchives = archives.filter((item) => {
    const matchBidang = selectedBidangFilter === 'semua' || item.bidang === selectedBidangFilter;
    const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subKategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.uraian.toLowerCase().includes(searchTerm.toLowerCase());
    return matchBidang && matchSearch;
  });

  const bidangTabs: Array<{ key: BidangType | 'semua'; label: string }> = [
    { key: 'semua', label: 'Semua Arsip' },
    { key: 'perencanaan', label: 'Perencanaan' },
    { key: 'tph', label: 'TPH' },
    { key: 'psp', label: 'PSP' },
    { key: 'peternakan', label: 'Peternakan' },
    { key: 'perkebunan', label: 'Perkebunan' },
    { key: 'pbj', label: 'PBJ' },
  ];

  const currentBidangMeta = selectedBidangFilter !== 'semua' ? BIDANG_CONFIG[selectedBidangFilter] : null;

  return (
    <div className="space-y-4">
      
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl glass-panel p-4 sm:p-5 shadow-lg border-l-4 border-l-emerald-600">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
            <FolderArchive className="h-4 w-4" />
            <span>Manajemen Kearsipan Digital</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {currentBidangMeta ? currentBidangMeta.label : 'Seluruh Arsip Dokumen Digital'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar arsip memanjang ramping, memudahkan penelusuran dokumen per bidang dinas.
          </p>
        </div>

        {/* Tombol Aksi Header: Unduh Rekap & Input Arsip */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportAllArchives}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2.5 text-xs font-bold text-emerald-800 shadow-2xs transition shrink-0 cursor-pointer"
            title="Unduh seluruh rekap arsip ke format file CSV"
          >
            <Download className="h-4 w-4" />
            <span>Unduh Rekap (.CSV)</span>
          </button>

          <button
            onClick={() => onOpenNewArsipModal(selectedBidangFilter !== 'semua' ? selectedBidangFilter : undefined)}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-4 py-2.5 text-xs font-bold text-white shadow-md transition shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Input Arsip {currentBidangMeta ? currentBidangMeta.shortLabel : 'Baru'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Filter by Bidang */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200">
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
          {bidangTabs.map((tab) => {
            const isSelected = selectedBidangFilter === tab.key;
            const count = tab.key === 'semua'
              ? archives.length
              : archives.filter((a) => a.bidang === tab.key).length;

            return (
              <button
                key={tab.key}
                onClick={() => onSelectBidangFilter(tab.key)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher: Tabel Ramping vs Kartu */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Tampilan Kolom Memanjang Ramping"
          >
            <List className="h-3.5 w-3.5" />
            <span>Tabel Ramping</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Tampilan Kartu Grid"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Kartu</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan judul arsip, nomor surat, kata kunci..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white/90 pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 shadow-xs"
        />
      </div>

      {/* Archives Card / Table Grid */}
      {filteredArchives.length === 0 ? (
        <div className="rounded-2xl glass-panel p-10 text-center text-slate-400 space-y-2">
          <FolderArchive className="h-10 w-10 mx-auto text-slate-300 stroke-1" />
          <h3 className="font-bold text-sm text-slate-600">Tidak ada arsip yang cocok</h3>
          <p className="text-xs text-slate-400">
            Coba ganti kata kunci pencarian atau unggah berkas baru.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* TAMPILAN TABEL RAMPING MEMANJANG (COMPACT STREAMLINED ROWS) */
        <div className="rounded-2xl glass-panel shadow-md overflow-hidden border border-slate-200/90 bg-white/95">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] whitespace-nowrap">
              <thead className="bg-[#10331b] text-emerald-100 font-bold uppercase text-[9.5px] tracking-wider border-b border-emerald-950">
                <tr>
                  <th className="px-2 py-1.5 text-center w-8">No</th>
                  <th className="px-2.5 py-1.5">Tanggal</th>
                  <th className="px-2 py-1.5">Bidang</th>
                  <th className="px-2.5 py-1.5">Judul Arsip & Ringkasan</th>
                  <th className="px-2.5 py-1.5">Nomor Surat</th>
                  <th className="px-2 py-1.5">Folder Drive</th>
                  <th className="px-2 py-1.5">Ukuran</th>
                  <th className="px-2 py-1.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredArchives.map((item, idx) => {
                  const meta = BIDANG_CONFIG[item.bidang];
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-emerald-50/70 transition group cursor-pointer h-8"
                      onClick={() => onViewArchive(item)}
                    >
                      <td className="px-2 py-1 text-center font-mono text-[10px] text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="px-2.5 py-1 font-mono text-[10px] text-slate-600">
                        {formatDateIndo(item.tanggalSurat)}
                      </td>
                      <td className="px-2 py-1">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}>
                          {meta.shortLabel}
                        </span>
                      </td>
                      <td className="px-2.5 py-1 max-w-xs sm:max-w-md truncate">
                        <span className="font-bold text-slate-900 group-hover:text-emerald-800 transition">
                          {item.title}
                        </span>
                        {item.uraian && (
                          <span className="text-[10px] text-slate-500 ml-1.5 font-normal truncate">
                            — {item.uraian}
                          </span>
                        )}
                      </td>
                      <td className="px-2.5 py-1 font-mono text-[10px] text-slate-600 font-medium">
                        {item.nomorSurat}
                      </td>
                      <td className="px-2 py-1 text-[10px] text-slate-600">
                        <div className="flex items-center gap-1">
                          <Folder className="h-2.5 w-2.5 text-amber-500 shrink-0" />
                          <span className="truncate max-w-[130px]">{item.driveFolder}</span>
                        </div>
                      </td>
                      <td className="px-2 py-1 font-mono text-[10px] text-slate-500">
                        <span className="bg-slate-100 px-1 py-0.2 rounded border border-slate-200">
                          {item.fileSize}
                        </span>
                      </td>
                      <td className="px-2 py-1 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onViewArchive(item)}
                            className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Lihat Kode QR & Lembar Resmi Morowali"
                          >
                            <QrCode className="h-2.5 w-2.5" />
                            <span>QR</span>
                          </button>
                          <button
                            onClick={() => onViewArchive(item)}
                            className="flex items-center gap-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Lihat / Baca dokumen arsip"
                          >
                            <Eye className="h-2.5 w-2.5" />
                            <span>Lihat</span>
                          </button>
                          <button
                            onClick={() => (onEditArchive ? onEditArchive(item) : onViewArchive(item))}
                            className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Edit data arsip ini"
                          >
                            <Edit3 className="h-2.5 w-2.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDownloadArchive(item)}
                            className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Unduh berkas dokumen arsip"
                          >
                            <Download className="h-2.5 w-2.5" />
                            <span>Unduh</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus arsip "${item.title}"?`)) {
                                onDeleteArchive(item.id);
                              }
                            }}
                            className="p-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Hapus arsip"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TAMPILAN KARTU RAMPING (COMPACT CARDS) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredArchives.map((item) => {
            const meta = BIDANG_CONFIG[item.bidang];
            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-xl glass-panel p-4 shadow-sm border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition space-y-2.5"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}>
                      {meta.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.fileSize}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition line-clamp-1 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                      No: {item.nomorSurat}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {item.uraian || 'Tidak ada deskripsi tambahan.'}
                  </p>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <Folder className="h-3 w-3 text-amber-500 shrink-0" />
                    <span className="truncate">{item.driveFolder}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5">
                  <div className="text-[10px] text-slate-400">
                    {formatDateIndo(item.tanggalSurat)}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewArchive(item)}
                      className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 px-2 py-1 text-[10px] font-bold text-white transition cursor-pointer"
                      title="Lihat Kode QR & Lembar Resmi Morowali"
                    >
                      <QrCode className="h-3 w-3" />
                      <span>QR</span>
                    </button>
                    <button
                      onClick={() => onViewArchive(item)}
                      className="flex items-center gap-1 rounded bg-emerald-700 hover:bg-emerald-800 px-2 py-1 text-[10px] font-bold text-white transition cursor-pointer"
                      title="Lihat / Baca dokumen"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Lihat</span>
                    </button>
                    <button
                      onClick={() => (onEditArchive ? onEditArchive(item) : onViewArchive(item))}
                      className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-700 px-2 py-1 text-[10px] font-bold text-white transition cursor-pointer"
                      title="Edit dokumen arsip"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDownloadArchive(item)}
                      className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 px-2 py-1 text-[10px] font-bold text-white transition cursor-pointer"
                      title="Unduh berkas arsip"
                    >
                      <Download className="h-3 w-3" />
                      <span>Unduh</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus arsip "${item.title}"?`)) {
                          onDeleteArchive(item.id);
                        }
                      }}
                      className="p-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Hapus arsip"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
