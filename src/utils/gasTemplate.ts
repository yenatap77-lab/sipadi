/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const CODE_GS_SOURCE = `/**
 * =========================================================================
 * SIPADI - SISTEM INFORMASI PERTANIAN DAN ADMINISTRASI DIGITAL
 * SCRIPT GOOGLE APPS SCRIPT (Code.gs)
 * =========================================================================
 * 
 * PANDUAN PEMASANGAN (DEPLOYMENT GUIDE):
 * 1. Buka Google Spreadsheet baru di Google Drive Anda (misal: "Database SIPADI 2026").
 * 2. Klik menu "Ekstensi" (Extensions) -> "Apps Script".
 * 3. Hapus seluruh isi file Code.gs yang ada, lalu salin dan tempel (paste) seluruh kode ini.
 * 4. Jalankan fungsi "setupDatabase" sekali untuk membuat seluruh sheet tabel dan folder Drive otomatis.
 * 5. Klik tombol "Terapkan" (Deploy) di kanan atas -> "Kelola Penerapan" (New Deployment).
 * 6. Pilih jenis: "Aplikasi Web" (Web app).
 * 7. Pada bagian "Akses aplikasi" (Who has access), pilih: "Siapa saja" (Anyone).
 * 8. Klik "Terapkan" (Deploy) dan salin URL Aplikasi Web (Web App URL).
 * 9. Masukkan URL tersebut pada menu "Pengaturan" di aplikasi SIPADI.
 */

var ROOT_FOLDER_NAME = "SIPADI_ARSIP_PERTANIAN";

var BIDANG_FOLDERS = {
  "perencanaan": "Arsip_Perencanaan",
  "tph": "Arsip_TPH",
  "psp": "Arsip_PSP",
  "peternakan": "Arsip_Peternakan",
  "perkebunan": "Arsip_Perkebunan",
  "pbj": "Arsip_PBJ"
};

function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var rootFolder = getOrCreateRootFolder();
  for (var key in BIDANG_FOLDERS) {
    getOrCreateSubfolder(rootFolder, BIDANG_FOLDERS[key]);
  }
  
  var sheetsConfig = {
    "Arsip": [
      "ID Arsip", "Judul Arsip", "Nomor Surat", "Tanggal Surat", "Bidang", 
      "Sub Kategori", "Uraian Ringkas", "Nama File", "Ukuran File", "Drive File URL", 
      "Drive Folder", "Pengunggah", "Jabatan Pengunggah", "Waktu Unggah"
    ],
    "PBJ_PengadaanLangsung": [
      "ID PBJ", "Uraian Kegiatan", "Kode RUP", "Penyedia", "Penanggung Jawab", 
      "No HP", "Alamat Penyedia", "Nama Pelaksana", "No HP Pelaksana", "NPWP", 
      "Pagu Anggaran (Rp)", "HPS (Rp)", "Penawaran (Rp)", "Negosiasi (Rp)", "No Kontrak", 
      "Volume Pekerjaan", "Jenis Kontrak", "Masa Kontrak", "Nilai Kontrak (Rp)", 
      "Uang Muka (Rp)", "Berkas Uang Muka", "Sisa Kontrak (Rp)", "Sisa Pagu (Rp)", 
      "Pembayaran Fisik (Rp)", "Berkas BAP", "Retensi (Rp)", "Berkas Retensi", 
      "Status", "ID Usulan Terkait", "Waktu Input"
    ],
    "PBJ_EPurchasing": [
      "ID PBJ", "Uraian Kegiatan", "Kode RUP", "Penyedia", "Penanggung Jawab", 
      "No HP", "Alamat Penyedia", "NPWP", "Pagu Anggaran (Rp)", "HPS (Rp)", 
      "Penawaran (Rp)", "Negosiasi (Rp)", "No Kontrak", "Volume", "Jenis Kontrak", 
      "Masa Kontrak", "Nilai Pembayaran (Rp)", "Status", "Dokumen Pendukung", 
      "ID Usulan Terkait", "Waktu Input"
    ],
    "TPH_LTT_Produksi": [
      "ID", "Kecamatan", "Desa", "Komoditi", "Varietas", "Luas Baku (Ha)", 
      "Luas Tanam (Ha)", "Luas Panen (Ha)", "Luas Fuso (Ha)", "Provitas (Ku/Ha)", 
      "Produksi (Ton)", "Periode", "Petugas PPL", "Waktu Input"
    ],
    "TPH_KelompokTani": [
      "ID", "Kecamatan", "Desa", "Nama Kelompok Tani", "Komoditas", "Luas Lahan (Ha)", 
      "Luas Tanam (Ha)", "Luas Panen (Ha)", "Produksi (Ton)", "Musim Tanam", 
      "Sumber Data", "Titik Koordinat (Lat, Lng)", "Keterangan", "Waktu Input"
    ],
    "Peternakan_Populasi": [
      "ID", "Kecamatan", "Desa", "Jenis Ternak", "Populasi (Ekor)", "Jantan", 
      "Betina", "Umur Ternak", "Pemilik Ternak", "No HP / NIK", "Status Kandang", 
      "Titik Koordinat", "Waktu Input"
    ],
    "Perkebunan_Komoditi": [
      "ID", "Kecamatan", "Desa", "Kelompok Tani", "Ketua Kelompok", "Jenis Tanaman", 
      "Luas Lahan (Ha)", "Tanaman Menghasilkan", "Tanaman Belum Menghasilkan", 
      "Produksi (Ton)", "Titik Koordinat", "Waktu Input"
    ],
    "PSP_Alsintan_Irigasi": [
      "ID", "Jenis Data", "Nama Kegiatan", "Kecamatan", "Desa", "Kelompok Tani", 
      "Nama Ketua", "NIK / No HP", "Volume", "Jumlah Anggota", "Tahun", 
      "Kondisi", "Merek Alsintan", "Titik Koordinat", "Waktu Input"
    ],
    "Proposal_Masyarakat": [
      "ID Proposal", "Bidang", "Nama Usulan", "Kecamatan", "Desa", "Permohonan", 
      "Kelompok Tani", "Ketua", "NIK", "No HP", "Jumlah Usulan", "Jumlah Anggota", 
      "Luas Lahan (Ha)", "Titik Koordinat", "Status", "Terintegrasi PBJ", 
      "Tipe PBJ", "No Kontrak PBJ", "Tanggal Penyaluran", "Catatan Penyaluran", "Berkas URL", "Waktu Input"
    ],
    "Pengguna_Sistem": [
      "ID Pengguna", "Nama Lengkap", "Username", "Peran / Role", "Bidang Tugas", 
      "NIP", "No HP", "Email", "Status", "Waktu Dibuat"
    ]
  };
  
  for (var sheetName in sheetsConfig) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    var headers = sheetsConfig[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#1a472a");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    
    for (var i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }
  
  var defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }
  
  Logger.log("Setup Database SIPADI selesai!");
  return "Database SIPADI dan Folder Drive berhasil dikonfigurasi!";
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "ping";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === "ping") {
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "SIPADI Apps Script Endpoint aktif dan terhubung!",
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: "ok" })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var contents = e.postData.contents;
    var payload = JSON.parse(contents);
    var action = payload.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === "uploadFile") {
      var bidang = payload.bidang || "tph";
      var fileName = payload.fileName || "Dokumen_Arsip_" + new Date().getTime();
      var mimeType = payload.mimeType || "application/pdf";
      var base64Data = payload.base64Data;
      
      var targetFolder = getFolderForBidang(bidang);
      var decodedBytes = Utilities.base64Decode(base64Data.split(",")[1] || base64Data);
      var blob = Utilities.newBlob(decodedBytes, mimeType, fileName);
      var file = targetFolder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        fileId: file.getId(),
        fileName: file.getName(),
        fileSize: file.getSize(),
        viewUrl: file.getUrl(),
        downloadUrl: file.getDownloadUrl(),
        folderName: targetFolder.getName()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === "saveArsip") {
      var item = payload.data;
      var sheet = ss.getSheetByName("Arsip");
      sheet.appendRow([
        item.id, item.title, item.nomorSurat, item.tanggalSurat, item.bidang,
        item.subKategori, item.uraian, item.fileName, item.fileSize, item.driveUrl || "",
        item.driveFolder || "", item.uploaderName, item.uploaderRole, new Date().toISOString()
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Arsip tersimpan di Spreadsheet!" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Action tidak dikenal" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateRootFolder() {
  var folders = DriveApp.getFoldersByName(ROOT_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  var newFolder = DriveApp.createFolder(ROOT_FOLDER_NAME);
  return newFolder;
}

function getOrCreateSubfolder(parentFolder, subfolderName) {
  var folders = parentFolder.getFoldersByName(subfolderName);
  if (folders.hasNext()) return folders.next();
  return parentFolder.createFolder(subfolderName);
}

function getFolderForBidang(bidang) {
  var root = getOrCreateRootFolder();
  var subName = BIDANG_FOLDERS[bidang] || "Arsip_Umum";
  return getOrCreateSubfolder(root, subName);
}
`;
