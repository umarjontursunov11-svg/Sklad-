'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Renders a modal overlay directly under <body>, so the page's animated wrapper
// can't trap the fixed overlay beneath the header or cut off the dialog.
export function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}
