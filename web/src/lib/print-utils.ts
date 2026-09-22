/**
 * Dedicated printing utility using an isolated hidden iframe.
 * Ensures that browser print preview prints ONLY the target content,
 * completely eliminating modal headers, navigation bars, backgrounds, and UI chrome.
 */

export const printViaIframe = (htmlContent: string): Promise<void> => {
  return new Promise((resolve) => {
    const iframeId = '__wms_print_frame__';
    let iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
    if (iframe && iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }

    iframe = document.createElement('iframe');
    iframe.id = iframeId;
    // Set position as fixed 0x0 size at bottom corner with visibility hidden to allow print engine to work reliably across browsers without display bugs
    // Off-screen but with a real size: 0x0 / hidden frames print blank pages in some browsers.
    iframe.setAttribute(
      'style',
      'position: fixed; left: -10000px; top: 0; width: 800px; height: 600px; border: none; opacity: 0; pointer-events: none;'
    );
    document.body.appendChild(iframe);

    let cleaned = false;
    const removeFrame = () => {
      if (cleaned) return;
      cleaned = true;
      if (iframe && iframe.parentNode) {
        try {
          iframe.parentNode.removeChild(iframe);
        } catch (e) {}
      }
      resolve();
    };
    // Remove the frame only after the print dialog is closed. Some browsers return from
    // print() immediately, and removing the frame early cancels the print job.
    const cleanup = () => {
      try {
        iframe?.contentWindow?.addEventListener('afterprint', () => setTimeout(removeFrame, 500));
      } catch (e) {}
      setTimeout(removeFrame, 60000);
    };

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      console.error('Print iframe document unavailable');
      cleanup();
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
        if (!iframe || !iframe.contentWindow) {
          cleanup();
          return;
        }
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (err) {
        console.error('Print failed:', err);
      } finally {
        cleanup();
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
            setTimeout(triggerPrint, 150);
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
        setTimeout(triggerPrint, 800);
      } else {
        setTimeout(triggerPrint, 200);
      }
    } else {
      cleanup();
    }
  });
};

export const escapeHtml = (str: string): string => {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
