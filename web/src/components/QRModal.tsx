'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { ProductWithStock } from '../lib/types';
import { useI18n } from '../lib/i18n';
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
        color: {
          dark: '#0f172a',
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

    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(1);
    doc.roundedRect(4, 4, 92, 92, 4, 4);

    doc.setFillColor(99, 102, 241);
    doc.roundedRect(4, 4, 92, 12, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('OMNISTOCK PRO INVENTORY TAG', 50, 12, { align: 'center' });

    doc.addImage(qrDataUrl, 'PNG', 20, 18, 60, 60);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const splitTitle = doc.splitTextToSize(product.name, 86);
    doc.text(splitTitle, 50, 82, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
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
    doc.setFont('helvetica', 'bold');
    doc.text('OMNISTOCK', textX, 4);

    doc.setFontSize(width <= 42 ? 6 : 7.5);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(product.name, textWidth);
    doc.text(titleLines.slice(0, 2), textX, width <= 42 ? 7.5 : 8.5);

    doc.setFontSize(width <= 42 ? 7 : 8.5);
    doc.setFont('courier', 'bold');
    doc.text(product.qr_code_data, textX, height - (width <= 42 ? 6.5 : 8));

    if (height >= 28) {
      doc.setFontSize(width <= 42 ? 5 : 6);
      doc.setFont('helvetica', 'normal');
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
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
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
