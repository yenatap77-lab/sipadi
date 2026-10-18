/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Wheat,
  AlertCircle,
  Sparkles,
  Layers,
} from 'lucide-react';
import { LogoKabupatenMorowali } from './LogoKabupatenMorowali';
import { UserAccount } from '../types';

interface LoginScreenProps {
  users: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      setErrorMessage('Harap masukkan username Anda.');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Harap masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating for a smooth, realistic feedback
    setTimeout(() => {
      const foundUser = users.find(
        (u) => u.username.toLowerCase() === cleanUsername
      );

      if (!foundUser) {
        setIsLoading(false);
        setErrorMessage('Username atau kata sandi tidak cocok. Silakan periksa kembali.');
        return;
      }

      if (foundUser.status === 'Nonaktif') {
        setIsLoading(false);
        setErrorMessage('Akun ini berstatus nonaktif. Silakan hubungi Administrator.');
        return;
      }

      // Check password (default: admin123 for admin, 123456 for others)
      const expectedPassword = foundUser.password || (foundUser.username === 'admin' ? 'admin123' : '123456');

      if (cleanPassword !== expectedPassword) {
        setIsLoading(false);
        setErrorMessage('Kata sandi yang Anda masukkan salah. Silakan coba lagi.');
        return;
      }

      setIsLoading(false);
      onLoginSuccess(foundUser);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a1a0f] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Gambar Padi Persawahan Asri */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-40 mix-blend-screen filter brightness-90"
        style={{
          backgroundImage: `url('/src/assets/images/rice_field_panoramic_1792235985479.jpg')`,
        }}
      />
      {/* Dark gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f12]/90 via-[#0e2a18]/85 to-[#08150d]/95 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Decorative background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* App Logo & Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3.5">
            <div className="p-2 rounded-2xl bg-white/95 shadow-xl shadow-emerald-950/40 border border-white/40 ring-4 ring-emerald-500/20">
              <LogoKabupatenMorowali size={48} />
            </div>
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-emerald-500 shadow-xl shadow-emerald-950/40 border border-white/20 ring-4 ring-emerald-500/20">
              <Wheat className="h-9 w-9 text-slate-900" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <span>SIPADI DIGITAL</span>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full">
              v2.6
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 font-medium mt-1">
            Sistem Informasi Pertanian & Administrasi Digital
          </p>
          <p className="text-[11px] font-semibold text-amber-300/90 mt-0.5">
            DINAS PERTANIAN DAERAH KABUPATEN MOROWALI
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-6 sm:p-8 space-y-5 text-slate-800">
          
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LogIn className="h-4 w-4 text-emerald-700" />
              <span>Masuk ke Akun Anda</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Masukkan nama pengguna dan kata sandi untuk mengakses sistem.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Pengguna (Username) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Masukkan username (contoh: admin)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition font-medium"
                />
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Kata Sandi (Password) <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 transition"
                >
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  <span>{showPassword ? 'Sembunyikan' : 'Lihat Sandi'}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition font-medium"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                />
                <span>Ingat sesi masuk</span>
              </label>
              <span className="text-[11px] text-emerald-700 font-medium">
                Dukungan multi-role
              </span>
            </div>

            {/* Tombol Masuk Aplikasi */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold py-3 text-xs sm:text-sm shadow-md shadow-emerald-900/30 active:scale-[0.99] transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>MASUK KE APLIKASI</span>
                </>
              )}
            </button>

          </form>

          {/* Keamanan Akun Resmi - Pilihan Akun Cepat Dihilangkan Demi Keamanan */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
              <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                  Keamanan Akses Terlindungi
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Harap masukkan username dan kata sandi resmi Anda. Hubungi Administrator Bidang jika membutuhkan pengaturan akun baru atau reset kata sandi.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center mt-5 text-[11px] text-emerald-200/60 space-y-0.5">
          <p>© 2026 SIPADI DIGITAL • Dinas Pertanian Daerah Kabupaten Morowali</p>
          <p>Kearsipan Digital, Pengadaan Barang Jasa PBJ & Proposal Kelompok Tani</p>
        </div>

      </div>
    </div>
  );
};
