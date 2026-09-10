'use client';

import React, { useState } from 'react';
import { useApp } from '../../lib/store';
import { useI18n } from '../../lib/i18n';
import { Boxes, Search, AlertTriangle, ArrowDownUp, QrCode } from 'lucide-react';
import { QuickTransactionModal } from '../../components/QuickTransactionModal';
import { QRModal } from '../../components/QRModal';
import { ProductWithStock } from '../../lib/types';

export default function InventoryPage() {
  const { productsWithStock, warehouses } = useApp();
  const { t } = useI18n();

  const [search, setSearch] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithStock | null>(null);
  const [qrProduct, setQrProduct] = useState<ProductWithStock | null>(null);

  const filtered = productsWithStock.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.qr_code_data.toLowerCase().includes(search.toLowerCase());
    const matchesLowStock = !showLowStockOnly || p.is_low_stock;
    return matchesSearch && matchesLowStock;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-indigo-400" /> {t.inventory}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.stockByWarehouse} &bull; {t.activeDistribution}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 glass-panel rounded-2xl border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" /> {t.lowStockAlerts}
            </span>
          </label>
        </div>
      </div>

      {/* Inventory Matrix Table */}
      <div className="overflow-x-auto glass-panel rounded-2xl border border-white/10 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-white/10">
            <tr>
              <th className="py-3.5 px-4">{t.productName} / QR</th>
              <th className="py-3.5 px-3">{t.unitField}</th>
              <th className="py-3.5 px-3 text-center">{t.safetyMin}</th>
              {warehouses.map((wh) => (
                <th key={wh.id} className="py-3.5 px-4 text-right">
                  {wh.name}
                </th>
              ))}
              <th className="py-3.5 px-4 text-right">{t.totalBalance}</th>
              <th className="py-3.5 px-4 text-center">{t.quickActionTitle}</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-white/[0.02] transition-colors group"
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQrProduct(item)}
                      className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                      title={t.viewQrPrint}
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        {item.name}
                        {item.is_low_stock && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/30">
                            {t.lowBadge}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">{item.qr_code_data}</span>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-3 capitalize text-slate-300">{item.unit}</td>

                <td className="py-3.5 px-3 text-center text-slate-400 font-mono">
                  {item.min_stock_level}
                </td>

                {warehouses.map((wh) => {
                  const qty = item.warehouse_stock[wh.id] ?? 0;
                  const isWhLow = qty <= item.min_stock_level;
                  return (
                    <td key={wh.id} className="py-3.5 px-4 text-right font-mono">
                      <span className={isWhLow ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {qty}
                      </span>
                    </td>
                  );
                })}

                <td className="py-3.5 px-4 text-right">
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    {item.total_stock}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => setSelectedProduct(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-md shadow-indigo-600/20"
                  >
                    <ArrowDownUp className="w-3 h-3" /> {t.stockInOut}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <QuickTransactionModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {qrProduct && (
        <QRModal
          product={qrProduct}
          onClose={() => setQrProduct(null)}
        />
      )}
    </div>
  );
}
