'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { ensureRobotoFonts } from '../lib/pdf-fonts';
import { ProductWithStock } from '../lib/types';
import { useI18n } from '../lib/i18n';
import { printViaIframe, escapeHtml } from '../lib/print-utils';

// High-resolution, pure-black QR codes scan reliably on 203/300 dpi thermal printers.
const QR_OPTIONS = {
  width: 400,
  margin: 1,
  errorCorrectionLevel: 'M' as const,
  color: { dark: '#000000', light: '#ffffff' },
};

// Makes sure every selected product has a QR image before printing/exporting
// (printing could previously start while background generation was still running,
// which produced labels without QR codes).
async function ensureQrImages(
  list: ProductWithStock[],
  current: { [id: string]: string }
): Promise<{ [id: string]: string }> {
  const map = { ...current };
  for (const item of list) {
    if (!map[item.id]) {
      try {
        map[item.id] = await QRCode.toDataURL(item.qr_code_data || item.id || 'WMS-QR', QR_OPTIONS);
      } catch (e) {
        console.error(`Failed to generate QR for product ${item.name}:`, e);
      }
    }
  }
  return map;
}
import {
  Printer,
  Download,
  X,
  Layers,
  Tag,
  SlidersHorizontal,
  Check,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface BatchQRPrintModalProps {
  products: ProductWithStock[];
  selectedIds: string[];
  onClose: () => void;
}

type PrintMode = 'a4' | 'thermal';
type ThermalPreset = '40x30' | '50x30' | '58x40' | 'custom';

export const BatchQRPrintModal: React.FC<BatchQRPrintModalProps> = ({
  products,
  selectedIds,
  onClose,
}) => {
  const { t } = useI18n();

  // Print format state
  const [printMode, setPrintMode] = useState<PrintMode>('thermal');
  const [thermalPreset, setThermalPreset] = useState<ThermalPreset>('50x30');
  const [customWidth, setCustomWidth] = useState<number>(50);
  const [customHeight, setCustomHeight] = useState<number>(30);

  // A4 state
  const [labelsPerRow, setLabelsPerRow] = useState<number>(3);

  const [selectedList, setSelectedList] = useState<ProductWithStock[]>([]);
  const [qrMapState, setQrMap] = useState<{ [id: string]: string }>({});
  
  // Progress and Error State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressCurrent, setProgressCurrent] = useState<number>(0);
  const [progressTotal, setProgressTotal] = useState<number>(0);
  const [progressLabel, setProgressLabel] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Derive current thermal dimensions in mm
  const labelWidth =
    thermalPreset === '40x30'
      ? 40
      : thermalPreset === '50x30'
      ? 50
      : thermalPreset === '58x40'
      ? 58
      : Math.max(20, Number(customWidth) || 50);

  const labelHeight =
    thermalPreset === '40x30'
      ? 30
      : thermalPreset === '50x30'
      ? 30
      : thermalPreset === '58x40'
      ? 40
      : Math.max(15, Number(customHeight) || 30);

  // Initial QR Code Generation with Async Chunking (Non-blocking)
  useEffect(() => {
    const list = products.filter((p) => selectedIds.includes(p.id));
    setSelectedList(list);

    let isSubscribed = true;

    const generateAllQRsInChunks = async () => {
      if (list.length === 0) return;
      setError(null);
      setProgressTotal(list.length);
      setProgressCurrent(0);
      setProgressLabel("QR kodlar shakllantirilmoqda...");

      const map: { [id: string]: string } = {};
      const chunkSize = 15; // Batch 15 QR codes at a time to keep UI smooth

      try {
        for (let i = 0; i < list.length; i += chunkSize) {
          if (!isSubscribed) break;

          const chunk = list.slice(i, i + chunkSize);
          await Promise.all(
            chunk.map(async (item) => {
              try {
                const qrText = item.qr_code_data || item.id || 'WMS-QR';
                const url = await QRCode.toDataURL(qrText, QR_OPTIONS);
                map[item.id] = url;
              } catch (e) {
                console.error(`Failed to generate QR for product ${item.name}:`, e);
              }
            })
          );

          if (!isSubscribed) break;
          const currentCount = Math.min(i + chunkSize, list.length);
          setProgressCurrent(currentCount);
          setQrMap({ ...map });

          // Yield main thread to allow UI render cycles
          await new Promise((r) => setTimeout(r, 0));
        }
      } catch (err: any) {
        console.error('QR generation chunking error:', err);
        if (isSubscribed) {
          setError(err?.message || "QR kodlarni generatsiya qilishda xatolik yuz berdi!");
        }
      } finally {
        if (isSubscribed) {
          setProgressCurrent(0);
          setProgressTotal(0);
          setProgressLabel('');
        }
      }
    };

    generateAllQRsInChunks();

    return () => {
      isSubscribed = false;
    };
  }, [products, selectedIds]);

  // Handle PDF Export with Async Batching & Yielding
  const handleExportPDF = async () => {
    if (selectedList.length === 0) return;
    setIsGenerating(true);
    setError(null);
    setProgressTotal(selectedList.length);
    setProgressCurrent(0);
    setProgressLabel("PDF hujjat shakllantirilmoqda...");

    try {
      const qrMap = await ensureQrImages(selectedList, qrMapState);
      setQrMap(qrMap);
      if (printMode === 'thermal') {
        // Continuous label PDF
        const orientation = labelWidth >= labelHeight ? 'landscape' : 'portrait';
        const doc = new jsPDF({
          orientation,
          unit: 'mm',
          format: [labelWidth, labelHeight],
        });
        ensureRobotoFonts(doc);

        const chunkSize = 15;
        for (let i = 0; i < selectedList.length; i++) {
          const item = selectedList[i];
          const qrUrl = qrMap[item.id];

          if (i > 0) {
            doc.addPage([labelWidth, labelHeight], orientation);
          }

          // Border outline
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.1);
          doc.rect(0.5, 0.5, labelWidth - 1, labelHeight - 1);

          // Scaled QR
          const qrSize = Math.min(labelHeight - 3, labelWidth * 0.46);
          const qrX = 1.5;
          const qrY = (labelHeight - qrSize) / 2;

          if (qrUrl) {
            doc.addImage(qrUrl, 'PNG', qrX, qrY, qrSize, qrSize);
          }

          // Text content
          const textX = qrX + qrSize + 1.5;
          const textWidth = labelWidth - textX - 1.5;

          doc.setFontSize(labelWidth <= 42 ? 5 : 6);
          doc.setFont('Roboto', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text('OMNISTOCK', textX, 4);

          doc.setFontSize(labelWidth <= 42 ? 6 : 7.5);
          doc.setFont('Roboto', 'bold');
          const titleLines = doc.splitTextToSize(item.name, textWidth);
          doc.text(titleLines.slice(0, 2), textX, labelWidth <= 42 ? 7.5 : 8.5);

          const skuY = labelHeight - (labelWidth <= 42 ? 6.5 : 8);
          doc.setFontSize(labelWidth <= 42 ? 7 : 8.5);
          doc.setFont('Roboto', 'bold');
          doc.text(item.qr_code_data || item.id, textX, skuY);

          if (labelHeight >= 28) {
            doc.setFontSize(labelWidth <= 42 ? 5 : 6);
            doc.setFont('Roboto', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(
              labelWidth <= 42
                ? `${item.unit.toUpperCase()}`
                : `${item.unit.toUpperCase()} | MIN: ${item.min_stock_level}`,
              textX,
              labelHeight - 2
            );
          }

          // Update progress bar & yield main thread every chunk
          if ((i + 1) % chunkSize === 0 || i === selectedList.length - 1) {
            setProgressCurrent(i + 1);
            await new Promise((r) => setTimeout(r, 0));
          }
        }

        doc.save(`Thermal_Labels_${labelWidth}x${labelHeight}mm_${selectedList.length}_items.pdf`);
      } else {
        // Standard A4 sheet export
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });
        ensureRobotoFonts(doc);

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        const cols = labelsPerRow;
        const rows = cols === 2 ? 4 : 5;

        const a4LabelWidth = (pageWidth - margin * 2 - (cols - 1) * 5) / cols;
        const a4LabelHeight = (pageHeight - margin * 2 - (rows - 1) * 5) / rows;

        let colIdx = 0;
        let rowIdx = 0;

        const chunkSize = 15;
        for (let i = 0; i < selectedList.length; i++) {
          const item = selectedList[i];
          const qrUrl = qrMap[item.id];

          if (i > 0 && i % (cols * rows) === 0) {
            doc.addPage();
            colIdx = 0;
            rowIdx = 0;
          }

          const x = margin + colIdx * (a4LabelWidth + 5);
          const y = margin + rowIdx * (a4LabelHeight + 5);

          doc.setDrawColor(203, 213, 225);
          doc.setLineWidth(0.4);
          doc.roundedRect(x, y, a4LabelWidth, a4LabelHeight, 2, 2);

          doc.setFillColor(99, 102, 241);
          doc.roundedRect(x, y, a4LabelWidth, 5, 2, 2, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(6);
          doc.setFont('Roboto', 'bold');
          doc.text('OMNISTOCK PRO TAG', x + a4LabelWidth / 2, y + 3.8, { align: 'center' });

          if (qrUrl) {
            const qrSize = Math.min(a4LabelWidth * 0.45, a4LabelHeight * 0.55);
            doc.addImage(qrUrl, 'PNG', x + 3, y + 7, qrSize, qrSize);
          }

          const textX = x + a4LabelWidth * 0.48;
          doc.setTextColor(15, 23, 42);
          doc.setFontSize(8);
          doc.setFont('Roboto', 'bold');
          const lines = doc.splitTextToSize(item.name, a4LabelWidth * 0.5);
          doc.text(lines.slice(0, 2), textX, y + 11);

          doc.setFontSize(7);
          doc.setFont('Roboto', 'normal');
          doc.setTextColor(71, 85, 105);
          doc.text(`CODE:`, textX, y + 22);
          doc.setFont('Roboto', 'bold');
          doc.setTextColor(15, 23, 42);
          doc.text(item.qr_code_data || item.id, textX, y + 26);

          doc.setFontSize(6.5);
          doc.setFont('Roboto', 'normal');
          doc.setTextColor(100, 116, 139);
          doc.text(`Unit: ${item.unit.toUpperCase()} | Min: ${item.min_stock_level}`, textX, y + 32);

          colIdx++;
          if (colIdx >= cols) {
            colIdx = 0;
            rowIdx++;
          }

          // Update progress bar & yield main thread every chunk
          if ((i + 1) % chunkSize === 0 || i === selectedList.length - 1) {
            setProgressCurrent(i + 1);
            await new Promise((r) => setTimeout(r, 0));
          }
        }

        doc.save(`A4_Batch_Labels_${selectedList.length}_items.pdf`);
      }
    } catch (err: any) {
      console.error('PDF Generation Error:', err);
      setError(err?.message || "PDF hujjatini yaratishda kutilmagan xatolik yuz berdi!");
    } finally {
      setIsGenerating(false);
      setProgressCurrent(0);
      setProgressTotal(0);
      setProgressLabel('');
    }
  };

  // Handle Browser Printing with Async HTML Processing & Yielding
  const handlePrintWindow = async () => {
    if (selectedList.length === 0) return;
    setIsGenerating(true);
    setError(null);
    setProgressTotal(selectedList.length);
    setProgressCurrent(0);
    setProgressLabel("Chop etish darchasi tayyorlanmoqda...");

    try {
      const qrMap = await ensureQrImages(selectedList, qrMapState);
      setQrMap(qrMap);
      if (printMode === 'thermal') {
        let stickersHtml = '';
        const chunkSize = 25;

        for (let i = 0; i < selectedList.length; i++) {
          const item = selectedList[i];
          const qrSrc = qrMap[item.id] || '';
          stickersHtml += `
            <div class="thermal-sticker">
              <div class="qr-container">
                <img src="${qrSrc}" alt="QR" class="qr-code" />
              </div>
              <div class="content-container">
                <div class="brand">OMNISTOCK</div>
                <div class="product-title">${escapeHtml(item.name)}</div>
                <div class="sku-code">${escapeHtml(item.qr_code_data || item.id)}</div>
                ${item.expiry_date ? `<div style="font-size:7px;font-weight:700;color:#000;margin-top:0.2mm;">EXP: ${escapeHtml(item.expiry_date)}</div>` : ''}
                ${item.storage_conditions ? `<div style="font-size:6px;color:#334155;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">COND: ${escapeHtml(item.storage_conditions)}</div>` : ''}
                ${
                  labelHeight >= 28
                    ? `<div class="unit-info">${escapeHtml(
                        labelWidth <= 42
                          ? item.unit.toUpperCase()
                          : `${item.unit.toUpperCase()} | MIN: ${item.min_stock_level}`
                      )}</div>`
                    : ''
                }
              </div>
            </div>
          `;

          if ((i + 1) % chunkSize === 0 || i === selectedList.length - 1) {
            setProgressCurrent(i + 1);
            await new Promise((r) => setTimeout(r, 0));
          }
        }

        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Thermal Sticker Labels (${labelWidth}x${labelHeight}mm)</title>
            <style>
              @page {
                size: ${labelWidth}mm ${labelHeight}mm;
                margin: 0;
              }
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              html, body {
                width: ${labelWidth}mm;
                margin: 0;
                padding: 0;
                background: #ffffff;
                color: #000000;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .thermal-sticker {
                width: ${labelWidth}mm;
                height: ${labelHeight}mm;
                page-break-after: always;
                break-after: page;
                page-break-inside: avoid;
                break-inside: avoid;
                display: flex;
                align-items: center;
                padding: 1.5mm;
                overflow: hidden;
                box-sizing: border-box;
                border: none;
              }
              .thermal-sticker:last-child {
                page-break-after: auto;
                break-after: auto;
              }
              .qr-container {
                height: 100%;
                max-height: 90%;
                aspect-ratio: 1/1;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
              }
              .qr-code {
                width: 100%;
                height: 100%;
                object-fit: contain;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: pixelated;
              }
              .content-container {
                flex: 1;
                min-width: 0;
                height: 100%;
                margin-left: 1.5mm;
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: left;
                line-height: 1.15;
              }
              .brand {
                font-size: ${labelWidth <= 42 ? '7px' : '8px'};
                font-weight: 900;
                text-transform: uppercase;
                color: #334155;
                letter-spacing: 0.5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .product-title {
                font-size: ${labelWidth <= 42 ? '9px' : '10.5px'};
                font-weight: 800;
                color: #000000;
                line-height: 1.2;
                margin-top: 0.3mm;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
              .sku-code {
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-size: ${labelWidth <= 42 ? '9.5px' : '11px'};
                font-weight: 900;
                color: #000000;
                letter-spacing: -0.2px;
                margin-top: 0.6mm;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .unit-info {
                font-size: 7.5px;
                font-weight: 600;
                color: #475569;
                text-transform: uppercase;
                margin-top: auto;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            </style>
          </head>
          <body>
            ${stickersHtml}
          </body>
          </html>
        `;

        await printViaIframe(html);
      } else {
        let cardsHtml = '';
        const chunkSize = 25;

        for (let i = 0; i < selectedList.length; i++) {
          const item = selectedList[i];
          const qrSrc = qrMap[item.id] || '';
          cardsHtml += `
            <div class="a4-card">
              <div class="a4-qr">
                <img src="${qrSrc}" alt="QR" />
              </div>
              <div class="a4-info">
                <div class="a4-brand">OmniStock Tag</div>
                <div class="a4-title">${escapeHtml(item.name)}</div>
                <div class="a4-sku">${escapeHtml(item.qr_code_data || item.id)}</div>
                <div class="a4-sub">${escapeHtml(item.unit.toUpperCase())} | Min: ${item.min_stock_level}</div>
              </div>
            </div>
          `;

          if ((i + 1) % chunkSize === 0 || i === selectedList.length - 1) {
            setProgressCurrent(i + 1);
            await new Promise((r) => setTimeout(r, 0));
          }
        }

        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>A4 Batch QR Sheet</title>
            <style>
              @page {
                size: A4 portrait;
                margin: 10mm;
              }
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              body {
                margin: 0;
                padding: 0;
                background: #fff;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .a4-grid {
                display: grid;
                grid-template-columns: repeat(${labelsPerRow}, 1fr);
                gap: 4mm;
              }
              .a4-card {
                page-break-inside: avoid;
                break-inside: avoid;
                border: 1px dashed #94a3b8;
                border-radius: 6px;
                padding: 3.5mm;
                display: flex;
                align-items: center;
                gap: 3mm;
              }
              .a4-qr {
                width: 22mm;
                height: 22mm;
                flex-shrink: 0;
              }
              .a4-qr img {
                width: 100%;
                height: 100%;
                object-fit: contain;
              }
              .a4-info {
                flex: 1;
                min-width: 0;
              }
              .a4-brand {
                font-size: 8px;
                font-weight: 700;
                color: #4f46e5;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .a4-title {
                font-size: 11px;
                font-weight: 700;
                color: #0f172a;
                line-height: 1.2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .a4-sku {
                font-family: monospace;
                font-size: 11px;
                font-weight: 700;
                color: #1e293b;
                margin-top: 2px;
              }
              .a4-sub {
                font-size: 9px;
                color: #64748b;
                margin-top: 2px;
              }
            </style>
          </head>
          <body>
            <div class="a4-grid">
              ${cardsHtml}
            </div>
          </body>
          </html>
        `;

        await printViaIframe(html);
      }
    } catch (err: any) {
      console.error('Print Window Error:', err);
      setError(err?.message || "Chop etish darchasini tayyorlashda xatolik yuz berdi!");
    } finally {
      setIsGenerating(false);
      setProgressCurrent(0);
      setProgressTotal(0);
      setProgressLabel('');
    }
  };

  // Preview List: Limit live preview DOM nodes to 36 cards to prevent browser DOM overload for large batches
  const previewMax = 36;
  const previewList = selectedList.slice(0, previewMax);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 no-print">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl bg-slate-950 border border-white/15 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {t.batchModalTitle}
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {selectedList.length} ta mahsulot
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {selectedList.length} {t.batchModalDesc}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Error Banner if present */}
        {error && (
          <div className="px-5 py-3 bg-rose-500/10 border-b border-rose-500/30 text-rose-300 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-bold underline hover:text-white ml-3"
            >
              Yopish
            </button>
          </div>
        )}

        {/* Real-time Progress Bar Banner when processing */}
        {(isGenerating || (progressTotal > 0 && progressCurrent < progressTotal)) && (
          <div className="px-5 py-3 bg-indigo-950/90 border-b border-indigo-500/30 space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-200">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>{progressLabel || "Jarayon amalga oshirilmoqda..."}</span>
              </span>
              <span className="font-mono text-indigo-300">
                {progressCurrent} / {progressTotal} ({Math.round((progressCurrent / (progressTotal || 1)) * 100)}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-indigo-500/20">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-150"
                style={{
                  width: `${Math.min(100, Math.round((progressCurrent / (progressTotal || 1)) * 100))}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Mode Selector & Size Controls */}
        <div className="p-4 bg-slate-900/90 border-b border-white/5 space-y-3">
          {/* Print Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setPrintMode('thermal')}
                disabled={isGenerating}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  printMode === 'thermal'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{t.thermalOption}</span>
                <span className="text-[9px] px-1 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono">
                  Zebra/Xprinter
                </span>
              </button>

              <button
                onClick={() => setPrintMode('a4')}
                disabled={isGenerating}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  printMode === 'a4'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t.a4Option}</span>
              </button>
            </div>

            {/* Print & PDF Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintWindow}
                disabled={isGenerating || selectedList.length === 0}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                ) : (
                  <Printer className="w-4 h-4 text-slate-300" />
                )}
                <span>Standart Chop Etish</span>
              </button>

              <button
                onClick={handleExportPDF}
                disabled={isGenerating || selectedList.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Shakllantirilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{t.downloadPdfSheet}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sub-controls based on Print Mode */}
          {printMode === 'thermal' ? (
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5 text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                {t.labelSize}
              </span>

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: '40x30', label: '40 x 30 mm' },
                  { id: '50x30', label: '50 x 30 mm' },
                  { id: '58x40', label: '58 x 40 mm' },
                  { id: 'custom', label: t.customSize },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setThermalPreset(preset.id as ThermalPreset)}
                    disabled={isGenerating}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      thermalPreset === preset.id
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-white/5'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom Size Inputs */}
              {thermalPreset === 'custom' && (
                <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-400">{t.widthMm}:</span>
                    <input
                      type="number"
                      min="20"
                      max="150"
                      disabled={isGenerating}
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number(e.target.value))}
                      className="w-14 px-2 py-0.5 text-xs bg-slate-950 border border-white/10 rounded text-white text-center font-bold"
                    />
                  </div>
                  <span className="text-slate-500">&times;</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-400">{t.heightMm}:</span>
                    <input
                      type="number"
                      min="15"
                      max="150"
                      disabled={isGenerating}
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number(e.target.value))}
                      className="w-14 px-2 py-0.5 text-xs bg-slate-950 border border-white/10 rounded text-white text-center font-bold"
                    />
                  </div>
                </div>
              )}

              <span className="ml-auto text-[11px] text-emerald-400 font-mono hidden sm:inline">
                {t.continuousRoll}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-xs">
              <span className="text-slate-400">{t.gridLayout}</span>
              <button
                onClick={() => setLabelsPerRow(2)}
                disabled={isGenerating}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${
                  labelsPerRow === 2
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-white/5'
                }`}
              >
                {t.columns2}
              </button>
              <button
                onClick={() => setLabelsPerRow(3)}
                disabled={isGenerating}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${
                  labelsPerRow === 3
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-white/5'
                }`}
              >
                {t.columns3}
              </button>
            </div>
          )}
        </div>

        {/* Labels Preview Grid / Live Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
          {/* Informational Pill when list is large */}
          {selectedList.length > previewMax && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
              <span>
                Nomi ko'rsatilgan <strong>{previewMax} ta</strong> namuna. Chop etishda va PDF hujjatida barcha <strong>{selectedList.length} ta</strong> stiker to'liq chiqariladi.
              </span>
              <span className="text-[11px] font-bold text-emerald-400 font-mono">
                {selectedList.length} / {selectedList.length} tayyor
              </span>
            </div>
          )}

          {printMode === 'thermal' ? (
            /* Thermal Continuous Roll Preview */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>
                  Stiker o'lchami ({labelWidth}mm &times; {labelHeight}mm):
                </span>
                <span className="text-indigo-400 font-semibold">
                  1 stiker = 1 lentalik sahifa
                </span>
              </div>

              <div className="thermal-print-container flex flex-wrap gap-4 justify-center sm:justify-start">
                {previewList.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      width: `${labelWidth * 3.78}px`,
                      height: `${labelHeight * 3.78}px`,
                      maxWidth: '100%',
                    }}
                    className="thermal-sticker-page relative flex items-center gap-2 p-2 bg-white text-black rounded-lg shadow-md border border-slate-300 box-border overflow-hidden select-none"
                  >
                    {/* QR Code Container */}
                    <div className="flex-shrink-0 h-full flex items-center justify-center">
                      {qrMapState[item.id] ? (
                        <img
                          src={qrMapState[item.id]}
                          alt={item.name}
                          className="h-full max-h-[88%] w-auto aspect-square object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 border-2 border-slate-800 border-t-transparent animate-spin rounded-full" />
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center h-full text-left leading-tight py-0.5">
                      <span className="text-[8px] font-black tracking-wider text-slate-700 uppercase block truncate">
                        OMNISTOCK
                      </span>

                      <h4
                        className={`font-black text-black leading-snug line-clamp-2 ${
                          labelWidth <= 42 ? 'text-[9px]' : 'text-[11px]'
                        }`}
                        title={item.name}
                      >
                        {item.name}
                      </h4>

                      <div
                        className={`font-mono font-black text-black tracking-tight mt-0.5 truncate ${
                          labelWidth <= 42 ? 'text-[10px]' : 'text-xs'
                        }`}
                      >
                        {item.qr_code_data || item.id}
                      </div>

                      {item.expiry_date && (
                        <div className="text-[7.5px] font-bold text-amber-900 truncate">
                          EXP: {item.expiry_date}
                        </div>
                      )}

                      {labelHeight >= 28 && (
                        <div className="text-[8px] font-semibold text-slate-600 mt-auto uppercase truncate">
                          {labelWidth <= 42
                            ? `${item.unit}`
                            : `${item.unit} | Min: ${item.min_stock_level}`}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* A4 Sheet Grid Preview */
            <div
              className={`a4-print-container grid gap-4 ${
                labelsPerRow === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
              }`}
            >
              {previewList.map((item) => (
                <div
                  key={item.id}
                  className="qr-label-card relative flex items-center gap-3 p-3.5 bg-white text-slate-900 rounded-xl shadow-md border border-slate-200"
                >
                  <div className="flex-shrink-0 w-20 h-20 bg-slate-50 rounded-lg p-1 border border-slate-100 flex items-center justify-center">
                    {qrMapState[item.id] ? (
                      <img
                        src={qrMapState[item.id]}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                      OmniStock Tag
                    </span>
                    <h4
                      className="text-xs font-bold text-slate-900 truncate"
                      title={item.name}
                    >
                      {item.name}
                    </h4>
                    <div className="font-mono text-xs font-bold text-slate-700 mt-1">
                      {item.qr_code_data || item.id}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {t.unitField}: {item.unit} | {t.safetyMin}: {item.min_stock_level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
