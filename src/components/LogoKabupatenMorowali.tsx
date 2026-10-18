/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoKabupatenMorowaliProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

/**
 * Lambang Resmi Pemerintah Kabupaten Morowali (Sulawesi Tengah)
 * Sesuai foto lambang resmi:
 * - Bentuk perisai dengan 3 lekukan atas, garis tepi merah dan kuning emas
 * - Kotak putih atas bertuliskan "KABUPATEN MOROWALI" warna merah
 * - Latar perisai terbagi vertikal: Kiri Hijau, Kanan Biru Tua
 * - Lingkaran putih tengah: Bintang Emas, Pohon Kelapa, Rumah Adat Khas Morowali
 * - Untaian Padi (kiri) dan Kapas (kanan)
 * - Pita putih di bawah bertuliskan "TEPE ASA MOROSO"
 */
export const LogoKabupatenMorowali: React.FC<LogoKabupatenMorowaliProps> = ({
  className = '',
  size = 64,
  showText = false,
}) => {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={Math.round(size * 1.18)}
        viewBox="0 0 200 236"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm shrink-0"
        aria-label="Lambang Resmi Kabupaten Morowali"
      >
        <defs>
          {/* Clip path for the shield body */}
          <clipPath id="shieldInnerClip">
            <path d="M 100 18 
                     C 130 18, 142 8, 160 8 
                     C 178 8, 185 24, 185 45 
                     C 185 130, 166 182, 100 224 
                     C 34 182, 15 130, 15 45 
                     C 15 24, 22 8, 40 8 
                     C 58 8, 70 18, 100 18 Z" />
          </clipPath>
        </defs>

        {/* 1. Outer Border Yellow Gold */}
        <path
          d="M 100 12 
             C 130 12, 144 2, 162 2 
             C 182 2, 192 18, 192 44 
             C 192 136, 172 190, 100 234 
             C 28 190, 8 136, 8 44 
             C 8 18, 18 2, 38 2 
             C 56 2, 70 12, 100 12 Z"
          fill="#facc15"
          stroke="#ca8a04"
          strokeWidth="1.5"
        />

        {/* 2. Middle Border Red Line */}
        <path
          d="M 100 15 
             C 130 15, 143 5, 161 5 
             C 180 5, 188 20, 188 44 
             C 188 133, 169 186, 100 229 
             C 31 186, 12 133, 12 44 
             C 12 20, 20 5, 39 5 
             C 57 5, 70 15, 100 15 Z"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2.5"
        />

        {/* 3. Inner Yellow Border Line */}
        <path
          d="M 100 18 
             C 130 18, 142 8, 160 8 
             C 178 8, 185 24, 185 45 
             C 185 130, 166 182, 100 224 
             C 34 182, 15 130, 15 45 
             C 15 24, 22 8, 40 8 
             C 58 8, 70 18, 100 18 Z"
          fill="#fef08a"
          stroke="#eab308"
          strokeWidth="2"
        />

        {/* 4. Split Shield Background (Left Green, Right Deep Blue) */}
        <g clipPath="url(#shieldInnerClip)">
          {/* Left Side: Green */}
          <rect x="0" y="0" width="100" height="236" fill="#009647" />
          {/* Right Side: Deep Navy Blue */}
          <rect x="100" y="0" width="100" height="236" fill="#1f2474" />
        </g>

        {/* 5. Top Banner: White rectangle with red border & red text "KABUPATEN MOROWALI" */}
        <g id="topBanner">
          <rect
            x="24"
            y="32"
            width="152"
            height="21"
            rx="2"
            fill="#ffffff"
            stroke="#ea580c"
            strokeWidth="1.8"
          />
          <text
            x="100"
            y="47.5"
            textAnchor="middle"
            fill="#b91c1c"
            fontSize="10.5"
            fontWeight="900"
            fontFamily="'Times New Roman', Times, serif"
            letterSpacing="1.2"
          >
            KABUPATEN MOROWALI
          </text>
        </g>

        {/* 6. Center White Circle */}
        <circle
          cx="100"
          cy="128"
          r="54"
          fill="#ffffff"
          stroke="#1e293b"
          strokeWidth="1.2"
        />

        {/* 7. Star at the top of the center circle (Yellow Bintang Emas) */}
        <g transform="translate(100, 84) scale(0.65)">
          <polygon
            points="0,-16 4.9,-4.9 16.8,-4.9 7.3,2.4 10.9,14 0,7.3 -10.9,14 -7.3,2.4 -16.8,-4.9 -4.9,-4.9"
            fill="#facc15"
            stroke="#ca8a04"
            strokeWidth="1.2"
          />
        </g>

        {/* 8. Pohon Kelapa (Di belakang rumah adat) */}
        <g id="pohonKelapa" transform="translate(100, 94)">
          {/* Batang Pohon */}
          <path d="M -3 10 C -3 20, -4 30, -5 40 L 5 40 C 4 30, 3 20, 3 10 Z" fill="#854d0e" />
          {/* Pelepah Kelapa Kiri */}
          <path d="M 0 10 C -12 6, -20 12, -26 20 C -22 17, -12 14, 0 10" fill="#15803d" stroke="#14532d" strokeWidth="0.5" />
          <path d="M 0 10 C -15 2, -22 6, -28 14 C -22 11, -12 8, 0 10" fill="#16a34a" stroke="#14532d" strokeWidth="0.5" />
          {/* Pelepah Kelapa Atas */}
          <path d="M -2 10 C -6 -4, -3 -12, 0 -16 C 3 -12, 6 -4, 2 10 Z" fill="#15803d" stroke="#14532d" strokeWidth="0.5" />
          {/* Pelepah Kelapa Kanan */}
          <path d="M 0 10 C 12 6, 20 12, 26 20 C 22 17, 12 14, 0 10" fill="#15803d" stroke="#14532d" strokeWidth="0.5" />
          <path d="M 0 10 C 15 2, 22 6, 28 14 C 22 11, 12 8, 0 10" fill="#16a34a" stroke="#14532d" strokeWidth="0.5" />
        </g>

        {/* 9. Rumah Adat Khas Morowali di Atas Perahu / Tiang Penyangga */}
        <g id="rumahAdatMorowali" transform="translate(100, 134)">
          {/* Perahu / Dasar Fondasi Hitam */}
          <path
            d="M -38 18 
               C -25 24, 25 24, 38 18 
               L 34 13 
               C 20 16, -20 16, -34 13 Z"
            fill="#1e1e24"
            stroke="#0f172a"
            strokeWidth="0.8"
          />

          {/* Deretan Tiang-Tiang Penyangga Rumah Adat (Pillar) */}
          <g stroke="#0f172a" strokeWidth="1.5">
            <line x1="-30" y1="14" x2="-30" y2="3" />
            <line x1="-24" y1="15" x2="-24" y2="3" />
            <line x1="-18" y1="15.5" x2="-18" y2="3" />
            <line x1="-12" y1="16" x2="-12" y2="3" />
            <line x1="-6" y1="16" x2="-6" y2="3" />
            <line x1="0" y1="16" x2="0" y2="3" />
            <line x1="6" y1="16" x2="6" y2="3" />
            <line x1="12" y1="16" x2="12" y2="3" />
            <line x1="18" y1="15.5" x2="18" y2="3" />
            <line x1="24" y1="15" x2="24" y2="3" />
            <line x1="30" y1="14" x2="30" y2="3" />
          </g>

          {/* Palang Lantai Rumah */}
          <rect x="-35" y="1" width="70" height="3" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />

          {/* Dinding Utama Bergaris: Kuning, Merah (Tengah), Kuning */}
          {/* Bagian Kiri Kuning */}
          <rect x="-31" y="-12" width="16" height="13" fill="#facc15" stroke="#0f172a" strokeWidth="0.8" />
          <line x1="-23" y1="-12" x2="-23" y2="1" stroke="#0f172a" strokeWidth="0.8" />
          {/* Bagian Tengah Merah */}
          <rect x="-15" y="-14" width="30" height="15" fill="#dc2626" stroke="#0f172a" strokeWidth="0.8" />
          <line x1="-5" y1="-14" x2="-5" y2="1" stroke="#0f172a" strokeWidth="0.8" />
          <line x1="5" y1="-14" x2="5" y2="1" stroke="#0f172a" strokeWidth="0.8" />
          {/* Bagian Kanan Kuning */}
          <rect x="15" y="-12" width="16" height="13" fill="#facc15" stroke="#0f172a" strokeWidth="0.8" />
          <line x1="23" y1="-12" x2="23" y2="1" stroke="#0f172a" strokeWidth="0.8" />

          {/* Atap Rumah Adat Segitiga Bertingkat dengan Tanduk/Mahkota Khas */}
          {/* Sayap Atap Hitam */}
          <polygon points="-38,-4 -36,-13 -22,-13" fill="#1e1e24" stroke="#0f172a" strokeWidth="0.8" />
          <polygon points="38,-4 36,-13 22,-13" fill="#1e1e24" stroke="#0f172a" strokeWidth="0.8" />

          {/* Atap Segitiga Kiri */}
          <path d="M -34 -12 L -18 -26 L -2 -14 Z" fill="#991b1b" stroke="#0f172a" strokeWidth="1" />
          {/* Atap Segitiga Kanan */}
          <path d="M 34 -12 L 18 -26 L 2 -14 Z" fill="#991b1b" stroke="#0f172a" strokeWidth="1" />
          {/* Atap Segitiga Tengah / Bubungan */}
          <path d="M -18 -24 L 0 -13 L 18 -24 Z" fill="#b91c1c" stroke="#0f172a" strokeWidth="1" />

          {/* Hiasan Puncak Atap (Ornamen Tanduk Silang) */}
          <path d="M -20 -28 L -16 -23 M -16 -28 L -20 -23" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 20 -28 L 16 -23 M 16 -28 L 20 -23" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* 10. Untaian Padi (Kiri - Kuning Emas) */}
        <g id="padi" stroke="#a16207" fill="#facc15" strokeWidth="0.7">
          <ellipse cx="64" cy="78" rx="4.5" ry="6.5" transform="rotate(-40 64 78)" />
          <ellipse cx="54" cy="90" rx="4.5" ry="6.5" transform="rotate(-30 54 90)" />
          <ellipse cx="46" cy="104" rx="4.5" ry="6.5" transform="rotate(-20 46 104)" />
          <ellipse cx="41" cy="120" rx="4.5" ry="6.5" transform="rotate(-5 41 120)" />
          <ellipse cx="40" cy="136" rx="4.5" ry="6.5" transform="rotate(10 40 136)" />
          <ellipse cx="43" cy="152" rx="4.5" ry="6.5" transform="rotate(25 43 152)" />
          <ellipse cx="50" cy="167" rx="4.5" ry="6.5" transform="rotate(40 50 167)" />
          <ellipse cx="60" cy="180" rx="4.5" ry="6.5" transform="rotate(55 60 180)" />
          <ellipse cx="73" cy="190" rx="4.5" ry="6.5" transform="rotate(70 73 190)" />

          {/* Baris bulir bagian dalam */}
          <ellipse cx="72" cy="88" rx="4" ry="6" transform="rotate(-35 72 88)" />
          <ellipse cx="63" cy="100" rx="4" ry="6" transform="rotate(-25 63 100)" />
          <ellipse cx="55" cy="114" rx="4" ry="6" transform="rotate(-10 55 114)" />
          <ellipse cx="51" cy="130" rx="4" ry="6" transform="rotate(5 51 130)" />
          <ellipse cx="51" cy="146" rx="4" ry="6" transform="rotate(20 51 146)" />
          <ellipse cx="56" cy="161" rx="4" ry="6" transform="rotate(35 56 161)" />
          <ellipse cx="65" cy="174" rx="4" ry="6" transform="rotate(50 65 174)" />

          {/* Batang Padi */}
          <path d="M 64 78 C 30 115, 38 175, 78 196" fill="none" stroke="#a16207" strokeWidth="1.8" />
        </g>

        {/* 11. Untaian Kapas (Kanan - Putih dan Kelopak Hijau) */}
        <g id="kapas" transform="translate(200, 0) scale(-1, 1)">
          {/* Batang Kapas */}
          <path d="M 64 78 C 30 115, 38 175, 78 196" fill="none" stroke="#16a34a" strokeWidth="1.8" />
          
          {/* Kuntum-kuntum Kapas Putih Bersih */}
          {[
            { x: 62, y: 82 },
            { x: 50, y: 96 },
            { x: 42, y: 112 },
            { x: 39, y: 130 },
            { x: 41, y: 148 },
            { x: 48, y: 165 },
            { x: 60, y: 180 },
            { x: 74, y: 191 },
          ].map((pt, i) => (
            <g key={i} transform={`translate(${pt.x}, ${pt.y})`}>
              {/* Kelopak Bunga Hijau */}
              <path d="M -6 4 Q 0 8, 6 4 L 4 0 L -4 0 Z" fill="#15803d" stroke="#14532d" strokeWidth="0.6" />
              {/* Kuntum Kapas Putih Bulat */}
              <circle cx="0" cy="0" r="5.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.8" />
              <circle cx="-2.5" cy="-1.5" r="3" fill="#f8fafc" />
              <circle cx="2.5" cy="-1.5" r="3" fill="#f8fafc" />
            </g>
          ))}
        </g>

        {/* 12. Pita Bawah Bertuliskan "TEPE ASA MOROSO" */}
        <g id="bottomRibbon" transform="translate(100, 198)">
          {/* Pita Putih Lengkung */}
          <path
            d="M -72 0 
               Q 0 8, 72 0 
               L 66 14 
               Q 0 20, -66 14 Z"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="1.2"
          />
          {/* Ujung Pita Kiri */}
          <path d="M -72 0 L -80 6 L -66 14 L -72 0 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="1" />
          {/* Ujung Pita Kanan */}
          <path d="M 72 0 L 80 6 L 66 14 L 72 0 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="1" />

          {/* Tulisan Semboyan TEPE ASA MOROSO */}
          <text
            x="0"
            y="11.5"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="8"
            fontWeight="900"
            fontFamily="'Times New Roman', Times, serif"
            letterSpacing="0.9"
          >
            TEPE ASA MOROSO
          </text>
        </g>
      </svg>

      {showText && (
        <div className="text-center mt-1">
          <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
            Kabupaten Morowali
          </span>
          <span className="block text-[9px] font-semibold text-emerald-800 tracking-tight">
            Tepe Asa Moroso
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Pure SVG string of Lambang Kabupaten Morowali for canvas rendering inside QR Codes
 */
export const MOROWALI_LOGO_SVG = `<svg viewBox="0 0 200 236" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="shieldInnerClip">
      <path d="M 100 18 C 130 18, 142 8, 160 8 C 178 8, 185 24, 185 45 C 185 130, 166 182, 100 224 C 34 182, 15 130, 15 45 C 15 24, 22 8, 40 8 C 58 8, 70 18, 100 18 Z" />
    </clipPath>
  </defs>
  <path d="M 100 12 C 130 12, 144 2, 162 2 C 182 2, 192 18, 192 44 C 192 136, 172 190, 100 234 C 28 190, 8 136, 8 44 C 8 18, 18 2, 38 2 C 56 2, 70 12, 100 12 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
  <path d="M 100 15 C 130 15, 143 5, 161 5 C 180 5, 188 20, 188 44 C 188 133, 169 186, 100 229 C 31 186, 12 133, 12 44 C 12 20, 20 5, 39 5 C 57 5, 70 15, 100 15 Z" fill="none" stroke="#dc2626" stroke-width="2.5" />
  <path d="M 100 18 C 130 18, 142 8, 160 8 C 178 8, 185 24, 185 45 C 185 130, 166 182, 100 224 C 34 182, 15 130, 15 45 C 15 24, 22 8, 40 8 C 58 8, 70 18, 100 18 Z" fill="#fef08a" stroke="#eab308" stroke-width="2" />
  <g clip-path="url(#shieldInnerClip)">
    <rect x="0" y="0" width="100" height="236" fill="#009647" />
    <rect x="100" y="0" width="100" height="236" fill="#1f2474" />
  </g>
  <rect x="24" y="32" width="152" height="21" rx="2" fill="#ffffff" stroke="#ea580c" stroke-width="1.8" />
  <text x="100" y="47.5" text-anchor="middle" fill="#b91c1c" font-size="10.5" font-weight="900" font-family="'Times New Roman', serif" letter-spacing="1.2">KABUPATEN MOROWALI</text>
  <circle cx="100" cy="128" r="54" fill="#ffffff" stroke="#1e293b" stroke-width="1.2" />
  <g transform="translate(100, 84) scale(0.65)">
    <polygon points="0,-16 4.9,-4.9 16.8,-4.9 7.3,2.4 10.9,14 0,7.3 -10.9,14 -7.3,2.4 -16.8,-4.9 -4.9,-4.9" fill="#facc15" stroke="#ca8a04" stroke-width="1.2" />
  </g>
  <g transform="translate(100, 94)">
    <path d="M -3 10 C -3 20, -4 30, -5 40 L 5 40 C 4 30, 3 20, 3 10 Z" fill="#854d0e" />
    <path d="M 0 10 C -12 6, -20 12, -26 20 C -22 17, -12 14, 0 10" fill="#15803d" stroke="#14532d" stroke-width="0.5" />
    <path d="M 0 10 C -15 2, -22 6, -28 14 C -22 11, -12 8, 0 10" fill="#16a34a" stroke="#14532d" stroke-width="0.5" />
    <path d="M -2 10 C -6 -4, -3 -12, 0 -16 C 3 -12, 6 -4, 2 10 Z" fill="#15803d" stroke="#14532d" stroke-width="0.5" />
    <path d="M 0 10 C 12 6, 20 12, 26 20 C 22 17, 12 14, 0 10" fill="#15803d" stroke="#14532d" stroke-width="0.5" />
    <path d="M 0 10 C 15 2, 22 6, 28 14 C 22 11, 12 8, 0 10" fill="#16a34a" stroke="#14532d" stroke-width="0.5" />
  </g>
  <g transform="translate(100, 134)">
    <path d="M -38 18 C -25 24, 25 24, 38 18 L 34 13 C 20 16, -20 16, -34 13 Z" fill="#1e1e24" stroke="#0f172a" stroke-width="0.8" />
    <g stroke="#0f172a" stroke-width="1.5">
      <line x1="-30" y1="14" x2="-30" y2="3" />
      <line x1="-24" y1="15" x2="-24" y2="3" />
      <line x1="-18" y1="15.5" x2="-18" y2="3" />
      <line x1="-12" y1="16" x2="-12" y2="3" />
      <line x1="-6" y1="16" x2="-6" y2="3" />
      <line x1="0" y1="16" x2="0" y2="3" />
      <line x1="6" y1="16" x2="6" y2="3" />
      <line x1="12" y1="16" x2="12" y2="3" />
      <line x1="18" y1="15.5" x2="18" y2="3" />
      <line x1="24" y1="15" x2="24" y2="3" />
      <line x1="30" y1="14" x2="30" y2="3" />
    </g>
    <rect x="-35" y="1" width="70" height="3" fill="#ffffff" stroke="#0f172a" stroke-width="0.8" />
    <rect x="-31" y="-12" width="16" height="13" fill="#facc15" stroke="#0f172a" stroke-width="0.8" />
    <line x1="-23" y1="-12" x2="-23" y2="1" stroke="#0f172a" stroke-width="0.8" />
    <rect x="-15" y="-14" width="30" height="15" fill="#dc2626" stroke="#0f172a" stroke-width="0.8" />
    <line x1="-5" y1="-14" x2="-5" y2="1" stroke="#0f172a" stroke-width="0.8" />
    <line x1="5" y1="-14" x2="5" y2="1" stroke="#0f172a" stroke-width="0.8" />
    <rect x="15" y="-12" width="16" height="13" fill="#facc15" stroke="#0f172a" stroke-width="0.8" />
    <line x1="23" y1="-12" x2="23" y2="1" stroke="#0f172a" stroke-width="0.8" />
    <polygon points="-38,-4 -36,-13 -22,-13" fill="#1e1e24" stroke="#0f172a" stroke-width="0.8" />
    <polygon points="38,-4 36,-13 22,-13" fill="#1e1e24" stroke="#0f172a" stroke-width="0.8" />
    <path d="M -34 -12 L -18 -26 L -2 -14 Z" fill="#991b1b" stroke="#0f172a" stroke-width="1" />
    <path d="M 34 -12 L 18 -26 L 2 -14 Z" fill="#991b1b" stroke="#0f172a" stroke-width="1" />
    <path d="M -18 -24 L 0 -13 L 18 -24 Z" fill="#b91c1c" stroke="#0f172a" stroke-width="1" />
    <path d="M -20 -28 L -16 -23 M -16 -28 L -20 -23" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />
    <path d="M 20 -28 L 16 -23 M 16 -28 L 20 -23" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />
  </g>
  <g stroke="#a16207" fill="#facc15" stroke-width="0.7">
    <ellipse cx="64" cy="78" rx="4.5" ry="6.5" transform="rotate(-40 64 78)" />
    <ellipse cx="54" cy="90" rx="4.5" ry="6.5" transform="rotate(-30 54 90)" />
    <ellipse cx="46" cy="104" rx="4.5" ry="6.5" transform="rotate(-20 46 104)" />
    <ellipse cx="41" cy="120" rx="4.5" ry="6.5" transform="rotate(-5 41 120)" />
    <ellipse cx="40" cy="136" rx="4.5" ry="6.5" transform="rotate(10 40 136)" />
    <ellipse cx="43" cy="152" rx="4.5" ry="6.5" transform="rotate(25 43 152)" />
    <ellipse cx="50" cy="167" rx="4.5" ry="6.5" transform="rotate(40 50 167)" />
    <ellipse cx="60" cy="180" rx="4.5" ry="6.5" transform="rotate(55 60 180)" />
    <ellipse cx="73" cy="190" rx="4.5" ry="6.5" transform="rotate(70 73 190)" />
    <ellipse cx="72" cy="88" rx="4" ry="6" transform="rotate(-35 72 88)" />
    <ellipse cx="63" cy="100" rx="4" ry="6" transform="rotate(-25 63 100)" />
    <ellipse cx="55" cy="114" rx="4" ry="6" transform="rotate(-10 55 114)" />
    <ellipse cx="51" cy="130" rx="4" ry="6" transform="rotate(5 51 130)" />
    <ellipse cx="51" cy="146" rx="4" ry="6" transform="rotate(20 51 146)" />
    <ellipse cx="56" cy="161" rx="4" ry="6" transform="rotate(35 56 161)" />
    <ellipse cx="65" cy="174" rx="4" ry="6" transform="rotate(50 65 174)" />
    <path d="M 64 78 C 30 115, 38 175, 78 196" fill="none" stroke="#a16207" stroke-width="1.8" />
  </g>
  <g transform="translate(200, 0) scale(-1, 1)">
    <path d="M 64 78 C 30 115, 38 175, 78 196" fill="none" stroke="#16a34a" stroke-width="1.8" />
    <g transform="translate(62, 82)"><path d="M -6 4 Q 0 8, 6 4 L 4 0 L -4 0 Z" fill="#15803d" stroke="#14532d" stroke-width="0.6" /><circle cx="0" cy="0" r="5.5" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8" /></g>
    <g transform="translate(50, 96)"><path d="M -6 4 Q 0 8, 6 4 L 4 0 L -4 0 Z" fill="#15803d" stroke="#14532d" stroke-width="0.6" /><circle cx="0" cy="0" r="5.5" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8" /></g>
    <g transform="translate(42, 112)"><path d="M -6 4 Q 0 8, 6 4 L 4 0 L -4 0 Z" fill="#15803d" stroke="#14532d" stroke-width="0.6" /><circle cx="0" cy="0" r="5.5" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8" /></g>
    <g transform="translate(39, 130)"><path d="M -6 4 Q 0 8, 6 4 L 4 0 L -4 0 Z" fill="#15803d" stroke="#14532d" stroke-width="0.6" /><circle cx="0" cy="0" r="5.5" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8" /></g>
    <g transform="translate(41, 148)"><path d="M -6 4 Q 0 8, 6 4 L 4 0 L -4 0 Z" fill="#15803d" stroke="#14532d" stroke-width="0.6" /><circle cx="0" cy="0" r="5.5" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8" /></g>
    <g transform="translate(48, 165)"><path d="M -6 4 Q 0 8, 6 4 L 4 0 L -4 0 Z" fill="#15803d" stroke="#14532d" stroke-width="0.6" /><circle cx="0" cy="0" r="5.5" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8" /></g>
    <g transform="translate(60, 180)"><path d="M -6 4 Q 0 8, 6 4 L 4 0 L -4 0 Z" fill="#15803d" stroke="#14532d" stroke-width="0.6" /><circle cx="0" cy="0" r="5.5" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8" /></g>
    <g transform="translate(74, 191)"><path d="M -6 4 Q 0 8, 6 4 L 4 0 L -4 0 Z" fill="#15803d" stroke="#14532d" stroke-width="0.6" /><circle cx="0" cy="0" r="5.5" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8" /></g>
  </g>
  <g transform="translate(100, 198)">
    <path d="M -72 0 Q 0 8, 72 0 L 66 14 Q 0 20, -66 14 Z" fill="#ffffff" stroke="#1e293b" stroke-width="1.2" />
    <path d="M -72 0 L -80 6 L -66 14 L -72 0 Z" fill="#e2e8f0" stroke="#1e293b" stroke-width="1" />
    <path d="M 72 0 L 80 6 L 66 14 L 72 0 Z" fill="#e2e8f0" stroke="#1e293b" stroke-width="1" />
    <text x="0" y="11.5" text-anchor="middle" fill="#0f172a" font-size="8" font-weight="900" font-family="'Times New Roman', serif" letter-spacing="0.9">TEPE ASA MOROSO</text>
  </g>
</svg>`;

export const MOROWALI_LOGO_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(MOROWALI_LOGO_SVG)}`;
