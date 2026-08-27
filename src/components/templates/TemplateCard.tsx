import React, { useState, useRef, useEffect } from 'react';
import { TemplateDefinition } from '../../lib/templatesData';
import { TemplateId, LanguageCode } from '../../types';
import { CVRenderer } from './CVRenderer';
import {
  Eye,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Maximize2,
  Check,
  Layers,
  ChevronDown
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
  const [showFullHoverPreview, setShowFullHoverPreview] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sample = template.sampleCV;

  // Debounce hover entrance/exit slightly to prevent rapid flickering on fast mouse movements
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setShowFullHoverPreview(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setShowFullHoverPreview(false);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-visible group relative ${
        isHovered
          ? 'border-blue-500 shadow-xl -translate-y-1 z-20'
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

          {/* Miniature Preview Frame with Hover Overlay */}
          <div
            onClick={() => onInspectTemplate(template.id)}
            className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs cursor-pointer group/preview aspect-[1/1.33] max-h-[290px]"
          >
            {/* Standard Thumbnail View */}
            <div className="p-3 bg-white h-full flex flex-col justify-between text-slate-800 text-[9px] select-none transform transition-transform duration-300 group-hover/preview:scale-[1.02]">
              {/* Header Bar */}
              <div
                className="p-2 rounded-lg text-white flex items-center gap-2 transition-colors"
                style={{ backgroundColor: template.defaultColor }}
              >
                <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                  {sample.personalInfo.firstName[0]}
                  {sample.personalInfo.lastName[0]}
                </div>
                <div className="overflow-hidden">
                  <div className="font-extrabold text-[10px] leading-tight truncate">
                    {sample.personalInfo.firstName} {sample.personalInfo.lastName}
                  </div>
                  <div className="text-[8px] text-white/85 font-medium truncate">
                    {sample.personalInfo.title}
                  </div>
                </div>
              </div>

              {/* Body Summary */}
              <div className="space-y-1.5 py-1.5 flex-1 overflow-hidden">
                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                  Expérience Pro
                </div>
                {sample.experiences.slice(0, 2).map((exp, idx) => (
                  <div key={idx} className="border-l border-slate-200 pl-1.5 space-y-0.5">
                    <div className="font-bold text-slate-800 text-[8.5px] truncate">{exp.position}</div>
                    <div className="text-[7.5px] text-slate-500 truncate">
                      {exp.company} • {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}
                    </div>
                  </div>
                ))}

                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider pt-0.5">
                  Compétences clés
                </div>
                <div className="flex flex-wrap gap-1">
                  {sample.skills.slice(0, 3).map((s) => (
                    <span
                      key={s.id}
                      className="px-1 py-0.2 rounded bg-slate-100 text-slate-700 text-[7px] font-medium truncate max-w-[80px]"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Footer Info */}
              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[7.5px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Layers className="w-2.5 h-2.5 text-blue-500" />
                  Format A4 Standard
                </span>
                <span className="text-blue-600 font-bold flex items-center gap-0.5">
                  Survoler pour aperçu 100%
                </span>
              </div>
            </div>

            {/* Hover Quick Action Ribbon */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1.5px] opacity-0 group-hover/preview:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectTemplate(template.id);
                }}
                className="w-full max-w-[180px] py-2 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-transform transform scale-95 group-hover/preview:scale-100 cursor-pointer"
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
                className="w-full max-w-[180px] py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-transform transform scale-95 group-hover/preview:scale-100 cursor-pointer"
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

      {/* --- DESKTOP HOVER FULL-DOCUMENT POPUP PANEL (100% COMPLETE A4 PREVIEW) --- */}
      {showFullHoverPreview && (
        <div
          className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-[-15px] z-50 w-[420px] bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 p-3.5 text-white animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Header Bar with Template Name & Actions */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div
                className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20"
                style={{ backgroundColor: template.defaultColor }}
              />
              <span className="font-extrabold text-xs tracking-tight text-white">
                {template.name} • Aperçu Intégral A4
              </span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              ATS {template.atsScore}%
            </span>
          </div>

          {/* Scaled Full Document Frame (Complete A4 Document, 100% Uncropped) */}
          <div className="relative bg-slate-100 rounded-xl overflow-y-auto max-h-[460px] border border-slate-700 shadow-inner flex justify-center p-2 no-scrollbar">
            <div
              className="bg-white shadow-xl rounded-md overflow-hidden origin-top"
              style={{
                width: '210mm',
                minHeight: '297mm',
                transform: 'scale(0.48)',
                transformOrigin: 'top center',
                marginBottom: '-580px' // Compensate for scaled height to ensure tight container bounding
              }}
            >
              <CVRenderer
                data={{
                  ...sample,
                  templateId: template.id
                }}
                lang={lang}
                showWatermark={false}
              />
            </div>
          </div>

          {/* Sticky Footer Actions Inside Hover Panel */}
          <div className="pt-3 mt-2.5 border-t border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onInspectTemplate(template.id)}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Agrandir / Zoom</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTemplate(template.id, template.defaultColor)}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Choisir ce modèle</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
