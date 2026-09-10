import { InvoiceWithItems } from './types';
import { printViaIframe, escapeHtml } from './print-utils';
import { jsPDF } from 'jspdf';

export interface CompanyInfo {
  name: string;
  phone?: string;
  address?: string;
  inn?: string;
}

export const DEFAULT_COMPANY: CompanyInfo = {
  name: '«STANDART VA METROLOGIYA» MCHJ',
  phone: '+998 98 361-71-83',
  address: 'Toshkent sh., Yakkasaroy tumani Yakkasaroy k. 5-uy',
  inn: '308097539',
};

const COMPANY_STORAGE_KEY = 'wms_company_info_v1';

export const getCompanyInfo = (): CompanyInfo => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(COMPANY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_COMPANY, ...parsed };
      }
    } catch (e) {
      console.error('Error reading company info:', e);
    }
  }
  return DEFAULT_COMPANY;
};

export const saveCompanyInfo = (info: CompanyInfo) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(info));
    } catch (e) {
      console.error('Error saving company info:', e);
    }
  }
};

const formatPrice = (val: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(val) + " so'm";
};

const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

/**
 * Generates an official, standard A4 printable waybill / invoice HTML
 * (Tovarni jo'natish hujjati / Товарная накладная).
 */
export const generateWaybillHtml = (
  invoice: InvoiceWithItems,
  company: CompanyInfo = getCompanyInfo()
): string => {
  const itemsRows = invoice.items
    .map((item, idx) => {
      const prodName = item.product?.name || `Mahsulot #${item.product_id}`;
      const unit = item.product?.unit || 'dona';
      return `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td style="font-weight: 500;">${escapeHtml(prodName)}</td>
          <td style="text-align: center;">${escapeHtml(unit)}</td>
          <td style="text-align: right; font-weight: 600;">${item.quantity}</td>
          <td style="text-align: right;">${formatPrice(item.unit_price)}</td>
          <td style="text-align: right; font-weight: bold;">${formatPrice(item.line_total)}</td>
        </tr>
      `;
    })
    .join('');

  const totalQty = invoice.items.reduce((sum, item) => sum + item.quantity, 0);

  return `
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <title>Yuk Xati / Накладная: ${escapeHtml(invoice.invoice_number)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 20mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 11pt;
      color: #1a1a1a;
      background: #fff;
      margin: 0;
      padding: 0;
      line-height: 1.4;
    }
    .header-box {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .doc-title {
      font-size: 18pt;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 4px 0;
    }
    .doc-subtitle {
      font-size: 10pt;
      color: #64748b;
      margin: 0;
    }
    .doc-number {
      font-size: 14pt;
      font-weight: 700;
      color: #2563eb;
      text-align: right;
    }
    .doc-date {
      font-size: 10pt;
      color: #475569;
      text-align: right;
      margin-top: 4px;
    }
    .status-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 9pt;
      font-weight: 700;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .status-issued { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
    .status-draft { background: #fef9c3; color: #854d0e; border: 1px solid #fde047; }
    .status-cancelled { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }

    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    .party-card {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 12px 16px;
      background: #f8fafc;
    }
    .party-title {
      font-size: 9pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    .party-name {
      font-size: 12pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .party-detail {
      font-size: 9.5pt;
      color: #475569;
      margin: 2px 0;
    }

    table.items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 10pt;
    }
    table.items-table th {
      background-color: #f1f5f9;
      border: 1px solid #94a3b8;
      padding: 8px 10px;
      text-align: left;
      font-weight: 700;
      color: #0f172a;
      font-size: 9pt;
      text-transform: uppercase;
    }
    table.items-table td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      vertical-align: middle;
    }
    table.items-table tbody tr:nth-child(even) {
      background-color: #f8fafc;
    }

    .totals-area {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 28px;
    }
    .totals-box {
      width: 320px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 14px;
      font-size: 10pt;
      border-bottom: 1px solid #e2e8f0;
    }
    .totals-row.grand-total {
      background: #0f172a;
      color: #ffffff;
      font-size: 12pt;
      font-weight: 800;
      border-bottom: none;
    }

    .notes-box {
      margin-bottom: 24px;
      padding: 10px 14px;
      background: #f1f5f9;
      border-left: 4px solid #3b82f6;
      border-radius: 0 4px 4px 0;
      font-size: 9.5pt;
      color: #334155;
    }

    .signatures-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 36px;
      page-break-inside: avoid;
    }
    .signature-card {
      padding-top: 8px;
    }
    .signature-role {
      font-size: 10pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 40px;
    }
    .signature-line {
      border-bottom: 1px dashed #475569;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
    }
    .signature-caption {
      font-size: 8.5pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
    .stamp-box {
      margin-top: 14px;
      font-size: 8.5pt;
      color: #94a3b8;
      font-weight: 600;
      text-align: center;
      border: 1px dashed #cbd5e1;
      padding: 10px;
      width: 140px;
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <div class="header-box">
    <div class="title-row">
      <div>
        <h1 class="doc-title">Tovarni Jo'natish Hujjati</h1>
        <p class="doc-subtitle">Товарная накладная / Sales Invoice &amp; Delivery Waybill</p>
      </div>
      <div>
        <div class="doc-number">${escapeHtml(invoice.invoice_number)}</div>
        <div class="doc-date">Sana: ${formatDate(invoice.created_at)}</div>
        <div style="text-align: right;">
          <span class="status-badge status-${invoice.status}">
            ${invoice.status === 'issued' ? 'RASMIYLASHTIRILGAN / ВЫДАН' : invoice.status === 'cancelled' ? 'BEKOR QILINGAN / АННУЛИРОВАН' : 'QORALAMA / ЧЕРНОВИК'}
          </span>
        </div>
      </div>
    </div>
  </div>

  <div class="parties-grid">
    <div class="party-card">
      <div class="party-title">Yetkazib beruvchi / Поставщик (Sotuvchi)</div>
      <div class="party-name">${escapeHtml(company.name)}</div>
      <div class="party-detail"><strong>Ombor:</strong> ${escapeHtml(invoice.warehouse_name || 'Markaziy Ombor')}</div>
      ${company.address ? `<div class="party-detail"><strong>Manzil:</strong> ${escapeHtml(company.address)}</div>` : ''}
      ${company.phone ? `<div class="party-detail"><strong>Tel:</strong> ${escapeHtml(company.phone)}</div>` : ''}
      ${company.inn ? `<div class="party-detail"><strong>INN / STIR:</strong> ${escapeHtml(company.inn)}</div>` : ''}
    </div>

    <div class="party-card">
      <div class="party-title">Qabul qiluvchi / Покупатель (Xaridor)</div>
      <div class="party-name">${escapeHtml(invoice.customer_name)}</div>
      ${invoice.customer_phone ? `<div class="party-detail"><strong>Tel:</strong> ${escapeHtml(invoice.customer_phone)}</div>` : '<div class="party-detail"><strong>Tel:</strong> Ko\'rsatilmagan</div>'}
      ${invoice.customer_address ? `<div class="party-detail"><strong>Manzil:</strong> ${escapeHtml(invoice.customer_address)}</div>` : ''}
      ${invoice.customer_inn ? `<div class="party-detail"><strong>INN / STIR:</strong> ${escapeHtml(invoice.customer_inn)}</div>` : ''}
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th style="width: 35px; text-align: center;">№</th>
        <th>Mahsulot nomi / Наименование</th>
        <th style="width: 80px; text-align: center;">Birligi</th>
        <th style="width: 70px; text-align: right;">Miqdor</th>
        <th style="width: 120px; text-align: right;">Narxi</th>
        <th style="width: 130px; text-align: right;">Summasi</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows}
    </tbody>
  </table>

  <div class="totals-area">
    <div class="totals-box">
      <div class="totals-row">
        <span>Pozitsiyalar soni:</span>
        <strong>${invoice.items.length} ta</strong>
      </div>
      <div class="totals-row">
        <span>Jami tovar miqdori:</span>
        <strong>${totalQty}</strong>
      </div>
      <div class="totals-row grand-total">
        <span>JAMI TO'LOV:</span>
        <span>${formatPrice(invoice.total_amount)}</span>
      </div>
    </div>
  </div>

  ${invoice.notes ? `
    <div class="notes-box">
      <strong>Izoh / Примечание:</strong> ${escapeHtml(invoice.notes)}
    </div>
  ` : ''}

  <div class="signatures-grid">
    <div class="signature-card">
      <div class="signature-role">Topshirdi / Отпустил (Ombor mas'uli):</div>
      <div class="signature-line">
        <span>${escapeHtml(invoice.creator_name || 'Admin')}</span>
      </div>
      <div class="signature-caption">
        <span>(F.I.O. va Imzo)</span>
        <span>Sana: ____________</span>
      </div>
      <div class="stamp-box">
        M.O'. / М.П.
      </div>
    </div>

    <div class="signature-card">
      <div class="signature-role">Qabul qildi / Получил (Xaridor / Vakil):</div>
      <div class="signature-line">
        <span>${escapeHtml(invoice.customer_name)}</span>
      </div>
      <div class="signature-caption">
        <span>(F.I.O. va Imzo)</span>
        <span>Sana: ____________</span>
      </div>
      <div class="stamp-box">
        M.O'. / М.П.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Directly prints the Waybill document via isolated hidden iframe.
 */
export const printWaybill = (invoice: InvoiceWithItems) => {
  const html = generateWaybillHtml(invoice);
  printViaIframe(html);
};

/**
 * Generates and downloads a direct PDF file using jsPDF.
 */
export const downloadWaybillPdf = (
  invoice: InvoiceWithItems,
  company: CompanyInfo = getCompanyInfo()
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 16;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("TOVARNI JO'NATISH HUJJATI / NAKLADNAYA", 14, y);

  doc.setFontSize(12);
  doc.setTextColor(37, 99, 235);
  doc.text(invoice.invoice_number, pageWidth - 14, y, { align: 'right' });

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Savdo va yuk jo\'natish hisob-fakturasi (Waybill)', 14, y);
  doc.text(`Sana: ${formatDate(invoice.created_at)}`, pageWidth - 14, y, { align: 'right' });

  y += 6;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.6);
  doc.line(14, y, pageWidth - 14, y);

  y += 8;
  // Parties Box
  const boxWidth = (pageWidth - 36) / 2;
  
  // Seller
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, boxWidth, 28, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('YETKAZIB BERUVCHI / SOTUVCHI', 18, y + 6);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(company.name, 18, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Ombor: ${invoice.warehouse_name || 'Asosiy Ombor'}`, 18, y + 17);
  doc.text(`Tel: ${company.phone || ''} | INN: ${company.inn || ''}`, 18, y + 22);

  // Buyer
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(18 + boxWidth, y, boxWidth, 28, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('XARIDOR / QABUL QILUVCHI', 22 + boxWidth, y + 6);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(invoice.customer_name, 22 + boxWidth, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Tel: ${invoice.customer_phone || 'Keltirilmagan'}`, 22 + boxWidth, y + 17);
  if (invoice.customer_inn) {
    doc.text(`INN / STIR: ${invoice.customer_inn}`, 22 + boxWidth, y + 22);
  }

  y += 34;

  // Table Headers
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 8, 'F');
  doc.setDrawColor(148, 163, 184);
  doc.rect(14, y, pageWidth - 28, 8, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('№', 16, y + 5.5);
  doc.text('MAHSULOT NOMI', 26, y + 5.5);
  doc.text('BIRLIGI', 105, y + 5.5);
  doc.text('MIQDOR', 125, y + 5.5, { align: 'right' });
  doc.text('NARXI', 155, y + 5.5, { align: 'right' });
  doc.text('JAMI SUMMA', pageWidth - 16, y + 5.5, { align: 'right' });

  y += 8;

  // Items
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);

  invoice.items.forEach((item, index) => {
    const rowHeight = 7;
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, pageWidth - 28, rowHeight, 'S');

    doc.text(String(index + 1), 16, y + 5);
    const prodName = item.product?.name || `Mahsulot #${item.product_id}`;
    doc.text(prodName.length > 35 ? prodName.substring(0, 32) + '...' : prodName, 26, y + 5);
    doc.text(item.product?.unit || 'dona', 105, y + 5);
    doc.text(String(item.quantity), 125, y + 5, { align: 'right' });
    doc.text(new Intl.NumberFormat('uz-UZ').format(item.unit_price) + " so'm", 155, y + 5, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(new Intl.NumberFormat('uz-UZ').format(item.line_total) + " so'm", pageWidth - 16, y + 5, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    y += rowHeight;
  });

  y += 4;
  // Totals Box
  const totalBoxX = pageWidth - 90;
  doc.setFillColor(15, 23, 42);
  doc.rect(totalBoxX, y, 76, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("JAMI TO'LOV:", totalBoxX + 4, y + 7.5);
  doc.setFontSize(10);
  doc.text(formatPrice(invoice.total_amount), pageWidth - 18, y + 7.5, { align: 'right' });

  y += 24;

  // Signatures
  doc.setDrawColor(71, 85, 105);
  doc.setLineDashPattern([1, 1], 0);

  // Left signature
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text("Topshirdi / O'tkazdi:", 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Mas'ul: ${invoice.creator_name || 'Admin'}`, 14, y + 6);
  doc.line(14, y + 16, 85, y + 16);
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('(F.I.O. va Imzo)   Sana: ____________', 14, y + 20);

  // Right signature
  const rightSigX = pageWidth - 85;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Qabul qildi / Xaridor:', rightSigX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Mijoz: ${invoice.customer_name}`, rightSigX, y + 6);
  doc.line(rightSigX, y + 16, pageWidth - 14, y + 16);
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('(F.I.O. va Imzo)   Sana: ____________', rightSigX, y + 20);

  // Save the PDF
  const filename = `Waybill_${invoice.invoice_number.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  doc.save(filename);
};
