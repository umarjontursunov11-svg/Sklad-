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
  iframe.setAttribute(
    'style',
    'position: fixed; top: -10000px; left: -10000px; width: 1000px; height: 1000px; border: 0; opacity: 0; pointer-events: none;'
  );
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    console.error('Print iframe document unavailable');
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  let printed = false;
  const triggerPrint = () => {
    if (printed) return;
    printed = true;
    try {
      if (!iframe || !iframe.contentWindow) return;
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (err) {
      console.error('Print failed:', err);
    }
  };

  if (iframe.contentWindow) {
    const images = doc.getElementsByTagName('img');
    if (images.length > 0) {
      let loadedCount = 0;
      const totalImages = images.length;
      const onImgDone = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
          setTimeout(triggerPrint, 100);
        }
      };

      for (let i = 0; i < totalImages; i++) {
        if (images[i].complete) {
          onImgDone();
        } else {
          images[i].onload = onImgDone;
          images[i].onerror = onImgDone;
        }
      }
      setTimeout(triggerPrint, 600);
    } else {
      setTimeout(triggerPrint, 150);
    }
  }
};

export const escapeHtml = (str: string): string => {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
