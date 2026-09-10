'use client';

import React, { useState } from 'react';
import { useApp } from '../../lib/store';
import { useI18n } from '../../lib/i18n';
import {
  ArrowDownUp,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Search,
  Plus,
} from 'lucide-react';
import { QuickTransactionModal } from '../../components/QuickTransactionModal';
import { ProductWithStock } from '../../lib/types';

export default function TransactionsPage() {
  const { movements, productsWithStock, warehouses } = useApp();
  const { t } = useI18n();

  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductWithStock | null>(null);

  const filteredMovements = movements.filter((m) => {
    const product = productsWithStock.find((p) => p.id === m.product_id);
    const matchesType = filterType === 'all' || m.movement_type === filterType;
    const matchesSearch =
      !search ||
      (product && product.name.toLowerCase().includes(search.toLowerCase())) ||
      (product && product.qr_code_data.toLowerCase().includes(search.toLowerCase())) ||
      (m.notes && m.notes.toLowerCase().includes(search.toLowerCase()));

    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ArrowDownUp className="w-6 h-6 text-indigo-400" /> {t.stockInOut}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.heroDesc}
          </p>
        </div>

        <button
          onClick={() => setSelectedProduct(productsWithStock[0] || null)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> {t.quickActionTitle}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 glass-panel rounded-2xl border border-white/10">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Movement Type Filter Tabs */}
        <div className="flex p-1 bg-slate-900 rounded-xl border border-white/10 text-xs w-full md:w-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'inbound', label: t.stockIn.split(' ')[0] },
            { id: 'outbound', label: t.stockOut.split(' ')[0] },
            { id: 'transfer', label: t.transfer },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
                filterType === tab.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Movements Table */}
      <div className="overflow-x-auto glass-panel rounded-2xl border border-white/10 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-white/10">
            <tr>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">{t.productName}</th>
              <th className="py-3.5 px-3">{t.quantity}</th>
              <th className="py-3.5 px-4">{t.warehouseLocation}</th>
              <th className="py-3.5 px-4">Operator</th>
              <th className="py-3.5 px-4">Date & Time</th>
              <th className="py-3.5 px-4">Notes</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {filteredMovements.map((m) => {
              const product = productsWithStock.find((p) => p.id === m.product_id);
              const srcWh = warehouses.find((w) => w.id === m.warehouse_id);
              const tgtWh = m.target_warehouse_id
                ? warehouses.find((w) => w.id === m.target_warehouse_id)
                : null;

              return (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                        m.movement_type === 'inbound'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : m.movement_type === 'outbound'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      }`}
                    >
                      {m.movement_type === 'inbound' ? (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      ) : m.movement_type === 'outbound' ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5" />
                      )}
                      {m.movement_type}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white truncate max-w-[200px]">
                      {product?.name || 'Unknown Item'}
                    </div>
                    <span className="font-mono text-[10px] text-indigo-400">
                      {product?.qr_code_data}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-white">
                    {m.quantity} <span className="text-slate-400 text-[10px]">{product?.unit}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    {m.movement_type === 'transfer' && tgtWh ? (
                      <span className="text-slate-300">
                        {srcWh?.name} &rarr; <span className="text-indigo-400 font-bold">{tgtWh.name}</span>
                      </span>
                    ) : (
                      <span className="text-slate-300">{srcWh?.name}</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    {m.user_name || 'Staff User'}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(m.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 italic max-w-[180px] truncate">
                    {m.notes || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <QuickTransactionModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
