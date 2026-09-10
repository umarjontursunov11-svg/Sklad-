'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { useApp } from '../../lib/store';
import { useI18n } from '../../lib/i18n';
import {
  FileSpreadsheet,
  Download,
  FileText,
  AlertTriangle,
  Send,
  Loader2,
  Check,
} from 'lucide-react';

export default function ReportsPage() {
  const { productsWithStock, warehouses, movements, lowStockItems } = useApp();
  const { t, language } = useI18n();

  const [reportType, setReportType] = useState<'inventory' | 'movements' | 'low_stock'>('inventory');
  const [isExporting, setIsExporting] = useState(false);
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // 1. Export to Excel (.xlsx)
  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      const wb = XLSX.utils.book_new();

      if (reportType === 'inventory' || reportType === 'low_stock') {
        const sourceData = reportType === 'low_stock' ? lowStockItems : productsWithStock;

        const rows = sourceData.map((p) => {
          const row: any = {
            'Product ID': p.id,
            'Product Name': p.name,
            'QR Identifier': p.qr_code_data,
            'Unit': p.unit,
            'Min Safety Stock': p.min_stock_level,
            'Total Stock': p.total_stock,
            'Status': p.is_low_stock ? t.reorderRequired : t.optimal,
          };

          warehouses.forEach((wh) => {
            row[`Stock: ${wh.name}`] = p.warehouse_stock[wh.id] || 0;
          });

          return row;
        });

        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, reportType === 'low_stock' ? 'Low Stock' : 'Inventory');
        XLSX.writeFile(wb, `WMS_Inventory_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
      } else {
        const rows = movements.map((m) => {
          const prod = productsWithStock.find((p) => p.id === m.product_id);
          const srcWh = warehouses.find((w) => w.id === m.warehouse_id);
          const tgtWh = m.target_warehouse_id
            ? warehouses.find((w) => w.id === m.target_warehouse_id)
            : null;

          return {
            'Transaction ID': m.id,
            'Timestamp': new Date(m.timestamp).toLocaleString(),
            'Type': m.movement_type.toUpperCase(),
            'Product Name': prod?.name || 'Unknown',
            'QR Code': prod?.qr_code_data || '',
            'Quantity': m.quantity,
            'Unit': prod?.unit || '',
            'Origin Facility': srcWh?.name || '',
            'Target Facility': tgtWh?.name || '',
            'Operator': m.user_name || 'Staff',
            'Notes': m.notes || '',
          };
        });

        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, 'Movements Ledger');
        XLSX.writeFile(wb, `WMS_Movement_History_${new Date().toISOString().slice(0, 10)}.xlsx`);
      }
    } catch (e) {
      console.error('Failed to export Excel:', e);
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Export to PDF (.pdf)
  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 297, 24, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('OMNISTOCK PRO - WAREHOUSE MANAGEMENT SYSTEM', 14, 12);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated: ${new Date().toLocaleString()} | Language: ${language.toUpperCase()}`, 14, 18);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      const title =
        reportType === 'inventory'
          ? t.overallStockReport
          : reportType === 'low_stock'
          ? t.lowStockAlerts
          : t.movementHistoryReport;
      doc.text(title, 14, 34);

      let startY = 42;

      if (reportType === 'inventory' || reportType === 'low_stock') {
        const sourceData = reportType === 'low_stock' ? lowStockItems : productsWithStock;

        doc.setFillColor(241, 245, 249);
        doc.rect(14, startY, 269, 7, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(51, 65, 85);
        doc.text('QR IDENTIFIER', 16, startY + 5);
        doc.text('PRODUCT NAME', 50, startY + 5);
        doc.text('UNIT', 120, startY + 5);
        doc.text('MIN SAFETY', 145, startY + 5);
        doc.text('TOTAL BALANCE', 175, startY + 5);
        doc.text('STATUS', 215, startY + 5);

        startY += 9;

        sourceData.forEach((item, idx) => {
          if (startY > 185) {
            doc.addPage();
            startY = 20;
          }

          if (idx % 2 === 1) {
            doc.setFillColor(248, 250, 252);
            doc.rect(14, startY - 4, 269, 7, 'F');
          }

          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(15, 23, 42);
          doc.text(item.qr_code_data, 16, startY);
          doc.text(item.name.slice(0, 36), 50, startY);
          doc.text(item.unit, 120, startY);
          doc.text(String(item.min_stock_level), 145, startY);

          if (item.is_low_stock) {
            doc.setTextColor(225, 29, 72);
            doc.setFont('helvetica', 'bold');
          } else {
            doc.setTextColor(16, 185, 129);
          }
          doc.text(String(item.total_stock), 175, startY);

          doc.text(item.is_low_stock ? t.criticalLow : t.optimal, 215, startY);

          startY += 7;
        });
      } else {
        doc.setFillColor(241, 245, 249);
        doc.rect(14, startY, 269, 7, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(51, 65, 85);
        doc.text('DATE', 16, startY + 5);
        doc.text('TYPE', 45, startY + 5);
        doc.text('PRODUCT', 75, startY + 5);
        doc.text('QTY', 145, startY + 5);
        doc.text('FACILITY', 170, startY + 5);
        doc.text('OPERATOR', 215, startY + 5);

        startY += 9;

        movements.forEach((m, idx) => {
          if (startY > 185) {
            doc.addPage();
            startY = 20;
          }

          const prod = productsWithStock.find((p) => p.id === m.product_id);
          const srcWh = warehouses.find((w) => w.id === m.warehouse_id);

          if (idx % 2 === 1) {
            doc.setFillColor(248, 250, 252);
            doc.rect(14, startY - 4, 269, 7, 'F');
          }

          doc.setFontSize(7.5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(15, 23, 42);
          doc.text(new Date(m.timestamp).toLocaleDateString(), 16, startY);
          doc.text(m.movement_type.toUpperCase(), 45, startY);
          doc.text((prod?.name || 'Unknown').slice(0, 32), 75, startY);
          doc.text(`${m.quantity} ${prod?.unit || ''}`, 145, startY);
          doc.text((srcWh?.name || '').slice(0, 20), 170, startY);
          doc.text(m.user_name || 'Staff', 215, startY);

          startY += 6.5;
        });
      }

      doc.save(`WMS_Report_${reportType}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error('Failed to export PDF:', e);
    } finally {
      setIsExporting(false);
    }
  };

  // 3. Send Manual Telegram Report
  const handleSendTelegramReport = async () => {
    setIsSendingTelegram(true);
    setTelegramStatus({ type: null, message: '' });

    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const todayMovements = movements.filter((m) => new Date(m.timestamp) >= startOfDay);

      // Inbound
      const inbounds = todayMovements.filter((m) => m.movement_type === 'inbound');
      const inboundTotal = inbounds.reduce((sum, m) => sum + m.quantity, 0);
      const inboundWarehouses: { [name: string]: number } = {};
      inbounds.forEach((m) => {
        const wh = warehouses.find((w) => w.id === m.warehouse_id);
        const name = wh?.name || 'Main Warehouse';
        inboundWarehouses[name] = (inboundWarehouses[name] || 0) + m.quantity;
      });

      // Outbound
      const outbounds = todayMovements.filter((m) => m.movement_type === 'outbound');
      const outboundTotal = outbounds.reduce((sum, m) => sum + m.quantity, 0);
      const outboundWarehouses: { [name: string]: number } = {};
      outbounds.forEach((m) => {
        const wh = warehouses.find((w) => w.id === m.warehouse_id);
        const name = wh?.name || 'Main Warehouse';
        outboundWarehouses[name] = (outboundWarehouses[name] || 0) + m.quantity;
      });

      // Low stock items
      const lowList = lowStockItems.map((p) => ({
        name: p.name,
        code: p.qr_code_data,
        stock: p.total_stock,
        min: p.min_stock_level,
        unit: p.unit,
      }));

      // Top 3 moved products
      const volumeMap: { [id: string]: { volume: number; count: number } } = {};
      todayMovements.forEach((m) => {
        if (!volumeMap[m.product_id]) {
          volumeMap[m.product_id] = { volume: 0, count: 0 };
        }
        volumeMap[m.product_id].volume += m.quantity;
        volumeMap[m.product_id].count += 1;
      });

      const topMoved = Object.entries(volumeMap)
        .sort((a, b) => b[1].volume - a[1].volume)
        .slice(0, 3)
        .map(([id, stats]) => {
          const prod = productsWithStock.find((p) => p.id === id);
          return {
            name: prod?.name || 'Product',
            volume: stats.volume,
            count: stats.count,
            unit: prod?.unit || 'birlik',
          };
        });

      // New products added today
      const newProductsCount = productsWithStock.filter(
        (p) => new Date(p.created_at) >= startOfDay
      ).length;

      const reportData = {
        reportDate: now.toISOString().slice(0, 10),
        inboundCount: inbounds.length,
        inboundTotal,
        inboundWarehouses,
        outboundCount: outbounds.length,
        outboundTotal,
        outboundWarehouses,
        lowStockItems: lowList,
        topMoved,
        newProductsCount,
      };

      const res = await fetch('/api/telegram/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportData }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setTelegramStatus({
          type: 'success',
          message: t.reportSentSuccess,
        });
        setTimeout(() => setTelegramStatus({ type: null, message: '' }), 6000);
      } else {
        setTelegramStatus({
          type: 'error',
          message: result.error || t.reportSendFailed,
        });
      }
    } catch (err: any) {
      setTelegramStatus({
        type: 'error',
        message: err.message || t.reportSendFailed,
      });
    } finally {
      setIsSendingTelegram(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-indigo-400" /> {t.reportsPageTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.reportsPageDesc}
          </p>
        </div>

        {/* Action Export & Telegram Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSendTelegramReport}
            disabled={isSendingTelegram}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-lg transition-all ${
              telegramStatus.type === 'success'
                ? 'bg-emerald-600 shadow-emerald-600/30'
                : telegramStatus.type === 'error'
                ? 'bg-rose-600 shadow-rose-600/30'
                : 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/30'
            } disabled:opacity-50`}
            title={t.sendReportNow}
          >
            {isSendingTelegram ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : telegramStatus.type === 'success' ? (
              <Check className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>
              {isSendingTelegram
                ? t.sendingTelegramReport
                : telegramStatus.type === 'success'
                ? 'Yuborildi!'
                : t.sendReportNow}
            </span>
          </button>

          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> {t.exportExcelBtn}
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <FileText className="w-4 h-4" /> {t.exportPdfBtn}
          </button>
        </div>
      </div>

      {/* Telegram Status Toast Banner */}
      {telegramStatus.message && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold animate-fadeIn ${
            telegramStatus.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {telegramStatus.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <span>{telegramStatus.message}</span>
          </div>
          <button
            onClick={() => setTelegramStatus({ type: null, message: '' })}
            className="text-slate-400 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      {/* Report Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-panel rounded-2xl border border-white/10">
        <div className="flex p-1 bg-slate-900 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setReportType('inventory')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
              reportType === 'inventory' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.overallStockReport}
          </button>
          <button
            onClick={() => setReportType('low_stock')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              reportType === 'low_stock' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> {t.lowStockAlerts} ({lowStockItems.length})
          </button>
          <button
            onClick={() => setReportType('movements')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
              reportType === 'movements' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.movementHistoryReport} ({movements.length})
          </button>
        </div>

        <div className="text-xs text-slate-400">
          Snapshot: <span className="text-slate-200 font-mono">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Preview Table */}
      <div className="overflow-x-auto glass-panel rounded-2xl border border-white/10 shadow-xl">
        {reportType === 'inventory' || reportType === 'low_stock' ? (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">QR Code</th>
                <th className="py-3.5 px-4">{t.productName}</th>
                <th className="py-3.5 px-3">{t.unitField}</th>
                <th className="py-3.5 px-3 text-center">{t.safetyMin}</th>
                <th className="py-3.5 px-4 text-right">{t.totalBalance}</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(reportType === 'low_stock' ? lowStockItems : productsWithStock).map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{p.qr_code_data}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{p.name}</td>
                  <td className="py-3.5 px-3 capitalize text-slate-300">{p.unit}</td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-400">{p.min_stock_level}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-400">
                    {p.total_stock}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {p.is_low_stock ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {t.reorderRequired}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {t.optimal}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-3">Type</th>
                <th className="py-3.5 px-4">{t.productName}</th>
                <th className="py-3.5 px-3">{t.quantity}</th>
                <th className="py-3.5 px-4">{t.warehouseLocation}</th>
                <th className="py-3.5 px-4">Operator</th>
                <th className="py-3.5 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {movements.map((m) => {
                const prod = productsWithStock.find((p) => p.id === m.product_id);
                const srcWh = warehouses.find((w) => w.id === m.warehouse_id);
                const tgtWh = m.target_warehouse_id
                  ? warehouses.find((w) => w.id === m.target_warehouse_id)
                  : null;

                return (
                  <tr key={m.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {new Date(m.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3 font-bold uppercase text-[10px]">
                      <span
                        className={
                          m.movement_type === 'inbound'
                            ? 'text-emerald-400'
                            : m.movement_type === 'outbound'
                            ? 'text-rose-400'
                            : 'text-indigo-400'
                        }
                      >
                        {m.movement_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">{prod?.name || 'Unknown'}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      {m.quantity} {prod?.unit}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {m.movement_type === 'transfer' && tgtWh ? (
                        <span>
                          {srcWh?.name} &rarr; {tgtWh.name}
                        </span>
                      ) : (
                        srcWh?.name
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{m.user_name || 'Staff'}</td>
                    <td className="py-3.5 px-4 text-slate-400 italic">{m.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
