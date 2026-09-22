'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ArrowDownUp,
  RefreshCw,
  FileSpreadsheet,
  Printer,
  ReceiptText,
  ShieldCheck,
  KeyRound,
  QrCode,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../lib/i18n';

const ALL = ['admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher'];

/**
 * Bottom navigation for phones and tablets (the desktop Sidebar is hidden below `lg`).
 * Four main tabs + a central QR scan button + "Menyu" sheet with every section.
 */
export const MobileNav: React.FC<{ onOpenScanner: () => void }> = ({ onOpenScanner }) => {
  const pathname = usePathname();
  const { currentUser, lowStockItems, warehouses, currentWarehouse, setCurrentWarehouseId } = useApp();
  const { t } = useI18n();
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => setSheetOpen(false), [pathname]);

  const role = currentUser?.role || 'warehouse_staff';

  const items = [
    { label: t.dashboard, href: '/', icon: LayoutDashboard, roles: ALL },
    { label: t.products, href: '/products', icon: Package, roles: ALL },
    { label: t.inventory, href: '/inventory', icon: Boxes, roles: ALL, badge: lowStockItems.length || undefined },
    { label: t.stockInOut, href: '/transactions', icon: ArrowDownUp, roles: ALL },
    { label: t.transfers, href: '/transfers', icon: RefreshCw, roles: ['admin', 'warehouse_manager', 'warehouse_staff'] },
    { label: (t as any).invoices || 'Yuk Xatlari', href: '/invoices', icon: ReceiptText, roles: ['admin', 'warehouse_manager', 'warehouse_staff', 'dispatcher'] },
    { label: t.reports, href: '/reports', icon: FileSpreadsheet, roles: ALL },
    { label: t.qrLab, href: '/qr-lab', icon: Printer, roles: ['admin', 'warehouse_manager', 'warehouse_staff'] },
    { label: (t as any).auditLogs || 'Audit Jurnali', href: '/audit-logs', icon: ShieldCheck, roles: ['admin', 'warehouse_manager'] },
    { label: 'Admin Boshqaruvi', href: '/admin', icon: KeyRound, roles: ['admin'] },
  ].filter((i) => i.roles.includes(role));

  const tabs = ['/', '/inventory', '/transactions', '/products']
    .map((href) => items.find((i) => i.href === href))
    .filter(Boolean) as typeof items;

  const Tab = ({ item }: { item: (typeof items)[number] }) => {
    const Icon = item.icon;
    const active = pathname === item.href;
    return (
      <Link
        href={item.href}
        className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-semibold ${
          active ? 'text-indigo-400' : 'text-slate-400'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="truncate max-w-[70px]">{item.label}</span>
        {item.badge ? (
          <span className="absolute top-0.5 right-1/4 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-[9px] leading-4 text-black font-bold text-center">
            {item.badge}
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-slate-950/95 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-stretch h-16">
          {tabs.slice(0, 2).map((item) => (
            <Tab key={item.href} item={item} />
          ))}
          <div className="flex flex-1 items-center justify-center">
            <button
              type="button"
              onClick={onOpenScanner}
              aria-label="QR skaner"
              className="-mt-6 w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 flex items-center justify-center active:scale-95 transition"
            >
              <QrCode className="w-7 h-7" />
            </button>
          </div>
          {tabs.slice(2, 3).map((item) => (
            <Tab key={item.href} item={item} />
          ))}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-semibold text-slate-400"
          >
            <Menu className="w-5 h-5" />
            <span>Menyu</span>
          </button>
        </div>
      </nav>

      {sheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70" onClick={() => setSheetOpen(false)}>
          <div
            className="absolute bottom-0 inset-x-0 rounded-t-2xl border-t border-white/10 bg-slate-950 p-4"
            style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white">Bo‘limlar</span>
              <button type="button" onClick={() => setSheetOpen(false)} className="p-1.5 text-slate-400" aria-label="Yopish">
                <X className="w-5 h-5" />
              </button>
            </div>
            <label className="block mb-3">
              <span className="block text-[11px] font-semibold text-slate-400 mb-1">Ombor</span>
              <select
                value={currentWarehouse ? currentWarehouse.id : ''}
                onChange={(e) => setCurrentWarehouseId(e.target.value || null)}
                className="w-full px-3 py-2.5 bg-slate-900 text-slate-100 border border-white/10 rounded-xl"
              >
                <option value="">{t.allWarehouses}</option>
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-center text-[11px] font-semibold border ${
                      active
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-900 border-white/10 text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
