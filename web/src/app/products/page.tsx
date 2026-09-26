'use client';

import React, { useState } from 'react';
import { useApp } from '../../lib/store';
import { useI18n } from '../../lib/i18n';
import { ProductWithStock, ProductUnit } from '../../lib/types';
import {
  Package,
  Plus,
  Search,
  QrCode,
  Printer,
  Trash2,
  AlertTriangle,
  CheckSquare,
  Square,
  ArrowDownUp,
  Filter,
  Calendar,
  Clock,
  Thermometer,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { QRModal } from '../../components/QRModal';
import { BatchQRPrintModal } from '../../components/BatchQRPrintModal';
import { QuickTransactionModal } from '../../components/QuickTransactionModal';
import { ModalPortal } from '../../components/ModalPortal';

export default function ProductsPage() {
  const {
    productsWithStock,
    warehouses,
    addProduct,
    deleteProduct,
    selectedProductIds,
    toggleSelectProduct,
    selectAllProducts,
    clearSelection,
    expiringItems,
  } = useApp();

  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [filterExpiryOnly, setFilterExpiryOnly] = useState<boolean>(false);
  const [activeQRProduct, setActiveQRProduct] = useState<ProductWithStock | null>(null);
  const [activeTransactionProduct, setActiveTransactionProduct] = useState<ProductWithStock | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState<ProductUnit>('piece');
  const [minStockLevel, setMinStockLevel] = useState<number>(20);
  const [imageUrl, setImageUrl] = useState('');
  const [manufactureDate, setManufactureDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [storageConditions, setStorageConditions] = useState('');
  const [initialWarehouseId, setInitialWarehouseId] = useState<string>(warehouses[0]?.id || '');
  const [initialQty, setInitialQty] = useState<number>(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const STORAGE_PRESETS = [
    t.storagePresetRefrigerated,
    t.storagePresetRoom,
    t.storagePresetDryDark,
    t.storagePresetKeepDry,
  ];

  const filteredProducts = productsWithStock.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.qr_code_data.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesUnit = selectedUnit === 'all' || p.unit === selectedUnit;
    const matchesExpiry = !filterExpiryOnly || (p.expiry_status === 'expiring_soon' || p.expiry_status === 'expired');

    return matchesSearch && matchesUnit && matchesExpiry;
  });

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // The selector shows the first warehouse when nothing was picked yet, so use it
    // rather than an empty id that would attach the intake stock to no warehouse.
    const intakeWarehouseId = warehouses.some((w) => w.id === initialWarehouseId)
      ? initialWarehouseId
      : warehouses[0]?.id || '';

    setIsSubmitting(true);
    try {
      await addProduct({
        name: name.trim(),
        description: description.trim(),
        unit,
        min_stock_level: Number(minStockLevel),
        image_url: imageUrl.trim() || undefined,
        manufacture_date: manufactureDate.trim() || null,
        expiry_date: expiryDate.trim() || null,
        storage_conditions: storageConditions.trim() || null,
        initial_stock:
          initialQty > 0 && intakeWarehouseId
            ? [{ warehouse_id: intakeWarehouseId, quantity: Number(initialQty) }]
            : undefined,
      });

      setName('');
      setDescription('');
      setMinStockLevel(20);
      setImageUrl('');
      setManufactureDate('');
      setExpiryDate('');
      setStorageConditions('');
      setInitialQty(100);
      setIsCreateModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-indigo-400" /> {t.productCatalogTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.productCatalogSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedProductIds.length > 0 && (
            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all"
            >
              <Printer className="w-4 h-4" /> {t.batchPrintBtn} ({selectedProductIds.length})
            </button>
          )}

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> {t.addProductBtn}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 glass-panel rounded-2xl border border-white/10">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Expiring Products Filter Toggle */}
          <button
            type="button"
            onClick={() => setFilterExpiryOnly(!filterExpiryOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              filterExpiryOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-white/10'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${filterExpiryOnly ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>{t.filterExpiringProducts}</span>
            {expiringItems.length > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500 text-slate-950 font-black ml-0.5">
                {expiringItems.length}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">{t.allUnits}</option>
              <option value="piece">{t.unit_piece}</option>
              <option value="box">{t.unit_box}</option>
              <option value="liter">{t.unit_liter}</option>
              <option value="kg">{t.unit_kg}</option>
              <option value="pallet">{t.unit_pallet}</option>
              <option value="meter">{t.unit_meter}</option>
              <option value="ampoule">{t.unit_ampoule}</option>
              <option value="set">{t.unit_set}</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border-l border-white/10 pl-3">
            <button
              onClick={selectAllProducts}
              className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 rounded-lg border border-white/5"
            >
              {t.selectAll}
            </button>
            {selectedProductIds.length > 0 && (
              <button
                onClick={clearSelection}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-rose-300 bg-slate-800/80 rounded-lg border border-white/5"
              >
                {t.clearSelection}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-3xl border border-white/10 my-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            {searchQuery || filterExpiryOnly ? 'Qidiruv bo\'yicha mahsulot topilmadi' : 'Hozircha mahsulotlar mavjud emas'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mb-6">
            {searchQuery || filterExpiryOnly
              ? 'Qidiruv parametrlarini o\'zgartirib ko\'ring.'
              : 'Birinchi mahsulotingizni qo\'shing — tizim avtomatik tarzda unikal QR kod yaratadi va chop etishga tayyorlaydi.'}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> {t.addProductBtn}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
          const isSelected = selectedProductIds.includes(product.id);

          return (
            <div
              key={product.id}
              className={`relative glass-panel rounded-2xl border transition-all overflow-hidden flex flex-col ${
                isSelected
                  ? 'border-indigo-500 ring-1 ring-indigo-500/50 bg-indigo-950/20'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="relative h-44 bg-slate-900 overflow-hidden group">
                <img
                  src={product.image_url || ''}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                <button
                  onClick={() => toggleSelectProduct(product.id)}
                  className="absolute top-3 left-3 p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors z-10"
                >
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10 z-10">
                  <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-mono text-[11px] font-bold text-white tracking-wider">
                    {product.qr_code_data}
                  </span>
                </div>

                {/* Expiry Badge */}
                {product.expiry_status === 'expired' && (
                  <div className="absolute top-3 left-12 flex items-center gap-1 bg-rose-600/95 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold z-10 shadow-lg shadow-rose-600/30">
                    <AlertCircle className="w-3 h-3" /> {t.expiredBadge} ({Math.abs(product.days_until_expiry ?? 0)} {t.daysExpired})
                  </div>
                )}
                {product.expiry_status === 'expiring_soon' && (
                  <div className="absolute top-3 left-12 flex items-center gap-1 bg-amber-500/95 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-bold z-10 shadow-lg shadow-amber-500/30 animate-pulse">
                    <Clock className="w-3 h-3" /> {product.days_until_expiry} {t.daysLeft}
                  </div>
                )}
                {product.expiry_status === 'good' && (
                  <div className="absolute top-3 left-12 flex items-center gap-1 bg-emerald-600/80 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold z-10">
                    <CheckCircle2 className="w-3 h-3" /> {t.expiryStatusGood}
                  </div>
                )}

                {product.is_low_stock && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-amber-500/90 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-bold z-10">
                    <AlertTriangle className="w-3 h-3" /> {t.lowBadge}
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.description}</p>
                </div>

                {/* Expiry Dates & Storage Conditions Info Box */}
                {(product.manufacture_date || product.expiry_date || product.storage_conditions) && (
                  <div className="mt-3 p-2.5 bg-slate-900/80 rounded-xl border border-white/5 space-y-1.5 text-[11px]">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-slate-300">
                      {product.manufacture_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="text-slate-400 text-[10px]">{t.manufactureDate}:</span>
                          <span className="font-semibold text-slate-200">{product.manufacture_date}</span>
                        </div>
                      )}
                      {product.expiry_date && (
                        <div className="flex items-center gap-1 ml-auto">
                          <Clock className={`w-3 h-3 shrink-0 ${product.expiry_status === 'expired' ? 'text-rose-400' : product.expiry_status === 'expiring_soon' ? 'text-amber-400' : 'text-emerald-400'}`} />
                          <span className="text-slate-400 text-[10px]">{t.expiryDate}:</span>
                          <span className={`font-bold ${product.expiry_status === 'expired' ? 'text-rose-400' : product.expiry_status === 'expiring_soon' ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {product.expiry_date}
                          </span>
                        </div>
                      )}
                    </div>
                    {product.storage_conditions && (
                      <div className="flex items-center gap-1.5 text-slate-300 pt-1 border-t border-white/5">
                        <Thermometer className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="text-slate-400 text-[10px] shrink-0">{t.storageConditions}:</span>
                        <span className="text-slate-200 font-medium truncate">{product.storage_conditions}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-900/60 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{t.totalStock}</span>
                    <span className="text-sm font-black text-emerald-400">
                      {product.total_stock} <span className="text-[10px] text-slate-400 uppercase">{product.unit}</span>
                    </span>
                  </div>

                  <div className="p-2 bg-slate-900/60 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{t.safetyMin}</span>
                    <span className="text-sm font-black text-slate-300">
                      {product.min_stock_level} <span className="text-[10px] text-slate-400 uppercase">{product.unit}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-2">
                  <button
                    onClick={() => setActiveQRProduct(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-white/10 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-indigo-400" /> {t.viewQrPrint}
                  </button>

                  <button
                    onClick={() => setActiveTransactionProduct(product)}
                    className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-md shadow-indigo-600/20"
                    title={t.stockInOut}
                  >
                    <ArrowDownUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete product "${product.name}"?`)) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl border border-white/5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Create Product Modal */}
      {isCreateModalOpen && (
        <ModalPortal>
        <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto overscroll-contain p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative my-auto w-full max-w-lg p-6 overflow-hidden rounded-2xl glass-panel border border-white/10 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" /> {t.registerProductTitle}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              {t.registerProductDesc}
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">{t.productName}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Industrial Ball Bearings"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">{t.description}</label>
                <textarea
                  rows={2}
                  placeholder="Specifications, size, material details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">{t.unitField}</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as ProductUnit)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="piece">{t.unit_piece}</option>
                    <option value="box">{t.unit_box}</option>
                    <option value="liter">{t.unit_liter}</option>
                    <option value="kg">{t.unit_kg}</option>
                    <option value="pallet">{t.unit_pallet}</option>
                    <option value="meter">{t.unit_meter}</option>
                    <option value="ampoule">{t.unit_ampoule}</option>
                    <option value="set">{t.unit_set}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">{t.minStockField}</label>
                  <input
                    type="number"
                    min="0"
                    value={minStockLevel}
                    onChange={(e) => setMinStockLevel(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">{t.imageUrlField}</label>
                <input
                  type="text"
                  inputMode="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Manufacture & Expiry Dates */}
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <Clock className="w-4 h-4" />
                  <span>{t.expiryDate} & {t.manufactureDate}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{t.manufactureDate}</span>
                    </label>
                    <input
                      type="date"
                      value={manufactureDate}
                      onChange={(e) => setManufactureDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span className="text-amber-300">{t.expiryDate}</span>
                    </label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-amber-500/30 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Storage Conditions */}
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px] flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-cyan-400" />
                    <span>{t.storageConditions}</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: +2°C...+8°C qorong'i joyda"
                    value={storageConditions}
                    onChange={(e) => setStorageConditions(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                  />

                  {/* Preset quick selection chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {STORAGE_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setStorageConditions(preset)}
                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                          storageConditions === preset
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border-white/5'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-500/20">
                <span className="font-bold text-indigo-300 block mb-2">{t.initialIntakeTitle}</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">{t.intakeWarehouse}</label>
                    <select
                      value={initialWarehouseId}
                      onChange={(e) => setInitialWarehouseId(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-white text-[11px]"
                    >
                      {warehouses.map((wh) => (
                        <option key={wh.id} value={wh.id}>
                          {wh.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">{t.initialQty}</label>
                    <input
                      type="number"
                      min="0"
                      value={initialQty}
                      onChange={(e) => setInitialQty(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-white text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-white font-bold bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? t.generating : t.saveAndGenerate}
                </button>
              </div>
            </form>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Single QR Modal */}
      {activeQRProduct && (
        <QRModal
          product={activeQRProduct}
          onClose={() => setActiveQRProduct(null)}
        />
      )}

      {/* Batch QR Print Modal */}
      {isBatchModalOpen && (
        <BatchQRPrintModal
          products={productsWithStock}
          selectedIds={selectedProductIds}
          onClose={() => setIsBatchModalOpen(false)}
        />
      )}

      {/* Quick Transaction Modal */}
      {activeTransactionProduct && (
        <QuickTransactionModal
          product={activeTransactionProduct}
          onClose={() => setActiveTransactionProduct(null)}
        />
      )}
    </div>
  );
}
