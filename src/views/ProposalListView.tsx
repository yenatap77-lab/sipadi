/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ScrollText,
  Plus,
  MapPin,
  Globe,
  Link2,
  CheckCircle2,
  List,
  LayoutGrid,
  Download,
  Trash2,
  Eye,
  Edit3,
  X,
  ExternalLink,
  Save,
  QrCode,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { ProposalItem, PBJLangsungItem, PBJEPurchasingItem } from '../types';
import { formatDateIndo } from '../utils/formatters';
import { KopSuratMorowali } from '../components/KopSuratMorowali';
import { LogoKabupatenMorowali } from '../components/LogoKabupatenMorowali';
import { generateQRCodeDataURL, createProposalQRPayload, downloadQRCodeImage } from '../utils/qrCodeGenerator';

interface ProposalListViewProps {
  proposals: ProposalItem[];
  pbjLangsungList: PBJLangsungItem[];
  pbjEPurchasingList: PBJEPurchasingItem[];
  onOpenNewProposalModal: (bidang?: 'tph' | 'psp' | 'peternakan' | 'perkebunan') => void;
  onUpdateProposal: (updated: ProposalItem) => void;
  onDeleteProposal?: (id: string) => void;
}

export const ProposalListView: React.FC<ProposalListViewProps> = ({
  proposals,
  pbjLangsungList,
  pbjEPurchasingList,
  onOpenNewProposalModal,
  onUpdateProposal,
  onDeleteProposal,
}) => {
  const [selectedBidang, setSelectedBidang] = useState<string>('semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('semua');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Quick penyaluran modal
  const [targetProposalForPBJ, setTargetProposalForPBJ] = useState<ProposalItem | null>(null);
  const [selectedPbjId, setSelectedPbjId] = useState('');
  const [tanggalPenyaluran, setTanggalPenyaluran] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [catatanPenyaluran, setCatatanPenyaluran] = useState('');

  // Proposal Detail & Edit Modal
  const [detailProposal, setDetailProposal] = useState<ProposalItem | null>(null);
  const [isEditingProposal, setIsEditingProposal] = useState(false);
  const [editForm, setEditForm] = useState<ProposalItem | null>(null);
  const [proposalQrUrl, setProposalQrUrl] = useState<string>('');

  const filtered = proposals.filter((p) => {
    const matchBidang = selectedBidang === 'semua' || p.bidang === selectedBidang;
    const matchStatus = selectedStatus === 'semua' || p.status === selectedStatus;
    return matchBidang && matchStatus;
  });

  const handleOpenDetail = (item: ProposalItem, editMode: boolean = false) => {
    setDetailProposal(item);
    setEditForm({ ...item });
    setIsEditingProposal(editMode);
    
    // Generate QR Code for this proposal
    const payload = createProposalQRPayload(item);
    generateQRCodeDataURL(payload, { width: 300, margin: 1 })
      .then((url) => setProposalQrUrl(url))
      .catch(console.error);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    const updated: ProposalItem = {
      ...editForm,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProposal(updated);
    setDetailProposal(updated);
    setIsEditingProposal(false);
  };

  // Single Proposal Download: generate official verification slip
  const handleDownloadProposal = (item: ProposalItem) => {
    let report = `========================================================\n`;
    report += `DINAS PERTANIAN DAN KETAHANAN PANGAN\n`;
    report += `LEMBAR HASIL VERIFIKASI PROPOSAL KELOMPOK TANI\n`;
    report += `SISTEM INFORMASI PERTANIAN & ADMINISTRASI DIGITAL (SIPADI)\n`;
    report += `========================================================\n\n`;
    report += `TANGGAL CETAK   : ${new Date().toLocaleString('id-ID')}\n`;
    report += `ID PROPOSAL     : ${item.id}\n`;
    report += `BIDANG TUJUAN   : ${item.bidang.toUpperCase()}\n`;
    report += `NAMA USULAN     : ${item.namaUsulan}\n`;
    report += `PERMOHONAN      : ${item.permohonan || '-'}\n`;
    report += `KELOMPOK TANI   : ${item.kelompokTani}\n`;
    report += `KETUA KELOMPOK  : ${item.ketua}\n`;
    report += `NIK KETUA       : ${item.nik || '-'}\n`;
    report += `KONTAK / HP     : ${item.noHp || '-'}\n`;
    report += `WILAYAH         : Desa ${item.desa}, Kec. ${item.kecamatan}\n`;
    report += `JUMLAH ANGGOTA  : ${item.jumlahAnggotaKelompok} Orang\n`;
    report += `LUAS LAHAN      : ${item.luasLahan} Ha\n`;
    report += `VOLUME USULAN   : ${item.jumlahUsulan}\n`;
    report += `STATUS PROPOSAL : ${item.status}\n`;
    report += `TANGGAL MASUK   : ${formatDateIndo(item.createdAt)}\n`;

    if (item.titikKoordinat) {
      report += `TITIK GPS       : Lat ${item.titikKoordinat.lat}, Lng ${item.titikKoordinat.lng}\n`;
      report += `GOOGLE MAPS     : https://www.google.com/maps?q=${item.titikKoordinat.lat},${item.titikKoordinat.lng}\n`;
    }

    if (item.terintegrasiPbj) {
      report += `\nINTEGRASI PENGADAAN (PBJ):\n`;
      report += `- Tipe Pengadaan: ${item.pbjTipe || '-'}\n`;
      report += `- Nomor Kontrak : ${item.nomorKontrakPbj || '-'}\n`;
      report += `- Tgl Penyaluran: ${item.tanggalPenyaluran || '-'}\n`;
      report += `- Catatan BAST  : ${item.catatanPenyaluran || '-'}\n`;
    }

    report += `\n========================================================\nDokumen resmi tersimpan dalam sistem SIPADI DIGITAL.\n========================================================\n`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proposal_${item.kelompokTani.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Bulk CSV Export
  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const header = [
      'No',
      'Tanggal Masuk',
      'Bidang',
      'Nama Usulan',
      'Permohonan',
      'Kelompok Tani',
      'Ketua',
      'NIK',
      'No HP',
      'Desa',
      'Kecamatan',
      'Jumlah Anggota',
      'Luas Lahan (Ha)',
      'Volume Usulan',
      'Status Usulan',
      'Terintegrasi PBJ',
      'Nomor Kontrak PBJ',
      'Tgl Penyaluran',
      'Lat',
      'Lng',
    ];
    const rows = filtered.map((p, idx) => [
      idx + 1,
      p.createdAt ? p.createdAt.split('T')[0] : '',
      p.bidang.toUpperCase(),
      `"${p.namaUsulan.replace(/"/g, '""')}"`,
      `"${(p.permohonan || '').replace(/"/g, '""')}"`,
      `"${p.kelompokTani.replace(/"/g, '""')}"`,
      `"${p.ketua.replace(/"/g, '""')}"`,
      `"${p.nik || ''}"`,
      `"${p.noHp || ''}"`,
      `"${p.desa}"`,
      `"${p.kecamatan}"`,
      p.jumlahAnggotaKelompok,
      p.luasLahan,
      `"${p.jumlahUsulan}"`,
      `"${p.status}"`,
      p.terintegrasiPbj ? 'Ya' : 'Tidak',
      `"${p.nomorKontrakPbj || ''}"`,
      `"${p.tanggalPenyaluran || ''}"`,
      p.titikKoordinat?.lat || '',
      p.titikKoordinat?.lng || '',
    ]);

    const csvContent = '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Proposal_SIPADI_${selectedBidang}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConfirmPenyaluran = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProposalForPBJ) return;

    let nomorKontrak = '';
    let tipePBJ: 'Pengadaan Langsung' | 'E-Purchasing' = 'Pengadaan Langsung';

    const pl = pbjLangsungList.find((x) => x.id === selectedPbjId);
    if (pl) {
      nomorKontrak = pl.noKontrak;
      tipePBJ = 'Pengadaan Langsung';
    } else {
      const ep = pbjEPurchasingList.find((x) => x.id === selectedPbjId);
      if (ep) {
        nomorKontrak = ep.noKontrak;
        tipePBJ = 'E-Purchasing';
      }
    }

    const updated: ProposalItem = {
      ...targetProposalForPBJ,
      status: 'Sudah Dilaksanakan / Selesai',
      terintegrasiPbj: true,
      pbjTipe: tipePBJ,
      nomorKontrakPbj: nomorKontrak || 'SPK/KONTRAK-DISTAN-2026',
      tanggalPenyaluran,
      catatanPenyaluran: catatanPenyaluran || 'Barang/jasa bantuan telah diserahterimakan kepada kelompok tani.',
      updatedAt: new Date().toISOString(),
    };

    onUpdateProposal(updated);
    setTargetProposalForPBJ(null);
  };

  return (
    <div className="space-y-4">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl glass-panel p-4 sm:p-5 shadow-lg border-l-4 border-l-amber-500">
        <div>
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">
            <ScrollText className="h-4 w-4" />
            <span>Aspirasi & Usulan Masyarakat</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Proposal Kelompok Tani
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Terintegrasi otomatis dengan pengadaan barang & jasa (PBJ), Google Maps, dan Google Earth.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3.5 py-2.5 text-xs font-bold text-amber-900 shadow-2xs transition shrink-0 cursor-pointer"
            title="Unduh rekap seluruh proposal ke format CSV"
          >
            <Download className="h-4 w-4" />
            <span>Unduh Rekap (.CSV)</span>
          </button>

          <button
            onClick={() => onOpenNewProposalModal()}
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2.5 text-xs font-bold text-white shadow-md transition shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Input Usulan Proposal</span>
          </button>
        </div>
      </div>

      {/* Filter Row & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-bold text-slate-500">Bidang:</span>
          {['semua', 'psp', 'tph', 'peternakan', 'perkebunan'].map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBidang(b)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition cursor-pointer ${
                selectedBidang === b
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b === 'semua' ? 'Semua Bidang' : b.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="semua">Semua Status</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Masuk PBJ">Masuk Perencanaan PBJ</option>
            <option value="Sudah Dilaksanakan / Selesai">Sudah Dilaksanakan / Selesai</option>
            <option value="Tersalurkan / Selesai">Tersalurkan</option>
          </select>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 ml-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-amber-900 shadow-xs'
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
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Kartu"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Kartu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Proposals View */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl glass-panel p-10 text-center text-slate-400">
          <ScrollText className="h-10 w-10 mx-auto text-slate-300 stroke-1 mb-2" />
          <p className="text-xs">Tidak ada proposal yang sesuai filter.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* TAMPILAN TABEL RAMPING MEMANJANG (COMPACT ROWS) */
        <div className="rounded-2xl glass-panel shadow-md overflow-hidden border border-slate-200/90 bg-white/95">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] whitespace-nowrap">
              <thead className="bg-[#241d0e] text-amber-100 font-bold uppercase text-[9.5px] tracking-wider border-b border-amber-950">
                <tr>
                  <th className="px-2 py-1.5 text-center w-8">No</th>
                  <th className="px-2 py-1.5">Tgl Masuk</th>
                  <th className="px-2 py-1.5">Bidang</th>
                  <th className="px-2.5 py-1.5">Nama Usulan & Permohonan</th>
                  <th className="px-2.5 py-1.5">Kelompok Tani</th>
                  <th className="px-2 py-1.5">Lokasi (Desa/Kec)</th>
                  <th className="px-2 py-1.5">Ketua & Kontak</th>
                  <th className="px-2 py-1.5">Volume / Luas</th>
                  <th className="px-2 py-1.5 text-center">Status Usulan</th>
                  <th className="px-2 py-1.5 text-center">Peta</th>
                  <th className="px-2 py-1.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((item, idx) => {
                  const isTersalurkan =
                    item.status === 'Sudah Dilaksanakan / Selesai' || item.status === 'Tersalurkan / Selesai';
                  const mapsUrl = `https://www.google.com/maps?q=${item.titikKoordinat.lat},${item.titikKoordinat.lng}`;
                  const earthUrl = `https://earth.google.com/web/search/${item.titikKoordinat.lat},${item.titikKoordinat.lng}`;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/60 transition h-8 cursor-pointer"
                      onClick={() => handleOpenDetail(item, false)}
                    >
                      <td className="px-2 py-1 text-center font-mono text-[10px] text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="px-2 py-1 font-mono text-[10px] text-slate-600">
                        {formatDateIndo(item.createdAt)}
                      </td>
                      <td className="px-2 py-1">
                        <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-900 border border-amber-300 uppercase">
                          {item.bidang}
                        </span>
                      </td>
                      <td className="px-2.5 py-1 max-w-xs truncate">
                        <span className="font-bold text-slate-900 block truncate">
                          {item.namaUsulan}
                        </span>
                        {item.permohonan && (
                          <span className="text-[10px] text-slate-500 truncate block">
                            {item.permohonan}
                          </span>
                        )}
                      </td>
                      <td className="px-2.5 py-1 font-semibold text-slate-800">
                        {item.kelompokTani}
                      </td>
                      <td className="px-2 py-1 text-[10px] text-slate-600">
                        {item.desa}, {item.kecamatan}
                      </td>
                      <td className="px-2 py-1 text-[10px] text-slate-600 font-mono">
                        <span>{item.ketua}</span>
                        {item.noHp && <span className="text-[9px] text-slate-400 ml-1">({item.noHp})</span>}
                      </td>
                      <td className="px-2 py-1 text-[10px] text-slate-700">
                        <span className="font-bold">{item.jumlahUsulan}</span>
                        {item.luasLahan > 0 && <span className="text-slate-400 ml-1 font-mono">({item.luasLahan} Ha)</span>}
                      </td>
                      <td className="px-2 py-1 text-center">
                        <span
                          className={`inline-flex rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                            isTersalurkan
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {isTersalurkan ? 'Tersalurkan' : item.status}
                        </span>
                      </td>
                      <td className="px-2 py-1 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition border border-emerald-200"
                            title="Buka Google Maps"
                          >
                            <MapPin className="h-2.5 w-2.5" />
                          </a>
                          <a
                            href={earthUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-0.5 rounded bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white transition border border-teal-200"
                            title="Buka Google Earth"
                          >
                            <Globe className="h-2.5 w-2.5" />
                          </a>
                        </div>
                      </td>
                      <td className="px-2 py-1 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenDetail(item, false)}
                            className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Lihat Kode QR & Lembar Resmi Morowali"
                          >
                            <QrCode className="h-2.5 w-2.5" />
                            <span>QR</span>
                          </button>
                          <button
                            onClick={() => handleOpenDetail(item, false)}
                            className="flex items-center gap-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Lihat detail proposal"
                          >
                            <Eye className="h-2.5 w-2.5" />
                            <span>Lihat</span>
                          </button>
                          <button
                            onClick={() => handleOpenDetail(item, true)}
                            className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Edit data proposal"
                          >
                            <Edit3 className="h-2.5 w-2.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDownloadProposal(item)}
                            className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Unduh lembar verifikasi proposal"
                          >
                            <Download className="h-2.5 w-2.5" />
                            <span>Unduh</span>
                          </button>
                          {!isTersalurkan && (
                            <button
                              type="button"
                              onClick={() => setTargetProposalForPBJ(item)}
                              className="rounded bg-teal-600 hover:bg-teal-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                              title="Salurkan ke PBJ"
                            >
                              PBJ
                            </button>
                          )}
                          {onDeleteProposal && (
                            <button
                              onClick={() => {
                                if (confirm(`Yakin ingin menghapus proposal "${item.namaUsulan}"?`)) {
                                  onDeleteProposal(item.id);
                                }
                              }}
                              className="p-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="Hapus proposal ini"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                            </button>
                          )}
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
        /* TAMPILAN KARTU RAMPING */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((item) => {
            const isTersalurkan =
              item.status === 'Sudah Dilaksanakan / Selesai' || item.status === 'Tersalurkan / Selesai';
            const mapsUrl = `https://www.google.com/maps?q=${item.titikKoordinat.lat},${item.titikKoordinat.lng}`;
            const earthUrl = `https://earth.google.com/web/search/${item.titikKoordinat.lat},${item.titikKoordinat.lng}`;

            return (
              <div
                key={item.id}
                className={`rounded-xl glass-panel p-4 shadow-sm border transition space-y-3 flex flex-col justify-between ${
                  isTersalurkan
                    ? 'border-emerald-400 bg-emerald-50/40'
                    : 'border-slate-200/90'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-900 border border-amber-300 uppercase">
                          {item.bidang}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {item.kelompokTani}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          ({item.desa}, {item.kecamatan})
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                        {item.namaUsulan}
                      </h3>
                    </div>

                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold shrink-0 ${
                        isTersalurkan
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 bg-white/70 p-2.5 rounded-lg border border-slate-100 space-y-1">
                    <p className="text-[11px]"><strong>Permohonan:</strong> {item.permohonan || item.namaUsulan}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[10px] text-slate-600">
                      <div>Ketua: <strong>{item.ketua}</strong></div>
                      <div>HP: <strong>{item.noHp || '-'}</strong></div>
                      <div>Volume: <strong>{item.jumlahUsulan}</strong></div>
                      <div>Lahan: <strong>{item.luasLahan} Ha</strong></div>
                      <div>Masuk: <strong>{formatDateIndo(item.createdAt)}</strong></div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white px-2 py-0.5 text-[11px] font-semibold transition border border-blue-200"
                    >
                      <MapPin className="h-3 w-3" />
                      <span>Maps</span>
                    </a>
                    <a
                      href={earthUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white px-2 py-0.5 text-[11px] font-semibold transition border border-teal-200"
                    >
                      <Globe className="h-3 w-3" />
                      <span>Earth</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenDetail(item, false)}
                      className="flex items-center gap-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Lihat</span>
                    </button>
                    <button
                      onClick={() => handleOpenDetail(item, true)}
                      className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDownloadProposal(item)}
                      className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>Unduh</span>
                    </button>
                    {!isTersalurkan ? (
                      <button
                        type="button"
                        onClick={() => setTargetProposalForPBJ(item)}
                        className="rounded bg-teal-600 hover:bg-teal-700 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                      >
                        Salurkan PBJ
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-0.5">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Selesai</span>
                      </span>
                    )}
                    {onDeleteProposal && (
                      <button
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus proposal "${item.namaUsulan}"?`)) {
                            onDeleteProposal(item.id);
                          }
                        }}
                        className="p-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail & Edit Proposal */}
      {detailProposal && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-amber-600 to-amber-800 px-5 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white text-amber-700 shadow-sm">
                  <ScrollText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {isEditingProposal ? 'Edit Proposal Kelompok Tani' : 'Rincian Lengkap Proposal'}
                  </h2>
                  <p className="text-xs text-amber-100">
                    Bidang {detailProposal.bidang.toUpperCase()} • Desa {detailProposal.desa}, Kec. {detailProposal.kecamatan}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isEditingProposal && (
                  <button
                    onClick={() => setIsEditingProposal(true)}
                    className="flex items-center gap-1 rounded-lg bg-white/15 hover:bg-white/25 text-white px-2.5 py-1.5 text-xs font-bold transition cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                )}
                <button
                  onClick={() => setDetailProposal(null)}
                  className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {isEditingProposal ? (
                <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nama Usulan / Kegiatan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.namaUsulan}
                      onChange={(e) => setEditForm({ ...editForm, namaUsulan: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Rincian Permohonan
                    </label>
                    <textarea
                      rows={2}
                      value={editForm.permohonan}
                      onChange={(e) => setEditForm({ ...editForm, permohonan: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kelompok Tani</label>
                      <input
                        type="text"
                        required
                        value={editForm.kelompokTani}
                        onChange={(e) => setEditForm({ ...editForm, kelompokTani: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Ketua</label>
                      <input
                        type="text"
                        required
                        value={editForm.ketua}
                        onChange={(e) => setEditForm({ ...editForm, ketua: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIK Ketua</label>
                      <input
                        type="text"
                        value={editForm.nik}
                        onChange={(e) => setEditForm({ ...editForm, nik: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kontak / No HP</label>
                      <input
                        type="text"
                        value={editForm.noHp}
                        onChange={(e) => setEditForm({ ...editForm, noHp: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kecamatan</label>
                      <input
                        type="text"
                        required
                        value={editForm.kecamatan}
                        onChange={(e) => setEditForm({ ...editForm, kecamatan: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Desa</label>
                      <input
                        type="text"
                        required
                        value={editForm.desa}
                        onChange={(e) => setEditForm({ ...editForm, desa: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Volume Usulan</label>
                      <input
                        type="text"
                        required
                        value={editForm.jumlahUsulan}
                        onChange={(e) => setEditForm({ ...editForm, jumlahUsulan: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Luas Lahan (Ha)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.luasLahan}
                        onChange={(e) => setEditForm({ ...editForm, luasLahan: Number(e.target.value) })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status Usulan</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs bg-white font-semibold"
                      >
                        <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                        <option value="Disetujui">Disetujui</option>
                        <option value="Masuk PBJ">Masuk PBJ</option>
                        <option value="Sudah Dilaksanakan / Selesai">Sudah Dilaksanakan / Selesai</option>
                        <option value="Tersalurkan / Selesai">Tersalurkan / Selesai</option>
                        <option value="Ditolak">Ditolak</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Jumlah Anggota (Org)</label>
                      <input
                        type="number"
                        value={editForm.jumlahAnggotaKelompok}
                        onChange={(e) => setEditForm({ ...editForm, jumlahAnggotaKelompok: Number(e.target.value) })}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => setIsEditingProposal(false)}
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
                  
                  {/* Official Sheet Paper with Morowali Letterhead */}
                  <div className="rounded-2xl border border-slate-300 bg-white p-5 sm:p-6 shadow-sm space-y-4">
                    {/* Kop Surat Pemerintah Kabupaten Morowali */}
                    <KopSuratMorowali
                      compact={true}
                      documentTitle="LEMBAR VERIFIKASI & REGISTRASI PROPOSAL KELOMPOK TANI"
                      nomorRegistrasi={detailProposal.id}
                      documentSubtitle="Sistem Informasi Pertanian dan Administrasi Digital (SIPADI)"
                    />

                    {/* Status & Category Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                      <div>
                        <span className="text-[10px] text-amber-800 uppercase font-bold block">Status Usulan</span>
                        <span className="font-extrabold text-sm text-amber-950">{detailProposal.status}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-200/80 text-amber-950 font-bold text-xs uppercase">
                        Bidang {detailProposal.bidang}
                      </span>
                    </div>

                    {/* Core Details with QR Code Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      
                      {/* Left: QR Code Box with Morowali Logo */}
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-center">
                        <div className="relative p-2 rounded-lg bg-white shadow-xs border border-slate-200 mb-1.5">
                          {proposalQrUrl ? (
                            <img
                              src={proposalQrUrl}
                              alt="QR Code Proposal Morowali"
                              className="w-32 h-32 object-contain rounded"
                            />
                          ) : (
                            <div className="w-32 h-32 flex items-center justify-center text-xs text-slate-400">
                              Membuat QR...
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="p-0.5 rounded-lg bg-white/95 shadow-xs border border-amber-400 flex flex-col items-center justify-center">
                              <LogoKabupatenMorowali size={20} />
                              <span className="text-[6.5px] font-black text-slate-900 leading-none">
                                MOROWALI
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[9.5px] font-bold text-amber-950 uppercase block">
                          Pindai Verifikasi
                        </span>
                        <span className="text-[8px] font-bold text-emerald-800 block">
                          DINAS PERTANIAN DAERAH
                        </span>
                        <p className="text-[8.5px] text-slate-500 font-mono">
                          {detailProposal.id}
                        </p>

                        <button
                          type="button"
                          onClick={() => proposalQrUrl && downloadQRCodeImage(proposalQrUrl, `QR_PROPOSAL_${detailProposal.id}.png`)}
                          className="mt-2 text-[10px] font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="h-3 w-3" />
                          <span>Unduh Gambar QR</span>
                        </button>
                      </div>

                      {/* Right: Data Table */}
                      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <div className="sm:col-span-2">
                          <span className="text-slate-400 block text-[10px]">Nama Usulan:</span>
                          <strong className="text-slate-900 text-sm">{detailProposal.namaUsulan}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Kelompok Tani:</span>
                          <strong className="text-slate-900">{detailProposal.kelompokTani}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Ketua / NIK:</span>
                          <span className="text-slate-800">{detailProposal.ketua} ({detailProposal.nik || '-'})</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">No HP:</span>
                          <span className="text-slate-800 font-mono">{detailProposal.noHp || '-'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Wilayah:</span>
                          <span className="text-slate-800">Desa {detailProposal.desa}, Kec. {detailProposal.kecamatan}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Volume & Luas:</span>
                          <span className="text-slate-800 font-bold">{detailProposal.jumlahUsulan} ({detailProposal.luasLahan} Ha)</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Jumlah Anggota:</span>
                          <span className="text-slate-800">{detailProposal.jumlahAnggotaKelompok} Orang</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-slate-400 block text-[10px]">Tanggal Masuk Registrasi:</span>
                          <span className="text-slate-800 font-mono">{formatDateIndo(detailProposal.createdAt)}</span>
                        </div>
                      </div>

                    </div>

                    {/* Uraian Permohonan */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="text-slate-500 font-bold block mb-1">Rincian Permohonan / Usulan:</span>
                      <p className="text-slate-700 leading-relaxed">{detailProposal.permohonan || detailProposal.namaUsulan}</p>
                    </div>

                    {/* Coordinates & Map Preview */}
                    {detailProposal.titikKoordinat && (
                      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-emerald-700 shrink-0" />
                          <div>
                            <span className="font-bold text-emerald-900 block">Koordinat Lokasi Pertanian:</span>
                            <span className="font-mono text-emerald-700 text-[11px]">
                              Lat {detailProposal.titikKoordinat.lat}, Lng {detailProposal.titikKoordinat.lng}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`https://www.google.com/maps?q=${detailProposal.titikKoordinat.lat},${detailProposal.titikKoordinat.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 text-xs font-bold transition"
                          >
                            <MapPin className="h-3 w-3" />
                            <span>Google Maps</span>
                          </a>
                          <a
                            href={`https://earth.google.com/web/search/${detailProposal.titikKoordinat.lat},${detailProposal.titikKoordinat.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 rounded bg-teal-700 hover:bg-teal-800 text-white px-2.5 py-1 text-xs font-bold transition"
                          >
                            <Globe className="h-3 w-3" />
                            <span>Google Earth</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
                    {onDeleteProposal ? (
                      <button
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus proposal "${detailProposal.namaUsulan}"?`)) {
                            onDeleteProposal(detailProposal.id);
                            setDetailProposal(null);
                          }
                        }}
                        className="flex items-center gap-1 text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-bold cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus Proposal</span>
                      </button>
                    ) : <div />}

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 text-xs font-bold shadow-sm transition cursor-pointer"
                        title="Cetak lembar bukti tanda terima ber-Kop Morowali dan QR Code"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>Cetak Bukti (Kop & QR)</span>
                      </button>
                      <button
                        onClick={() => handleDownloadProposal(detailProposal)}
                        className="flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 text-xs font-bold shadow-sm transition cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Unduh File (.TXT)</span>
                      </button>
                      <button
                        onClick={() => setDetailProposal(null)}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Penyaluran PBJ Modal */}
      {targetProposalForPBJ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-emerald-800">
                <Link2 className="h-5 w-5" />
                <h3 className="font-bold text-base">Sinkronisasi Penyaluran PBJ</h3>
              </div>
              <button
                onClick={() => setTargetProposalForPBJ(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Menandai proposal <strong>"{targetProposalForPBJ.namaUsulan}"</strong> ({targetProposalForPBJ.kelompokTani}) sebagai <strong>Tersalurkan / Selesai</strong> melalui paket PBJ.
            </p>

            <form onSubmit={handleConfirmPenyaluran} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih Paket PBJ Terkait
                </label>
                <select
                  required
                  value={selectedPbjId}
                  onChange={(e) => setSelectedPbjId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs bg-white"
                >
                  <option value="">-- Pilih Paket Pengadaan --</option>
                  <optgroup label="Pengadaan Langsung (PL)">
                    {pbjLangsungList.map((p) => (
                      <option key={p.id} value={p.id}>
                        [PL] {p.noKontrak} - {p.uraianKegiatan.substring(0, 30)}...
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="E-Purchasing (Katalog)">
                    {pbjEPurchasingList.map((p) => (
                      <option key={p.id} value={p.id}>
                        [EKAT] {p.noKontrak} - {p.uraianKegiatan.substring(0, 30)}...
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tanggal Penyaluran / BAST
                </label>
                <input
                  type="date"
                  required
                  value={tanggalPenyaluran}
                  onChange={(e) => setTanggalPenyaluran(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Catatan Penyaluran & BAST
                </label>
                <textarea
                  rows={2}
                  placeholder="Barang/jasa bantuan telah diserahterimakan lengkap dengan Berita Acara..."
                  value={catatanPenyaluran}
                  onChange={(e) => setCatatanPenyaluran(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setTargetProposalForPBJ(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm cursor-pointer"
                >
                  Simpan & Tandai Tersalurkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
