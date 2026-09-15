'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../lib/store';
import { useI18n } from '../../lib/i18n';
import { RefreshCw, ArrowRight, CheckCircle2, AlertCircle, Warehouse } from 'lucide-react';

export default function TransfersPage() {
  const { productsWithStock, warehouses, executeMovement, movements } = useApp();
  const { t } = useI18n();

  const [productId, setProductId] = useState<string>(productsWithStock[0]?.id || '');
  const [sourceWarehouseId, setSourceWarehouseId] = useState<string>(warehouses[0]?.id || '');
  const [targetWarehouseId, setTargetWarehouseId] = useState<string>(warehouses[1]?.id || '');
  const [quantity, setQuantity] = useState<number>(10);
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedProduct = productsWithStock.find((p) => p.id === productId);
  const sourceWh = warehouses.find((w) => w.id === sourceWarehouseId);
  const targetWh = warehouses.find((w) => w.id === targetWarehouseId);
  const sourceStock = selectedProduct ? selectedProduct.warehouse_stock[sourceWarehouseId] ?? 0 : 0;
  const targetStock = selectedProduct ? selectedProduct.warehouse_stock[targetWarehouseId] ?? 0 : 0;

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (sourceWarehouseId === targetWarehouseId) {
      setErrorMsg('Source and destination cannot be the same.');
      return;
    }

    if (quantity > sourceStock) {
      setErrorMsg(`Available: ${sourceStock}, Requested: ${quantity}`);
      return;
    }

    const res = await executeMovement({
      productId,
      warehouseId: sourceWarehouseId,
      targetWarehouseId,
      movementType: 'transfer',
      quantity: Number(quantity),
      notes: notes || `Transfer: ${sourceWh?.name} -> ${targetWh?.name}`,
    });

    if (!res.success) {
      setErrorMsg(res.error || 'Transfer failed.');
      return;
    }

    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}

    setSuccessMsg(
      `${quantity} ${selectedProduct?.unit} (${sourceWh?.name} -> ${targetWh?.name})`
    );
    setNotes('');
  };

  const transferMovements = movements
    .filter((m) => m.movement_type === 'transfer')
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <RefreshCw className="w-6 h-6 text-indigo-400" /> {t.transferPageTitle}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t.transferPageDesc}
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl">
        <form onSubmit={handleTransfer} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {t.selectProductToRelocate}
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-medium"
            >
              {productsWithStock.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.qr_code_data}) — {t.totalStock}: {p.total_stock} {p.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 bg-slate-950/70 rounded-2xl border border-white/10">
            <div className="md:col-span-2 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.originFacility}
              </span>
              <select
                value={sourceWarehouseId}
                onChange={(e) => setSourceWarehouseId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.name}
                  </option>
                ))}
              </select>
              <div className="text-xs text-slate-400">
                {t.availableStock}{' '}
                <span className="font-bold text-white font-mono">
                  {sourceStock} {selectedProduct?.unit}
                </span>
              </div>
            </div>

            <div className="flex justify-center my-2 md:my-0">
              <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                <ArrowRight className="w-5 h-5 hidden md:block" />
                <RefreshCw className="w-5 h-5 md:hidden" />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.destinationFacility}
              </span>
              <select
                value={targetWarehouseId}
                onChange={(e) => setTargetWarehouseId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.name}
                  </option>
                ))}
              </select>
              <div className="text-xs text-slate-400">
                {t.currentTargetStock}{' '}
                <span className="font-bold text-white font-mono">
                  {targetStock} {selectedProduct?.unit}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {t.quantity} ({selectedProduct?.unit})
              </label>
              <input
                type="number"
                min="1"
                max={sourceStock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {t.notesPlaceholder}
              </label>
              <input
                type="text"
                placeholder={t.notesPlaceholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 text-xs font-black uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> {t.confirmAndExecuteTransfer}
          </button>
        </form>
      </div>

      {/* Recent Transfers Log */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Warehouse className="w-4 h-4 text-indigo-400" /> {t.recentTransfers}
        </h3>

        {transferMovements.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">{t.noMovementsYet}</p>
        ) : (
          <div className="space-y-2">
            {transferMovements.map((tm) => {
              const prod = productsWithStock.find((p) => p.id === tm.product_id);
              const src = warehouses.find((w) => w.id === tm.warehouse_id);
              const tgt = warehouses.find((w) => w.id === tm.target_warehouse_id);

              return (
                <div
                  key={tm.id}
                  className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                      <RefreshCw className="w-3 h-3" />
                    </span>
                    <div>
                      <span className="font-bold text-white">{prod?.name}</span>
                      <span className="text-slate-400 ml-2 font-mono text-[11px]">
                        {tm.quantity} {prod?.unit}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {src?.name} &rarr; <span className="text-indigo-400 font-semibold">{tgt?.name}</span>
                        {tm.notes && <span className="italic ml-2">&bull; {tm.notes}</span>}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(tm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
