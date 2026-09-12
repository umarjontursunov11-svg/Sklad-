'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/store';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Loader2,
  LogOut,
} from 'lucide-react';

export const ForcePasswordChangeModal: React.FC = () => {
  const { authenticatedUser, changePassword, logout } = useApp();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword) {
      setError("Yangi parol kiritilishi shart!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Parollar bir-biriga mos kelmadi!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await changePassword(newPassword);
      if (!res.success) {
        setError(res.error || "Parolni o'zgartirishda xatolik yuz berdi!");
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setError("Kutilmagan xatolik yuz berdi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060a13] bg-opacity-95 backdrop-blur-xl">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Top accent gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-indigo-500 to-cyan-500" />

        {/* Security badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Birinchi marta kirish</span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
            title="Chiqish"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Chiqish</span>
          </button>
        </div>

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Yangi shaxsiy parol o'rnating
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Foydalanuvchi: <span className="text-indigo-300 font-semibold">{authenticatedUser?.full_name || authenticatedUser?.name}</span> ({authenticatedUser?.username})
            <br />
            Administrator sizga boshlang'ich parol bergan. Xavfsizlikni ta'minlash uchun o'zingizning maxfiy parolingizni belgilang.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-emerald-300">
              Parol muvaffaqiyatli o'zgartirildi!
            </h3>
            <p className="text-xs text-slate-300">
              Endi ushbu yangi parol bilan tizimdan foydalanishingiz mumkin.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Yangi shaxsiy parol
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Kamida 4 ta belgi"
                  autoFocus
                  className="w-full pl-10 pr-12 py-3 bg-slate-900/90 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Yangi parolni tasdiqlang
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Parolni qayta kiriting"
                  className="w-full pl-10 pr-12 py-3 bg-slate-900/90 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            </div>

            {/* Match Indicator */}
            {newPassword && confirmPassword && (
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {newPassword === confirmPassword ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Parollar mos keldi
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Parollar mos emas
                  </span>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saqlanmoqda...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Parolni saqlash va davom etish</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
