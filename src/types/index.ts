/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BidangType =
  | 'perencanaan'
  | 'tph'
  | 'psp'
  | 'peternakan'
  | 'perkebunan'
  | 'pbj';

export type UserRole = string;

export interface RoleDefinition {
  id: string;
  name: string;
  bidang: BidangType | 'semua';
  description: string;
  isSystem?: boolean;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: UserRole;
  bidang: BidangType | 'semua';
  nip?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  status: 'Aktif' | 'Nonaktif';
  createdAt: string;
}

export interface ArsipItem {
  id: string;
  title: string;
  nomorSurat: string;
  tanggalSurat: string;
  bidang: BidangType;
  subKategori: string;
  uraian: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  fileDataUrl?: string;
  driveFolder: string;
  driveUrl?: string;
  uploaderName: string;
  uploaderRole: string;
  createdAt: string;
  updatedAt: string;
}

export interface PBJLangsungItem {
  id: string;
  uraianKegiatan: string;
  kodeRup: string;
  penyedia: string;
  penanggungJawab: string;
  noHpPenyedia: string;
  alamatPenyedia: string;
  namaPelaksana: string;
  noHpPelaksana: string;
  npwp: string;
  paguAnggaran: number;
  hps: number;
  penawaran: number;
  negosiasi: number;
  noKontrak: string;
  volumePekerjaan: string;
  jenisKontrak: string;
  masaKontrak: string;
  besaranNilaiKontrak: number;
  // Perhitungan Keuangan Otomatis
  uangMuka: {
    persentase: number;
    nilai: number;
    fileUrl?: string;
    fileName?: string;
    status: 'Belum Diajukan' | 'Diajukan' | 'Disetujui' | 'Cair';
  };
  pembayaranPenyelesaian: {
    nilai: number;
    fileUrl?: string;
    fileName?: string;
    status: 'Belum Diajukan' | 'Diajukan' | 'Disetujui' | 'Cair';
  };
  retensi: {
    persentase: number;
    nilai: number;
    fileUrl?: string;
    fileName?: string;
    status: 'Belum Diajukan' | 'Masa Pemeliharaan' | 'Diajukan' | 'Cair';
  };
  sisaKontrak: number;
  sisaAnggaranPagu: number;
  status: 'Draft' | 'Pelaksanaan' | 'Uang Muka Cair' | 'BAP Selesai' | 'Retensi Selesai' | 'Selesai 100%';
  linkedProposalId?: string;
  proposalExecutionStatus?: 'Sudah Dilaksanakan / Selesai' | 'Masuk PBJ';
  tanggalPenyaluran?: string;
  catatanPenyaluran?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PBJEPurchasingItem {
  id: string;
  uraianKegiatan: string;
  kodeRup: string;
  penyedia: string;
  penanggungjawab: string;
  noHp: string;
  alamatPenyedia: string;
  npwp: string;
  paguAnggaran: number;
  hps: number;
  penawaran: number;
  negosiasi: number;
  noKontrak: string;
  volumePekerjaan: string;
  jenisKontrak: string;
  masaKontrak: string;
  pembayaran: number;
  status: 'Pemesanan / PO' | 'Pengiriman' | 'Pemeriksaan Hasil' | 'Pembayaran' | 'Selesai';
  dokumenPendukung: Array<{
    name: string;
    size: string;
    dataUrl?: string;
    driveUrl?: string;
  }>;
  linkedProposalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TPHLTTItem {
  id: string;
  kecamatan: string;
  desa: string;
  jenisKomoditi: string;
  varietas: string;
  luasBakuLahan: number; // Ha
  luasTanam: number; // Ha
  luasPanen: number; // Ha
  luasFuso: number; // Ha
  provitas: number; // Ku/Ha
  produksiTon: number; // Ton
  periode: string;
  petugas: string;
  createdAt: string;
}

export interface TPHTanamanPanganItem {
  id: string;
  kecamatan: string;
  desa: string;
  namaKelompokTani: string;
  komoditas: string;
  luasLahan: number;
  luasTanam: number;
  luasPanen: number;
  produksi: number;
  musimTanam: 'MT-1 (Rendeng)' | 'MT-2 (Gadu)' | 'MT-3 (Kemarau)';
  sumberData: 'Penyuluh' | 'Survey Sendiri';
  titikKoordinat: {
    lat: number;
    lng: number;
  };
  keterangan: string;
  createdAt: string;
}

export interface PeternakanPopulasiItem {
  id: string;
  kecamatan: string;
  desa: string;
  jenisTernak: 'Sapi Potong' | 'Sapi Perah' | 'Kambing' | 'Domba' | 'Ayam Broiler' | 'Ayam Petelur' | 'Itik / Bebek' | 'Kerbau';
  populasi: number;
  jantan: number;
  betina: number;
  umurTernak: string;
  pemilikTernak: string;
  noHpNik: string;
  kandang: 'Ada' | 'Tidak Ada';
  titikKoordinat: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export interface PerkebunanKomoditiItem {
  id: string;
  kecamatan: string;
  desa: string;
  namaKelompokTani: string;
  namaKetua: string;
  jenisTanaman: 'Kelapa Sawit' | 'Kopi Robusta' | 'Kopi Arabika' | 'Kakao' | 'Karet' | 'Cengkeh' | 'Lada' | 'Kelapa Dalam';
  luasLahan: number;
  titikKoordinat: {
    lat: number;
    lng: number;
  };
  jumlahTanamanProduksi: number;
  jumlahTanamanBelumProduksi: number;
  jumlahProduksi: number; // Ton
  createdAt: string;
}

export interface PSPItem {
  id: string;
  jenisData: 'Alsintan' | 'Jaringan Irigasi' | 'Jalan Usahatani';
  namaKegiatan: string;
  kecamatan: string;
  desa: string;
  kelompokTani: string;
  namaKetua: string;
  nikNoHp: string;
  volume: string;
  jumlahAnggotaKelompok: number;
  tahun: number;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  merekKhususAlsintan?: string;
  titikKoordinat: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export interface ProposalItem {
  id: string;
  bidang: 'tph' | 'psp' | 'peternakan' | 'perkebunan';
  namaUsulan: string;
  kecamatan: string;
  desa: string;
  permohonan: string;
  kelompokTani: string;
  ketua: string;
  nik: string;
  noHp: string;
  jumlahUsulan: string;
  jumlahAnggotaKelompok: number;
  luasLahan: number; // Ha
  titikKoordinat: {
    lat: number;
    lng: number;
  };
  status: 'Menunggu Verifikasi' | 'Disetujui' | 'Masuk PBJ' | 'Sudah Dilaksanakan / Selesai' | 'Tersalurkan / Selesai' | 'Ditolak';
  // Hubungan ke Pengadaan PBJ
  terintegrasiPbj?: boolean;
  pbjTipe?: 'Pengadaan Langsung' | 'E-Purchasing';
  nomorKontrakPbj?: string;
  tanggalPenyaluran?: string;
  catatanPenyaluran?: string;
  berkasProposalNama?: string;
  berkasProposalUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  bidang?: BidangType;
  type: 'archive' | 'proposal' | 'pbj' | 'teknis' | 'system';
  timestamp: string;
  read: boolean;
}

export interface GasConfig {
  webAppUrl: string;
  autoSync: boolean;
  lastSync?: string;
  folderPerencanaanId?: string;
  folderTphId?: string;
  folderPspId?: string;
  folderPeternakanId?: string;
  folderPerkebunanId?: string;
  folderPbjId?: string;
}
