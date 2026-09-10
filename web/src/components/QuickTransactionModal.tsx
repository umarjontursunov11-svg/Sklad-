'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ProductWithStock, MovementType } from '../lib/types';
import { useApp } from '../lib/store';
import { useI18n } from '../lib/i18n';
import {
  X,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Warehouse as WhIcon,
  CheckCircle2,
  AlertCircle,
  History,
  Tag,
} from 'lucide-react';

interface QuickTransactionModalProps {
  product: ProductWithStock | null;
  onClose: () => void;
}

export const QuickTransactionModal: React.FC<QuickTransactionModalProps> = ({
  product,
  onClose,
}) => {
  const { warehouses, currentWarehouse, movements, executeMovement } = useApp();
  const { t } = useI18n();

  const [movementType, setMovementType] = useState<MovementType>('inbound');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>(
    currentWarehouse ? currentWarehouse.id : warehouses[0]?.id || ''
  );
  const [targetWarehouseId, setTargetWarehouseId] = useState<string>(
    warehouses[1]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(10);
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!product) return null;

  const productMovements = movements
    .filter((m) => m.product_id === product.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const lastTransaction = productMovements[0] || null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = executeMovement({
      productId: product.id,
      warehouseId: selectedWarehouseId,
      targetWarehouseId: movementType === 'transfer' ? targetWarehouseId : null,
      movementType,
      quantity: Number(quantity),
      notes,
    });

    if (!result.success) {
      setErrorMsg(result.error || 'Transaction failed');
      return;
    }

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {}

    const actionText =
      movementType === 'inbound'
        ? `${t.confirmStockIn} (+${quantity} ${product.unit})`
        : movementType === 'outbound'
        ? `${t.confirmStockOut} (-${quantity} ${product.unit})`
        : `${t.confirmTransfer} (${quantity} ${product.unit})`;

    setSuccessMsg(actionText);
    setNotes('');
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 p-6 overflow-hidden rounded-2xl glass-panel border border-white/10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Hero Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-5 border-b border-white/10">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-800 border border-white/10 flex-shrink-0">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <Tag className="w-8 h-8" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                {product.qr_code_data}
              </span>
              {product.is_low_stock && (
                <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {t.lowBadge}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white truncate">{product.name}</h2>
            <p className="text-xs text-slate-400 line-clamp-1">{product.description}</p>
          </div>

          {/* Consolidated Stock Pill */}
          <div className="text-right sm:pl-4 sm:border-l border-white/10">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              {t.totalBalance}
            </span>
            <div className="text-2xl font-black text-emerald-400">
              {product.total_stock}{' '}
              <span className="text-xs font-semibold text-slate-400 capitalize">
                {product.unit}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              {t.safetyMin}: {product.min_stock_level} {product.unit}
            </span>
          </div>
        </div>

        {/* Multi-Warehouse Stock Breakdown */}
        <div className="my-5">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <WhIcon className="w-3.5 h-3.5 text-indigo-400" /> {t.stockByWarehouse}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {warehouses.map((wh) => {
              const qty = product.warehouse_stock[wh.id] ?? 0;
              const isLow = qty <= product.min_stock_level;
              return (
                <div
                  key={wh.id}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedWarehouseId === wh.id
                      ? 'bg-indigo-950/40 border-indigo-500/50'
                      : 'bg-slate-900/50 border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="truncate">{wh.name}</span>
                    {isLow && <span className="text-[10px] font-bold text-amber-400">{t.lowBadge}</span>}
                  </div>
                  <div className="text-lg font-bold text-white">
                    {qty} <span className="text-xs text-slate-400">{product.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Transaction Action Card */}
        <div className="p-4 bg-slate-950/70 rounded-xl border border-white/10 my-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              {t.quickActionTitle}
            </span>

            {/* Action Type Toggle */}
            <div className="flex p-0.5 bg-slate-900 rounded-lg border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setMovementType('inbound')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-colors ${
                  movementType === 'inbound'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" /> {t.stockIn.split(' ')[0]}
              </button>
              <button
                type="button"
                onClick={() => setMovementType('outbound')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-colors ${
                  movementType === 'outbound'
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" /> {t.stockOut.split(' ')[0]}
              </button>
              <button
                type="button"
                onClick={() => setMovementType('transfer')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-colors ${
                  movementType === 'transfer'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" /> {t.transfer}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  {movementType === 'transfer' ? t.sourceWarehouse : t.warehouseLocation}
                </label>
                <select
                  value={selectedWarehouseId}
                  onChange={(e) => setSelectedWarehouseId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                >
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name} ({product.warehouse_stock[wh.id] ?? 0} {product.unit})
                    </option>
                  ))}
                </select>
              </div>

              {movementType === 'transfer' ? (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    {t.destinationWarehouse}
                  </label>
                  <select
                    value={targetWarehouseId}
                    onChange={(e) => setTargetWarehouseId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    {warehouses
                      .filter((w) => w.id !== selectedWarehouseId)
                      .map((wh) => (
                        <option key={wh.id} value={wh.id}>
                          {wh.name} ({product.warehouse_stock[wh.id] ?? 0} {product.unit})
                        </option>
                      ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    {t.quantity} ({product.unit})
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-bold"
                    />
                    <div className="flex gap-1">
                      {[1, 5, 10, 50].map((quickVal) => (
                        <button
                          key={quickVal}
                          type="button"
                          onClick={() => setQuantity(quickVal)}
                          className="px-2 py-1.5 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-white/5"
                        >
                          +{quickVal}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder={t.notesPlaceholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-lg ${
                movementType === 'inbound'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : movementType === 'outbound'
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
              }`}
            >
              {movementType === 'inbound'
                ? `${t.confirmStockIn} (+${quantity} ${product.unit})`
                : movementType === 'outbound'
                ? `${t.confirmStockOut} (-${quantity} ${product.unit})`
                : `${t.confirmTransfer} (${quantity} ${product.unit})`}
            </button>
          </form>
        </div>

        {/* Transaction History / Last 5 Movements Timeline */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-indigo-400" /> {t.timelineTitle}
            </h4>
            {lastTransaction && (
              <span className="text-[11px] text-slate-400">
                {t.lastActivity} {new Date(lastTransaction.timestamp).toLocaleDateString()} at{' '}
                {new Date(lastTransaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          {productMovements.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">{t.noMovementsYet}</p>
          ) : (
            <div className="space-y-2">
              {productMovements.map((m) => {
                const wh = warehouses.find((w) => w.id === m.warehouse_id);
                const targetWh = m.target_warehouse_id
                  ? warehouses.find((w) => w.id === m.target_warehouse_id)
                  : null;

                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2.5 bg-slate-900/40 rounded-lg border border-white/5 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`p-1.5 rounded-md ${
                          m.movement_type === 'inbound'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : m.movement_type === 'outbound'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-indigo-500/20 text-indigo-400'
                        }`}
                      >
                        {m.movement_type === 'inbound' ? (
                          <ArrowDownLeft className="w-3 h-3" />
                        ) : m.movement_type === 'outbound' ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <RefreshCw className="w-3 h-3" />
                        )}
                      </span>

                      <div>
                        <div className="font-semibold text-slate-200">
                          <span className="capitalize">{m.movement_type}</span>: {m.quantity} {product.unit}
                          {m.movement_type === 'transfer' && targetWh && (
                            <span className="text-slate-400 font-normal">
                              {' '}
                              ({wh?.name} &rarr; {targetWh?.name})
                            </span>
                          )}
                          {m.movement_type !== 'transfer' && wh && (
                            <span className="text-slate-400 font-normal"> at {wh.name}</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          By <span className="text-slate-300">{m.user_name || 'Staff'}</span>
                          {m.notes && <span> &bull; {m.notes}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
