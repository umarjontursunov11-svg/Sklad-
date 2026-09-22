'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { ensureRobotoFonts } from '../lib/pdf-fonts';
import { ProductWithStock } from '../lib/types';
import { useI18n } from '../lib/i18n';
import { printViaIframe, escapeHtml } from '../lib/print-utils';
import { Download, Printer, X, FileText, Check, Copy, Tag } from 'lucide-react';

interface QRModalProps {
  product: ProductWithStock | null;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ product, onClose }) => {
  const { t } = useI18n();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      QRCode.toDataURL(product.qr_code_data, {
        width: 600,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      }).then((url) => {
        setQrDataUrl(url);
      });
    }
  }, [product]);

  if (!product) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(product.qr_code_data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR_${product.qr_code_data}_${product.name.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDFBadge = () => {
    if (!qrDataUrl) return;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 100],
    });
    ensureRobotoFonts(doc);

    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(1);
    doc.roundedRect(4, 4, 92, 92, 4, 4);

    doc.setFillColor(99, 102, 241);
    doc.roundedRect(4, 4, 92, 12, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('Roboto', 'bold');
    doc.text('OMNISTOCK PRO INVENTORY TAG', 50, 12, { align: 'center' });

    doc.addImage(qrDataUrl, 'PNG', 20, 18, 60, 60);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('Roboto', 'bold');
    const splitTitle = doc.splitTextToSize(product.name, 86);
    doc.text(splitTitle, 50, 82, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('Roboto', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`CODE: ${product.qr_code_data}  |  UNIT: ${product.unit.toUpperCase()}`, 50, 91, { align: 'center' });

    doc.save(`Badge_${product.qr_code_data}.pdf`);
  };

  const handleDownloadThermalPDF = (width = 50, height = 30) => {
    if (!qrDataUrl) return;
    const orientation = width >= height ? 'landscape' : 'portrait';
    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: [width, height],
    });
    ensureRobotoFonts(doc);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.rect(0.5, 0.5, width - 1, height - 1);

    const qrSize = Math.min(height - 3, width * 0.46);
    const qrX = 1.5;
    const qrY = (height - qrSize) / 2;

    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

    const textX = qrX + qrSize + 1.5;
    const textWidth = width - textX - 1.5;

    doc.setFontSize(width <= 42 ? 5 : 6);
    doc.setFont('Roboto', 'bold');
    doc.text('OMNISTOCK', textX, 4);

    doc.setFontSize(width <= 42 ? 6 : 7.5);
    doc.setFont('Roboto', 'bold');
    const titleLines = doc.splitTextToSize(product.name, textWidth);
    doc.text(titleLines.slice(0, 2), textX, width <= 42 ? 7.5 : 8.5);

    doc.setFontSize(width <= 42 ? 7 : 8.5);
    doc.setFont('Roboto', 'bold');
    doc.text(product.qr_code_data, textX, height - (width <= 42 ? 6.5 : 8));

    if (height >= 28) {
      doc.setFontSize(width <= 42 ? 5 : 6);
      doc.setFont('Roboto', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(
        width <= 42
          ? `${product.unit.toUpperCase()}`
          : `${product.unit.toUpperCase()} | MIN: ${product.min_stock_level}`,
        textX,
        height - 2
      );
    }

    doc.save(`Thermal_${width}x${height}mm_${product.qr_code_data}.pdf`);
  };

  const handlePrint = () => {
    if (!product || !qrDataUrl) return;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Thermal Label - ${escapeHtml(product.qr_code_data)}</title>
        <style>
          @page {
            size: 50mm 30mm;
            margin: 0;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          html, body {
            width: 50mm;
            height: 30mm;
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: #000000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .thermal-sticker {
            width: 50mm;
            height: 30mm;
            display: flex;
            align-items: center;
            padding: 1.5mm;
            box-sizing: border-box;
            overflow: hidden;
            border: none;
          }
          .qr-container {
            height: 100%;
            max-height: 90%;
            aspect-ratio: 1/1;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .qr-container img {
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
            line-height: 1.15;
            text-align: left;
          }
          .brand {
            font-size: 8px;
            font-weight: 900;
            color: #334155;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .product-title {
            font-size: 10.5px;
            font-weight: 800;
            color: #000000;
            margin-top: 0.3mm;
            line-height: 1.2;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .sku-code {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 11px;
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
        <div class="thermal-sticker">
          <div class="qr-container">
            <img src="${qrDataUrl}" alt="QR" />
          </div>
          <div class="content-container">
            <div class="brand">OMNISTOCK</div>
            <div class="product-title">${escapeHtml(product.name)}</div>
            <div class="sku-code">${escapeHtml(product.qr_code_data)}</div>
            ${product.expiry_date ? `<div style="font-size:7.5px;font-weight:700;color:#000;margin-top:0.3mm;">EXP: ${escapeHtml(product.expiry_date)}</div>` : ''}
            ${product.storage_conditions ? `<div style="font-size:6.5px;color:#334155;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">COND: ${escapeHtml(product.storage_conditions)}</div>` : ''}
            <div class="unit-info">${escapeHtml(product.unit.toUpperCase())} | MIN: ${product.min_stock_level}</div>
          </div>
        </div>
      </body>
      </html>
    `;
    printViaIframe(html);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn no-print">
      <div className="relative w-full max-w-md p-6 overflow-hidden rounded-2xl glass-panel border border-white/10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 rounded-full border border-indigo-500/20">
            {t.qrModalBadge}
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">{product.name}</h3>
          <p className="text-sm text-slate-400 mt-1">
            {t.unitField}: <span className="text-slate-200 font-medium capitalize">{product.unit}</span> | {t.totalStock}:{' '}
            <span className="text-emerald-400 font-semibold">{product.total_stock}</span>
          </p>
          {(product.expiry_date || product.storage_conditions) && (
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs mt-2 pt-2 border-t border-white/10">
              {product.expiry_date && (
                <span className="text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {t.expiryDate}: {product.expiry_date}
                </span>
              )}
              {product.storage_conditions && (
                <span className="text-cyan-300 font-medium bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20 truncate max-w-xs">
                  ❄️ {product.storage_conditions}
                </span>
              )}
            </div>
          )}
        </div>

        <div
          ref={printRef}
          className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-inner my-4 text-slate-900"
        >
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR for ${product.name}`}
              className="w-52 h-52 object-contain"
            />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center text-slate-400">
              {t.generating}
            </div>
          )}

          <div className="mt-3 text-center">
            <span className="font-mono text-base font-bold tracking-widest text-slate-900">
              {product.qr_code_data}
            </span>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">
              {t.scanWithScanner}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-5">
          <button
            onClick={handleCopyCode}
            className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-white/5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? t.copied : t.copyCode}
          </button>

          <button
            onClick={handleDownloadPNG}
            className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-white/5"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            {t.downloadPng}
          </button>

          <button
            onClick={() => handleDownloadThermalPDF(50, 30)}
            className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-white/5"
            title="50x30mm Thermal Label"
          >
            <Tag className="w-4 h-4 text-emerald-400" />
            50x30 Thermal
          </button>

          <button
            onClick={handleDownloadPDFBadge}
            className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-white/5"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            {t.downloadPdfBadge}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-colors"
          >
            <Printer className="w-4 h-4" />
            {t.printLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
