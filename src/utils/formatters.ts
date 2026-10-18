/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BidangType } from '../types';

export function formatRupiah(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return 'Rp 0';
  }
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDateIndo(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateTimeIndo(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export interface BidangMeta {
  key: BidangType;
  label: string;
  shortLabel: string;
  folderDrive: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentColor: string;
  gradient: string;
  desc: string;
}

export const BIDANG_CONFIG: Record<BidangType, BidangMeta> = {
  perencanaan: {
    key: 'perencanaan',
    label: 'Arsip Perencanaan',
    shortLabel: 'Perencanaan',
    folderDrive: 'SIPADI/Arsip_Perencanaan',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badgeText: 'text-indigo-800 dark:text-indigo-300',
    badgeBorder: 'border-indigo-300 dark:border-indigo-700/60',
    accentColor: '#4f46e5',
    gradient: 'from-indigo-700 to-slate-800',
    desc: 'Renstra, Renja, DPA/RKA, penetapan target indikator dinas & evaluasi berkala.',
  },
  tph: {
    key: 'tph',
    label: 'Arsip TPH (Tanaman Pangan & Hortikultura)',
    shortLabel: 'TPH',
    folderDrive: 'SIPADI/Arsip_TPH',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    badgeBorder: 'border-emerald-300 dark:border-emerald-700/60',
    accentColor: '#10b981',
    gradient: 'from-emerald-700 to-green-900',
    desc: 'Data LTT, panen padi/palawija, benih, komoditas hortikultura & CPCL kelompok tani.',
  },
  psp: {
    key: 'psp',
    label: 'Arsip PSP (Prasarana & Sarana Pertanian)',
    shortLabel: 'PSP',
    folderDrive: 'SIPADI/Arsip_PSP',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-800 dark:text-amber-300',
    badgeBorder: 'border-amber-300 dark:border-amber-700/60',
    accentColor: '#f59e0b',
    gradient: 'from-amber-600 to-amber-900',
    desc: 'Alsintan modern, jaringan irigasi tersier, jalan usahatani & sumur resapan air.',
  },
  peternakan: {
    key: 'peternakan',
    label: 'Arsip Peternakan & Kesehatan Hewan',
    shortLabel: 'Peternakan',
    folderDrive: 'SIPADI/Arsip_Peternakan',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-800 dark:text-rose-300',
    badgeBorder: 'border-rose-300 dark:border-rose-700/60',
    accentColor: '#f43f5e',
    gradient: 'from-rose-700 to-rose-950',
    desc: 'Populasi ternak ruminansia/unggas, vaksinasi PMK, kandang & bibit ternak rakyat.',
  },
  perkebunan: {
    key: 'perkebunan',
    label: 'Arsip Perkebunan',
    shortLabel: 'Perkebunan',
    folderDrive: 'SIPADI/Arsip_Perkebunan',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40',
    badgeText: 'text-teal-800 dark:text-teal-300',
    badgeBorder: 'border-teal-300 dark:border-teal-700/60',
    accentColor: '#0d9488',
    gradient: 'from-teal-700 to-teal-950',
    desc: 'Kelapa sawit rakyat, kopi, kakao, karet, peremajaan (PSR) & pupuk perkebunan.',
  },
  pbj: {
    key: 'pbj',
    label: 'Arsip PBJ (Pengadaan Barang & Jasa)',
    shortLabel: 'PBJ',
    folderDrive: 'SIPADI/Arsip_PBJ',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/40',
    badgeText: 'text-cyan-800 dark:text-cyan-300',
    badgeBorder: 'border-cyan-300 dark:border-cyan-700/60',
    accentColor: '#06b6d4',
    gradient: 'from-cyan-700 to-cyan-950',
    desc: 'Pengadaan Langsung & E-Purchasing, kontrak, BAP, uang muka hingga retensi.',
  },
};
