import React, { useState } from 'react';
import { TemplateId, LanguageCode } from '../../types';
import { TEMPLATES_CATALOG, TEMPLATE_CATEGORIES } from '../../lib/templatesData';
import { TemplateCard } from './TemplateCard';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import {
  Layout,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Grid
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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Filter templates based on selected category
  const filteredTemplates = TEMPLATES_CATALOG.filter((tmpl) =>
    selectedCategory === 'all' ? true : tmpl.categories.includes(selectedCategory)
  );

  // Display only 4 featured templates by default unless expanded
  const displayedTemplates = isExpanded ? filteredTemplates : filteredTemplates.slice(0, 4);

  // Localized texts
  const seeAllLabels: Record<string, { all: string; less: string; subtitle: string }> = {
    fr: {
      all: 'Voir tous les modèles',
      less: 'Afficher moins de modèles',
      subtitle: 'Découvrez nos 21 designs professionnels optimisés pour les recruteurs et les filtres ATS'
    },
    ar: {
      all: 'عرض جميع النماذج',
      less: 'عرض نماذج أقل',
      subtitle: 'اكتشف 21 تصميمًا احترافيًا معتمدًا ومطابقًا لمعايير ATS'
    },
    en: {
      all: 'View all templates',
      less: 'Show fewer templates',
      subtitle: 'Explore our 21 professional designs optimized for recruiters and ATS filters'
    },
    es: {
      all: 'Ver todas las plantillas',
      less: 'Mostrar menos plantillas',
      subtitle: 'Explora nuestros 21 diseños profesionales optimizados para reclutadores y ATS'
    },
    de: {
      all: 'Alle Vorlagen anzeigen',
      less: 'Weniger Vorlagen anzeigen',
      subtitle: 'Entdecken Sie unsere 21 professionellen Vorlagen, optimiert für ATS-Systeme'
    },
    it: {
      all: 'Visualizza tutti i modelli',
      less: 'Mostra meno modelli',
      subtitle: 'Scopri i nostri 21 modelli professionali ottimizzati per ATS e selezionatori'
    },
    pt: {
      all: 'Ver todos os modelos',
      less: 'Mostrar menos modelos',
      subtitle: 'Descubra nossos 21 designs profissionais otimizados para recrutadores e filtros ATS'
    },
    zh: {
      all: '查看所有模板',
      less: '收起部分模板',
      subtitle: '探索我们针对招聘人员和 ATS 筛选器优化的 21 种专业设计'
    }
  };

  const labels = seeAllLabels[lang] || seeAllLabels.fr;

  return (
    <section id="templates-section" className="relative py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold border border-blue-200 shadow-2xs">
          <Layout className="w-3.5 h-3.5 text-blue-600" />
          <span>Galerie de Modèles Conformes ATS ({TEMPLATES_CATALOG.length} modèles disponibles)</span>
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
        {displayedTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelectTemplate={onSelectTemplate}
            onInspectTemplate={(id) => setInspectModalTemplateId(id)}
            lang={lang}
          />
        ))}
      </div>

      {/* Prominent Expand / Collapse Control */}
      {filteredTemplates.length > 4 && (
        <div className="mt-12 flex flex-col items-center justify-center space-y-3">
          {!isExpanded ? (
            <>
              <button
                onClick={() => setIsExpanded(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:scale-102 transition-all cursor-pointer group"
                id="btn-see-all-templates"
              >
                <Grid className="w-5 h-5 text-blue-200 group-hover:rotate-12 transition-transform" />
                <span>{labels.all}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-white text-xs font-bold">
                  {filteredTemplates.length} modèles
                </span>
                <ChevronDown className="w-4 h-4 text-blue-200 group-hover:translate-y-0.5 transition-transform" />
              </button>
              <p className="text-xs text-slate-500 text-center max-w-md">
                {labels.subtitle}
              </p>
            </>
          ) : (
            <button
              onClick={() => {
                setIsExpanded(false);
                const el = document.getElementById('templates-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl font-bold text-xs sm:text-sm border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer"
              id="btn-see-less-templates"
            >
              <ChevronUp className="w-4 h-4 text-slate-500" />
              <span>{labels.less}</span>
            </button>
          )}
        </div>
      )}

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

