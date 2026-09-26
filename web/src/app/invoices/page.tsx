'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../lib/store';
import { useI18n } from '../../lib/i18n';
import { InvoiceWithItems, InvoiceStatus } from '../../lib/types';
import { printWaybill, downloadWaybillPdf, getCompanyInfo, saveCompanyInfo, CompanyInfo, DEFAULT_COMPANY } from '../../lib/waybill-pdf';
import {
  ReceiptText,
  Search,
  Plus,
  Printer,
  Download,
  Eye,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  X,
  Warehouse as WhIcon,
  Calendar,
  User,
  Phone,
  Trash2,
  Building2,
  Save,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProductSearchSelect } from '../../components/ProductSearchSelect';
import { ModalPortal } from '../../components/ModalPortal';

export default function InvoicesPage() {
  const { invoices, warehouses, productsWithStock, createSaleInvoice, updateInvoiceCreator, cancelInvoice, currentUser, users } = useApp();
  const { t } = useI18n();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');

  // Company info state
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(DEFAULT_COMPANY);
  const [isCompanySettingsOpen, setIsCompanySettingsOpen] = useState(false);
  const [tempCompany, setTempCompany] = useState<CompanyInfo>(DEFAULT_COMPANY);

  // Load saved company info on client mount
  React.useEffect(() => {
    const info = getCompanyInfo();
    setCompanyInfo(info);
    setTempCompany(info);
  }, []);

  // Modal states
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithItems | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

  // New Invoice Form state
  const [formWarehouseId, setFormWarehouseId] = useState<string>(warehouses[0]?.id || '');
  const [formCustomerName, setFormCustomerName] = useState('');
  const [formCustomerPhone, setFormCustomerPhone] = useState('');
  const [formCustomerAddress, setFormCustomerAddress] = useState('');
  const [formCustomerInn, setFormCustomerInn] = useState('');
  const [formCreatorName, setFormCreatorName] = useState<string>(currentUser?.name || 'Ombor xodimi');
  const [formNotes, setFormNotes] = useState('');

  // Sync default creator name when active account is switched
  React.useEffect(() => {
    if (currentUser?.name) {
      setFormCreatorName(currentUser.name);
    }
  }, [currentUser]);
  const [formItems, setFormItems] = useState<
    { productId: string; quantity: number; unitPrice: number }[]
  >([{ productId: productsWithStock[0]?.id || '', quantity: 1, unitPrice: 20000 }]);
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered invoices
  // Options for the searchable product picker (stock shown for the selected warehouse)
  const productOptions = useMemo(
    () =>
      productsWithStock.map((prod) => ({
        id: prod.id,
        name: prod.name,
        code: prod.qr_code_data,
        hint: `${prod.warehouse_stock[formWarehouseId] ?? 0} ${prod.unit}`,
      })),
    [productsWithStock, formWarehouseId]
  );

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      const matchesWh = warehouseFilter === 'all' || inv.warehouse_id === warehouseFilter;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        inv.invoice_number.toLowerCase().includes(q) ||
        inv.customer_name.toLowerCase().includes(q) ||
        (inv.customer_phone && inv.customer_phone.toLowerCase().includes(q)) ||
        (inv.customer_inn && inv.customer_inn.toLowerCase().includes(q)) ||
        (inv.notes && inv.notes.toLowerCase().includes(q));

      return matchesStatus && matchesWh && matchesSearch;
    });
  }, [invoices, statusFilter, warehouseFilter, search]);

  // KPI Calculations
  const stats = useMemo(() => {
    const validInvoices = invoices.filter((i) => i.status === 'issued');
    const totalRevenue = validInvoices.reduce((sum, i) => sum + i.total_amount, 0);
    const totalCount = invoices.length;
    const issuedCount = validInvoices.length;
    const cancelledCount = invoices.filter((i) => i.status === 'cancelled').length;

    return { totalRevenue, totalCount, issuedCount, cancelledCount };
  }, [invoices]);

  const handleOpenNewInvoice = () => {
    setFormWarehouseId(warehouses[0]?.id || '');
    setFormCustomerName('');
    setFormCustomerPhone('');
    setFormCustomerAddress('');
    setFormCustomerInn('');
    setFormCreatorName(currentUser?.name || 'Ombor xodimi');
    setFormNotes('');
    setFormItems([
      {
        productId: productsWithStock[0]?.id || '',
        quantity: 1,
        unitPrice: 25000,
      },
    ]);
    setFormError(null);
    setIsNewInvoiceOpen(true);
  };

  const handleAddItemRow = () => {
    setFormItems((prev) => [
      ...prev,
      { productId: productsWithStock[0]?.id || '', quantity: 1, unitPrice: 10000 },
    ]);
  };

  const handleRemoveItemRow = (idx: number) => {
    if (formItems.length === 1) return;
    setFormItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: string, value: any) => {
    setFormItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formCustomerName.trim()) {
      setFormError('Mijoz nomini kiritish shart');
      return;
    }

    if (formItems.length === 0) {
      setFormError('Kamida 1 ta mahsulot qo\'shilishi kerak');
      return;
    }

    const res = createSaleInvoice({
      warehouseId: formWarehouseId,
      customerName: formCustomerName,
      customerPhone: formCustomerPhone || null,
      customerAddress: formCustomerAddress || null,
      customerInn: formCustomerInn || null,
      notes: formNotes || null,
      creatorName: formCreatorName.trim() || currentUser.name,
      createdBy: currentUser.id,
      items: formItems.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    });

    if (!res.success || !res.invoice) {
      setFormError(res.error || 'Hisob-fakturani saqlashda xatolik yuz berdi');
      return;
    }

    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch {}

    setIsNewInvoiceOpen(false);
    setSelectedInvoice(res.invoice);
  };

  const handleConfirmCancel = () => {
    if (!cancelTargetId) return;
    const res = cancelInvoice(cancelTargetId);
    if (res.success) {
      if (selectedInvoice && selectedInvoice.id === cancelTargetId) {
        setSelectedInvoice({ ...selectedInvoice, status: 'cancelled' });
      }
      setCancelTargetId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ReceiptText className="w-6 h-6 text-indigo-400" />
            Yuk Xatlari va Fakturalar (Товарная накладная)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mahsulotlar sotuvi, yuk jo'natish hujjatlari va rasmiy hisob-fakturalarni boshqarish
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              setTempCompany(companyInfo);
              setIsCompanySettingsOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/10 transition-all hover:text-white"
            title="Sotuvchi korxona rekvizitlarini o'zgartirish"
          >
            <Building2 className="w-4 h-4 text-indigo-400" /> Korxona Rekvizitlari
          </button>

          <button
            onClick={handleOpenNewInvoice}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Yangi Yuk Xati Yaratish
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Jami Savdo Summasi</span>
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold">SO'M</span>
          </div>
          <div className="text-2xl font-black text-white">
            {new Intl.NumberFormat('uz-UZ').format(stats.totalRevenue)}{' '}
            <span className="text-xs font-semibold text-slate-400">so'm</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Faol fakturalar bo'yicha
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Jami Fakturalar</span>
            <ReceiptText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {stats.totalCount}{' '}
            <span className="text-xs font-semibold text-slate-400">ta hujjat</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Barcha davrlar hisoboti
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Rasmiylashtirilgan</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {stats.issuedCount}{' '}
            <span className="text-xs font-semibold text-slate-400">ta</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Amaldagi va tasdiqlangan
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Bekor Qilingan</span>
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          </div>
          <div className="text-2xl font-black text-rose-400">
            {stats.cancelledCount}{' '}
            <span className="text-xs font-semibold text-slate-400">ta</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Qaytarilmagan / bekor
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 glass-panel rounded-2xl border border-white/10">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Hujjat №, mijoz, telefon yoki INN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Warehouse Filter */}
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Barcha omborlar</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex p-1 bg-slate-900 rounded-xl border border-white/10 text-xs">
            {[
              { id: 'all', label: 'Barchasi' },
              { id: 'issued', label: 'Faol' },
              { id: 'cancelled', label: 'Bekor qilingan' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  statusFilter === tab.id
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

      {/* Invoices List Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Hujjat №</th>
                <th className="py-3 px-4">Sana &amp; Vaqt</th>
                <th className="py-3 px-4">Xaridor (Mijoz)</th>
                <th className="py-3 px-4">Ombor</th>
                <th className="py-3 px-4 text-center">Tovarlar</th>
                <th className="py-3 px-4 text-right">Summa</th>
                <th className="py-3 px-4 text-center">Holat</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    <ReceiptText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    Fakturalar topilmadi.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isCancelled = inv.status === 'cancelled';
                  const totalItemsCount = inv.items.reduce((sum, it) => sum + it.quantity, 0);

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                        {inv.invoice_number}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div>{new Date(inv.created_at).toLocaleDateString()}</div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(inv.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{inv.customer_name}</div>
                        {inv.customer_phone && (
                          <div className="text-[11px] text-slate-400">
                            {inv.customer_phone}
                          </div>
                        )}
                        {inv.customer_inn && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            INN: {inv.customer_inn}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <WhIcon className="w-3.5 h-3.5 text-slate-500" />
                          {inv.warehouse_name || 'Markaziy Ombor'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-medium text-[11px]">
                          {inv.items.length} pozitsiya ({totalItemsCount} dona)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-white text-sm">
                        {new Intl.NumberFormat('uz-UZ').format(inv.total_amount)}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">so'm</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            inv.status === 'issued'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : inv.status === 'cancelled'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {inv.status === 'issued'
                            ? 'Faol'
                            : inv.status === 'cancelled'
                            ? 'Bekor'
                            : 'Qoralama'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            title="Ko'rish"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => printWaybill(inv)}
                            title="Chop etish"
                            className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => downloadWaybillPdf(inv)}
                            title="PDF yuklab olish"
                            className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          {!isCancelled && (
                            <button
                              onClick={() => setCancelTargetId(inv.id)}
                              title="Fakturani bekor qilish"
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <ModalPortal>
        <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto overscroll-contain p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl my-auto p-6 overflow-hidden rounded-2xl glass-panel border border-white/10 shadow-2xl bg-slate-950/90">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start justify-between pb-5 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    {selectedInvoice.invoice_number}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      selectedInvoice.status === 'issued'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {selectedInvoice.status === 'issued' ? 'RASMIYLASHTIRILGAN' : 'BEKOR QILINGAN'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">Tovarni Jo'natish Hujjati</h2>
                <p className="text-xs text-slate-400">
                  Sana: {new Date(selectedInvoice.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2 mr-8">
                <button
                  onClick={() => printWaybill(selectedInvoice)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-md"
                >
                  <Printer className="w-3.5 h-3.5" /> Chop etish
                </button>
                <button
                  onClick={() => downloadWaybillPdf(selectedInvoice)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/10 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            </div>

            {/* Parties Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Yetkazib Beruvchi (Sotuvchi)
                </div>
                <div className="font-bold text-white">{companyInfo.name}</div>
                <div className="text-slate-400">
                  Ombor: {selectedInvoice.warehouse_name || 'Markaziy Ombor'}
                </div>
                {companyInfo.address && (
                  <div className="text-slate-400">
                    Manzil: {companyInfo.address}
                  </div>
                )}
                <div className="text-slate-400">
                  Tel: {companyInfo.phone || 'Keltirilmagan'} {companyInfo.inn ? `| INN: ${companyInfo.inn}` : ''}
                </div>
                <div className="pt-2 mt-2 border-t border-white/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
                    Topshirdi / Отпустил (Ombor mas'uli):
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={selectedInvoice.creator_name || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedInvoice({ ...selectedInvoice, creator_name: val });
                        updateInvoiceCreator(selectedInvoice.id, val);
                      }}
                      placeholder="Ombor xodimi F.I.O"
                      className="flex-1 px-2.5 py-1 text-xs bg-slate-800 border border-white/10 rounded-lg font-semibold text-white focus:outline-none focus:border-indigo-500"
                    />
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          setSelectedInvoice({ ...selectedInvoice, creator_name: e.target.value });
                          updateInvoiceCreator(selectedInvoice.id, e.target.value);
                        }
                      }}
                      className="px-2 py-1 text-[11px] bg-slate-800 border border-white/10 rounded-lg text-slate-300 focus:outline-none"
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
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Qabul Qiluvchi (Xaridor)
                </div>
                <div className="font-bold text-white">{selectedInvoice.customer_name}</div>
                {selectedInvoice.customer_phone && (
                  <div className="text-slate-400">Tel: {selectedInvoice.customer_phone}</div>
                )}
                {selectedInvoice.customer_address && (
                  <div className="text-slate-400">Manzil: {selectedInvoice.customer_address}</div>
                )}
                {selectedInvoice.customer_inn && (
                  <div className="text-slate-400 font-mono">INN: {selectedInvoice.customer_inn}</div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="rounded-xl border border-white/10 overflow-hidden my-4">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">№</th>
                    <th className="py-2.5 px-3">Mahsulot nomi</th>
                    <th className="py-2.5 px-3 text-center">Birligi</th>
                    <th className="py-2.5 px-3 text-right">Miqdor</th>
                    <th className="py-2.5 px-3 text-right">Narxi</th>
                    <th className="py-2.5 px-3 text-right">Summasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {selectedInvoice.items.map((item, idx) => {
                    const prod =
                      item.product ||
                      productsWithStock.find((p) => p.id === item.product_id);
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 px-3 text-center text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-semibold text-white">
                          {prod?.name || `Mahsulot #${item.product_id}`}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-400">
                          {prod?.unit || 'dona'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-white">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-300">
                          {new Intl.NumberFormat('uz-UZ').format(item.unit_price)} so'm
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-emerald-400">
                          {new Intl.NumberFormat('uz-UZ').format(item.line_total)} so'm
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals & Notes */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-white/10">
              <div className="text-xs text-slate-400">
                {selectedInvoice.notes && (
                  <div>
                    <span className="font-semibold text-slate-300">Izoh:</span>{' '}
                    {selectedInvoice.notes}
                  </div>
                )}
              </div>

              <div className="text-right w-full sm:w-auto p-3 bg-slate-900/90 rounded-xl border border-white/10">
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider">
                  JAMI TO'LOV SUMMASI:
                </span>
                <span className="text-xl font-black text-emerald-400">
                  {new Intl.NumberFormat('uz-UZ').format(selectedInvoice.total_amount)} so'm
                </span>
              </div>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelTargetId && (
        <ModalPortal>
        <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto overscroll-contain p-4 bg-black/80 backdrop-blur-md">
          <div className="relative my-auto w-full max-w-md p-6 rounded-2xl glass-panel border border-rose-500/30 bg-slate-950 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-lg font-bold text-white">Fakturani bekor qilish</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ushbu hisob-faktura bekor qilinadi.
            </p>
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
              <strong>Eslatma:</strong> Qoidaga ko'ra, hisob-fakturani bekor qilish ombordagi qoldiqlarni
              avtomatik ravishda qayta ko'paytirmaydi. Agar tovar omborga qaytgan bo'lsa, uni alohida
              Kirim (Inbound) amaliyoti orqali rasmiylashtiring.
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelTargetId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl"
              >
                Bekor qilmaslik
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shadow-lg shadow-rose-600/30"
              >
                Ha, bekor qilinsin
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Create New Invoice Modal */}
      {isNewInvoiceOpen && (
        <ModalPortal>
        <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto overscroll-contain p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl my-auto p-6 overflow-hidden rounded-2xl glass-panel border border-white/10 shadow-2xl bg-slate-950/95">
            <button
              onClick={() => setIsNewInvoiceOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pb-4 border-b border-white/10 mb-4">
              <ReceiptText className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Yangi Tovarni Jo'natish Hujjati (Sotuv)</h2>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4">
              {/* Customer and Warehouse */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Yuk jo'natiladigan ombor <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formWarehouseId}
                    onChange={(e) => setFormWarehouseId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.id}>
                        {wh.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Xaridor / Mijoz nomi <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: 'Farxod MCHJ' yoki 'Rustam Aliyev'"
                    value={formCustomerName}
                    onChange={(e) => setFormCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Telefon raqami</label>
                  <input
                    type="tel"
                    placeholder="+998 (90) 123-45-67"
                    value={formCustomerPhone}
                    onChange={(e) => setFormCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Manzil</label>
                  <input
                    type="text"
                    placeholder="Toshkent, Sergeli"
                    value={formCustomerAddress}
                    onChange={(e) => setFormCustomerAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">INN / STIR</label>
                  <input
                    type="text"
                    placeholder="304891234"
                    value={formCustomerInn}
                    onChange={(e) => setFormCustomerInn(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Staff / Issuer selector */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Topshirdi / Отпустил (Ombor mas'uli F.I.O) <span className="text-rose-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formCreatorName}
                    onChange={(e) => setFormCreatorName(e.target.value)}
                    placeholder="Ombor xodimi F.I.O"
                    className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) setFormCreatorName(e.target.value);
                    }}
                    className="px-3 py-2 text-xs bg-slate-800 border border-white/10 rounded-xl text-slate-200 focus:outline-none cursor-pointer"
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

              {/* Items List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Sotiladigan tovarlar ro'yxati
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" /> Yana tovar qo'shish
                  </button>
                </div>

                {formItems.map((item, idx) => {
                  const selectedProd = productsWithStock.find((p) => p.id === item.productId);
                  const availableStock = selectedProd
                    ? selectedProd.warehouse_stock[formWarehouseId] ?? 0
                    : 0;

                  return (
                    <div
                      key={idx}
                      className="p-3 bg-slate-900/60 rounded-xl border border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                    >
                      <div className="sm:col-span-5">
                        <ProductSearchSelect
                          options={productOptions}
                          value={item.productId}
                          onChange={(id) => handleItemChange(idx, 'productId', id)}
                        />
                      </div>

                      <div className="sm:col-span-3 flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          max={availableStock || undefined}
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(idx, 'quantity', Math.max(1, Number(e.target.value)))
                          }
                          className="w-full px-2 py-1.5 text-xs bg-slate-800 border border-white/10 rounded-lg text-white font-bold focus:outline-none focus:border-indigo-500"
                        />
                        <span className="text-[11px] text-slate-400">
                          {selectedProd?.unit || 'dona'}
                        </span>
                      </div>

                      <div className="sm:col-span-3">
                        <input
                          type="number"
                          min="0"
                          step="500"
                          placeholder="Narx (so'm)"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(idx, 'unitPrice', Math.max(0, Number(e.target.value)))
                          }
                          className="w-full px-2 py-1.5 text-xs bg-slate-800 border border-white/10 rounded-lg text-white text-right font-bold text-emerald-400 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="sm:col-span-1 text-center">
                        {formItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Calculation */}
              <div className="flex items-center justify-between p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/20 text-xs">
                <span className="text-slate-300">Jami hisob-faktura summasi:</span>
                <span className="text-base font-black text-emerald-400">
                  {new Intl.NumberFormat('uz-UZ').format(
                    formItems.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0)
                  )}{' '}
                  so'm
                </span>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Izoh yoki shartnoma raqami (ixtiyoriy)"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {formError && (
                <div className="p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Yuk xatini tasdiqlash va chiqarish
                </button>
              </div>
            </form>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Company Settings Modal */}
      {isCompanySettingsOpen && (
        <ModalPortal>
        <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto overscroll-contain p-4 bg-black/80 backdrop-blur-md">
          <div className="relative my-auto w-full max-w-lg p-6 rounded-2xl glass-panel border border-white/10 bg-slate-950/95 shadow-2xl space-y-4">
            <button
              onClick={() => setIsCompanySettingsOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-white">Sotuvchi Korxona Rekvizitlari</h3>
                <p className="text-[11px] text-slate-400">
                  Barcha rasmiy Yuk xatlari (Товарная накладная) va PDF hujjatlarda ko'rsatiladigan ma'lumotlar
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveCompanyInfo(tempCompany);
                setCompanyInfo(tempCompany);
                setIsCompanySettingsOpen(false);
              }}
              className="space-y-3.5 pt-1"
            >
              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Korxona / Tashkilot nomi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tempCompany.name}
                  onChange={(e) => setTempCompany({ ...tempCompany, name: e.target.value })}
                  placeholder="«STANDART VA METROLOGIYA» MCHJ"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Yuridik yoki ombor manzili <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tempCompany.address || ''}
                  onChange={(e) => setTempCompany({ ...tempCompany, address: e.target.value })}
                  placeholder="Toshkent sh., Yakkasaroy tumani Yakkasaroy k. 5-uy"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                    Telefon raqami <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tempCompany.phone || ''}
                    onChange={(e) => setTempCompany({ ...tempCompany, phone: e.target.value })}
                    placeholder="+998 98 361-71-83"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                    INN / STIR raqami <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tempCompany.inn || ''}
                    onChange={(e) => setTempCompany({ ...tempCompany, inn: e.target.value })}
                    placeholder="308097539"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCompanySettingsOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <Save className="w-3.5 h-3.5" /> Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
        </ModalPortal>
      )}
    </div>
  );
}
