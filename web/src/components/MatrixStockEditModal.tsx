'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/store';
import { useI18n } from '../lib/i18n';
import { ProductWithStock } from '../lib/types';
import {
  X,
  Boxes,
  CheckCircle2,
  AlertCircle,
  Warehouse as WarehouseIcon,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Layers,
  Calendar,
  Thermometer,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatrixStockEditModalProps {
  product: ProductWithStock | null;
  onClose: () => void;
}

export const MatrixStockEditModal: React.FC<MatrixStockEditModalProps> = ({
  product,
  onClose,
}) => {
  const { warehouses, adjustStockBalance, updateProduct, recordLoginLog } = useApp();
  const { t } = useI18n();

  const [quantities, setQuantities] = useState<{ [whId: string]: number }>({});
  const [reason, setReason] = useState<string>('Inventarizatsiya qayta hisobi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [manufactureDate, setManufactureDate] = useState('');
  const [storageConditions, setStorageConditions] = useState('');

  const STORAGE_PRESETS = [
    t.storagePresetRefrigerated,
    t.storagePresetRoom,
    t.storagePresetDryDark,
    t.storagePresetKeepDry,
  ];

  useEffect(() => {
    if (product) {
      const initialMap: { [whId: string]: number } = {};
      warehouses.forEach((wh) => {
        initialMap[wh.id] = Number(product.warehouse_stock[wh.id] ?? 0);
      });
      setQuantities(initialMap);
      setManufactureDate(product.manufacture_date || '');
      setStorageConditions(product.storage_conditions || '');
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [product, warehouses]);

  if (!product) return null;

  const handleQtyChange = (whId: string, value: number) => {
    const cleanVal = Math.max(0, Math.round(value * 1000) / 1000 || 0);
    setQuantities((prev) => ({
      ...prev,
      [whId]: cleanVal,
    }));
  };

  const handleIncrement = (whId: string, amount: number) => {
    const current = quantities[whId] ?? 0;
    handleQtyChange(whId, current + amount);
  };

  const oldTotal = product.total_stock;
  const newTotal = Object.values(quantities).reduce((sum, q) => sum + (Number(q) || 0), 0);
  const totalDiff = newTotal - oldTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const newMfgDate = manufactureDate || null;
    const newStorage = storageConditions.trim() || null;
    const mfgChanged = newMfgDate !== (product.manufacture_date || null);
    const storageChanged = newStorage !== (product.storage_conditions || null);

    if (mfgChanged && newMfgDate) {
      if (newMfgDate > new Date().toISOString().slice(0, 10)) {
        setErrorMessage("Ishlab chiqarilgan sana kelajakdagi sana bo'lishi mumkin emas.");
        setIsSubmitting(false);
        return;
      }
      if (product.expiry_date && newMfgDate > product.expiry_date) {
        setErrorMessage("Ishlab chiqarilgan sana yaroqlilik muddatidan keyin bo'lishi mumkin emas.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      let changesCount = 0;
      warehouses.forEach((wh) => {
        const oldVal = Number(product.warehouse_stock[wh.id] ?? 0);
        const newVal = Number(quantities[wh.id] ?? 0);
        if (oldVal !== newVal) {
          adjustStockBalance({
            productId: product.id,
            warehouseId: wh.id,
            newQuantity: newVal,
            reason: reason.trim() || undefined,
          });
          changesCount++;
        }
      });

      if (mfgChanged || storageChanged) {
        updateProduct(product.id, {
          ...(mfgChanged ? { manufacture_date: newMfgDate } : {}),
          ...(storageChanged ? { storage_conditions: newStorage } : {}),
        });
        recordLoginLog('movement_created', {
          action: 'matrix_product_info_updated',
          product_name: product.name,
          ...(mfgChanged
            ? { old_manufacture_date: product.manufacture_date || null, new_manufacture_date: newMfgDate }
            : {}),
          ...(storageChanged
            ? { old_storage_conditions: product.storage_conditions || null, new_storage_conditions: newStorage }
            : {}),
          reason: reason.trim() || null,
        });
        changesCount++;
      }

      if (changesCount > 0) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
        setSuccessMessage("O'zgarishlar muvaffaqiyatli saqlandi!");
        setTimeout(() => {
          setIsSubmitting(false);
          onClose();
        }, 1200);
      } else {
        setIsSubmitting(false);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Miqdorni o'zgartirishda xatolik yuz berdi!");
      setIsSubmitting(false);
    }
  };

  const presetReasons = [
    'Inventarizatsiya qayta hisobi',
    'Yaroqsizlik / Zararlanish hisobdan chiqarildi',
    'Yetkazib beruvchidan qo\'shimcha qabul',
    'Hujjatdagi texnik tafovut tuzatildi',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl p-6 sm:p-7 rounded-3xl glass-panel border border-indigo-500/30 bg-slate-950/95 shadow-2xl text-slate-100 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
            <Boxes className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Ombor Matritsasi: Mahsulotni Tuzatish
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium line-clamp-1">
              {product.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {product.qr_code_data}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-semibold">
                Birlik: {product.unit}
              </span>
            </div>
          </div>
        </div>

        {/* Success Notice */}
        {successMessage && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/20 text-rose-300 text-xs border border-rose-500/30 flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Warehouses Grid */}
          <div className="space-y-2.5 max-h-[48vh] overflow-y-auto pr-1">
            {warehouses.map((wh) => {
              const currentQty = quantities[wh.id] ?? 0;
              const originalQty = Number(product.warehouse_stock[wh.id] ?? 0);
              const diff = currentQty - originalQty;

              return (
                <div
                  key={wh.id}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <WarehouseIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{wh.name}</div>
                      <div className="text-[10px] text-slate-400">
                        Eski qoldiq: <span className="font-mono text-slate-300">{originalQty} {product.unit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Quick Step Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleIncrement(wh.id, -10)}
                        className="px-1.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-[10px] font-mono"
                        title="-10"
                      >
                        -10
                      </button>
                      <button
                        type="button"
                        onClick={() => handleIncrement(wh.id, -1)}
                        className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                        title="-1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Numeric Input */}
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={currentQty}
                      onChange={(e) => handleQtyChange(wh.id, parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1.5 text-center text-xs font-mono font-bold bg-slate-950 border border-indigo-500/40 rounded-xl text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                    />

                    {/* Quick Step Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleIncrement(wh.id, 1)}
                        className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                        title="+1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleIncrement(wh.id, 10)}
                        className="px-1.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-[10px] font-mono"
                        title="+10"
                      >
                        +10
                      </button>
                    </div>

                    {/* Diff pill */}
                    {diff !== 0 && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          diff > 0
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Balance Summary Box */}
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Jami qoldiq (Barcha omborlar):</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono line-through">{oldTotal}</span>
              <span className="font-black text-sm text-emerald-400 font-mono">{newTotal} {product.unit}</span>
              {totalDiff !== 0 && (
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  totalDiff > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  ({totalDiff > 0 ? `+${totalDiff}` : totalDiff})
                </span>
              )}
            </div>
          </div>

          {/* Manufacture date & storage temperature */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.manufactureDate}</span>
              </label>
              <input
                type="date"
                value={manufactureDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setManufactureDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                Eski: <span className="font-mono">{product.manufacture_date || '—'}</span>
              </p>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Saqlash harorati / sharoiti</span>
              </label>
              <input
                type="text"
                value={storageConditions}
                onChange={(e) => setStorageConditions(e.target.value)}
                placeholder="Masalan: +2°C...+8°C"
                className="w-full px-3 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <p className="mt-1 text-[10px] text-slate-500 truncate">
                Eski: {product.storage_conditions || '—'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 -mt-1">
            {STORAGE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setStorageConditions(preset)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                  storageConditions === preset
                    ? 'bg-cyan-600/30 text-cyan-200 border-cyan-500/50 font-semibold'
                    : 'bg-slate-900/60 text-slate-400 border-white/5 hover:border-white/20'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Reason Input & Preset Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              O'zgartirish sababi:
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Masalan: Inventarizatsiya qayta hisobi..."
              className="w-full px-3 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {presetReasons.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setReason(preset)}
                  className={`text-[10px] px-2 py-0.8 rounded-lg border transition-all ${
                    reason === preset
                      ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                      : 'bg-slate-900/60 text-slate-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.02] disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
