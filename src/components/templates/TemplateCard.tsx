import React, { useState } from 'react';
import { TemplateDefinition } from '../../lib/templatesData';
import { TemplateId, LanguageCode } from '../../types';
import { CVRenderer } from './CVRenderer';
import {
  Eye,
  ArrowRight,
  ShieldCheck,
  Maximize2,
  Check
} from 'lucide-react';

interface TemplateCardProps {
  template: TemplateDefinition;
  onSelectTemplate: (templateId: TemplateId, colorHex?: string) => void;
  onInspectTemplate: (templateId: TemplateId) => void;
  lang?: LanguageCode;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelectTemplate,
  onInspectTemplate,
  lang = 'fr'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const sample = template.sampleCV;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group relative ${
        isHovered
          ? 'border-blue-600 shadow-lg'
          : 'border-slate-200/90 shadow-2xs hover:border-slate-300'
      }`}
    >
      {/* Card Content Top Container */}
      <div className="p-4 pb-3 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Badges */}
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 truncate max-w-[140px]">
              {template.badge}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              <ShieldCheck className="w-3 h-3" />
              <span>ATS {template.atsScore}%</span>
            </div>
          </div>

          {/* High-Fidelity Scaled A4 Preview Frame */}
          <div
            onClick={() => onInspectTemplate(template.id)}
            className="relative w-full rounded-xl overflow-hidden bg-slate-100/90 border border-slate-200/90 shadow-xs cursor-pointer group/preview select-none flex items-start justify-center"
            style={{
              aspectRatio: '1 / 1.414',
            }}
          >
            {/* Live Scaled A4 Document with exact proportional transform */}
            <div className="w-full h-full relative overflow-hidden bg-slate-100 flex justify-center items-start">
              <div
                className="bg-white shadow-xs origin-top pointer-events-none shrink-0"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  transform: 'scale(0.36)',
                  transformOrigin: 'top center',
                }}
              >
                <CVRenderer
                  data={{
                    ...sample,
                    templateId: template.id
                  }}
                  showWatermark={false}
                />
              </div>
            </div>

            {/* Hover Quick Action Overlay */}
            <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px] opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectTemplate(template.id);
                }}
                className="w-full max-w-[170px] py-2 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Aperçu Plein Écran</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate(template.id, template.defaultColor);
                }}
                className="w-full max-w-[170px] py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Choisir ce modèle</span>
              </button>
            </div>
          </div>

          {/* Template Info Meta */}
          <div className="space-y-1 pt-2.5">
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center justify-between">
              <span className="truncate">{template.name}</span>
              <span className="text-[10px] font-semibold text-slate-400 shrink-0 ml-1">{template.layoutType}</span>
            </h3>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              {template.subtitle}
            </p>
          </div>
        </div>

        {/* Recommended Roles Tags */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Idéal pour :
          </div>
          <div className="flex flex-wrap gap-1">
            {template.recommendedRoles.slice(0, 2).map((role, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-semibold truncate max-w-[120px]"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Buttons (Normal State) */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/80 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onInspectTemplate(template.id)}
          className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-[11px] font-bold border border-slate-200 shadow-2xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          title="Voir le modèle en grand"
        >
          <Eye className="w-3 h-3 text-slate-500" />
          <span>Voir le modèle</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTemplate(template.id, template.defaultColor)}
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold shadow-xs transition-all flex items-center justify-center gap-1 group/btn cursor-pointer"
          title="Choisir et utiliser ce modèle"
        >
          <span>Choisir ce modèle</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
