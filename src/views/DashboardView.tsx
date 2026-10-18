/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  FolderArchive,
  ShoppingCart,
  ScrollText,
  FileText,
  Clock,
  Calendar,
  Sparkles,
  Plus,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { LogoKabupatenMorowali } from '../components/LogoKabupatenMorowali';
import {
  ArsipItem,
  PBJLangsungItem,
  PBJEPurchasingItem,
  ProposalItem,
  BidangType,
  UserAccount,
} from '../types';
import { BIDANG_CONFIG, formatRupiah, formatDateIndo } from '../utils/formatters';
import { NavTab } from '../components/Sidebar';

interface DashboardViewProps {
  archives: ArsipItem[];
  pbjLangsung: PBJLangsungItem[];
  pbjEPurchasing: PBJEPurchasingItem[];
  proposals: ProposalItem[];
  currentUser: UserAccount;
  onNavigate: (tab: NavTab) => void;
  onOpenArsipModal: (bidang?: BidangType) => void;
  onOpenPBJLangsungModal: () => void;
  onOpenPBJEPurchasingModal: () => void;
  onOpenProposalModal: () => void;
  onSelectArchive: (item: ArsipItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  archives,
  pbjLangsung,
  pbjEPurchasing,
  proposals,
  currentUser,
  onNavigate,
  onOpenArsipModal,
  onOpenPBJLangsungModal,
  onOpenPBJEPurchasingModal,
  onOpenProposalModal,
  onSelectArchive,
}) => {
  // Realtime clock values
  const now = new Date();
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayDay = days[now.getDay()];
  const todayDate = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Financial calculations
  const totalNilaiKontrakPL = pbjLangsung.reduce((acc, curr) => acc + curr.besaranNilaiKontrak, 0);
  const totalNilaiEPurchasing = pbjEPurchasing.reduce((acc, curr) => acc + curr.pembayaran, 0);
  const totalAnggaranPBJ = totalNilaiKontrakPL + totalNilaiEPurchasing;

  // Proposals status counts
  const totalProposals = proposals.length;
  const proposalTersalurkan = proposals.filter(
    (p) => p.status === 'Sudah Dilaksanakan / Selesai' || p.status === 'Tersalurkan / Selesai'
  ).length;

  // Counts per bidang
  const bidangKeys: BidangType[] = ['perencanaan', 'tph', 'psp', 'peternakan', 'perkebunan', 'pbj'];

  return (
    <div className="space-y-6">
      
      {/* 1. HERO BANNER: Foto Padi Menguning & Gradasi Hijau Pertanian & Waktu Server */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d2a17] via-[#143c22] to-[#1e5231] p-6 sm:p-8 text-white shadow-2xl border border-yellow-400/40">
        
        {/* Background Foto Padi Menguning Keemasan */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-30 mix-blend-overlay filter brightness-110"
          style={{
            backgroundImage: `url('/src/assets/images/golden_rice_stalks_1792236002661.jpg')`,
          }}
        />

        {/* Subtle Decorative Golden Accent */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-amber-400/30 to-yellow-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-white/95 shadow-md border border-white/40">
                <LogoKabupatenMorowali size={36} />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-0.5 text-[11px] font-semibold text-yellow-300 border border-yellow-300/40 backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>Sistem Terintegrasi Google Drive & Apps Script</span>
                </div>
                <h2 className="text-xs font-bold text-emerald-200 uppercase tracking-wider mt-0.5">
                  DINAS PERTANIAN DAERAH KABUPATEN MOROWALI
                </h2>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <span>Selamat Datang di</span>
              <span className="text-amber-400 drop-shadow-sm">SIPADI</span>
              <span className="text-sm font-normal text-amber-200/90 hidden sm:inline">🌾</span>
            </h1>
            <p className="max-w-xl text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Sistem Informasi Pertanian dan Administrasi Digital Dinas Pertanian Daerah Kabupaten Morowali. Manajemen kearsipan naskah dinas ber-QR Code, pengadaan barang jasa (PBJ), data teknis persawahan dan proposal kelompok tani.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-emerald-200">Login sebagai:</span>
              <span className="font-bold text-white bg-black/30 px-2.5 py-0.5 rounded-lg border border-white/20">
                {currentUser.name} ({currentUser.role})
              </span>
            </div>
          </div>

          {/* Didasboar Tambah Hari, Tanggal dan Jam Widget */}
          <div className="rounded-2xl bg-black/35 backdrop-blur-md p-4 sm:p-5 border border-white/15 min-w-[260px] shadow-inner text-right sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
              WAKTU SERVER DINAS
            </span>
            <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg mb-1">
              <Calendar className="h-5 w-5 text-amber-400 shrink-0" />
              <span>{todayDay}, {todayDate}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-mono">
              <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Zona Waktu Indonesia Barat (WIB) Realtime</span>
            </div>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="mt-6 pt-6 border-t border-white/15 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider mr-1">
            Aksi Cepat:
          </span>

          <button
            onClick={() => onOpenArsipModal()}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-3.5 py-2 text-xs font-bold text-slate-900 transition shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Unggah Arsip Baru</span>
          </button>

          <button
            onClick={onOpenPBJLangsungModal}
            className="flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-3.5 py-2 text-xs font-bold text-white border border-white/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Input PBJ (Pengadaan Langsung)</span>
          </button>

          <button
            onClick={onOpenPBJEPurchasingModal}
            className="flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-3.5 py-2 text-xs font-bold text-white border border-white/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Input E-Purchasing (Katalog)</span>
          </button>

          <button
            onClick={onOpenProposalModal}
            className="flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-3.5 py-2 text-xs font-bold text-white border border-white/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Input Proposal Poktan</span>
          </button>
        </div>

      </div>

      {/* 2. BERANDA DATA ARSIP MASING-MASING BIDANG (BERKOTAK MEMANJANG MENGIKUTI PANJANG TULISAN) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <FolderArchive className="h-4 w-4 text-amber-400" />
            <span>Arsip Digital Berdasarkan Bidang Dinas</span>
          </h2>
          <span className="text-xs text-emerald-200">
            Total {archives.length} Berkas Tersimpan
          </span>
        </div>

        {/* Kotak memanjang mengikuti panjang tulisan dengan warna masing-masing bidang */}
        <div className="flex flex-wrap items-center gap-2.5">
          {bidangKeys.map((bKey) => {
            const meta = BIDANG_CONFIG[bKey];
            const count = archives.filter((a) => a.bidang === bKey).length;
            const navTarget = `arsip-${bKey}` as NavTab;

            return (
              <button
                key={bKey}
                onClick={() => onNavigate(navTarget)}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-2.5 text-xs font-semibold shadow-md transition transform hover:-translate-y-0.5 border ${meta.badgeBg} ${meta.badgeBorder} ${meta.badgeText}`}
                title={meta.desc}
              >
                <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${meta.gradient}`} />
                <span className="font-bold text-slate-800 text-xs sm:text-sm">
                  {meta.label}
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-extrabold shadow-inner border border-slate-200">
                  {count} Berkas
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. KEY METRICS STATISTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Arsip */}
        <div className="rounded-2xl glass-panel p-5 shadow-lg border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Arsip Terbaca</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <FolderArchive className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{archives.length}</p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-600" />
            <span>Semua siap dilihat, diedit & diunduh</span>
          </p>
        </div>

        {/* Pengadaan PBJ */}
        <div className="rounded-2xl glass-panel p-5 shadow-lg border-l-4 border-l-cyan-600">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Paket Pengadaan PBJ</span>
            <div className="p-2 rounded-xl bg-cyan-100 text-cyan-800">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {pbjLangsung.length + pbjEPurchasing.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            PL: {pbjLangsung.length} paket | E-Katalog: {pbjEPurchasing.length} paket
          </p>
        </div>

        {/* Total Nilai PBJ */}
        <div className="rounded-2xl glass-panel p-5 shadow-lg border-l-4 border-l-amber-600">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Nilai Kontrak</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-amber-900 truncate">
            {formatRupiah(totalAnggaranPBJ)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Termasuk uang muka & retensi
          </p>
        </div>

        {/* Proposal Kelompok Tani */}
        <div className="rounded-2xl glass-panel p-5 shadow-lg border-l-4 border-l-yellow-600">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Proposal Masuk</span>
            <div className="p-2 rounded-xl bg-yellow-100 text-yellow-800">
              <ScrollText className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalProposals}</p>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              {proposalTersalurkan} Selesai PBJ
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Terintegrasi titik peta & PBJ
          </p>
        </div>

      </div>

      {/* CARD SENTRA PERSAWAHAN & KETAHANAN PANGAN DAERAH DENGAN GAMBAR PADI */}
      <div className="relative overflow-hidden rounded-3xl glass-panel shadow-xl border border-emerald-500/30">
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-multiply filter contrast-105"
          style={{
            backgroundImage: `url('/src/assets/images/rice_field_panoramic_1792235985479.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2a17]/95 via-[#0d2a17]/85 to-transparent pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-0.5 text-xs font-bold backdrop-blur-sm">
              <span>🌾</span>
              <span>Kawasan Pertanian & Sentra Padi Unggulan Daerah</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Pendataan Luas Tambah Tanam (LTT), Provitas & Komoditas Pangan
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Monitoring capaian produksi gabah kering giling (GKG), alsintan modern, jaringan irigasi tersier, dan penyaluran bantuan sarana produksi kelompok tani secara digital.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('input-teknis-tph')}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-xs font-bold shadow-md transition cursor-pointer"
            >
              <span>Data Teknis TPH</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onNavigate('input-teknis-psp')}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2.5 text-xs font-bold shadow-md transition cursor-pointer"
            >
              <span>Alsintan & PSP</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. DUA KOLOM: ARSIP TERBARU (READ/EDIT/DOWNLOAD) & STATUS PROPOSAL / PBJ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri (2 Span): Daftar Arsip Terbaru */}
        <div className="lg:col-span-2 rounded-2xl glass-panel p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-700" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Dokumen Arsip Terakhir Masuk
              </h3>
            </div>
            <button
              onClick={() => onNavigate('arsip-semua')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua Arsip</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {archives.slice(0, 5).map((item) => {
              const bMeta = BIDANG_CONFIG[item.bidang];
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectArchive(item)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-md transition cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${bMeta.badgeBg} ${bMeta.badgeText} ${bMeta.badgeBorder}`}>
                        {bMeta.shortLabel}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {item.nomorSurat}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        • {formatDateIndo(item.tanggalSurat)}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {item.uraian}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                      {item.fileSize}
                    </span>
                    <button
                      type="button"
                      className="rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white px-2.5 py-1 text-xs font-semibold transition"
                    >
                      Buka Dokumen
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan (1 Span): Integrasi Proposal & Penyaluran PBJ */}
        <div className="rounded-2xl glass-panel p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-amber-600" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Status Proposal Masyarakat
              </h3>
            </div>
            <button
              onClick={() => onNavigate('input-proposal')}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              Kelola
            </button>
          </div>

          <div className="space-y-3">
            {proposals.slice(0, 4).map((p) => {
              const isTersalurkan =
                p.status === 'Sudah Dilaksanakan / Selesai' || p.status === 'Tersalurkan / Selesai';
              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    isTersalurkan
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 line-clamp-1">
                      {p.kelompokTani} ({p.desa})
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isTersalurkan
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {p.namaUsulan}
                  </p>

                  {p.nomorKontrakPbj && (
                    <div className="text-[10px] text-emerald-800 font-mono bg-emerald-100/60 p-1.5 rounded-lg border border-emerald-200">
                      Terkait PBJ: <strong>{p.nomorKontrakPbj}</strong>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>{p.jumlahUsulan}</span>
                    <a
                      href={`https://www.google.com/maps?q=${p.titikKoordinat.lat},${p.titikKoordinat.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-0.5"
                    >
                      <MapPin className="h-3 w-3" />
                      <span>Lihat Peta</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
