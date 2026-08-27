import React, { useState } from 'react';
import { TemplateId, LanguageCode } from '../../types';
import { TEMPLATES_CATALOG, TEMPLATE_CATEGORIES, TemplateDefinition } from '../../lib/templatesData';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import {
  Layout,
  Eye,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Filter,
  Check,
  Star
} from 'lucide-react';

interface TemplatesGalleryProps {
  onSelectTemplate: (templateId: TemplateId, colorHex?: string) => void;
  lang?: LanguageCode;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({
  onSelectTemplate,
  lang = 'fr'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectModalTemplateId, setInspectModalTemplateId] = useState<TemplateId | null>(null);

  // Filter templates based on selected category
  const filteredTemplates = TEMPLATES_CATALOG.filter((tmpl) =>
    selectedCategory === 'all' ? true : tmpl.categories.includes(selectedCategory)
  );

  return (
    <section id="templates-section" className="relative py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold border border-blue-200 shadow-2xs">
          <Layout className="w-3.5 h-3.5 text-blue-600" />
          <span>Galerie de Modèles Conformes ATS</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Des designs soignés pour chaque type de métier
        </h2>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Choisissez le style qui correspond à votre profil professionnel. Tous nos modèles sont conçus pour séduire les recruteurs et franchir avec succès les scanners ATS.
        </p>
      </div>

      {/* Category Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar justify-start sm:justify-center">
        {TEMPLATE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md scale-102 ring-2 ring-slate-900/10'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Templates Grid Showcase (3-4 columns on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        {filteredTemplates.map((template) => {
          const sample = template.sampleCV;
          return (
            <div
              key={template.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-blue-400 hover:-translate-y-1"
            >
              {/* Card Top / Mockup Preview Container */}
              <div className="p-4 pb-3 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 truncate max-w-[140px]">
                      {template.badge}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      <ShieldCheck className="w-3 h-3" />
                      <span>ATS {template.atsScore}%</span>
                    </div>
                  </div>

                  {/* High Fidelity Visual CV Preview Mockup Frame */}
                  <div
                    onClick={() => setInspectModalTemplateId(template.id)}
                    className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs cursor-pointer group/preview aspect-[1/1.33] max-h-[300px]"
                  >
                    {/* Miniature Simulated Template Rendering */}
                    <div className="p-3 bg-white h-full flex flex-col justify-between text-slate-800 text-[9px] select-none transform transition-transform duration-300 group-hover/preview:scale-[1.03]">
                      {/* Header bar / Banner */}
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

                      {/* Document Body preview */}
                      <div className="space-y-1.5 py-1.5 flex-1 overflow-hidden">
                        <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                          Expérience Pro
                        </div>
                        {sample.experiences.slice(0, 2).map((exp, idx) => (
                          <div key={idx} className="border-l border-slate-200 pl-1.5 space-y-0.5">
                            <div className="font-bold text-slate-800 text-[8.5px] truncate">{exp.position}</div>
                            <div className="text-[7.5px] text-slate-500 truncate">{exp.company} • {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                          </div>
                        ))}

                        <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider pt-0.5">
                          Compétences
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
                        <span>Format A4 HD</span>
                        <span className="text-blue-600 font-bold">Aperçu rapide</span>
                      </div>
                    </div>

                    {/* Hover Overlay Button */}
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1.5px] opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectModalTemplateId(template.id);
                        }}
                        className="px-3 py-1.5 bg-white text-slate-900 font-bold text-[11px] rounded-lg shadow-lg flex items-center gap-1.5 hover:bg-slate-50 transition-transform scale-95 group-hover/preview:scale-100 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Agrandir</span>
                      </button>
                    </div>
                  </div>

                  {/* Template Meta Info */}
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

              {/* Card Action Buttons (Voir le modèle / Utiliser ce modèle) */}
              <div className="p-3 border-t border-slate-100 bg-slate-50/80 flex items-center gap-2">
                <button
                  onClick={() => setInspectModalTemplateId(template.id)}
                  className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-[11px] font-bold border border-slate-200 shadow-2xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  title="Voir le modèle en grand"
                >
                  <Eye className="w-3 h-3 text-slate-500" />
                  <span>Voir le modèle</span>
                </button>

                <button
                  onClick={() => onSelectTemplate(template.id, template.defaultColor)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold shadow-xs transition-all flex items-center justify-center gap-1 group/btn cursor-pointer"
                  title="Utiliser ce modèle dans le CV Builder"
                >
                  <span>Utiliser ce modèle</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspection Modal */}
      {inspectModalTemplateId && (
        <TemplatePreviewModal
          isOpen={Boolean(inspectModalTemplateId)}
          templateId={inspectModalTemplateId}
          onClose={() => setInspectModalTemplateId(null)}
          onSelectTemplate={onSelectTemplate}
          lang={lang}
        />
      )}
    </section>
  );
};
