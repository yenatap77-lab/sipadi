/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import QRCode from 'qrcode';
import { ArsipItem, ProposalItem, PBJLangsungItem, PBJEPurchasingItem } from '../types';
import { MOROWALI_LOGO_DATA_URL } from '../components/LogoKabupatenMorowali';

/**
 * Generate a high-resolution Data URL (PNG) from text string with embedded Logo Kabupaten Morowali.
 * Menggunakan Error Correction Level H (30%) sehingga lambang resmi Kabupaten Morowali
 * dapat terpasang di tengah kode QR tanpa mengorbankan keterbacaan pemindai scanner.
 */
export async function generateQRCodeDataURL(
  text: string,
  options?: {
    width?: number;
    margin?: number;
    darkColor?: string;
    lightColor?: string;
    embedMorowaliLogo?: boolean;
  }
): Promise<string> {
  const width = options?.width || 380;
  const margin = options?.margin !== undefined ? options?.margin : 1;
  const darkColor = options?.darkColor || '#0a2312'; // deep green dark color
  const lightColor = options?.lightColor || '#ffffff';
  const embedLogo = options?.embedMorowaliLogo !== false;

  try {
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = width;

      // 1. Render QR Code dasar dengan redundansi tinggi (Level H)
      await QRCode.toCanvas(canvas, text, {
        width,
        margin,
        color: {
          dark: darkColor,
          light: lightColor,
        },
        errorCorrectionLevel: 'H',
      });

      // 2. Sematkan Lambang Resmi Kabupaten Morowali di tengah QR Code
      if (embedLogo) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';

          img.onload = () => {
            try {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                // Proporsi logo sekitar 24% dari lebar QR
                const logoW = Math.round(width * 0.23);
                const logoH = Math.round(logoW * 1.18);
                const x = Math.round((width - logoW) / 2);
                const y = Math.round((width - logoH) / 2);
                const pad = Math.round(width * 0.016);

                ctx.save();

                // Latar pelindung putih rounded rect
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 6;
                ctx.shadowOffsetY = 1;

                const r = 8;
                ctx.beginPath();
                if (typeof (ctx as any).roundRect === 'function') {
                  (ctx as any).roundRect(
                    x - pad,
                    y - pad,
                    logoW + pad * 2,
                    logoH + pad * 2,
                    [r]
                  );
                } else {
                  ctx.rect(x - pad, y - pad, logoW + pad * 2, logoH + pad * 2);
                }
                ctx.fill();

                // Garis bingkai ganda Kuning Emas & Merah khas lambang Morowali
                ctx.shadowBlur = 0;
                ctx.shadowColor = 'transparent';
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#eab308'; // Kuning Emas
                ctx.stroke();

                // Gambar Logo Morowali Resmi di tengah
                ctx.drawImage(img, x, y, logoW, logoH);
                ctx.restore();
              }
            } catch (drawErr) {
              console.warn('Canvas draw Morowali logo warning:', drawErr);
            }
            resolve();
          };

          img.onerror = () => {
            console.warn('Gagal memuat image Morowali SVG pada canvas QR');
            resolve();
          };

          img.src = MOROWALI_LOGO_DATA_URL;
        });
      }

      return canvas.toDataURL('image/png');
    }

    // Fallback jika di lingkungan SSR tanpa DOM
    return await QRCode.toDataURL(text, {
      width,
      margin,
      color: { dark: darkColor, light: lightColor },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('Error generating QR code with Morowali logo:', err);
    return '';
  }
}

/**
 * Formats official verification string payload for Arsip
 * Instansi: DINAS PERTANIAN DAERAH KABUPATEN MOROWALI
 */
export function createArchiveQRPayload(item: ArsipItem): string {
  const time = item.createdAt ? new Date(item.createdAt).toLocaleString('id-ID') : new Date().toLocaleString('id-ID');
  return [
    `[SIPADI - DINAS PERTANIAN DAERAH KABUPATEN MOROWALI]`,
    `Instansi: DINAS PERTANIAN DAERAH KABUPATEN MOROWALI`,
    `ID Dokumen: ${item.id}`,
    `No. Surat: ${item.nomorSurat}`,
    `Perihal / Judul: ${item.title}`,
    `Bidang: ${item.bidang.toUpperCase()}`,
    `Sub-Kategori: ${item.subKategori}`,
    `Tgl Surat: ${item.tanggalSurat}`,
    `Pengunggah: ${item.uploaderName} (${item.uploaderRole})`,
    `Folder Drive: ${item.driveFolder}`,
    `Waktu Rekam: ${time} WITA`,
    `Status: TERVERIFIKASI SAH SISTEM DIGITAL DINAS PERTANIAN DAERAH KAB. MOROWALI`,
    `Verifikasi Laman: https://morowalikab.go.id/sipadi/verifikasi?id=${encodeURIComponent(item.id)}`,
  ].join('\n');
}

/**
 * Formats official verification string payload for Proposal
 * Instansi: DINAS PERTANIAN DAERAH KABUPATEN MOROWALI
 */
export function createProposalQRPayload(item: ProposalItem): string {
  const time = item.createdAt ? new Date(item.createdAt).toLocaleString('id-ID') : new Date().toLocaleString('id-ID');
  return [
    `[SIPADI - DINAS PERTANIAN DAERAH KABUPATEN MOROWALI]`,
    `Instansi: DINAS PERTANIAN DAERAH KABUPATEN MOROWALI`,
    `ID Registrasi: ${item.id}`,
    `Bidang: ${item.bidang.toUpperCase()}`,
    `Nama Usulan: ${item.namaUsulan}`,
    `Kelompok Tani: ${item.kelompokTani}`,
    `Ketua: ${item.ketua} (NIK: ${item.nik || '-'})`,
    `Lokasi Pertanian: Desa ${item.desa}, Kec. ${item.kecamatan}, Kab. Morowali`,
    `Volume Usulan: ${item.jumlahUsulan} | Luas Lahan: ${item.luasLahan} Ha`,
    `Status Proposal: ${item.status}`,
    `Waktu Rekam: ${time} WITA`,
    `Koordinat: ${item.titikKoordinat?.lat || '-'}, ${item.titikKoordinat?.lng || '-'}`,
    `Status: TERDAFTAR DI SIPADI DINAS PERTANIAN DAERAH KAB. MOROWALI`,
    `Verifikasi Laman: https://morowalikab.go.id/sipadi/proposal?id=${encodeURIComponent(item.id)}`,
  ].join('\n');
}

/**
 * Formats official verification string payload for PBJ
 * Instansi: DINAS PERTANIAN DAERAH KABUPATEN MOROWALI
 */
export function createPBJQRPayload(
  item: PBJLangsungItem | PBJEPurchasingItem,
  type: 'pl' | 'ep'
): string {
  const tipeName = type === 'pl' ? 'Pengadaan Langsung' : 'E-Purchasing';
  const time = item.createdAt ? new Date(item.createdAt).toLocaleString('id-ID') : new Date().toLocaleString('id-ID');
  return [
    `[SIPADI - DINAS PERTANIAN DAERAH KABUPATEN MOROWALI]`,
    `Instansi: DINAS PERTANIAN DAERAH KABUPATEN MOROWALI`,
    `ID Paket: ${item.id}`,
    `Metode: ${tipeName.toUpperCase()}`,
    `No. Kontrak: ${item.noKontrak}`,
    `Uraian Kegiatan: ${item.uraianKegiatan}`,
    `Penyedia Jasa: ${item.penyedia}`,
    `Masa Kontrak: ${item.masaKontrak}`,
    `Status: ${item.status}`,
    `Waktu Rekam: ${time} WITA`,
    `Wilayah: Kabupaten Morowali, Sulawesi Tengah`,
    `Status: TERDATA DI SIPADI DINAS PERTANIAN DAERAH KAB. MOROWALI`,
    `Verifikasi Laman: https://morowalikab.go.id/sipadi/pbj?id=${encodeURIComponent(item.id)}`,
  ].join('\n');
}

/**
 * Formats official verification string payload for Data Teknis
 * Instansi: DINAS PERTANIAN DAERAH KABUPATEN MOROWALI
 */
export function createTeknisQRPayload(item: any, typeName: string): string {
  const time = item.createdAt ? new Date(item.createdAt).toLocaleString('id-ID') : new Date().toLocaleString('id-ID');
  return [
    `[SIPADI - DINAS PERTANIAN DAERAH KABUPATEN MOROWALI]`,
    `Instansi: DINAS PERTANIAN DAERAH KABUPATEN MOROWALI`,
    `ID Data Teknis: ${item.id || 'TEKNIS-' + Date.now()}`,
    `Kategori: ${typeName}`,
    `Wilayah: Desa ${item.desa || '-'}, Kec. ${item.kecamatan || '-'}, Kab. Morowali`,
    `Waktu Rekam: ${time} WITA`,
    `Status: TERCATAT RESMI SIPADI DINAS PERTANIAN DAERAH KAB. MOROWALI`,
    `Verifikasi Laman: https://morowalikab.go.id/sipadi/teknis?id=${encodeURIComponent(item.id || '')}`,
  ].join('\n');
}

/**
 * Download QR Code image as PNG with Morowali logo embedded
 */
export function downloadQRCodeImage(dataUrl: string, fileName: string = 'KODE_QR_SIPADI_MOROWALI.png') {
  if (!dataUrl) return;
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
