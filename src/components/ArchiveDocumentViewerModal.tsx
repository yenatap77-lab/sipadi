/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Edit3,
  Trash2,
  Check,
  Calendar,
  Folder,
  User,
  ExternalLink,
  ShieldAlert,
  Save,
  Printer,
  FileCheck2,
} from 'lucide-react';
import { ArsipItem, BidangType } from '../types';
import { BIDANG_CONFIG, formatDateIndo, formatDateTimeIndo } from '../utils/formatters';
import { KopSuratMorowali } from './KopSuratMorowali';
import { LogoKabupatenMorowali } from './LogoKabupatenMorowali';
import { generateQRCodeDataURL, createArchiveQRPayload } from '../utils/qrCodeGenerator';

interface ArchiveDocumentViewerModalProps {
  item: ArsipItem | null;
  initialMode?: 'view' | 'edit';
  onClose: () => void;
  onUpdate: (updated: ArsipItem) => void;
  onDelete: (id: string) => void;
}

export const ArchiveDocumentViewerModal: React.FC<ArchiveDocumentViewerModalProps> = ({
  item,
  initialMode = 'view',
  onClose,
  onUpdate,
  onDelete,
}) => {
  if (!item) return null;

  const [isEditing, setIsEditing] = useState(initialMode === 'edit');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [archiveQrUrl, setArchiveQrUrl] = useState<string>('');

  // Edit form state
  const [formData, setFormData] = useState<ArsipItem>({ ...item });

  React.useEffect(() => {
    if (item) {
      setFormData({ ...item });
      setIsEditing(initialMode === 'edit');
      setShowDeleteConfirm(false);
      
      // Generate QR Code for this archive item
      const payload = createArchiveQRPayload(item);
      generateQRCodeDataURL(payload, { width: 280, margin: 1 })
        .then((url) => setArchiveQrUrl(url))
        .catch(console.error);
    }
  }, [item, initialMode]);

  const bidangMeta = BIDANG_CONFIG[formData.bidang];

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleDownload = () => {
    if (item.fileDataUrl) {
      const a = document.createElement('a');
      a.href = item.fileDataUrl;
      a.download = item.fileName || 'dokumen_arsip.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Generate synthetic downloadable text summary of this government archive
      const fileContent = `========================================================\nDINAS PERTANIAN DAN KETAHANAN PANGAN\nSISTEM INFORMASI PERTANIAN & ADMINISTRASI DIGITAL (SIPADI)\n========================================================\n\nJUDUL DOKUMEN   : ${item.title}\nNOMOR SURAT      : ${item.nomorSurat}\nTANGGAL SURAT    : ${item.tanggalSurat}\nBIDANG           : ${bidangMeta.label}\nSUB-KATEGORI     : ${item.subKategori}\nFOLDER DRIVE     : ${item.driveFolder}\nNAMA BERKAS      : ${item.fileName}\nUKURAN BERKAS    : ${item.fileSize}\nPENGUNGGAH       : ${item.uploaderName} (${item.uploaderRole})\nWAKTU UPLOAD     : ${item.createdAt}\n\nURAIAN RINGKAS:\n${item.uraian}\n\n--------------------------------------------------------\nDokumen resmi tersimpan aman di Google Drive SIPADI.\n========================================================\n`;
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.fileName || 'SIPADI_Arsip'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl text-white shadow-sm bg-gradient-to-br ${bidangMeta.gradient}`}>
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${bidangMeta.badgeBg} ${bidangMeta.badgeText} ${bidangMeta.badgeBorder}`}>
                  {bidangMeta.shortLabel}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {item.nomorSurat}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                {item.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition"
                  title="Edit data arsip"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-800 transition shadow-2xs"
                  title="Cetak lembar arsip resmi ber-Kop Morowali & QR Code"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Cetak</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition shadow-sm"
                  title="Unduh dokumen"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh</span>
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center rounded-lg border border-rose-200 p-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                  title="Hapus arsip"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {isEditing ? (
            /* Form Edit Mode */
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Dokumen Arsip
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Surat / Dokumen
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nomorSurat}
                    onChange={(e) => setFormData({ ...formData, nomorSurat: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Surat
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalSurat}
                    onChange={(e) => setFormData({ ...formData, tanggalSurat: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bidang Arsip
                  </label>
                  <select
                    value={formData.bidang}
                    onChange={(e) => setFormData({ ...formData, bidang: e.target.value as BidangType })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  >
                    <option value="perencanaan">Arsip Perencanaan</option>
                    <option value="tph">Arsip TPH</option>
                    <option value="psp">Arsip PSP</option>
                    <option value="peternakan">Arsip Peternakan</option>
                    <option value="perkebunan">Arsip Perkebunan</option>
                    <option value="pbj">Arsip PBJ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sub Kategori
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subKategori}
                    onChange={(e) => setFormData({ ...formData, subKategori: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Uraian Ringkas Dokumen
                  </label>
                  <textarea
                    rows={3}
                    value={formData.uraian}
                    onChange={(e) => setFormData({ ...formData, uraian: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          ) : (
            /* Document Reader & Metadata View */
            <div className="space-y-6">
              
              {/* Document Paper Simulated Reader (Resmi Pemerintah Kabupaten Morowali) */}
              <div className="rounded-2xl border border-slate-300 bg-white p-6 sm:p-8 shadow-md relative overflow-hidden font-sans">
                {/* Subtle Official Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none text-8xl font-black rotate-[-25deg]">
                  SIPADI MOROWALI
                </div>

                {/* Kop Surat Resmi Kabupaten Morowali dengan Logo Resmi */}
                <KopSuratMorowali
                  documentTitle="LEMBAR ARSIP DOKUMEN DIGITAL DINAS"
                  nomorRegistrasi={item.nomorSurat}
                  documentSubtitle="Pusat Data dan Pengelolaan Arsip Digital Terpadu"
                />

                {/* Document Body */}
                <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed pt-2">
                  <div className="text-center font-extrabold text-sm sm:text-base uppercase text-slate-900 border-b border-slate-200 pb-2">
                    {item.title}
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Kategori Bidang</span>
                        <span className="font-semibold text-slate-800">{bidangMeta.label}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Sub Kategori</span>
                        <span className="font-semibold text-slate-800">{item.subKategori}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Tanggal Surat</span>
                        <span className="font-semibold text-slate-800">{formatDateIndo(item.tanggalSurat)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Ringkasan Uraian / Catatan Arsip:
                    </h4>
                    <p className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed text-xs">
                      {item.uraian || 'Tidak ada catatan tambahan untuk dokumen ini.'}
                    </p>
                  </div>

                  {/* Google Drive Folder & Storage Info */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4 text-amber-500" />
                      <span>Folder Google Drive: <strong>{item.driveFolder}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="h-4 w-4 text-emerald-600" />
                      <span>Berkas Arsip: <strong>{item.fileName}</strong> ({item.fileSize})</span>
                    </div>
                  </div>
                </div>

                {/* Footer Stamp, Verification QR Code & Sign Off */}
                <div className="mt-8 pt-4 border-t-2 border-slate-300 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 text-xs text-slate-600">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Petugas Pengunggah Berkas:</p>
                    <p className="font-bold text-slate-900 text-sm">{item.uploaderName}</p>
                    <p className="text-[11px] text-slate-500">{item.uploaderRole}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Waktu Rekam: {formatDateTimeIndo(item.createdAt)}</p>
                  </div>

                  {/* Generated QR Code Verification Box with Logo Morowali */}
                  <div className="flex items-center gap-3 bg-emerald-50/80 border border-emerald-300 p-2.5 rounded-xl">
                    <div className="relative">
                      {archiveQrUrl ? (
                        <img
                          src={archiveQrUrl}
                          alt="QR Code Arsip Morowali"
                          className="w-16 h-16 object-contain rounded bg-white p-0.5 border border-emerald-200 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-white rounded text-[10px] text-slate-400">
                          QR
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <span className="text-[9.5px] font-extrabold uppercase block text-emerald-900">
                        TERVERIFIKASI RESMI
                      </span>
                      <span className="text-[8.5px] font-bold text-slate-700 block">
                        DINAS PERTANIAN DAERAH
                      </span>
                      <span className="text-[8px] text-emerald-700 block">
                        KABUPATEN MOROWALI
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Delete Confirmation Alert */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-800 border border-rose-200">
              <div className="flex items-center gap-3 text-rose-600 mb-3">
                <ShieldAlert className="h-7 w-7" />
                <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Arsip</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Apakah Anda yakin ingin menghapus arsip <strong>"{item.title}"</strong>?
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onDelete(item.id);
                    onClose();
                  }}
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow"
                >
                  Ya, Hapus Arsip
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
