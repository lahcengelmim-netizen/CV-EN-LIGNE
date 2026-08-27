import React from 'react';
import { CVData, LanguageCode, TemplateId } from '../../types';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { TechTemplate } from './TechTemplate';
import { StudentTemplate } from './StudentTemplate';
import { ATSTemplate } from './ATSTemplate';
import { ElegantTemplate } from './ElegantTemplate';
import { CorporateTemplate } from './CorporateTemplate';
import { ClassicTemplate } from './ClassicTemplate';

interface CVRendererProps {
  data: CVData;
  lang?: LanguageCode;
  showWatermark?: boolean;
  scale?: number;
}

export const CVRenderer: React.FC<CVRendererProps> = ({
  data,
  lang = 'fr',
  showWatermark = false,
  scale = 1
}) => {
  const templateMap: Record<TemplateId, React.FC<{ data: CVData; lang?: LanguageCode }>> = {
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    professional: ProfessionalTemplate,
    executive: ExecutiveTemplate,
    creative: CreativeTemplate,
    tech: TechTemplate,
    student: StudentTemplate,
    ats: ATSTemplate,
    elegant: ElegantTemplate,
    corporate: CorporateTemplate,
    classic: ClassicTemplate,
  };

  const SelectedTemplate = templateMap[data.templateId] || ModernTemplate;

  // Watermark is only shown if explicitly asked or if not paid during draft preview
  const isWatermarked = showWatermark && !data.isPaid;

  return (
    <div 
      id="cv-printable-document" 
      className="cv-print-container relative bg-white transition-all select-text"
      style={{
        width: '100%',
        maxWidth: '210mm',
        minHeight: '297mm',
        transformOrigin: 'top center',
        ...(scale !== 1 ? { transform: `scale(${scale})` } : {})
      }}
    >
      {/* Draft watermark if previewing without payment */}
      {isWatermarked && (
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden no-print">
          <div className="transform -rotate-45 text-slate-400/20 font-black text-6xl tracking-widest uppercase select-none border-8 border-slate-400/20 p-8 rounded-3xl">
            CV EN LIGNE • APERÇU
          </div>
        </div>
      )}

      {/* Render Template */}
      <SelectedTemplate data={data} lang={lang} />
    </div>
  );
};
