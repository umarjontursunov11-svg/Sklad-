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
  } = useApp();

  const { language, setLanguage, t } = useI18n();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

        {/* Low Stock Notification Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/5 transition-colors border border-white/10"
            title={t.lowStockAlerts}
          >
            <Bell className="w-4 h-4" />
            {mounted && lowStockItems.length > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-black text-white bg-rose-500 rounded-full animate-pulse">
                {lowStockItems.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 p-3 rounded-2xl glass-panel border border-white/10 shadow-2xl z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> {t.lowStockAlerts}
                </span>
                <span className="text-[10px] text-slate-400">
                  {lowStockItems.length} {t.warningCount}
                </span>
              </div>

              {lowStockItems.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">{t.noAlerts}</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs"
                    >
                      <div className="font-semibold text-slate-200 truncate">{item.name}</div>
                      <div className="flex items-center justify-between mt-1 text-[11px]">
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

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors border border-white/10"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                {currentUser.name.split(' ')[0]}
                <span
                  className={`text-[9px] px-1 py-0.2 uppercase font-bold rounded ${
                    currentUser.role === 'admin'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : currentUser.role === 'warehouse_manager'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 p-3 rounded-2xl glass-panel border border-white/10 shadow-2xl z-50">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
                {t.switchRole}
              </span>
              <div className="space-y-1">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUserId(u.id);
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentUser.id === u.id
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="truncate">{u.name}</div>
                      <div className="text-[10px] opacity-75">{u.email}</div>
                    </div>
                    <span className="text-[9px] uppercase font-mono px-1 py-0.5 rounded bg-black/30">
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
