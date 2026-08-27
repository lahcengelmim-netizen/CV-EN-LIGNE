import React, { useState } from 'react';
import { TemplateId, LanguageCode } from '../../types';
import { TemplateDefinition, getTemplateById } from '../../lib/templatesData';
import { CVRenderer } from './CVRenderer';
import {
  X,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  FileCheck,
  Palette,
  Briefcase,
  Layout,
  Star
} from 'lucide-react';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: TemplateId;
  onSelectTemplate: (templateId: TemplateId, colorHex?: string) => void;
  lang?: LanguageCode;
}

const COLOR_PRESETS = [
  { name: 'Bleu Roi', hex: '#2563eb' },
  { name: 'Bleu Marine', hex: '#1e3a8a' },
  { name: 'Teal Émeraude', hex: '#0f766e' },
  { name: 'Charbon / Noir', hex: '#18181b' },
  { name: 'Violet Moderne', hex: '#7c3aed' },
  { name: 'Bordeaux Exécutif', hex: '#881337' }
];

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  isOpen,
  onClose,
  templateId,
  onSelectTemplate,
  lang = 'fr'
}) => {
  const template: TemplateDefinition = getTemplateById(templateId);
  const [selectedColor, setSelectedColor] = useState<string>(template.defaultColor);
  const [previewScale, setPreviewScale] = useState<number>(0.75);

  if (!isOpen) return null;

  // Prepare custom sample CV clone with selected dynamic color
  const dynamicSampleCV = {
    ...template.sampleCV,
    theme: {
      ...template.sampleCV.theme,
      primaryColor: selectedColor
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">{template.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                  {template.badge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Score ATS : {template.atsScore}%
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{template.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body (2 Columns on Desktop) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Live Document Preview (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-200/70 p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-start border-r border-slate-200">
            {/* Zoom / scale control */}
            <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-3 px-2">
              <span className="font-semibold">Aperçu rendu A4 haute fidélité</span>
              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl shadow-2xs border border-slate-300">
                <button
                  onClick={() => setPreviewScale((s) => Math.max(0.45, Number((s - 0.1).toFixed(2))))}
                  className="px-1.5 font-bold hover:text-blue-600"
                >
                  -
                </button>
                <span className="font-mono font-bold text-[11px] w-10 text-center">
                  {Math.round(previewScale * 100)}%
                </span>
                <button
                  onClick={() => setPreviewScale((s) => Math.min(1.0, Number((s + 0.1).toFixed(2))))}
                  className="px-1.5 font-bold hover:text-blue-600"
                >
                  +
                </button>
              </div>
            </div>

            {/* Rendered CV Document */}
            <div className="shadow-2xl rounded-xl overflow-hidden bg-white max-w-full">
              <CVRenderer
                data={dynamicSampleCV}
                lang={lang}
                showWatermark={false}
                scale={previewScale}
              />
            </div>
          </div>

          {/* Right Column: Template details & customization & CTA (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6 bg-white">
            <div className="space-y-6">
              {/* Highlight Features */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-blue-600" />
                  Points forts de ce modèle
                </h3>
                <ul className="space-y-2">
                  {template.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Color Customizer */}
              <div className="space-y-2.5 border-t border-slate-100 pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-blue-600" />
                  Palette de couleurs suggérées
                </h3>
                <div className="flex flex-wrap items-center gap-2.5">
                  {COLOR_PRESETS.map((color) => {
                    const isSelected = selectedColor.toLowerCase() === color.hex.toLowerCase();
                    return (
                      <button
                        key={color.hex}
                        onClick={() => setSelectedColor(color.hex)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isSelected ? 'ring-4 ring-blue-500/20 scale-110 shadow-sm' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Roles */}
              <div className="space-y-2.5 border-t border-slate-100 pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  Recommandé pour ces profils
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {template.recommendedRoles.map((role, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reassurance note */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Flexibilité totale
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Vous pourrez à tout moment modifier vos textes, changer de modèle ou ajuster vos couleurs depuis le créateur sans jamais perdre vos informations saisies.
                </p>
              </div>
            </div>

            {/* Bottom Action CTAs */}
            <div className="pt-6 border-t border-slate-100 space-y-2 shrink-0">
              <button
                onClick={() => {
                  onSelectTemplate(template.id, selectedColor);
                  onClose();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <span>Choisir ce modèle ({template.name})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold transition-colors"
              >
                Continuer à explorer les autres modèles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
