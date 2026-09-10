'use client';

import React, { useState } from 'react';
import { useApp } from '../../lib/store';
import { useI18n } from '../../lib/i18n';
import {
  Boxes,
  Search,
  AlertTriangle,
  ArrowDownUp,
  QrCode,
  Edit2,
  Check,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { QuickTransactionModal } from '../../components/QuickTransactionModal';
import { QRModal } from '../../components/QRModal';
import { MatrixStockEditModal } from '../../components/MatrixStockEditModal';
import { ProductWithStock } from '../../lib/types';

export default function InventoryPage() {
  const { productsWithStock, warehouses, adjustStockBalance } = useApp();
  const { t } = useI18n();

  const [search, setSearch] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithStock | null>(null);
  const [qrProduct, setQrProduct] = useState<ProductWithStock | null>(null);
  const [stockEditProduct, setStockEditProduct] = useState<ProductWithStock | null>(null);
  const [inlineEdit, setInlineEdit] = useState<{ productId: string; warehouseId: string } | null>(null);
  const [inlineValue, setInlineValue] = useState<string>('');

  const handleSaveInline = (productId: string, warehouseId: string) => {
    const val = parseFloat(inlineValue);
    if (!isNaN(val)) {
      adjustStockBalance({
        productId,
        warehouseId,
        newQuantity: Math.max(0, val),
        reason: "Ombor matritsasidan tezkor tahrirlandi",
      });
    }
    setInlineEdit(null);
  };

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
                  const isEditing =
                    inlineEdit?.productId === item.id && inlineEdit?.warehouseId === wh.id;

                  return (
                    <td key={wh.id} className="py-2.5 px-3 text-right font-mono">
                      {isEditing ? (
                        <div className="inline-flex items-center justify-end gap-1">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            autoFocus
                            value={inlineValue}
                            onChange={(e) => setInlineValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveInline(item.id, wh.id);
                              if (e.key === 'Escape') setInlineEdit(null);
                            }}
                            className="w-16 px-1.5 py-0.5 text-xs text-right font-mono font-bold bg-slate-950 border border-indigo-400 rounded-md text-white focus:outline-none ring-1 ring-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveInline(item.id, wh.id)}
                            className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                            title="Saqlash (Enter)"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setInlineEdit(null)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            title="Bekor qilish (Esc)"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setInlineEdit({ productId: item.id, warehouseId: wh.id });
                            setInlineValue(String(qty));
                          }}
                          className="inline-flex items-center justify-end gap-1.5 cursor-pointer py-1 px-2 rounded-lg hover:bg-white/10 transition-colors group/cell"
                          title="Miqdorni tahrirlash uchun bosing"
                        >
                          <span
                            className={
                              isWhLow ? 'text-amber-400 font-bold' : 'text-slate-200 font-semibold'
                            }
                          >
                            {qty}
                          </span>
                          <Edit2 className="w-3 h-3 text-indigo-400 opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </td>
                  );
                })}

                <td className="py-3.5 px-4 text-right">
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    {item.total_stock}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => setStockEditProduct(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-600/90 hover:bg-indigo-500 border border-indigo-500/40 rounded-lg transition-colors shadow-sm"
                      title="Matritsa bo'yicha mahsulot sonini to'liq sozlash"
                    >
                      <SlidersHorizontal className="w-3 h-3 text-indigo-200" />
                      <span>Sozlash</span>
                    </button>
                    <button
                      onClick={() => setSelectedProduct(item)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-lg transition-colors"
                      title="Kirim / Chiqim tranzaksiyasi"
                    >
                      <ArrowDownUp className="w-3 h-3 text-slate-400" />
                      <span>{t.stockInOut}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock Edit Modal (Matrix) */}
      <MatrixStockEditModal
        product={stockEditProduct}
        onClose={() => setStockEditProduct(null)}
      />

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
