import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  fileName?: string;
  elementId?: string;
  onProgress?: (status: string) => void;
}

export const exportCVToPDF = async ({
  fileName = 'CV_Professionnel.pdf',
  elementId = 'cv-printable-document',
  onProgress
}: PDFExportOptions): Promise<boolean> => {
  try {
    onProgress?.('Préparation du document...');
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element #${elementId} not found`);
    }

    // Scroll to top to ensure complete render
    window.scrollTo(0, 0);
    onProgress?.('Génération haute résolution A4...');

    // Use html2canvas with optimal pixel ratio for razor-sharp vector-like crispness
    const canvas = await html2canvas(element, {
      scale: 2.5, // 2.5x density for crystal clear typography
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    onProgress?.('Compilation du fichier PDF...');
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Standard A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = 210; // mm
    const pdfHeight = 297; // mm
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Additional pages if the CV is multi-page
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    onProgress?.('Téléchargement du PDF...');
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    // Fallback: Trigger browser print
    window.print();
    return false;
  }
};

export const triggerNativePrint = () => {
  window.print();
};
