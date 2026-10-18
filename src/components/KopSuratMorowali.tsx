/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LogoKabupatenMorowali } from './LogoKabupatenMorowali';

interface KopSuratMorowaliProps {
  documentTitle?: string;
  documentSubtitle?: string;
  nomorRegistrasi?: string;
  compact?: boolean;
  className?: string;
}

/**
 * Kop Surat Resmi Pemerintah Kabupaten Morowali - Dinas Pertanian dan Ketahanan Pangan
 * Sesuai standar tata naskah dinas pemerintah daerah dengan logo resmi Kabupaten Morowali
 * dan garis pemisah ganda (double rule).
 */
export const KopSuratMorowali: React.FC<KopSuratMorowaliProps> = ({
  documentTitle,
  documentSubtitle,
  nomorRegistrasi,
  compact = false,
  className = '',
}) => {
  return (
    <div className={`w-full bg-white select-none ${className}`}>
      {/* Kop Header Row */}
      <div className="flex items-center justify-between gap-3 sm:gap-5 pb-3">
        {/* Logo Kabupaten Morowali */}
        <div className="shrink-0 flex items-center justify-center pl-1 sm:pl-2">
          <LogoKabupatenMorowali size={compact ? 56 : 72} />
        </div>

        {/* Teks Lembaga & Alamat Resmi */}
        <div className="flex-1 text-center px-1">
          <h2 className={`font-bold tracking-wider uppercase text-slate-800 ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>
            PEMERINTAH KABUPATEN MOROWALI
          </h2>
          <h1 className={`font-black tracking-wide uppercase text-slate-950 font-sans ${compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}>
            DINAS PERTANIAN DAERAH
          </h1>
          <p className={`text-slate-600 font-sans leading-tight mt-0.5 ${compact ? 'text-[10px] sm:text-[11px]' : 'text-[11px] sm:text-xs'}`}>
            Kompleks Perkantoran Fonuasingko, Kec. Bungku Tengah, Kab. Morowali, Sulawesi Tengah 94973
          </p>
          <p className={`text-slate-500 font-sans italic ${compact ? 'text-[9.5px]' : 'text-[10px] sm:text-[10.5px]'}`}>
            Laman: <span className="font-semibold text-slate-700">www.morowalikab.go.id</span> • Pos-el: <span className="font-semibold text-slate-700">pertanian@morowalikab.go.id</span> • SIPADI Digital
          </p>
        </div>

        {/* Spacer / QR Placeholder to keep center alignment balanced */}
        <div className="shrink-0 w-12 sm:w-16 hidden sm:flex items-center justify-end text-right pr-2">
          <span className="text-[9px] font-mono font-bold text-emerald-800 uppercase px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">
            SIPADI
          </span>
        </div>
      </div>

      {/* Garis Pembatas Ganda Kop Surat Resmi Dinas (Thick line + Thin line) */}
      <div className="w-full space-y-[2px] mb-3">
        <div className="w-full h-[2.5px] bg-slate-900"></div>
        <div className="w-full h-[0.75px] bg-slate-900"></div>
      </div>

      {/* Optional Document Title Bar below Kop */}
      {documentTitle && (
        <div className="text-center pt-1 pb-2">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-900 underline underline-offset-4 decoration-slate-800">
            {documentTitle}
          </h3>
          {nomorRegistrasi && (
            <p className="text-[11px] font-mono text-slate-600 mt-1">
              Nomor: <span className="font-bold text-slate-800">{nomorRegistrasi}</span>
            </p>
          )}
          {documentSubtitle && (
            <p className="text-[10px] text-slate-500 italic mt-0.5">
              {documentSubtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
