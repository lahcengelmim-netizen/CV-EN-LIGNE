import React from 'react';
import { CVData, TemplateId } from '../../types';
import { ModernSidebarTemplate } from './ModernSidebarTemplate';
import { ATSClassicTemplate } from './ATSClassicTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { ModernTemplate } from './ModernTemplate';
import { ATSTemplate } from './ATSTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { TechTemplate } from './TechTemplate';
import { StudentTemplate } from './StudentTemplate';
import { BoldTemplate } from './BoldTemplate';
import { CompactTemplate } from './CompactTemplate';
import { TimelineTemplate } from './TimelineTemplate';
import { NordicTemplate } from './NordicTemplate';
import { InfographicTemplate } from './InfographicTemplate';
import { StockholmTemplate } from './StockholmTemplate';
import { ZurichTemplate } from './ZurichTemplate';
import { SiliconTemplate } from './SiliconTemplate';

export type TemplateLayoutType = 'two-column' | 'single-column' | 'sidebar' | 'banner' | 'modern-cards';

export interface TemplateRegistryItem {
  id: TemplateId;
  name: string;
  category: 'modern' | 'classic' | 'minimal' | 'creative' | 'tech' | 'executive';
  badge: string;
  layoutType: TemplateLayoutType;
  description: string;
  defaultColor: string;
  atsScore: number;
  component: React.FC<{ data: CVData; lang?: string }>;
  tags: string[];
}

/**
 * Global Template Registry
 * Centralized mapping of all supported CV templates with dynamic layout resolution.
 */
export const TEMPLATE_REGISTRY: Record<string, TemplateRegistryItem> = {
  // 1. Modern / Modern-Sidebar Layout
  'modern': {
    id: 'modern',
    name: 'Modern-Sidebar',
    category: 'modern',
    badge: 'Populaire',
    layoutType: 'two-column',
    description: 'Mise en page 2 colonnes avec barre latérale colorée pour contacts, compétences et photo.',
    defaultColor: '#2563eb',
    atsScore: 98,
    component: ModernSidebarTemplate,
    tags: ['2 Colonnes', 'Photo', 'Barre Colorée', 'Moderne'],
  },
  'modern-sidebar': {
    id: 'modern-sidebar',
    name: 'Modern-Sidebar',
    category: 'modern',
    badge: 'Populaire',
    layoutType: 'two-column',
    description: 'Mise en page 2 colonnes avec barre latérale colorée pour contacts, compétences et photo.',
    defaultColor: '#2563eb',
    atsScore: 98,
    component: ModernSidebarTemplate,
    tags: ['2 Colonnes', 'Photo', 'Barre Colorée', 'Moderne'],
  },

  // 2. Classic / ATS-Classic Layout
  'ats': {
    id: 'ats',
    name: 'ATS-Classic',
    category: 'classic',
    badge: 'ATS 100%',
    layoutType: 'single-column',
    description: 'Design épuré sur une colonne, texte noir haute lisibilité, parfaitement parsable par les ATS.',
    defaultColor: '#000000',
    atsScore: 100,
    component: ATSClassicTemplate,
    tags: ['1 Colonne', 'Texte Noir', 'ATS Optimisé', 'Lisibilité Maximale'],
  },
  'ats-classic': {
    id: 'ats-classic',
    name: 'ATS-Classic',
    category: 'classic',
    badge: 'ATS 100%',
    layoutType: 'single-column',
    description: 'Design épuré sur une colonne, texte noir haute lisibilité, parfaitement parsable par les ATS.',
    defaultColor: '#000000',
    atsScore: 100,
    component: ATSClassicTemplate,
    tags: ['1 Colonne', 'Texte Noir', 'ATS Optimisé', 'Lisibilité Maximale'],
  },
  'classic': {
    id: 'classic',
    name: 'Classique & ATS',
    category: 'classic',
    badge: 'Intemporel',
    layoutType: 'single-column',
    description: 'Structure formelle classique, idéale pour l’administration, la finance et le droit.',
    defaultColor: '#1e3a8a',
    atsScore: 99,
    component: ClassicTemplate,
    tags: ['Classique', '1 Colonne', 'Formel'],
  },

  // 3. Minimalist Layout
  'minimal': {
    id: 'minimal',
    name: 'Minimaliste Scandinave',
    category: 'minimal',
    badge: 'Épuré',
    layoutType: 'single-column',
    description: 'Typographie nette, lignes fines et composition aérée pour développeurs et designers.',
    defaultColor: '#18181b',
    atsScore: 99,
    component: MinimalTemplate,
    tags: ['Minimaliste', 'Noir & Blanc', 'Design Tech'],
  },

  // 4. Creative Layout
  'creative': {
    id: 'creative',
    name: 'Créatif & Vibrant',
    category: 'creative',
    badge: 'Design',
    layoutType: 'banner',
    description: 'En-tête stylisé et cartes modernes pour profils marketing, communication et créatifs.',
    defaultColor: '#7c3aed',
    atsScore: 95,
    component: CreativeTemplate,
    tags: ['Créatif', 'Bandeau Stylé', 'Vibrant'],
  },

  // Secondary Layouts in Catalog
  'professional': {
    id: 'professional',
    name: 'Corporate Exécutif',
    category: 'classic',
    badge: 'Corporate',
    layoutType: 'banner',
    description: 'Bandeau supérieur statutaire et mise en page équilibrée pour cadres confirmés.',
    defaultColor: '#1e293b',
    atsScore: 97,
    component: ProfessionalTemplate,
    tags: ['Corporate', 'Cadres', 'Finance'],
  },
  'executive': {
    id: 'executive',
    name: 'Executive Leadership',
    category: 'executive',
    badge: 'Direction',
    layoutType: 'banner',
    description: 'Format prestigieux avec accents bronze et sections d’impact managérial.',
    defaultColor: '#854d0e',
    atsScore: 96,
    component: ExecutiveTemplate,
    tags: ['Direction', 'Management', 'Prestige'],
  },
  'tech': {
    id: 'tech',
    name: 'Silicon Tech',
    category: 'tech',
    badge: 'Code / Dev',
    layoutType: 'two-column',
    description: 'Accents typographiques monospaces et mise en avant des stacks techniques.',
    defaultColor: '#0284c7',
    atsScore: 97,
    component: TechTemplate,
    tags: ['Stack Technique', 'Développeurs', 'GitHub'],
  },
  'student': {
    id: 'student',
    name: 'Étudiant & Premier Emploi',
    category: 'modern',
    badge: 'Débutants',
    layoutType: 'two-column',
    description: 'Met en valeur les formations, projets académiques et compétences clés.',
    defaultColor: '#4f46e5',
    atsScore: 98,
    component: StudentTemplate,
    tags: ['Étudiant', 'Stages', 'Projets'],
  },
  'bold': {
    id: 'bold',
    name: 'Bold Impact',
    category: 'creative',
    badge: 'Tendance',
    layoutType: 'banner',
    description: 'Bandeau percutant et contrastes vifs pour profils dynamiques.',
    defaultColor: '#4338ca',
    atsScore: 96,
    component: BoldTemplate,
    tags: ['Impact', 'Dynamique', 'Marketing'],
  },
  'compact': {
    id: 'compact',
    name: 'Compact Studio',
    category: 'modern',
    badge: 'Studio',
    layoutType: 'sidebar',
    description: 'Densité optimale avec jauges précises et colonne latérale douce.',
    defaultColor: '#0f766e',
    atsScore: 97,
    component: CompactTemplate,
    tags: ['Compact', 'Studio', '1 Page A4'],
  },
  'timeline': {
    id: 'timeline',
    name: 'Chrono Timeline',
    category: 'modern',
    badge: 'Storytelling',
    layoutType: 'two-column',
    description: 'Frise chronologique claire visualisant l’évolution de votre parcours.',
    defaultColor: '#1d4ed8',
    atsScore: 96,
    component: TimelineTemplate,
    tags: ['Timeline', 'Parcours', 'Chrono'],
  },
  'nordic': {
    id: 'nordic',
    name: 'Nordic Éditorial',
    category: 'minimal',
    badge: 'B&W Chic',
    layoutType: 'single-column',
    description: 'Monochrome scandinave ultra-raffiné pour direction et consultants.',
    defaultColor: '#27272a',
    atsScore: 100,
    component: NordicTemplate,
    tags: ['Nordic', 'Éditorial', 'Monochrome'],
  },
  'infographic': {
    id: 'infographic',
    name: 'Infographique & Projets',
    category: 'creative',
    badge: 'Visuel',
    layoutType: 'sidebar',
    description: 'Présentation graphique et dynamique de vos réalisations et compétences.',
    defaultColor: '#9333ea',
    atsScore: 95,
    component: InfographicTemplate,
    tags: ['Infographique', 'Graphique', 'Projets'],
  },
  'stockholm-modern': {
    id: 'stockholm-modern',
    name: 'Stockholm Modern',
    category: 'modern',
    badge: 'Best-Seller',
    layoutType: 'two-column',
    description: 'Design scandinave moderne avec hiérarchie visuelle irréprochable.',
    defaultColor: '#2563eb',
    atsScore: 99,
    component: StockholmTemplate,
    tags: ['Stockholm', 'Scandinave', 'Élégant'],
  },
  'zurich-executive': {
    id: 'zurich-executive',
    name: 'Zurich Executive',
    category: 'executive',
    badge: 'Suisse',
    layoutType: 'banner',
    description: 'Rigueur et clarté helvétique pour l’audit, le conseil et la finance.',
    defaultColor: '#0f172a',
    atsScore: 99,
    component: ZurichTemplate,
    tags: ['Suisse', 'Audit', 'Finance'],
  },
  'silicon-tech': {
    id: 'silicon-tech',
    name: 'Silicon Tech Pro',
    category: 'tech',
    badge: 'Silicon Valley',
    layoutType: 'two-column',
    description: 'Format adopté par les ingénieurs logiciels et experts data.',
    defaultColor: '#0369a1',
    atsScore: 98,
    component: SiliconTemplate,
    tags: ['Silicon Valley', 'Software', 'Data'],
  },
};

/**
 * Returns the matching template component, falling back gracefully to ModernSidebarTemplate.
 */
export const getTemplateComponent = (templateId?: string): React.FC<{ data: CVData; lang?: string }> => {
  if (!templateId) return ModernSidebarTemplate;
  const item = TEMPLATE_REGISTRY[templateId];
  return item?.component || ModernSidebarTemplate;
};

/**
 * Retrieves full metadata for a registered template ID.
 */
export const getTemplateMetadata = (templateId?: string): TemplateRegistryItem => {
  if (templateId && TEMPLATE_REGISTRY[templateId]) {
    return TEMPLATE_REGISTRY[templateId];
  }
  return TEMPLATE_REGISTRY['modern'];
};

/**
 * Returns list of primary templates, ensuring the 4 core models (Modern, ATS, Minimal, Creative) are prominent.
 */
export const getPrimaryTemplates = (): TemplateRegistryItem[] => {
  return [
    TEMPLATE_REGISTRY['modern'],
    TEMPLATE_REGISTRY['ats'],
    TEMPLATE_REGISTRY['minimal'],
    TEMPLATE_REGISTRY['creative'],
  ];
};

/**
 * Returns all unique registered templates.
 */
export const getAllTemplates = (): TemplateRegistryItem[] => {
  // Deduplicate aliases like modern-sidebar and ats-classic
  const seenIds = new Set<string>();
  const list: TemplateRegistryItem[] = [];

  for (const item of Object.values(TEMPLATE_REGISTRY)) {
    if (!seenIds.has(item.name)) {
      seenIds.add(item.name);
      list.push(item);
    }
  }

  return list;
};
