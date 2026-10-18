/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  FilePlus2,
  Calculator,
  Upload,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Link2,
  ScrollText,
  Sparkles,
  Check,
  MapPin,
  Calendar,
  Building,
} from 'lucide-react';
import { PBJLangsungItem, ProposalItem } from '../types';
import { formatRupiah } from '../utils/formatters';

interface FormPBJLangsungModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PBJLangsungItem) => void;
  availableProposals?: ProposalItem[];
}

export const FormPBJLangsungModal: React.FC<FormPBJLangsungModalProps> = ({
  isOpen,
  onClose,
  onSave,
  availableProposals = [],
}) => {
  const [uraianKegiatan, setUraianKegiatan] = useState('');
  const [kodeRup, setKodeRup] = useState('');
  const [penyedia, setPenyedia] = useState('');
  const [penanggungJawab, setPenanggungJawab] = useState('');
  const [noHpPenyedia, setNoHpPenyedia] = useState('');
  const [alamatPenyedia, setAlamatPenyedia] = useState('');
  const [namaPelaksana, setNamaPelaksana] = useState('');
  const [noHpPelaksana, setNoHpPelaksana] = useState('');
  const [npwp, setNpwp] = useState('');

  // Finansial
  const [paguAnggaran, setPaguAnggaran] = useState<number>(0);
  const [hps, setHps] = useState<number>(0);
  const [penawaran, setPenawaran] = useState<number>(0);
  const [negosiasi, setNegosiasi] = useState<number>(0);
  const [noKontrak, setNoKontrak] = useState('');
  const [volumePekerjaan, setVolumePekerjaan] = useState('');
  const [jenisKontrak, setJenisKontrak] = useState('Harga Satuan (Surat Perintah Kerja)');
  const [masaKontrak, setMasaKontrak] = useState('');
  const [besaranNilaiKontrak, setBesaranNilaiKontrak] = useState<number>(0);

  // Uang Muka
  const [uangMukaPct, setUangMukaPct] = useState<number>(30);
  const [uangMukaFile, setUangMukaFile] = useState<string>('');

  // Pembayaran Penyelesaian (Termin/BAP)
  const [penyelesaianNilai, setPenyelesaianNilai] = useState<number>(0);
  const [penyelesaianFile, setPenyelesaianFile] = useState<string>('');

  // Retensi
  const [retensiPct, setRetensiPct] = useState<number>(5);
  const [retensiFile, setRetensiFile] = useState<string>('');

  // Link proposal & otomasi status
  const [selectedProposalId, setSelectedProposalId] = useState<string>('');
  const [proposalExecutionStatus, setProposalExecutionStatus] = useState<'Sudah Dilaksanakan / Selesai' | 'Masuk PBJ'>('Sudah Dilaksanakan / Selesai');
  const [tanggalPelaksanaan, setTanggalPelaksanaan] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [catatanPelaksanaan, setCatatanPelaksanaan] = useState<string>('');

  if (!isOpen) return null;

  const selectedProposal = availableProposals.find((p) => p.id === selectedProposalId);

  const handleSelectProposal = (id: string) => {
    setSelectedProposalId(id);
    const found = availableProposals.find((p) => p.id === id);
    if (found) {
      if (!catatanPelaksanaan) {
        setCatatanPelaksanaan(
          `Pekerjaan pengadaan langsung telah selesai dilaksanakan 100% dan diserahterimakan kepada ${found.kelompokTani} (Desa ${found.desa}, Kec. ${found.kecamatan}).`
        );
      }
    }
  };

  const handleApplyProposalData = () => {
    if (!selectedProposal) return;
    if (!uraianKegiatan) {
      setUraianKegiatan(selectedProposal.namaUsulan);
    }
    if (!volumePekerjaan && selectedProposal.jumlahUsulan) {
      setVolumePekerjaan(selectedProposal.jumlahUsulan);
    }
    if (!catatanPelaksanaan) {
      setCatatanPelaksanaan(
        `Pengadaan telah dilaksanakan dan diserahterimakan kepada ${selectedProposal.kelompokTani} (Desa ${selectedProposal.desa}, Kec. ${selectedProposal.kecamatan}).`
      );
    }
  };

  // Hitungan Otomatis
  const calculatedNilaiKontrak = besaranNilaiKontrak > 0 ? besaranNilaiKontrak : negosiasi;
  const calculatedUangMuka = (calculatedNilaiKontrak * uangMukaPct) / 100;
  const calculatedRetensi = (calculatedNilaiKontrak * retensiPct) / 100;
  
  // Sisa Pagu = Pagu Anggaran - Nilai Kontrak
  const sisaAnggaranPagu = Math.max(0, paguAnggaran - calculatedNilaiKontrak);

  // Sisa Kontrak setelah Uang Muka & Penyelesaian
  const totalDibayar = calculatedUangMuka + penyelesaianNilai;
  const sisaKontrak = Math.max(0, calculatedNilaiKontrak - totalDibayar);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uraianKegiatan || !noKontrak) return;

    const newItem: PBJLangsungItem = {
      id: 'pbj-pl-' + Date.now(),
      uraianKegiatan,
      kodeRup,
      penyedia,
      penanggungJawab,
      noHpPenyedia,
      alamatPenyedia,
      namaPelaksana,
      noHpPelaksana,
      npwp,
      paguAnggaran,
      hps,
      penawaran,
      negosiasi,
      noKontrak,
      volumePekerjaan,
      jenisKontrak,
      masaKontrak,
      besaranNilaiKontrak: calculatedNilaiKontrak,
      uangMuka: {
        persentase: uangMukaPct,
        nilai: calculatedUangMuka,
        fileName: uangMukaFile ? 'Berkas_Permohonan_UangMuka.pdf' : undefined,
        status: uangMukaFile ? 'Diajukan' : 'Belum Diajukan',
      },
      pembayaranPenyelesaian: {
        nilai: penyelesaianNilai,
        fileName: penyelesaianFile ? 'Berkas_BAP_Penyelesaian.pdf' : undefined,
        status: penyelesaianNilai > 0 ? 'Diajukan' : 'Belum Diajukan',
      },
      retensi: {
        persentase: retensiPct,
        nilai: calculatedRetensi,
        fileName: retensiFile ? 'Berkas_Permohonan_Retensi.pdf' : undefined,
        status: retensiFile ? 'Diajukan' : 'Masa Pemeliharaan',
      },
      sisaKontrak,
      sisaAnggaranPagu,
      status: sisaKontrak === 0 ? 'Selesai 100%' : 'Pelaksanaan',
      linkedProposalId: selectedProposalId || undefined,
      proposalExecutionStatus: selectedProposalId ? proposalExecutionStatus : undefined,
      tanggalPenyaluran: selectedProposalId ? tanggalPelaksanaan : undefined,
      catatanPenyaluran: selectedProposalId ? catatanPelaksanaan : undefined,
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
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-800 px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white text-amber-700 shadow-sm">
              <FilePlus2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Input Data Pengadaan Langsung (PL)</h2>
              <p className="text-xs text-amber-100">
                Terintegrasi otomatis dengan proposal masyarakat & kalkulasi keuangan dinas
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* SECTION: INTEGRASI DENGAN USULAN PROPOSAL MASYARAKAT (OTOMASI STATUS) */}
          <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/70 p-4 sm:p-5 space-y-3.5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-emerald-200 pb-2.5">
              <div className="flex items-center gap-2 text-emerald-950">
                <div className="p-1.5 rounded-lg bg-emerald-700 text-white">
                  <Link2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide">
                    Integrasi dengan Usulan Proposal Masyarakat
                  </h3>
                  <p className="text-[11px] text-emerald-800">
                    Pilih usulan kelompok tani agar ketika pengadaan langsung dilaksanakan, status usulan proposal otomatis menjadi <strong>Sudah Dilaksanakan / Selesai</strong>.
                  </p>
                </div>
              </div>

              {selectedProposal && (
                <button
                  type="button"
                  onClick={handleApplyProposalData}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition self-start sm:self-auto"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Salin Data Usulan ke Form</span>
                </button>
              )}
            </div>

            {/* Dropdown Pemilihan Proposal */}
            <div>
              <label className="block text-xs font-bold text-emerald-950 mb-1">
                Pilih Usulan Proposal Kelompok Tani Terkait:
              </label>
              <select
                value={selectedProposalId}
                onChange={(e) => handleSelectProposal(e.target.value)}
                className="w-full rounded-xl border-2 border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
              >
                <option value="">-- Tidak Terhubung ke Proposal (Pengadaan Murni Dinas) --</option>
                {availableProposals.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.bidang.toUpperCase()}] {p.kelompokTani} - {p.namaUsulan} (Status: {p.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Jika Ada Proposal Dipilih: Tampilkan Detail & Konfigurasi Eksekusi Status */}
            {selectedProposal && (
              <div className="space-y-3 pt-2">
                {/* Rincian Proposal Terpilih */}
                <div className="p-3.5 rounded-xl bg-white border border-emerald-300 text-xs space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-extrabold text-emerald-900 text-sm">
                      {selectedProposal.kelompokTani}
                    </span>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold border border-emerald-300">
                      Status Saat Ini: {selectedProposal.status}
                    </span>
                  </div>
                  <p className="font-medium text-slate-800">
                    <strong>Usulan:</strong> {selectedProposal.namaUsulan}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-600">
                    <div>Desa / Kec: <strong>{selectedProposal.desa}, {selectedProposal.kecamatan}</strong></div>
                    <div>Ketua: <strong>{selectedProposal.ketua}</strong></div>
                    <div>No HP / NIK: <strong>{selectedProposal.noHp || selectedProposal.nik}</strong></div>
                    <div>Volume: <strong>{selectedProposal.jumlahUsulan}</strong></div>
                  </div>
                </div>

                {/* Pengaturan Status Otomatis Usulan Proposal */}
                <div className="p-3.5 rounded-xl bg-emerald-100/70 border border-emerald-300 space-y-3">
                  <span className="text-xs font-bold text-emerald-950 block">
                    Pilih Status Usulan Proposal Saat Pengadaan Langsung Ini Disimpan:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                        proposalExecutionStatus === 'Sudah Dilaksanakan / Selesai'
                          ? 'border-emerald-600 bg-white shadow-sm ring-2 ring-emerald-500'
                          : 'border-emerald-300 bg-emerald-50/50 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="propStatusRadio"
                        checked={proposalExecutionStatus === 'Sudah Dilaksanakan / Selesai'}
                        onChange={() => setProposalExecutionStatus('Sudah Dilaksanakan / Selesai')}
                        className="mt-0.5 text-emerald-600"
                      />
                      <div>
                        <span className="font-bold text-emerald-900 block flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Sudah Dilaksanakan / Selesai (Rekomendasi)
                        </span>
                        <span className="text-[11px] text-slate-600 leading-tight block mt-0.5">
                          Status usulan proposal otomatis berubah menjadi <strong>"Sudah Dilaksanakan / Selesai"</strong> karena barang/pekerjaan telah terealisasi.
                        </span>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                        proposalExecutionStatus === 'Masuk PBJ'
                          ? 'border-emerald-600 bg-white shadow-sm ring-2 ring-emerald-500'
                          : 'border-emerald-300 bg-emerald-50/50 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="propStatusRadio"
                        checked={proposalExecutionStatus === 'Masuk PBJ'}
                        onChange={() => setProposalExecutionStatus('Masuk PBJ')}
                        className="mt-0.5 text-emerald-600"
                      />
                      <div>
                        <span className="font-bold text-slate-800 block">
                          Masuk PBJ (Sedang Dalam Proses Pelaksanaan)
                        </span>
                        <span className="text-[11px] text-slate-600 leading-tight block mt-0.5">
                          Usulan proposal ditandai masuk tahap kontrak pengadaan langsung dan sedang berproses di lapangan.
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Input Tanggal Pelaksanaan & Catatan Serah Terima */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                        Tanggal Pelaksanaan / BAST:
                      </label>
                      <input
                        type="date"
                        value={tanggalPelaksanaan}
                        onChange={(e) => setTanggalPelaksanaan(e.target.value)}
                        className="w-full rounded-xl border border-emerald-300 bg-white p-2 text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                        Catatan Realisasi / Serah Terima Lapangan:
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Pekerjaan telah dilaksanakan dan diserahterimakan kepada Poktan..."
                        value={catatanPelaksanaan}
                        onChange={(e) => setCatatanPelaksanaan(e.target.value)}
                        className="w-full rounded-xl border border-emerald-300 bg-white p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-emerald-900 bg-white/90 p-2.5 rounded-lg border border-emerald-300 font-medium">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Jaminan Integrasi:</strong> Data kontrak <strong>{noKontrak || '(Nomor Kontrak)'}</strong> akan otomatis tertaut pada arsip proposal <strong>{selectedProposal.kelompokTani}</strong>.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bagian 1: Data Kegiatan & RUP */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 pb-1 border-b border-amber-200 mb-3">
              1. Informasi Kegiatan & RUP
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Uraian Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembangunan Rabat Beton Jalan Usahatani Desa Sukamaju"
                  value={uraianKegiatan}
                  onChange={(e) => setUraianKegiatan(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kode RUP
                </label>
                <input
                  type="text"
                  placeholder="RUP-xxxxxxx"
                  value={kodeRup}
                  onChange={(e) => setKodeRup(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bagian 2: Data Penyedia & Pelaksana */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 pb-1 border-b border-amber-200 mb-3">
              2. Data Penyedia & Pelaksana Lapangan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Penyedia (CV / PT)
                </label>
                <input
                  type="text"
                  placeholder="CV. Karya Tani Mandiri"
                  value={penyedia}
                  onChange={(e) => setPenyedia(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Penanggung Jawab (Direktur)
                </label>
                <input
                  type="text"
                  placeholder="Nama Direktur"
                  value={penanggungJawab}
                  onChange={(e) => setPenanggungJawab(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  No HP Penyedia
                </label>
                <input
                  type="text"
                  placeholder="08xxxxxxxxxx"
                  value={noHpPenyedia}
                  onChange={(e) => setNoHpPenyedia(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Penyedia
                </label>
                <input
                  type="text"
                  placeholder="Alamat kantor perusahaan penyedia"
                  value={alamatPenyedia}
                  onChange={(e) => setAlamatPenyedia(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NPWP Perusahaan
                </label>
                <input
                  type="text"
                  placeholder="xx.xxx.xxx.x-xxx.xxx"
                  value={npwp}
                  onChange={(e) => setNpwp(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Pelaksana Lapangan
                </label>
                <input
                  type="text"
                  placeholder="Nama mandor / pelaksana teknis"
                  value={namaPelaksana}
                  onChange={(e) => setNamaPelaksana(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  No HP Pelaksana
                </label>
                <input
                  type="text"
                  placeholder="08xxxxxxxxxx"
                  value={noHpPelaksana}
                  onChange={(e) => setNoHpPelaksana(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bagian 3: Kontrak & Nilai Kontrak */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 pb-1 border-b border-amber-200 mb-3">
              3. Anggaran & Surat Perjanjian Kontrak
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pagu Anggaran (Rp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={paguAnggaran || ''}
                  onChange={(e) => setPaguAnggaran(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  HPS (Rp)
                </label>
                <input
                  type="number"
                  value={hps || ''}
                  onChange={(e) => setHps(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Penawaran (Rp)
                </label>
                <input
                  type="number"
                  value={penawaran || ''}
                  onChange={(e) => setPenawaran(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Negosiasi (Rp)
                </label>
                <input
                  type="number"
                  value={negosiasi || ''}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setNegosiasi(val);
                    if (!besaranNilaiKontrak) setBesaranNilaiKontrak(val);
                  }}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Kontrak / SPK <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="602/SP-PL/JUT-01/DISTAN/2026"
                  value={noKontrak}
                  onChange={(e) => setNoKontrak(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Volume Pekerjaan
                </label>
                <input
                  type="text"
                  placeholder="1.200 M x 2.5 M (1 Paket)"
                  value={volumePekerjaan}
                  onChange={(e) => setVolumePekerjaan(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jenis Kontrak
                </label>
                <input
                  type="text"
                  value={jenisKontrak}
                  onChange={(e) => setJenisKontrak(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Masa Kontrak
                </label>
                <input
                  type="text"
                  placeholder="60 Hari Kalender"
                  value={masaKontrak}
                  onChange={(e) => setMasaKontrak(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4 bg-amber-50 p-3 rounded-xl border border-amber-300">
                <label className="block text-xs font-extrabold text-amber-900 mb-1">
                  BESARAN NILAI KONTRAK (Rp) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    required
                    value={besaranNilaiKontrak || ''}
                    onChange={(e) => setBesaranNilaiKontrak(Number(e.target.value))}
                    className="w-full max-w-sm rounded-xl border border-amber-400 bg-white px-3 py-2 text-sm font-bold text-amber-900 focus:outline-none"
                  />
                  <div className="text-xs font-bold text-amber-800">
                    Terbilang: {formatRupiah(calculatedNilaiKontrak)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian 4: Otomasi Perhitungan Keuangan (Uang Muka, Termin, Retensi, Sisa) */}
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-4 space-y-4">
            <div className="flex items-center gap-2 text-emerald-900">
              <Calculator className="h-5 w-5 text-emerald-600" />
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                4. Perhitungan Keuangan Otomatis & Berkas Tagihan
              </h3>
            </div>

            {/* Live Financial Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="rounded-xl bg-white p-3 border border-emerald-200 shadow-sm">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Pagu Anggaran</span>
                <span className="font-bold text-slate-800 text-xs sm:text-sm">{formatRupiah(paguAnggaran)}</span>
              </div>
              <div className="rounded-xl bg-white p-3 border border-emerald-200 shadow-sm">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Nilai Kontrak</span>
                <span className="font-bold text-emerald-700 text-xs sm:text-sm">{formatRupiah(calculatedNilaiKontrak)}</span>
              </div>
              <div className="rounded-xl bg-white p-3 border border-emerald-200 shadow-sm">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Sisa Anggaran Pagu</span>
                <span className="font-bold text-slate-700 text-xs sm:text-sm">{formatRupiah(sisaAnggaranPagu)}</span>
              </div>
              <div className="rounded-xl bg-white p-3 border border-emerald-200 shadow-sm">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Sisa Kontrak Tagihan</span>
                <span className="font-bold text-amber-600 text-xs sm:text-sm">{formatRupiah(sisaKontrak)}</span>
              </div>
            </div>

            {/* Uang Muka Form */}
            <div className="rounded-xl bg-white p-3.5 border border-slate-200 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-bold text-xs text-slate-800">
                  s. Permohonan Uang Muka ({uangMukaPct}%)
                </div>
                <div className="text-xs font-bold text-emerald-700">
                  Kalkulasi Otomatis: {formatRupiah(calculatedUangMuka)}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Persentase Uang Muka (%)</label>
                  <input
                    type="number"
                    max={30}
                    value={uangMukaPct}
                    onChange={(e) => setUangMukaPct(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Upload Berkas Permohonan Uang Muka</label>
                  <input
                    type="file"
                    onChange={(e) => setUangMukaFile(e.target.files?.[0]?.name || '')}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-emerald-100 file:text-emerald-800"
                  />
                </div>
              </div>
            </div>

            {/* Pembayaran Penyelesaian (Termin) Form */}
            <div className="rounded-xl bg-white p-3.5 border border-slate-200 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-bold text-xs text-slate-800">
                  u. Permohonan Pembayaran Penyelesaian Pekerjaan (Termin / BAP 100%)
                </div>
                <div className="text-xs font-bold text-emerald-700">
                  Nilai Diajukan: {formatRupiah(penyelesaianNilai)}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Besaran Pembayaran Fisik Diajukan (Rp)</label>
                  <input
                    type="number"
                    value={penyelesaianNilai || ''}
                    onChange={(e) => setPenyelesaianNilai(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Upload Berkas BAP Penyelesaian</label>
                  <input
                    type="file"
                    onChange={(e) => setPenyelesaianFile(e.target.files?.[0]?.name || '')}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-emerald-100 file:text-emerald-800"
                  />
                </div>
              </div>
            </div>

            {/* Retensi Form */}
            <div className="rounded-xl bg-white p-3.5 border border-slate-200 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-bold text-xs text-slate-800">
                  v. Permohonan Pembayaran Retensi Pemeliharaan ({retensiPct}%)
                </div>
                <div className="text-xs font-bold text-emerald-700">
                  Kalkulasi Retensi: {formatRupiah(calculatedRetensi)}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Persentase Retensi (%)</label>
                  <input
                    type="number"
                    value={retensiPct}
                    onChange={(e) => setRetensiPct(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Upload Berkas Permohonan Retensi</label>
                  <input
                    type="file"
                    onChange={(e) => setRetensiFile(e.target.files?.[0]?.name || '')}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-emerald-100 file:text-emerald-800"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
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
              <span>Simpan Data Pengadaan Langsung</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
