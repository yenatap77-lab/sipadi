/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Wheat,
  Beef,
  Trees,
  Tractor,
  MapPin,
  LocateFixed,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import {
  BidangType,
  TPHLTTItem,
  TPHTanamanPanganItem,
  PeternakanPopulasiItem,
  PerkebunanKomoditiItem,
  PSPItem,
} from '../types';

interface FormTeknisModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetBidang: 'tph' | 'peternakan' | 'perkebunan' | 'psp';
  onSaveTPHLTT: (item: TPHLTTItem) => void;
  onSaveTPHPoktan: (item: TPHTanamanPanganItem) => void;
  onSavePeternakan: (item: PeternakanPopulasiItem) => void;
  onSavePerkebunan: (item: PerkebunanKomoditiItem) => void;
  onSavePSP: (item: PSPItem) => void;
}

export const FormTeknisModal: React.FC<FormTeknisModalProps> = ({
  isOpen,
  onClose,
  targetBidang,
  onSaveTPHLTT,
  onSaveTPHPoktan,
  onSavePeternakan,
  onSavePerkebunan,
  onSavePSP,
}) => {
  // Mode selection for TPH: 'ltt' or 'poktan'
  const [tphSubMode, setTphSubMode] = useState<'ltt' | 'poktan'>('ltt');

  // Common location state
  const [kecamatan, setKecamatan] = useState('Sukamaju');
  const [desa, setDesa] = useState('Cendana Jaya');
  const [lat, setLat] = useState<number>(-7.1524);
  const [lng, setLng] = useState<number>(110.4285);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // TPH LTT fields
  const [jenisKomoditi, setJenisKomoditi] = useState('Padi Sawah');
  const [varietas, setVarietas] = useState('Inpari 32 HDB');
  const [luasBakuLahan, setLuasBakuLahan] = useState<number>(450);
  const [luasTanam, setLuasTanam] = useState<number>(380);
  const [luasPanen, setLuasPanen] = useState<number>(350);
  const [luasFuso, setLuasFuso] = useState<number>(0);
  const [provitas, setProvitas] = useState<number>(6.8);
  const [produksiTon, setProduksiTon] = useState<number>(2380);
  const [petugas, setPetugas] = useState('Penyuluh Pertanian Lapangan (PPL)');

  // TPH Poktan fields
  const [namaKelompokTani, setNamaKelompokTani] = useState('');
  const [komoditasPoktan, setKomoditasPoktan] = useState('Padi Sawah');
  const [luasLahanPoktan, setLuasLahanPoktan] = useState<number>(25);
  const [musimTanam, setMusimTanam] = useState<TPHTanamanPanganItem['musimTanam']>('MT-1 (Rendeng)');
  const [sumberData, setSumberData] = useState<'Penyuluh' | 'Survey Sendiri'>('Penyuluh');
  const [keterangan, setKeterangan] = useState('');

  // Peternakan fields
  const [jenisTernak, setJenisTernak] = useState<PeternakanPopulasiItem['jenisTernak']>('Sapi Potong');
  const [populasi, setPopulasi] = useState<number>(50);
  const [jantan, setJantan] = useState<number>(15);
  const [betina, setBetina] = useState<number>(35);
  const [umurTernak, setUmurTernak] = useState('1 - 2 Tahun');
  const [pemilikTernak, setPemilikTernak] = useState('');
  const [noHpNikTernak, setNoHpNikTernak] = useState('');
  const [kandang, setKandang] = useState<'Ada' | 'Tidak Ada'>('Ada');

  // Perkebunan fields
  const [namaKetuaKebun, setNamaKetuaKebun] = useState('');
  const [jenisTanamanKebun, setJenisTanamanKebun] = useState<PerkebunanKomoditiItem['jenisTanaman']>('Kelapa Sawit');
  const [luasLahanKebun, setLuasLahanKebun] = useState<number>(50);
  const [tanamanProduksi, setTanamanProduksi] = useState<number>(6500);
  const [tanamanBelumProduksi, setTanamanBelumProduksi] = useState<number>(800);
  const [produksiKebunTon, setProduksiKebunTon] = useState<number>(450);

  // PSP fields
  const [jenisDataPSP, setJenisDataPSP] = useState<PSPItem['jenisData']>('Alsintan');
  const [namaKegiatanPSP, setNamaKegiatanPSP] = useState('');
  const [kelompokTaniPSP, setKelompokTaniPSP] = useState('');
  const [namaKetuaPSP, setNamaKetuaPSP] = useState('');
  const [nikNoHpPSP, setNikNoHpPSP] = useState('');
  const [volumePSP, setVolumePSP] = useState('1 Unit');
  const [jumlahAnggotaPSP, setJumlahAnggotaPSP] = useState<number>(35);
  const [tahunPSP, setTahunPSP] = useState<number>(new Date().getFullYear());
  const [kondisiPSP, setKondisiPSP] = useState<PSPItem['kondisi']>('Baik');
  const [merekKhususAlsintan, setMerekKhususAlsintan] = useState('');

  if (!isOpen) return null;

  // Real device GPS detector
  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      alert('Perangkat Anda tidak mendukung geolokasi GPS.');
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(6)));
        setLng(Number(pos.coords.longitude.toFixed(6)));
        setIsGettingLocation(false);
      },
      (err) => {
        console.warn('GPS Error:', err);
        setIsGettingLocation(false);
        alert('Gagal mengambil titik GPS. Pastikan izin lokasi diaktifkan.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (targetBidang === 'tph') {
      if (tphSubMode === 'ltt') {
        const item: TPHLTTItem = {
          id: 'ltt-' + Date.now(),
          kecamatan,
          desa,
          jenisKomoditi,
          varietas,
          luasBakuLahan,
          luasTanam,
          luasPanen,
          luasFuso,
          provitas,
          produksiTon,
          periode: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
          petugas,
          createdAt: new Date().toISOString(),
        };
        onSaveTPHLTT(item);
      } else {
        const item: TPHTanamanPanganItem = {
          id: 'tph-pok-' + Date.now(),
          kecamatan,
          desa,
          namaKelompokTani: namaKelompokTani || 'Poktan Tani Sejahtera',
          komoditas: komoditasPoktan,
          luasLahan: luasLahanPoktan,
          luasTanam,
          luasPanen,
          produksi: produksiTon,
          musimTanam,
          sumberData,
          titikKoordinat: { lat, lng },
          keterangan,
          createdAt: new Date().toISOString(),
        };
        onSaveTPHPoktan(item);
      }
    } else if (targetBidang === 'peternakan') {
      const item: PeternakanPopulasiItem = {
        id: 'ternak-' + Date.now(),
        kecamatan,
        desa,
        jenisTernak,
        populasi,
        jantan,
        betina,
        umurTernak,
        pemilikTernak: pemilikTernak || 'Kelompok Peternak Mandiri',
        noHpNik: noHpNikTernak || '08xxxxxxxxxx',
        kandang,
        titikKoordinat: { lat, lng },
        createdAt: new Date().toISOString(),
      };
      onSavePeternakan(item);
    } else if (targetBidang === 'perkebunan') {
      const item: PerkebunanKomoditiItem = {
        id: 'kebun-' + Date.now(),
        kecamatan,
        desa,
        namaKelompokTani: namaKelompokTani || 'Poktan Sawit Makmur',
        namaKetua: namaKetuaKebun || 'H. Kusnadi',
        jenisTanaman: jenisTanamanKebun,
        luasLahan: luasLahanKebun,
        titikKoordinat: { lat, lng },
        jumlahTanamanProduksi: tanamanProduksi,
        jumlahTanamanBelumProduksi: tanamanBelumProduksi,
        jumlahProduksi: produksiKebunTon,
        createdAt: new Date().toISOString(),
      };
      onSavePerkebunan(item);
    } else if (targetBidang === 'psp') {
      const item: PSPItem = {
        id: 'psp-' + Date.now(),
        jenisData: jenisDataPSP,
        namaKegiatan: namaKegiatanPSP || `Bantuan ${jenisDataPSP} TA ${tahunPSP}`,
        kecamatan,
        desa,
        kelompokTani: kelompokTaniPSP || 'Gapoktan Makmur',
        namaKetua: namaKetuaPSP || 'Subandi',
        nikNoHp: nikNoHpPSP || '08xxxxxxxxxx',
        volume: volumePSP,
        jumlahAnggotaKelompok: jumlahAnggotaPSP,
        tahun: tahunPSP,
        kondisi: kondisiPSP,
        merekKhususAlsintan: jenisDataPSP === 'Alsintan' ? merekKhususAlsintan : undefined,
        titikKoordinat: { lat, lng },
        createdAt: new Date().toISOString(),
      };
      onSavePSP(item);
    }

    onClose();
  };

  const getTitleAndHeader = () => {
    switch (targetBidang) {
      case 'tph':
        return {
          title: 'Input Data Teknis Bidang TPH',
          sub: 'Data Luas Tambah Tanam (LTT), Produksi & Data Kelompok Tani',
          gradient: 'from-emerald-800 to-green-950',
          icon: <Wheat className="h-5 w-5" />,
        };
      case 'peternakan':
        return {
          title: 'Input Data Teknis Peternakan',
          sub: 'Data Populasi Ternak, Kandang & Lokasi Koordinat Peternak',
          gradient: 'from-rose-800 to-rose-950',
          icon: <Beef className="h-5 w-5" />,
        };
      case 'perkebunan':
        return {
          title: 'Input Data Teknis Perkebunan',
          sub: 'Komoditi Perkebunan Rakyat, Luas Areal & Jumlah Tanaman',
          gradient: 'from-teal-800 to-teal-950',
          icon: <Trees className="h-5 w-5" />,
        };
      case 'psp':
        return {
          title: 'Input Data Teknis Prasarana & Sarana (PSP)',
          sub: 'Alsintan, Jaringan Irigasi Tersier & Pembangunan Jalan Usahatani (JUT)',
          gradient: 'from-amber-700 to-amber-950',
          icon: <Tractor className="h-5 w-5" />,
        };
    }
  };

  const headerMeta = getTitleAndHeader();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className={`flex items-center justify-between border-b border-white/20 bg-gradient-to-r ${headerMeta.gradient} px-5 py-4 text-white`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-900 shadow-sm">
              {headerMeta.icon}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{headerMeta.title}</h2>
              <p className="text-xs text-white/80">{headerMeta.sub}</p>
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
          
          {/* TPH Mode Switcher */}
          {targetBidang === 'tph' && (
            <div className="flex items-center gap-2 p-1.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <button
                type="button"
                onClick={() => setTphSubMode('ltt')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  tphSubMode === 'ltt'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                1. Data LTT & Data Produksi (Kecamatan/Desa)
              </button>
              <button
                type="button"
                onClick={() => setTphSubMode('poktan')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  tphSubMode === 'poktan'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                2. Data Kelompok Tani Tanaman Pangan & Horti
              </button>
            </div>
          )}

          {/* Lokasi Wilayah (Kecamatan & Desa) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kecamatan</label>
              <input
                type="text"
                required
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Desa / Kelurahan</label>
              <input
                type="text"
                required
                value={desa}
                onChange={(e) => setDesa(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Conditional Field Sets based on Target Bidang */}
          {targetBidang === 'tph' && tphSubMode === 'ltt' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Komoditi</label>
                <input
                  type="text"
                  required
                  value={jenisKomoditi}
                  onChange={(e) => setJenisKomoditi(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Varietas</label>
                <input
                  type="text"
                  required
                  value={varietas}
                  onChange={(e) => setVarietas(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Luas Baku Lahan (Ha)</label>
                <input
                  type="number"
                  value={luasBakuLahan}
                  onChange={(e) => setLuasBakuLahan(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Luas Tanam (Ha)</label>
                <input
                  type="number"
                  value={luasTanam}
                  onChange={(e) => setLuasTanam(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Luas Panen (Ha)</label>
                <input
                  type="number"
                  value={luasPanen}
                  onChange={(e) => setLuasPanen(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Luas Fuso (Ha)</label>
                <input
                  type="number"
                  value={luasFuso}
                  onChange={(e) => setLuasFuso(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Provitas (Ku/Ha)</label>
                <input
                  type="number"
                  step="0.1"
                  value={provitas}
                  onChange={(e) => setProvitas(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Produksi (Ton)</label>
                <input
                  type="number"
                  value={produksiTon}
                  onChange={(e) => setProduksiTon(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Petugas PPL</label>
                <input
                  type="text"
                  value={petugas}
                  onChange={(e) => setPetugas(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {targetBidang === 'tph' && tphSubMode === 'poktan' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kelompok Tani</label>
                <input
                  type="text"
                  required
                  placeholder="Poktan Sido Makmur"
                  value={namaKelompokTani}
                  onChange={(e) => setNamaKelompokTani(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Komoditas</label>
                <input
                  type="text"
                  value={komoditasPoktan}
                  onChange={(e) => setKomoditasPoktan(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Luas Lahan (Ha)</label>
                <input
                  type="number"
                  value={luasLahanPoktan}
                  onChange={(e) => setLuasLahanPoktan(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Musim Tanam</label>
                <select
                  value={musimTanam}
                  onChange={(e) => setMusimTanam(e.target.value as TPHTanamanPanganItem['musimTanam'])}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white"
                >
                  <option value="MT-1 (Rendeng)">MT-1 (Rendeng)</option>
                  <option value="MT-2 (Gadu)">MT-2 (Gadu)</option>
                  <option value="MT-3 (Kemarau)">MT-3 (Kemarau)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sumber Data</label>
                <select
                  value={sumberData}
                  onChange={(e) => setSumberData(e.target.value as 'Penyuluh' | 'Survey Sendiri')}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white"
                >
                  <option value="Penyuluh">Penyuluh Lapangan</option>
                  <option value="Survey Sendiri">Survey Sendiri / Mandiri</option>
                </select>
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Tambahan</label>
                <input
                  type="text"
                  placeholder="Keterangan pengairan, varietas, pemupukan..."
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* Peternakan Form */}
          {targetBidang === 'peternakan' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Ternak</label>
                <select
                  value={jenisTernak}
                  onChange={(e) => setJenisTernak(e.target.value as PeternakanPopulasiItem['jenisTernak'])}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white"
                >
                  <option value="Sapi Potong">Sapi Potong</option>
                  <option value="Sapi Perah">Sapi Perah</option>
                  <option value="Kambing">Kambing</option>
                  <option value="Domba">Domba</option>
                  <option value="Ayam Broiler">Ayam Broiler</option>
                  <option value="Ayam Petelur">Ayam Petelur</option>
                  <option value="Itik / Bebek">Itik / Bebek</option>
                  <option value="Kerbau">Kerbau</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Populasi (Ekor)</label>
                <input
                  type="number"
                  value={populasi}
                  onChange={(e) => setPopulasi(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Umur Ternak</label>
                <input
                  type="text"
                  value={umurTernak}
                  onChange={(e) => setUmurTernak(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Jantan</label>
                <input
                  type="number"
                  value={jantan}
                  onChange={(e) => setJantan(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Betina</label>
                <input
                  type="number"
                  value={betina}
                  onChange={(e) => setBetina(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kandang</label>
                <select
                  value={kandang}
                  onChange={(e) => setKandang(e.target.value as 'Ada' | 'Tidak Ada')}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white"
                >
                  <option value="Ada">Ada Kandang</option>
                  <option value="Tidak Ada">Tidak Ada (Umbar)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Pemilik Ternak / Kelompok</label>
                <input
                  type="text"
                  placeholder="Nama pemilik atau kelompok peternak"
                  value={pemilikTernak}
                  onChange={(e) => setPemilikTernak(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No HP / NIK Pemilik</label>
                <input
                  type="text"
                  placeholder="NIK atau nomor telepon"
                  value={noHpNikTernak}
                  onChange={(e) => setNoHpNikTernak(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* Perkebunan Form */}
          {targetBidang === 'perkebunan' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kelompok Tani</label>
                <input
                  type="text"
                  required
                  placeholder="Poktan Sawit Makmur"
                  value={namaKelompokTani}
                  onChange={(e) => setNamaKelompokTani(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ketua Kelompok</label>
                <input
                  type="text"
                  value={namaKetuaKebun}
                  onChange={(e) => setNamaKetuaKebun(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Tanaman Perkebunan</label>
                <select
                  value={jenisTanamanKebun}
                  onChange={(e) => setJenisTanamanKebun(e.target.value as PerkebunanKomoditiItem['jenisTanaman'])}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white"
                >
                  <option value="Kelapa Sawit">Kelapa Sawit</option>
                  <option value="Kopi Robusta">Kopi Robusta</option>
                  <option value="Kopi Arabika">Kopi Arabika</option>
                  <option value="Kakao">Kakao</option>
                  <option value="Karet">Karet</option>
                  <option value="Cengkeh">Cengkeh</option>
                  <option value="Lada">Lada</option>
                  <option value="Kelapa Dalam">Kelapa Dalam</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Luas Lahan (Ha)</label>
                <input
                  type="number"
                  value={luasLahanKebun}
                  onChange={(e) => setLuasLahanKebun(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanaman Menghasilkan (Pohon)</label>
                <input
                  type="number"
                  value={tanamanProduksi}
                  onChange={(e) => setTanamanProduksi(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanaman Belum Menghasilkan (Pohon)</label>
                <input
                  type="number"
                  value={tanamanBelumProduksi}
                  onChange={(e) => setTanamanBelumProduksi(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Produksi (Ton)</label>
                <input
                  type="number"
                  value={produksiKebunTon}
                  onChange={(e) => setProduksiKebunTon(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* PSP Form */}
          {targetBidang === 'psp' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Data PSP</label>
                <select
                  value={jenisDataPSP}
                  onChange={(e) => setJenisDataPSP(e.target.value as PSPItem['jenisData'])}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white font-bold text-amber-900"
                >
                  <option value="Alsintan">1. Data Alsintan</option>
                  <option value="Jaringan Irigasi">2. Data Jaringan Irigasi</option>
                  <option value="Jalan Usahatani">3. Data Jalan Usahatani (JUT)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kegiatan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembangunan Jaringan Irigasi Tersier Blok Timur"
                  value={namaKegiatanPSP}
                  onChange={(e) => setNamaKegiatanPSP(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kelompok Tani / P3A</label>
                <input
                  type="text"
                  placeholder="P3A Tirta Mandiri"
                  value={kelompokTaniPSP}
                  onChange={(e) => setKelompokTaniPSP(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ketua Kelompok</label>
                <input
                  type="text"
                  placeholder="Nama ketua"
                  value={namaKetuaPSP}
                  onChange={(e) => setNamaKetuaPSP(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NIK / No HP</label>
                <input
                  type="text"
                  placeholder="NIK atau kontak telepon"
                  value={nikNoHpPSP}
                  onChange={(e) => setNikNoHpPSP(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Volume</label>
                <input
                  type="text"
                  placeholder="2 Unit / 600 Meter"
                  value={volumePSP}
                  onChange={(e) => setVolumePSP(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Anggota Kelompok</label>
                <input
                  type="number"
                  value={jumlahAnggotaPSP}
                  onChange={(e) => setJumlahAnggotaPSP(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Pengadaan</label>
                <input
                  type="number"
                  value={tahunPSP}
                  onChange={(e) => setTahunPSP(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kondisi</label>
                <select
                  value={kondisiPSP}
                  onChange={(e) => setKondisiPSP(e.target.value as PSPItem['kondisi'])}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white"
                >
                  <option value="Baik">Baik</option>
                  <option value="Rusak Ringan">Rusak Ringan</option>
                  <option value="Rusak Berat">Rusak Berat</option>
                </select>
              </div>

              {jenisDataPSP === 'Alsintan' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Merek Khusus Alsintan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kubota L4018 / Quick G3000 Zeva / Yanmar"
                    value={merekKhususAlsintan}
                    onChange={(e) => setMerekKhususAlsintan(e.target.value)}
                    className="w-full rounded-xl border border-amber-300 bg-amber-50/50 px-3 py-2 text-xs font-semibold"
                  />
                </div>
              )}
            </div>
          )}

          {/* Titik Koordinat (Latitude, Longitude) dengan tombol GPS */}
          {(targetBidang !== 'tph' || tphSubMode === 'poktan') && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <MapPin className="h-4 w-4 text-rose-500" />
                  <span>Titik Koordinat Lokasi Lapangan</span>
                </div>
                <button
                  type="button"
                  onClick={handleGetGPS}
                  disabled={isGettingLocation}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition"
                >
                  <LocateFixed className="h-3.5 w-3.5" />
                  <span>{isGettingLocation ? 'Mendeteksi GPS...' : 'Ambil GPS Saya'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={lat}
                    onChange={(e) => setLat(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-1.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={lng}
                    onChange={(e) => setLng(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-1.5 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit button */}
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
              <span>Simpan Data Teknis</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
