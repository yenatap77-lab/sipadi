/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Wheat,
  Beef,
  Trees,
  Tractor,
  Eye,
  Edit3,
  Trash2,
  Download,
  Printer,
  MapPin,
  ExternalLink,
  Check,
  Calendar,
  Layers,
  Save,
  CheckCircle2,
  QrCode,
} from 'lucide-react';
import {
  TPHLTTItem,
  TPHTanamanPanganItem,
  PeternakanPopulasiItem,
  PerkebunanKomoditiItem,
  PSPItem,
} from '../types';
import { formatDateIndo } from '../utils/formatters';
import { KopSuratMorowali } from './KopSuratMorowali';
import { generateQRCodeDataURL, createTeknisQRPayload } from '../utils/qrCodeGenerator';

export type TeknisDataType = 'tph-ltt' | 'tph-poktan' | 'peternakan' | 'perkebunan' | 'psp';

interface DetailTeknisModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TeknisDataType;
  item: any;
  initialMode?: 'view' | 'edit';
  onUpdateTPHLTT?: (item: TPHLTTItem) => void;
  onUpdateTPHPoktan?: (item: TPHTanamanPanganItem) => void;
  onUpdatePeternakan?: (item: PeternakanPopulasiItem) => void;
  onUpdatePerkebunan?: (item: PerkebunanKomoditiItem) => void;
  onUpdatePSP?: (item: PSPItem) => void;
  onDeleteItem: (id: string, type: TeknisDataType) => void;
}

export const DetailTeknisModal: React.FC<DetailTeknisModalProps> = ({
  isOpen,
  onClose,
  type,
  item,
  initialMode = 'view',
  onUpdateTPHLTT,
  onUpdateTPHPoktan,
  onUpdatePeternakan,
  onUpdatePerkebunan,
  onUpdatePSP,
  onDeleteItem,
}) => {
  if (!isOpen || !item) return null;

  const [isEditing, setIsEditing] = useState(initialMode === 'edit');
  const [formData, setFormData] = useState<any>({ ...item });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [teknisQrUrl, setTeknisQrUrl] = useState<string>('');

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
      setIsEditing(initialMode === 'edit');
      setShowDeleteConfirm(false);

      const payload = createTeknisQRPayload(item, type);
      generateQRCodeDataURL(payload, { width: 280, margin: 1 })
        .then((url) => setTeknisQrUrl(url))
        .catch(console.error);
    }
  }, [item, initialMode, type]);

  const getMeta = () => {
    switch (type) {
      case 'tph-ltt':
        return {
          title: 'Data Teknis LTT & Produksi Padi (TPH)',
          badge: 'TPH - LTT & Panen',
          color: 'emerald',
          icon: <Wheat className="h-5 w-5 text-emerald-700" />,
          gradient: 'from-emerald-700 to-emerald-900',
        };
      case 'tph-poktan':
        return {
          title: 'Data Kelompok Tani Tanaman Pangan (TPH)',
          badge: 'TPH - Poktan Binaan',
          color: 'emerald',
          icon: <Wheat className="h-5 w-5 text-emerald-700" />,
          gradient: 'from-emerald-700 to-emerald-900',
        };
      case 'peternakan':
        return {
          title: 'Data Teknis Populasi & Sentra Peternakan',
          badge: 'Peternakan & Keswan',
          color: 'rose',
          icon: <Beef className="h-5 w-5 text-rose-700" />,
          gradient: 'from-rose-800 to-rose-950',
        };
      case 'perkebunan':
        return {
          title: 'Data Teknis Komoditas Perkebunan Rakyat',
          badge: 'Perkebunan',
          color: 'teal',
          icon: <Trees className="h-5 w-5 text-teal-700" />,
          gradient: 'from-teal-800 to-teal-950',
        };
      case 'psp':
      default:
        return {
          title: 'Data Prasarana & Sarana Pertanian (PSP)',
          badge: 'PSP - Alsintan/JUT/Irigasi',
          color: 'amber',
          icon: <Tractor className="h-5 w-5 text-amber-700" />,
          gradient: 'from-amber-700 to-amber-950',
        };
    }
  };

  const meta = getMeta();

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'tph-ltt' && onUpdateTPHLTT) onUpdateTPHLTT(formData);
    else if (type === 'tph-poktan' && onUpdateTPHPoktan) onUpdateTPHPoktan(formData);
    else if (type === 'peternakan' && onUpdatePeternakan) onUpdatePeternakan(formData);
    else if (type === 'perkebunan' && onUpdatePerkebunan) onUpdatePerkebunan(formData);
    else if (type === 'psp' && onUpdatePSP) onUpdatePSP(formData);
    setIsEditing(false);
  };

  // Handle Single Item Download
  const handleDownload = () => {
    let reportText = `========================================================\n`;
    reportText += `PEMERINTAH DAERAH - DINAS PERTANIAN & KETAHANAN PANGAN\n`;
    reportText += `LEMBAR HASIL INPUT DATA TEKNIS RESMI - SIPADI DIGITAL\n`;
    reportText += `========================================================\n\n`;
    reportText += `KATEGORI DATA   : ${meta.title}\n`;
    reportText += `WILAYAH         : Desa ${formData.desa}, Kec. ${formData.kecamatan}\n`;
    reportText += `TANGGAL INPUT   : ${formatDateIndo(formData.createdAt || new Date().toISOString())}\n\n`;

    if (type === 'tph-ltt') {
      reportText += `RINCIAN DATA LTT & PRODUKSI:\n`;
      reportText += `- Komoditi/Varietas : ${formData.jenisKomoditi} (${formData.varietas})\n`;
      reportText += `- Luas Baku Lahan   : ${formData.luasBakuLahan} Ha\n`;
      reportText += `- Luas Tanam        : ${formData.luasTanam} Ha\n`;
      reportText += `- Luas Panen        : ${formData.luasPanen} Ha\n`;
      reportText += `- Luas Fuso         : ${formData.luasFuso} Ha\n`;
      reportText += `- Provitas          : ${formData.provitas} Ku/Ha\n`;
      reportText += `- Total Produksi    : ${formData.produksiTon} Ton\n`;
      reportText += `- Petugas PPL       : ${formData.petugas}\n`;
    } else if (type === 'tph-poktan') {
      reportText += `RINCIAN DATA KELOMPOK TANI TPH:\n`;
      reportText += `- Nama Poktan       : ${formData.namaKelompokTani}\n`;
      reportText += `- Komoditas         : ${formData.komoditas || 'Padi Sawah'}\n`;
      reportText += `- Musim Tanam       : ${formData.musimTanam}\n`;
      reportText += `- Luas Lahan        : ${formData.luasLahan} Ha\n`;
      reportText += `- Luas Tanam        : ${formData.luasTanam} Ha\n`;
      reportText += `- Luas Panen        : ${formData.luasPanen} Ha\n`;
      reportText += `- Estimasi Produksi : ${formData.produksi} Ton\n`;
      reportText += `- Sumber Data       : ${formData.sumberData}\n`;
      if (formData.titikKoordinat) {
        reportText += `- Titik Koordinat   : Lat ${formData.titikKoordinat.lat}, Lng ${formData.titikKoordinat.lng}\n`;
      }
    } else if (type === 'peternakan') {
      reportText += `RINCIAN DATA PETERNAKAN:\n`;
      reportText += `- Pemilik Ternak    : ${formData.pemilikTernak}\n`;
      reportText += `- Jenis Ternak      : ${formData.jenisTernak}\n`;
      reportText += `- Populasi Total    : ${formData.populasi} Ekor\n`;
      reportText += `- Jantan / Betina   : ${formData.jantan} Ekor / ${formData.betina} Ekor\n`;
      reportText += `- Kontak / NIK      : ${formData.noHpNik || '-'}\n`;
      reportText += `- Status Kandang    : ${formData.kandang}\n`;
      if (formData.titikKoordinat) {
        reportText += `- Titik Koordinat   : Lat ${formData.titikKoordinat.lat}, Lng ${formData.titikKoordinat.lng}\n`;
      }
    } else if (type === 'perkebunan') {
      reportText += `RINCIAN DATA KOMODITAS PERKEBUNAN:\n`;
      reportText += `- Kelompok Tani     : ${formData.namaKelompokTani}\n`;
      reportText += `- Ketua Kelompok    : ${formData.namaKetua}\n`;
      reportText += `- Jenis Komoditas   : ${formData.jenisTanaman}\n`;
      reportText += `- Luas Lahan        : ${formData.luasLahan} Ha\n`;
      reportText += `- Tanaman Menghasilkan : ${formData.jumlahTanamanProduksi} Pohon\n`;
      reportText += `- Belum Menghasilkan   : ${formData.jumlahTanamanBelumProduksi} Pohon\n`;
      reportText += `- Estimasi Produksi : ${formData.jumlahProduksi} Ton\n`;
      if (formData.titikKoordinat) {
        reportText += `- Titik Koordinat   : Lat ${formData.titikKoordinat.lat}, Lng ${formData.titikKoordinat.lng}\n`;
      }
    } else if (type === 'psp') {
      reportText += `RINCIAN DATA PRASARANA & SARANA PERTANIAN:\n`;
      reportText += `- Program / Kegiatan: ${formData.namaKegiatan}\n`;
      reportText += `- Jenis Data (TA)   : ${formData.jenisData} (Tahun ${formData.tahun})\n`;
      reportText += `- Kelompok Tani     : ${formData.kelompokTani} (Ketua: ${formData.namaKetua})\n`;
      reportText += `- Volume            : ${formData.volume}\n`;
      if (formData.merekKhususAlsintan) {
        reportText += `- Merek / Tipe      : ${formData.merekKhususAlsintan}\n`;
      }
      reportText += `- Kondisi Aset      : ${formData.kondisi}\n`;
      reportText += `- Anggota Poktan    : ${formData.jumlahAnggotaKelompok} Orang\n`;
      reportText += `- Kontak / NIK      : ${formData.nikNoHp || '-'}\n`;
      if (formData.titikKoordinat) {
        reportText += `- Titik Koordinat   : Lat ${formData.titikKoordinat.lat}, Lng ${formData.titikKoordinat.lng}\n`;
      }
    }

    reportText += `\n========================================================\n`;
    reportText += `Data terverifikasi sah dalam sistem SIPADI DIGITAL Dinas Pertanian Daerah.\n`;
    reportText += `Dicetak pada: ${new Date().toLocaleString('id-ID')}\n`;
    reportText += `========================================================\n`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Data_${type}_${formData.desa}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const mapsUrl = formData.titikKoordinat
    ? `https://www.google.com/maps?q=${formData.titikKoordinat.lat},${formData.titikKoordinat.lng}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Modal Header */}
        <div className={`flex items-center justify-between border-b border-slate-200 bg-gradient-to-r ${meta.gradient} px-5 py-4 text-white`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/15 text-white shadow-xs">
              {meta.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white uppercase tracking-wider">
                  {meta.badge}
                </span>
                <span className="text-xs text-emerald-200">
                  Desa {formData.desa}, Kec. {formData.kecamatan}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {isEditing ? `Edit: ${meta.title}` : meta.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 rounded-lg bg-white/15 hover:bg-white/25 text-white px-2.5 py-1.5 text-xs font-bold transition cursor-pointer"
                title="Edit data ini"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Data</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {showDeleteConfirm && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-rose-900 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                <Trash2 className="h-4 w-4 text-rose-600" />
                <span>Konfirmasi Hapus Data Teknis</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">
                Apakah Anda yakin ingin menghapus data ini dari sistem? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteItem(formData.id, type);
                    onClose();
                  }}
                  className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition"
                >
                  Ya, Hapus Data
                </button>
              </div>
            </div>
          )}

          {isEditing ? (
            /* EDIT FORM */
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Kecamatan</label>
                  <input
                    type="text"
                    required
                    value={formData.kecamatan}
                    onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 font-medium focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Desa / Kelurahan</label>
                  <input
                    type="text"
                    required
                    value={formData.desa}
                    onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 font-medium focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Specific fields based on type */}
              {type === 'tph-ltt' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Komoditi</label>
                    <input
                      type="text"
                      value={formData.jenisKomoditi}
                      onChange={(e) => setFormData({ ...formData, jenisKomoditi: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Varietas</label>
                    <input
                      type="text"
                      value={formData.varietas}
                      onChange={(e) => setFormData({ ...formData, varietas: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Petugas PPL</label>
                    <input
                      type="text"
                      value={formData.petugas}
                      onChange={(e) => setFormData({ ...formData, petugas: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Luas Tanam (Ha)</label>
                    <input
                      type="number"
                      value={formData.luasTanam}
                      onChange={(e) => setFormData({ ...formData, luasTanam: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-mono focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Luas Panen (Ha)</label>
                    <input
                      type="number"
                      value={formData.luasPanen}
                      onChange={(e) => setFormData({ ...formData, luasPanen: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-mono focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Total Produksi (Ton)</label>
                    <input
                      type="number"
                      value={formData.produksiTon}
                      onChange={(e) => setFormData({ ...formData, produksiTon: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-mono font-bold focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {type === 'tph-poktan' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Nama Kelompok Tani</label>
                    <input
                      type="text"
                      required
                      value={formData.namaKelompokTani}
                      onChange={(e) => setFormData({ ...formData, namaKelompokTani: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-bold focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Musim Tanam</label>
                    <select
                      value={formData.musimTanam}
                      onChange={(e) => setFormData({ ...formData, musimTanam: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="MT-1 (Rendeng)">MT-1 (Rendeng)</option>
                      <option value="MT-2 (Gadu)">MT-2 (Gadu)</option>
                      <option value="MT-3 (Kemarau)">MT-3 (Kemarau)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Luas Lahan (Ha)</label>
                    <input
                      type="number"
                      value={formData.luasLahan}
                      onChange={(e) => setFormData({ ...formData, luasLahan: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-mono focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Produksi (Ton)</label>
                    <input
                      type="number"
                      value={formData.produksi}
                      onChange={(e) => setFormData({ ...formData, produksi: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-mono font-bold focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {type === 'peternakan' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Pemilik Ternak</label>
                    <input
                      type="text"
                      required
                      value={formData.pemilikTernak}
                      onChange={(e) => setFormData({ ...formData, pemilikTernak: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-bold focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Jenis Ternak</label>
                    <input
                      type="text"
                      value={formData.jenisTernak}
                      onChange={(e) => setFormData({ ...formData, jenisTernak: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Kontak / NIK</label>
                    <input
                      type="text"
                      value={formData.noHpNik}
                      onChange={(e) => setFormData({ ...formData, noHpNik: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-mono focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Total Populasi (Ekor)</label>
                    <input
                      type="number"
                      value={formData.populasi}
                      onChange={(e) => setFormData({ ...formData, populasi: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-mono font-bold text-rose-700 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Jantan (Ekor)</label>
                    <input
                      type="number"
                      value={formData.jantan}
                      onChange={(e) => setFormData({ ...formData, jantan: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-mono focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Betina (Ekor)</label>
                    <input
                      type="number"
                      value={formData.betina}
                      onChange={(e) => setFormData({ ...formData, betina: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-mono focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {type === 'perkebunan' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Nama Kelompok Tani</label>
                    <input
                      type="text"
                      required
                      value={formData.namaKelompokTani}
                      onChange={(e) => setFormData({ ...formData, namaKelompokTani: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-bold focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Nama Ketua</label>
                    <input
                      type="text"
                      value={formData.namaKetua}
                      onChange={(e) => setFormData({ ...formData, namaKetua: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Jenis Komoditas</label>
                    <input
                      type="text"
                      value={formData.jenisTanaman}
                      onChange={(e) => setFormData({ ...formData, jenisTanaman: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Luas Lahan (Ha)</label>
                    <input
                      type="number"
                      value={formData.luasLahan}
                      onChange={(e) => setFormData({ ...formData, luasLahan: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-mono focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Tanaman Menghasilkan</label>
                    <input
                      type="number"
                      value={formData.jumlahTanamanProduksi}
                      onChange={(e) => setFormData({ ...formData, jumlahTanamanProduksi: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-mono focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Total Produksi (Ton)</label>
                    <input
                      type="number"
                      value={formData.jumlahProduksi}
                      onChange={(e) => setFormData({ ...formData, jumlahProduksi: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-mono font-bold text-teal-800 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {type === 'psp' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Nama Kegiatan / Program</label>
                    <input
                      type="text"
                      required
                      value={formData.namaKegiatan}
                      onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-bold focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Kelompok Tani Penerima</label>
                    <input
                      type="text"
                      required
                      value={formData.kelompokTani}
                      onChange={(e) => setFormData({ ...formData, kelompokTani: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Volume</label>
                    <input
                      type="text"
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Merek / Spesifikasi Khusus</label>
                    <input
                      type="text"
                      value={formData.merekKhususAlsintan || ''}
                      onChange={(e) => setFormData({ ...formData, merekKhususAlsintan: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Kondisi Saat Ini</label>
                    <select
                      value={formData.kondisi}
                      onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-2 focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="Baik">Baik</option>
                      <option value="Rusak Ringan">Rusak Ringan</option>
                      <option value="Rusak Berat">Rusak Berat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Tahun Anggaran (TA)</label>
                    <input
                      type="number"
                      value={formData.tahun}
                      onChange={(e) => setFormData({ ...formData, tahun: parseInt(e.target.value) || 2026 })}
                      className="w-full rounded-xl border border-slate-300 p-2 font-mono focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-5 py-2 text-xs font-bold text-white shadow-sm transition"
                >
                  <Save className="h-4 w-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          ) : (
            /* VIEW DETAIL MODE */
            <div className="space-y-4">
              
              {/* Kop Surat Pemerintah Kabupaten Morowali */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <KopSuratMorowali
                  compact={true}
                  documentTitle={`LEMBAR DATA TEKNIS ${meta.badge.toUpperCase()}`}
                  nomorRegistrasi={formData.id}
                  documentSubtitle="Pusat Data Pertanian Digital • Dinas Pertanian Daerah Kabupaten Morowali"
                />
              </div>

              {/* Wilayah Banner & QR Code */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Wilayah Administrasi
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    Desa {formData.desa}, Kecamatan {formData.kecamatan}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {teknisQrUrl && (
                    <div className="flex items-center gap-1.5 bg-white border border-emerald-300 px-2 py-1 rounded-lg">
                      <img src={teknisQrUrl} alt="QR Teknis" className="w-8 h-8 rounded" />
                      <span className="text-[9px] font-bold text-emerald-900 uppercase">QR Valid</span>
                    </div>
                  )}
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 text-xs font-bold hover:bg-emerald-100 transition"
                    >
                      <MapPin className="h-3.5 w-3.5 text-rose-600" />
                      <span>Google Maps</span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </a>
                  )}
                </div>
              </div>

              {/* Data Grid based on Type */}
              {type === 'tph-ltt' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Komoditas & Varietas</span>
                    <span className="text-xs font-bold text-emerald-800">{formData.jenisKomoditi}</span>
                    <span className="text-[11px] text-slate-500 block">({formData.varietas})</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Luas Baku Lahan</span>
                    <span className="text-sm font-bold font-mono text-slate-800">{formData.luasBakuLahan} Ha</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase block">Luas Tanam (LTT)</span>
                    <span className="text-sm font-extrabold font-mono text-emerald-800">{formData.luasTanam} Ha</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                    <span className="text-[10px] text-amber-700 font-bold uppercase block">Luas Panen</span>
                    <span className="text-sm font-extrabold font-mono text-amber-800">{formData.luasPanen} Ha</span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                    <span className="text-[10px] text-rose-700 font-bold uppercase block">Luas Fuso</span>
                    <span className="text-sm font-mono font-bold text-rose-700">{formData.luasFuso} Ha</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Provitas Panen</span>
                    <span className="text-sm font-mono font-bold text-slate-800">{formData.provitas} Ku/Ha</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-100/60 border border-emerald-300 sm:col-span-2">
                    <span className="text-[10px] text-emerald-800 font-bold uppercase block">Total Produksi Gabah/Pangan</span>
                    <span className="text-lg font-extrabold font-mono text-emerald-900">{formData.produksiTon} Ton</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Petugas PPL Pembina</span>
                    <span className="text-xs font-semibold text-slate-700">{formData.petugas}</span>
                  </div>
                </div>
              )}

              {type === 'tph-poktan' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 sm:col-span-2">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase block">Kelompok Tani</span>
                    <span className="text-sm font-extrabold text-slate-900">{formData.namaKelompokTani}</span>
                    <span className="text-[11px] text-slate-500 block">Komoditas: {formData.komoditas || 'Padi Sawah'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Musim Tanam</span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 inline-block mt-0.5">
                      {formData.musimTanam}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Luas Hamparan Lahan</span>
                    <span className="text-sm font-mono font-bold text-slate-800">{formData.luasLahan} Ha</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Luas Tanam</span>
                    <span className="text-sm font-mono font-bold text-emerald-700">{formData.luasTanam} Ha</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Estimasi Hasil Produksi</span>
                    <span className="text-sm font-mono font-extrabold text-emerald-800">{formData.produksi} Ton</span>
                  </div>
                </div>
              )}

              {type === 'peternakan' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 sm:col-span-2">
                    <span className="text-[10px] text-rose-700 font-bold uppercase block">Pemilik Peternakan</span>
                    <span className="text-sm font-extrabold text-slate-900">{formData.pemilikTernak}</span>
                    <span className="text-[11px] text-slate-500 block">No. Kontak / NIK: {formData.noHpNik || '-'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Komoditas Ternak</span>
                    <span className="text-xs font-bold text-rose-800">{formData.jenisTernak}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-100/60 border border-rose-300">
                    <span className="text-[10px] text-rose-800 font-bold uppercase block">Total Populasi</span>
                    <span className="text-lg font-extrabold font-mono text-rose-900">{formData.populasi} Ekor</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Jantan</span>
                    <span className="text-sm font-mono font-bold text-slate-800">{formData.jantan} Ekor</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Betina</span>
                    <span className="text-sm font-mono font-bold text-rose-700">{formData.betina} Ekor</span>
                  </div>
                </div>
              )}

              {type === 'perkebunan' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 sm:col-span-2">
                    <span className="text-[10px] text-teal-700 font-bold uppercase block">Kelompok Tani Perkebunan</span>
                    <span className="text-sm font-extrabold text-slate-900">{formData.namaKelompokTani}</span>
                    <span className="text-[11px] text-slate-500 block">Ketua: {formData.namaKetua}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Komoditas</span>
                    <span className="text-xs font-bold text-teal-800">{formData.jenisTanaman}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Luas Lahan</span>
                    <span className="text-sm font-mono font-bold text-slate-800">{formData.luasLahan} Ha</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Tanaman Menghasilkan</span>
                    <span className="text-sm font-mono font-bold text-teal-700">{formData.jumlahTanamanProduksi} Pohon</span>
                  </div>
                  <div className="p-3 rounded-xl bg-teal-100/60 border border-teal-300">
                    <span className="text-[10px] text-teal-800 font-bold uppercase block">Total Produksi</span>
                    <span className="text-base font-extrabold font-mono text-teal-900">{formData.jumlahProduksi} Ton</span>
                  </div>
                </div>
              )}

              {type === 'psp' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 sm:col-span-2">
                    <span className="text-[10px] text-amber-700 font-bold uppercase block">Kegiatan / Program</span>
                    <span className="text-sm font-extrabold text-slate-900">{formData.namaKegiatan}</span>
                    <span className="text-[11px] text-slate-500 block">Tahun Anggaran (TA): {formData.tahun}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Kondisi Aset</span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 inline-block mt-0.5">
                      {formData.kondisi}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Kelompok Penerima</span>
                    <span className="text-xs font-bold text-slate-800">{formData.kelompokTani}</span>
                    <span className="text-[11px] text-slate-500 block">Ketua: {formData.namaKetua}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Volume / Jumlah</span>
                    <span className="text-sm font-mono font-bold text-slate-800">{formData.volume}</span>
                  </div>
                  {formData.merekKhususAlsintan && (
                    <div className="p-3 rounded-xl bg-amber-100/60 border border-amber-300">
                      <span className="text-[10px] text-amber-800 font-bold uppercase block">Merek / Spesifikasi</span>
                      <span className="text-xs font-bold font-mono text-amber-900">{formData.merekKhususAlsintan}</span>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer with Actions: Lihat, Edit, Hapus, Download */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            {!showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Hapus data ini"
              >
                <Trash2 className="h-4 w-4" />
                <span>Hapus Data</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition cursor-pointer"
              title="Cetak lembar data ber-Kop Morowali dan QR Code"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer shadow-2xs"
              title="Unduh laporan dokumen data resmi"
            >
              <Download className="h-4 w-4" />
              <span>Unduh Dokumen Data</span>
            </button>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-sm transition cursor-pointer"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Data</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
