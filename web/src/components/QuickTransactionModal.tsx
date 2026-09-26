'use client';

import React, { useMemo, useState } from 'react';
import { ProductSearchSelect } from './ProductSearchSelect';
import { WebCameraScanner } from './WebCameraScanner';
import confetti from 'canvas-confetti';
import { ProductWithStock, MovementType, InvoiceWithItems } from '../lib/types';
import { useApp } from '../lib/store';
import { useI18n } from '../lib/i18n';
import { printWaybill, downloadWaybillPdf } from '../lib/waybill-pdf';
import Link from 'next/link';
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
  ReceiptText,
  Printer,
  Download,
  ExternalLink,
  Plus,
  Trash2,
  QrCode,
} from 'lucide-react';
import { ModalPortal } from './ModalPortal';

interface QuickTransactionModalProps {
  product: ProductWithStock | null;
  onClose: () => void;
}

export const QuickTransactionModal: React.FC<QuickTransactionModalProps> = ({
  product,
  onClose,
}) => {
  const { warehouses, currentWarehouse, movements, executeMovement, createSaleInvoice, currentUser, users, productsWithStock } = useApp();
  const { t } = useI18n();

  // Role-based initial movement type
  const initialType: MovementType =
    currentUser.role === 'receiver'
      ? 'inbound'
      : currentUser.role === 'dispatcher'
      ? 'outbound'
      : 'inbound';

  const [movementType, setMovementType] = useState<MovementType>(initialType);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>(
    currentUser.assigned_warehouse_id ||
    (currentWarehouse ? currentWarehouse.id : warehouses[0]?.id || '')
  );
  const [targetWarehouseId, setTargetWarehouseId] = useState<string>(
    warehouses[1]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(10);
  const [notes, setNotes] = useState<string>('');
  
  // Sale & Invoice fields
  const [isSale, setIsSale] = useState<boolean>(currentUser.role === 'dispatcher');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerInn, setCustomerInn] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<number>(25000);
  const [staffName, setStaffName] = useState<string>(currentUser.full_name || currentUser.name);
  const [createdInvoice, setCreatedInvoice] = useState<InvoiceWithItems | null>(null);

  // Sync staffName whenever the active user account changes
  React.useEffect(() => {
    if (currentUser) {
      setStaffName(currentUser.full_name || currentUser.name);
      if (currentUser.role === 'receiver') {
        setMovementType('inbound');
        setIsSale(false);
      } else if (currentUser.role === 'dispatcher') {
        setMovementType('outbound');
      }
      if (currentUser.assigned_warehouse_id) {
        setSelectedWarehouseId(currentUser.assigned_warehouse_id);
      }
    }
  }, [currentUser]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Additional products in the same operation ("+ Yana tovar qo'shish")
  const [extraItems, setExtraItems] = useState<{ productId: string; quantity: number; unitPrice: number }[]>([]);

  const extraOptions = useMemo(
    () =>
      productsWithStock
        .filter((p) => p.id !== product?.id)
        .map((p) => ({
          id: p.id,
          name: p.name,
          code: p.qr_code_data,
          hint: `${p.warehouse_stock[selectedWarehouseId] ?? 0} ${p.unit}`,
        })),
    [productsWithStock, product?.id, selectedWarehouseId]
  );

  const addExtraItem = () =>
    setExtraItems((prev) => [...prev, { productId: '', quantity: 1, unitPrice: 0 }]);
  const updateExtraItem = (idx: number, patch: Partial<{ productId: string; quantity: number; unitPrice: number }>) =>
    setExtraItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const removeExtraItem = (idx: number) => setExtraItems((prev) => prev.filter((_, i) => i !== idx));

  // "+ Yana tovar qo'shish" via camera: every scan adds a line (or +1 if the product is already listed).
  const [isAddScannerOpen, setIsAddScannerOpen] = useState(false);
  const handleAddScan = (scanned: ProductWithStock) => {
    if (product && scanned.id === product.id) {
      setQuantity((q) => Number(q) + 1);
      return;
    }
    setExtraItems((prev) => {
      const idx = prev.findIndex((it) => it.productId === scanned.id);
      if (idx >= 0) return prev.map((it, i) => (i === idx ? { ...it, quantity: Number(it.quantity) + 1 } : it));
      const emptyIdx = prev.findIndex((it) => !it.productId);
      if (emptyIdx >= 0) return prev.map((it, i) => (i === emptyIdx ? { ...it, productId: scanned.id } : it));
      return [...prev, { productId: scanned.id, quantity: 1, unitPrice: 0 }];
    });
  };

  if (!product) return null;

  // All lines of this operation: the scanned product first, then the added ones.
  type Line = { product: ProductWithStock; quantity: number; unitPrice: number };
  const allLines: Line[] = [{ product, quantity: Number(quantity), unitPrice: Number(unitPrice) }];
  extraItems.forEach((it) => {
    const p = productsWithStock.find((x) => x.id === it.productId);
    if (p) allLines.push({ product: p, quantity: Number(it.quantity), unitPrice: Number(it.unitPrice) });
  });
  const invoiceTotal = allLines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
  const multi = allLines.length > 1;

  // Restricted scan view: Receiver and Dispatcher only see their own movement history
  const isIndividualStaff = currentUser.role === 'receiver' || currentUser.role === 'dispatcher';
  const productMovements = movements
    .filter((m) => m.product_id === product.id && (!isIndividualStaff || m.user_id === currentUser.id))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const lastTransaction = productMovements[0] || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setCreatedInvoice(null);

    if (extraItems.some((it) => !it.productId)) {
      setErrorMsg("Qo'shilgan qatorlarning har birida tovarni tanlang yoki qatorni o'chiring");
      return;
    }
    if (allLines.some((l) => !(l.quantity > 0))) {
      setErrorMsg("Har bir tovar miqdori 0 dan katta bo'lishi kerak");
      return;
    }

    // Check stock for every line before changing anything (chiqim / ko'chirish).
    if (movementType !== 'inbound') {
      const need: Record<string, number> = {};
      allLines.forEach((l) => {
        need[l.product.id] = (need[l.product.id] || 0) + l.quantity;
      });
      for (const l of allLines) {
        const available = l.product.warehouse_stock[selectedWarehouseId] ?? 0;
        if (need[l.product.id] > available) {
          setErrorMsg(`"${l.product.name}" yetarli emas: omborda ${available} ${l.product.unit}, so'ralgan ${need[l.product.id]} ${l.product.unit}`);
          return;
        }
      }
    }

    if (movementType === 'outbound' && isSale) {
      if (!customerName.trim()) {
        setErrorMsg('Mijoz (xaridor) nomini kiriting');
        return;
      }
      if (unitPrice < 0) {
        setErrorMsg("Birlik narxi 0 dan kam bo'lishi mumkin emas");
        return;
      }

      const res = createSaleInvoice({
        warehouseId: selectedWarehouseId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || null,
        customerInn: customerInn.trim() || null,
        notes: notes.trim() || null,
        creatorName: staffName.trim() || currentUser.name,
        createdBy: currentUser.id,
        items: allLines.map((l) => ({
          productId: l.product.id,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        })),
      });

      if (!res.success || !res.invoice) {
        setErrorMsg(res.error || 'Sotuvni rasmiylashtirishda xatolik yuz berdi');
        return;
      }

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      setCreatedInvoice(res.invoice);
      setSuccessMsg(`Sotuv rasmiylashtirildi! Hujjat: ${res.invoice.invoice_number} (${allLines.length} ta tovar)`);
      setNotes('');
      setExtraItems([]);
      return;
    }

    // Same product added twice → one movement with the summed quantity.
    const merged: Line[] = [];
    allLines.forEach((l) => {
      const existing = merged.find((m) => m.product.id === l.product.id);
      if (existing) existing.quantity += l.quantity;
      else merged.push({ ...l });
    });

    let done = 0;
    for (const line of merged) {
      const result = await executeMovement({
        productId: line.product.id,
        warehouseId: selectedWarehouseId,
        targetWarehouseId: movementType === 'transfer' ? targetWarehouseId : null,
        movementType,
        quantity: line.quantity,
        notes,
      });
      if (!result.success) {
        setErrorMsg(
          `"${line.product.name}": ${result.error || 'Transaction failed'}` +
            (done > 0 ? ` (oldingi ${done} ta tovar bajarildi)` : '')
        );
        if (done > 0) setExtraItems([]);
        return;
      }
      done++;
    }

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {}

    const actionText = multi
      ? `${movementType === 'inbound' ? t.confirmStockIn : movementType === 'outbound' ? t.confirmStockOut : t.confirmTransfer} — ${allLines.length} ta tovar`
      : movementType === 'inbound'
        ? `${t.confirmStockIn} (+${quantity} ${product.unit})`
        : movementType === 'outbound'
        ? `${t.confirmStockOut} (-${quantity} ${product.unit})`
        : `${t.confirmTransfer} (${quantity} ${product.unit})`;

    setSuccessMsg(actionText);
    setNotes('');
    setExtraItems([]);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto overscroll-contain p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl my-auto p-6 overflow-hidden rounded-2xl glass-panel border border-white/10 shadow-2xl">
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
              {(currentUser.role !== 'dispatcher') && (
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
              )}
              {(currentUser.role !== 'receiver') && (
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
              )}
              {(currentUser.role !== 'receiver' && currentUser.role !== 'dispatcher') && (
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
              )}
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

            {/* Additional products in the same operation */}
            <div className="space-y-2">
              {extraItems.map((it, idx) => {
                const p = productsWithStock.find((x) => x.id === it.productId);
                return (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 w-5 shrink-0">{idx + 2}.</span>
                      <ProductSearchSelect
                        className="flex-1 min-w-0"
                        options={extraOptions}
                        value={it.productId}
                        onChange={(id) => updateExtraItem(idx, { productId: id })}
                      />
                      <button
                        type="button"
                        onClick={() => removeExtraItem(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10 shrink-0"
                        aria-label="Qatorni o'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 pl-7">
                      <input
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) => updateExtraItem(idx, { quantity: Math.max(1, Number(e.target.value)) })}
                        className="w-24 px-2.5 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white font-bold focus:outline-none focus:border-indigo-500"
                      />
                      <span className="text-[11px] text-slate-400">{p ? p.unit : ''}</span>
                      {movementType === 'outbound' && isSale && (
                        <>
                          <input
                            type="number"
                            min="0"
                            step="500"
                            value={it.unitPrice}
                            onChange={(e) => updateExtraItem(idx, { unitPrice: Math.max(0, Number(e.target.value)) })}
                            className="flex-1 min-w-0 px-2.5 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-emerald-400 font-bold focus:outline-none focus:border-indigo-500"
                            placeholder="Narx (so'm)"
                          />
                          <span className="text-[11px] text-slate-400 shrink-0">so'm</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addExtraItem}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-dashed border-indigo-500/40 rounded-xl"
                >
                  <Plus className="w-4 h-4" /> Yana tovar qo'shish
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddScannerOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-dashed border-emerald-500/40 rounded-xl"
                  title="QR kod orqali qo'shish"
                >
                  <QrCode className="w-4 h-4" /> Skanerlash
                </button>
              </div>
            </div>

            {isAddScannerOpen && (
              <WebCameraScanner
                continuous
                title="Tovarlarni skanerlash"
                onScanSuccess={handleAddScan}
                onClose={() => setIsAddScannerOpen(false)}
              />
            )}

            <div>
              <input
                type="text"
                placeholder={t.notesPlaceholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Outbound Sale / Invoice Toggle & Form */}
            {movementType === 'outbound' && (
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <span className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                    <ReceiptText className="w-4 h-4 text-indigo-400" />
                    Sotuv sifatida rasmiylashtirish (Yuk xati / Tovarnaya nakladnaya)
                  </span>
                  <input
                    type="checkbox"
                    checked={isSale}
                    onChange={(e) => setIsSale(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 bg-slate-900 border-white/20 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </label>

                {isSale && (
                  <div className="pt-2 border-t border-indigo-500/20 space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Mijoz / Xaridor nomi <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="F.I.O yoki Korxona nomi"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Telefon raqami
                        </label>
                        <input
                          type="tel"
                          placeholder="+998 (90) 123-45-67"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          INN / STIR (ixtiyoriy)
                        </label>
                        <input
                          type="text"
                          placeholder="Masalan: 304891234"
                          value={customerInn}
                          onChange={(e) => setCustomerInn(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Birlik sotuv narxi (so'm) <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="500"
                          value={unitPrice}
                          onChange={(e) => setUnitPrice(Math.max(0, Number(e.target.value)))}
                          className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white font-bold text-emerald-400 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Staff / Issuer selector */}
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        Topshirdi / Отпустил (Ombor mas'uli F.I.O) <span className="text-rose-400">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={staffName}
                          onChange={(e) => setStaffName(e.target.value)}
                          placeholder="Ombor xodimi F.I.O"
                          className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white font-medium focus:outline-none focus:border-indigo-500"
                        />
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) setStaffName(e.target.value);
                          }}
                          className="px-2.5 py-1.5 text-xs bg-slate-800 border border-white/10 rounded-lg text-slate-200 focus:outline-none"
                          title="Akkauntlardan tanlash"
                        >
                          <option value="">Akkauntlar...</option>
                          {users.map((u) => (
                            <option key={u.id} value={u.name}>
                              {u.name} ({u.role.replace('_', ' ')})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 rounded-lg border border-white/5 text-xs">
                      <span className="text-slate-400">Jami hisob-faktura summasi:</span>
                      <span className="font-bold text-white text-sm text-emerald-400">
                        {new Intl.NumberFormat('uz-UZ').format(invoiceTotal)} so'm
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

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

            {/* Ready Waybill / Invoice Quick Actions */}
            {createdInvoice && (
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                    <ReceiptText className="w-4 h-4 text-emerald-400" />
                    Hujjat: {createdInvoice.invoice_number}
                  </div>
                  <Link
                    href="/invoices"
                    onClick={onClose}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    Barcha fakturalar <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => printWaybill(createdInvoice)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
                  >
                    <Printer className="w-3.5 h-3.5" /> Chop etish (Print)
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadWaybillPdf(createdInvoice)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-white/10 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF yuklab olish
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-lg ${
                movementType === 'inbound'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : movementType === 'outbound'
                  ? isSale
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
              }`}
            >
              {movementType === 'inbound'
                ? `${t.confirmStockIn} (${multi ? `${allLines.length} ta tovar` : `+${quantity} ${product.unit}`})`
                : movementType === 'outbound'
                ? isSale
                  ? `Sotuvni tasdiqlash va Faktura chiqarish (${new Intl.NumberFormat('uz-UZ').format(invoiceTotal)} so'm)`
                  : `${t.confirmStockOut} (${multi ? `${allLines.length} ta tovar` : `-${quantity} ${product.unit}`})`
                : `${t.confirmTransfer} (${multi ? `${allLines.length} ta tovar` : `${quantity} ${product.unit}`})`}
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
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span>Ijrochi:</span>
                          <span className="text-slate-200 font-semibold">{m.user_name || 'Staff'}</span>
                          {m.employee_id && (
                            <span className="text-[9px] px-1 py-0.2 bg-cyan-500/20 text-cyan-300 font-mono rounded border border-cyan-500/30">
                              {m.employee_id}
                            </span>
                          )}
                          <span className="text-[9px] px-1 py-0.2 bg-slate-800 text-slate-400 rounded">
                            {m.device_type || 'web'}
                          </span>
                          {m.notes && <span>&bull; {m.notes}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono text-right">
                      <div>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                      <div className="text-[9px] text-slate-500">{new Date(m.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
    </ModalPortal>
  );
};
