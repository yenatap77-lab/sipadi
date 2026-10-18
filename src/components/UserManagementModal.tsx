/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Users,
  KeyRound,
  Trash2,
  Phone,
  Mail,
  Edit3,
  Save,
  ShieldAlert,
  Plus,
  Tag,
  AlertTriangle,
  Layers,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserAccount, BidangType, RoleDefinition } from '../types';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserAccount[];
  currentUser: UserAccount;
  roles: RoleDefinition[];
  onSwitchUser: (user: UserAccount) => void;
  onAddUser: (newUser: UserAccount) => void;
  onUpdateUser: (updatedUser: UserAccount) => void;
  onDeleteUser: (userId: string) => void;
  onAddRole: (newRole: RoleDefinition) => void;
  onUpdateRole: (updatedRole: RoleDefinition) => void;
  onDeleteRole: (roleId: string, roleName: string) => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  roles,
  onSwitchUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onAddRole,
  onUpdateRole,
  onDeleteRole,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  // User form state (Add / Edit)
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123456');
  const [showPasswordInForm, setShowPasswordInForm] = useState(false);
  const [role, setRole] = useState<string>(roles[0]?.name || 'Administrator');
  const [bidang, setBidang] = useState<BidangType | 'semua'>('semua');
  const [nip, setNip] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  // Role form state (Add / Edit)
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleBidang, setRoleBidang] = useState<BidangType | 'semua'>('semua');
  const [roleDescription, setRoleDescription] = useState('');

  // Delete confirmations
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<RoleDefinition | null>(null);

  if (!isOpen) return null;

  // Handle open add user form
  const handleOpenAddUser = () => {
    setIsEditingUser(false);
    setEditingUserId(null);
    setName('');
    setUsername('');
    setPassword('123456');
    setShowPasswordInForm(false);
    setRole(roles[0]?.name || 'Administrator');
    setBidang('semua');
    setNip('');
    setPhone('');
    setEmail('');
    setStatus('Aktif');
    setShowUserForm(true);
  };

  // Handle open edit user form
  const handleOpenEditUser = (user: UserAccount) => {
    setIsEditingUser(true);
    setEditingUserId(user.id);
    setName(user.name);
    setUsername(user.username);
    setPassword(user.password || (user.username === 'admin' ? 'admin123' : '123456'));
    setShowPasswordInForm(false);
    setRole(user.role);
    setBidang(user.bidang);
    setNip(user.nip || '');
    setPhone(user.phone || '');
    setEmail(user.email || '');
    setStatus(user.status);
    setShowUserForm(true);
  };

  // Handle submit user form
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username) return;

    if (isEditingUser && editingUserId) {
      // Update existing user
      const existing = users.find((u) => u.id === editingUserId);
      if (existing) {
        const updated: UserAccount = {
          ...existing,
          name,
          username: username.toLowerCase().replace(/\s+/g, '_'),
          password: password || '123456',
          role,
          bidang,
          nip,
          phone,
          email,
          status,
        };
        onUpdateUser(updated);
      }
    } else {
      // Create new user
      const newUser: UserAccount = {
        id: 'usr-' + Date.now(),
        name,
        username: username.toLowerCase().replace(/\s+/g, '_'),
        password: password || '123456',
        role,
        bidang,
        nip,
        phone,
        email,
        status,
        createdAt: new Date().toISOString(),
      };
      onAddUser(newUser);
    }

    setShowUserForm(false);
    setIsEditingUser(false);
    setEditingUserId(null);
  };

  // Handle open add role form
  const handleOpenAddRole = () => {
    setEditingRoleId(null);
    setRoleName('');
    setRoleBidang('semua');
    setRoleDescription('');
    setShowRoleForm(true);
  };

  // Handle open edit role form
  const handleOpenEditRole = (r: RoleDefinition) => {
    setEditingRoleId(r.id);
    setRoleName(r.name);
    setRoleBidang(r.bidang);
    setRoleDescription(r.description);
    setShowRoleForm(true);
  };

  // Handle save role form
  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName) return;

    if (editingRoleId) {
      const existing = roles.find((r) => r.id === editingRoleId);
      if (existing) {
        onUpdateRole({
          ...existing,
          name: roleName,
          bidang: roleBidang,
          description: roleDescription,
        });
      }
    } else {
      const newRole: RoleDefinition = {
        id: 'role-' + Date.now(),
        name: roleName,
        bidang: roleBidang,
        description: roleDescription,
        isSystem: false,
        createdAt: new Date().toISOString(),
      };
      onAddRole(newRole);
    }

    setShowRoleForm(false);
    setEditingRoleId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-[#143820] to-[#1a472a] px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-900 shadow-sm">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Manajemen Akun, Operator & Role (Rule)</h2>
              <p className="text-xs text-emerald-200">
                Edit data admin & operator, kelola hak akses peran, serta hapus akun/role yang tidak terpakai
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

        {/* Top Switcher Tabs: Pengguna vs Role */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'users'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Pengguna & Operator ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'roles'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Kelola Role & Hak Akses ({roles.length})</span>
          </button>
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* =========================================================================
              TAB 1: MANAJEMEN PENGGUNA & OPERATOR
             ========================================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-5">
              
              {/* Active User Card & Add Button */}
              <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-md ring-2 ring-emerald-300">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase block">
                      Akun Aktif Saat Ini
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {currentUser.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-600">
                      <span className="rounded bg-emerald-200/80 px-2 py-0.5 text-[11px] font-bold text-emerald-900">
                        {currentUser.role}
                      </span>
                      {currentUser.nip && <span>NIP: {currentUser.nip}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditUser(currentUser)}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-400 bg-white hover:bg-emerald-100/60 px-3 py-2 text-xs font-bold text-emerald-800 shadow-xs transition"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Akun Saya</span>
                  </button>

                  <button
                    onClick={() => {
                      if (showUserForm && !isEditingUser) {
                        setShowUserForm(false);
                      } else {
                        handleOpenAddUser();
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-3.5 py-2 text-xs font-bold text-slate-900 shadow-sm transition"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Tambah Operator Baru</span>
                  </button>
                </div>
              </div>

              {/* FORM TAMBAH / EDIT PENGGUNA */}
              {showUserForm && (
                <form onSubmit={handleSaveUser} className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/50 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                      {isEditingUser ? <Edit3 className="h-4 w-4 text-emerald-700" /> : <UserPlus className="h-4 w-4 text-amber-600" />}
                      <span>{isEditingUser ? 'Edit Data Pengguna / Operator' : 'Tambah Akun Pengguna Baru'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowUserForm(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Ir. Ratna Dewi / H. Sudirman, S.P."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Username Login <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="username_unik"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Kata Sandi / Password <span className="text-rose-500">*</span></span>
                        <button
                          type="button"
                          onClick={() => setShowPasswordInForm(!showPasswordInForm)}
                          className="text-[10px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                        >
                          {showPasswordInForm ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          {showPasswordInForm ? 'Sembunyikan' : 'Lihat'}
                        </button>
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswordInForm ? 'text' : 'password'}
                          required
                          placeholder="Masukkan kata sandi..."
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 pl-3 pr-8 py-2 text-xs focus:border-emerald-600 focus:outline-none bg-white font-mono"
                        />
                        <Lock className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Sandi masuk aplikasi untuk akun ini</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Peran / Hak Akses (Role) <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={role}
                        onChange={(e) => {
                          const rName = e.target.value;
                          setRole(rName);
                          const matched = roles.find((r) => r.name === rName);
                          if (matched && matched.bidang) {
                            setBidang(matched.bidang);
                          }
                        }}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white font-bold text-slate-800 focus:border-emerald-600 focus:outline-none"
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Bidang Tugas Terkait
                      </label>
                      <select
                        value={bidang}
                        onChange={(e) => setBidang(e.target.value as BidangType | 'semua')}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white focus:outline-none"
                      >
                        <option value="semua">Semua Bidang Dinas</option>
                        <option value="perencanaan">Bidang Perencanaan</option>
                        <option value="tph">Bidang TPH (Tanaman Pangan & Horti)</option>
                        <option value="psp">Bidang PSP (Prasarana & Sarana)</option>
                        <option value="peternakan">Bidang Peternakan</option>
                        <option value="perkebunan">Bidang Perkebunan</option>
                        <option value="pbj">Bagian PBJ (Pengadaan)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Status Akun
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'Aktif' | 'Nonaktif')}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white font-bold focus:outline-none"
                      >
                        <option value="Aktif">Aktif (Bisa Login)</option>
                        <option value="Nonaktif">Nonaktif (Dibekukan)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">NIP Pegawai</label>
                      <input
                        type="text"
                        placeholder="19xxxxxxxxxxxxxxxx"
                        value={nip}
                        onChange={(e) => setNip(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                      <input
                        type="text"
                        placeholder="08xxxxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email Resmi</label>
                      <input
                        type="email"
                        placeholder="nama@pertanian.go.id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-emerald-200">
                    <button
                      type="button"
                      onClick={() => setShowUserForm(false)}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-5 py-2 text-xs font-bold text-white shadow-sm"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isEditingUser ? 'Simpan Perubahan Pengguna' : 'Simpan Akun Pengguna'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* DAFTAR SEMUA PENGGUNA & OPERATOR (DAPAT DIEDIT DAN DIHAPUS) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Daftar Seluruh Pengguna & Operator ({users.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Setiap akun dapat diedit datanya atau dihapus jika sudah tidak digunakan.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {users.map((u) => {
                    const isCurrent = u.id === currentUser.id;
                    return (
                      <div
                        key={u.id}
                        className={`rounded-2xl p-4 border transition flex flex-col justify-between ${
                          isCurrent
                            ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-1 ring-emerald-400'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Header User Card */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                                {u.name.charAt(0)}
                              </div>
                              <div>
                                <h5 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                                  {u.name}
                                </h5>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                                    {u.role}
                                  </span>
                                  {u.status === 'Nonaktif' && (
                                    <span className="rounded bg-rose-100 text-rose-700 px-1.5 py-0.5 text-[10px] font-bold">
                                      Nonaktif
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Badge Active */}
                            {isCurrent && (
                              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shrink-0">
                                Sedang Aktif
                              </span>
                            )}
                          </div>

                          {/* Detail NIP & Kontak */}
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Username:</span>
                              <strong className="text-slate-800 font-mono">@{u.username}</strong>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Kata Sandi:</span>
                              <span className="font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px] font-semibold">
                                {u.password || (u.username === 'admin' ? 'admin123' : '123456')}
                              </span>
                            </div>
                            {u.nip && (
                              <div className="flex justify-between">
                                <span className="text-slate-400">NIP:</span>
                                <span className="font-mono">{u.nip}</span>
                              </div>
                            )}
                            {u.phone && (
                              <div className="flex justify-between">
                                <span className="text-slate-400">Telepon / WA:</span>
                                <span>{u.phone}</span>
                              </div>
                            )}
                            {u.email && (
                              <div className="flex justify-between">
                                <span className="text-slate-400">Email:</span>
                                <span className="truncate max-w-[180px]">{u.email}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons: Gunakan Akun, Edit, Hapus */}
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          {!isCurrent ? (
                            <button
                              type="button"
                              onClick={() => onSwitchUser(u)}
                              className="rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white px-2.5 py-1 text-xs font-bold text-emerald-800 transition"
                            >
                              Gunakan Akun
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Akun sesi Anda</span>
                          )}

                          <div className="flex items-center gap-1.5">
                            {/* Tombol Edit Admin/Operator */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditUser(u)}
                              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 transition"
                              title="Edit data admin atau operator ini"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>Edit</span>
                            </button>

                            {/* Tombol Hapus Pengguna yang Tidak Dipakai */}
                            <button
                              type="button"
                              onClick={() => setUserToDelete(u)}
                              className="flex items-center p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                              title="Hapus pengguna yang sudah tidak dipakai"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 2: KELOLA ROLE & HAK AKSES (RULE)
             ========================================================================= */}
          {activeTab === 'roles' && (
            <div className="space-y-5">
              
              {/* Header Box & Add Role Button */}
              <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500 text-slate-900 shadow-sm">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">
                      Kelola Role / Hak Akses Sistem
                    </h3>
                    <p className="text-xs text-amber-800">
                      Tambah role baru sesuai struktur dinas, edit wewenang, dan hapus role yang sudah tidak digunakan.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (showRoleForm && !editingRoleId) {
                      setShowRoleForm(false);
                    } else {
                      handleOpenAddRole();
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-sm transition shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Role Baru</span>
                </button>
              </div>

              {/* FORM TAMBAH / EDIT ROLE */}
              {showRoleForm && (
                <form onSubmit={handleSaveRole} className="rounded-2xl border-2 border-amber-400 bg-amber-50/50 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                      <Tag className="h-4 w-4 text-amber-700" />
                      <span>{editingRoleId ? 'Edit Role / Aturan' : 'Tambah Role / Aturan Baru'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowRoleForm(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Role / Jabatan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Operator Ketahanan Pangan / Kepala Seksi PBJ"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none bg-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Bidang Tugas Terkait
                      </label>
                      <select
                        value={roleBidang}
                        onChange={(e) => setRoleBidang(e.target.value as BidangType | 'semua')}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white font-semibold focus:outline-none"
                      >
                        <option value="semua">Semua Bidang Dinas (Umum)</option>
                        <option value="perencanaan">Bidang Perencanaan</option>
                        <option value="tph">Bidang TPH</option>
                        <option value="psp">Bidang PSP</option>
                        <option value="peternakan">Bidang Peternakan</option>
                        <option value="perkebunan">Bidang Perkebunan</option>
                        <option value="pbj">Bagian PBJ</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Deskripsi Wewenang / Cakupan Tugas
                      </label>
                      <input
                        type="text"
                        placeholder="Tuliskan cakupan tugas role ini..."
                        value={roleDescription}
                        onChange={(e) => setRoleDescription(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-amber-600 focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-amber-200">
                    <button
                      type="button"
                      onClick={() => setShowRoleForm(false)}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 px-5 py-2 text-xs font-bold text-white shadow-sm"
                    >
                      <Save className="h-4 w-4" />
                      <span>{editingRoleId ? 'Simpan Perubahan Role' : 'Simpan Role Baru'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* LIST SEMUA ROLE DENGAN TOMBOL EDIT & HAPUS */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Daftar Role / Aturan Tersedia ({roles.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {roles.map((r) => {
                    const assignedUsers = users.filter((u) => u.role === r.name);
                    const userCount = assignedUsers.length;

                    return (
                      <div
                        key={r.id}
                        className="rounded-2xl p-4 border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="font-extrabold text-xs sm:text-sm text-slate-900">
                                {r.name}
                              </h5>
                              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                                Bidang: {r.bidang}
                              </span>
                            </div>

                            <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-bold border border-slate-200 shrink-0">
                              {userCount} Pengguna
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {r.description || 'Tidak ada keterangan wewenang khusus.'}
                          </p>
                        </div>

                        {/* Action Buttons: Edit Role, Hapus Role */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="text-[11px] text-slate-400">
                            {userCount > 0 ? (
                              <span className="text-emerald-700 font-medium">Digunakan {userCount} akun</span>
                            ) : (
                              <span className="text-amber-600 font-medium">Belum digunakan (Bisa Dihapus)</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditRole(r)}
                              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 transition"
                              title="Edit nama atau deskripsi role"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>Edit</span>
                            </button>

                            {/* Tombol Hapus Role yang Tidak Dipakai */}
                            <button
                              type="button"
                              onClick={() => setRoleToDelete(r)}
                              className="flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                              title="Hapus role ini"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* MODAL KONFIRMASI HAPUS PENGGUNA */}
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-800 border border-rose-200 space-y-3">
              <div className="flex items-center gap-2.5 text-rose-600">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="font-bold text-base text-slate-900">Konfirmasi Hapus Pengguna</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus akun operator/pengguna <strong>"{userToDelete.name}"</strong> (@{userToDelete.username}) dengan role <strong>{userToDelete.role}</strong>?
              </p>

              {userToDelete.id === currentUser.id && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-900">
                  <strong>Peringatan:</strong> Ini adalah akun yang sedang Anda gunakan saat ini. Jika dihapus, Anda akan otomatis dialihkan ke akun Admin pertama.
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  className="rounded-xl border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteUser(userToDelete.id);
                    setUserToDelete(null);
                  }}
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-1.5 text-xs font-bold text-white shadow-sm"
                >
                  Ya, Hapus Pengguna
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL KONFIRMASI HAPUS ROLE / RULE */}
        {roleToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-800 border border-rose-200 space-y-3">
              <div className="flex items-center gap-2.5 text-rose-600">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="font-bold text-base text-slate-900">Konfirmasi Hapus Role</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus role <strong>"{roleToDelete.name}"</strong>?
              </p>

              {(() => {
                const assignedCount = users.filter((u) => u.role === roleToDelete.name).length;
                if (assignedCount > 0) {
                  return (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-900">
                      <strong>Perhatian:</strong> Terdapat {assignedCount} pengguna yang masih menggunakan role ini. Pengguna tersebut akan otomatis dialihkan ke role "Viewer".
                    </div>
                  );
                }
                return null;
              })()}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRoleToDelete(null)}
                  className="rounded-xl border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteRole(roleToDelete.id, roleToDelete.name);
                    setRoleToDelete(null);
                  }}
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-1.5 text-xs font-bold text-white shadow-sm"
                >
                  Ya, Hapus Role
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
