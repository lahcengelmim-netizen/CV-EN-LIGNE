import React, { useState } from 'react';
import { TemplateId, LanguageCode } from '../../types';
import { TEMPLATES_CATALOG, TEMPLATE_CATEGORIES } from '../../lib/templatesData';
import { TemplateCard } from './TemplateCard';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import {
  Layout,
  ShieldCheck,
  Sparkles
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
          Choisissez le style qui correspond à votre profil professionnel. Survolez chaque modèle pour afficher son rendu A4 complet en taille réelle.
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
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
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
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelectTemplate={onSelectTemplate}
            onInspectTemplate={(id) => setInspectModalTemplateId(id)}
            lang={lang}
          />
        ))}
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

