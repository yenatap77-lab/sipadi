/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShoppingCart,
  FilePlus2,
  FileText,
  Download,
  Building,
  User,
  Link2,
  Trash2,
  Eye,
  Edit3,
  X,
  Save,
} from 'lucide-react';
import { PBJLangsungItem, PBJEPurchasingItem, ProposalItem } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface PBJListViewProps {
  initialSubTab?: 'langsung' | 'epurchasing';
  langsungList: PBJLangsungItem[];
  epurchasingList: PBJEPurchasingItem[];
  proposals?: ProposalItem[];
  onOpenNewLangsung: () => void;
  onOpenNewEPurchasing: () => void;
  onMarkProposalExecuted?: (proposalId: string, contractNo: string) => void;
  onUpdateLangsung?: (item: PBJLangsungItem) => void;
  onUpdateEPurchasing?: (item: PBJEPurchasingItem) => void;
  onDeleteLangsung?: (id: string) => void;
  onDeleteEPurchasing?: (id: string) => void;
}

export const PBJListView: React.FC<PBJListViewProps> = ({
  initialSubTab = 'langsung',
  langsungList,
  epurchasingList,
  proposals = [],
  onOpenNewLangsung,
  onOpenNewEPurchasing,
  onMarkProposalExecuted,
  onUpdateLangsung,
  onUpdateEPurchasing,
  onDeleteLangsung,
  onDeleteEPurchasing,
}) => {
  const [subTab, setSubTab] = useState<'langsung' | 'epurchasing'>(initialSubTab);

  // Detail & Edit Modals state
  const [detailItem, setDetailItem] = useState<{
    type: 'langsung' | 'epurchasing';
    item: any;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);

  const handleOpenDetail = (type: 'langsung' | 'epurchasing', item: any, editMode: boolean = false) => {
    setDetailItem({ type, item });
    setEditForm({ ...item });
    setIsEditing(editMode);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailItem || !editForm) return;

    if (detailItem.type === 'langsung' && onUpdateLangsung) {
      onUpdateLangsung({
        ...editForm,
        updatedAt: new Date().toISOString(),
      });
    } else if (detailItem.type === 'epurchasing' && onUpdateEPurchasing) {
      onUpdateEPurchasing({
        ...editForm,
        updatedAt: new Date().toISOString(),
      });
    }
    setDetailItem({ type: detailItem.type, item: editForm });
    setIsEditing(false);
  };

  // Single Item Download
  const handleDownloadPBJ = (type: 'langsung' | 'epurchasing', item: any) => {
    let report = `========================================================\n`;
    report += `DINAS PERTANIAN DAN KETAHANAN PANGAN\n`;
    report += `DOKUMEN LEMBAR VERIFIKASI PENGADAAN BARANG & JASA (PBJ)\n`;
    report += `SISTEM INFORMASI PERTANIAN & ADMINISTRASI DIGITAL (SIPADI)\n`;
    report += `========================================================\n\n`;
    report += `TANGGAL CETAK   : ${new Date().toLocaleString('id-ID')}\n`;
    report += `METODE PENGADAAN: ${type === 'langsung' ? 'Pengadaan Langsung (PL)' : 'E-Purchasing (Katalog)'}\n`;
    report += `NOMOR KONTRAK   : ${item.noKontrak}\n`;
    report += `KODE RUP        : ${item.kodeRup || '-'}\n`;
    report += `URAIAN KEGIATAN : ${item.uraianKegiatan}\n`;
    report += `STATUS PAKET    : ${item.status}\n`;
    report += `PAGU ANGGARAN   : ${formatRupiah(item.paguAnggaran)}\n`;
    report += `HPS             : ${formatRupiah(item.hps)}\n`;
    report += `NILAI NEGOSIASI : ${formatRupiah(item.negosiasi)}\n`;

    if (type === 'langsung') {
      report += `BESARAN KONTRAK : ${formatRupiah(item.besaranNilaiKontrak)}\n`;
      report += `SISA PAGU       : ${formatRupiah(item.sisaAnggaranPagu)}\n`;
      report += `PENYEDIA        : ${item.penyedia} (${item.penanggungJawab})\n`;
      report += `ALAMAT PENYEDIA : ${item.alamatPenyedia} (HP: ${item.noHpPenyedia})\n`;
      report += `NPWP            : ${item.npwp}\n`;
      report += `PELAKSANA LAP.  : ${item.namaPelaksana} (HP: ${item.noHpPelaksana})\n`;
      report += `MASA KONTRAK    : ${item.masaKontrak}\n`;
      report += `VOLUME          : ${item.volumePekerjaan}\n\n`;
      report += `PROGRES PEMBAYARAN KEUANGAN:\n`;
      report += `- Uang Muka (${item.uangMuka?.persentase}%): ${formatRupiah(item.uangMuka?.nilai)} [${item.uangMuka?.status}]\n`;
      report += `- Pembayaran Fisik 100%: ${formatRupiah(item.pembayaranPenyelesaian?.nilai)} [${item.pembayaranPenyelesaian?.status}]\n`;
      report += `- Retensi (${item.retensi?.persentase}%): ${formatRupiah(item.retensi?.nilai)} [${item.retensi?.status}]\n`;
    } else {
      report += `NILAI PEMBAYARAN: ${formatRupiah(item.pembayaran)}\n`;
      report += `PENYEDIA KATALOG: ${item.penyedia} (${item.penanggungjawab})\n`;
      report += `ALAMAT PENYEDIA : ${item.alamatPenyedia} (HP: ${item.noHp})\n`;
      report += `NPWP            : ${item.npwp}\n`;
      report += `MASA PENGIRIMAN : ${item.masaKontrak}\n`;
      report += `VOLUME          : ${item.volumePekerjaan}\n`;
    }

    report += `\n========================================================\nDokumen resmi tersimpan aman dalam database SIPADI DIGITAL.\n========================================================\n`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PBJ_${item.noKontrak.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Bulk CSV Export
  const handleExportCSV = () => {
    let header: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = '';

    if (subTab === 'langsung') {
      filename = 'Rekap_PBJ_Pengadaan_Langsung';
      header = [
        'No',
        'Nomor Kontrak',
        'Kode RUP',
        'Uraian Kegiatan',
        'Penyedia',
        'Penanggung Jawab',
        'No HP',
        'Pagu Anggaran',
        'HPS',
        'Nilai Kontrak',
        'Sisa Pagu',
        'Masa Kontrak',
        'Volume',
        'Status',
        'Uang Muka',
        'Retensi',
      ];
      rows = langsungList.map((x, i) => [
        i + 1,
        `"${x.noKontrak}"`,
        `"${x.kodeRup || '-'}"`,
        `"${x.uraianKegiatan.replace(/"/g, '""')}"`,
        `"${x.penyedia}"`,
        `"${x.penanggungJawab}"`,
        `"${x.noHpPenyedia}"`,
        x.paguAnggaran,
        x.hps,
        x.besaranNilaiKontrak,
        x.sisaAnggaranPagu,
        `"${x.masaKontrak}"`,
        `"${x.volumePekerjaan}"`,
        `"${x.status}"`,
        x.uangMuka?.nilai || 0,
        x.retensi?.nilai || 0,
      ]);
    } else {
      filename = 'Rekap_PBJ_EPurchasing';
      header = [
        'No',
        'Nomor Kontrak',
        'Kode RUP',
        'Uraian Kegiatan',
        'Penyedia',
        'Penanggung Jawab',
        'No HP',
        'Pagu Anggaran',
        'HPS',
        'Negosiasi',
        'Nilai Pembayaran',
        'Masa Kontrak',
        'Volume',
        'Status',
      ];
      rows = epurchasingList.map((x, i) => [
        i + 1,
        `"${x.noKontrak}"`,
        `"${x.kodeRup || '-'}"`,
        `"${x.uraianKegiatan.replace(/"/g, '""')}"`,
        `"${x.penyedia}"`,
        `"${x.penanggungjawab}"`,
        `"${x.noHp}"`,
        x.paguAnggaran,
        x.hps,
        x.negosiasi,
        x.pembayaran,
        `"${x.masaKontrak}"`,
        `"${x.volumePekerjaan}"`,
        `"${x.status}"`,
      ]);
    }

    if (rows.length === 0) return;
    const csvContent = '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Title & Add Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl glass-panel p-4 sm:p-5 shadow-lg border-l-4 border-l-amber-500">
        <div>
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">
            <ShoppingCart className="h-4 w-4" />
            <span>Pengadaan Barang & Jasa (PBJ)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {subTab === 'langsung'
              ? 'Daftar Pengadaan Langsung (PL)'
              : 'Daftar Pengadaan E-Purchasing (E-Katalog)'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumentasi kontrak, verifikasi SPK, uang muka, penyelesaian fisik, dan retensi pemeliharaan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3.5 py-2.5 text-xs font-bold text-amber-900 shadow-2xs transition shrink-0 cursor-pointer"
            title="Unduh rekap paket PBJ ke format CSV"
          >
            <Download className="h-4 w-4" />
            <span>Unduh Rekap (.CSV)</span>
          </button>

          {subTab === 'langsung' ? (
            <button
              onClick={onOpenNewLangsung}
              className="flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2.5 text-xs font-bold text-white shadow-md transition shrink-0 cursor-pointer"
            >
              <FilePlus2 className="h-4 w-4" />
              <span>Input Pengadaan Langsung</span>
            </button>
          ) : (
            <button
              onClick={onOpenNewEPurchasing}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 px-4 py-2.5 text-xs font-bold text-white shadow-md transition shrink-0 cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Input E-Purchasing</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200">
        <button
          onClick={() => setSubTab('langsung')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
            subTab === 'langsung'
              ? 'bg-amber-500 text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FilePlus2 className="h-4 w-4" />
          <span>Pengadaan Langsung ({langsungList.length})</span>
        </button>

        <button
          onClick={() => setSubTab('epurchasing')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
            subTab === 'epurchasing'
              ? 'bg-cyan-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>E-Purchasing ({epurchasingList.length})</span>
        </button>
      </div>

      {/* Content for Pengadaan Langsung */}
      {subTab === 'langsung' && (
        <div className="space-y-3">
          {langsungList.map((item) => (
            <div
              key={item.id}
              className="rounded-xl glass-panel p-4 shadow-sm border border-slate-200/90 space-y-3"
            >
              {/* Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-300">
                      PENGADAAN LANGSUNG
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {item.noKontrak}
                    </span>
                    {item.kodeRup && (
                      <span className="text-[11px] font-mono text-slate-400">
                        ({item.kodeRup})
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {item.uraianKegiatan}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 self-start">
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    {item.status}
                  </span>

                  <button
                    onClick={() => handleOpenDetail('langsung', item, false)}
                    className="flex items-center gap-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 text-xs font-bold shadow-2xs transition cursor-pointer"
                    title="Lihat detail lengkap paket pengadaan"
                  >
                    <Eye className="h-3 w-3" />
                    <span>Lihat</span>
                  </button>

                  <button
                    onClick={() => handleOpenDetail('langsung', item, true)}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 text-xs font-bold shadow-2xs transition cursor-pointer"
                    title="Edit data pengadaan"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPBJ('langsung', item)}
                    className="flex items-center gap-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 text-xs font-bold shadow-2xs transition cursor-pointer"
                    title="Unduh berkas SPK / PBJ"
                  >
                    <Download className="h-3 w-3" />
                    <span>Unduh</span>
                  </button>

                  {onDeleteLangsung && (
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus paket pengadaan "${item.noKontrak}"?`)) {
                          onDeleteLangsung(item.id);
                        }
                      }}
                      className="p-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Hapus paket ini"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Grid 4 Kolom Keuangan Otomatis */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Pagu Anggaran</span>
                  <span className="font-bold text-slate-800 text-sm">{formatRupiah(item.paguAnggaran)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-700 block uppercase font-bold">Nilai Kontrak</span>
                  <span className="font-extrabold text-amber-900 text-sm">{formatRupiah(item.besaranNilaiKontrak)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Sisa Pagu</span>
                  <span className="font-bold text-slate-800 text-sm">{formatRupiah(item.sisaAnggaranPagu)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 block uppercase font-bold">Sisa Kontrak</span>
                  <span className="font-extrabold text-emerald-800 text-sm">{formatRupiah(item.sisaKontrak)}</span>
                </div>
              </div>

              {/* Rincian 3 Termin Pembayaran */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Uang Muka ({item.uangMuka?.persentase}%)</span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                      {item.uangMuka?.status}
                    </span>
                  </div>
                  <p className="font-extrabold text-slate-900">{formatRupiah(item.uangMuka?.nilai || 0)}</p>
                  {item.uangMuka?.fileName && (
                    <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-mono">
                      <FileText className="h-3 w-3" />
                      {item.uangMuka.fileName}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Penyelesaian (BAP)</span>
                    <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-blue-800">
                      {item.pembayaranPenyelesaian?.status}
                    </span>
                  </div>
                  <p className="font-extrabold text-slate-900">{formatRupiah(item.pembayaranPenyelesaian?.nilai || 0)}</p>
                  {item.pembayaranPenyelesaian?.fileName && (
                    <span className="text-[10px] text-blue-700 flex items-center gap-1 font-mono">
                      <FileText className="h-3 w-3" />
                      {item.pembayaranPenyelesaian.fileName}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Retensi ({item.retensi?.persentase}%)</span>
                    <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[10px] font-bold text-amber-800">
                      {item.retensi?.status}
                    </span>
                  </div>
                  <p className="font-extrabold text-slate-900">{formatRupiah(item.retensi?.nilai || 0)}</p>
                  {item.retensi?.fileName && (
                    <span className="text-[10px] text-amber-700 flex items-center gap-1 font-mono">
                      <FileText className="h-3 w-3" />
                      {item.retensi.fileName}
                    </span>
                  )}
                </div>
              </div>

              {/* Data Penyedia & Pelaksana */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <Building className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Penyedia & Penanggung Jawab</span>
                    <p className="font-bold text-slate-800">{item.penyedia} ({item.penanggungJawab})</p>
                    <p className="text-[11px] text-slate-500">{item.alamatPenyedia} • HP: {item.noHpPenyedia}</p>
                    <p className="text-[11px] text-slate-500 font-mono">NPWP: {item.npwp}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Pelaksana Lapangan & Masa Kontrak</span>
                    <p className="font-bold text-slate-800">{item.namaPelaksana} (HP: {item.noHpPelaksana})</p>
                    <p className="text-[11px] text-slate-500">Masa Kontrak: {item.masaKontrak}</p>
                    <p className="text-[11px] text-slate-500">Volume: {item.volumePekerjaan}</p>
                  </div>
                </div>
              </div>

              {/* Usulan Proposal Masyarakat Terintegrasi */}
              {item.linkedProposalId && (() => {
                const connectedProp = proposals.find((p) => p.id === item.linkedProposalId);
                if (!connectedProp) return null;
                const isPropDone =
                  connectedProp.status === 'Sudah Dilaksanakan / Selesai' ||
                  connectedProp.status === 'Tersalurkan / Selesai';

                return (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-300 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                        <Link2 className="h-4 w-4 text-emerald-700" />
                        <span>Usulan Terintegrasi: {connectedProp.kelompokTani}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPropDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {connectedProp.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 line-clamp-1">
                        "{connectedProp.namaUsulan}" ({connectedProp.desa}, Kec. {connectedProp.kecamatan})
                      </p>
                    </div>

                    {!isPropDone && onMarkProposalExecuted && (
                      <button
                        type="button"
                        onClick={() => onMarkProposalExecuted(connectedProp.id, item.noKontrak)}
                        className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 text-xs shadow-xs transition self-start sm:self-auto shrink-0 cursor-pointer"
                      >
                        Tandai Proposal Selesai Dilaksanakan
                      </button>
                    )}
                  </div>
                );
              })()}

            </div>
          ))}
        </div>
      )}

      {/* Content for E-Purchasing */}
      {subTab === 'epurchasing' && (
        <div className="space-y-3">
          {epurchasingList.map((item) => (
            <div
              key={item.id}
              className="rounded-xl glass-panel p-4 shadow-sm border border-slate-200/90 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-900 border border-cyan-300">
                      E-PURCHASING (KATALOG)
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {item.noKontrak}
                    </span>
                    {item.kodeRup && (
                      <span className="text-[11px] font-mono text-slate-400">
                        ({item.kodeRup})
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {item.uraianKegiatan}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 self-start">
                  <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800">
                    {item.status}
                  </span>

                  <button
                    onClick={() => handleOpenDetail('epurchasing', item, false)}
                    className="flex items-center gap-1 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white px-2.5 py-1 text-xs font-bold shadow-2xs transition cursor-pointer"
                    title="Lihat detail pesanan katalog"
                  >
                    <Eye className="h-3 w-3" />
                    <span>Lihat</span>
                  </button>

                  <button
                    onClick={() => handleOpenDetail('epurchasing', item, true)}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 text-xs font-bold shadow-2xs transition cursor-pointer"
                    title="Edit pesanan katalog"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPBJ('epurchasing', item)}
                    className="flex items-center gap-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 text-xs font-bold shadow-2xs transition cursor-pointer"
                    title="Unduh berkas ringkasan E-Purchasing"
                  >
                    <Download className="h-3 w-3" />
                    <span>Unduh</span>
                  </button>

                  {onDeleteEPurchasing && (
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus paket e-purchasing "${item.noKontrak}"?`)) {
                          onDeleteEPurchasing(item.id);
                        }
                      }}
                      className="p-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Hapus paket ini"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Nilai Pembayaran & Anggaran */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-cyan-50/50 p-4 rounded-xl border border-cyan-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Pagu Anggaran</span>
                  <span className="font-bold text-slate-800">{formatRupiah(item.paguAnggaran)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">HPS</span>
                  <span className="font-bold text-slate-800">{formatRupiah(item.hps)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-cyan-800 block uppercase font-bold">Negosiasi Katalog</span>
                  <span className="font-bold text-cyan-950">{formatRupiah(item.negosiasi)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 block uppercase font-bold">Nilai Pembayaran</span>
                  <span className="font-extrabold text-emerald-800">{formatRupiah(item.pembayaran)}</span>
                </div>
              </div>

              {/* Rincian Penyedia & Volume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Penyedia Katalog</span>
                  <p className="font-bold text-slate-800">{item.penyedia} ({item.penanggungjawab})</p>
                  <p className="text-[11px] text-slate-500">{item.alamatPenyedia} • HP: {item.noHp}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Volume & Masa Pengiriman</span>
                  <p className="font-bold text-slate-800">{item.volumePekerjaan}</p>
                  <p className="text-[11px] text-slate-500">Masa Kontrak: {item.masaKontrak}</p>
                </div>
              </div>

              {/* Dokumen Pendukung */}
              {item.dokumenPendukung && item.dokumenPendukung.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Dokumen Pendukung:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.dokumenPendukung.map((doc: any, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-700 border border-slate-200"
                      >
                        <FileText className="h-3.5 w-3.5 text-cyan-600" />
                        <span>{doc.name}</span>
                        <span className="text-[10px] text-slate-400">({doc.size})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Modal Detail & Edit PBJ */}
      {detailItem && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            {/* Header */}
            <div className={`flex items-center justify-between border-b border-slate-200 px-5 py-4 text-white ${
              detailItem.type === 'langsung'
                ? 'bg-gradient-to-r from-amber-700 to-amber-900'
                : 'bg-gradient-to-r from-cyan-800 to-cyan-950'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white text-slate-900 shadow-sm">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {isEditing ? 'Edit Data Pengadaan' : 'Rincian Lengkap Paket Pengadaan'}
                  </h2>
                  <p className="text-xs text-slate-200">
                    No. Kontrak: {detailItem.item.noKontrak}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 rounded-lg bg-white/15 hover:bg-white/25 text-white px-2.5 py-1.5 text-xs font-bold transition cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                )}
                <button
                  onClick={() => setDetailItem(null)}
                  className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              {isEditing ? (
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Uraian Kegiatan</label>
                    <input
                      type="text"
                      required
                      value={editForm.uraianKegiatan}
                      onChange={(e) => setEditForm({ ...editForm, uraianKegiatan: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nomor Kontrak</label>
                      <input
                        type="text"
                        required
                        value={editForm.noKontrak}
                        onChange={(e) => setEditForm({ ...editForm, noKontrak: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kode RUP</label>
                      <input
                        type="text"
                        value={editForm.kodeRup || ''}
                        onChange={(e) => setEditForm({ ...editForm, kodeRup: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Penyedia</label>
                      <input
                        type="text"
                        required
                        value={editForm.penyedia}
                        onChange={(e) => setEditForm({ ...editForm, penyedia: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {detailItem.type === 'langsung' ? 'Penanggung Jawab' : 'Penanggung Jawab Katalog'}
                      </label>
                      <input
                        type="text"
                        value={detailItem.type === 'langsung' ? editForm.penanggungJawab : editForm.penanggungjawab}
                        onChange={(e) => {
                          if (detailItem.type === 'langsung') {
                            setEditForm({ ...editForm, penanggungJawab: e.target.value });
                          } else {
                            setEditForm({ ...editForm, penanggungjawab: e.target.value });
                          }
                        }}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Pagu Anggaran (Rp)</label>
                      <input
                        type="number"
                        value={editForm.paguAnggaran}
                        onChange={(e) => setEditForm({ ...editForm, paguAnggaran: Number(e.target.value) })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {detailItem.type === 'langsung' ? 'Nilai Kontrak (Rp)' : 'Nilai Pembayaran (Rp)'}
                      </label>
                      <input
                        type="number"
                        value={detailItem.type === 'langsung' ? editForm.besaranNilaiKontrak : editForm.pembayaran}
                        onChange={(e) => {
                          if (detailItem.type === 'langsung') {
                            setEditForm({ ...editForm, besaranNilaiKontrak: Number(e.target.value) });
                          } else {
                            setEditForm({ ...editForm, pembayaran: Number(e.target.value) });
                          }
                        }}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status Paket</label>
                      <input
                        type="text"
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Masa Kontrak</label>
                      <input
                        type="text"
                        value={editForm.masaKontrak}
                        onChange={(e) => setEditForm({ ...editForm, masaKontrak: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      <span>Simpan Perubahan</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Uraian Paket Pengadaan:</span>
                    <strong className="text-sm text-slate-900 block">{detailItem.item.uraianKegiatan}</strong>
                    <span className="text-slate-500 font-mono text-[11px] block mt-0.5">
                      No: {detailItem.item.noKontrak} {detailItem.item.kodeRup && `(RUP: ${detailItem.item.kodeRup})`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Pagu</span>
                      <span className="font-bold text-slate-900">{formatRupiah(detailItem.item.paguAnggaran)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">HPS</span>
                      <span className="font-bold text-slate-900">{formatRupiah(detailItem.item.hps)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 block uppercase font-bold">Negosiasi</span>
                      <span className="font-bold text-amber-950">{formatRupiah(detailItem.item.negosiasi)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-700 block uppercase font-bold">
                        {detailItem.type === 'langsung' ? 'Kontrak' : 'Pembayaran'}
                      </span>
                      <span className="font-extrabold text-emerald-800">
                        {formatRupiah(detailItem.type === 'langsung' ? detailItem.item.besaranNilaiKontrak : detailItem.item.pembayaran)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Penyedia:</span>
                      <strong className="text-slate-900">{detailItem.item.penyedia}</strong>
                      <p className="text-slate-600 text-[11px]">{detailItem.item.alamatPenyedia}</p>
                      <p className="text-slate-500 text-[10px] font-mono">NPWP: {detailItem.item.npwp}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Status & Masa:</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-block mb-1">
                        {detailItem.item.status}
                      </span>
                      <p className="text-slate-600 text-[11px]">Masa: {detailItem.item.masaKontrak}</p>
                      <p className="text-slate-600 text-[11px]">Volume: {detailItem.item.volumePekerjaan}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <button
                      onClick={() => handleDownloadPBJ(detailItem.type, detailItem.item)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      <span>Unduh Lembar SPK / PBJ (.TXT)</span>
                    </button>

                    <button
                      onClick={() => setDetailItem(null)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
