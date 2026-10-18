/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  X,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { KopSuratMorowali } from './KopSuratMorowali';
import { LogoKabupatenMorowali } from './LogoKabupatenMorowali';
import { generateQRCodeDataURL, downloadQRCodeImage } from '../utils/qrCodeGenerator';

export interface SuccessQRCodeData {
  type: 'arsip' | 'proposal' | 'pbj' | 'teknis';
  id: string;
  title: string;
  nomorOrCode: string;
  bidang: string;
  category?: string;
  submitterOrGroup?: string;
  location?: string;
  timestamp: string;
  qrPayload: string;
}

interface SuccessQRCodeModalProps {
  data: SuccessQRCodeData | null;
  onClose: () => void;
}

export const SuccessQRCodeModal: React.FC<SuccessQRCodeModalProps> = ({
  data,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (data?.qrPayload) {
      setIsGenerating(true);
      generateQRCodeDataURL(data.qrPayload, { width: 400, margin: 1 })
        .then((url) => {
          setQrDataUrl(url);
          setIsGenerating(false);
        })
        .catch(() => setIsGenerating(false));
    }
  }, [data]);

  if (!data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQR = () => {
    if (qrDataUrl) {
      const sanitized = data.nomorOrCode.replace(/[^a-zA-Z0-9]/g, '_');
      downloadQRCodeImage(qrDataUrl, `QR_SIPADI_MOROWALI_${sanitized}.png`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const typeLabels: Record<string, string> = {
    arsip: 'Dokumen Arsip Digital',
    proposal: 'Proposal Usulan Kelompok Tani',
    pbj: 'Paket Pengadaan Barang & Jasa (PBJ)',
    teknis: 'Data Teknis Pertanian',
  };

  const typeBadgeColors: Record<string, string> = {
    arsip: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    proposal: 'bg-amber-100 text-amber-900 border-amber-300',
    pbj: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    teknis: 'bg-teal-100 text-teal-900 border-teal-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[94vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Alert Notification (Green/Emerald Theme) */}
        <div className="flex items-center justify-between border-b border-emerald-700 bg-gradient-to-r from-emerald-800 via-emerald-900 to-green-950 px-5 py-4 text-white print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-900 shadow-md">
              <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-3 w-3" />
                  Terverifikasi Otomatis
                </span>
                <span className="text-xs text-emerald-200 font-mono">
                  Kode QR Terbit
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Input Data Berhasil & Kode QR Terbuat Otomatis!
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition cursor-pointer"
            title="Tutup Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
          
          {/* Printable Official Document Sheet with Kop Morowali */}
          <div className="rounded-2xl border-2 border-slate-300 bg-white p-5 sm:p-8 shadow-sm font-sans space-y-4 print:border-none print:shadow-none print:p-0">
            
            {/* Kop Surat Pemerintah Kabupaten Morowali */}
            <KopSuratMorowali
              compact={false}
              documentTitle={`TANDA BUKTI REGISTRASI ELEKTRONIK ${typeLabels[data.type].toUpperCase()}`}
              nomorRegistrasi={data.nomorOrCode}
              documentSubtitle="Sistem Informasi Pertanian dan Administrasi Digital (SIPADI) • Dinas Pertanian Daerah Kab. Morowali"
            />

            {/* Content Row: QR Code on Left/Center + Verification Table */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center pt-2">
              
              {/* QR Code Presentation Box with Logo Morowali */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-50/70 border-2 border-dashed border-amber-300 text-center">
                <div className="relative p-2.5 rounded-xl bg-white shadow-md border border-slate-200 mb-2">
                  {isGenerating || !qrDataUrl ? (
                    <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">
                      Membuat Kode QR Resmi Morowali...
                    </div>
                  ) : (
                    <img
                      src={qrDataUrl}
                      alt="Kode QR Resmi Morowali"
                      className="w-44 h-44 object-contain rounded"
                    />
                  )}
                  {/* Lambang Kabupaten Morowali in center overlay of QR */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="p-1 rounded-xl bg-white/95 shadow-md border-2 border-amber-400 flex flex-col items-center justify-center">
                      <LogoKabupatenMorowali size={26} />
                      <span className="text-[7.5px] font-black tracking-tight text-slate-900 uppercase">
                        MOROWALI
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
                    Pindai untuk Verifikasi Keaslian
                  </span>
                  <p className="text-[9px] text-slate-500 font-mono">
                    ID: {data.id}
                  </p>
                </div>
              </div>

              {/* Data Summary Table */}
              <div className="md:col-span-2 space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2 text-xs">
                  
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-semibold">Tipe Registrasi:</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${typeBadgeColors[data.type] || 'bg-slate-100'}`}>
                      {typeLabels[data.type]}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-semibold col-span-1">Judul / Kegiatan:</span>
                    <span className="font-bold text-slate-900 col-span-2 leading-snug">
                      {data.title}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-semibold col-span-1">Nomor / Kode:</span>
                    <span className="font-mono font-bold text-emerald-900 col-span-2">
                      {data.nomorOrCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-semibold col-span-1">Bidang Dinas:</span>
                    <span className="font-bold text-slate-800 col-span-2 uppercase">
                      {data.bidang} {data.category ? `• ${data.category}` : ''}
                    </span>
                  </div>

                  {data.submitterOrGroup && (
                    <div className="grid grid-cols-3 gap-1 py-1 border-b border-slate-200">
                      <span className="text-slate-500 font-semibold col-span-1">Pengunggah / Poktan:</span>
                      <span className="font-semibold text-slate-800 col-span-2">
                        {data.submitterOrGroup}
                      </span>
                    </div>
                  )}

                  {data.location && (
                    <div className="grid grid-cols-3 gap-1 py-1 border-b border-slate-200">
                      <span className="text-slate-500 font-semibold col-span-1">Lokasi Wilayah:</span>
                      <span className="font-semibold text-slate-800 col-span-2">
                        {data.location}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-1 pt-1">
                    <span className="text-slate-500 font-semibold col-span-1">Waktu Rekam:</span>
                    <span className="font-mono text-slate-600 col-span-2 text-[11px]">
                      {data.timestamp} WITA
                    </span>
                  </div>
                </div>

                {/* Digital Verification Statement */}
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-300 p-2.5 text-xs text-emerald-900">
                  <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0" />
                  <p className="text-[11px] leading-tight">
                    Dokumen ini telah <strong>disahkan secara digital</strong> oleh Sistem Informasi Pertanian dan Administrasi Digital (SIPADI) Pemerintah Kabupaten Morowali dan memiliki kekuatan hukum administrasi.
                  </p>
                </div>
              </div>

            </div>

            {/* Official Signature & Seal Simulation */}
            <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-xs text-slate-700">
              <div>
                <p className="text-[10px] text-slate-400">Dicetak melalui:</p>
                <p className="font-bold text-emerald-950">SIPADI MOROWALI CLOUD</p>
                <p className="text-[10px] text-slate-500">Kabupaten Morowali, Sulawesi Tengah</p>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-slate-400">Bungku, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-[10px] font-bold text-slate-800 uppercase">Kepala Dinas Pertanian Daerah</p>
                <div className="h-8 flex items-center justify-end">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[9px] font-bold border border-amber-300">
                    [TANDATANGAN ELEKTRONIK RESMI]
                  </span>
                </div>
                <p className="text-[10.5px] font-bold text-slate-900 underline">PEMERINTAH KABUPATEN MOROWALI</p>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions (Print, Download, Copy, Close) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-200 bg-white px-5 py-3.5 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Salin rincian kode QR"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Info QR'}</span>
            </button>

            <button
              onClick={handleDownloadQR}
              disabled={!qrDataUrl}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition cursor-pointer"
              title="Unduh file gambar QR Code (.PNG)"
            >
              <Download className="h-3.5 w-3.5 text-emerald-700" />
              <span>Unduh QR (.PNG)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-bold text-white shadow-sm transition cursor-pointer"
              title="Cetak lembar bukti dengan Kop Morowali dan QR Code"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Lembar Tanda Terima</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-xl bg-emerald-700 hover:bg-emerald-800 px-5 py-2 text-xs font-bold text-white shadow-sm transition cursor-pointer"
            >
              Selesai & Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
