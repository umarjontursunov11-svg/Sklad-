'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '../lib/store';
import { I18nProvider } from '../lib/i18n';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { WebCameraScanner } from '../components/WebCameraScanner';
import { QuickTransactionModal } from '../components/QuickTransactionModal';
import { LoginScreen } from '../components/LoginScreen';
import { ProductWithStock } from '../lib/types';

// Inner component that uses auth context
const AuthenticatedApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();
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

  // Authenticated — show main app
  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-slate-100">
      <Navbar onOpenScanner={() => setIsScannerOpen(true)} />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

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
  return (
    <I18nProvider>
      <AppProvider>
        <AuthenticatedApp>{children}</AuthenticatedApp>
      </AppProvider>
    </I18nProvider>
  );
};
