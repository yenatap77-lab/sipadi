/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Wheat,
  Beef,
  Trees,
  Tractor,
  Plus,
  MapPin,
  Download,
  Trash2,
  List,
  LayoutGrid,
  Eye,
  Edit3,
} from 'lucide-react';
import {
  TPHLTTItem,
  TPHTanamanPanganItem,
  PeternakanPopulasiItem,
  PerkebunanKomoditiItem,
  PSPItem,
} from '../types';
import { TeknisDataType } from '../components/DetailTeknisModal';

interface TeknisListViewProps {
  targetBidang: 'tph' | 'peternakan' | 'perkebunan' | 'psp';
  tphLttList: TPHLTTItem[];
  tphPoktanList: TPHTanamanPanganItem[];
  peternakanList: PeternakanPopulasiItem[];
  perkebunanList: PerkebunanKomoditiItem[];
  pspList: PSPItem[];
  onOpenNewTeknisModal: (bidang: 'tph' | 'peternakan' | 'perkebunan' | 'psp') => void;
  onViewTeknisItem: (item: any, type: TeknisDataType) => void;
  onEditTeknisItem: (item: any, type: TeknisDataType) => void;
  onDeleteTeknisItem: (id: string, type: TeknisDataType) => void;
}

export const TeknisListView: React.FC<TeknisListViewProps> = ({
  targetBidang,
  tphLttList,
  tphPoktanList,
  peternakanList,
  perkebunanList,
  pspList,
  onOpenNewTeknisModal,
  onViewTeknisItem,
  onEditTeknisItem,
  onDeleteTeknisItem,
}) => {
  const [tphTab, setTphTab] = useState<'ltt' | 'poktan'>('ltt');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const getHeaderInfo = () => {
    switch (targetBidang) {
      case 'tph':
        return {
          title: 'Data Teknis Tanaman Pangan & Hortikultura (TPH)',
          sub: 'Laporan LTT (Luas Tambah Tanam), luas panen, fuso, provitas, dan data poktan lapangan.',
          badge: 'TPH',
          color: 'emerald',
          icon: <Wheat className="h-5 w-5" />,
        };
      case 'peternakan':
        return {
          title: 'Data Teknis Populasi Peternakan',
          sub: 'Pencatatan populasi ternak, rasio jantan/betina, status kandang, dan titik sentra peternakan rakyat.',
          badge: 'Peternakan',
          color: 'rose',
          icon: <Beef className="h-5 w-5" />,
        };
      case 'perkebunan':
        return {
          title: 'Data Teknis Komoditas Perkebunan',
          sub: 'Pendataan perkebunan rakyat, produksi tonase, jumlah tanaman produktif, dan kelompok tani binaan.',
          badge: 'Perkebunan',
          color: 'teal',
          icon: <Trees className="h-5 w-5" />,
        };
      case 'psp':
      default:
        return {
          title: 'Data Teknis Prasarana & Sarana Pertanian (PSP)',
          sub: 'Inventarisasi alsintan modern, jaringan irigasi tersier, dan pembangunan jalan usahatani (JUT).',
          badge: 'PSP',
          color: 'amber',
          icon: <Tractor className="h-5 w-5" />,
        };
    }
  };

  const info = getHeaderInfo();

  // Single Item Download: Generate official SIPADI document
  const handleDownloadItem = (item: any, type: TeknisDataType) => {
    let title = '';
    let content = `========================================================\nDINAS PERTANIAN DAN KETAHANAN PANGAN\nDOKUMEN RESMI HASIL INPUT DATA TEKNIS SIPADI\n========================================================\n\n`;
    content += `TANGGAL CETAK   : ${new Date().toLocaleString('id-ID')}\n`;

    if (type === 'tph-ltt') {
      title = `Data_LTT_${item.desa}_${item.jenisKomoditi}`;
      content += `KATEGORI        : Data LTT & Produksi Pangan (TPH)\n`;
      content += `WILAYAH         : Desa ${item.desa}, Kec. ${item.kecamatan}\n`;
      content += `KOMODITI        : ${item.jenisKomoditi} (${item.varietas})\n`;
      content += `LUAS BAKU LAHAN : ${item.luasBakuLahan} Ha\n`;
      content += `LUAS TANAM      : ${item.luasTanam} Ha\n`;
      content += `LUAS PANEN      : ${item.luasPanen} Ha\n`;
      content += `LUAS FUSO       : ${item.luasFuso} Ha\n`;
      content += `PROVITAS        : ${item.provitas} Ku/Ha\n`;
      content += `TOTAL PRODUKSI  : ${item.produksiTon} Ton\n`;
      content += `PETUGAS PPL     : ${item.petugas}\n`;
    } else if (type === 'tph-poktan') {
      title = `Data_Poktan_${item.namaKelompokTani}_${item.desa}`;
      content += `KATEGORI        : Kelompok Tani Tanaman Pangan (TPH)\n`;
      content += `NAMA POKTAN     : ${item.namaKelompokTani}\n`;
      content += `MUSIM TANAM     : ${item.musimTanam}\n`;
      content += `WILAYAH         : Desa ${item.desa}, Kec. ${item.kecamatan}\n`;
      content += `LUAS LAHAN      : ${item.luasLahan} Ha\n`;
      content += `LUAS TANAM      : ${item.luasTanam} Ha\n`;
      content += `LUAS PANEN      : ${item.luasPanen} Ha\n`;
      content += `PRODUKSI        : ${item.produksi} Ton\n`;
      content += `SUMBER DATA     : ${item.sumberData}\n`;
      if (item.titikKoordinat) {
        content += `KOORDINAT       : Lat ${item.titikKoordinat.lat}, Lng ${item.titikKoordinat.lng}\n`;
      }
    } else if (type === 'peternakan') {
      title = `Data_Peternakan_${item.pemilikTernak}_${item.jenisTernak}`;
      content += `KATEGORI        : Populasi Peternakan Rakyat\n`;
      content += `PEMILIK TERNAK  : ${item.pemilikTernak}\n`;
      content += `JENIS TERNAK    : ${item.jenisTernak}\n`;
      content += `WILAYAH         : Desa ${item.desa}, Kec. ${item.kecamatan}\n`;
      content += `KONTAK / NIK    : ${item.noHpNik || '-'}\n`;
      content += `TOTAL POPULASI  : ${item.populasi} Ekor\n`;
      content += `JANTAN / BETINA : ${item.jantan} Ekor / ${item.betina} Ekor\n`;
      content += `STATUS KANDANG  : ${item.kandang}\n`;
      if (item.titikKoordinat) {
        content += `KOORDINAT       : Lat ${item.titikKoordinat.lat}, Lng ${item.titikKoordinat.lng}\n`;
      }
    } else if (type === 'perkebunan') {
      title = `Data_Perkebunan_${item.namaKelompokTani}_${item.jenisTanaman}`;
      content += `KATEGORI        : Komoditas Perkebunan Rakyat\n`;
      content += `KELOMPOK TANI   : ${item.namaKelompokTani}\n`;
      content += `KETUA KELOMPOK  : ${item.namaKetua}\n`;
      content += `JENIS TANAMAN   : ${item.jenisTanaman}\n`;
      content += `WILAYAH         : Desa ${item.desa}, Kec. ${item.kecamatan}\n`;
      content += `LUAS LAHAN      : ${item.luasLahan} Ha\n`;
      content += `TANAMAN PROD.   : ${item.jumlahTanamanProduksi} Pohon\n`;
      content += `BELUM PROD.     : ${item.jumlahTanamanBelumProduksi} Pohon\n`;
      content += `TOTAL PRODUKSI  : ${item.jumlahProduksi} Ton\n`;
      if (item.titikKoordinat) {
        content += `KOORDINAT       : Lat ${item.titikKoordinat.lat}, Lng ${item.titikKoordinat.lng}\n`;
      }
    } else if (type === 'psp') {
      title = `Data_PSP_${item.namaKegiatan}_${item.desa}`;
      content += `KATEGORI        : Prasarana dan Sarana Pertanian (PSP)\n`;
      content += `NAMA KEGIATAN   : ${item.namaKegiatan}\n`;
      content += `JENIS / TAHUN   : ${item.jenisData} (Tahun ${item.tahun})\n`;
      content += `KELOMPOK TANI   : ${item.kelompokTani} (Ketua: ${item.namaKetua})\n`;
      content += `WILAYAH         : Desa ${item.desa}, Kec. ${item.kecamatan}\n`;
      content += `VOLUME          : ${item.volume}\n`;
      if (item.merekKhususAlsintan) {
        content += `MEREK / SPEK    : ${item.merekKhususAlsintan}\n`;
      }
      content += `KONDISI         : ${item.kondisi}\n`;
      content += `JUMLAH ANGGOTA  : ${item.jumlahAnggotaKelompok} Orang\n`;
      content += `KONTAK / NIK    : ${item.nikNoHp || '-'}\n`;
      if (item.titikKoordinat) {
        content += `KOORDINAT       : Lat ${item.titikKoordinat.lat}, Lng ${item.titikKoordinat.lng}\n`;
      }
    }

    content += `\n========================================================\nDokumen resmi tersimpan aman dalam database SIPADI.\n========================================================\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Batch CSV Export
  const handleExportCSV = () => {
    let header: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = '';

    if (targetBidang === 'tph' && tphTab === 'ltt') {
      filename = 'Rekap_Teknis_TPH_LTT';
      header = ['No', 'Desa', 'Kecamatan', 'Komoditi', 'Varietas', 'Luas Baku (Ha)', 'Luas Tanam (Ha)', 'Luas Panen (Ha)', 'Luas Fuso (Ha)', 'Provitas (Ku/Ha)', 'Produksi (Ton)', 'Petugas PPL'];
      rows = tphLttList.map((x, i) => [
        i + 1,
        `"${x.desa}"`,
        `"${x.kecamatan}"`,
        `"${x.jenisKomoditi}"`,
        `"${x.varietas}"`,
        x.luasBakuLahan,
        x.luasTanam,
        x.luasPanen,
        x.luasFuso,
        x.provitas,
        x.produksiTon,
        `"${x.petugas}"`,
      ]);
    } else if (targetBidang === 'tph' && tphTab === 'poktan') {
      filename = 'Rekap_Teknis_TPH_Poktan';
      header = ['No', 'Kelompok Tani', 'Musim Tanam', 'Desa', 'Kecamatan', 'Luas Lahan (Ha)', 'Luas Tanam (Ha)', 'Luas Panen (Ha)', 'Produksi (Ton)', 'Sumber Data', 'Lat', 'Lng'];
      rows = tphPoktanList.map((x, i) => [
        i + 1,
        `"${x.namaKelompokTani}"`,
        `"${x.musimTanam}"`,
        `"${x.desa}"`,
        `"${x.kecamatan}"`,
        x.luasLahan,
        x.luasTanam,
        x.luasPanen,
        x.produksi,
        `"${x.sumberData}"`,
        x.titikKoordinat?.lat || 0,
        x.titikKoordinat?.lng || 0,
      ]);
    } else if (targetBidang === 'peternakan') {
      filename = 'Rekap_Teknis_Peternakan';
      header = ['No', 'Pemilik Ternak', 'Jenis Ternak', 'Desa', 'Kecamatan', 'Kontak / NIK', 'Populasi (Ekor)', 'Jantan', 'Betina', 'Kandang', 'Lat', 'Lng'];
      rows = peternakanList.map((x, i) => [
        i + 1,
        `"${x.pemilikTernak}"`,
        `"${x.jenisTernak}"`,
        `"${x.desa}"`,
        `"${x.kecamatan}"`,
        `"${x.noHpNik || '-'}"`,
        x.populasi,
        x.jantan,
        x.betina,
        `"${x.kandang}"`,
        x.titikKoordinat?.lat || 0,
        x.titikKoordinat?.lng || 0,
      ]);
    } else if (targetBidang === 'perkebunan') {
      filename = 'Rekap_Teknis_Perkebunan';
      header = ['No', 'Kelompok Tani', 'Ketua', 'Komoditas', 'Desa', 'Kecamatan', 'Luas Lahan (Ha)', 'Menghasilkan', 'Belum Menghasilkan', 'Produksi (Ton)', 'Lat', 'Lng'];
      rows = perkebunanList.map((x, i) => [
        i + 1,
        `"${x.namaKelompokTani}"`,
        `"${x.namaKetua}"`,
        `"${x.jenisTanaman}"`,
        `"${x.desa}"`,
        `"${x.kecamatan}"`,
        x.luasLahan,
        x.jumlahTanamanProduksi,
        x.jumlahTanamanBelumProduksi,
        x.jumlahProduksi,
        x.titikKoordinat?.lat || 0,
        x.titikKoordinat?.lng || 0,
      ]);
    } else if (targetBidang === 'psp') {
      filename = 'Rekap_Teknis_PSP';
      header = ['No', 'Program / Kegiatan', 'Jenis Data', 'Tahun', 'Kelompok Tani', 'Ketua', 'Desa', 'Volume', 'Merek / Spek', 'Kondisi', 'Anggota', 'Kontak', 'Lat', 'Lng'];
      rows = pspList.map((x, i) => [
        i + 1,
        `"${x.namaKegiatan}"`,
        `"${x.jenisData}"`,
        x.tahun,
        `"${x.kelompokTani}"`,
        `"${x.namaKetua}"`,
        `"${x.desa}"`,
        `"${x.volume}"`,
        `"${x.merekKhususAlsintan || '-'}"`,
        `"${x.kondisi}"`,
        x.jumlahAnggotaKelompok,
        `"${x.nikNoHp || '-'}"`,
        x.titikKoordinat?.lat || 0,
        x.titikKoordinat?.lng || 0,
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
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl glass-panel p-4 sm:p-5 shadow-lg border-l-4 border-l-emerald-600">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
            {info.icon}
            <span>Database Teknis Lapangan Dinas</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{info.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{info.sub}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2.5 text-xs font-bold text-emerald-800 shadow-2xs transition shrink-0 cursor-pointer"
            title="Unduh rekap data teknis ke format file CSV"
          >
            <Download className="h-4 w-4" />
            <span>Unduh Rekap (.CSV)</span>
          </button>

          <button
            onClick={() => onOpenNewTeknisModal(targetBidang)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-4 py-2.5 text-xs font-bold text-white shadow-md transition shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Input Data {info.badge} Baru</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Switcher & View Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200">
        {targetBidang === 'tph' ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTphTab('ltt')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                tphTab === 'ltt'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>1. Data LTT & Produksi ({tphLttList.length})</span>
            </button>
            <button
              onClick={() => setTphTab('poktan')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                tphTab === 'poktan'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>2. Kelompok Tani Tanaman Pangan ({tphPoktanList.length})</span>
            </button>
          </div>
        ) : (
          <div className="text-xs font-bold text-slate-700 px-2 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Daftar Hasil Inputan Data Teknis {info.badge}</span>
          </div>
        )}

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
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
            title="Tampilan Kartu"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Kartu</span>
          </button>
        </div>
      </div>

      {/* 1. TPH LTT Table */}
      {targetBidang === 'tph' && tphTab === 'ltt' && (
        viewMode === 'table' ? (
          <div className="rounded-2xl glass-panel shadow-md overflow-hidden border border-slate-200/90 bg-white/95">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] whitespace-nowrap">
                <thead className="bg-[#123820] text-emerald-100 font-bold uppercase text-[9.5px] tracking-wider border-b border-emerald-950">
                  <tr>
                    <th className="px-2 py-1.5 text-center w-8">No</th>
                    <th className="px-2.5 py-1.5">Wilayah (Desa/Kec)</th>
                    <th className="px-2.5 py-1.5">Komoditi / Varietas</th>
                    <th className="px-2 py-1.5 text-right">Luas Baku (Ha)</th>
                    <th className="px-2 py-1.5 text-right">Tanam (Ha)</th>
                    <th className="px-2 py-1.5 text-right">Panen (Ha)</th>
                    <th className="px-2 py-1.5 text-right">Fuso (Ha)</th>
                    <th className="px-2 py-1.5 text-right">Provitas (Ku/Ha)</th>
                    <th className="px-2 py-1.5 text-right">Produksi (Ton)</th>
                    <th className="px-2.5 py-1.5">Petugas PPL</th>
                    <th className="px-2 py-1.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {tphLttList.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-emerald-50/60 transition h-8 cursor-pointer"
                      onClick={() => onViewTeknisItem(item, 'tph-ltt')}
                    >
                      <td className="px-2 py-1 text-center font-mono text-[10px] text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="px-2.5 py-1">
                        <span className="font-bold text-slate-900 block text-[11px]">{item.desa}</span>
                        <span className="text-[9.5px] text-slate-500">Kec. {item.kecamatan}</span>
                      </td>
                      <td className="px-2.5 py-1">
                        <span className="font-semibold text-emerald-800 block text-[11px]">{item.jenisKomoditi}</span>
                        <span className="text-[9.5px] text-slate-500">{item.varietas}</span>
                      </td>
                      <td className="px-2 py-1 text-right font-mono font-bold text-slate-700 text-[10.5px]">{item.luasBakuLahan}</td>
                      <td className="px-2 py-1 text-right font-mono font-bold text-emerald-700 text-[10.5px]">{item.luasTanam}</td>
                      <td className="px-2 py-1 text-right font-mono font-bold text-amber-700 text-[10.5px]">{item.luasPanen}</td>
                      <td className="px-2 py-1 text-right font-mono text-rose-600 font-bold text-[10.5px]">{item.luasFuso}</td>
                      <td className="px-2 py-1 text-right font-mono text-slate-700 text-[10.5px]">{item.provitas}</td>
                      <td className="px-2 py-1 text-right font-mono font-extrabold text-slate-900 bg-emerald-50/40 text-[10.5px]">{item.produksiTon}</td>
                      <td className="px-2.5 py-1 text-[10px] text-slate-500">{item.petugas}</td>
                      <td className="px-2 py-1 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onViewTeknisItem(item, 'tph-ltt')}
                            className="flex items-center gap-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Lihat rincian data LTT"
                          >
                            <Eye className="h-2.5 w-2.5" />
                            <span>Lihat</span>
                          </button>
                          <button
                            onClick={() => onEditTeknisItem(item, 'tph-ltt')}
                            className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Edit data LTT ini"
                          >
                            <Edit3 className="h-2.5 w-2.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDownloadItem(item, 'tph-ltt')}
                            className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Unduh berkas ringkasan LTT"
                          >
                            <Download className="h-2.5 w-2.5" />
                            <span>Unduh</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus data LTT Desa ${item.desa}?`)) {
                                onDeleteTeknisItem(item.id, 'tph-ltt');
                              }
                            }}
                            className="p-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Hapus data LTT ini"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {tphLttList.map((item) => (
              <div key={item.id} className="rounded-xl glass-panel p-4 shadow-sm border border-slate-200 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                      TPH - LTT
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">PPL: {item.petugas}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">{item.desa}, Kec. {item.kecamatan}</h3>
                    <p className="text-[10px] text-emerald-800 font-semibold">{item.jenisKomoditi} ({item.varietas})</p>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs text-center font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Tanam</span>
                      <span className="font-bold text-[11px] text-emerald-700">{item.luasTanam} Ha</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Panen</span>
                      <span className="font-bold text-[11px] text-amber-700">{item.luasPanen} Ha</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Produksi</span>
                      <span className="font-bold text-[11px] text-slate-900">{item.produksiTon} Ton</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-1">
                  <button
                    onClick={() => onViewTeknisItem(item, 'tph-ltt')}
                    className="flex items-center gap-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                  >
                    <Eye className="h-3 w-3" />
                    <span>Lihat</span>
                  </button>
                  <button
                    onClick={() => onEditTeknisItem(item, 'tph-ltt')}
                    className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDownloadItem(item, 'tph-ltt')}
                    className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                  >
                    <Download className="h-3 w-3" />
                    <span>Unduh</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Yakin ingin menghapus data LTT Desa ${item.desa}?`)) {
                        onDeleteTeknisItem(item.id, 'tph-ltt');
                      }
                    }}
                    className="p-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* 2. TPH Poktan: Tabel Ramping vs Kartu */}
      {targetBidang === 'tph' && tphTab === 'poktan' && (
        viewMode === 'table' ? (
          <div className="rounded-2xl glass-panel shadow-md overflow-hidden border border-slate-200/90 bg-white/95">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] whitespace-nowrap">
                <thead className="bg-[#10331b] text-emerald-100 font-bold uppercase text-[9.5px] tracking-wider border-b border-emerald-950">
                  <tr>
                    <th className="px-2 py-1.5 text-center w-8">No</th>
                    <th className="px-2.5 py-1.5">Kelompok Tani</th>
                    <th className="px-2 py-1.5">Musim Tanam</th>
                    <th className="px-2.5 py-1.5">Wilayah</th>
                    <th className="px-2 py-1.5 text-right">Luas Lahan</th>
                    <th className="px-2 py-1.5 text-right">Luas Tanam</th>
                    <th className="px-2 py-1.5 text-right">Luas Panen</th>
                    <th className="px-2 py-1.5 text-right">Produksi (Ton)</th>
                    <th className="px-2 py-1.5">Sumber Data</th>
                    <th className="px-2 py-1.5 text-center">Titik Maps</th>
                    <th className="px-2 py-1.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {tphPoktanList.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-emerald-50/60 transition h-8 cursor-pointer"
                      onClick={() => onViewTeknisItem(item, 'tph-poktan')}
                    >
                      <td className="px-2 py-1 text-center font-mono text-[10px] text-slate-400">{idx + 1}</td>
                      <td className="px-2.5 py-1 font-bold text-slate-900">{item.namaKelompokTani}</td>
                      <td className="px-2 py-1">
                        <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                          {item.musimTanam}
                        </span>
                      </td>
                      <td className="px-2.5 py-1 text-[10px] text-slate-600">Desa {item.desa}, Kec. {item.kecamatan}</td>
                      <td className="px-2 py-1 text-right font-mono text-[10.5px]">{item.luasLahan} Ha</td>
                      <td className="px-2 py-1 text-right font-mono font-bold text-emerald-700 text-[10.5px]">{item.luasTanam} Ha</td>
                      <td className="px-2 py-1 text-right font-mono font-bold text-amber-700 text-[10.5px]">{item.luasPanen} Ha</td>
                      <td className="px-2 py-1 text-right font-mono font-extrabold text-slate-900 bg-emerald-50/40 text-[10.5px]">{item.produksi} Ton</td>
                      <td className="px-2 py-1 text-[10px] text-slate-500">{item.sumberData}</td>
                      <td className="px-2 py-1 text-center" onClick={(e) => e.stopPropagation()}>
                        {item.titikKoordinat && (
                          <a
                            href={`https://www.google.com/maps?q=${item.titikKoordinat.lat},${item.titikKoordinat.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white px-1.5 py-0.5 text-[9.5px] font-semibold transition border border-emerald-200"
                          >
                            <MapPin className="h-2.5 w-2.5" />
                            <span>Peta</span>
                          </a>
                        )}
                      </td>
                      <td className="px-2 py-1 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onViewTeknisItem(item, 'tph-poktan')}
                            className="flex items-center gap-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Lihat detail kelompok tani"
                          >
                            <Eye className="h-2.5 w-2.5" />
                            <span>Lihat</span>
                          </button>
                          <button
                            onClick={() => onEditTeknisItem(item, 'tph-poktan')}
                            className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Edit data poktan"
                          >
                            <Edit3 className="h-2.5 w-2.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDownloadItem(item, 'tph-poktan')}
                            className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Unduh ringkasan data poktan"
                          >
                            <Download className="h-2.5 w-2.5" />
                            <span>Unduh</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus data ${item.namaKelompokTani}?`)) {
                                onDeleteTeknisItem(item.id, 'tph-poktan');
                              }
                            }}
                            className="p-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Hapus data poktan ini"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {tphPoktanList.map((item) => (
              <div key={item.id} className="rounded-xl glass-panel p-4 shadow-sm border border-slate-200 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                      {item.musimTanam}
                    </span>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">{item.namaKelompokTani}</h3>
                    <p className="text-[10px] text-slate-500">Desa {item.desa}, Kec. {item.kecamatan}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs text-center font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Lahan</span>
                      <span className="font-bold text-[11px]">{item.luasLahan} Ha</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Tanam</span>
                      <span className="font-bold text-[11px] text-emerald-700">{item.luasTanam} Ha</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Produksi</span>
                      <span className="font-bold text-[11px] text-amber-700">{item.produksi} Ton</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                  {item.titikKoordinat && (
                    <a
                      href={`https://www.google.com/maps?q=${item.titikKoordinat.lat},${item.titikKoordinat.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline flex items-center gap-1 text-[10px] font-semibold"
                    >
                      <MapPin className="h-3 w-3 text-rose-500" />
                      <span>Maps</span>
                    </a>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      onClick={() => onViewTeknisItem(item, 'tph-poktan')}
                      className="flex items-center gap-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Lihat</span>
                    </button>
                    <button
                      onClick={() => onEditTeknisItem(item, 'tph-poktan')}
                      className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDownloadItem(item, 'tph-poktan')}
                      className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>Unduh</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus data ${item.namaKelompokTani}?`)) {
                          onDeleteTeknisItem(item.id, 'tph-poktan');
                        }
                      }}
                      className="p-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* 3. Peternakan: Tabel Ramping vs Kartu */}
      {targetBidang === 'peternakan' && (
        viewMode === 'table' ? (
          <div className="rounded-2xl glass-panel shadow-md overflow-hidden border border-slate-200/90 bg-white/95">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] whitespace-nowrap">
                <thead className="bg-[#381418] text-rose-100 font-bold uppercase text-[9.5px] tracking-wider border-b border-rose-950">
                  <tr>
                    <th className="px-2 py-1.5 text-center w-8">No</th>
                    <th className="px-2.5 py-1.5">Pemilik Ternak</th>
                    <th className="px-2 py-1.5">Jenis Ternak</th>
                    <th className="px-2.5 py-1.5">Wilayah (Desa/Kec)</th>
                    <th className="px-2.5 py-1.5">Kontak / NIK</th>
                    <th className="px-2 py-1.5 text-right">Populasi</th>
                    <th className="px-2 py-1.5 text-right">Jantan</th>
                    <th className="px-2 py-1.5 text-right">Betina</th>
                    <th className="px-2 py-1.5">Kandang</th>
                    <th className="px-2 py-1.5 text-center">Titik Maps</th>
                    <th className="px-2 py-1.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {peternakanList.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-rose-50/50 transition h-8 cursor-pointer"
                      onClick={() => onViewTeknisItem(item, 'peternakan')}
                    >
                      <td className="px-2 py-1 text-center font-mono text-[10px] text-slate-400">{idx + 1}</td>
                      <td className="px-2.5 py-1 font-bold text-slate-900">{item.pemilikTernak}</td>
                      <td className="px-2 py-1">
                        <span className="rounded bg-rose-100 px-1.5 py-0.2 text-[9px] font-bold text-rose-800">
                          {item.jenisTernak}
                        </span>
                      </td>
                      <td className="px-2.5 py-1 text-[10px] text-slate-600">Desa {item.desa}, Kec. {item.kecamatan}</td>
                      <td className="px-2.5 py-1 text-[10px] font-mono text-slate-500">{item.noHpNik || '-'}</td>
                      <td className="px-2 py-1 text-right font-mono font-extrabold text-rose-700 bg-rose-50/40 text-[10.5px]">{item.populasi} Ekor</td>
                      <td className="px-2 py-1 text-right font-mono text-slate-700 text-[10.5px]">{item.jantan}</td>
                      <td className="px-2 py-1 text-right font-mono text-rose-600 text-[10.5px]">{item.betina}</td>
                      <td className="px-2 py-1 text-[10px] text-slate-600">{item.kandang}</td>
                      <td className="px-2 py-1 text-center" onClick={(e) => e.stopPropagation()}>
                        {item.titikKoordinat && (
                          <a
                            href={`https://www.google.com/maps?q=${item.titikKoordinat.lat},${item.titikKoordinat.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white px-1.5 py-0.5 text-[9.5px] font-semibold transition border border-rose-200"
                          >
                            <MapPin className="h-2.5 w-2.5" />
                            <span>Peta</span>
                          </a>
                        )}
                      </td>
                      <td className="px-2 py-1 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onViewTeknisItem(item, 'peternakan')}
                            className="flex items-center gap-1 rounded bg-rose-700 hover:bg-rose-800 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Lihat rincian data ternak"
                          >
                            <Eye className="h-2.5 w-2.5" />
                            <span>Lihat</span>
                          </button>
                          <button
                            onClick={() => onEditTeknisItem(item, 'peternakan')}
                            className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Edit data ternak"
                          >
                            <Edit3 className="h-2.5 w-2.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDownloadItem(item, 'peternakan')}
                            className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Unduh ringkasan data ternak"
                          >
                            <Download className="h-2.5 w-2.5" />
                            <span>Unduh</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus data ternak milik ${item.pemilikTernak}?`)) {
                                onDeleteTeknisItem(item.id, 'peternakan');
                              }
                            }}
                            className="p-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Hapus data ternak ini"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {peternakanList.map((item) => (
              <div key={item.id} className="rounded-xl glass-panel p-4 shadow-sm border border-slate-200 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-800">
                        {item.jenisTernak}
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 mt-0.5">{item.pemilikTernak}</h3>
                      <p className="text-[10px] text-slate-500">Desa {item.desa}, Kec. {item.kecamatan}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block">Populasi</span>
                      <span className="font-extrabold text-rose-700 text-xs sm:text-sm">{item.populasi} Ekor</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 bg-rose-50/50 p-2 rounded-lg border border-rose-100 text-xs text-center font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Jantan</span>
                      <span className="font-bold text-[11px]">{item.jantan}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Betina</span>
                      <span className="font-bold text-[11px] text-rose-700">{item.betina}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Kandang</span>
                      <span className="font-bold text-[11px] text-slate-700">{item.kandang}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                  {item.titikKoordinat && (
                    <a
                      href={`https://www.google.com/maps?q=${item.titikKoordinat.lat},${item.titikKoordinat.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-700 hover:underline flex items-center gap-1 text-[10px] font-semibold"
                    >
                      <MapPin className="h-3 w-3 text-rose-500" />
                      <span>Maps</span>
                    </a>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      onClick={() => onViewTeknisItem(item, 'peternakan')}
                      className="flex items-center gap-1 rounded bg-rose-700 hover:bg-rose-800 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Lihat</span>
                    </button>
                    <button
                      onClick={() => onEditTeknisItem(item, 'peternakan')}
                      className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDownloadItem(item, 'peternakan')}
                      className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>Unduh</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus data ternak milik ${item.pemilikTernak}?`)) {
                          onDeleteTeknisItem(item.id, 'peternakan');
                        }
                      }}
                      className="p-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* 4. Perkebunan: Tabel Ramping vs Kartu */}
      {targetBidang === 'perkebunan' && (
        viewMode === 'table' ? (
          <div className="rounded-2xl glass-panel shadow-md overflow-hidden border border-slate-200/90 bg-white/95">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] whitespace-nowrap">
                <thead className="bg-[#0f2e24] text-teal-100 font-bold uppercase text-[9.5px] tracking-wider border-b border-teal-950">
                  <tr>
                    <th className="px-2 py-1.5 text-center w-8">No</th>
                    <th className="px-2.5 py-1.5">Kelompok Tani</th>
                    <th className="px-2 py-1.5">Komoditas</th>
                    <th className="px-2.5 py-1.5">Ketua & Wilayah</th>
                    <th className="px-2 py-1.5 text-right">Luas Lahan</th>
                    <th className="px-2 py-1.5 text-right">Menghasilkan</th>
                    <th className="px-2 py-1.5 text-right">Belum Hsl</th>
                    <th className="px-2 py-1.5 text-right">Produksi (Ton)</th>
                    <th className="px-2.5 py-1.5 text-center">Titik Maps</th>
                    <th className="px-2 py-1.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {perkebunanList.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-teal-50/50 transition h-8 cursor-pointer"
                      onClick={() => onViewTeknisItem(item, 'perkebunan')}
                    >
                      <td className="px-2 py-1 text-center font-mono text-[10px] text-slate-400">{idx + 1}</td>
                      <td className="px-2.5 py-1 font-bold text-slate-900">{item.namaKelompokTani}</td>
                      <td className="px-2 py-1">
                        <span className="rounded bg-teal-100 px-1.5 py-0.2 text-[9px] font-bold text-teal-800">
                          {item.jenisTanaman}
                        </span>
                      </td>
                      <td className="px-2.5 py-1 text-[10px] text-slate-600">
                        <span className="font-semibold text-slate-800">{item.namaKetua}</span>
                        <span className="text-slate-400 ml-1">({item.desa}, {item.kecamatan})</span>
                      </td>
                      <td className="px-2 py-1 text-right font-mono text-[10.5px]">{item.luasLahan} Ha</td>
                      <td className="px-2 py-1 text-right font-mono font-bold text-teal-700 text-[10.5px]">{item.jumlahTanamanProduksi}</td>
                      <td className="px-2 py-1 text-right font-mono text-slate-600 text-[10.5px]">{item.jumlahTanamanBelumProduksi}</td>
                      <td className="px-2 py-1 text-right font-mono font-extrabold text-slate-900 bg-teal-50/40 text-[10.5px]">{item.jumlahProduksi} Ton</td>
                      <td className="px-2.5 py-1 text-center" onClick={(e) => e.stopPropagation()}>
                        {item.titikKoordinat && (
                          <a
                            href={`https://www.google.com/maps?q=${item.titikKoordinat.lat},${item.titikKoordinat.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white px-1.5 py-0.5 text-[9.5px] font-semibold transition border border-teal-200"
                          >
                            <MapPin className="h-2.5 w-2.5" />
                            <span>Peta</span>
                          </a>
                        )}
                      </td>
                      <td className="px-2 py-1 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onViewTeknisItem(item, 'perkebunan')}
                            className="flex items-center gap-1 rounded bg-teal-700 hover:bg-teal-800 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Lihat rincian data perkebunan"
                          >
                            <Eye className="h-2.5 w-2.5" />
                            <span>Lihat</span>
                          </button>
                          <button
                            onClick={() => onEditTeknisItem(item, 'perkebunan')}
                            className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Edit data perkebunan"
                          >
                            <Edit3 className="h-2.5 w-2.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDownloadItem(item, 'perkebunan')}
                            className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Unduh ringkasan data perkebunan"
                          >
                            <Download className="h-2.5 w-2.5" />
                            <span>Unduh</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus data perkebunan ${item.namaKelompokTani}?`)) {
                                onDeleteTeknisItem(item.id, 'perkebunan');
                              }
                            }}
                            className="p-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Hapus data ini"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {perkebunanList.map((item) => (
              <div key={item.id} className="rounded-xl glass-panel p-4 shadow-sm border border-slate-200 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[9px] font-bold text-teal-800">
                        {item.jenisTanaman}
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 mt-0.5">{item.namaKelompokTani}</h3>
                      <p className="text-[10px] text-slate-500">Ketua: {item.namaKetua} • Desa {item.desa}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block">Produksi</span>
                      <span className="font-extrabold text-teal-700 text-xs sm:text-sm">{item.jumlahProduksi} Ton</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 bg-teal-50/50 p-2 rounded-lg border border-teal-100 text-xs text-center font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Lahan</span>
                      <span className="font-bold text-[11px]">{item.luasLahan} Ha</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Menghasilkan</span>
                      <span className="font-bold text-[11px] text-teal-700">{item.jumlahTanamanProduksi}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Belum Hsl</span>
                      <span className="font-bold text-[11px] text-slate-600">{item.jumlahTanamanBelumProduksi}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                  {item.titikKoordinat && (
                    <a
                      href={`https://www.google.com/maps?q=${item.titikKoordinat.lat},${item.titikKoordinat.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 hover:underline flex items-center gap-1 text-[10px] font-semibold"
                    >
                      <MapPin className="h-3 w-3 text-rose-500" />
                      <span>Maps</span>
                    </a>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      onClick={() => onViewTeknisItem(item, 'perkebunan')}
                      className="flex items-center gap-1 rounded bg-teal-700 hover:bg-teal-800 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Lihat</span>
                    </button>
                    <button
                      onClick={() => onEditTeknisItem(item, 'perkebunan')}
                      className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDownloadItem(item, 'perkebunan')}
                      className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>Unduh</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus data perkebunan ${item.namaKelompokTani}?`)) {
                          onDeleteTeknisItem(item.id, 'perkebunan');
                        }
                      }}
                      className="p-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* 5. PSP: Tabel Ramping vs Kartu */}
      {targetBidang === 'psp' && (
        viewMode === 'table' ? (
          <div className="rounded-2xl glass-panel shadow-md overflow-hidden border border-slate-200/90 bg-white/95">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] whitespace-nowrap">
                <thead className="bg-[#2e230e] text-amber-100 font-bold uppercase text-[9.5px] tracking-wider border-b border-amber-950">
                  <tr>
                    <th className="px-2 py-1.5 text-center w-8">No</th>
                    <th className="px-2.5 py-1.5">Kegiatan / Program</th>
                    <th className="px-2 py-1.5">Jenis & TA</th>
                    <th className="px-2.5 py-1.5">Kelompok Tani & Ketua</th>
                    <th className="px-2 py-1.5">Desa</th>
                    <th className="px-2 py-1.5">Volume</th>
                    <th className="px-2 py-1.5">Merek / Spek</th>
                    <th className="px-2 py-1.5 text-center">Kondisi</th>
                    <th className="px-2 py-1.5">Anggota</th>
                    <th className="px-2.5 py-1.5 text-center">Titik Maps</th>
                    <th className="px-2 py-1.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {pspList.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/50 transition h-8 cursor-pointer"
                      onClick={() => onViewTeknisItem(item, 'psp')}
                    >
                      <td className="px-2 py-1 text-center font-mono text-[10px] text-slate-400">{idx + 1}</td>
                      <td className="px-2.5 py-1 font-bold text-slate-900">{item.namaKegiatan}</td>
                      <td className="px-2 py-1">
                        <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-900">
                          {item.jenisData} ({item.tahun})
                        </span>
                      </td>
                      <td className="px-2.5 py-1 text-[10px] text-slate-700">
                        <span className="font-semibold">{item.kelompokTani}</span>
                        <span className="text-slate-400 ml-1">({item.namaKetua})</span>
                      </td>
                      <td className="px-2 py-1 text-[10px] text-slate-600">{item.desa}</td>
                      <td className="px-2 py-1 font-mono font-bold text-slate-800 text-[10.5px]">{item.volume}</td>
                      <td className="px-2 py-1 text-[10px] text-amber-900 font-mono">{item.merekKhususAlsintan || '-'}</td>
                      <td className="px-2 py-1 text-center">
                        <span className="font-bold text-emerald-800 text-[9.5px] rounded bg-emerald-100 px-1.5 py-0.2">
                          {item.kondisi}
                        </span>
                      </td>
                      <td className="px-2 py-1 text-[10px] text-slate-600">{item.jumlahAnggotaKelompok} Org</td>
                      <td className="px-2.5 py-1 text-center" onClick={(e) => e.stopPropagation()}>
                        {item.titikKoordinat && (
                          <a
                            href={`https://www.google.com/maps?q=${item.titikKoordinat.lat},${item.titikKoordinat.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded bg-amber-50 text-amber-800 hover:bg-amber-700 hover:text-white px-1.5 py-0.5 text-[9.5px] font-semibold transition border border-amber-200"
                          >
                            <MapPin className="h-2.5 w-2.5" />
                            <span>Peta</span>
                          </a>
                        )}
                      </td>
                      <td className="px-2 py-1 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onViewTeknisItem(item, 'psp')}
                            className="flex items-center gap-1 rounded bg-amber-700 hover:bg-amber-800 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Lihat rincian data PSP"
                          >
                            <Eye className="h-2.5 w-2.5" />
                            <span>Lihat</span>
                          </button>
                          <button
                            onClick={() => onEditTeknisItem(item, 'psp')}
                            className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Edit data PSP ini"
                          >
                            <Edit3 className="h-2.5 w-2.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDownloadItem(item, 'psp')}
                            className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 text-white px-1.5 py-0.5 text-[9.5px] font-bold shadow-2xs transition cursor-pointer"
                            title="Unduh ringkasan data PSP"
                          >
                            <Download className="h-2.5 w-2.5" />
                            <span>Unduh</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus data PSP ${item.namaKegiatan}?`)) {
                                onDeleteTeknisItem(item.id, 'psp');
                              }
                            }}
                            className="p-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Hapus data PSP ini"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {pspList.map((item) => (
              <div key={item.id} className="rounded-xl glass-panel p-4 shadow-sm border border-slate-200 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-900">
                        {item.jenisData} (TA {item.tahun})
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 mt-0.5">{item.namaKegiatan}</h3>
                      <p className="text-[10px] text-slate-500">{item.kelompokTani} • {item.desa}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700 text-[10px] rounded bg-emerald-100 px-2 py-0.5">
                        {item.kondisi}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-200 text-xs space-y-0.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Volume:</span>
                      <span className="font-bold text-slate-900">{item.volume}</span>
                    </div>
                    {item.merekKhususAlsintan && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Merek:</span>
                        <span className="font-bold text-amber-900">{item.merekKhususAlsintan}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Anggota Poktan:</span>
                      <span className="font-bold text-slate-900">{item.jumlahAnggotaKelompok} Orang</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                  {item.titikKoordinat && (
                    <a
                      href={`https://www.google.com/maps?q=${item.titikKoordinat.lat},${item.titikKoordinat.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-800 hover:underline flex items-center gap-1 text-[10px] font-semibold"
                    >
                      <MapPin className="h-3 w-3 text-rose-500" />
                      <span>Maps</span>
                    </a>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      onClick={() => onViewTeknisItem(item, 'psp')}
                      className="flex items-center gap-1 rounded bg-amber-700 hover:bg-amber-800 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Lihat</span>
                    </button>
                    <button
                      onClick={() => onEditTeknisItem(item, 'psp')}
                      className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDownloadItem(item, 'psp')}
                      className="flex items-center gap-1 rounded bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 text-[10px] font-bold transition cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>Unduh</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus data PSP ${item.namaKegiatan}?`)) {
                          onDeleteTeknisItem(item.id, 'psp');
                        }
                      }}
                      className="p-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
