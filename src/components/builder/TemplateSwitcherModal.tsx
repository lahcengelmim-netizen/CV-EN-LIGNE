import React from 'react';
import { TemplateId } from '../../types';
import { TEMPLATES_CATALOG, TemplateDefinition } from '../../lib/templatesData';
import { X, Check, Layout, Sparkles, ShieldCheck } from 'lucide-react';

interface TemplateSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateId: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
}

export const TemplateSwitcherModal: React.FC<TemplateSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentTemplateId,
  onSelectTemplate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Changer de modèle de CV</h2>
              <p className="text-xs text-slate-500">
                Vos informations saisies sont intégralement conservées lors du changement de design.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES_CATALOG.map((tmpl) => {
            const isSelected = currentTemplateId === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => {
                  onSelectTemplate(tmpl.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-500/10 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {tmpl.badge}
                    </span>
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                        ATS {tmpl.atsScore}%
                      </span>
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div
                    className="h-28 rounded-xl p-3 text-white flex flex-col justify-between shadow-xs transition-transform group-hover:scale-[1.02]"
                    style={{ backgroundColor: tmpl.defaultColor }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-white/40"></div>
                      <div className="w-20 h-2 bg-white/60 rounded"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full h-1.5 bg-white/40 rounded"></div>
                      <div className="w-3/4 h-1.5 bg-white/30 rounded"></div>
                      <div className="w-1/2 h-1.5 bg-white/30 rounded"></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {tmpl.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                  }`}
                >
                  {isSelected ? 'Modèle actuel' : 'Appliquer ce design'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
