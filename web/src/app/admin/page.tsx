'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../lib/store';
import { useI18n } from '../../lib/i18n';
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Users,
  UserCheck,
  AlertTriangle,
  Building2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Search,
  UserPlus,
} from 'lucide-react';
import { StaffRegisterModal } from '../../components/StaffRegisterModal';

export default function AdminPage() {
  const {
    currentUser,
    users,
    warehouses,
    loginLogs,
    adminSessionVerified,
    setAdminSessionVerified,
    verifyAdminPin,
  } = useApp();
  const { t } = useI18n();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // If user is not admin, deny access immediately
  if (currentUser.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">{t.accessDenied || 'Ruxsat cheklangan'}</h2>
        <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
          Bu sahifa maxfiy tizim boshqaruv konsoli bo'lib, unga faqat Tizim Administratori kirishi mumkin.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  // If admin session is not verified, require Master PIN (9876)
  if (!adminSessionVerified) {
    const handleVerify = (e: React.FormEvent) => {
      e.preventDefault();
      setPinError(null);
      const isOk = verifyAdminPin(pinInput);
      if (!isOk) {
        setPinError(t.invalidPin || "PIN kod noto'g'ri! Urinish xavfsizlik jurnaliga qayd etildi.");
      } else {
        setPinInput('');
      }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] p-4 animate-fadeIn">
        <div className="w-full max-w-md p-8 glass-panel rounded-3xl border border-white/10 shadow-2xl text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-xl shadow-rose-600/20">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-black text-white tracking-tight mb-2">
            {t.adminPinModalTitle || 'Admin Xavfsizlik Tekshiruvi'}
          </h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Administrator: <strong>{currentUser.full_name || currentUser.name}</strong> ({currentUser.employee_id}).
            Konsolga kirish uchun Master PIN kodni kiriting (Standart: <span className="text-indigo-400 font-mono font-bold">9876</span>).
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                maxLength={10}
                autoFocus
                placeholder="Master PIN (9876)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3 text-center tracking-widest text-lg font-mono font-bold bg-slate-900/90 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-300 text-xs border border-rose-500/30 flex items-center gap-2 justify-center">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 shadow-lg shadow-rose-600/30 transition-all transform hover:scale-[1.01]"
            >
              {t.verifyPinBtn || 'Kodni Tasdiqlash'}
            </button>
          </form>

          {/* Quick preset PIN button for convenience */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setPinInput('9876');
                verifyAdminPin('9876');
              }}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Tezkor kirish (9876 ni kiritish)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard (Unlocked)
  const failedLogs = loginLogs.filter((l) => l.event_type === 'admin_access_failed');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              XAVFSIZ REJIM AKTIV
            </span>
            <span className="text-[10px] text-slate-400 font-mono">PIN: 9876</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <KeyRound className="w-7 h-7 text-rose-400" />
            <span>Tizim Administratori Boshqaruv Markazi</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Shaxsiy xodim hisoblari nazorati, kirish huquqlari matritsasi va xavfsizlik audit parametrlari.
          </p>
        </div>

        <button
          onClick={() => setAdminSessionVerified(false)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-white/10 rounded-xl transition-all self-start sm:self-auto"
        >
          <Lock className="w-4 h-4 text-rose-400" />
          <span>Sessiyani qulflash</span>
        </button>
      </div>

      {/* Security Incidents Alert (if any failed PIN attempts) */}
      {failedLogs.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
          <div>
            <div className="font-bold text-sm text-rose-200">
              Diqqat: {failedLogs.length} ta noto'g'ri PIN kiritish holati aniqlangan!
            </div>
            <p className="text-slate-300 mt-1">
              So'nggi urinish: {new Date(failedLogs[0].created_at).toLocaleString()} (IP: {failedLogs[0].ip_address}).
              Barcha urinishlar audit jurnalida qayd etilgan.
            </p>
          </div>
        </div>
      )}

      {/* Staff Accounts Management Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Xodimlar Ro'yxati & Huquqlar Matritsasi</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ombor xodimlari o'zlari ro'yxatdan o'tishlari yoki administrator tomonidan qo'shilishi mumkin
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{users.length} ta ro'yxatdan o'tgan hisob</span>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Yangi xodim qo'shish</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto glass-panel rounded-2xl border border-white/10 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10 font-bold">
              <tr>
                <th className="py-3.5 px-4">Xodim (F.I.SH)</th>
                <th className="py-3.5 px-4">EMP ID</th>
                <th className="py-3.5 px-4">Rol & Huquqlar</th>
                <th className="py-3.5 px-4">Biriktirilgan Ombor</th>
                <th className="py-3.5 px-4">Email & Telefon</th>
                <th className="py-3.5 px-4">Ruxsat Cheklovlari</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => {
                const wh = warehouses.find((w) => w.id === u.assigned_warehouse_id);

                return (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{u.full_name || u.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {u.id}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {u.employee_id || 'EMP-XXXX'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : u.role === 'warehouse_manager'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : u.role === 'receiver'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : u.role === 'dispatcher'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                        }`}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-300 font-semibold">{wh?.name || 'Barcha omborlar'}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{u.email}</div>
                      <div className="text-[10px] text-slate-500">{u.phone || '+998 90 000-00-00'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-[11px]">
                      {u.role === 'receiver' && (
                        <span className="text-emerald-400">
                          Faqat Kirim (Inbound) &bull; Faqat o'z tarixi
                        </span>
                      )}
                      {u.role === 'dispatcher' && (
                        <span className="text-amber-400">
                          Faqat Chiqim (Outbound) &bull; Fakturalar &bull; Faqat o'z tarixi
                        </span>
                      )}
                      {u.role === 'warehouse_manager' && (
                        <span className="text-indigo-400">
                          To'liq ombor nazorati &bull; Tuzatishlarni tasdiqlash
                        </span>
                      )}
                      {u.role === 'admin' && (
                        <span className="text-rose-400 font-bold">
                          To'liq tizim va xavfsizlik konsoli (Superuser)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Self-Registration Modal */}
      <StaffRegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </div>
  );
}
