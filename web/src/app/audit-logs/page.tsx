'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../lib/store';
import { useI18n } from '../../lib/i18n';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  User,
  Laptop,
  Search,
  Download,
  AlertTriangle,
  ArrowDownUp,
  ArrowDownLeft,
  ArrowUpRight,
  ReceiptText,
  FileEdit,
  LogIn,
  LogOut,
  KeyRound,
  Filter,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AuditLogsPage() {
  const { currentUser, loginLogs, users, movements, warehouses } = useApp();
  const { t } = useI18n();

  const isAuthorized = currentUser.role === 'admin' || currentUser.role === 'warehouse_manager';

  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">{t.accessDenied || 'Ruxsat cheklangan'}</h2>
        <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
          Audit jurnali faqat ombor mudirlari va tizim administratorlari uchun ochiq. Sizning joriy rolingiz ({currentUser.role})
          ushbu ma'lumotlarni ko'rishga ruxsat bermaydi.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  // Filter logs
  const filteredLogs = loginLogs.filter((log) => {
    const matchesStaff = staffFilter === 'all' || log.user_id === staffFilter;
    const matchesEvent = eventTypeFilter === 'all' || log.event_type === eventTypeFilter;
    const matchesSearch =
      !search ||
      (log.user_name && log.user_name.toLowerCase().includes(search.toLowerCase())) ||
      (log.employee_id && log.employee_id.toLowerCase().includes(search.toLowerCase())) ||
      log.event_type.toLowerCase().includes(search.toLowerCase()) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(search.toLowerCase()));

    return matchesStaff && matchesEvent && matchesSearch;
  });

  const totalEvents = loginLogs.length;
  const failedPinAttempts = loginLogs.filter((l) => l.event_type === 'admin_access_failed').length;
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayEvents = loginLogs.filter((l) => l.created_at.startsWith(todayDateStr)).length;

  const handleExportExcel = () => {
    const rows = filteredLogs.map((log) => ({
      'Log ID': log.id,
      'Vaqt (Time)': new Date(log.created_at).toLocaleString(),
      'Xodim (Staff)': log.user_name,
      'EMP ID': log.employee_id || '—',
      'Rol (Role)': log.role || '—',
      'Voqea turi (Event)': log.event_type,
      'Qurilma (Device)': log.device_type,
      'IP Manzil': log.ip_address,
      'Tafsilotlar (Details)': log.details ? JSON.stringify(log.details) : '—',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Audit Logs');
    XLSX.writeFile(wb, `WMS_Audit_Logs_${Date.now()}.xlsx`);
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'login':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <LogIn className="w-3 h-3" /> Kirish (Login)
          </span>
        );
      case 'logout':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30">
            <LogOut className="w-3 h-3" /> Chiqish (Logout)
          </span>
        );
      case 'movement_created':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <ArrowDownUp className="w-3 h-3" /> Harakat
          </span>
        );
      case 'invoice_created':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <ReceiptText className="w-3 h-3" /> Faktura
          </span>
        );
      case 'correction_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <FileEdit className="w-3 h-3" /> Tuzatish so'raldi
          </span>
        );
      case 'correction_approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Tuzatish tasdiqlandi
          </span>
        );
      case 'correction_rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3 h-3" /> Tuzatish rad etildi
          </span>
        );
      case 'admin_access_success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <KeyRound className="w-3 h-3" /> Admin PIN tasdiqlandi
          </span>
        );
      case 'admin_access_failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white animate-pulse">
            <AlertTriangle className="w-3 h-3" /> Noto'g'ri PIN urinishi!
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-700 text-slate-300">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-indigo-400" />
            <span>Xodimlar Faoliyati & Audit Jurnali</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Har bir harakat, login, tovar operatsiyasi va xavfsizlik hodisasining to'liq xronologik izi.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Excelga Eksport</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-white/10 bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Jami qaydlar</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalEvents}</div>
          <span className="text-[10px] text-slate-500">Barcha xodimlar harakati</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Bugungi faollik</span>
            <User className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{todayEvents}</div>
          <span className="text-[10px] text-slate-500">Bugun amalga oshirilgan operatsiyalar</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Xavfsizlik ogohlantirishlari</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">{failedPinAttempts}</div>
          <span className="text-[10px] text-slate-500">Muvaffaqiyatsiz PIN urinishlari</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 glass-panel rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Xodim, EMP ID, voqea turi bo'yicha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Staff Filter */}
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Barcha xodimlar</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name || u.name} ({u.employee_id || u.role})
                </option>
              ))}
            </select>
          </div>

          {/* Event Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Barcha hodisalar</option>
              <option value="login">Tizimga kirish (Login)</option>
              <option value="logout">Chiqish (Logout)</option>
              <option value="movement_created">Kirim / Chiqim</option>
              <option value="invoice_created">Sotuv fakturasi</option>
              <option value="correction_requested">Tuzatish so'rovi</option>
              <option value="correction_approved">Tuzatish tasdiqlandi</option>
              <option value="correction_rejected">Tuzatish rad etildi</option>
              <option value="admin_access_success">Admin PIN muvaffaqiyatli</option>
              <option value="admin_access_failed">Admin PIN xato (Xavf)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto glass-panel rounded-2xl border border-white/10 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10 font-bold">
            <tr>
              <th className="py-3.5 px-4">Vaqt & IP</th>
              <th className="py-3.5 px-4">Xodim & Rol</th>
              <th className="py-3.5 px-4">Hodisa</th>
              <th className="py-3.5 px-4">Qurilma</th>
              <th className="py-3.5 px-4">Tafsilotlar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500 italic">
                  Belgilangan filtrlar bo'yicha hech qanday yozuv topilmadi.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono text-slate-200 font-bold">
                      {new Date(log.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.created_at).toLocaleDateString()} &bull; {log.ip_address}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{log.user_name}</span>
                      {log.employee_id && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {log.employee_id}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {log.role ? log.role.replace('_', ' ') : '—'}
                    </div>
                  </td>

                  <td className="py-3 px-4">{getEventBadge(log.event_type)}</td>

                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Laptop className="w-3.5 h-3.5 text-slate-500" />
                      <span>{log.device_type}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-300 text-xs font-mono max-w-xs truncate">
                    {log.details ? JSON.stringify(log.details) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
