import React from 'react';
import { CVData, TemplateId } from '../../types';
import { ENABLE_PAYMENTS } from '../../config/features';
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
import { ModernSidebarTemplate } from './ModernSidebarTemplate';
import { ATSClassicTemplate } from './ATSClassicTemplate';
import { getEffectiveCVData } from '../../lib/cvDataUtils';
import { A4FitWrapper } from '../A4FitWrapper';

export interface CVRendererProps {
  data?: CVData;
  cv?: CVData;
  showWatermark?: boolean;
  scale?: number;
  zoom?: number;
  id?: string;
  className?: string;
  disableAutoFallback?: boolean;
  minScale?: number;
}

export const CVRenderer: React.FC<CVRendererProps> = ({
  data,
  cv,
  showWatermark = false,
  scale = 1,
  zoom,
  id = 'cv-printable-document',
  className = '',
  disableAutoFallback = false,
  minScale,
}) => {
  const rawData = data || cv;
  const effectiveScale = zoom !== undefined ? zoom : scale;

  if (!rawData) {
    return null;
  }

  const activeData = disableAutoFallback ? rawData : getEffectiveCVData(rawData);

  const templateMap: Record<TemplateId, React.FC<{ data: CVData }>> = {
    modern: ModernSidebarTemplate,
    'modern-sidebar': ModernSidebarTemplate,
    minimal: MinimalTemplate,
    professional: ProfessionalTemplate,
    executive: ExecutiveTemplate,
    creative: CreativeTemplate,
    tech: TechTemplate,
    student: StudentTemplate,
    ats: ATSClassicTemplate,
    'ats-classic': ATSClassicTemplate,
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

  const SelectedTemplate = templateMap[activeData.templateId] || StockholmTemplate || ModernTemplate;

  // Watermark is only shown if explicitly asked and payments are enabled (never in free test mode)
  const isWatermarked = ENABLE_PAYMENTS && showWatermark && !activeData.isPaid;

  return (
    <A4FitWrapper
      id={id}
      className={`cv-print-container ${className}`}
      dataDependency={activeData}
      disableFit={disableAutoFallback}
      minScale={minScale}
      outerScale={effectiveScale !== 1 ? effectiveScale : undefined}
    >
      {/* Draft watermark if previewing without payment */}
      {isWatermarked && (
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden no-print">
          <div className="transform -rotate-45 text-slate-400/20 font-black text-6xl tracking-widest uppercase select-none border-8 border-slate-400/20 p-8 rounded-3xl">
            VITAREY • APERÇU
          </div>
        </div>
      )}

      {/* Render Template Pure RAW */}
      <SelectedTemplate data={activeData} />
    </A4FitWrapper>
  );
};
