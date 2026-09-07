import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  fileName?: string;
  elementId?: string;
  targetElement?: HTMLElement | null;
  onProgress?: (status: string) => void;
}

/**
 * Triggers a direct, clean file download in the browser from a Blob.
 */
export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.target = '_blank';
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  }, 2500);
};

/**
 * Ensures all web fonts and images within the target element are fully loaded and rasterized.
 */
async function waitForRenderReady(element: HTMLElement, targetDoc: Document): Promise<void> {
  // 1. Wait for document fonts to settle
  try {
    if (targetDoc.fonts) {
      await targetDoc.fonts.ready;
    }
    if (document.fonts && document.fonts !== targetDoc.fonts) {
      await document.fonts.ready;
    }
  } catch (err) {
    console.warn('Font loading check completed with warning:', err);
  }

  // 2. Wait for all images inside element to be complete and decoded
  const images = Array.from(element.querySelectorAll('img'));
  if (images.length > 0) {
    await Promise.all(
      images.map(async (img) => {
        try {
          if (!img.complete || img.naturalHeight === 0) {
            await new Promise<void>((resolve) => {
              const timer = setTimeout(resolve, 3000);
              img.addEventListener('load', () => {
                clearTimeout(timer);
                resolve();
              }, { once: true });
              img.addEventListener('error', () => {
                clearTimeout(timer);
                resolve();
              }, { once: true });
            });
          }
          if ('decode' in img && typeof img.decode === 'function') {
            await img.decode().catch(() => {});
          }
        } catch {
          // Continue if single image fails
        }
      })
    );
  }

  // 3. Double requestAnimationFrame to guarantee layout reflow and rendering pipeline finish
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 80);
      });
    });
  });
}

/**
 * Primary PDF exporter for VITAREY CVs and Cover Letters using html2pdf.js.
 * Configured for A4, margin 0mm, high-res scale 2, and genuine download triggering.
 */
export const exportCVToPDF = async ({
  fileName = 'VITAREY_Document.pdf',
  elementId = 'cv-printable-document',
  targetElement = null,
  onProgress
}: PDFExportOptions): Promise<boolean> => {
  let stagingContainer: HTMLElement | null = null;

  try {
    onProgress?.('Préparation du document...');

    // 1. Locate the source element
    let element: HTMLElement | null = targetElement;
    let targetDoc: Document = document;

    if (!element && elementId) {
      element = document.getElementById(elementId);
    }

    // Look inside same-origin iframes (e.g. CVPreview isolated iframe) if not found in main document
    if (!element) {
      const iframes = Array.from(document.querySelectorAll('iframe'));
      for (const ifr of iframes) {
        try {
          const ifrDoc = ifr.contentDocument || ifr.contentWindow?.document;
          if (ifrDoc) {
            const found = ifrDoc.getElementById(elementId);
            if (found) {
              element = found;
              targetDoc = ifrDoc;
              break;
            }
          }
        } catch {
          // Ignore cross-origin access restrictions
        }
      }
    }

    // Fallback: search common template root selectors
    if (!element) {
      const selectors = ['#cover-letter-doc', '#cover-letter-modal-doc', '.cv-a4-sheet', '.cv-print-container'];
      for (const sel of selectors) {
        element = document.querySelector<HTMLElement>(sel);
        if (element) break;
      }
    }

    if (!element) {
      throw new Error(`Élément #${elementId} introuvable pour la génération du PDF.`);
    }

    // 2. Wait for fonts & images to render completely to prevent blank/distorted PDFs
    onProgress?.('Chargement des polices et images haute définition...');
    await waitForRenderReady(element, targetDoc);

    // 3. Create a clean, unscaled A4 staging element in top-level document
    onProgress?.('Mise en page A4 sans déformation...');
    stagingContainer = document.createElement('div');
    stagingContainer.id = 'vitarey-pdf-export-staging';
    stagingContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: -9999px;
      width: 794px;
      min-height: 1123px;
      background: #ffffff;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      overflow: visible;
      z-index: -99999;
    `;

    // Copy any stylesheets or fonts from the source iframe so styling matches 100%
    if (targetDoc !== document) {
      const styles = Array.from(targetDoc.querySelectorAll('style, link[rel="stylesheet"]'));
      for (const s of styles) {
        stagingContainer.appendChild(s.cloneNode(true));
      }
    }

    // Clone the source element into the staging container
    const cloned = element.cloneNode(true) as HTMLElement;
    cloned.style.transform = 'none';
    cloned.style.webkitTransform = 'none';
    cloned.style.transformOrigin = 'top left';
    cloned.style.margin = '0 auto';
    cloned.style.width = '794px';
    cloned.style.boxSizing = 'border-box';

    // Remove any inline scale transforms on descendants that could cause shrinking
    const scaledChildren = cloned.querySelectorAll<HTMLElement>('[style*="scale"]');
    scaledChildren.forEach((child) => {
      if (child.style.transform && child.style.transform.includes('scale')) {
        child.style.transform = 'none';
      }
    });

    stagingContainer.appendChild(cloned);
    document.body.appendChild(stagingContainer);

    // Force layout reflow
    void stagingContainer.offsetHeight;

    // 4. html2pdf.js configuration
    // Requirements: A4 format, 0mm margin, quality scale 2, orientation portrait
    const opt: any = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      enableLinks: true,
      html2canvas: {
        scale: 2, // 2x scale for high resolution
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    onProgress?.('Génération haute résolution A4...');
    const html2pdfFn = (html2pdf as any)?.default || html2pdf;

    let downloadSuccess = false;

    // Attempt 1: html2pdf outputPdf('blob') and downloadBlob
    try {
      const worker = html2pdfFn().set(opt).from(cloned);
      const pdfBlob = await worker.outputPdf('blob');
      if (pdfBlob && pdfBlob instanceof Blob && pdfBlob.size > 500) {
        downloadBlob(pdfBlob, fileName);
        downloadSuccess = true;
      } else {
        // Attempt fallback save()
        await worker.save();
        downloadSuccess = true;
      }
    } catch (h2pErr) {
      console.warn('html2pdf outputPdf attempt warning, falling back to html2pdf.save():', h2pErr);
      try {
        const worker = html2pdfFn().set(opt).from(cloned);
        await worker.save();
        downloadSuccess = true;
      } catch (saveErr) {
        console.error('html2pdf save failed, trying html2canvas + jsPDF engine:', saveErr);
      }
    }

    if (downloadSuccess) {
      onProgress?.('Téléchargement terminé !');
      return true;
    }

    // Attempt 2: Fallback to direct html2canvas + jsPDF compilation
    onProgress?.('Génération via moteur alternatif haute résolution...');
    const canvas = await html2canvas(cloned, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
      height: cloned.offsetHeight || 1123,
      scrollX: 0,
      scrollY: 0
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = 210; // mm
    const pdfHeight = 297; // mm
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    const fallbackBlob = pdf.output('blob');
    if (fallbackBlob && fallbackBlob.size > 500) {
      downloadBlob(fallbackBlob, fileName);
    } else {
      pdf.save(fileName);
    }

    onProgress?.('Téléchargement terminé !');
    return true;

  } catch (error) {
    console.error('Erreur critique lors de la génération du PDF:', error);
    onProgress?.('Ouverture de la boîte de dialogue d\'impression...');
    window.print();
    return false;
  } finally {
    // 5. Clean up temporary staging DOM
    if (stagingContainer && stagingContainer.parentElement) {
      stagingContainer.parentElement.removeChild(stagingContainer);
    }
  }
};

/**
 * Triggers native browser print with focus on the printable document
 */
export const triggerNativePrint = () => {
  const iframes = Array.from(document.querySelectorAll('iframe'));
  for (const ifr of iframes) {
    try {
      const ifrDoc = ifr.contentDocument || ifr.contentWindow?.document;
      if (ifrDoc && ifrDoc.getElementById('cv-printable-document')) {
        ifr.contentWindow?.focus();
        ifr.contentWindow?.print();
        return;
      }
    } catch {
      // Fallback
    }
  }
  window.print();
};
