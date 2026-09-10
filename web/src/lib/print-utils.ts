/**
 * Dedicated printing utility using an isolated hidden iframe.
 * Ensures that browser print preview prints ONLY the target content,
 * completely eliminating modal headers, navigation bars, backgrounds, and UI chrome.
 */

export const printViaIframe = (htmlContent: string) => {
  const iframeId = '__wms_print_frame__';
  let iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
  if (iframe && iframe.parentNode) {
    iframe.parentNode.removeChild(iframe);
  }

  iframe = document.createElement('iframe');
  iframe.id = iframeId;
  iframe.setAttribute('style', 'position: fixed; right: 0; bottom: 0; width: 0; height: 0; border: 0; visibility: hidden;');
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    console.error('Print iframe document unavailable');
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  // Give images (like QR codes) a short moment to render, then invoke browser print
  setTimeout(() => {
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }, 250);
};

export const escapeHtml = (str: string): string => {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
