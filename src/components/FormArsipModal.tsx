/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  Folder,
  Calendar,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';
import { ArsipItem, BidangType, UserAccount } from '../types';
import { BIDANG_CONFIG } from '../utils/formatters';

interface FormArsipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newItem: ArsipItem) => void;
  currentUser: UserAccount;
  defaultBidang?: BidangType;
}

export const FormArsipModal: React.FC<FormArsipModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentUser,
  defaultBidang = 'tph',
}) => {
  const [title, setTitle] = useState('');
  const [nomorSurat, setNomorSurat] = useState('');
  const [tanggalSurat, setTanggalSurat] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [bidang, setBidang] = useState<BidangType>(defaultBidang);
  const [subKategori, setSubKategori] = useState('');
  const [uraian, setUraian] = useState('');

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const driveFolderTarget = `${BIDANG_CONFIG[bidang].folderDrive}/${currentYear}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
      const sizeMb = (selected.size / (1024 * 1024)).toFixed(2);
      setFileSize(`${sizeMb} MB`);

      const reader = new FileReader();
      reader.onload = () => {
        setFileBase64(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !nomorSurat) return;

    const newArsip: ArsipItem = {
      id: 'ars-' + Date.now(),
      title,
      nomorSurat,
      tanggalSurat,
      bidang,
      subKategori: subKategori || 'Dokumen Resmi',
      uraian,
      fileName: fileName || `Dokumen_${nomorSurat.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      fileSize: fileSize || '1.5 MB',
      fileType: file?.type || 'application/pdf',
      fileDataUrl: fileBase64 || undefined,
      driveFolder: driveFolderTarget,
      driveUrl: `https://drive.google.com/drive/folders/example-sipadi-${bidang}`,
      uploaderName: currentUser.name,
      uploaderRole: currentUser.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newArsip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-emerald-800 to-green-900 px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-900 shadow-sm">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Unggah & Input Arsip Baru</h2>
              <p className="text-xs text-emerald-200">
                Penyimpanan otomatis ke Google Drive & database SIPADI
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Target Folder Drive Banner */}
          <div className="flex items-center gap-2.5 rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs text-amber-900">
            <Folder className="h-4 w-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-semibold">Target Folder Google Drive: </span>
              <code className="font-mono bg-amber-100/80 px-1.5 py-0.5 rounded text-amber-950 font-bold">
                {driveFolderTarget}
              </code>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Dokumen Arsip <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: SK Penetapan CPCL Pupuk Bersubsidi TA 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Surat / Dokumen <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 521/104/DISTAN/2026"
                value={nomorSurat}
                onChange={(e) => setNomorSurat(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Surat <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={tanggalSurat}
                onChange={(e) => setTanggalSurat(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bidang Arsip <span className="text-rose-500">*</span>
              </label>
              <select
                value={bidang}
                onChange={(e) => setBidang(e.target.value as BidangType)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
              >
                <option value="perencanaan">Arsip Perencanaan</option>
                <option value="tph">Arsip TPH (Tanaman Pangan & Hortikultura)</option>
                <option value="psp">Arsip PSP (Prasarana & Sarana)</option>
                <option value="peternakan">Arsip Peternakan & Kesehatan Hewan</option>
                <option value="perkebunan">Arsip Perkebunan</option>
                <option value="pbj">Arsip PBJ (Pengadaan Barang & Jasa)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sub Kategori Dokumen
              </label>
              <input
                type="text"
                placeholder="Contoh: SK, BAST, Laporan, Kontrak"
                value={subKategori}
                onChange={(e) => setSubKategori(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Uraian Ringkas Dokumen
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan ringkasan isi dokumen, pihak terkait, lokasi atau keterangan penting..."
                value={uraian}
                onChange={(e) => setUraian(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* File Upload Area */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pilih Berkas Dokumen (PDF / Foto / BAP)
              </label>
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/80 p-5 text-center hover:bg-slate-100/70 transition">
                <input
                  type="file"
                  id="arsipFileInput"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx"
                  className="hidden"
                />
                <label
                  htmlFor="arsipFileInput"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="p-2.5 rounded-full bg-emerald-100 text-emerald-700 mb-2">
                    <Upload className="h-6 w-6" />
                  </div>
                  {fileName ? (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-emerald-700">{fileName}</p>
                      <p className="text-[11px] text-slate-500">Ukuran: {fileSize} (Siap Diunggah)</p>
                      <span className="inline-block mt-1 text-[11px] text-emerald-600 underline">Ganti Berkas</span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        Klik untuk memilih berkas dari komputer / HP
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Format PDF, JPG, PNG, DOC (Maks. 25 MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-5 py-2 text-xs font-bold text-white shadow-md transition"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Simpan & Arsipkan</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
