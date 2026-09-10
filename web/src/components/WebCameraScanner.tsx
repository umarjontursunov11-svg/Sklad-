'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../lib/i18n';
import { ProductWithStock } from '../lib/types';

interface WebCameraScannerProps {
  onScanSuccess: (product: ProductWithStock) => void;
  onClose: () => void;
}

export const WebCameraScanner: React.FC<WebCameraScannerProps> = ({ onScanSuccess, onClose }) => {
  const { findProductByQR, productsWithStock } = useApp();
  const { t } = useI18n();

  const [manualCode, setManualCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    let isMounted = true;

    try {
      const scanner = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scannerRef.current = scanner;

      scanner.render(
        (decodedText) => {
          if (!isMounted) return;
          const found = findProductByQR(decodedText);
          if (found) {
            scanner.clear().catch(console.error);
            onScanSuccess(found);
          } else {
            setErrorMsg(`QR code ("${decodedText}") — not found`);
          }
        },
        () => {}
      );
    } catch (e) {
      console.warn('Camera scanner initialization failed:', e);
    }

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [findProductByQR, onScanSuccess]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    const found = findProductByQR(manualCode.trim());
    if (found) {
      if (scannerRef.current) scannerRef.current.clear().catch(console.error);
      onScanSuccess(found);
    } else {
      setErrorMsg(`"${manualCode}"`);
    }
  };

  const handleQuickSelect = (qrCode: string) => {
    const found = findProductByQR(qrCode);
    if (found) {
      if (scannerRef.current) scannerRef.current.clear().catch(console.error);
      onScanSuccess(found);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg p-6 overflow-hidden rounded-2xl glass-panel border border-white/10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.inAppScannerTitle}</h3>
            <p className="text-xs text-slate-400">{t.inAppScannerDesc}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-slate-950/80 border border-white/10 my-3 relative min-h-[260px] flex flex-col items-center justify-center">
          <div id="reader" className="w-full text-slate-100" />
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 my-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Manual Code Input */}
        <form onSubmit={handleManualSubmit} className="mt-4">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            {t.manualCodeLabel}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. WMS-PRD-1001"
              value={manualCode}
              onChange={(e) => {
                setManualCode(e.target.value);
                setErrorMsg(null);
              }}
              className="flex-1 px-3.5 py-2 text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors flex items-center gap-1.5"
            >
              {t.lookupBtn} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* One-Click Quick Presets for Demo */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <span className="text-[11px] text-slate-400 block mb-2">{t.quickPresets}</span>
          <div className="flex flex-wrap gap-1.5">
            {productsWithStock.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => handleQuickSelect(p.qr_code_data)}
                className="px-2.5 py-1 text-[11px] font-mono font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/20 rounded-lg transition-colors truncate max-w-[150px]"
                title={p.name}
              >
                {p.qr_code_data}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
