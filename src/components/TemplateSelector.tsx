import React, { useState } from 'react';
import { CVData, TemplateId, LanguageCode } from '../types';
import {
  TEMPLATE_REGISTRY,
  TemplateRegistryItem,
  getAllTemplates,
} from './templates/templateRegistry';
import { CVRenderer } from './templates/CVRenderer';
import {
  Check,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Layout,
  Maximize2,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import './TemplateSelector.css';

export interface TemplateSelectorProps {
  selectedTemplateId?: TemplateId | string;
  onSelectTemplate: (templateId: TemplateId, colorHex?: string) => void;
  cvData?: CVData;
  className?: string;
  showCategoryTabs?: boolean;
  onInspectTemplate?: (templateId: TemplateId) => void;
  compact?: boolean;
  lang?: LanguageCode | string;
}

type FilterCategory = 'all' | 'modern' | 'classic' | 'minimal' | 'creative' | 'tech';

/**
 * TemplateSelector
 * Interactive UI component allowing users to click and select their preferred CV design template.
 * Features:
 * - Direct selection across at least 4 distinct layouts ('Modern-Sidebar', 'ATS-Classic', 'Minimalist', 'Creative', etc.)
 * - Scaled A4 live-fidelity preview frames reflecting real-time candidate data
 * - ATS compliance badges, layout categorization filters, and instant switching
 */
export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId = 'modern',
  onSelectTemplate,
  cvData,
  className = '',
  showCategoryTabs = true,
  onInspectTemplate,
  compact = false,
  lang = 'fr',
}) => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const allTemplates = getAllTemplates();

  const categories: Array<{ id: FilterCategory; label: string }> = [
    { id: 'all', label: 'Tous les modèles' },
    { id: 'modern', label: 'Moderne (2 Colonnes)' },
    { id: 'classic', label: 'ATS & Classique' },
    { id: 'minimal', label: 'Minimaliste' },
    { id: 'creative', label: 'Créatif' },
    { id: 'tech', label: 'Tech & Dev' },
  ];

  const filteredTemplates = allTemplates.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  // Normalization for alias IDs (e.g. 'modern-sidebar' vs 'modern', 'ats-classic' vs 'ats')
  const isSelected = (templateId: TemplateId) => {
    if (selectedTemplateId === templateId) return true;
    if (
      (selectedTemplateId === 'modern' || selectedTemplateId === 'modern-sidebar') &&
      (templateId === 'modern' || templateId === 'modern-sidebar')
    ) {
      return true;
    }
    if (
      (selectedTemplateId === 'ats' || selectedTemplateId === 'ats-classic') &&
      (templateId === 'ats' || templateId === 'ats-classic')
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className={`template-selector-container ${className}`} id="template-selector-root">
      {/* Header Section */}
      {!compact && (
        <div className="template-selector-header">
          <div className="template-badge-pill">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Design Studio & ATS Vérifié</span>
          </div>
          <h2 className="template-selector-title text-2xl sm:text-3xl font-black text-slate-900">
            Choisissez votre modèle de CV
          </h2>
          <p className="template-selector-subtitle text-sm text-slate-500 max-w-xl mx-auto">
            Changez de design en 1 clic. Vos informations saisies sont automatiquement transférées
            et mises en page en temps réel.
          </p>
        </div>
      )}

      {/* Category Tabs */}
      {showCategoryTabs && (
        <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Templates Responsive Grid */}
      <div className="template-grid">
        {filteredTemplates.map((template) => {
          const selected = isSelected(template.id);

          return (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template.id, template.defaultColor)}
              className={`template-card group ${selected ? 'selected' : ''}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTemplate(template.id, template.defaultColor);
                }
              }}
              aria-pressed={selected}
              aria-label={`Sélectionner le modèle ${template.name}`}
            >
              {/* Selected Floating Badge */}
              {selected && (
                <div className="selected-badge">
                  <CheckCircle2 className="badge-icon" />
                  <span>Actif</span>
                </div>
              )}

              {/* Layout Type Tag */}
              <div className="template-tag">
                <span>{template.badge}</span>
              </div>

              {/* ATS Score Tag */}
              {template.atsScore && (
                <div className="ats-score-tag flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>ATS {template.atsScore}%</span>
                </div>
              )}

              {/* Scaled A4 Preview Frame */}
              <div className="preview-a4-frame">
                <div className="scaled-cv-wrapper" dir="ltr">
                  <CVRenderer
                    data={
                      cvData
                        ? { ...cvData, templateId: template.id }
                        : ({
                            id: `sample_${template.id}`,
                            title: 'CV Démonstration',
                            templateId: template.id,
                            isPaid: true,
                            personalInfo: {
                              firstName: 'Alexandre',
                              lastName: 'Dubois',
                              title: 'Lead Développeur Full Stack',
                              email: 'alexandre.dubois@email.com',
                              phone: '+33 6 12 34 56 78',
                              city: 'Paris',
                              country: 'France',
                              linkedin: 'linkedin.com/in/alexandre',
                              photoUrl:
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                            },
                            summary:
                              'Ingénieur logiciel avec 6 ans d’expérience en architectures React, TypeScript et Node.js. Spécialisé dans la conception d’interfaces haute performance.',
                            experiences: [
                              {
                                id: 'exp_1',
                                position: 'Senior Frontend Engineer',
                                company: 'Tech Horizon',
                                city: 'Paris',
                                startDate: '2022',
                                endDate: '',
                                current: true,
                                description: 'Direction technique des applications client.',
                                tasks: [
                                  'Amélioration de 40% des métriques Web Vitals',
                                  'Conception du Design System UI d’entreprise',
                                ],
                              },
                            ],
                            educations: [
                              {
                                id: 'edu_1',
                                degree: 'Master en Ingénierie Logicielle',
                                institution: 'Sorbonne Université',
                                startDate: '2016',
                                endDate: '2021',
                                current: false,
                              },
                            ],
                            skills: [
                              { id: 's1', name: 'React / Next.js', level: 5 },
                              { id: 's2', name: 'TypeScript', level: 5 },
                              { id: 's3', name: 'Tailwind CSS', level: 4 },
                              { id: 's4', name: 'Node.js', level: 4 },
                            ],
                            languages: [
                              { id: 'l1', language: 'Français', level: 'Maternelle' },
                              { id: 'l2', language: 'Anglais', level: 'Courant (C1)' },
                            ],
                            certifications: [],
                            projects: [],
                            theme: {
                              primaryColor: template.defaultColor,
                              fontFamily: 'sans',
                              spacing: 'normal',
                              showPhoto: true,
                              photoShape: 'rounded',
                            },
                          } as CVData)
                    }
                    scale={1}
                    disableAutoFallback={true}
                    showWatermark={false}
                  />
                </div>

                {/* Hover Quick Action Overlay */}
                <div className="hover-overlay">
                  <div className="hover-btn-group">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(template.id, template.defaultColor);
                      }}
                      className="action-btn"
                    >
                      {selected ? 'Modèle Actif' : 'Choisir ce modèle'}
                    </button>

                    {onInspectTemplate && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectTemplate(template.id);
                        }}
                        className="inspect-btn flex items-center justify-center gap-1.5"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-slate-700" />
                        <span>Aperçu détaillé</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Template Card Footer */}
              <div className="template-card-footer">
                <div className="template-header-row">
                  <h3 className="template-name">{template.name}</h3>
                  <span
                    className="template-color-dot"
                    style={{ backgroundColor: template.defaultColor }}
                    title={`Couleur par défaut: ${template.defaultColor}`}
                  />
                </div>
                <p className="template-desc">{template.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
