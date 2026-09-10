'use client';

import React from 'react';
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
} from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../lib/i18n';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { lowStockItems, currentUser, correctionRequests } = useApp();
  const { t } = useI18n();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const pendingCorrections = correctionRequests.filter((r) => r.status === 'pending').length;

  const navItems = [
    { label: t.dashboard, href: '/', icon: LayoutDashboard, roles: ['admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher'] },
    { label: t.products, href: '/products', icon: Package, roles: ['admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher'] },
    {
      label: t.inventory,
      href: '/inventory',
      icon: Boxes,
      badge: mounted && lowStockItems.length > 0 ? `${lowStockItems.length} ${t.lowBadge}` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      roles: ['admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher'],
    },
    {
      label: t.stockInOut,
      href: '/transactions',
      icon: ArrowDownUp,
      badge: mounted && (currentUser.role === 'admin' || currentUser.role === 'warehouse_manager') && pendingCorrections > 0
        ? `${pendingCorrections} so'rov`
        : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      roles: ['admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher'],
    },
    { label: t.transfers, href: '/transfers', icon: RefreshCw, roles: ['admin', 'warehouse_manager', 'warehouse_staff'] },
    { label: (t as any).invoices || 'Yuk Xatlari', href: '/invoices', icon: ReceiptText, roles: ['admin', 'warehouse_manager', 'warehouse_staff', 'dispatcher'] },
    { label: t.reports, href: '/reports', icon: FileSpreadsheet, roles: ['admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher'] },
    { label: t.qrLab, href: '/qr-lab', icon: Printer, roles: ['admin', 'warehouse_manager', 'warehouse_staff'] },
    {
      label: (t as any).auditLogs || 'Audit Jurnali',
      href: '/audit-logs',
      icon: ShieldCheck,
      roles: ['admin', 'warehouse_manager'],
    },
    // Admin route only shown to system admin, never to staff
    ...(currentUser.role === 'admin'
      ? [{ label: 'Admin Boshqaruvi (PIN)', href: '/admin', icon: KeyRound, roles: ['admin'] }]
      : []),
  ].filter((item) => item.roles.includes(currentUser.role));

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col border-r border-white/10 glass-panel bg-slate-950/60 p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 block">
          {t.navModules}
        </span>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Supabase Status Footer Card */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-white">{t.databaseActive}</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            {t.databaseDesc}
          </p>
        </div>
      </div>
    </aside>
  );
};
