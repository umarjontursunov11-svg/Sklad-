'use client';

import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from '../lib/store';
import { I18nProvider } from '../lib/i18n';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileNav } from '../components/MobileNav';
import { WebCameraScanner } from '../components/WebCameraScanner';
import { QuickTransactionModal } from '../components/QuickTransactionModal';
import { LoginScreen } from '../components/LoginScreen';
import { ForcePasswordChangeModal } from '../components/ForcePasswordChangeModal';
import { ProductWithStock } from '../lib/types';

// Inner component that uses auth context
const AuthenticatedApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, authenticatedUser } = useApp();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ProductWithStock | null>(null);

  const handleScanSuccess = (product: ProductWithStock) => {
    setIsScannerOpen(false);
    setScannedProduct(product);
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Force password change on first login
  if (authenticatedUser?.must_change_password) {
    return <ForcePasswordChangeModal />;
  }

  // Authenticated — show main app
  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-slate-100">
      <Navbar onOpenScanner={() => setIsScannerOpen(true)} />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 pb-28 sm:p-6 sm:pb-28 md:p-8 lg:pb-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Phone / tablet bottom navigation (desktop uses the Sidebar) */}
      <MobileNav onOpenScanner={() => setIsScannerOpen(true)} />

      {/* Global Camera Scanner Modal */}
      {isScannerOpen && (
        <WebCameraScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setIsScannerOpen(false)}
        />
      )}

      {/* Global Quick Transaction Modal */}
      {scannedProduct && (
        <QuickTransactionModal
          product={scannedProduct}
          onClose={() => setScannedProduct(null)}
        />
      )}
    </div>
  );
};

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Register the service worker so the site can be installed as a phone app (PWA).
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;
    navigator.serviceWorker.register('/sw.js').catch((e) => console.warn('SW registration failed:', e));
  }, []);

  return (
    <I18nProvider>
      <AppProvider>
        <AuthenticatedApp>{children}</AuthenticatedApp>
      </AppProvider>
    </I18nProvider>
  );
};
