/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  ScrollText,
  MapPin,
  LocateFixed,
  ExternalLink,
  Globe,
  Upload,
  CheckCircle2,
  Link2,
} from 'lucide-react';
import { ProposalItem, PBJLangsungItem, PBJEPurchasingItem } from '../types';

interface FormProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (proposal: ProposalItem) => void;
  defaultBidang?: 'tph' | 'psp' | 'peternakan' | 'perkebunan';
  pbjLangsungList?: PBJLangsungItem[];
  pbjEPurchasingList?: PBJEPurchasingItem[];
}

export const FormProposalModal: React.FC<FormProposalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultBidang = 'psp',
  pbjLangsungList = [],
  pbjEPurchasingList = [],
}) => {
  const [bidang, setBidang] = useState<'tph' | 'psp' | 'peternakan' | 'perkebunan'>(defaultBidang);
  const [namaUsulan, setNamaUsulan] = useState('');
  const [kecamatan, setKecamatan] = useState('Sukamaju');
  const [desa, setDesa] = useState('Cendana Jaya');
  const [permohonan, setPermohonan] = useState('');
  const [kelompokTani, setKelompokTani] = useState('');
  const [ketua, setKetua] = useState('');
  const [nik, setNik] = useState('');
  const [noHp, setNoHp] = useState('');
  const [jumlahUsulan, setJumlahUsulan] = useState('');
  const [jumlahAnggotaKelompok, setJumlahAnggotaKelompok] = useState<number>(30);
  const [luasLahan, setLuasLahan] = useState<number>(50);
  
  // Coordinates
  const [lat, setLat] = useState<number>(-7.1542);
  const [lng, setLng] = useState<number>(110.4251);
  const [isLocating, setIsLocating] = useState(false);

  // Status & Integrasi PBJ
  const [status, setStatus] = useState<ProposalItem['status']>('Menunggu Verifikasi');
  const [terintegrasiPbj, setTerintegrasiPbj] = useState(false);
  const [selectedPbjId, setSelectedPbjId] = useState('');
  const [nomorKontrakPbj, setNomorKontrakPbj] = useState('');
  const [tanggalPenyaluran, setTanggalPenyaluran] = useState('');
  const [catatanPenyaluran, setCatatanPenyaluran] = useState('');
  const [berkasProposalNama, setBerkasProposalNama] = useState('');

  if (!isOpen) return null;

  // Real device GPS detection
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolokasi GPS tidak didukung di perangkat ini.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(6)));
        setLng(Number(pos.coords.longitude.toFixed(6)));
        setIsLocating(false);
      },
      (err) => {
        console.warn('GPS error:', err);
        setIsLocating(false);
        alert('Gagal mengambil titik GPS. Periksa izin lokasi perangkat.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSelectPbj = (pbjId: string) => {
    setSelectedPbjId(pbjId);
    if (!pbjId) {
      setNomorKontrakPbj('');
      return;
    }
    const foundPL = pbjLangsungList.find((p) => p.id === pbjId);
    if (foundPL) {
      setNomorKontrakPbj(foundPL.noKontrak);
      setTerintegrasiPbj(true);
      setStatus(foundPL.status === 'Selesai 100%' ? 'Tersalurkan / Selesai' : 'Masuk PBJ');
      return;
    }
    const foundEP = pbjEPurchasingList.find((p) => p.id === pbjId);
    if (foundEP) {
      setNomorKontrakPbj(foundEP.noKontrak);
      setTerintegrasiPbj(true);
      setStatus(foundEP.status === 'Selesai' ? 'Tersalurkan / Selesai' : 'Masuk PBJ');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaUsulan || !kelompokTani) return;

    const newProposal: ProposalItem = {
      id: 'prop-' + Date.now(),
      bidang,
      namaUsulan,
      kecamatan,
      desa,
      permohonan,
      kelompokTani,
      ketua,
      nik,
      noHp,
      jumlahUsulan,
      jumlahAnggotaKelompok,
      luasLahan,
      titikKoordinat: { lat, lng },
      status,
      terintegrasiPbj,
      pbjTipe: selectedPbjId.startsWith('pbj-ep') ? 'E-Purchasing' : 'Pengadaan Langsung',
      nomorKontrakPbj: nomorKontrakPbj || undefined,
      tanggalPenyaluran: tanggalPenyaluran || undefined,
      catatanPenyaluran: catatanPenyaluran || undefined,
      berkasProposalNama: berkasProposalNama || 'Proposal_Kelompok_Tani.pdf',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newProposal);
    onClose();
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  const googleEarthUrl = `https://earth.google.com/web/search/${lat},${lng}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-800 px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white text-amber-700 shadow-sm">
              <ScrollText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Input Usulan & Proposal Kelompok Tani</h2>
              <p className="text-xs text-amber-100">
                Terintegrasi GPS, Google Maps, Google Earth & Pengadaan Barang/Jasa (PBJ)
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
            
            {/* Bidang Sasaran */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bidang Usulan <span className="text-rose-500">*</span>
              </label>
              <select
                value={bidang}
                onChange={(e) => setBidang(e.target.value as ProposalItem['bidang'])}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold bg-amber-50 text-amber-900 focus:outline-none"
              >
                <option value="psp">Bidang PSP (Alsintan, Irigasi, JUT)</option>
                <option value="tph">Bidang TPH (Benih, Saprodi, Hortikultura)</option>
                <option value="peternakan">Bidang Peternakan (Bibit Ternak, Pakan)</option>
                <option value="perkebunan">Bidang Perkebunan (Bibit Sawit, Kopi, Pupuk)</option>
              </select>
            </div>

            {/* Nama Usulan */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Usulan Kegiatan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Permohonan Bantuan Hand Traktor Roda 2 Olah Tanah"
                value={namaUsulan}
                onChange={(e) => setNamaUsulan(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
              />
            </div>

            {/* Kecamatan & Desa */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kecamatan</label>
              <input
                type="text"
                required
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Desa</label>
              <input
                type="text"
                required
                value={desa}
                onChange={(e) => setDesa(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            {/* Kelompok Tani */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kelompok Tani / Gapoktan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Poktan Makmur Jaya"
                value={kelompokTani}
                onChange={(e) => setKelompokTani(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            {/* Ketua Poktan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ketua Kelompok</label>
              <input
                type="text"
                placeholder="Nama Ketua Poktan"
                value={ketua}
                onChange={(e) => setKetua(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            {/* NIK */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NIK Ketua</label>
              <input
                type="text"
                placeholder="16 digit NIK KTP"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            {/* No HP */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">No HP / WhatsApp</label>
              <input
                type="text"
                placeholder="08xxxxxxxxxx"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            {/* Rincian Permohonan */}
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Isi Ringkas Permohonan / Spesifikasi Usulan
              </label>
              <textarea
                rows={2}
                placeholder="Rincian jenis barang, merk, peruntukan lahan, latar belakang usulan..."
                value={permohonan}
                onChange={(e) => setPermohonan(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            {/* Jumlah Usulan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Usulan</label>
              <input
                type="text"
                placeholder="Contoh: 10 Unit / 40 Ton / 1.200 M"
                value={jumlahUsulan}
                onChange={(e) => setJumlahUsulan(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            {/* Jumlah Anggota */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Anggota (Orang)</label>
              <input
                type="number"
                value={jumlahAnggotaKelompok}
                onChange={(e) => setJumlahAnggotaKelompok(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            {/* Luas Lahan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Luas Lahan Terkait (Ha)</label>
              <input
                type="number"
                value={luasLahan}
                onChange={(e) => setLuasLahan(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

          </div>

          {/* TITIK KOORDINAT TERINTEGRASI GOOGLE MAPS & GOOGLE EARTH */}
          <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-500" />
                <h3 className="text-xs sm:text-sm font-bold text-emerald-950 uppercase">
                  Titik Koordinat Lokasi Lahan Usulan
                </h3>
              </div>

              {/* Action buttons: Ambil GPS, Buka Google Maps, Buka Google Earth */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="flex items-center gap-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition"
                >
                  <LocateFixed className="h-3.5 w-3.5" />
                  <span>{isLocating ? 'Mendeteksi...' : 'Deteksi GPS HP'}</span>
                </button>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Buka Google Maps</span>
                </a>

                <a
                  href={googleEarthUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-teal-700 hover:bg-teal-800 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Buka Google Earth</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={lat}
                  onChange={(e) => setLat(Number(e.target.value))}
                  className="w-full rounded-xl border border-emerald-300 bg-white p-2 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={lng}
                  onChange={(e) => setLng(Number(e.target.value))}
                  className="w-full rounded-xl border border-emerald-300 bg-white p-2 text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* INTEGRASI OTOMATIS DENGAN PENGADAAN BARANG & JASA (PBJ) */}
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/60 p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-900">
              <Link2 className="h-5 w-5 text-amber-600" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase">
                  Integrasi Otomatis dengan Pengadaan Barang & Jasa (PBJ)
                </h3>
                <p className="text-[11px] text-amber-800">
                  Jika usulan sudah diadakan/disalurkan lewat PBJ, status usulan otomatis menjadi Tersalurkan / Selesai.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hubungkan dengan Paket PBJ Dinas
                </label>
                <select
                  value={selectedPbjId}
                  onChange={(e) => handleSelectPbj(e.target.value)}
                  className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs"
                >
                  <option value="">-- Belum Ada Realisasi PBJ --</option>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status Usulan Saat Ini
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProposalItem['status'])}
                  className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-bold"
                >
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Masuk PBJ">Masuk Perencanaan PBJ</option>
                  <option value="Tersalurkan / Selesai">Tersalurkan / Selesai</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>

              {selectedPbjId && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nomor Kontrak / SPK PBJ Terkait
                    </label>
                    <input
                      type="text"
                      value={nomorKontrakPbj}
                      onChange={(e) => setNomorKontrakPbj(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tanggal Penyaluran / BAST
                    </label>
                    <input
                      type="date"
                      value={tanggalPenyaluran}
                      onChange={(e) => setTanggalPenyaluran(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Upload Berkas Proposal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Upload Berkas Proposal (PDF)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setBerkasProposalNama(e.target.files?.[0]?.name || '')}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800"
            />
          </div>

          {/* Actions */}
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
              className="flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 px-5 py-2 text-xs font-bold text-white shadow-md transition"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Simpan Usulan Proposal</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
