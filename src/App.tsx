/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RiceFieldBackground } from './components/RiceFieldBackground';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { ArsipListView } from './views/ArsipListView';
import { PBJListView } from './views/PBJListView';
import { TeknisListView } from './views/TeknisListView';
import { ProposalListView } from './views/ProposalListView';
import { SettingsView } from './views/SettingsView';

import { ArchiveDocumentViewerModal } from './components/ArchiveDocumentViewerModal';
import { FormArsipModal } from './components/FormArsipModal';
import { FormPBJLangsungModal } from './components/FormPBJLangsungModal';
import { FormPBJEPurchasingModal } from './components/FormPBJEPurchasingModal';
import { FormTeknisModal } from './components/FormTeknisModal';
import { FormProposalModal } from './components/FormProposalModal';
import { DetailTeknisModal, TeknisDataType } from './components/DetailTeknisModal';
import { UserManagementModal } from './components/UserManagementModal';
import { ProfileModal } from './components/ProfileModal';
import { GasIntegrationModal } from './components/GasIntegrationModal';
import { NotificationCenter } from './components/NotificationCenter';
import { LoginScreen } from './components/LoginScreen';
import { SuccessQRCodeModal, SuccessQRCodeData } from './components/SuccessQRCodeModal';
import {
  createArchiveQRPayload,
  createProposalQRPayload,
  createPBJQRPayload,
  createTeknisQRPayload,
} from './utils/qrCodeGenerator';

import {
  ArsipItem,
  PBJLangsungItem,
  PBJEPurchasingItem,
  TPHLTTItem,
  TPHTanamanPanganItem,
  PeternakanPopulasiItem,
  PerkebunanKomoditiItem,
  PSPItem,
  ProposalItem,
  UserAccount,
  RoleDefinition,
  AppNotification,
  BidangType,
  GasConfig,
} from './types';

import {
  getCurrentUser,
  setCurrentUser,
  getUsers,
  saveUsers,
  getRoles,
  saveRoles,
  getIsLoggedIn,
  saveIsLoggedIn,
  getArchives,
  saveArchives,
  getPBJLangsung,
  savePBJLangsung,
  getPBJEPurchasing,
  savePBJEPurchasing,
  getTPHLTT,
  saveTPHLTT,
  getTPHPoktan,
  saveTPHPoktan,
  getPeternakan,
  savePeternakan,
  getPerkebunan,
  savePerkebunan,
  getPSP,
  savePSP,
  getProposals,
  saveProposals,
  getNotifications,
  saveNotifications,
  addNotification,
  getGasConfig,
  saveGasConfig,
} from './utils/storage';

import { CheckCircle2, BellRing, X } from 'lucide-react';

export default function App() {
  // Authentication state (User must login with username & password)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => getIsLoggedIn());

  // Navigation & UI state
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // App Data states
  const [currentUser, setCurrUser] = useState<UserAccount>(getCurrentUser());
  const [users, setUsersList] = useState<UserAccount[]>(getUsers());
  const [roles, setRolesList] = useState<RoleDefinition[]>(getRoles());
  const [archives, setArchivesList] = useState<ArsipItem[]>(getArchives());
  const [pbjLangsung, setPbjLangsungList] = useState<PBJLangsungItem[]>(getPBJLangsung());
  const [pbjEPurchasing, setPbjEPurchasingList] = useState<PBJEPurchasingItem[]>(getPBJEPurchasing());
  const [tphLtt, setTphLttList] = useState<TPHLTTItem[]>(getTPHLTT());
  const [tphPoktan, setTphPoktanList] = useState<TPHTanamanPanganItem[]>(getTPHPoktan());
  const [peternakan, setPeternakanList] = useState<PeternakanPopulasiItem[]>(getPeternakan());
  const [perkebunan, setPerkebunanList] = useState<PerkebunanKomoditiItem[]>(getPerkebunan());
  const [psp, setPspList] = useState<PSPItem[]>(getPSP());
  const [proposals, setProposalsList] = useState<ProposalItem[]>(getProposals());
  const [notifications, setNotificationsList] = useState<AppNotification[]>(getNotifications());
  const [gasConfig, setGasConfigState] = useState<GasConfig>(getGasConfig());

  // Modals state
  const [selectedArchiveForView, setSelectedArchiveForView] = useState<ArsipItem | null>(null);
  const [archiveModalMode, setArchiveModalMode] = useState<'view' | 'edit'>('view');
  const [isArsipModalOpen, setIsArsipModalOpen] = useState(false);
  const [arsipModalDefaultBidang, setArsipModalDefaultBidang] = useState<BidangType>('tph');
  const [isPBJLangsungModalOpen, setIsPBJLangsungModalOpen] = useState(false);
  const [isPBJEPurchasingModalOpen, setIsPBJEPurchasingModalOpen] = useState(false);
  const [isTeknisModalOpen, setIsTeknisModalOpen] = useState(false);
  const [teknisTargetBidang, setTeknisTargetBidang] = useState<'tph' | 'peternakan' | 'perkebunan' | 'psp'>('tph');
  const [selectedTeknisItem, setSelectedTeknisItem] = useState<any | null>(null);
  const [selectedTeknisType, setSelectedTeknisType] = useState<TeknisDataType>('tph-ltt');
  const [isDetailTeknisModalOpen, setIsDetailTeknisModalOpen] = useState(false);
  const [detailTeknisInitialMode, setDetailTeknisInitialMode] = useState<'view' | 'edit'>('view');
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalDefaultBidang, setProposalDefaultBidang] = useState<'tph' | 'psp' | 'peternakan' | 'perkebunan'>('psp');
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Auto-generated QR Code & Kop Morowali Success Modal
  const [successQRCodeData, setSuccessQRCodeData] = useState<SuccessQRCodeData | null>(null);

  // Live Toast state
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const showToastNotification = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Archive Counts helper
  const archiveCounts: Record<BidangType, number> = {
    perencanaan: archives.filter((a) => a.bidang === 'perencanaan').length,
    tph: archives.filter((a) => a.bidang === 'tph').length,
    psp: archives.filter((a) => a.bidang === 'psp').length,
    peternakan: archives.filter((a) => a.bidang === 'peternakan').length,
    perkebunan: archives.filter((a) => a.bidang === 'perkebunan').length,
    pbj: archives.filter((a) => a.bidang === 'pbj').length,
  };

  // Archive handlers
  const handleSaveArsip = (item: ArsipItem) => {
    const updated = [item, ...archives];
    setArchivesList(updated);
    saveArchives(updated);

    // Otomatisasi notifikasi realtime
    const notifMsg = `Dokumen "${item.title}" (${item.nomorSurat}) tersimpan otomatis ke folder Google Drive ${item.driveFolder}.`;
    addNotification({
      title: 'Arsip Baru Berhasil Diunggah',
      message: notifMsg,
      bidang: item.bidang,
      type: 'archive',
    });
    setNotificationsList(getNotifications());
    showToastNotification('Arsip Berhasil Disimpan', notifMsg);

    // Otomatis terbitkan Kode QR & Tanda Bukti Kop Morowali
    setSuccessQRCodeData({
      type: 'arsip',
      id: item.id,
      title: item.title,
      nomorOrCode: item.nomorSurat,
      bidang: item.bidang,
      category: item.subKategori,
      submitterOrGroup: `${item.uploaderName} (${item.uploaderRole})`,
      location: 'Kabupaten Morowali',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      qrPayload: createArchiveQRPayload(item),
    });
  };

  const handleUpdateArsip = (updatedItem: ArsipItem) => {
    const updated = archives.map((a) => (a.id === updatedItem.id ? updatedItem : a));
    setArchivesList(updated);
    saveArchives(updated);
    showToastNotification('Arsip Diperbarui', `Dokumen "${updatedItem.title}" berhasil diubah.`);
  };

  const handleDeleteArsip = (id: string) => {
    const updated = archives.filter((a) => a.id !== id);
    setArchivesList(updated);
    saveArchives(updated);
    showToastNotification('Arsip Dihapus', 'Dokumen arsip telah dihapus dari sistem.');
  };

  // PBJ Handlers
  const handleSavePBJLangsung = (item: PBJLangsungItem) => {
    const updated = [item, ...pbjLangsung];
    setPbjLangsungList(updated);
    savePBJLangsung(updated);

    // Jika terkait proposal, update status proposal otomatis sesuai pilihan/pelaksanaan
    if (item.linkedProposalId) {
      const targetProposal = proposals.find((p) => p.id === item.linkedProposalId);
      const isExecuted =
        item.proposalExecutionStatus === 'Sudah Dilaksanakan / Selesai' ||
        item.status === 'Selesai 100%' ||
        !item.proposalExecutionStatus;

      const nextStatus = isExecuted
        ? ('Sudah Dilaksanakan / Selesai' as const)
        : ('Masuk PBJ' as const);

      const updatedProposals = proposals.map((p) => {
        if (p.id === item.linkedProposalId) {
          return {
            ...p,
            status: nextStatus,
            terintegrasiPbj: true,
            pbjTipe: 'Pengadaan Langsung' as const,
            nomorKontrakPbj: item.noKontrak,
            tanggalPenyaluran: item.tanggalPenyaluran || new Date().toISOString().split('T')[0],
            catatanPenyaluran:
              item.catatanPenyaluran ||
              `Pekerjaan pengadaan langsung telah selesai dilaksanakan berdasarkan Kontrak SPK ${item.noKontrak} dan diserahterimakan kepada kelompok tani.`,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      setProposalsList(updatedProposals);
      saveProposals(updatedProposals);

      if (targetProposal && isExecuted) {
        addNotification({
          title: 'Proposal Masyarakat Selesai Dilaksanakan',
          message: `Usulan dari ${targetProposal.kelompokTani} ("${targetProposal.namaUsulan}") otomatis berstatus "Sudah Dilaksanakan / Selesai" melalui Kontrak ${item.noKontrak}.`,
          bidang: targetProposal.bidang as BidangType,
          type: 'proposal',
        });
      }
    }

    addNotification({
      title: 'Data Pengadaan Langsung Masuk',
      message: `Kontrak SPK No. ${item.noKontrak} (${item.uraianKegiatan}) telah dicatat.`,
      bidang: 'pbj',
      type: 'pbj',
    });
    setNotificationsList(getNotifications());
    showToastNotification('Pengadaan Langsung Tersimpan', `Kontrak ${item.noKontrak} berhasil dicatat.`);

    // Otomatis terbitkan Kode QR & Lembar SPK Ber-Kop Morowali
    setSuccessQRCodeData({
      type: 'pbj',
      id: item.id,
      title: item.uraianKegiatan,
      nomorOrCode: item.noKontrak,
      bidang: 'Pengadaan Barang & Jasa (PBJ)',
      category: 'Pengadaan Langsung (SPK)',
      submitterOrGroup: `Penyedia: ${item.penyedia}`,
      location: 'Kabupaten Morowali',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      qrPayload: createPBJQRPayload(item, 'pl'),
    });
  };

  const handleSavePBJEPurchasing = (item: PBJEPurchasingItem) => {
    const updated = [item, ...pbjEPurchasing];
    setPbjEPurchasingList(updated);
    savePBJEPurchasing(updated);

    if (item.linkedProposalId) {
      const updatedProposals = proposals.map((p) => {
        if (p.id === item.linkedProposalId) {
          return {
            ...p,
            status: item.status === 'Selesai' ? ('Tersalurkan / Selesai' as const) : ('Masuk PBJ' as const),
            terintegrasiPbj: true,
            pbjTipe: 'E-Purchasing' as const,
            nomorKontrakPbj: item.noKontrak,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      setProposalsList(updatedProposals);
      saveProposals(updatedProposals);
    }

    addNotification({
      title: 'Data E-Purchasing Masuk',
      message: `Surat Pesanan Katalog ${item.noKontrak} (${item.penyedia}) berhasil disimpan.`,
      bidang: 'pbj',
      type: 'pbj',
    });
    setNotificationsList(getNotifications());
    showToastNotification('E-Purchasing Tersimpan', `Pesanan ${item.noKontrak} berhasil dicatat.`);

    // Otomatis terbitkan Kode QR & Lembar Pesanan Ber-Kop Morowali
    setSuccessQRCodeData({
      type: 'pbj',
      id: item.id,
      title: item.uraianKegiatan,
      nomorOrCode: item.noKontrak,
      bidang: 'Pengadaan Barang & Jasa (PBJ)',
      category: 'E-Purchasing (Katalog)',
      submitterOrGroup: `Penyedia: ${item.penyedia}`,
      location: 'Kabupaten Morowali',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      qrPayload: createPBJQRPayload(item, 'ep'),
    });
  };

  // Technical Field Data Handlers
  const handleSaveTPHLTT = (item: TPHLTTItem) => {
    const updated = [item, ...tphLtt];
    setTphLttList(updated);
    saveTPHLTT(updated);
    addNotification({
      title: 'Data LTT TPH Diinput',
      message: `Laporan LTT ${item.jenisKomoditi} Kec. ${item.kecamatan} seluas ${item.luasTanam} Ha berhasil disimpan.`,
      bidang: 'tph',
      type: 'teknis',
    });
    setNotificationsList(getNotifications());
    showToastNotification('Data LTT Disimpan', `LTT Desa ${item.desa} berhasil disimpan.`);

    setSuccessQRCodeData({
      type: 'teknis',
      id: item.id,
      title: `Laporan LTT ${item.jenisKomoditi} (${item.varietas})`,
      nomorOrCode: item.id,
      bidang: 'TPH (Tanaman Pangan & Hortikultura)',
      category: 'Luas Tambah Tanam (LTT)',
      submitterOrGroup: `PPL: ${item.petugas}`,
      location: `Desa ${item.desa}, Kec. ${item.kecamatan}, Morowali`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      qrPayload: createTeknisQRPayload(item, 'TPH LTT'),
    });
  };

  const handleSaveTPHPoktan = (item: TPHTanamanPanganItem) => {
    const updated = [item, ...tphPoktan];
    setTphPoktanList(updated);
    saveTPHPoktan(updated);
    showToastNotification('Data Poktan Disimpan', `${item.namaKelompokTani} berhasil dicatat.`);

    setSuccessQRCodeData({
      type: 'teknis',
      id: item.id,
      title: `Data Komoditas ${item.komoditas} - Poktan ${item.namaKelompokTani}`,
      nomorOrCode: item.id,
      bidang: 'TPH (Tanaman Pangan)',
      category: item.musimTanam,
      submitterOrGroup: item.namaKelompokTani,
      location: `Desa ${item.desa}, Kec. ${item.kecamatan}, Morowali`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      qrPayload: createTeknisQRPayload(item, 'TPH Poktan'),
    });
  };

  const handleSavePeternakan = (item: PeternakanPopulasiItem) => {
    const updated = [item, ...peternakan];
    setPeternakanList(updated);
    savePeternakan(updated);
    showToastNotification('Data Populasi Ternak Disimpan', `${item.jenisTernak} (${item.populasi} ekor) dicatat.`);

    setSuccessQRCodeData({
      type: 'teknis',
      id: item.id,
      title: `Pendataan Ternak ${item.jenisTernak} (${item.populasi} Ekor)`,
      nomorOrCode: item.id,
      bidang: 'Peternakan & Kesehatan Hewan',
      category: item.jenisTernak,
      submitterOrGroup: item.pemilikTernak,
      location: `Desa ${item.desa}, Kec. ${item.kecamatan}, Morowali`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      qrPayload: createTeknisQRPayload(item, 'Peternakan'),
    });
  };

  const handleSavePerkebunan = (item: PerkebunanKomoditiItem) => {
    const updated = [item, ...perkebunan];
    setPerkebunanList(updated);
    savePerkebunan(updated);
    showToastNotification('Data Perkebunan Disimpan', `${item.jenisTanaman} Poktan ${item.namaKelompokTani} dicatat.`);

    setSuccessQRCodeData({
      type: 'teknis',
      id: item.id,
      title: `Komoditi Perkebunan ${item.jenisTanaman} (${item.luasLahan} Ha)`,
      nomorOrCode: item.id,
      bidang: 'Perkebunan',
      category: item.jenisTanaman,
      submitterOrGroup: `${item.namaKelompokTani} (Ketua: ${item.namaKetua})`,
      location: `Desa ${item.desa}, Kec. ${item.kecamatan}, Morowali`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      qrPayload: createTeknisQRPayload(item, 'Perkebunan'),
    });
  };

  const handleSavePSP = (item: PSPItem) => {
    const updated = [item, ...psp];
    setPspList(updated);
    savePSP(updated);
    showToastNotification('Data PSP Disimpan', `${item.jenisData} TA ${item.tahun} dicatat.`);

    setSuccessQRCodeData({
      type: 'teknis',
      id: item.id,
      title: `${item.jenisData}: ${item.namaKegiatan}`,
      nomorOrCode: item.id,
      bidang: 'Prasarana & Sarana Pertanian (PSP)',
      category: item.jenisData,
      submitterOrGroup: `${item.kelompokTani} (Ketua: ${item.namaKetua})`,
      location: `Desa ${item.desa}, Kec. ${item.kecamatan}, Morowali`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      qrPayload: createTeknisQRPayload(item, 'PSP'),
    });
  };

  // Technical Detail, Update & Delete Handlers
  const handleOpenDetailTeknis = (item: any, type: TeknisDataType, mode: 'view' | 'edit' = 'view') => {
    setSelectedTeknisItem(item);
    setSelectedTeknisType(type);
    setDetailTeknisInitialMode(mode);
    setIsDetailTeknisModalOpen(true);
  };

  const handleUpdateTPHLTT = (updated: TPHLTTItem) => {
    const list = tphLtt.map((x) => (x.id === updated.id ? updated : x));
    setTphLttList(list);
    saveTPHLTT(list);
    showToastNotification('Data LTT Diperbarui', `LTT Desa ${updated.desa} berhasil diubah.`);
  };

  const handleUpdateTPHPoktan = (updated: TPHTanamanPanganItem) => {
    const list = tphPoktan.map((x) => (x.id === updated.id ? updated : x));
    setTphPoktanList(list);
    saveTPHPoktan(list);
    showToastNotification('Data Poktan Diperbarui', `${updated.namaKelompokTani} berhasil diubah.`);
  };

  const handleUpdatePeternakan = (updated: PeternakanPopulasiItem) => {
    const list = peternakan.map((x) => (x.id === updated.id ? updated : x));
    setPeternakanList(list);
    savePeternakan(list);
    showToastNotification('Data Peternakan Diperbarui', `${updated.jenisTernak} milik ${updated.pemilikTernak} berhasil diubah.`);
  };

  const handleUpdatePerkebunan = (updated: PerkebunanKomoditiItem) => {
    const list = perkebunan.map((x) => (x.id === updated.id ? updated : x));
    setPerkebunanList(list);
    savePerkebunan(list);
    showToastNotification('Data Perkebunan Diperbarui', `Komoditas ${updated.jenisTanaman} berhasil diubah.`);
  };

  const handleUpdatePSP = (updated: PSPItem) => {
    const list = psp.map((x) => (x.id === updated.id ? updated : x));
    setPspList(list);
    savePSP(list);
    showToastNotification('Data PSP Diperbarui', `${updated.namaKegiatan} berhasil diubah.`);
  };

  const handleDeleteTeknisItem = (id: string, type: TeknisDataType) => {
    if (type === 'tph-ltt') {
      const list = tphLtt.filter((x) => x.id !== id);
      setTphLttList(list);
      saveTPHLTT(list);
    } else if (type === 'tph-poktan') {
      const list = tphPoktan.filter((x) => x.id !== id);
      setTphPoktanList(list);
      saveTPHPoktan(list);
    } else if (type === 'peternakan') {
      const list = peternakan.filter((x) => x.id !== id);
      setPeternakanList(list);
      savePeternakan(list);
    } else if (type === 'perkebunan') {
      const list = perkebunan.filter((x) => x.id !== id);
      setPerkebunanList(list);
      savePerkebunan(list);
    } else if (type === 'psp') {
      const list = psp.filter((x) => x.id !== id);
      setPspList(list);
      savePSP(list);
    }
    showToastNotification('Data Teknis Dihapus', 'Data teknis berhasil dihapus dari sistem.');
  };

  // Proposals handler
  const handleSaveProposal = (item: ProposalItem) => {
    const updated = [item, ...proposals];
    setProposalsList(updated);
    saveProposals(updated);
    addNotification({
      title: 'Proposal Masuk Baru',
      message: `Proposal usulan "${item.namaUsulan}" dari ${item.kelompokTani} berhasil diinput.`,
      bidang: item.bidang as BidangType,
      type: 'proposal',
    });
    setNotificationsList(getNotifications());
    showToastNotification('Proposal Berhasil Disimpan', `Usulan ${item.kelompokTani} telah tercatat.`);

    // Otomatis terbitkan Kode QR & Lembar Verifikasi Proposal Ber-Kop Morowali
    setSuccessQRCodeData({
      type: 'proposal',
      id: item.id,
      title: item.namaUsulan,
      nomorOrCode: item.id,
      bidang: item.bidang,
      category: 'Usulan Proposal Kelompok Tani',
      submitterOrGroup: `${item.kelompokTani} (Ketua: ${item.ketua})`,
      location: `Desa ${item.desa}, Kec. ${item.kecamatan}, Kab. Morowali`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      qrPayload: createProposalQRPayload(item),
    });
  };

  const handleUpdateProposal = (updatedItem: ProposalItem) => {
    const updated = proposals.map((p) => (p.id === updatedItem.id ? updatedItem : p));
    setProposalsList(updated);
    saveProposals(updated);
    showToastNotification('Proposal Diperbarui', `Proposal "${updatedItem.namaUsulan}" berhasil disimpan.`);
  };

  const handleDeleteProposal = (id: string) => {
    const updated = proposals.filter((p) => p.id !== id);
    setProposalsList(updated);
    saveProposals(updated);
    showToastNotification('Proposal Dihapus', 'Data usulan proposal berhasil dihapus.');
  };

  const handleUpdatePBJLangsung = (updatedItem: PBJLangsungItem) => {
    const updated = pbjLangsung.map((p) => (p.id === updatedItem.id ? updatedItem : p));
    setPbjLangsungList(updated);
    savePBJLangsung(updated);
    showToastNotification('Pengadaan Langsung Diperbarui', `Kontrak ${updatedItem.noKontrak} diperbarui.`);
  };

  const handleUpdatePBJEPurchasing = (updatedItem: PBJEPurchasingItem) => {
    const updated = pbjEPurchasing.map((p) => (p.id === updatedItem.id ? updatedItem : p));
    setPbjEPurchasingList(updated);
    savePBJEPurchasing(updated);
    showToastNotification('E-Purchasing Diperbarui', `Pesanan ${updatedItem.noKontrak} diperbarui.`);
  };

  const handleDeletePBJLangsung = (id: string) => {
    const updated = pbjLangsung.filter((p) => p.id !== id);
    setPbjLangsungList(updated);
    savePBJLangsung(updated);
    showToastNotification('Pengadaan Langsung Dihapus', 'Data pengadaan telah dihapus.');
  };

  const handleDeletePBJEPurchasing = (id: string) => {
    const updated = pbjEPurchasing.filter((p) => p.id !== id);
    setPbjEPurchasingList(updated);
    savePBJEPurchasing(updated);
    showToastNotification('E-Purchasing Dihapus', 'Data e-purchasing telah dihapus.');
  };

  const handleMarkProposalExecuted = (proposalId: string, contractNo: string) => {
    const target = proposals.find((p) => p.id === proposalId);
    const updated = proposals.map((p) => {
      if (p.id === proposalId) {
        return {
          ...p,
          status: 'Sudah Dilaksanakan / Selesai' as const,
          terintegrasiPbj: true,
          pbjTipe: 'Pengadaan Langsung' as const,
          nomorKontrakPbj: contractNo,
          tanggalPenyaluran: new Date().toISOString().split('T')[0],
          catatanPenyaluran: `Usulan telah selesai dilaksanakan melalui kontrak ${contractNo}.`,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    setProposalsList(updated);
    saveProposals(updated);

    if (target) {
      addNotification({
        title: 'Usulan Proposal Selesai Dilaksanakan',
        message: `Usulan dari ${target.kelompokTani} telah ditandai "Sudah Dilaksanakan / Selesai" via Kontrak ${contractNo}.`,
        bidang: target.bidang as BidangType,
        type: 'proposal',
      });
      showToastNotification(
        'Status Proposal Diperbarui',
        `Usulan ${target.kelompokTani} berstatus Sudah Dilaksanakan / Selesai.`
      );
    }
  };

  // User & Auth management
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrUser(user);
    setCurrentUser(user);
    setIsLoggedIn(true);
    saveIsLoggedIn(true);
    showToastNotification('Berhasil Masuk', `Selamat datang kembali, ${user.name} (${user.role}).`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    saveIsLoggedIn(false);
    showToastNotification('Berhasil Keluar', 'Sesi Anda telah diakhiri. Silakan masukkan username & password untuk masuk kembali.');
  };

  const handleSwitchUser = (user: UserAccount) => {
    setCurrUser(user);
    setCurrentUser(user);
    showToastNotification('Akun Beralih', `Sekarang aktif sebagai ${user.name} (${user.role}).`);
  };

  const handleAddUser = (newUser: UserAccount) => {
    const updated = [...users, newUser];
    setUsersList(updated);
    saveUsers(updated);
    showToastNotification('Pengguna Baru Ditambahkan', `Akun @${newUser.username} berhasil dibuat.`);
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    const updated = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsersList(updated);
    saveUsers(updated);
    if (currentUser.id === updatedUser.id) {
      setCurrUser(updatedUser);
      setCurrentUser(updatedUser);
    }
    showToastNotification('Data Pengguna Diperbarui', `Akun ${updatedUser.name} berhasil diperbarui.`);
  };

  const handleDeleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    const updated = users.filter((u) => u.id !== userId);
    setUsersList(updated);
    saveUsers(updated);

    if (currentUser.id === userId) {
      const fallback = updated[0];
      if (fallback) {
        setCurrUser(fallback);
        setCurrentUser(fallback);
      }
    }

    showToastNotification('Pengguna Dihapus', `Akun ${target?.name || ''} telah dihapus dari sistem.`);
  };

  const handleAddRole = (newRole: RoleDefinition) => {
    const updated = [...roles, newRole];
    setRolesList(updated);
    saveRoles(updated);
    showToastNotification('Role Baru Ditambahkan', `Role "${newRole.name}" berhasil ditambahkan.`);
  };

  const handleUpdateRole = (updatedRole: RoleDefinition) => {
    const updated = roles.map((r) => (r.id === updatedRole.id ? updatedRole : r));
    setRolesList(updated);
    saveRoles(updated);
    showToastNotification('Role Diperbarui', `Role "${updatedRole.name}" berhasil diperbarui.`);
  };

  const handleDeleteRole = (roleId: string, roleName: string) => {
    const updated = roles.filter((r) => r.id !== roleId);
    setRolesList(updated);
    saveRoles(updated);

    // Pengguna yang memiliki role ini dialihkan ke Viewer agar tetap konsisten
    const updatedUsers = users.map((u) => {
      if (u.role === roleName) {
        return { ...u, role: 'Viewer' };
      }
      return u;
    });
    setUsersList(updatedUsers);
    saveUsers(updatedUsers);

    if (currentUser.role === roleName) {
      const updatedCurr = { ...currentUser, role: 'Viewer' };
      setCurrUser(updatedCurr);
      setCurrentUser(updatedCurr);
    }

    showToastNotification('Role Dihapus', `Role "${roleName}" berhasil dihapus dari sistem.`);
  };

  const handleUpdateProfile = (updatedUser: UserAccount) => {
    setCurrUser(updatedUser);
    setCurrentUser(updatedUser);
    const updatedList = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsersList(updatedList);
    saveUsers(updatedList);
  };

  const handleSaveGasConfig = (cfg: GasConfig) => {
    setGasConfigState(cfg);
    saveGasConfig(cfg);
  };

  const handleMarkAllNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotificationsList(updated);
    saveNotifications(updated);
  };

  // Render content based on currentTab
  const renderMainContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            archives={archives}
            pbjLangsung={pbjLangsung}
            pbjEPurchasing={pbjEPurchasing}
            proposals={proposals}
            currentUser={currentUser}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenArsipModal={(b) => {
              setArsipModalDefaultBidang(b || 'tph');
              setIsArsipModalOpen(true);
            }}
            onOpenPBJLangsungModal={() => setIsPBJLangsungModalOpen(true)}
            onOpenPBJEPurchasingModal={() => setIsPBJEPurchasingModalOpen(true)}
            onOpenProposalModal={() => setIsProposalModalOpen(true)}
            onSelectArchive={(item) => setSelectedArchiveForView(item)}
          />
        );

      case 'arsip-semua':
      case 'arsip-perencanaan':
      case 'arsip-tph':
      case 'arsip-psp':
      case 'arsip-peternakan':
      case 'arsip-perkebunan':
      case 'arsip-pbj': {
        const bidangFilter = currentTab === 'arsip-semua'
          ? 'semua'
          : (currentTab.replace('arsip-', '') as BidangType);

        return (
          <ArsipListView
            archives={archives}
            selectedBidangFilter={bidangFilter}
            onSelectBidangFilter={(b) => {
              if (b === 'semua') setCurrentTab('arsip-semua');
              else setCurrentTab(`arsip-${b}` as NavTab);
            }}
            onOpenNewArsipModal={(b) => {
              setArsipModalDefaultBidang(b || 'tph');
              setIsArsipModalOpen(true);
            }}
            onViewArchive={(item) => {
              setSelectedArchiveForView(item);
              setArchiveModalMode('view');
            }}
            onEditArchive={(item) => {
              setSelectedArchiveForView(item);
              setArchiveModalMode('edit');
            }}
            onDeleteArchive={handleDeleteArsip}
          />
        );
      }

      case 'input-pbj-langsung':
        return (
          <PBJListView
            initialSubTab="langsung"
            langsungList={pbjLangsung}
            epurchasingList={pbjEPurchasing}
            proposals={proposals}
            onOpenNewLangsung={() => setIsPBJLangsungModalOpen(true)}
            onOpenNewEPurchasing={() => setIsPBJEPurchasingModalOpen(true)}
            onMarkProposalExecuted={handleMarkProposalExecuted}
            onUpdateLangsung={handleUpdatePBJLangsung}
            onUpdateEPurchasing={handleUpdatePBJEPurchasing}
            onDeleteLangsung={handleDeletePBJLangsung}
            onDeleteEPurchasing={handleDeletePBJEPurchasing}
          />
        );

      case 'input-pbj-epurchasing':
        return (
          <PBJListView
            initialSubTab="epurchasing"
            langsungList={pbjLangsung}
            epurchasingList={pbjEPurchasing}
            proposals={proposals}
            onOpenNewLangsung={() => setIsPBJLangsungModalOpen(true)}
            onOpenNewEPurchasing={() => setIsPBJEPurchasingModalOpen(true)}
            onMarkProposalExecuted={handleMarkProposalExecuted}
            onUpdateLangsung={handleUpdatePBJLangsung}
            onUpdateEPurchasing={handleUpdatePBJEPurchasing}
            onDeleteLangsung={handleDeletePBJLangsung}
            onDeleteEPurchasing={handleDeletePBJEPurchasing}
          />
        );

      case 'input-teknis-tph':
        return (
          <TeknisListView
            targetBidang="tph"
            tphLttList={tphLtt}
            tphPoktanList={tphPoktan}
            peternakanList={peternakan}
            perkebunanList={perkebunan}
            pspList={psp}
            onOpenNewTeknisModal={(b) => {
              setTeknisTargetBidang(b);
              setIsTeknisModalOpen(true);
            }}
            onViewTeknisItem={(item, type) => handleOpenDetailTeknis(item, type, 'view')}
            onEditTeknisItem={(item, type) => handleOpenDetailTeknis(item, type, 'edit')}
            onDeleteTeknisItem={handleDeleteTeknisItem}
          />
        );

      case 'input-teknis-peternakan':
        return (
          <TeknisListView
            targetBidang="peternakan"
            tphLttList={tphLtt}
            tphPoktanList={tphPoktan}
            peternakanList={peternakan}
            perkebunanList={perkebunan}
            pspList={psp}
            onOpenNewTeknisModal={(b) => {
              setTeknisTargetBidang(b);
              setIsTeknisModalOpen(true);
            }}
            onViewTeknisItem={(item, type) => handleOpenDetailTeknis(item, type, 'view')}
            onEditTeknisItem={(item, type) => handleOpenDetailTeknis(item, type, 'edit')}
            onDeleteTeknisItem={handleDeleteTeknisItem}
          />
        );

      case 'input-teknis-perkebunan':
        return (
          <TeknisListView
            targetBidang="perkebunan"
            tphLttList={tphLtt}
            tphPoktanList={tphPoktan}
            peternakanList={peternakan}
            perkebunanList={perkebunan}
            pspList={psp}
            onOpenNewTeknisModal={(b) => {
              setTeknisTargetBidang(b);
              setIsTeknisModalOpen(true);
            }}
            onViewTeknisItem={(item, type) => handleOpenDetailTeknis(item, type, 'view')}
            onEditTeknisItem={(item, type) => handleOpenDetailTeknis(item, type, 'edit')}
            onDeleteTeknisItem={handleDeleteTeknisItem}
          />
        );

      case 'input-teknis-psp':
        return (
          <TeknisListView
            targetBidang="psp"
            tphLttList={tphLtt}
            tphPoktanList={tphPoktan}
            peternakanList={peternakan}
            perkebunanList={perkebunan}
            pspList={psp}
            onOpenNewTeknisModal={(b) => {
              setTeknisTargetBidang(b);
              setIsTeknisModalOpen(true);
            }}
            onViewTeknisItem={(item, type) => handleOpenDetailTeknis(item, type, 'view')}
            onEditTeknisItem={(item, type) => handleOpenDetailTeknis(item, type, 'edit')}
            onDeleteTeknisItem={handleDeleteTeknisItem}
          />
        );

      case 'input-proposal':
        return (
          <ProposalListView
            proposals={proposals}
            pbjLangsungList={pbjLangsung}
            pbjEPurchasingList={pbjEPurchasing}
            onOpenNewProposalModal={(b) => {
              setProposalDefaultBidang(b || 'psp');
              setIsProposalModalOpen(true);
            }}
            onUpdateProposal={handleUpdateProposal}
            onDeleteProposal={handleDeleteProposal}
          />
        );

      case 'pengaturan':
        return (
          <SettingsView
            gasConfig={gasConfig}
            onOpenGasModal={() => setIsGasModalOpen(true)}
            onOpenUserManagement={() => setIsUserManagementOpen(true)}
            users={users}
            currentUser={currentUser}
          />
        );

      case 'profil':
        return (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="rounded-2xl glass-panel p-6 shadow-xl border-l-4 border-l-emerald-600">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Profil Akun Pengguna</h2>
              <p className="text-xs text-slate-600 mb-4">
                Kelola data profil, NIP, kontak dan hak akses peran sistem SIPADI Anda.
              </p>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 shadow transition"
              >
                Ubah Profil Akun
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // If user is not logged in, enforce the official Login Screen
  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen users={users} onLoginSuccess={handleLoginSuccess} />
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-start gap-3 rounded-2xl bg-slate-900/95 text-white p-4 shadow-2xl border border-emerald-500/40 backdrop-blur-md max-w-sm animate-bounce-short">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <BellRing className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-emerald-300">{toast.title}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <RiceFieldBackground>
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenUserModal={() => setIsUserManagementOpen(true)}
        onOpenGasModal={() => setIsGasModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        gasConfig={gasConfig}
      />

      {/* Main Layout: Sidebar & Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          archiveCounts={archiveCounts}
          proposalCount={proposals.length}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderMainContent()}
          </div>
        </main>
      </div>

      {/* FLOATING TOAST NOTIFICATION POPUP */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-start gap-3 rounded-2xl bg-slate-900/95 text-white p-4 shadow-2xl border border-emerald-500/40 backdrop-blur-md max-w-sm animate-bounce-short">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <BellRing className="h-5 w-5 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-emerald-300">{toast.title}</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* MODAL WINDOWS */}

      {/* 1. Archive Viewer & Editor Modal */}
      {selectedArchiveForView && (
        <ArchiveDocumentViewerModal
          item={selectedArchiveForView}
          initialMode={archiveModalMode}
          onClose={() => setSelectedArchiveForView(null)}
          onUpdate={handleUpdateArsip}
          onDelete={handleDeleteArsip}
        />
      )}

      {/* 2. Form Input Arsip Baru */}
      <FormArsipModal
        isOpen={isArsipModalOpen}
        onClose={() => setIsArsipModalOpen(false)}
        onSave={handleSaveArsip}
        currentUser={currentUser}
        defaultBidang={arsipModalDefaultBidang}
      />

      {/* 3. Form Input PBJ Langsung */}
      <FormPBJLangsungModal
        isOpen={isPBJLangsungModalOpen}
        onClose={() => setIsPBJLangsungModalOpen(false)}
        onSave={handleSavePBJLangsung}
        availableProposals={proposals}
      />

      {/* 4. Form Input PBJ E-Purchasing */}
      <FormPBJEPurchasingModal
        isOpen={isPBJEPurchasingModalOpen}
        onClose={() => setIsPBJEPurchasingModalOpen(false)}
        onSave={handleSavePBJEPurchasing}
        availableProposals={proposals}
      />

      {/* 5. Form Input Data Teknis */}
      <FormTeknisModal
        isOpen={isTeknisModalOpen}
        onClose={() => setIsTeknisModalOpen(false)}
        targetBidang={teknisTargetBidang}
        onSaveTPHLTT={handleSaveTPHLTT}
        onSaveTPHPoktan={handleSaveTPHPoktan}
        onSavePeternakan={handleSavePeternakan}
        onSavePerkebunan={handleSavePerkebunan}
        onSavePSP={handleSavePSP}
      />

      {/* 5b. Detail & Edit Data Teknis Modal */}
      {selectedTeknisItem && (
        <DetailTeknisModal
          isOpen={isDetailTeknisModalOpen}
          onClose={() => {
            setIsDetailTeknisModalOpen(false);
            setSelectedTeknisItem(null);
          }}
          type={selectedTeknisType}
          item={selectedTeknisItem}
          initialMode={detailTeknisInitialMode}
          onUpdateTPHLTT={handleUpdateTPHLTT}
          onUpdateTPHPoktan={handleUpdateTPHPoktan}
          onUpdatePeternakan={handleUpdatePeternakan}
          onUpdatePerkebunan={handleUpdatePerkebunan}
          onUpdatePSP={handleUpdatePSP}
          onDeleteItem={handleDeleteTeknisItem}
        />
      )}

      {/* 6. Form Input Proposal Kelompok Tani */}
      <FormProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        onSave={handleSaveProposal}
        defaultBidang={proposalDefaultBidang}
        pbjLangsungList={pbjLangsung}
        pbjEPurchasingList={pbjEPurchasing}
      />

      {/* 7. User Role & Custom Login Management */}
      <UserManagementModal
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
        users={users}
        currentUser={currentUser}
        roles={roles}
        onSwitchUser={handleSwitchUser}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        onAddRole={handleAddRole}
        onUpdateRole={handleUpdateRole}
        onDeleteRole={handleDeleteRole}
      />

      {/* 8. User Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateProfile}
        onOpenUserManagement={() => {
          setIsProfileModalOpen(false);
          setIsUserManagementOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* 9. Google Apps Script & Google Drive Integration Modal */}
      <GasIntegrationModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
        config={gasConfig}
        onSaveConfig={handleSaveGasConfig}
      />

      {/* 10. Notification Center Drawer */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
      />

      {/* 11. Modal Sukses & Kode QR Otomatis Ber-Kop Morowali */}
      <SuccessQRCodeModal
        data={successQRCodeData}
        onClose={() => setSuccessQRCodeData(null)}
      />
    </RiceFieldBackground>
  );
}
