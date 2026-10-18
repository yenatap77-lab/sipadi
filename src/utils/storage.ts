/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  GasConfig,
} from '../types';
import {
  INITIAL_ARCHIVES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PBJ_EPURCHASING,
  INITIAL_PBJ_LANGSUNG,
  INITIAL_PERKEBUNAN,
  INITIAL_PETERNAKAN,
  INITIAL_PROPOSALS,
  INITIAL_PSP,
  INITIAL_TPH_LTT,
  INITIAL_TPH_POKTAN,
  INITIAL_USERS,
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'sipadi_users_v1',
  ROLES: 'sipadi_roles_v1',
  CURRENT_USER: 'sipadi_curr_user_v1',
  ARCHIVES: 'sipadi_archives_v1',
  PBJ_LANGSUNG: 'sipadi_pbj_langsung_v1',
  PBJ_EPURCHASING: 'sipadi_pbj_epurchasing_v1',
  TPH_LTT: 'sipadi_tph_ltt_v1',
  TPH_POKTAN: 'sipadi_tph_poktan_v1',
  PETERNAKAN: 'sipadi_peternakan_v1',
  PERKEBUNAN: 'sipadi_perkebunan_v1',
  PSP: 'sipadi_psp_v1',
  PROPOSALS: 'sipadi_proposals_v1',
  NOTIFICATIONS: 'sipadi_notifications_v1',
  GAS_CONFIG: 'sipadi_gas_config_v1',
  IS_LOGGED_IN: 'sipadi_is_logged_in_v1',
};

function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

// User & Auth state
export function getIsLoggedIn(): boolean {
  return getLocal<boolean>(STORAGE_KEYS.IS_LOGGED_IN, false);
}

export function saveIsLoggedIn(isLoggedIn: boolean): void {
  setLocal(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn);
}

export function getUsers(): UserAccount[] {
  const loaded = getLocal<UserAccount[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  // Ensure every user has a password for authentication
  let changed = false;
  const migrated = loaded.map((u) => {
    if (!u.password) {
      changed = true;
      return {
        ...u,
        password: u.username === 'admin' ? 'admin123' : '123456',
      };
    }
    return u;
  });
  if (changed) {
    saveUsers(migrated);
  }
  return migrated;
}

export function saveUsers(users: UserAccount[]): void {
  setLocal(STORAGE_KEYS.USERS, users);
}

export const DEFAULT_ROLES: RoleDefinition[] = [
  {
    id: 'role-admin',
    name: 'Administrator',
    bidang: 'semua',
    description: 'Akses penuh seluruh modul, konfigurasi sistem, dan manajemen data dinas.',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-tph',
    name: 'Operator Bidang TPH',
    bidang: 'tph',
    description: 'Pengelolaan data LTT, CPCL benih, komoditi pangan & kelompok tani.',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-psp',
    name: 'Operator Bidang PSP',
    bidang: 'psp',
    description: 'Pengelolaan alsintan modern, irigasi tersier, dan pembangunan jalan usahatani.',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-peternakan',
    name: 'Operator Bidang Peternakan',
    bidang: 'peternakan',
    description: 'Pengelolaan populasi ternak, kesehatan hewan, vaksinasi PMK, dan kandang.',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-perkebunan',
    name: 'Operator Bidang Perkebunan',
    bidang: 'perkebunan',
    description: 'Pengelolaan komoditi perkebunan rakyat (sawit, kopi, kakao), peremajaan & produksi.',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-pbj',
    name: 'Pejabat Pengadaan (PBJ)',
    bidang: 'pbj',
    description: 'Pengelolaan paket pengadaan langsung, e-purchasing katalog, SPK, dan pencairan.',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-ppl',
    name: 'Penyuluh Pertanian Lapangan',
    bidang: 'tph',
    description: 'Pendataan lapangan, pendampingan poktan, dan verifikasi titik koordinat lahan.',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-viewer',
    name: 'Viewer',
    bidang: 'semua',
    description: 'Akses melihat dokumen arsip dan laporan tanpa izin perubahan data.',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

export function getRoles(): RoleDefinition[] {
  return getLocal<RoleDefinition[]>(STORAGE_KEYS.ROLES, DEFAULT_ROLES);
}

export function saveRoles(roles: RoleDefinition[]): void {
  setLocal(STORAGE_KEYS.ROLES, roles);
}

export function getCurrentUser(): UserAccount {
  return getLocal<UserAccount>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
}

export function setCurrentUser(user: UserAccount): void {
  setLocal(STORAGE_KEYS.CURRENT_USER, user);
}

// Archives
export function getArchives(): ArsipItem[] {
  return getLocal<ArsipItem[]>(STORAGE_KEYS.ARCHIVES, INITIAL_ARCHIVES);
}

export function saveArchives(list: ArsipItem[]): void {
  setLocal(STORAGE_KEYS.ARCHIVES, list);
}

// PBJ
export function getPBJLangsung(): PBJLangsungItem[] {
  return getLocal<PBJLangsungItem[]>(STORAGE_KEYS.PBJ_LANGSUNG, INITIAL_PBJ_LANGSUNG);
}

export function savePBJLangsung(list: PBJLangsungItem[]): void {
  setLocal(STORAGE_KEYS.PBJ_LANGSUNG, list);
}

export function getPBJEPurchasing(): PBJEPurchasingItem[] {
  return getLocal<PBJEPurchasingItem[]>(STORAGE_KEYS.PBJ_EPURCHASING, INITIAL_PBJ_EPURCHASING);
}

export function savePBJEPurchasing(list: PBJEPurchasingItem[]): void {
  setLocal(STORAGE_KEYS.PBJ_EPURCHASING, list);
}

// TPH
export function getTPHLTT(): TPHLTTItem[] {
  return getLocal<TPHLTTItem[]>(STORAGE_KEYS.TPH_LTT, INITIAL_TPH_LTT);
}

export function saveTPHLTT(list: TPHLTTItem[]): void {
  setLocal(STORAGE_KEYS.TPH_LTT, list);
}

export function getTPHPoktan(): TPHTanamanPanganItem[] {
  return getLocal<TPHTanamanPanganItem[]>(STORAGE_KEYS.TPH_POKTAN, INITIAL_TPH_POKTAN);
}

export function saveTPHPoktan(list: TPHTanamanPanganItem[]): void {
  setLocal(STORAGE_KEYS.TPH_POKTAN, list);
}

// Peternakan
export function getPeternakan(): PeternakanPopulasiItem[] {
  return getLocal<PeternakanPopulasiItem[]>(STORAGE_KEYS.PETERNAKAN, INITIAL_PETERNAKAN);
}

export function savePeternakan(list: PeternakanPopulasiItem[]): void {
  setLocal(STORAGE_KEYS.PETERNAKAN, list);
}

// Perkebunan
export function getPerkebunan(): PerkebunanKomoditiItem[] {
  return getLocal<PerkebunanKomoditiItem[]>(STORAGE_KEYS.PERKEBUNAN, INITIAL_PERKEBUNAN);
}

export function savePerkebunan(list: PerkebunanKomoditiItem[]): void {
  setLocal(STORAGE_KEYS.PERKEBUNAN, list);
}

// PSP
export function getPSP(): PSPItem[] {
  return getLocal<PSPItem[]>(STORAGE_KEYS.PSP, INITIAL_PSP);
}

export function savePSP(list: PSPItem[]): void {
  setLocal(STORAGE_KEYS.PSP, list);
}

// Proposals
export function getProposals(): ProposalItem[] {
  return getLocal<ProposalItem[]>(STORAGE_KEYS.PROPOSALS, INITIAL_PROPOSALS);
}

export function saveProposals(list: ProposalItem[]): void {
  setLocal(STORAGE_KEYS.PROPOSALS, list);
}

// Notifications
export function getNotifications(): AppNotification[] {
  return getLocal<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

export function saveNotifications(list: AppNotification[]): void {
  setLocal(STORAGE_KEYS.NOTIFICATIONS, list);
}

export function addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification {
  const current = getNotifications();
  const newNotif: AppNotification = {
    ...notif,
    id: 'notif-' + Date.now(),
    timestamp: new Date().toISOString(),
    read: false,
  };
  const updated = [newNotif, ...current];
  saveNotifications(updated);
  return newNotif;
}

// Google Apps Script Config
const DEFAULT_GAS_CONFIG: GasConfig = {
  webAppUrl: '',
  autoSync: false,
};

export function getGasConfig(): GasConfig {
  return getLocal<GasConfig>(STORAGE_KEYS.GAS_CONFIG, DEFAULT_GAS_CONFIG);
}

export function saveGasConfig(config: GasConfig): void {
  setLocal(STORAGE_KEYS.GAS_CONFIG, config);
}

// Reset data to defaults
export function resetAllDataToDefault(): void {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.ARCHIVES);
  localStorage.removeItem(STORAGE_KEYS.PBJ_LANGSUNG);
  localStorage.removeItem(STORAGE_KEYS.PBJ_EPURCHASING);
  localStorage.removeItem(STORAGE_KEYS.TPH_LTT);
  localStorage.removeItem(STORAGE_KEYS.TPH_POKTAN);
  localStorage.removeItem(STORAGE_KEYS.PETERNAKAN);
  localStorage.removeItem(STORAGE_KEYS.PERKEBUNAN);
  localStorage.removeItem(STORAGE_KEYS.PSP);
  localStorage.removeItem(STORAGE_KEYS.PROPOSALS);
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  window.location.reload();
}
