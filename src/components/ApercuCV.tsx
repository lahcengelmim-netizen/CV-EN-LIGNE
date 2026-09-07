import React from 'react';
import { CVPreview, CVPreviewProps, DEFAULT_CV_PREVIEW } from './CVPreview';

/**
 * ApercuCV.tsx - Composant d'Aperçu du CV sous iframe isolée
 * Alias direct pour CVPreview avec dimensions A4 strictes (210mm x 297mm).
 */
export const ApercuCV: React.FC<CVPreviewProps> = (props) => {
  return <CVPreview {...props} />;
};

export { CVPreview, DEFAULT_CV_PREVIEW };
export type { CVPreviewProps };
export default ApercuCV;
