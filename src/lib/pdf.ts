import html2pdf from 'html2pdf.js';

// ─────────────────────────────────────────────────────────────────────────────
// A4 high-resolution options shared across all export functions
// ─────────────────────────────────────────────────────────────────────────────
const A4_OPTIONS = {
  margin: 0,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    logging: false,
    allowTaint: true,
    backgroundColor: '#ffffff',
  },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
};

// ─────────────────────────────────────────────────────────────────────────────
// exportCVToPDF — Primary export used by CVPreview & CoverLetterStudio
// Searches the element in the main document AND inside child iframes
// (supports the IsolatedIframe pattern used in CVPreview)
// ─────────────────────────────────────────────────────────────────────────────
export interface ExportCVToPDFOptions {
  fileName?: string;
  elementId?: string;
  onProgress?: (status: string) => void;
}

export const exportCVToPDF = async ({
  fileName = 'VITAREY_Document.pdf',
  elementId = 'cv-printable-document',
  onProgress,
}: ExportCVToPDFOptions = {}): Promise<boolean> => {
  onProgress?.('Recherche du document...');

  // 1. Search in main document
  let element: HTMLElement | null = document.getElementById(elementId);

  // 2. If not found, search inside child iframes (IsolatedIframe component)
  if (!element) {
    const iframes = document.querySelectorAll('iframe');
    for (const iframe of Array.from(iframes)) {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          element = iframeDoc.getElementById(elementId);
          if (element) break;
        }
      } catch {
        // Cross-origin iframe — skip silently
      }
    }
  }

  if (!element) {
    console.error(`[pdf.ts] Element #${elementId} not found in DOM or iframes.`);
    onProgress?.('Element not found — using native print...');
    triggerNativePrint();
    return false;
  }

  try {
    onProgress?.('Génération PDF A4...');

    const opt = {
      ...A4_OPTIONS,
      filename: fileName,
    };

    await html2pdf().set(opt).from(element).save();

    onProgress?.('PDF téléchargé !');
    return true;
  } catch (error) {
    console.error('[pdf.ts] PDF generation error:', error);
    onProgress?.('Erreur — impression native activée...');
    triggerNativePrint();
    return false;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// triggerNativePrint — Browser native print fallback
// ─────────────────────────────────────────────────────────────────────────────
export const triggerNativePrint = (): void => {
  window.print();
};

// ─────────────────────────────────────────────────────────────────────────────
// downloadAsPDF — Legacy simple API (kept for backward compatibility)
// ─────────────────────────────────────────────────────────────────────────────
export const downloadAsPDF = async (
  elementId: string,
  filename: string = 'document.pdf'
): Promise<void> => {
  await exportCVToPDF({ elementId, fileName: filename });
};