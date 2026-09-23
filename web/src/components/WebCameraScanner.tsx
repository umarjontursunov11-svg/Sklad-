'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertTriangle, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../lib/i18n';
import { ProductWithStock } from '../lib/types';

interface WebCameraScannerProps {
  onScanSuccess: (product: ProductWithStock) => void;
  onClose: () => void;
  /** Keep the camera open and report every scanned product (used by "+ Yana tovar qo'shish"). */
  continuous?: boolean;
  title?: string;
}

const READER_ID = 'omnistock-qr-reader';

/**
 * QR scanner that opens the rear camera straight away.
 * - One camera request per opening (no "Request permission" / camera-picker screens).
 * - The camera is not restarted when the app re-renders (that caused repeated permission prompts).
 * - Continuous mode: scan several products one after another without closing the camera.
 */
export const WebCameraScanner: React.FC<WebCameraScannerProps> = ({
  onScanSuccess,
  onClose,
  continuous = false,
  title,
}) => {
  const { findProductByQR, productsWithStock } = useApp();
  const { t } = useI18n();

  const [manualCode, setManualCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastAdded, setLastAdded] = useState<{ name: string; count: number } | null>(null);
  const [starting, setStarting] = useState(true);
  const [retryKey, setRetryKey] = useState(0);

  // Latest callbacks in refs so the camera effect never restarts because of re-renders.
  const findRef = useRef(findProductByQR);
  const successRef = useRef(onScanSuccess);
  const continuousRef = useRef(continuous);
  findRef.current = findProductByQR;
  successRef.current = onScanSuccess;
  continuousRef.current = continuous;

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastCodeRef = useRef<{ code: string; at: number }>({ code: '', at: 0 });
  const addedCountRef = useRef(0);

  const stopCamera = async () => {
    const sc = scannerRef.current;
    scannerRef.current = null;
    if (!sc) return;
    try {
      if (sc.isScanning) await sc.stop();
      sc.clear();
    } catch (e) {
      /* already stopped */
    }
  };

  const handleFound = (product: ProductWithStock) => {
    if (continuousRef.current) {
      addedCountRef.current += 1;
      setLastAdded({ name: product.name, count: addedCountRef.current });
      try {
        navigator.vibrate?.(60);
      } catch (e) {}
      successRef.current(product);
    } else {
      stopCamera().finally(() => successRef.current(product));
    }
  };

  useEffect(() => {
    let cancelled = false;
    setCameraError(null);
    setStarting(true);

    const start = async () => {
      try {
        const scanner = new Html5Qrcode(READER_ID, { verbose: false });
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: (w: number, h: number) => {
              const size = Math.floor(Math.min(w, h) * 0.7);
              return { width: size, height: size };
            } },
          (decodedText) => {
            const now = Date.now();
            // Ignore the same code read again within 2 s (camera sees it many times per second).
            if (decodedText === lastCodeRef.current.code && now - lastCodeRef.current.at < 2000) return;
            lastCodeRef.current = { code: decodedText, at: now };

            const found = findRef.current(decodedText);
            if (found) {
              setErrorMsg(null);
              handleFound(found);
            } else {
              setErrorMsg(`QR kod ("${decodedText}") bo'yicha tovar topilmadi`);
            }
          },
          () => {}
        );
        if (cancelled) await stopCamera();
      } catch (e: any) {
        if (cancelled) return;
        const msg = String(e?.message || e || '');
        if (/NotAllowed|Permission|denied/i.test(msg)) {
          setCameraError(
            "Kameraga ruxsat berilmagan. Brauzer sozlamalarida ushbu sayt uchun kamerani «Ruxsat berish» (Allow) holatiga o'tkazing."
          );
        } else if (/NotFound|no camera|Requested device not found/i.test(msg)) {
          setCameraError('Kamera topilmadi.');
        } else {
          setCameraError("Kamerani ishga tushirib bo'lmadi. Qayta urinib ko'ring.");
        }
      } finally {
        if (!cancelled) setStarting(false);
      }
    };

    start();
    return () => {
      cancelled = true;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryKey]);

  const handleClose = () => {
    stopCamera().finally(onClose);
  };

  const lookup = (code: string) => {
    const found = findProductByQR(code.trim());
    if (found) {
      setErrorMsg(null);
      handleFound(found);
      setManualCode('');
    } else {
      setErrorMsg(`"${code}" bo'yicha tovar topilmadi`);
    }
  };

  const content = (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg p-5 sm:p-6 overflow-hidden rounded-2xl glass-panel border border-white/10 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-10">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{title || t.inAppScannerTitle}</h3>
            <p className="text-xs text-slate-400">
              {continuous ? "Tovarlarni ketma-ket skanerlang — har biri ro'yxatga qo'shiladi" : t.inAppScannerDesc}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-black border border-white/10 aspect-square max-h-[55vh] mx-auto">
          <div id={READER_ID} className="w-full h-full [&_video]:object-cover [&_video]:w-full [&_video]:h-full" />
          {starting && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
              Kamera ochilmoqda...
            </div>
          )}
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
              <p className="text-xs text-slate-300 leading-relaxed">{cameraError}</p>
              <button
                type="button"
                onClick={() => setRetryKey((k) => k + 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Qayta urinish
              </button>
            </div>
          )}
        </div>

        {continuous && lastAdded && (
          <div className="flex items-center gap-2 p-2.5 mt-3 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span className="truncate">
              Qo'shildi: <b>{lastAdded.name}</b> · jami {lastAdded.count} ta skan
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 mt-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Manual Code Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (manualCode.trim()) lookup(manualCode);
          }}
          className="mt-4"
        >
          <label className="block text-xs font-medium text-slate-300 mb-1.5">{t.manualCodeLabel}</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. WMS-PRD-1001"
              value={manualCode}
              onChange={(e) => {
                setManualCode(e.target.value);
                setErrorMsg(null);
              }}
              className="flex-1 min-w-0 px-3.5 py-2 text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors flex items-center gap-1.5"
            >
              {t.lookupBtn} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {continuous ? (
          <button
            type="button"
            onClick={handleClose}
            className="w-full mt-4 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl"
          >
            Tayyor
          </button>
        ) : (
          productsWithStock.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <span className="text-[11px] text-slate-400 block mb-2">{t.quickPresets}</span>
              <div className="flex flex-wrap gap-1.5">
                {productsWithStock.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => lookup(p.qr_code_data)}
                    className="px-2.5 py-1 text-[11px] font-mono font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/20 rounded-lg transition-colors truncate max-w-[150px]"
                    title={p.name}
                  >
                    {p.qr_code_data}
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );

  if (typeof document === 'undefined') return content;
  return createPortal(content, document.body);
};
