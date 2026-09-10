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
  ShieldCheck,
  Clock,
  Laptop,
  AlertCircle,
  FileEdit,
  Check,
  X,
  User,
  Filter,
} from 'lucide-react';
import { QuickTransactionModal } from '../../components/QuickTransactionModal';
import { ProductWithStock, StockMovement, CorrectionRequest } from '../../lib/types';

export default function TransactionsPage() {
  const {
    movements,
    productsWithStock,
    warehouses,
    currentUser,
    users,
    correctionRequests,
    submitCorrectionRequest,
    reviewCorrectionRequest,
  } = useApp();
  const { t } = useI18n();

  const isStaff = currentUser.role === 'receiver' || currentUser.role === 'dispatcher';
  const isManagerOrAdmin = currentUser.role === 'admin' || currentUser.role === 'warehouse_manager';

  const [activeTab, setActiveTab] = useState<'movements' | 'corrections'>('movements');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStaffId, setFilterStaffId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductWithStock | null>(null);

  // Correction Request Modal
  const [correctionTargetMovement, setCorrectionTargetMovement] = useState<StockMovement | null>(null);
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionNewQty, setCorrectionNewQty] = useState<number>(1);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [requestFeedback, setRequestFeedback] = useState<{ success?: string; error?: string } | null>(null);

  // Manager Review State
  const [reviewModalTarget, setReviewModalTarget] = useState<CorrectionRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // 1. Role-based movement visibility
  const baseMovements = isStaff
    ? movements.filter((m) => m.user_id === currentUser.id)
    : movements;

  const filteredMovements = baseMovements.filter((m) => {
    const product = productsWithStock.find((p) => p.id === m.product_id);
    const matchesType = filterType === 'all' || m.movement_type === filterType;
    const matchesStaff = filterStaffId === 'all' || m.user_id === filterStaffId;
    const matchesSearch =
      !search ||
      (product && product.name.toLowerCase().includes(search.toLowerCase())) ||
      (product && product.qr_code_data.toLowerCase().includes(search.toLowerCase())) ||
      (m.notes && m.notes.toLowerCase().includes(search.toLowerCase())) ||
      (m.user_name && m.user_name.toLowerCase().includes(search.toLowerCase())) ||
      (m.employee_id && m.employee_id.toLowerCase().includes(search.toLowerCase()));

    return matchesType && matchesStaff && matchesSearch;
  });

  const pendingCorrections = correctionRequests.filter((r) => r.status === 'pending');
  const visibleCorrections = isStaff
    ? correctionRequests.filter((r) => r.requested_by === currentUser.id)
    : correctionRequests;

  const handleOpenCorrection = (m: StockMovement) => {
    setCorrectionTargetMovement(m);
    setCorrectionNewQty(m.quantity);
    setCorrectionReason('');
    setCorrectionNotes('');
    setRequestFeedback(null);
  };

  const handleSendCorrectionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionTargetMovement) return;

    const res = submitCorrectionRequest({
      movementId: correctionTargetMovement.id,
      reason: correctionReason,
      requestedChanges: {
        quantity: Number(correctionNewQty),
        notes: correctionNotes || undefined,
      },
    });

    if (!res.success) {
      setRequestFeedback({ error: res.error || "Xatolik yuz berdi" });
    } else {
      setRequestFeedback({ success: "Tuzatish so'rovi ombor mudiriga muvaffaqiyatli yuborildi!" });
      setTimeout(() => {
        setCorrectionTargetMovement(null);
        setRequestFeedback(null);
      }, 1500);
    }
  };

  const handleReviewAction = (status: 'approved' | 'rejected') => {
    if (!reviewModalTarget) return;

    const res = reviewCorrectionRequest({
      requestId: reviewModalTarget.id,
      status,
      reviewNotes,
    });

    if (res.success) {
      setReviewModalTarget(null);
      setReviewNotes('');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ArrowDownUp className="w-6 h-6 text-indigo-400" /> {t.stockInOut}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isStaff
              ? "Shaxsiy operatsiyalar jurnali. Har bir amal shaxsiy hisobingizga biriktiriladi."
              : "To'liq ombor tranzaksiyalari auditi va xodimlar harakati hisobi."}
          </p>
        </div>

        <button
          onClick={() => setSelectedProduct(productsWithStock[0] || null)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> {t.quickActionTitle}
        </button>
      </div>

      {/* Staff Notice Banner */}
      {isStaff && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-slate-300 leading-relaxed">
            <span className="font-bold text-amber-300">Xavfsizlik eslatmasi: </span>
            Siz <strong>{currentUser.full_name || currentUser.name}</strong> ({currentUser.employee_id}) sifatida
            tizimdasiz. Omborda kiritilgan yozuvlarni to'g'ridan-to'g'ri o'zgartirish yoki o'chirish taqiqlanadi. Xatolik
            yuz bersa, operatsiya yonidagi <strong>«Tuzatish so'rovi»</strong> tugmasi orqali mudirga rasmiy so'rov
            yuboring.
          </div>
        </div>
      )}

      {/* Mode Tabs (Movements vs Correction Requests) */}
      <div className="flex border-b border-white/10 gap-4">
        <button
          onClick={() => setActiveTab('movements')}
          className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
            activeTab === 'movements' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowDownUp className="w-4 h-4 text-indigo-400" />
          <span>Harakatlar jurnali</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
            {filteredMovements.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('corrections')}
          className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
            activeTab === 'corrections' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileEdit className="w-4 h-4 text-amber-400" />
          <span>Tuzatish so'rovlari</span>
          {pendingCorrections.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
              {pendingCorrections.length} kutilmoqda
            </span>
          )}
        </button>
      </div>

      {activeTab === 'movements' ? (
        <>
          {/* Filter and Search Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 glass-panel rounded-2xl border border-white/10">
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Mahsulot, izoh, xodim yoki EMP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Staff filter for Manager/Admin */}
              {isManagerOrAdmin && (
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={filterStaffId}
                    onChange={(e) => setFilterStaffId(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">Barcha xodimlar</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.full_name || u.name} ({u.employee_id || u.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Movement Type Filter Tabs */}
              <div className="flex p-1 bg-slate-900 rounded-xl border border-white/10 text-xs">
                {[
                  { id: 'all', label: 'Barchasi' },
                  { id: 'inbound', label: t.stockIn.split(' ')[0] },
                  { id: 'outbound', label: t.stockOut.split(' ')[0] },
                  { id: 'transfer', label: t.transfer },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterType(tab.id)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
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
          </div>

          {/* Movements Table */}
          <div className="overflow-x-auto glass-panel rounded-2xl border border-white/10 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Turi</th>
                  <th className="py-3.5 px-4">{t.productName}</th>
                  <th className="py-3.5 px-3">{t.quantity}</th>
                  <th className="py-3.5 px-4">{t.warehouseLocation}</th>
                  <th className="py-3.5 px-4">Ijrochi Xodim</th>
                  <th className="py-3.5 px-4">Vaqt & Qurilma</th>
                  <th className="py-3.5 px-4">Izoh</th>
                  <th className="py-3.5 px-4 text-right">Amal</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-500 italic">
                      Hozircha hech qanday operatsiya qayd etilmagan
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map((m) => {
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

                        {/* Staff Attribution: Full Name & Employee ID */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-200">{m.user_name || 'Xodim'}</span>
                            {m.employee_id && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                                {m.employee_id}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {m.user_id}</div>
                        </td>

                        {/* Timestamp with seconds & Device Type */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>
                              {new Date(m.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                            <Laptop className="w-3 h-3" />
                            <span>{m.device_type || 'web'}</span>
                            <span>&bull;</span>
                            <span>{new Date(m.timestamp).toLocaleDateString()}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-400 text-xs max-w-[200px] truncate">
                          {m.notes || '—'}
                        </td>

                        {/* Action: Request Correction */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleOpenCorrection(m)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 rounded-lg border border-indigo-500/20 transition-colors"
                            title="Xatolik yuz berganda tuzatish so'rovi yuboring"
                          >
                            <FileEdit className="w-3 h-3" />
                            <span>Tuzatish</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Correction Requests Review Panel */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-panel border border-white/10">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Ombor harakatlari tuzatish so'rovlari</span>
            </h3>
            <p className="text-xs text-slate-400">
              Xodimlar kiritgan yozuvlarda xatolik aniqlanganda yuborilgan so'rovlar. Faqat boshqaruvchi tasdig'i bilan
              qoldiqlar avtomatik yangilanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {visibleCorrections.length === 0 ? (
              <div className="p-8 text-center text-slate-500 glass-panel rounded-2xl border border-white/10 italic text-xs">
                Hozircha hech qanday tuzatish so'rovi mavjud emas.
              </div>
            ) : (
              visibleCorrections.map((req) => {
                const targetM = movements.find((m) => m.id === req.movement_id);
                const prod = targetM ? productsWithStock.find((p) => p.id === targetM.product_id) : null;

                return (
                  <div
                    key={req.id}
                    className="p-4 glass-panel rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            req.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                              : req.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {req.status === 'pending'
                            ? 'Kutilmoqda'
                            : req.status === 'approved'
                            ? 'Tasdiqlangan'
                            : 'Rad etilgan'}
                        </span>
                        <span className="text-xs font-bold text-white">
                          Mahsulot: {prod?.name || 'Item'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          (Dastlabki miqdor: {targetM?.quantity} {prod?.unit})
                        </span>
                      </div>

                      <div className="text-xs text-slate-300">
                        <span className="text-slate-400">Sabab: </span>
                        «{req.reason}»
                      </div>

                      {req.requested_changes.quantity !== undefined && (
                        <div className="text-xs text-indigo-300 font-semibold">
                          Taklif etilgan to'g'ri miqdor: {req.requested_changes.quantity} {prod?.unit}
                        </div>
                      )}

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                        <span>Yubordi:</span>
                        <span className="text-slate-300 font-semibold">{req.requester_name}</span>
                        {req.requester_employee_id && (
                          <span className="font-mono text-[9px] px-1.5 bg-cyan-500/10 text-cyan-300 rounded border border-cyan-500/20">
                            {req.requester_employee_id}
                          </span>
                        )}
                        <span>&bull;</span>
                        <span>{new Date(req.created_at).toLocaleString()}</span>
                        {req.reviewer_name && (
                          <>
                            <span>&bull;</span>
                            <span className="text-indigo-400 font-semibold">
                              Tekshiruvchi: {req.reviewer_name}
                            </span>
                            {req.review_notes && <span>(«{req.review_notes}»)</span>}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Review Actions for Manager/Admin */}
                    {isManagerOrAdmin && req.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setReviewModalTarget(req)}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow transition-colors"
                        >
                          Ko'rib chiqish
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Staff Submit Correction Modal */}
      {correctionTargetMovement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl glass-panel border border-white/10 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-indigo-400" />
                <span>Tuzatish so'rovi yuborish</span>
              </h3>
              <button
                onClick={() => setCorrectionTargetMovement(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendCorrectionRequest} className="mt-4 space-y-4">
              <div className="p-3 bg-slate-900/80 rounded-xl text-xs space-y-1 border border-white/5">
                <div className="text-slate-400">
                  Operatsiya ID: <span className="font-mono text-indigo-300">{correctionTargetMovement.id}</span>
                </div>
                <div className="text-white font-bold">
                  Hozirgi miqdor: {correctionTargetMovement.quantity} dona
                </div>
                <div className="text-slate-400">
                  Ijrochi: {currentUser.full_name || currentUser.name} ({currentUser.employee_id})
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  To'g'ri (kutilgan) miqdor *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={correctionNewQty}
                  onChange={(e) => setCorrectionNewQty(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tuzatish sababi (nima sababdan xato bo'ldi) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="Masalan: Qabul paytida 5 quti o'rniga 6 quti yozilib ketgan..."
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {requestFeedback?.error && (
                <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs border border-rose-500/30">
                  {requestFeedback.error}
                </div>
              )}
              {requestFeedback?.success && (
                <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30">
                  {requestFeedback.success}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCorrectionTargetMovement(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  So'rovni jo'natish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manager Review Modal */}
      {reviewModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl glass-panel border border-white/10 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <span>So'rovni ko'rib chiqish</span>
              </h3>
              <button
                onClick={() => setReviewModalTarget(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-slate-900/80 rounded-xl text-xs space-y-1.5 border border-white/5">
                <div>
                  <span className="text-slate-400">Xodim: </span>
                  <span className="text-white font-bold">{reviewModalTarget.requester_name}</span>{' '}
                  <span className="text-cyan-400 font-mono">({reviewModalTarget.requester_employee_id})</span>
                </div>
                <div>
                  <span className="text-slate-400">Sabab: </span>
                  <span className="text-amber-300">«{reviewModalTarget.reason}»</span>
                </div>
                {reviewModalTarget.requested_changes.quantity !== undefined && (
                  <div>
                    <span className="text-slate-400">Taklif etilgan miqdor: </span>
                    <span className="text-emerald-400 font-bold">
                      {reviewModalTarget.requested_changes.quantity} dona
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mudir xulosasi / Izoh (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Masalan: Ombor hisoboti bilan mos keldi, tasdiqlandi"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => handleReviewAction('rejected')}
                  className="px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-colors"
                >
                  Rad etish
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('approved')}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 transition-colors"
                >
                  Tasdiqlash va Qoldiqni Yangilash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <QuickTransactionModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
