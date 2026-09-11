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
  BadgePercent,
  Warehouse as WarehouseIcon,
  KeyRound,
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [warehouseId, setWarehouseId] = useState<string>(warehouses[0]?.id || '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ name: string; employeeId: string; username: string } | null>(null);

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
      setError("Parol kiritilishi shart!");
      return;
    }

    if (password.length < 4) {
      setError("Parol kamida 4 ta belgidan iborat bo'lishi kerak!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Parollar bir-biriga mos kelmayapti!");
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError("To'g'ri elektron pochta manzilini kiriting!");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerStaffUser({
        full_name: fullName.trim(),
        username: username.trim(),
        password,
        email: email.trim().toLowerCase(),
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
      });

      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessInfo(null);
        setFullName('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setPhone('');
        onClose();
      }, 1600);
    } catch (err: any) {
      setError(err?.message || "Kutilmagan xatolik yuz berdi!");
      setIsSubmitting(false);
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl p-6 sm:p-7 rounded-3xl glass-panel border border-white/10 bg-slate-950/95 shadow-2xl text-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
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
              Yangi xodim hisobini ochish
              <span className="text-[11px] px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Ro'yxatdan o'tish
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ombor xodimi uchun individual akkaunt, login va parol yaratish
            </p>
          </div>
        </div>

        {/* Success Banner */}
        {successInfo ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-emerald-300">
              Akkaunt muvaffaqiyatli yaratildi!
            </h3>
            <p className="text-xs text-slate-300">
              Xodim: <span className="font-semibold text-white">{successInfo.name}</span>
            </p>
            <div className="flex flex-col items-center gap-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                ID: {successInfo.employeeId}
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold">
                Login: {successInfo.username}
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Tizim avtomatik ravishda yangi xodim profiliga o'tkazilmoqda...
            </p>
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
                <p className="text-[10px] text-slate-500 mt-0.5 ml-1">Kamida 3 belgi, bo'sh joysiz</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Elektron pochta (Email) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jamshid@warehouse.io"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Parol *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kamida 4 belgi"
                    className="w-full pl-9 pr-10 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Parolni tasdiqlash *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Parolni qaytadan kiriting"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-900/90 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      confirmPassword && confirmPassword !== password
                        ? 'border-rose-500/50 focus:border-rose-500'
                        : confirmPassword && confirmPassword === password
                        ? 'border-emerald-500/50 focus:border-emerald-500'
                        : 'border-white/10 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[10px] text-rose-400 mt-0.5 ml-1">Parollar mos kelmayapti</p>
                )}
                {confirmPassword && confirmPassword === password && (
                  <p className="text-[10px] text-emerald-400 mt-0.5 ml-1">✓ Parollar mos</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Telefon raqami (ixtiyoriy)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123-45-67"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Assigned Warehouse */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Biriktiriladigan ombor filiali:
                </label>
                <div className="relative">
                  <WarehouseIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.id}>
                        {wh.name} {wh.address ? `(${wh.address})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10 mt-5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.02] disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isSubmitting ? 'Yaratilmoqda...' : 'Akkauntni ochish'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
