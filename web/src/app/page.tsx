'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../lib/store';
import { useI18n } from '../lib/i18n';
import {
  Package,
  Boxes,
  AlertTriangle,
  ArrowDownUp,
  QrCode,
  Plus,
  ArrowDownLeft,
  Warehouse,
  ExternalLink,
} from 'lucide-react';
import { QuickTransactionModal } from '../components/QuickTransactionModal';
import { ProductWithStock } from '../lib/types';

export default function DashboardPage() {
  const {
    productsWithStock,
    lowStockItems,
    warehouses,
    movements,
  } = useApp();

  const { t } = useI18n();

  const [selectedProductForAction, setSelectedProductForAction] = useState<ProductWithStock | null>(null);

  const totalProductsCount = productsWithStock.length;
  const totalStockUnits = productsWithStock.reduce((sum, p) => sum + p.total_stock, 0);
  const totalMovementsCount = movements.length;

  const recentMovements = movements.slice(0, 6);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-900/60 via-slate-900/80 to-purple-950/60 border border-white/10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-indigo-300 uppercase bg-indigo-500/10 rounded-full border border-indigo-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {t.heroBadge}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.heroTitle}
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-xl">
              {t.heroDesc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" /> {t.addProductBtn}
            </Link>
            <Link
              href="/transactions"
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-white/10 transition-all"
            >
              <ArrowDownUp className="w-4 h-4 text-emerald-400" /> {t.stockInOutBtn}
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Products */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.kpiCatalog}</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">{totalProductsCount}</div>
          <span className="text-[11px] text-indigo-400 flex items-center gap-1 mt-1">
            <QrCode className="w-3 h-3" /> {t.kpiQrTagged}
          </span>
        </div>

        {/* Total Stock Units */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.kpiTotalOnHand}</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-3">{totalStockUnits.toLocaleString()}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {warehouses.length} {t.kpiFacilities}
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.kpiLowStock}</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 mt-3">{lowStockItems.length}</div>
          <span className="text-[11px] text-amber-400/80 mt-1 block">
            {t.kpiThresholdDesc}
          </span>
        </div>

        {/* Ledger Transactions */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.kpiLedger}</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <ArrowDownUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">{totalMovementsCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {t.kpiLedgerDesc}
          </span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Low Stock Alerts and Action */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {t.attentionRequired}
                  </h3>
                  <p className="text-xs text-slate-400">{t.restockAdvice}</p>
                </div>
              </div>
              <Link
                href="/inventory"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {t.viewMatrix} <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl border border-white/5">
                {t.noAlerts}
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-slate-500 m-2.5" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white flex items-center gap-2">
                          {item.name}
                          <span className="font-mono text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded">
                            {item.qr_code_data}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {t.totalStock}: <span className="text-rose-400 font-bold">{item.total_stock} {item.unit}</span> &bull; {t.safetyMin}: {item.min_stock_level} {item.unit}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedProductForAction(item)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1"
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" /> {t.quickRestock}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warehouse Facility Balances Overview */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-indigo-400" /> {t.activeDistribution}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {warehouses.map((wh) => {
                const totalInWh = productsWithStock.reduce((sum, p) => sum + (p.warehouse_stock[wh.id] || 0), 0);
                return (
                  <div key={wh.id} className="p-4 bg-slate-900/60 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-white block truncate">{wh.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">{wh.address}</span>
                    <div className="text-xl font-black text-indigo-400 mt-2">
                      {totalInWh.toLocaleString()} <span className="text-xs text-slate-400">{t.units}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Movements */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ArrowDownUp className="w-4 h-4 text-indigo-400" /> {t.recentMovements}
            </h3>
            <Link href="/transactions" className="text-xs text-indigo-400 hover:text-indigo-300">
              {t.fullLedger}
            </Link>
          </div>

          <div className="space-y-3">
            {recentMovements.map((mov) => {
              const product = productsWithStock.find((p) => p.id === mov.product_id);
              const wh = warehouses.find((w) => w.id === mov.warehouse_id);

              return (
                <div key={mov.id} className="p-3 bg-slate-900/60 rounded-xl border border-white/5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        mov.movement_type === 'inbound'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : mov.movement_type === 'outbound'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}
                    >
                      {mov.movement_type === 'inbound' ? t.stockIn.split(' ')[0] : mov.movement_type === 'outbound' ? t.stockOut.split(' ')[0] : t.transfer}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(mov.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="font-semibold text-slate-200 truncate">
                    {product?.name || 'Item'}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-between">
                    <span>
                      {t.quantity}: <span className="text-white font-bold">{mov.quantity} {product?.unit}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[110px]">{wh?.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Action Modal */}
      {selectedProductForAction && (
        <QuickTransactionModal
          product={selectedProductForAction}
          onClose={() => setSelectedProductForAction(null)}
        />
      )}
    </div>
  );
}
