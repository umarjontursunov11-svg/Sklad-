'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { ProductWithStock } from '../lib/types';
import { useI18n } from '../lib/i18n';
import { Printer, Download, X, Layers } from 'lucide-react';

interface BatchQRPrintModalProps {
  products: ProductWithStock[];
  selectedIds: string[];
  onClose: () => void;
}

export const BatchQRPrintModal: React.FC<BatchQRPrintModalProps> = ({
  products,
  selectedIds,
  onClose,
}) => {
  const { t } = useI18n();
  const [selectedList, setSelectedList] = useState<ProductWithStock[]>([]);
  const [qrMap, setQrMap] = useState<{ [id: string]: string }>({});
  const [labelsPerRow, setLabelsPerRow] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    const list = products.filter((p) => selectedIds.includes(p.id));
    setSelectedList(list);

    const generateAllQRs = async () => {
      const map: { [id: string]: string } = {};
      for (const item of list) {
        try {
          const url = await QRCode.toDataURL(item.qr_code_data, {
            width: 300,
            margin: 1,
            color: { dark: '#0f172a', light: '#ffffff' },
          });
          map[item.id] = url;
        } catch (e) {
          console.error(e);
        }
      }
      setQrMap(map);
    };

    if (list.length > 0) {
      generateAllQRs();
    }
  }, [products, selectedIds]);

  const handleExportPDF = async () => {
    if (selectedList.length === 0) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const cols = labelsPerRow;
      const rows = cols === 2 ? 4 : 5;

      const labelWidth = (pageWidth - margin * 2 - (cols - 1) * 5) / cols;
      const labelHeight = (pageHeight - margin * 2 - (rows - 1) * 5) / rows;

      let colIdx = 0;
      let rowIdx = 0;

      for (let i = 0; i < selectedList.length; i++) {
        const item = selectedList[i];
        const qrUrl = qrMap[item.id];

        if (i > 0 && i % (cols * rows) === 0) {
          doc.addPage();
          colIdx = 0;
          rowIdx = 0;
        }

        const x = margin + colIdx * (labelWidth + 5);
        const y = margin + rowIdx * (labelHeight + 5);

        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.4);
        doc.roundedRect(x, y, labelWidth, labelHeight, 2, 2);

        doc.setFillColor(99, 102, 241);
        doc.roundedRect(x, y, labelWidth, 5, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.text('OMNISTOCK PRO TAG', x + labelWidth / 2, y + 3.8, { align: 'center' });

        if (qrUrl) {
          const qrSize = Math.min(labelWidth * 0.45, labelHeight * 0.55);
          doc.addImage(qrUrl, 'PNG', x + 3, y + 7, qrSize, qrSize);
        }

        const textX = x + labelWidth * 0.48;
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        const lines = doc.splitTextToSize(item.name, labelWidth * 0.5);
        doc.text(lines.slice(0, 2), textX, y + 11);

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`CODE:`, textX, y + 22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(item.qr_code_data, textX, y + 26);

        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`Unit: ${item.unit.toUpperCase()} | Min: ${item.min_stock_level}`, textX, y + 32);

        colIdx++;
        if (colIdx >= cols) {
          colIdx = 0;
          rowIdx++;
        }
      }

      doc.save(`WMS_Batch_Labels_${selectedList.length}_items.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintWindow = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl glass-panel border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t.batchModalTitle}</h3>
              <p className="text-xs text-slate-400">
                {selectedList.length} {t.batchModalDesc}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 bg-slate-950/40 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{t.gridLayout}</span>
            <button
              onClick={() => setLabelsPerRow(2)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                labelsPerRow === 2
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t.columns2}
            </button>
            <button
              onClick={() => setLabelsPerRow(3)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                labelsPerRow === 3
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t.columns3}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintWindow}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-white/10 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              {t.browserPrint}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isGenerating || selectedList.length === 0}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? t.generating : t.downloadPdfSheet}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/60">
          <div
            className={`grid gap-4 ${
              labelsPerRow === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
            }`}
          >
            {selectedList.map((item) => (
              <div
                key={item.id}
                className="qr-label-card relative flex items-center gap-3 p-3.5 bg-white text-slate-900 rounded-xl shadow-md border border-slate-200"
              >
                <div className="flex-shrink-0 w-20 h-20 bg-slate-50 rounded-lg p-1 border border-slate-100 flex items-center justify-center">
                  {qrMap[item.id] ? (
                    <img src={qrMap[item.id]} alt={item.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                    OmniStock Tag
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <div className="font-mono text-xs font-bold text-slate-700 mt-1">
                    {item.qr_code_data}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {t.unitField}: {item.unit} | {t.safetyMin}: {item.min_stock_level}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
