import React from 'react';
import { CVTheme, TemplateId, LanguageCode } from '../../types';
import { Layout, Palette, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

interface Props {
  templateId: TemplateId;
  theme: CVTheme;
  onTemplateChange: (templateId: TemplateId) => void;
  onThemeChange: (theme: CVTheme) => void;
  lang?: LanguageCode;
}

const TEMPLATES: Array<{
  id: TemplateId;
  name: string;
  badge: string;
  description: string;
  previewBg: string;
}> = [
  {
    id: 'modern',
    name: 'Moderne (2 Colonnes)',
    badge: 'Le plus populaire',
    description: 'Structure latérale contrastée, idéale pour mettre en valeur les compétences et l\'expérience.',
    previewBg: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'classic',
    name: 'Classique & Élégant',
    badge: 'ATS Optimisé',
    description: 'Mise en page épurée et intemporelle, recommandée pour les postes juridiques, bancaires et administratifs.',
    previewBg: 'from-slate-800 to-slate-900'
  },
  {
    id: 'minimal',
    name: 'Minimaliste Scandinave',
    badge: 'Ultra Lisible',
    description: 'Typographie aérée, accents monospacés, clarté absolue pour profils tech et freelances.',
    previewBg: 'from-zinc-700 to-zinc-900'
  },
  {
    id: 'professional',
    name: 'Corporate Exécutif',
    badge: 'Cadre & Manager',
    description: 'Bandeau supérieur impactant, mise en page équilibrée pour profils confirmés et managers.',
    previewBg: 'from-teal-700 to-emerald-900'
  },
  {
    id: 'creative',
    name: 'Créatif & Dynamique',
    badge: 'Design & Marketing',
    description: 'Cartes adoucies, touches de couleur moderne et badges pour métiers de la communication et design.',
    previewBg: 'from-purple-600 to-pink-600'
  }
];

const PRESET_COLORS = [
  { name: 'Bleu Roi', hex: '#2563eb' },
  { name: 'Bleu Marine', hex: '#1e3a8a' },
  { name: 'Teal Émeraude', hex: '#0f766e' },
  { name: 'Ardoise / Noir', hex: '#0f172a' },
  { name: 'Bordeaux Profond', hex: '#881337' },
  { name: 'Violet Créatif', hex: '#7c3aed' },
  { name: 'Bronze Élégant', hex: '#854d0e' },
  { name: 'Vert Forêt', hex: '#166534' }
];

export const StepTemplateCustomizer: React.FC<Props> = ({
  templateId,
  theme,
  onTemplateChange,
  onThemeChange,
  lang = 'fr'
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">8. Modèle & Personnalisation Graphique</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Choisissez l'apparence visuelle de votre CV. Tous nos modèles sont conçus pour passer les filtres ATS des recruteurs.
        </p>
      </div>

      {/* Templates Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Layout className="w-4 h-4 text-blue-600" />
          <span>Choisissez votre modèle de CV (5 designs pros)</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((tmpl) => {
            const isSelected = templateId === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => onTemplateChange(tmpl.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 ring-4 ring-blue-500/10 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {tmpl.badge}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Visual card thumbnail preview */}
                  <div className={`h-24 rounded-xl bg-gradient-to-br ${tmpl.previewBg} p-3 text-white flex flex-col justify-between shadow-xs`}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-white/40"></div>
                      <div className="w-16 h-2 bg-white/60 rounded"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-24 h-1.5 bg-white/50 rounded"></div>
                      <div className="w-14 h-1.5 bg-white/40 rounded"></div>
                    </div>
                  </div>

                  <div className="font-bold text-sm text-slate-900">{tmpl.name}</div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{tmpl.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Customizer */}
      <div className="space-y-3 border-t border-slate-200 pt-6">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-blue-600" />
          <span>Couleur dominante du CV</span>
        </label>

        <div className="flex flex-wrap items-center gap-3">
          {PRESET_COLORS.map((c) => {
            const isSelected = theme.primaryColor.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.hex}
                type="button"
                onClick={() => onThemeChange({ ...theme, primaryColor: c.hex })}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isSelected ? 'ring-4 ring-blue-500/20 scale-110 shadow-md' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
              </button>
            );
          })}

          {/* Custom color picker */}
          <div className="flex items-center gap-2 ml-2 pl-3 border-l border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Personnalisée :</span>
            <input
              type="color"
              value={theme.primaryColor}
              onChange={(e) => onThemeChange({ ...theme, primaryColor: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Photo Toggle & Display Options */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-blue-600" />
          <span>Options d'affichage</span>
        </label>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="font-bold text-xs text-slate-800">Afficher la photo sur le CV</div>
            <p className="text-xs text-slate-500">
              Désactivez cette option pour un CV standardisé sans photo (recommandé pour les candidatures anglo-saxonnes).
            </p>
          </div>
          <button
            type="button"
            onClick={() => onThemeChange({ ...theme, showPhoto: !theme.showPhoto })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              theme.showPhoto ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                theme.showPhoto ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
