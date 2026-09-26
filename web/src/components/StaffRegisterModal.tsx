'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { UserRole } from '../lib/types';
import {
  UserPlus,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  PackageCheck,
  Truck,
  Building2,
  Mail,
  Phone,
  User,
  Lock,
  Eye,
  EyeOff,
  Warehouse as WarehouseIcon,
  KeyRound,
  Copy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ModalPortal } from './ModalPortal';

interface StaffRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

export const StaffRegisterModal: React.FC<StaffRegisterModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'receiver',
}) => {
  const { warehouses, users, registerStaffUser } = useApp();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [warehouseId, setWarehouseId] = useState<string>(warehouses[0]?.id || '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    name: string;
    employeeId: string;
    username: string;
    initialPassword: string;
  } | null>(null);

  if (!isOpen) return null;

  // Calculate prospective next employee ID for live preview
  const prefix =
    role === 'receiver'
      ? 'EMP-2'
      : role === 'dispatcher'
      ? 'EMP-3'
      : role === 'warehouse_manager'
      ? 'EMP-1'
      : 'EMP-5';

  const previewCount = users.filter((u) => u.employee_id.startsWith(prefix)).length + 1;
  const prospectiveEmpId = `${prefix}${String(previewCount).padStart(3, '0')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Iltimos, xodimning to'liq ism-familiyasini kiriting!");
      return;
    }

    if (!username.trim()) {
      setError("Login kiritilishi shart!");
      return;
    }

    if (username.trim().length < 3) {
      setError("Login kamida 3 ta belgidan iborat bo'lishi kerak!");
      return;
    }

    if (!password) {
      setError("Boshlang'ich parol kiritilishi shart!");
      return;
    }

    if (password.length < 4) {
      setError("Boshlang'ich parol kamida 4 ta belgidan iborat bo'lishi kerak!");
      return;
    }

    const finalEmail = email.trim() ? email.trim().toLowerCase() : `${username.trim().toLowerCase()}@ombor.uz`;

    setIsSubmitting(true);

    try {
      const result = await registerStaffUser({
        full_name: fullName.trim(),
        username: username.trim(),
        password,
        email: finalEmail,
        phone: phone.trim() || undefined,
        role,
        assigned_warehouse_id: warehouseId || null,
      });

      if (!result.success) {
        setError(result.error || "Akkaunt ochishda xatolik yuz berdi!");
        setIsSubmitting(false);
        return;
      }

      // Success
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });

      setSuccessInfo({
        name: result.user?.full_name || fullName,
        employeeId: result.user?.employee_id || prospectiveEmpId,
        username: result.user?.username || username.trim(),
        initialPassword: password,
      });
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err?.message || "Kutilmagan xatolik yuz berdi!");
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSuccessInfo(null);
    setFullName('');
    setUsername('');
    setPassword('');
    setEmail('');
    setPhone('');
    setError(null);
  };

  const handleClose = () => {
    handleResetForm();
    onClose();
  };

  const rolesConfig = [
    {
      id: 'receiver' as UserRole,
      title: 'Qabul qiluvchi (Receiver)',
      desc: 'Kirim harakatlarini amalga oshiradi, yetkazib beruvchilardan tovar qabul qiladi.',
      icon: PackageCheck,
      color: 'emerald',
      bgActive: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400',
      badge: 'EMP-2XXX',
    },
    {
      id: 'dispatcher' as UserRole,
      title: "Jo'natuvchi (Dispatcher)",
      desc: 'Chiqim, sotuv va tovar yuk xati (nakladnoy) rasmiylashtiradi.',
      icon: Truck,
      color: 'amber',
      bgActive: 'bg-amber-500/10 border-amber-500/50 text-amber-400',
      badge: 'EMP-3XXX',
    },
    {
      id: 'warehouse_manager' as UserRole,
      title: 'Ombor mudiri (Manager)',
      desc: 'Barcha harakatlar, qoldiqlar va xodimlar faoliyatini to\'liq boshqaradi.',
      icon: Building2,
      color: 'indigo',
      bgActive: 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400',
      badge: 'EMP-1XXX',
    },
  ];

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto overscroll-contain p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative my-auto w-full max-w-xl p-6 sm:p-7 rounded-3xl glass-panel border border-white/10 bg-slate-950/95 shadow-2xl text-slate-100 overflow-hidden">
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Xodim uchun akkaunt yaratish
              <span className="text-[11px] px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Admin paneli
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Administrator tomonidan xodim uchun login va boshlang'ich parol belgilash
            </p>
          </div>
        </div>

        {/* Success Banner */}
        {successInfo ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-300">
                Akkaunt muvaffaqiyatli yaratildi!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Xodim: <span className="font-bold text-white">{successInfo.name}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-2.5 text-left text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400 font-sans">Shaxsiy ID:</span>
                <span className="text-cyan-300 font-bold">{successInfo.employeeId}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400 font-sans">Login:</span>
                <span className="text-indigo-300 font-bold">{successInfo.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Boshlang'ich parol:</span>
                <span className="text-amber-300 font-bold">{successInfo.initialPassword}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 text-left flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                Xodimmga ushbu login va boshlang'ich parolni berishingiz mumkin. Xodim birinchi marta tizimga kirganida, tizim undan o'zining shaxsiy parolini o'rnatishni so'raydi.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetForm}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                + Boshqa xodim qo'shish
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-600/30"
              >
                Tushunarli (Yopish)
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Xodimning vazifasi (Roli):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {rolesConfig.map((rc) => {
                  const Icon = rc.icon;
                  const isSelected = role === rc.id;
                  return (
                    <button
                      key={rc.id}
                      type="button"
                      onClick={() => setRole(rc.id)}
                      className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? rc.bgActive + ' shadow-lg shadow-black/40 ring-1 ring-white/20'
                          : 'border-white/10 bg-slate-900/60 text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-white/10' : 'bg-slate-800'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 border border-white/10">
                          {rc.badge}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold">{rc.title.split(' ')[0]}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                          {rc.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generated ID Preview Pill */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Biriktiriladigan shaxsiy kod:
              </span>
              <span className="font-mono font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/30 text-xs">
                {prospectiveEmpId}
              </span>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  To'liq F.I.O (Ism, Familiya) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masalan: Jamshid Rustamov"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Username (Login) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Login (foydalanuvchi nomi) *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                    placeholder="jamshid_r"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 ml-1">Kamida 3 belgi</p>
              </div>

              {/* Password (Boshlang'ich parol) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Boshlang'ich parol *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Vaqtinchalik parol"
                    className="w-full pl-9 pr-9 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 ml-1">Kamida 4 belgi</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Elektron pochta (Email)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ixtiyoriy (avto: username@ombor.uz)"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Telefon raqami (Ixtiyoriy)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Warehouse Assignment */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Biriktiriladigan ombor filiali *
                </label>
                <div className="relative">
                  <WarehouseIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.id} className="bg-slate-900 text-white">
                        {wh.name} — {wh.address || "Manzil ko'rsatilmagan"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Info box */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
              <KeyRound className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Yaratilgan xodimmga ushbu login va boshlang'ich parol beriladi. Xodim birinchi marta kirganida o'z parolini o'rnatishi kerak bo'ladi.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Bekor qilish
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isSubmitting ? 'Yaratilmoqda...' : 'Xodim akkauntini yaratish'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
    </ModalPortal>
  );
};
