import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { DEFAULT_AVATAR_PLACEHOLDER } from './defaultAvatar';
import { CVData } from '../types';
import { getEffectiveCVData } from './cvDataUtils';

export interface PDFExportOptions {
  fileName?: string;
  elementId?: string;
  targetElement?: HTMLElement | null;
  cv?: CVData;
  onProgress?: (status: string) => void;
  onError?: (error: Error, userMessage: string) => void;
  showErrorToast?: boolean;
}

/**
 * Triggers a direct, clean file download in the browser from a Blob.
 * Handles iOS Safari and Android webview file saving safely.
 */
export const downloadBlob = (blob: Blob, fileName: string) => {
  console.log(`[PDF Export Step 4 - Téléchargement] Déclenchement du téléchargement pour "${fileName}" (${blob.size} octets, type: ${blob.type})`);
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  if (isIOS) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      const win = window.open(url, '_blank');
      if (!win) {
        window.location.href = url;
      }
    };
    reader.readAsDataURL(blob);
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  }, 3000);
};

/**
 * Helper to convert a Blob to base64 data URL via FileReader.
 */
function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('FileReader a retourné un résultat non textuel'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('Erreur de lecture du Blob'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Helper to convert an image URL to base64 via offscreen HTML5 canvas.
 */
function loadImageToDataURL(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 200;
        canvas.height = img.naturalHeight || 200;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Impossible d\'obtenir le contexte 2D pour conversion canvas');
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.95));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (e) => reject(new Error(`Échec chargement image via HTMLImageElement (${e})`));
    img.src = src;
  });
}

/**
 * Converts any image URL (remote, Supabase, local blob) to base64 Data URL.
 * Attempts 3 successive strategies:
 * 1. Direct fetch with CORS
 * 2. Backend /api/proxy-image endpoint
 * 3. Offscreen Canvas draw with crossOrigin anonymous
 * If all fail, falls back to safe SVG silhouette to avoid canvas tainting.
 */
async function convertImageSrcToBase64(src: string): Promise<{ dataUrl: string; source: string }> {
  if (!src || src.trim() === '') {
    return { dataUrl: DEFAULT_AVATAR_PLACEHOLDER, source: 'placeholder-empty' };
  }

  // Already a base64 Data URL
  if (src.startsWith('data:image/')) {
    return { dataUrl: src, source: 'data-url-original' };
  }

  // Strategy 1: Direct fetch
  try {
    const response = await fetch(src, { mode: 'cors' });
    if (response.ok) {
      const blob = await response.blob();
      const dataUrl = await blobToDataURL(blob);
      return { dataUrl, source: 'direct-fetch' };
    }
  } catch (directErr) {
    console.warn(`[PDF Export Step 2] Fetch direct échoué pour ${src.slice(0, 60)}:`, directErr);
  }

  // Strategy 2: Server-side proxy for remote URLs
  if (src.startsWith('http://') || src.startsWith('https://')) {
    try {
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(src)}`;
      const proxyRes = await fetch(proxyUrl);
      if (proxyRes.ok) {
        const blob = await proxyRes.blob();
        const dataUrl = await blobToDataURL(blob);
        return { dataUrl, source: 'server-proxy' };
      }
    } catch (proxyErr) {
      console.warn(`[PDF Export Step 2] Proxy image échoué pour ${src.slice(0, 60)}:`, proxyErr);
    }
  }

  // Strategy 3: Offscreen Canvas draw
  try {
    const dataUrl = await loadImageToDataURL(src);
    return { dataUrl, source: 'canvas-draw' };
  } catch (canvasErr) {
    console.warn(`[PDF Export Step 2] Canvas draw échoué pour ${src.slice(0, 60)}:`, canvasErr);
  }

  // Ultimate fallback to prevent canvas tainting
  console.warn(`[PDF Export Step 2] Remplacement de l'image inaccessible par le placeholder SVG sécurisé.`);
  return { dataUrl: DEFAULT_AVATAR_PLACEHOLDER, source: 'placeholder-fallback' };
}

/**
 * Traverses all <img> elements in the container and inlines them as base64 Data URLs.
 */
async function inlineAllImagesInElement(container: HTMLElement): Promise<{ total: number; converted: number; failed: number }> {
  const images = Array.from(container.querySelectorAll('img'));
  let converted = 0;
  let failed = 0;

  console.log(`[PDF Export Step 2 - Image Inlining] Début de la conversion pour ${images.length} image(s)...`);

  await Promise.all(
    images.map(async (img, idx) => {
      const originalSrc = img.getAttribute('src') || img.src;
      if (!originalSrc) return;

      try {
        const { dataUrl, source } = await convertImageSrcToBase64(originalSrc);
        img.src = dataUrl;
        img.removeAttribute('crossorigin');
        converted++;
        console.log(`[PDF Export Step 2] Image #${idx + 1} convertie avec succès via [${source}]. Longueur DataURL: ${dataUrl.length} caractères.`);
      } catch (err) {
        failed++;
        console.error(`[PDF Export Step 2] Échec conversion Image #${idx + 1}:`, err);
        img.src = DEFAULT_AVATAR_PLACEHOLDER;
      }
    })
  );

  return { total: images.length, converted, failed };
}

/**
 * Waits for document fonts and image decodes to complete.
 */
async function waitForRenderReady(element: HTMLElement, targetDoc: Document): Promise<void> {
  try {
    if (targetDoc.fonts) {
      await targetDoc.fonts.ready;
    }
    if (document.fonts && document.fonts !== targetDoc.fonts) {
      await document.fonts.ready;
    }
  } catch (err) {
    console.warn('[PDF Export Step 2] Avertissement chargement polices:', err);
  }

  const images = Array.from(element.querySelectorAll('img'));
  if (images.length > 0) {
    await Promise.all(
      images.map(async (img) => {
        try {
          if (!img.complete || img.naturalHeight === 0) {
            await new Promise<void>((resolve) => {
              const timer = setTimeout(resolve, 3000);
              img.addEventListener('load', () => { clearTimeout(timer); resolve(); }, { once: true });
              img.addEventListener('error', () => { clearTimeout(timer); resolve(); }, { once: true });
            });
          }
          if ('decode' in img && typeof img.decode === 'function') {
            await img.decode().catch(() => {});
          }
        } catch {
          // Continue
        }
      })
    );
  }

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 80);
      });
    });
  });
}

/**
 * Robust search for the printable DOM element with retry logic if an iframe is still mounting.
 */
async function findPrintableElementWithRetry(
  elementId: string,
  targetElement: HTMLElement | null = null,
  maxAttempts = 2,
  delayMs = 350
): Promise<{ element: HTMLElement; targetDoc: Document }> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`[PDF Export Step 1 - Localisation] Recherche de #${elementId} (Tentative ${attempt}/${maxAttempts})...`);

    // 1. Direct element reference
    if (targetElement) {
      console.log(`[PDF Export Step 1] Élément fourni directement via targetElement: <${targetElement.tagName.toLowerCase()} id="${targetElement.id}">`);
      return { element: targetElement, targetDoc: targetElement.ownerDocument || document };
    }

    // 2. Main document search
    const mainEl = document.getElementById(elementId);
    if (mainEl) {
      console.log(`[PDF Export Step 1] Élément #${elementId} trouvé dans le document principal.`);
      return { element: mainEl, targetDoc: document };
    }

    // 3. Search inside all available iframes (CVPreview / IsolatedIframe)
    const iframes = Array.from(document.querySelectorAll('iframe'));
    console.log(`[PDF Export Step 1] #${elementId} non trouvé dans main document. Analyse de ${iframes.length} iframe(s) présente(s)...`);

    for (let i = 0; i < iframes.length; i++) {
      const ifr = iframes[i];
      try {
        const ifrDoc = ifr.contentDocument || ifr.contentWindow?.document;
        if (!ifrDoc) {
          console.warn(`[PDF Export Step 1] Iframe #${i + 1} (${ifr.id || ifr.className || 'sans-id'}) : contentDocument est null.`);
          continue;
        }

        const foundInIframe = ifrDoc.getElementById(elementId);
        if (foundInIframe) {
          console.log(`[PDF Export Step 1] Élément #${elementId} trouvé avec succès à l'intérieur de l'iframe #${i + 1} (${ifr.id || 'IsolatedIframe'}).`);
          return { element: foundInIframe, targetDoc: ifrDoc };
        } else {
          console.log(`[PDF Export Step 1] Iframe #${i + 1} accessible, mais #${elementId} non trouvé dans son DOM (éléments enfants: ${ifrDoc.body ? ifrDoc.body.children.length : 0}).`);
        }
      } catch (ifrErr) {
        console.warn(`[PDF Export Step 1] Restriction d'accès à l'iframe #${i + 1} (cross-origin):`, ifrErr);
      }
    }

    // 4. Fallback selectors across document
    const fallbackSelectors = ['#cover-letter-doc', '#cover-letter-modal-doc', '#cover-letter-printable-doc', '.cv-a4-sheet', '.cv-print-container'];
    for (const sel of fallbackSelectors) {
      const fallbackEl = document.querySelector<HTMLElement>(sel);
      if (fallbackEl) {
        console.log(`[PDF Export Step 1] Élément trouvé via le sélecteur alternatif: "${sel}".`);
        return { element: fallbackEl, targetDoc: document };
      }
    }

    if (attempt < maxAttempts) {
      console.warn(`[PDF Export Step 1] Élément #${elementId} introuvable lors de la tentative 1. Attente de ${delayMs}ms pour finalisation du rendu...`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  const iframesTotal = document.querySelectorAll('iframe').length;
  const failureMsg = `Élément #${elementId} introuvable après 2 tentatives (Document: ${document.readyState}, ${iframesTotal} iframes inspectées). Veuillez vous assurer que l'aperçu du document est ouvert et visible.`;
  console.error(`[PDF Export Step 1 - Erreur fatale] ${failureMsg}`);
  throw new Error(failureMsg);
}

/**
 * Displays a visible, prominent, non-intrusive error notification to the user in the UI.
 * Never silently defaults to window.print().
 */
export function showPDFExportErrorNotification(options: {
  title?: string;
  message: string;
  technicalDetails?: string;
  onRetry?: () => void;
}): void {
  // Check if an existing notification is already mounted
  const existing = document.getElementById('vitarey-pdf-error-toast');
  if (existing && existing.parentElement) {
    existing.parentElement.removeChild(existing);
  }

  const container = document.createElement('div');
  container.id = 'vitarey-pdf-error-toast';
  container.setAttribute('role', 'alert');
  container.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    max-width: 460px;
    width: calc(100vw - 48px);
    background: #ffffff;
    border: 1px solid #fca5a5;
    border-left: 6px solid #dc2626;
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    padding: 16px 20px;
    z-index: 999999;
    font-family: system-ui, -apple-system, sans-serif;
    color: #1e293b;
    animation: vitareyToastSlideIn 0.25s ease-out;
  `;

  // Inject animation style if not already present
  if (!document.getElementById('vitarey-pdf-toast-style')) {
    const style = document.createElement('style');
    style.id = 'vitarey-pdf-toast-style';
    style.textContent = `
      @keyframes vitareyToastSlideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  const title = options.title || 'Échec du téléchargement du PDF';
  const detailsHtml = options.technicalDetails
    ? `<details style="margin-top: 8px; font-size: 11px; color: #64748b;">
        <summary style="cursor: pointer; text-decoration: underline; font-weight: 500;">Détails techniques pour le support</summary>
        <pre style="margin-top: 4px; padding: 8px; background: #f8fafc; border-radius: 6px; overflow-x: auto; white-space: pre-wrap; font-family: monospace; font-size: 10px; border: 1px solid #e2e8f0;">${options.technicalDetails.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
       </details>`
    : '';

  container.innerHTML = `
    <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;">
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="background: #fee2e2; color: #dc2626; border-radius: 10px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; shrink-0; font-size: 18px; font-weight: bold;">
          ⚠️
        </div>
        <div>
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #991b1b;">${title}</h4>
          <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #475569;">${options.message}</p>
          ${detailsHtml}
        </div>
      </div>
      <button id="vitarey-pdf-toast-close" style="background: transparent; border: none; font-size: 18px; line-height: 1; color: #94a3b8; cursor: pointer; padding: 4px;">&times;</button>
    </div>
    <div style="margin-top: 12px; display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
      <button id="vitarey-pdf-toast-dismiss" style="padding: 6px 12px; background: #f1f5f9; hover: background: #e2e8f0; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 12px; font-weight: 600; color: #475569; cursor: pointer;">
        Fermer
      </button>
      ${
        options.onRetry
          ? `<button id="vitarey-pdf-toast-retry" style="padding: 6px 14px; background: #2563eb; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; color: #ffffff; cursor: pointer;">
              Réessayer
             </button>`
          : ''
      }
    </div>
  `;

  document.body.appendChild(container);

  const closeBtn = container.querySelector('#vitarey-pdf-toast-close');
  const dismissBtn = container.querySelector('#vitarey-pdf-toast-dismiss');
  const retryBtn = container.querySelector('#vitarey-pdf-toast-retry');

  const removeToast = () => {
    if (container.parentElement) {
      container.parentElement.removeChild(container);
    }
  };

  closeBtn?.addEventListener('click', removeToast);
  dismissBtn?.addEventListener('click', removeToast);
  retryBtn?.addEventListener('click', () => {
    removeToast();
    options.onRetry?.();
  });

  // Auto-dismiss after 12 seconds
  setTimeout(() => {
    removeToast();
  }, 12000);
}

/**
 * Primary PDF exporter for VITAREY CVs and Cover Letters using html2pdf.js.
 * Configured for genuine A4 PDF file generation with Base64 image inlining,
 * strict allowTaint: false, detailed step-by-step logs, and explicit user-visible errors.
 */
export const exportCVToPDF = async ({
  fileName = 'VITAREY_Document.pdf',
  elementId = 'cv-printable-document',
  targetElement = null,
  cv,
  onProgress,
  onError,
  showErrorToast = true
}: PDFExportOptions): Promise<boolean> => {
  // CRITIQUE : Si le template choisi est le template ATS, basculer immédiatement
  // vers le générateur PDF vectoriel à texte 100% réel et extractible (Phase 1 ATS)
  if (cv && cv.templateId === 'ats') {
    console.log('[PDF Export] Template ATS détecté : basculement vers le moteur natif vectoriel ATS (texte 100% extractible).');
    return exportATSTemplateToPDF(cv, { fileName, onProgress, onError, showErrorToast });
  }

  let stagingContainer: HTMLElement | null = null;
  const startTime = Date.now();

  console.group(`[PDF Export] Démarrage de l'exportation pour "${fileName}"`);

  try {
    // -------------------------------------------------------------
    // ÉTAPE 1 : LOCALISATION DU DOCUMENT SOURCE
    // -------------------------------------------------------------
    onProgress?.('Localisation du document...');
    const { element, targetDoc } = await findPrintableElementWithRetry(elementId, targetElement);
    console.log(`[PDF Export Step 1] Document source trouvé: dimensions visibles ${element.offsetWidth}x${element.offsetHeight}px.`);

    // -------------------------------------------------------------
    // ÉTAPE 2 : PRÉPARATION DU STAGING CONTAINER ET COPIE DU DOM
    // -------------------------------------------------------------
    onProgress?.('Mise en page A4 haute définition...');
    console.log('[PDF Export Step 2 - Staging] Création du conteneur A4 étalonné (794px × 1123px à 96 DPI)...');

    stagingContainer = document.createElement('div');
    stagingContainer.id = 'vitarey-pdf-export-staging';
    stagingContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 794px;
      min-height: 1123px;
      background: #ffffff;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      overflow: visible;
      z-index: -99999;
      opacity: 0.01;
      pointer-events: none;
    `;

    // Copier les styles et liens du document d'origine
    if (targetDoc !== document) {
      const styles = Array.from(targetDoc.querySelectorAll('style, link[rel="stylesheet"]'));
      console.log(`[PDF Export Step 2 - Staging] Copie de ${styles.length} feuille(s) de style depuis l'iframe source.`);
      for (const s of styles) {
        stagingContainer.appendChild(s.cloneNode(true));
      }
    }

    // Cloner l'élément source
    const cloned = element.cloneNode(true) as HTMLElement;
    cloned.style.transform = 'none';
    cloned.style.webkitTransform = 'none';
    cloned.style.transformOrigin = 'top left';
    cloned.style.margin = '0 auto';
    cloned.style.width = '794px';
    cloned.style.height = '1123px';
    cloned.style.minHeight = '1123px';
    cloned.style.maxHeight = '1123px';
    cloned.style.overflow = 'hidden';
    cloned.style.boxSizing = 'border-box';
    cloned.style.display = 'block';

    // Supprimer les transformations de zoom résiduelles (ex: zoom preview), tout en préservant l'auto-fit A4 interne
    const scaledChildren = cloned.querySelectorAll<HTMLElement>('[style*="scale"]');
    scaledChildren.forEach((child) => {
      if (child.hasAttribute('data-a4-fit-inner') || child.classList.contains('a4-fit-inner')) {
        return; // Conserver le scale d'ajustement A4 interne calculé par A4FitWrapper !
      }
      if (child.style.transform && child.style.transform.includes('scale')) {
        child.style.transform = 'none';
      }
    });

    // Supprimer tout élément d'alerte ou tag non imprimable
    const ignoredElements = cloned.querySelectorAll<HTMLElement>('[data-html2canvas-ignore="true"], .no-print');
    ignoredElements.forEach((el) => el.remove());

    stagingContainer.appendChild(cloned);
    document.body.appendChild(stagingContainer);

    // -------------------------------------------------------------
    // ÉTAPE 2.2 : PRÉ-CHARGEMENT ET INLINING BASE64 DES IMAGES (Anti-Taint)
    // -------------------------------------------------------------
    onProgress?.('Sécurisation des photos et polices...');
    const imageStats = await inlineAllImagesInElement(cloned);
    console.log(`[PDF Export Step 2 - Anti-Taint] Résultat inlining images: ${imageStats.converted}/${imageStats.total} converties en base64, ${imageStats.failed} échecs.`);

    // Attente du rendu complet des polices et images décodées
    await waitForRenderReady(cloned, targetDoc);

    // Forcer le reflow du staging container
    void stagingContainer.offsetHeight;

    // -------------------------------------------------------------
    // ÉTAPE 3 : CONFIGURATION HTML2PDF ET CAPTURE CANVAS SÉCURISÉE
    // -------------------------------------------------------------
    onProgress?.('Génération du fichier PDF A4...');
    console.log('[PDF Export Step 3 - Capture] Lancement du moteur de capture avec allowTaint: false...');

    const opt: any = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      enableLinks: true,
      html2canvas: {
        scale: 2, // 2x haute résolution pour netteté d'impression
        useCORS: true,
        letterRendering: true,
        allowTaint: false, // CRITIQUE : interdit formellement de polluer le canvas avec du cross-origin non sécurisé
        logging: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
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

    const html2pdfFn = (html2pdf as any)?.default || html2pdf;
    let downloadSuccess = false;

    // Tentative 1 : Extraction d'un vrai PDF Blob via html2pdf et téléchargement explicite
    try {
      console.log('[PDF Export Step 3] Tentative worker html2pdf outputPdf("blob")...');
      const worker = html2pdfFn().set(opt).from(cloned);
      const pdfBlob = await worker.outputPdf('blob');

      if (pdfBlob && pdfBlob instanceof Blob && pdfBlob.size > 1000) {
        console.log(`[PDF Export Step 4] PDF Blob généré avec succès (${pdfBlob.size} octets).`);
        downloadBlob(pdfBlob, fileName);
        downloadSuccess = true;
      } else {
        console.warn('[PDF Export Step 3] outputPdf("blob") a renvoyé un résultat vide ou trop petit. Tentative directe via worker.save()...');
        await worker.save();
        downloadSuccess = true;
      }
    } catch (h2pErr: any) {
      console.warn('[PDF Export Step 3 - Avertissement html2pdf]', {
        message: h2pErr?.message,
        stack: h2pErr?.stack,
        raw: h2pErr
      });
      console.log('[PDF Export Step 3] Basculement vers le moteur secondaire direct html2canvas + jsPDF...');
    }

    // Tentative 2 : Moteur direct html2canvas + jsPDF si html2pdf a échoué
    if (!downloadSuccess) {
      onProgress?.('Génération via moteur alternatif de secours...');
      console.log('[PDF Export Step 3] Démarrage capture directe html2canvas...');

      const canvas = await html2canvas(cloned, {
        scale: 2,
        useCORS: true,
        allowTaint: false, // CRITIQUE : allowTaint false évite SecurityError sur toDataURL
        logging: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        scrollX: 0,
        scrollY: 0
      });

      console.log(`[PDF Export Step 3] Canvas 2D capturé (${canvas.width}x${canvas.height}px). Conversion toDataURL...`);
      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = 210; // mm A4
      const pdfHeight = 297; // mm A4
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
      if (fallbackBlob && fallbackBlob.size > 1000) {
        console.log(`[PDF Export Step 4] PDF Blob secondaire généré (${fallbackBlob.size} octets). Téléchargement...`);
        downloadBlob(fallbackBlob, fileName);
        downloadSuccess = true;
      } else {
        console.log('[PDF Export Step 4] Sauvegarde directe via jsPDF.save()...');
        pdf.save(fileName);
        downloadSuccess = true;
      }
    }

    if (downloadSuccess) {
      const elapsedMs = Date.now() - startTime;
      console.log(`[PDF Export] Exportation terminée avec succès en ${elapsedMs}ms.`);
      console.groupEnd();
      onProgress?.('Téléchargement terminé !');
      return true;
    }

    throw new Error('Le moteur PDF n\'a produit aucun fichier exploitable.');

  } catch (error: any) {
    // -------------------------------------------------------------
    // ÉCHEC : LOGS DÉTAILLÉS ET NOTIFICATION UTILISATEUR VISIBLE
    // -------------------------------------------------------------
    const errMessage = error?.message || 'Erreur inconnue lors de la génération du PDF.';
    const errStack = error?.stack || 'Aucune trace disponible.';

    console.error('[PDF Export - ÉCHEC CRITIQUE]', {
      message: errMessage,
      stack: errStack,
      fileName,
      elementId,
      timestamp: new Date().toISOString()
    });
    console.groupEnd();

    onProgress?.('');

    // Notification utilisateur visible (pas de silent print!)
    if (showErrorToast) {
      showPDFExportErrorNotification({
        title: 'Échec du téléchargement du PDF',
        message: 'Le document n\'a pas pu être converti en PDF. Une erreur est survenue lors de la capture ou du rendu des images.',
        technicalDetails: `${errMessage}\n\nStack:\n${errStack}`,
        onRetry: () => {
          exportCVToPDF({
            fileName,
            elementId,
            targetElement,
            onProgress,
            onError,
            showErrorToast: true
          });
        }
      });
    }

    // Alerter le callback appelant
    if (onError) {
      onError(error, errMessage);
    }

    // IMPORTANT : RÈGLE ABSOLUE - NE JAMAIS DÉCLENCHER WINDOW.PRINT() EN CAS D'ÉCHEC !
    return false;

  } finally {
    // -------------------------------------------------------------
    // NETTOYAGE SYSTÉMATIQUE DU DOM TEMPORAIRE
    // -------------------------------------------------------------
    if (stagingContainer && stagingContainer.parentElement) {
      stagingContainer.parentElement.removeChild(stagingContainer);
      console.log('[PDF Export] Staging DOM temporaire nettoyé.');
    }
  }
};

/**
 * Triggers native browser print ONLY when explicitly requested by user via a print button.
 */
export const triggerNativePrint = () => {
  console.log('[PDF Export] Impression native demandée explicitement par l\'utilisateur.');
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

/**
 * ============================================================================
 * PHASE 1 ATS : Générateur PDF Natif Vectoriel avec Texte 100% Extractible
 * ============================================================================
 * Contrairement aux autres templates qui utilisent html2canvas (capture bitmap),
 * ce moteur génère directement les flux de texte vectoriel via jsPDF.
 * Le résultat est un document ultra-léger (~15-30 Ko), sans pixels, où chaque
 * mot, titre, date et puce est sélectionnable, copiable et lisible à 100% par
 * les systèmes ATS (Workday, Taleo, Greenhouse, Lever, etc.).
 */
export const exportATSTemplateToPDF = async (
  cv: CVData,
  options?: {
    fileName?: string;
    onProgress?: (status: string) => void;
    onError?: (error: Error, userMessage: string) => void;
    showErrorToast?: boolean;
  }
): Promise<boolean> => {
  const startTime = Date.now();
  const onProgress = options?.onProgress;
  const onError = options?.onError;
  const showErrorToast = options?.showErrorToast !== false;

  console.group('[ATS PDF Export] Démarrage de la génération vectorielle texte réel (ATS-Compliant)...');

  try {
    onProgress?.('Initialisation du moteur de texte ATS...');

    // Normalisation des données CV pour garantir des champs complets
    const activeCV = getEffectiveCVData(cv);
    const lang = activeCV.language || 'fr';

    onProgress?.('Composition du document vectoriel A4...');

    // Initialisation du document PDF A4 en millimètres
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const leftMargin = 18;
    const rightMargin = 18;
    const topMargin = 16;
    const bottomMargin = 16;
    const contentWidth = pageWidth - leftMargin - rightMargin; // 174 mm
    let y = topMargin;

    // Helper pour garantir l'espace vertical sans coupure orpheline
    const ensureSpace = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - bottomMargin) {
        doc.addPage();
        y = topMargin;
        return true;
      }
      return false;
    };

    // Nettoyeur de texte Unicode pour compatibilité maximale avec les parseurs ATS
    const clean = (val: string | undefined | null): string => {
      if (!val) return '';
      return String(val)
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, '-')
        .replace(/\u00A0/g, ' ')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim();
    };

    // -------------------------------------------------------------
    // 1. EN-TÊTE DU CANDIDAT (Identité, Titre, Coordonnées)
    // -------------------------------------------------------------
    const firstName = clean(activeCV.personalInfo?.firstName);
    const lastName = clean(activeCV.personalInfo?.lastName);
    const fullName = `${firstName} ${lastName}`.trim().toUpperCase() || 'CV CANDIDAT';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text(fullName, pageWidth / 2, y, { align: 'center' });
    y += 6.2;

    const title = clean(activeCV.personalInfo?.title);
    if (title) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(30, 30, 30);
      doc.text(title.toUpperCase(), pageWidth / 2, y, { align: 'center' });
      y += 4.5;
    }

    // Ligne des coordonnées
    const contacts: string[] = [];
    if (activeCV.personalInfo?.email) contacts.push(clean(activeCV.personalInfo.email));
    if (activeCV.personalInfo?.phone) contacts.push(clean(activeCV.personalInfo.phone));
    const location = [clean(activeCV.personalInfo?.city), clean(activeCV.personalInfo?.country)].filter(Boolean).join(', ');
    if (location) contacts.push(location);
    if (activeCV.personalInfo?.linkedin) contacts.push(clean(activeCV.personalInfo.linkedin));
    if (activeCV.personalInfo?.website) contacts.push(clean(activeCV.personalInfo.website));

    if (contacts.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(50, 50, 50);
      const contactText = contacts.join('  •  ');
      const contactLines = doc.splitTextToSize(contactText, contentWidth);
      for (const cl of contactLines) {
        doc.text(cl, pageWidth / 2, y, { align: 'center' });
        y += 3.6;
      }
    }

    // Ligne séparatrice de l'en-tête
    y += 1.5;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.line(leftMargin, y, pageWidth - rightMargin, y);
    y += 5.5;

    // Helper pour générer un titre de section standardisé ATS
    const renderSectionHeader = (heading: string) => {
      ensureSpace(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(0, 0, 0);
      doc.text(heading.toUpperCase(), leftMargin, y);
      y += 1.3;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.25);
      doc.line(leftMargin, y, pageWidth - rightMargin, y);
      y += 4.2;
    };

    // -------------------------------------------------------------
    // 2. RÉSUMÉ PROFESSIONNEL (Summary)
    // -------------------------------------------------------------
    const summaryText = clean(activeCV.summary);
    if (summaryText) {
      const summaryHeader = lang === 'ar' ? 'الملخص المهني' : lang === 'en' ? 'Professional Summary' : 'Profil Professionnel';
      renderSectionHeader(summaryHeader);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.2);
      doc.setTextColor(25, 25, 25);
      const sumLines = doc.splitTextToSize(summaryText, contentWidth);
      for (const sl of sumLines) {
        ensureSpace(4.1);
        doc.text(sl, leftMargin, y);
        y += 4.1;
      }
      y += 3.0;
    }

    // -------------------------------------------------------------
    // 3. COMPÉTENCES CLÉS (Core Competencies & Skills)
    // -------------------------------------------------------------
    const validSkills = (activeCV.skills || []).map(s => clean(s.name)).filter(Boolean);
    if (validSkills.length > 0) {
      const skillsHeader = lang === 'ar' ? 'المهارات والخبرات' : lang === 'en' ? 'Core Competencies & Skills' : 'Compétences Clés';
      renderSectionHeader(skillsHeader);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.2);
      doc.setTextColor(25, 25, 25);
      const skillsStr = validSkills.join('  •  ');
      const skillLines = doc.splitTextToSize(skillsStr, contentWidth);
      for (const skl of skillLines) {
        ensureSpace(4.1);
        doc.text(skl, leftMargin, y);
        y += 4.1;
      }
      y += 3.0;
    }

    // -------------------------------------------------------------
    // 4. EXPÉRIENCE PROFESSIONNELLE (Experiences)
    // -------------------------------------------------------------
    const exps = (activeCV.experiences || (activeCV as any).experience || []).filter(
      (e: any) => e.position || e.jobTitle || e.company
    );
    if (exps.length > 0) {
      const expHeader = lang === 'ar' ? 'الخبرات المهنية' : lang === 'en' ? 'Professional Experience' : 'Expérience Professionnelle';
      renderSectionHeader(expHeader);

      for (const exp of exps) {
        ensureSpace(12);
        const pos = clean(exp.position || exp.jobTitle);
        const comp = clean(exp.company);
        const city = clean(exp.city || exp.location);
        const compCity = [comp, city].filter(Boolean).join(', ');
        const leftTitle = [pos, compCity].filter(Boolean).join(' — ');

        const start = clean(exp.startDate);
        const end = exp.current ? (lang === 'en' ? 'Present' : 'Actuel') : clean(exp.endDate);
        const dateStr = [start, end].filter(Boolean).join(' - ');

        // Mesure de la largeur de la date pour éviter tout chevauchement
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        doc.setTextColor(60, 60, 60);
        const dateWidth = dateStr ? doc.getTextWidth(dateStr) : 0;

        // Titre du poste & entreprise (à gauche)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.8);
        doc.setTextColor(0, 0, 0);

        const maxLeftWidth = contentWidth - (dateWidth > 0 ? dateWidth + 4 : 0);
        const titleLines = doc.splitTextToSize(leftTitle, maxLeftWidth);

        doc.text(titleLines[0] || leftTitle, leftMargin, y);

        // Date alignée à droite sur la même ligne
        if (dateStr) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.8);
          doc.setTextColor(60, 60, 60);
          doc.text(dateStr, pageWidth - rightMargin, y, { align: 'right' });
        }
        y += 4.2;

        // Lignes supplémentaires de titre si très long
        if (titleLines.length > 1) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.8);
          doc.setTextColor(0, 0, 0);
          for (let i = 1; i < titleLines.length; i++) {
            ensureSpace(4.0);
            doc.text(titleLines[i], leftMargin, y);
            y += 4.0;
          }
        }

        // Description globale de l'expérience
        const desc = clean(exp.description);
        if (desc) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.0);
          doc.setTextColor(40, 40, 40);
          const descLines = doc.splitTextToSize(desc, contentWidth);
          for (const dl of descLines) {
            ensureSpace(3.9);
            doc.text(dl, leftMargin, y);
            y += 3.9;
          }
        }

        // Liste de puces / tâches réalisées
        const tasks = (exp.tasks || exp.bullets || []).map((t: string) => clean(t)).filter(Boolean);
        if (tasks.length > 0) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.0);
          doc.setTextColor(30, 30, 30);
          const bulletIndent = 4.0;
          const bulletTextWidth = contentWidth - bulletIndent;

          for (const task of tasks) {
            const taskLines = doc.splitTextToSize(task, bulletTextWidth);
            ensureSpace(taskLines.length * 3.8 + 1.2);
            doc.text('•', leftMargin + 1, y);
            doc.text(taskLines, leftMargin + bulletIndent, y);
            y += taskLines.length * 3.8 + 1.2;
          }
        }

        y += 2.2; // Espacement entre chaque expérience
      }
      y += 2.0;
    }

    // -------------------------------------------------------------
    // 5. FORMATION & DIPLÔMES (Education)
    // -------------------------------------------------------------
    const edus = (activeCV.educations || (activeCV as any).education || []).filter(
      (e: any) => e.degree || e.institution
    );
    if (edus.length > 0) {
      const eduHeader = lang === 'ar' ? 'التعليم والتكوين' : lang === 'en' ? 'Education' : 'Formation & Diplômes';
      renderSectionHeader(eduHeader);

      for (const edu of edus) {
        ensureSpace(10);
        const deg = clean(edu.degree);
        const inst = clean(edu.institution);
        const cty = clean(edu.city || edu.location);
        const instCity = [inst, cty].filter(Boolean).join(', ');
        const leftEdu = [deg, instCity].filter(Boolean).join(' | ');

        const start = clean(edu.startDate);
        const end = edu.current ? (lang === 'en' ? 'In progress' : 'En cours') : clean(edu.endDate);
        const dateStr = [start, end].filter(Boolean).join(' - ');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        doc.setTextColor(60, 60, 60);
        const dateWidth = dateStr ? doc.getTextWidth(dateStr) : 0;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(0, 0, 0);

        const maxLeftWidth = contentWidth - (dateWidth > 0 ? dateWidth + 4 : 0);
        const eduLines = doc.splitTextToSize(leftEdu, maxLeftWidth);

        doc.text(eduLines[0] || leftEdu, leftMargin, y);
        if (dateStr) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.8);
          doc.setTextColor(60, 60, 60);
          doc.text(dateStr, pageWidth - rightMargin, y, { align: 'right' });
        }
        y += 4.0;

        if (eduLines.length > 1) {
          for (let i = 1; i < eduLines.length; i++) {
            ensureSpace(3.9);
            doc.text(eduLines[i], leftMargin, y);
            y += 3.9;
          }
        }

        const eduDesc = clean(edu.description);
        if (eduDesc) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.8);
          doc.setTextColor(50, 50, 50);
          const eduDescLines = doc.splitTextToSize(eduDesc, contentWidth);
          for (const dl of eduDescLines) {
            ensureSpace(3.8);
            doc.text(dl, leftMargin, y);
            y += 3.8;
          }
        }

        y += 2.0;
      }
      y += 2.0;
    }

    // -------------------------------------------------------------
    // 6. PROJETS SIGNIFICATIFS (Projects)
    // -------------------------------------------------------------
    const projs = (activeCV.projects || []).filter((p: any) => p.title || p.name);
    if (projs.length > 0) {
      const projHeader = lang === 'ar' ? 'المشاريع' : lang === 'en' ? 'Key Projects' : 'Projets Significatifs';
      renderSectionHeader(projHeader);

      for (const proj of projs) {
        ensureSpace(10);
        const pTitle = clean(proj.title || proj.name);
        const role = proj.role ? `(${clean(proj.role)})` : '';
        const fullTitle = [pTitle, role].filter(Boolean).join(' ');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(0, 0, 0);
        doc.text(fullTitle, leftMargin, y);
        y += 3.9;

        const pDesc = clean(proj.description);
        if (pDesc) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.0);
          doc.setTextColor(40, 40, 40);
          const pLines = doc.splitTextToSize(pDesc, contentWidth);
          for (const pl of pLines) {
            ensureSpace(3.8);
            doc.text(pl, leftMargin, y);
            y += 3.8;
          }
        }
        y += 2.0;
      }
      y += 2.0;
    }

    // -------------------------------------------------------------
    // 7. LANGUES (Languages)
    // -------------------------------------------------------------
    const langs = (activeCV.languages || []).filter((l: any) => l.language || l.name);
    if (langs.length > 0) {
      const langHeader = lang === 'ar' ? 'اللغات' : lang === 'en' ? 'Languages' : 'Langues';
      renderSectionHeader(langHeader);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.2);
      doc.setTextColor(30, 30, 30);
      const langStr = langs.map((l: any) => `${clean(l.language || l.name)} (${clean(l.level)})`).join('  •  ');
      const langLines = doc.splitTextToSize(langStr, contentWidth);
      for (const ll of langLines) {
        ensureSpace(4.0);
        doc.text(ll, leftMargin, y);
        y += 4.0;
      }
      y += 3.0;
    }

    // -------------------------------------------------------------
    // 8. CERTIFICATIONS
    // -------------------------------------------------------------
    const certs = (activeCV.certifications || []).filter((c: any) => c.title || c.name);
    if (certs.length > 0) {
      const certHeader = lang === 'ar' ? 'الشهادات' : 'Certifications';
      renderSectionHeader(certHeader);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.2);
      doc.setTextColor(30, 30, 30);
      const certStr = certs.map((c: any) => {
        const t = clean(c.title || c.name);
        const org = clean(c.organization || c.issuer);
        const d = clean(c.date);
        return [t, org ? `- ${org}` : '', d ? `(${d})` : ''].filter(Boolean).join(' ');
      }).join('  •  ');
      const certLines = doc.splitTextToSize(certStr, contentWidth);
      for (const cl of certLines) {
        ensureSpace(4.0);
        doc.text(cl, leftMargin, y);
        y += 4.0;
      }
      y += 3.0;
    }

    // -------------------------------------------------------------
    // 9. GÉNÉRATION DU FICHIER ET TÉLÉCHARGEMENT DIRECT
    // -------------------------------------------------------------
    onProgress?.('Téléchargement du PDF ATS...');
    const safeCandidateName = `${firstName || ''}_${lastName || ''}`.trim().replace(/\s+/g, '_') || 'Candidat';
    const finalFileName = options?.fileName || `VITAREY_CV_ATS_${safeCandidateName}.pdf`;

    const blob = doc.output('blob');
    downloadBlob(blob, finalFileName);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[ATS PDF Export] Succès en ${duration}s. Fichier généré: "${finalFileName}" (${blob.size} octets, texte 100% extractible).`);
    console.groupEnd();
    return true;

  } catch (error: any) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`[ATS PDF Export] Échec après ${duration}s :`, error);
    console.groupEnd();

    const errMessage = error?.message || 'Erreur inconnue lors de la création du PDF vectoriel ATS.';
    if (showErrorToast) {
      showPDFExportErrorNotification({
        title: 'Échec de la génération du PDF ATS',
        message: 'Impossible de générer le fichier PDF ATS à texte extractible.',
        technicalDetails: errMessage,
        onRetry: () => exportATSTemplateToPDF(cv, options)
      });
    }

    if (onError) {
      onError(error, errMessage);
    }

    return false;
  }
};

