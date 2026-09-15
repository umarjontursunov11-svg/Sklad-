'use client';

import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import { ensureRobotoFonts } from '@/lib/pdf-fonts';
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
  const { productsWithStock, warehouses, movements, lowStockItems, expiringItems, invoices } = useApp();
  const { t, language } = useI18n();

  const [reportType, setReportType] = useState<'inventory' | 'movements' | 'low_stock'>('inventory');
  const [isExporting, setIsExporting] = useState(false);
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // 1. Export to Excel (.xlsx) with conditional formatting using ExcelJS
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const wb = new ExcelJS.Workbook();
      wb.creator = 'OmniStock Pro WMS';
      wb.created = new Date();

      // Style definitions
      const headerFill: ExcelJS.FillPattern = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E293B' }, // Dark slate-800
      };
      const headerFont: Partial<ExcelJS.Font> = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
        size: 11,
        name: 'Calibri',
      };
      const headerAlignment: Partial<ExcelJS.Alignment> = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
      const headerBorder: Partial<ExcelJS.Borders> = {
        bottom: { style: 'medium', color: { argb: 'FF475569' } },
      };

      // Red fill for expiring/expired products
      const expiringFill: ExcelJS.FillPattern = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFECACA' }, // Light red (rose-200)
      };
      const expiringFont: Partial<ExcelJS.Font> = {
        color: { argb: 'FF991B1B' }, // Dark red
        name: 'Calibri',
        size: 10,
      };

      // Yellow fill for low-stock products
      const lowStockFill: ExcelJS.FillPattern = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFEF08A' }, // Light yellow (yellow-200)
      };
      const lowStockFont: Partial<ExcelJS.Font> = {
        color: { argb: 'FF854D0E' }, // Dark yellow/amber
        name: 'Calibri',
        size: 10,
      };

      const normalFont: Partial<ExcelJS.Font> = {
        name: 'Calibri',
        size: 10,
      };

      const thinBorder: Partial<ExcelJS.Borders> = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };

      if (reportType === 'inventory' || reportType === 'low_stock') {
        const sourceData = reportType === 'low_stock' ? lowStockItems : productsWithStock;
        const sheetName = reportType === 'low_stock' ? 'Kam qoldiq' : 'Ombor hisoboti';
        const ws = wb.addWorksheet(sheetName);

        // Define columns
        const columns: Partial<ExcelJS.Column>[] = [
          { header: 'Mahsulot ID', key: 'id', width: 14 },
          { header: 'Mahsulot nomi', key: 'name', width: 35 },
          { header: 'QR kod', key: 'qr_code', width: 16 },
          { header: 'Birlik', key: 'unit', width: 10 },
          { header: 'Minimal zaxira', key: 'min_stock', width: 15 },
          { header: 'Umumiy qoldiq', key: 'total_stock', width: 15 },
          { header: 'Ishlab chiqarilgan', key: 'manufacture_date', width: 18 },
          { header: 'Yaroqlilik muddati', key: 'expiry_date', width: 18 },
          { header: "Muddatgacha (kun)", key: 'days_until_expiry', width: 18 },
          { header: 'Saqlash sharoitlari', key: 'storage_conditions', width: 20 },
          { header: 'Holat', key: 'status', width: 20 },
        ];

        // Add warehouse columns
        warehouses.forEach((wh) => {
          columns.push({ header: `Qoldiq: ${wh.name}`, key: `wh_${wh.id}`, width: 16 });
        });

        ws.columns = columns;

        // Style header row
        const headerRow = ws.getRow(1);
        headerRow.height = 28;
        headerRow.eachCell((cell) => {
          cell.fill = headerFill;
          cell.font = headerFont;
          cell.alignment = headerAlignment;
          cell.border = headerBorder;
        });

        // Add data rows with conditional formatting
        sourceData.forEach((p) => {
          const rowData: any = {
            id: p.id,
            name: p.name,
            qr_code: p.qr_code_data,
            unit: p.unit,
            min_stock: p.min_stock_level,
            total_stock: p.total_stock,
            manufacture_date: p.manufacture_date || '—',
            expiry_date: p.expiry_date || '—',
            days_until_expiry: p.days_until_expiry !== undefined && p.days_until_expiry !== null ? p.days_until_expiry : '—',
            storage_conditions: p.storage_conditions || '—',
            status: '',
          };

          // Status text
          const isExpiring = p.expiry_status === 'expiring_soon' || p.expiry_status === 'expired';
          if (p.expiry_status === 'expired') {
            rowData.status = '⚠️ MUDDATI O\'TGAN';
          } else if (p.expiry_status === 'expiring_soon') {
            rowData.status = `⏰ Muddati yaqin (${p.days_until_expiry} kun)`;
          } else if (p.is_low_stock) {
            rowData.status = '📦 Kam qoldiq';
          } else {
            rowData.status = '✅ Yaxshi';
          }

          // Add warehouse stock
          warehouses.forEach((wh) => {
            rowData[`wh_${wh.id}`] = p.warehouse_stock[wh.id] || 0;
          });

          const row = ws.addRow(rowData);
          row.height = 22;

          // Apply conditional formatting to entire row
          row.eachCell((cell) => {
            cell.border = thinBorder;
            cell.alignment = { vertical: 'middle' };

            if (isExpiring) {
              // RED for expiring/expired products
              cell.fill = expiringFill;
              cell.font = { ...expiringFont, bold: true };
            } else if (p.is_low_stock) {
              // YELLOW for low-stock products
              cell.fill = lowStockFill;
              cell.font = { ...lowStockFont, bold: true };
            } else {
              cell.font = normalFont;
            }
          });
        });

        // Add legend at the bottom
        const legendStartRow = ws.rowCount + 3;
        const legendTitle = ws.getRow(legendStartRow);
        legendTitle.getCell(1).value = 'IZOHLAR:';
        legendTitle.getCell(1).font = { bold: true, size: 11, name: 'Calibri' };

        const legendRed = ws.getRow(legendStartRow + 1);
        legendRed.getCell(1).fill = expiringFill;
        legendRed.getCell(1).value = '';
        legendRed.getCell(2).value = "🔴 Qizil — Yaroqlilik muddati yaqinlashgan yoki o'tgan mahsulotlar";
        legendRed.getCell(2).font = { size: 10, name: 'Calibri', color: { argb: 'FF991B1B' } };

        const legendYellow = ws.getRow(legendStartRow + 2);
        legendYellow.getCell(1).fill = lowStockFill;
        legendYellow.getCell(1).value = '';
        legendYellow.getCell(2).value = "🟡 Sariq — Omborda kam qoldiq (minimal zaxiradan past) mahsulotlar";
        legendYellow.getCell(2).font = { size: 10, name: 'Calibri', color: { argb: 'FF854D0E' } };

        // Auto-filter on the header row
        ws.autoFilter = {
          from: { row: 1, column: 1 },
          to: { row: 1, column: columns.length },
        };

      } else {
        // Movements report
        const ws = wb.addWorksheet('Harakatlar tarixi');

        ws.columns = [
          { header: 'Tranzaksiya ID', key: 'id', width: 14 },
          { header: 'Sana va vaqt', key: 'timestamp', width: 22 },
          { header: 'Turi', key: 'type', width: 14 },
          { header: 'Mahsulot nomi', key: 'product_name', width: 35 },
          { header: 'QR kod', key: 'qr_code', width: 16 },
          { header: 'Miqdor', key: 'quantity', width: 12 },
          { header: 'Birlik', key: 'unit', width: 10 },
          { header: 'Manba ombor', key: 'origin', width: 20 },
          { header: 'Maqsad ombor', key: 'target', width: 20 },
          { header: 'Operator', key: 'operator', width: 18 },
          { header: 'Izoh', key: 'notes', width: 25 },
        ];

        // Style header row
        const headerRow = ws.getRow(1);
        headerRow.height = 28;
        headerRow.eachCell((cell) => {
          cell.fill = headerFill;
          cell.font = headerFont;
          cell.alignment = headerAlignment;
          cell.border = headerBorder;
        });

        // Add data rows
        movements.forEach((m) => {
          const prod = productsWithStock.find((p) => p.id === m.product_id);
          const srcWh = warehouses.find((w) => w.id === m.warehouse_id);
          const tgtWh = m.target_warehouse_id
            ? warehouses.find((w) => w.id === m.target_warehouse_id)
            : null;

          const row = ws.addRow({
            id: m.id,
            timestamp: new Date(m.timestamp).toLocaleString(),
            type: m.movement_type === 'inbound' ? 'KIRIM' : m.movement_type === 'outbound' ? 'CHIQIM' : "O'TKAZMA",
            product_name: prod?.name || 'Noma\'lum',
            qr_code: prod?.qr_code_data || '',
            quantity: m.quantity,
            unit: prod?.unit || '',
            origin: srcWh?.name || '',
            target: tgtWh?.name || '',
            operator: m.user_name || 'Xodim',
            notes: m.notes || '',
          });

          row.height = 20;
          row.eachCell((cell) => {
            cell.border = thinBorder;
            cell.alignment = { vertical: 'middle' };
            cell.font = normalFont;
          });

          // Color-code movement type cell
          const typeCell = row.getCell('type');
          if (m.movement_type === 'inbound') {
            typeCell.font = { ...normalFont, bold: true, color: { argb: 'FF16A34A' } };
          } else if (m.movement_type === 'outbound') {
            typeCell.font = { ...normalFont, bold: true, color: { argb: 'FFE11D48' } };
          } else {
            typeCell.font = { ...normalFont, bold: true, color: { argb: 'FF6366F1' } };
          }
        });

        // Auto-filter
        ws.autoFilter = {
          from: { row: 1, column: 1 },
          to: { row: 1, column: 11 },
        };
      }

      // Generate and download the file
      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = reportType === 'movements'
        ? `Ombor_Harakatlar_${new Date().toISOString().slice(0, 10)}.xlsx`
        : `Ombor_Hisobot_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
      doc.setFont('Roboto', 'bold');
      doc.text('OMNISTOCK PRO - WAREHOUSE MANAGEMENT SYSTEM', 14, 12);
      doc.setFontSize(9);
      doc.setFont('Roboto', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated: ${new Date().toLocaleString()} | Language: ${language.toUpperCase()}`, 14, 18);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('Roboto', 'bold');
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
        doc.setFont('Roboto', 'bold');
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
          doc.setFont('Roboto', 'normal');
          doc.setTextColor(15, 23, 42);
          doc.text(item.qr_code_data, 16, startY);
          doc.text(item.name.slice(0, 36), 50, startY);
          doc.text(item.unit, 120, startY);
          doc.text(String(item.min_stock_level), 145, startY);

          if (item.is_low_stock) {
            doc.setTextColor(225, 29, 72);
            doc.setFont('Roboto', 'bold');
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
        doc.setFont('Roboto', 'bold');
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
          doc.setFont('Roboto', 'normal');
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

      // Today's sales and invoices
      const todayInvoices = (invoices || []).filter(
        (inv) => new Date(inv.created_at) >= startOfDay && inv.status === 'issued'
      );
      const salesCount = todayInvoices.length;
      const salesTotal = todayInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);

      // Expiring products (<= 90 days or expired)
      const expiringList = expiringItems.map((p) => ({
        name: p.name,
        code: p.qr_code_data,
        stock: p.total_stock,
        unit: p.unit,
        expiry_date: p.expiry_date,
        storage_conditions: p.storage_conditions,
        days_left: p.days_until_expiry,
      }));

      const reportData = {
        reportDate: now.toISOString().slice(0, 10),
        inboundCount: inbounds.length,
        inboundTotal,
        inboundWarehouses,
        outboundCount: outbounds.length,
        outboundTotal,
        outboundWarehouses,
        salesCount,
        salesTotal,
        lowStockItems: lowList,
        expiringItems: expiringList,
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
