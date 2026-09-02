import React from 'react';
import { CVData, TemplateId } from '../../types';
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
import { BoldTemplate } from './BoldTemplate';
import { CompactTemplate } from './CompactTemplate';
import { TimelineTemplate } from './TimelineTemplate';
import { NordicTemplate } from './NordicTemplate';
import { InfographicTemplate } from './InfographicTemplate';
import { StockholmTemplate } from './StockholmTemplate';
import { ZurichTemplate } from './ZurichTemplate';
import { SiliconTemplate } from './SiliconTemplate';

export interface CVRendererProps {
  data?: CVData;
  cv?: CVData;
  showWatermark?: boolean;
  scale?: number;
  zoom?: number;
  id?: string;
  className?: string;
}

export const CVRenderer: React.FC<CVRendererProps> = ({
  data,
  cv,
  showWatermark = false,
  scale = 1,
  zoom,
  id = 'cv-printable-document',
  className = ''
}) => {
  const activeData = data || cv;
  const effectiveScale = zoom !== undefined ? zoom : scale;

  if (!activeData) {
    return null;
  }

  const templateMap: Record<TemplateId, React.FC<{ data: CVData }>> = {
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
    bold: BoldTemplate,
    compact: CompactTemplate,
    timeline: TimelineTemplate,
    nordic: NordicTemplate,
    infographic: InfographicTemplate,
    'stockholm-modern': StockholmTemplate,
    'casablanca-bilingual': StockholmTemplate,
    'zurich-executive': ZurichTemplate,
    'dubai-luxury-rtl': ZurichTemplate,
    'silicon-tech': SiliconTemplate,
  };

  const SelectedTemplate = templateMap[activeData.templateId] || ModernTemplate;

  // Watermark is only shown if explicitly asked or if not paid during draft preview
  const isWatermarked = showWatermark && !activeData.isPaid;

  return (
    <div 
      id={id} 
      className={`cv-print-container relative bg-white transition-all select-text ${className}`}
      style={{
        width: '100%',
        maxWidth: '210mm',
        minHeight: '297mm',
        transformOrigin: 'top center',
        ...(effectiveScale !== 1 ? { transform: `scale(${effectiveScale})` } : {})
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

      {/* Render Template Pure RAW */}
      <SelectedTemplate data={activeData} />
    </div>
  );
};
