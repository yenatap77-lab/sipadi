/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Upload,
  CheckCircle2,
  FileCheck,
  Link2,
} from 'lucide-react';
import { PBJEPurchasingItem, ProposalItem } from '../types';
import { formatRupiah } from '../utils/formatters';

interface FormPBJEPurchasingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PBJEPurchasingItem) => void;
  availableProposals?: ProposalItem[];
}

export const FormPBJEPurchasingModal: React.FC<FormPBJEPurchasingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  availableProposals = [],
}) => {
  const [uraianKegiatan, setUraianKegiatan] = useState('');
  const [kodeRup, setKodeRup] = useState('');
  const [penyedia, setPenyedia] = useState('');
  const [penanggungjawab, setPenanggungjawab] = useState('');
  const [noHp, setNoHp] = useState('');
  const [alamatPenyedia, setAlamatPenyedia] = useState('');
  const [npwp, setNpwp] = useState('');

  const [paguAnggaran, setPaguAnggaran] = useState<number>(0);
  const [hps, setHps] = useState<number>(0);
  const [penawaran, setPenawaran] = useState<number>(0);
  const [negosiasi, setNegosiasi] = useState<number>(0);
  const [noKontrak, setNoKontrak] = useState('');
  const [volumePekerjaan, setVolumePekerjaan] = useState('');
  const [jenisKontrak, setJenisKontrak] = useState('Surat Pesanan E-Katalog LKPP');
  const [masaKontrak, setMasaKontrak] = useState('');
  const [pembayaran, setPembayaran] = useState<number>(0);

  // Status & Dokumen Pendukung
  const [status, setStatus] = useState<PBJEPurchasingItem['status']>('Pemesanan / PO');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string }>>([]);
  const [selectedProposalId, setSelectedProposalId] = useState<string>('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((f) => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uraianKegiatan || !noKontrak) return;

    const newItem: PBJEPurchasingItem = {
      id: 'pbj-ep-' + Date.now(),
      uraianKegiatan,
      kodeRup,
      penyedia,
      penanggungjawab,
      noHp,
      alamatPenyedia,
      npwp,
      paguAnggaran,
      hps,
      penawaran,
      negosiasi,
      noKontrak,
      volumePekerjaan,
      jenisKontrak,
      masaKontrak,
      pembayaran: pembayaran > 0 ? pembayaran : negosiasi,
      status,
      dokumenPendukung: uploadedFiles.length > 0 ? uploadedFiles : [
        { name: 'Surat_Pesanan_Katalog.pdf', size: '1.4 MB' },
      ],
      linkedProposalId: selectedProposalId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-teal-700 via-cyan-800 to-emerald-900 px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-900 shadow-sm">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Input Pengadaan E-Purchasing (E-Katalog)</h2>
              <p className="text-xs text-teal-100">
                Pencatatan surat pesanan katalog nasional, sektoral & dokumen pendukung
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* a. uraian kegiatan */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                a. Uraian Kegiatan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Pengadaan Hand Traktor Roda Dua Quick G3000 E-Katalog"
                value={uraianKegiatan}
                onChange={(e) => setUraianKegiatan(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none"
              />
            </div>

            {/* b. kode rup */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                b. Kode RUP
              </label>
              <input
                type="text"
                placeholder="RUP-EKAT-xxxxxx"
                value={kodeRup}
                onChange={(e) => setKodeRup(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none"
              />
            </div>

            {/* c. penyedia */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                c. Penyedia (Etalase Katalog)
              </label>
              <input
                type="text"
                placeholder="PT / CV Penyedia Katalog"
                value={penyedia}
                onChange={(e) => setPenyedia(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none"
              />
            </div>

            {/* d. penanggungjawab */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                d. Penanggung Jawab Penyedia
              </label>
              <input
                type="text"
                placeholder="Nama Penanggung Jawab"
                value={penanggungjawab}
                onChange={(e) => setPenanggungjawab(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none"
              />
            </div>

            {/* e. no hp */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                e. No HP Penyedia
              </label>
              <input
                type="text"
                placeholder="08xxxxxxxxxx"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none"
              />
            </div>

            {/* f. Alamat penyedia */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                f. Alamat Penyedia
              </label>
              <input
                type="text"
                placeholder="Alamat kantor / showroom distributor"
                value={alamatPenyedia}
                onChange={(e) => setAlamatPenyedia(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none"
              />
            </div>

            {/* g. Npwp */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                g. NPWP Penyedia
              </label>
              <input
                type="text"
                placeholder="xx.xxx.xxx.x-xxx.xxx"
                value={npwp}
                onChange={(e) => setNpwp(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none"
              />
            </div>

            {/* h. Pagu anggaran */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                h. Pagu Anggaran (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={paguAnggaran || ''}
                onChange={(e) => setPaguAnggaran(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none"
              />
            </div>

            {/* i. Hps */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                i. HPS (Rp)
              </label>
              <input
                type="number"
                value={hps || ''}
                onChange={(e) => setHps(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none"
              />
            </div>

            {/* j. Penawaran */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                j. Penawaran Katalog (Rp)
              </label>
              <input
                type="number"
                value={penawaran || ''}
                onChange={(e) => setPenawaran(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none"
              />
            </div>

            {/* k. Negosiasi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                k. Harga Negosiasi Katalog (Rp)
              </label>
              <input
                type="number"
                value={negosiasi || ''}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setNegosiasi(val);
                  if (!pembayaran) setPembayaran(val);
                }}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none"
              />
            </div>

            {/* l. No kontrak */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                l. Nomor Surat Pesanan / Kontrak <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="027/SP-EKAT/xxxx/2026"
                value={noKontrak}
                onChange={(e) => setNoKontrak(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none"
              />
            </div>

            {/* m. Volume pekerjaan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                m. Volume Barang / Pekerjaan
              </label>
              <input
                type="text"
                placeholder="Contoh: 10 Unit / 40 Ton"
                value={volumePekerjaan}
                onChange={(e) => setVolumePekerjaan(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none"
              />
            </div>

            {/* n. Jenis kontrak */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                n. Jenis Kontrak
              </label>
              <input
                type="text"
                value={jenisKontrak}
                onChange={(e) => setJenisKontrak(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none"
              />
            </div>

            {/* o. Masa kontrak */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                o. Masa Kontrak / Pengiriman
              </label>
              <input
                type="text"
                placeholder="30 Hari Kalender"
                value={masaKontrak}
                onChange={(e) => setMasaKontrak(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none"
              />
            </div>

            {/* p. pembayaran */}
            <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-200">
              <label className="block text-xs font-bold text-cyan-900 mb-1">
                p. Total Nilai Pembayaran (Rp)
              </label>
              <input
                type="number"
                value={pembayaran || ''}
                onChange={(e) => setPembayaran(Number(e.target.value))}
                className="w-full rounded-xl border border-cyan-300 bg-white px-3 py-2 text-xs font-bold text-cyan-950 focus:outline-none"
              />
              <span className="text-[11px] text-cyan-700 block mt-1">
                {formatRupiah(pembayaran || negosiasi)}
              </span>
            </div>

            {/* Hubungkan ke Proposal */}
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <label className="block text-xs font-bold text-emerald-900 mb-1 flex items-center gap-1">
                <Link2 className="h-3.5 w-3.5 text-emerald-600" />
                Integrasikan Usulan Proposal Masyarakat
              </label>
              <select
                value={selectedProposalId}
                onChange={(e) => setSelectedProposalId(e.target.value)}
                className="w-full rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none"
              >
                <option value="">-- Tidak Ada Usulan Terhubung --</option>
                {availableProposals.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.bidang.toUpperCase()}] {p.kelompokTani} - {p.namaUsulan.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Status Pesanan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Pemesanan Katalog
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PBJEPurchasingItem['status'])}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-cyan-600 focus:outline-none bg-white"
              >
                <option value="Pemesanan / PO">Pemesanan / PO</option>
                <option value="Pengiriman">Pengiriman Barang</option>
                <option value="Pemeriksaan Hasil">Pemeriksaan Hasil</option>
                <option value="Pembayaran">Proses Pembayaran</option>
                <option value="Selesai">Selesai 100%</option>
              </select>
            </div>
          </div>

          {/* q. Upload Dokumen Pendukung Lengkap */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  q. Upload Dokumen Pendukung Lengkap
                </h4>
                <p className="text-[11px] text-slate-500">
                  Surat pesanan, BAST barang, faktur pajak, struk katalog, foto serah terima.
                </p>
              </div>
              <label className="cursor-pointer flex items-center gap-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-800 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition">
                <Upload className="h-3.5 w-3.5" />
                <span>Pilih Berkas</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {uploadedFiles.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs border border-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-cyan-600" />
                      <span className="font-medium text-slate-800">{f.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{f.size}</span>
                  </div>
                ))}
              </div>
            )}
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
              className="flex items-center gap-1.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 px-5 py-2 text-xs font-bold text-white shadow-md transition"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Simpan Data E-Purchasing</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
