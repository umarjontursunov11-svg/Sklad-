'use client';

import React, { useState } from 'react';
import { useApp } from '../../lib/store';
import { useI18n } from '../../lib/i18n';
import { Printer, QrCode, CheckSquare, Square } from 'lucide-react';
import { BatchQRPrintModal } from '../../components/BatchQRPrintModal';

export default function QRLabPage() {
  const {
    productsWithStock,
    selectedProductIds,
    toggleSelectProduct,
    selectAllProducts,
    clearSelection,
  } = useApp();

  const { t } = useI18n();

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Printer className="w-6 h-6 text-indigo-400" /> {t.qrLab}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.productCatalogSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            disabled={selectedProductIds.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <Printer className="w-4 h-4" /> {t.batchPrintBtn} ({selectedProductIds.length})
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between p-4 glass-panel rounded-2xl border border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={selectAllProducts}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-white/5 font-semibold"
          >
            {t.selectAll} ({productsWithStock.length})
          </button>
          <button
            onClick={clearSelection}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg border border-white/5"
          >
            {t.clearSelection}
          </button>
        </div>

        <span className="text-slate-400">
          <span className="text-indigo-400 font-bold">{selectedProductIds.length}</span> / {productsWithStock.length}
        </span>
      </div>

      {/* Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productsWithStock.map((product) => {
          const isSelected = selectedProductIds.includes(product.id);

          return (
            <div
              key={product.id}
              onClick={() => toggleSelectProduct(product.id)}
              className={`cursor-pointer p-4 rounded-2xl glass-panel border transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-600/20'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                  <QrCode className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              </div>

              <h4 className="font-bold text-xs text-white truncate" title={product.name}>
                {product.name}
              </h4>
              <div className="font-mono text-xs text-indigo-400 font-bold mt-1">
                {product.qr_code_data}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {t.unitField}: {product.unit} | {t.totalStock}: {product.total_stock}
              </div>
            </div>
          );
        })}
      </div>

      {isPrintModalOpen && (
        <BatchQRPrintModal
          products={productsWithStock}
          selectedIds={selectedProductIds}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
}
