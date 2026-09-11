'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/store';
import {
  Warehouse,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  AlertCircle,
  ShieldCheck,
  User,
  Loader2,
} from 'lucide-react';
import { StaffRegisterModal } from './StaffRegisterModal';

interface LoginScreenProps {}

export const LoginScreen: React.FC<LoginScreenProps> = () => {
  const { login } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("Login kiritilishi shart!");
      return;
    }
    if (!password) {
      setError("Parol kiritilishi shart!");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(username, password);
      if (!result.success) {
        setError(result.error || "Kirish xatolik!");
      }
    } catch (err) {
      setError("Kutilmagan xatolik yuz berdi!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#060a13]">
        {/* Animated background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
          <div className="absolute top-[40%] left-[50%] w-[30vw] h-[30vw] rounded-full bg-cyan-600/5 blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md mx-4 animate-fadeIn">
          {/* Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-2xl shadow-indigo-600/40 mb-4">
              <Warehouse className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              OmniStock
              <span className="text-sm px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-lg font-mono border border-indigo-500/30">
                PRO
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Ombor avtomatlashtirish tizimi
            </p>
          </div>

          {/* Login Form Card */}
          <div className="relative p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-500" />

            {/* Security badge */}
            <div className="flex items-center justify-center gap-2 mb-6 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Xavfsiz autentifikatsiya</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Login
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Loginni kiriting"
                    autoComplete="username"
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Parol
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolni kiriting"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-12 py-3 bg-slate-900/90 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors rounded"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Tekshirilmoqda...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Tizimga kirish</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] text-slate-500 font-semibold">yoki</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Register Button */}
            <button
              onClick={() => setShowRegisterModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-300 hover:text-white border border-white/10 hover:border-indigo-500/50 rounded-xl hover:bg-white/5 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Yangi xodim hisobini ochish</span>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} OmniStock PRO. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </div>

      {/* Staff Registration Modal */}
      <StaffRegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </>
  );
};
