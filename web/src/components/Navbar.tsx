'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/store';
import { useI18n, Language } from '../lib/i18n';
import {
  QrCode,
  Warehouse,
  ShieldCheck,
  Bell,
  Search,
  ChevronDown,
  AlertTriangle,
  Globe,
  Clock,
  AlertCircle,
  Calendar,
} from 'lucide-react';

interface NavbarProps {
  onOpenScanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenScanner }) => {
  const {
    warehouses,
    currentWarehouse,
    setCurrentWarehouseId,
    users,
    currentUser,
    setCurrentUserId,
    lowStockItems,
    expiringItems,
  } = useApp();

  const { language, setLanguage, t } = useI18n();

  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNotifTab, setActiveNotifTab] = useState<'all' | 'low' | 'expiring'>('all');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalAlertsCount = lowStockItems.length + expiringItems.length;

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 glass-panel border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      {/* Left: Brand & Warehouse Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Warehouse className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-white uppercase flex items-center gap-1.5">
              {t.brandTitle}{' '}
              <span className="text-[10px] px-1.5 py-0.2 bg-indigo-500/20 text-indigo-400 rounded-md font-mono border border-indigo-500/30">
                PRO
              </span>
            </h1>
            <span className="text-[10px] text-slate-400 block -mt-0.5">{t.brandSubtitle}</span>
          </div>
        </div>

        {/* Warehouse Switcher */}
        <div className="hidden md:flex items-center gap-1.5 ml-4 pl-4 border-l border-white/10">
          <Warehouse className="w-4 h-4 text-indigo-400" />
          <select
            value={currentWarehouse ? currentWarehouse.id : ''}
            onChange={(e) => setCurrentWarehouseId(e.target.value || null)}
            className="px-2.5 py-1 text-xs font-semibold bg-slate-900/90 text-slate-200 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">{t.allWarehouses}</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Instant QR Camera Scanner Button */}
        <button
          onClick={onOpenScanner}
          className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.02]"
        >
          <QrCode className="w-4 h-4" />
          <span className="hidden sm:inline">{t.scanQrBtn}</span>
        </button>

        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-white/5 transition-colors border border-white/10 text-xs font-bold text-slate-200"
            title="Change Language"
          >
            <span className="text-sm">{currentLangObj.flag}</span>
            <span className="hidden sm:inline">{currentLangObj.label}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-40 p-2 rounded-2xl glass-panel border border-white/10 shadow-2xl z-50 animate-fadeIn">
              <div className="space-y-1">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      language === l.code
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Multi-alert Notification Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/5 transition-colors border border-white/10"
            title={t.lowStockAlerts}
          >
            <Bell className="w-4 h-4" />
            {mounted && totalAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-rose-500 rounded-full shadow-lg shadow-rose-500/50 animate-pulse">
                {totalAlertsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-88 sm:w-96 p-3 rounded-2xl glass-panel border border-white/10 shadow-2xl z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t.lowStockAlerts}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">
                  {totalAlertsCount} {t.warningCount}
                </span>
              </div>

              {/* Notification Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl mb-2.5 border border-white/5 text-[11px]">
                <button
                  onClick={() => setActiveNotifTab('all')}
                  className={`flex-1 py-1 px-2 rounded-lg font-bold transition-colors ${
                    activeNotifTab === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.tabAllNotifications} ({totalAlertsCount})
                </button>
                <button
                  onClick={() => setActiveNotifTab('low')}
                  className={`flex-1 py-1 px-2 rounded-lg font-bold transition-colors ${
                    activeNotifTab === 'low'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.tabLowStock} ({lowStockItems.length})
                </button>
                <button
                  onClick={() => setActiveNotifTab('expiring')}
                  className={`flex-1 py-1 px-2 rounded-lg font-bold transition-colors ${
                    activeNotifTab === 'expiring'
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.tabExpiringStock} ({expiringItems.length})
                </button>
              </div>

              {totalAlertsCount === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">{t.noAlerts}</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {/* Expiring items section */}
                  {(activeNotifTab === 'all' || activeNotifTab === 'expiring') &&
                    expiringItems.map((item) => (
                      <div
                        key={`exp-${item.id}`}
                        className={`p-2.5 rounded-xl border text-xs ${
                          item.expiry_status === 'expired'
                            ? 'bg-rose-950/40 border-rose-500/30'
                            : 'bg-amber-950/40 border-amber-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-white truncate">{item.name}</span>
                          {item.expiry_status === 'expired' ? (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-500 text-white shrink-0 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {t.expiredBadge}
                            </span>
                          ) : (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 shrink-0 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {item.days_until_expiry} {t.daysLeft}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-1.5 pt-1.5 border-t border-white/5 text-[10px] text-slate-300">
                          <div>
                            <span className="text-slate-400 block">{t.expiryDate}:</span>
                            <span className="font-semibold text-rose-300">{item.expiry_date}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">{t.totalStock}:</span>
                            <span className="font-bold text-emerald-400">{item.total_stock} {item.unit}</span>
                          </div>
                        </div>

                        {item.storage_conditions && (
                          <div className="text-[10px] text-cyan-300/90 mt-1 pt-1 border-t border-white/5 truncate">
                            ❄️ {t.storageConditions}: {item.storage_conditions}
                          </div>
                        )}
                      </div>
                    ))}

                  {/* Low stock items section */}
                  {(activeNotifTab === 'all' || activeNotifTab === 'low') &&
                    lowStockItems.map((item) => (
                      <div
                        key={`low-${item.id}`}
                        className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-200 truncate">{item.name}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                            {t.lowBadge}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1.5 text-[11px]">
                          <span className="text-rose-400 font-bold">
                            {t.totalStock}: {item.total_stock} {item.unit}
                          </span>
                          <span className="text-slate-400">
                            {t.safetyMin}: {item.min_stock_level}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Individual Staff Account Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors border border-white/10"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
              {currentUser.full_name ? currentUser.full_name.charAt(0) : currentUser.name.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1.5">
                <span>{currentUser.full_name || currentUser.name}</span>
                {currentUser.employee_id && (
                  <span className="text-[10px] px-1.5 py-0.2 font-mono font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {currentUser.employee_id}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[9px] px-1.5 py-0.2 uppercase font-bold rounded ${
                    currentUser.role === 'admin'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : currentUser.role === 'warehouse_manager'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : currentUser.role === 'receiver'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : currentUser.role === 'dispatcher'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                  }`}
                >
                  {currentUser.role === 'receiver'
                    ? (t as any).roleReceiver || 'Receiver'
                    : currentUser.role === 'dispatcher'
                    ? (t as any).roleDispatcher || 'Dispatcher'
                    : currentUser.role === 'warehouse_manager'
                    ? (t as any).roleManager || 'Manager'
                    : currentUser.role === 'admin'
                    ? (t as any).roleAdmin || 'Admin'
                    : currentUser.role}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 p-3 rounded-2xl glass-panel border border-white/10 shadow-2xl z-50">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
                Xodim hisobini almashtirish
              </span>
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUserId(u.id);
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentUser.id === u.id
                        ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="font-semibold flex items-center gap-1.5 truncate">
                        <span>{u.full_name || u.name}</span>
                        {u.employee_id && (
                          <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${currentUser.id === u.id ? 'bg-black/30 text-white' : 'bg-cyan-500/20 text-cyan-300'}`}>
                            {u.employee_id}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] opacity-75 mt-0.5">{u.email}</div>
                    </div>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/30 shrink-0 ml-2">
                      {u.role.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
