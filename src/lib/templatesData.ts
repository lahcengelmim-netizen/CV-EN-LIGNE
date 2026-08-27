import { TemplateId, CVData } from '../types';

export interface TemplateCategory {
  id: string;
  name: string;
  shortName: string;
  count: number;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeType: 'popular' | 'ats' | 'clean' | 'executive' | 'creative' | 'tech';
  categories: string[];
  style: string;
  typography: string;
  recommendedFor: string;
  recommendedRoles: string[];
  defaultColor: string;
  atsScore: number;
  layoutType: '2-columns' | 'single-column' | 'header-banner' | 'modern-cards';
  highlights: string[];
  sampleCV: CVData;
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: 'all', name: 'Tous les modèles', shortName: 'Tous', count: 10 },
  { id: 'modern', name: 'Moderne', shortName: 'Modern', count: 4 },
  { id: 'minimal', name: 'Minimaliste', shortName: 'Minimal', count: 3 },
  { id: 'professional', name: 'Professionnel & Finance', shortName: 'Professional', count: 3 },
  { id: 'executive', name: 'Cadres & Direction', shortName: 'Executive', count: 2 },
  { id: 'creative', name: 'Créatif & Marketing', shortName: 'Creative', count: 3 },
  { id: 'tech', name: 'Tech & Développeurs', shortName: 'Tech', count: 3 },
  { id: 'student', name: 'Étudiants & Débutants', shortName: 'Student', count: 3 },
  { id: 'ats', name: 'ATS Optimisé', shortName: 'ATS Friendly', count: 4 }
];

export const TEMPLATES_CATALOG: TemplateDefinition[] = [
  {
    id: 'modern',
    name: '01. Moderne',
    title: 'Moderne Pro',
    subtitle: 'Design contemporain et équilibré avec barre latérale contrastée',
    badge: 'Le plus populaire',
    badgeType: 'popular',
    categories: ['all', 'modern', 'tech', 'creative', 'student'],
    style: 'Bicolore asymétrique moderne avec barre latérale dédiée',
    typography: 'Sans-serif moderne et lisible (Plus Jakarta Sans)',
    recommendedFor: 'Profils polyvalents, marketing, commerce, tech, gestion et jeunes professionnels',
    recommendedRoles: ['Chef de Projet Digital', 'Responsable Marketing', 'Développeur Full Stack', 'Consultant', 'Business Developer'],
    defaultColor: '#2563eb',
    atsScore: 99,
    layoutType: '2-columns',
    highlights: [
      'Barre latérale dédiée aux coordonnées, compétences et langues',
      'Hiérarchie visuelle claire et structurée pour les recruteurs',
      'Optimisation de l’espace pour tenir facilement sur 1 page A4',
      'Conforme aux standards de lecture rapide en 6 secondes'
    ],
    sampleCV: {
      id: 'sample_modern',
      title: 'CV Développeur Full Stack (Exemple)',
      templateId: 'modern',
      isPaid: true,
      language: 'fr',
      personalInfo: {
        firstName: 'Alexandre',
        lastName: 'Dubois',
        title: 'Chef de Projet Digital & Web',
        email: 'alexandre.dubois@email.com',
        phone: '+33 6 45 78 92 10',
        city: 'Paris',
        country: 'France',
        linkedin: 'linkedin.com/in/alexandre-dubois',
        website: 'alexandredubois.pro',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      },
      summary: 'Chef de projet expérimenté avec 5 ans de pratique dans le déploiement de produits web et e-commerce. Spécialisé en coordination Agile, UX et pilotage d\'équipes pluridisciplinaires.',
      experiences: [
        {
          id: 'exp_1',
          position: 'Lead Chef de Projet Digital',
          company: 'Agence Horizon Numérique',
          city: 'Paris',
          startDate: '2022',
          endDate: '',
          current: true,
          description: 'Direction opérationnelle des refontes web stratégiques pour 12 clients grands comptes.',
          tasks: [
            'Pilotage des sprints Scrum, respect strict des délais et augmentation de 25% du taux de livraison',
            'Coordination de 8 développeurs et designers avec gestion budgétaire de 450 k€'
          ]
        },
        {
          id: 'exp_2',
          position: 'Product Owner Junior',
          company: 'Nexus Solutions',
          city: 'Lyon',
          startDate: '2020',
          endDate: '2022',
          current: false,
          description: 'Définition des user stories et suivi du backlog pour une application SaaS B2B.',
          tasks: [
            'Rédaction de 150+ spécifications fonctionnelles et tests d\'acceptation utilisateurs',
            'Amélioration du score de satisfaction utilisateur (NPS) de 42 à 68 en 18 mois'
          ]
        }
      ],
      educations: [
        {
          id: 'edu_1',
          degree: 'Master Management de Projets Digitaux',
          institution: 'Université Paris Dauphine',
          city: 'Paris',
          startDate: '2018',
          endDate: '2020',
          current: false
        }
      ],
      skills: [
        { id: 'sk_1', name: 'Gestion de Projet Agile & Scrum', level: 5 },
        { id: 'sk_2', name: 'Jira, Confluence & Notion', level: 5 },
        { id: 'sk_3', name: 'UI/UX & Prototypage Figma', level: 4 },
        { id: 'sk_4', name: 'Analyse de Données & KPI', level: 4 }
      ],
      languages: [
        { id: 'lang_1', language: 'Français', level: 'Langue maternelle' },
        { id: 'lang_2', language: 'Anglais', level: 'Courant professionnel (C1)' }
      ],
      certifications: [
        { id: 'cert_1', title: 'Certification Professional Scrum Master (PSM I)', organization: 'Scrum.org', date: '2021' }
      ],
      projects: [
        {
          id: 'proj_1',
          title: 'Refonte Plateforme E-commerce B2B',
          role: 'Chef de Projet',
          description: 'Migration complète vers une architecture headless avec hausse de conversion de 32%.'
        }
      ],
      theme: {
        primaryColor: '#2563eb',
        fontFamily: 'sans',
        spacing: 'normal',
        showPhoto: true
      }
    }
  },

  {
    id: 'minimal',
    name: '02. Minimal',
    title: 'Minimaliste Scandinave',
    subtitle: 'Lignes épurées, typographie soignée et respiration visuelle maximale',
    badge: 'Design Épuré',
    badgeType: 'clean',
    categories: ['all', 'minimal', 'tech', 'ats'],
    style: 'Filets typographiques fins, disposition aérée et contrastes délicats',
    typography: 'Sans-serif ultra-propre & accents monospaces',
    recommendedFor: 'Architectes, Développeurs, Designers, Consultants et profils appréciant la sobriété',
    recommendedRoles: ['Architecte Logiciel', 'Designer UI/UX', 'Rédacteur Technique', 'Consultant Stratégie'],
    defaultColor: '#334155',
    atsScore: 99,
    layoutType: 'single-column',
    highlights: [
      'Générosité des espaces blancs pour une lisibilité sans effort',
      'Typographie soignée avec filets de séparation discrets',
      'Parfait pour les candidatures internationales (Europe, USA, Canada)',
      'Compatible 100% avec tous les parseurs ATS'
    ],
    sampleCV: {
      id: 'sample_minimal',
      title: 'CV Consultant Stratégie (Exemple)',
      templateId: 'minimal',
      isPaid: true,
      language: 'fr',
      personalInfo: {
        firstName: 'Éléonore',
        lastName: 'Vasseur',
        title: 'Consultante Stratégie & Organisation',
        email: 'eleonore.vasseur@conseil.fr',
        phone: '+33 6 88 12 34 56',
        city: 'Genève',
        country: 'Suisse',
        linkedin: 'linkedin.com/in/eleonore-vasseur'
      },
      summary: 'Consultante senior avec 6 ans d\'expérience dans l\'accompagnement des comités de direction sur les plans de transformation opérationnelle et l\'optimisation de performance.',
      experiences: [
        {
          id: 'exp_min_1',
          position: 'Consultante Senior Organisation',
          company: 'Alpine Advisory Group',
          city: 'Genève',
          startDate: '2021',
          endDate: '',
          current: true,
          description: 'Direction de missions de restructuration pour des banques privées et groupes industriels.',
          tasks: [
            'Audit organisationnel complet et identification de 1,2 M€ de synergies annuelles',
            'Animation de 40+ ateliers de co-construction avec les directeurs généraux'
          ]
        },
        {
          id: 'exp_min_2',
          position: 'Analyste Opérations & Stratégie',
          company: 'KPMG Advisory',
          city: 'Paris',
          startDate: '2018',
          endDate: '2021',
          current: false,
          description: 'Modélisation financière et conduite du changement sur des programmes de fusion-acquisition.',
          tasks: [
            'Élaboration de business plans stratégiques et cartographie des processus métiers'
          ]
        }
      ],
      educations: [
        {
          id: 'edu_min_1',
          degree: 'MSc International Business & Strategy',
          institution: 'HEC Paris',
          city: 'Paris',
          startDate: '2016',
          endDate: '2018',
          current: false
        }
      ],
      skills: [
        { id: 'sk_min_1', name: 'Transformation Opérationnelle' },
        { id: 'sk_min_2', name: 'Audit & Diagnostic Stratégique' },
        { id: 'sk_min_3', name: 'Modélisation Financière' },
        { id: 'sk_min_4', name: 'Conduite du Changement' }
      ],
      languages: [
        { id: 'lang_min_1', language: 'Français', level: 'Maternelle' },
        { id: 'lang_min_2', language: 'Anglais', level: 'Bilingue (C2)' },
        { id: 'lang_min_3', language: 'Allemand', level: 'Intermédiaire (B2)' }
      ],
      certifications: [
        { id: 'cert_min_1', title: 'Lean Six Sigma Green Belt', organization: 'IIBLC', date: '2020' }
      ],
      projects: [],
      theme: {
        primaryColor: '#1e293b',
        fontFamily: 'sans',
        spacing: 'spacious',
        showPhoto: false
      }
    }
  },

  {
    id: 'professional',
    name: '03. Professional',
    title: 'Professionnel Corporate',
    subtitle: 'Design sérieux et structuré pour la finance, l’administration et la gestion',
    badge: 'Banque & Droit',
    badgeType: 'clean',
    categories: ['all', 'professional', 'ats'],
    style: 'En-tête classique haut de gamme avec séparateurs et hiérarchie rigoureuse',
    typography: 'Serif & Sans harmonieux',
    recommendedFor: 'Finance, Banque, Juridique, Administration, Contrôle de Gestion et Audit',
    recommendedRoles: ['Responsable Administratif et Financier', 'Juriste d\'Entreprise', 'Contrôleur de Gestion', 'Avocat', 'Expert-Comptable'],
    defaultColor: '#0f766e',
    atsScore: 98,
    layoutType: 'header-banner',
    highlights: [
      'Structure formelle hautement respectée par les cabinets de recrutement',
      'Section profil statutaire et équilibre parfait des sections',
      'Mise en valeur des résultats chiffrés et des certifications d\'État',
      'Rendu impeccable pour les dossiers de direction générale'
    ],
    sampleCV: {
      id: 'sample_prof',
      title: 'CV Responsable Financier (Exemple)',
      templateId: 'professional',
      isPaid: true,
      language: 'fr',
      personalInfo: {
        firstName: 'Marc-Antoine',
        lastName: 'Rousseau',
        title: 'Responsable Administratif & Financier (RAF)',
        email: 'ma.rousseau@finance-pro.fr',
        phone: '+33 6 12 90 45 78',
        city: 'Bordeaux',
        country: 'France',
        linkedin: 'linkedin.com/in/marcantoine-rousseau',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
      },
      summary: 'Responsable Administratif et Financier avec 10 ans d\'expérience dans le pilotage de la performance financière, la clôture des comptes et le contrôle budgétaire de PME et ETI en forte croissance.',
      experiences: [
        {
          id: 'exp_p1',
          position: 'Responsable Administratif & Financier',
          company: 'Groupe Aquitaine Industrie (CA 28M€)',
          city: 'Bordeaux',
          startDate: '2020',
          endDate: '',
          current: true,
          description: 'Supervision de la comptabilité générale, du contrôle de gestion et des relations bancaires.',
          tasks: [
            'Optimisation du BFR générant 400 k€ de trésorerie disponible dès la première année',
            'Mise en place d\'un tableau de bord de trésorerie prévisionnelle hebdomadaire et mensuelle'
          ]
        },
        {
          id: 'exp_p2',
          position: 'Contrôleur de Gestion Senior',
          company: 'Vignobles & Domaines Réunis',
          city: 'Bordeaux',
          startDate: '2016',
          endDate: '2020',
          current: false,
          description: 'Élaboration des budgets annuels et analyse des écarts de production et de distribution.',
          tasks: [
            'Refonte du calcul des prix de revient ayant permis d\'améliorer la marge brute de 3,4 points'
          ]
        }
      ],
      educations: [
        {
          id: 'edu_p1',
          degree: 'Diplôme Supérieur de Comptabilité et de Gestion (DSCG)',
          institution: 'IAE Bordeaux',
          city: 'Bordeaux',
          startDate: '2014',
          endDate: '2016',
          current: false
        }
      ],
      skills: [
        { id: 'sk_p1', name: 'Contrôle Budgétaire & Reporting', level: 5 },
        { id: 'sk_p2', name: 'Normes IFRS & Fiscalité Française', level: 5 },
        { id: 'sk_p3', name: 'ERP SAP & Sage 1000', level: 5 },
        { id: 'sk_p4', name: 'Management d\'Équipe Comptable', level: 4 }
      ],
      languages: [
        { id: 'lang_p1', language: 'Français', level: 'Langue maternelle' },
        { id: 'lang_p2', language: 'Anglais', level: 'Professionnel (C1)' }
      ],
      certifications: [
        { id: 'cert_p1', title: 'Certification DSCG', organization: 'Ministère de l\'Enseignement Supérieur', date: '2016' }
      ],
      projects: [],
      theme: {
        primaryColor: '#0f766e',
        fontFamily: 'sans',
        spacing: 'normal',
        showPhoto: true
      }
    }
  },

  {
    id: 'executive',
    name: '04. Executive',
    title: 'Exécutif & Direction',
    subtitle: 'Design premium statutaire conçu pour les cadres dirigeants et profils C-Level',
    badge: 'Cadres & Dirigeants',
    badgeType: 'executive',
    categories: ['all', 'executive', 'professional'],
    style: 'Bandeau supérieur statutaire foncé avec touches d\'or et vision stratégique',
    typography: 'Sans-serif haute hiérarchie & lisibilité instantanée',
    recommendedFor: 'Directeurs Généraux, DRH, CTO, CFO, Directeurs Commerciaux et Membres de Comité de Direction',
    recommendedRoles: ['Directeur Général (CEO)', 'Directeur des Ressources Humaines (DRH)', 'Directeur Technique (CTO)', 'Directeur Commercial'],
    defaultColor: '#0f172a',
    atsScore: 97,
    layoutType: 'header-banner',
    highlights: [
      'Section dédiée à la vision stratégique et aux accomplissements majeurs',
      'Matrice de compétences managériales et gouvernance',
      'Typographie imposante qui inspire confiance et autorité professionnelle',
      'Conçu pour capter l\'attention des chasseurs de têtes et conseils d\'administration'
    ],
    sampleCV: {
      id: 'sample_exec',
      title: 'CV Directeur des Opérations (Exemple)',
      templateId: 'executive',
      isPaid: true,
      language: 'fr',
      personalInfo: {
        firstName: 'Jean-Christophe',
        lastName: 'Laurent',
        title: 'Directeur Général Adjoint / Directeur des Opérations (COO)',
        email: 'jc.laurent@executive-search.com',
        phone: '+33 6 01 23 45 67',
        city: 'Paris',
        country: 'France',
        linkedin: 'linkedin.com/in/jc-laurent-coo',
        photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'
      },
      summary: 'Dirigeant d\'entreprise avec 15 ans de succès dans le pilotage opérationnel d\'organisations complexes (500+ collaborateurs). Expert en accélération de croissance, conduite du changement et rentabilité durable.',
      experiences: [
        {
          id: 'exp_e1',
          position: 'Directeur des Opérations Groupe',
          company: 'Omnia Logistics & Supply (CA 120M€)',
          city: 'Paris / International',
          startDate: '2019',
          endDate: '',
          current: true,
          description: 'Direction globale de 4 filiales européennes et 650 collaborateurs.',
          tasks: [
            'Augmentation de l\'EBITDA de +4,8 points en 3 ans grâce à la digitalisation des flux logistiques',
            'Restructuration des achats stratégiques générant 3,5 M€ d\'économies pérennes'
          ]
        },
        {
          id: 'exp_e2',
          position: 'Directeur de Division Industrielle',
          company: 'Snecma Valo Group',
          city: 'Lyon',
          startDate: '2013',
          endDate: '2019',
          current: false,
          description: 'Gestion d\'un centre de profit de 45 M€ de chiffre d\'affaires.',
          tasks: [
            'Déploiement du programme d\'excellence opérationnelle et gain de productivité de 18%'
          ]
        }
      ],
      educations: [
        {
          id: 'edu_e1',
          degree: 'Executive MBA',
          institution: 'INSEAD',
          city: 'Fontainebleau',
          startDate: '2011',
          endDate: '2012',
          current: false
        },
        {
          id: 'edu_e2',
          degree: 'Diplôme d\'Ingénieur des Mines',
          institution: 'Mines ParisTech',
          city: 'Paris',
          startDate: '2004',
          endDate: '2007',
          current: false
        }
      ],
      skills: [
        { id: 'sk_e1', name: 'Gouvernance & Vision Stratégique', level: 5 },
        { id: 'sk_e2', name: 'Pilotage P&L & Restructuration', level: 5 },
        { id: 'sk_e3', name: 'Transformation Digitale & Lean', level: 5 },
        { id: 'sk_e4', name: 'Négociation Grand Compte & M&A', level: 4 }
      ],
      languages: [
        { id: 'lang_e1', language: 'Français', level: 'Langue maternelle' },
        { id: 'lang_e2', language: 'Anglais', level: 'Bilingue / Fluent C2' },
        { id: 'lang_e3', language: 'Espagnol', level: 'Professionnel B2' }
      ],
      certifications: [
        { id: 'cert_e1', title: 'Certificat d\'Administrateur de Sociétés (IFA)', organization: 'Sciences Po / IFA', date: '2022' }
      ],
      projects: [],
      theme: {
        primaryColor: '#0f172a',
        fontFamily: 'sans',
        spacing: 'normal',
        showPhoto: true
      }
    }
  },

  {
    id: 'creative',
    name: '05. Creative',
    title: 'Créatif & Dynamique',
    subtitle: 'Design visuel et chaleureux pour le marketing, la communication et le design',
    badge: 'Design & Médias',
    badgeType: 'creative',
    categories: ['all', 'creative', 'modern'],
    style: 'Cartes douces, badges colorés et mise en page vivante',
    typography: 'Sans-serif dynamique et moderne',
    recommendedFor: 'Designers, Responsables Communication, Community Managers, Directeurs Artistiques et Créateurs de Contenu',
    recommendedRoles: ['Directeur Artistique', 'Content Manager', 'Brand Manager', 'Graphiste Senior', 'Social Media Manager'],
    defaultColor: '#9333ea',
    atsScore: 96,
    layoutType: 'modern-cards',
    highlights: [
      'Blocs en cartes douces qui captent immédiatement le regard',
      'Badges d\'expertise valorisants pour les logiciels créatifs',
      'Idéal pour montrer sa sensibilité visuelle sans surcharger la mise en page',
      'Rendu superbe sur écran et à l\'impression'
    ],
    sampleCV: {
      id: 'sample_creat',
      title: 'CV Directrice Artistique (Exemple)',
      templateId: 'creative',
      isPaid: true,
      language: 'fr',
      personalInfo: {
        firstName: 'Camille',
        lastName: 'Moreau',
        title: 'Directrice Artistique & Brand Designer',
        email: 'camille.moreau.design@gmail.com',
        phone: '+33 6 77 88 99 00',
        city: 'Nantes',
        country: 'France',
        website: 'camillemoreau.design',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
      },
      summary: 'Directrice artistique passionnée avec 7 ans d\'expertise en identité de marque, direction de shooting et design packaging. Créatrice d\'univers visuels mémorables pour des marques lifestyle et cosmétiques.',
      experiences: [
        {
          id: 'exp_c1',
          position: 'Directrice Artistique Senior',
          company: 'Studio Bloom Paris',
          city: 'Paris / Remote',
          startDate: '2021',
          endDate: '',
          current: true,
          description: 'Conception des identités globales de marques éco-responsables.',
          tasks: [
            'Refonte du branding de 15 marques avec augmentation moyenne de 40% de l\'engagement sur les réseaux',
            'Direction des équipes graphiques et supervision des prestataires 3D et vidéo'
          ]
        },
        {
          id: 'exp_c2',
          position: 'Graphiste & Brand Designer',
          company: 'Agence Pixel & Co',
          city: 'Nantes',
          startDate: '2018',
          endDate: '2021',
          current: false,
          description: 'Création de chartes graphiques, packagings et campagnes print & digital.',
          tasks: [
            'Création de 50+ déclinaisons publicitaires pour les lancements saisonniers'
          ]
        }
      ],
      educations: [
        {
          id: 'edu_c1',
          degree: 'Master Direction Artistique & Communication Visuelle',
          institution: 'École de Design Nantes Atlantique',
          city: 'Nantes',
          startDate: '2016',
          endDate: '2018',
          current: false
        }
      ],
      skills: [
        { id: 'sk_c1', name: 'Branding & Identité Visuelle', level: 5 },
        { id: 'sk_c2', name: 'Adobe Creative Suite (Ps, Ai, Id)', level: 5 },
        { id: 'sk_c3', name: 'Figma & Prototypage UI', level: 4 },
        { id: 'sk_c4', name: 'Direction Photo & Vidéo', level: 4 }
      ],
      languages: [
        { id: 'lang_c1', language: 'Français', level: 'Maternelle' },
        { id: 'lang_c2', language: 'Anglais', level: 'Professionnel (C1)' }
      ],
      certifications: [],
      projects: [
        {
          id: 'proj_c1',
          title: 'Campagne Green Botanicals',
          role: 'Lead DA',
          description: 'Identité complète récompensée aux Design Awards 2023.'
        }
      ],
      theme: {
        primaryColor: '#9333ea',
        fontFamily: 'sans',
        spacing: 'normal',
        showPhoto: true
      }
    }
  },

  {
    id: 'tech',
    name: '06. Tech',
    title: 'Tech & Ingénieur',
    subtitle: 'Style moderne et structuré pour développeurs, data scientists et IT',
    badge: 'Développeurs & IT',
    badgeType: 'tech',
    categories: ['all', 'tech', 'modern', 'ats'],
    style: 'En-tête tech contemporain avec badges technologiques et métriques de code',
    typography: 'Monospace épuré & Sans-serif lisible',
    recommendedFor: 'Développeurs Full Stack, Ingénieurs Data, DevOps, Administrateurs Systèmes et Architectes Cloud',
    recommendedRoles: ['Développeur React/Node.js', 'Ingénieur Data / AI', 'DevOps / SRE', 'Lead Tech', 'Ingénieur Cyber-Sécurité'],
    defaultColor: '#0284c7',
    atsScore: 99,
    layoutType: '2-columns',
    highlights: [
      'Affichage optimisé de la stack technique (Frontend, Backend, Cloud, Outils)',
      'Valorisation des projets GitHub et réalisations concrètes en production',
      'Format très apprécié par les CTOs et recruteurs techniques',
      'Score de lisibilité ATS maximal'
    ],
    sampleCV: {
      id: 'sample_tech',
      title: 'CV Développeur Full Stack (Exemple)',
      templateId: 'tech',
      isPaid: true,
      language: 'fr',
      personalInfo: {
        firstName: 'Lucas',
        lastName: 'Bernard',
        title: 'Lead Développeur Full Stack (React / Node / AWS)',
        email: 'lucas.bernard.dev@gmail.com',
        phone: '+33 6 54 32 10 98',
        city: 'Toulouse',
        country: 'France',
        github: 'github.com/lucas-dev-pro',
        linkedin: 'linkedin.com/in/lucas-bernard-tech',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80'
      },
      summary: 'Ingénieur logiciel avec 6 ans d\'expérience dans le développement d\'applications web scalables et à forte volumétrie. Expert en architectures microservices, TypeScript, Next.js et cloud computing.',
      experiences: [
        {
          id: 'exp_t1',
          position: 'Senior Software Engineer / Tech Lead',
          company: 'CloudScale Technologies',
          city: 'Toulouse / Remote',
          startDate: '2021',
          endDate: '',
          current: true,
          description: 'Architecture et delivery de la nouvelle plateforme de paiement et facturation.',
          tasks: [
            'Migration vers microservices NestJS + Kafka traitant 4 millions de requêtes quotidiennes',
            'Réduction du temps de build CI/CD de 18 min à 4 min via Docker et GitHub Actions'
          ]
        },
        {
          id: 'exp_t2',
          position: 'Développeur React / Node.js',
          company: 'SaaS Factory',
          city: 'Bordeaux',
          startDate: '2018',
          endDate: '2021',
          current: false,
          description: 'Développement de fonctionnalités critiques sur une application de gestion RH.',
          tasks: [
            'Développement d\'une bibliothèque de composants React réutilisable avec 98% de couverture de tests'
          ]
        }
      ],
      educations: [
        {
          id: 'edu_t1',
          degree: 'Diplôme d\'Ingénieur en Informatique',
          institution: 'ENSEEIHT Toulouse',
          city: 'Toulouse',
          startDate: '2015',
          endDate: '2018',
          current: false
        }
      ],
      skills: [
        { id: 'sk_t1', name: 'TypeScript & JavaScript ESNext', level: 5 },
        { id: 'sk_t2', name: 'React, Next.js, TailwindCSS', level: 5 },
        { id: 'sk_t3', name: 'Node.js, NestJS, Express', level: 5 },
        { id: 'sk_t4', name: 'PostgreSQL, Redis, MongoDB', level: 4 },
        { id: 'sk_t5', name: 'Docker, Kubernetes, AWS', level: 4 }
      ],
      languages: [
        { id: 'lang_t1', language: 'Français', level: 'Maternelle' },
        { id: 'lang_t2', language: 'Anglais', level: 'Courant Technique (C1)' }
      ],
      certifications: [
        { id: 'cert_t1', title: 'AWS Certified Solutions Architect – Associate', organization: 'Amazon Web Services', date: '2022' }
      ],
      projects: [
        {
          id: 'proj_t1',
          title: 'Open Source CLI Tool',
          role: 'Créateur',
          description: 'Outil de génération de boilerplate TypeScript avec 1 500+ étoiles sur GitHub.'
        }
      ],
      theme: {
        primaryColor: '#0284c7',
        fontFamily: 'mono',
        spacing: 'compact',
        showPhoto: true
      }
    }
  },

  {
    id: 'student',
    name: '07. Student / First Job',
    title: 'Étudiant & Premier Emploi',
    subtitle: 'Met en avant les formations, projets académiques et compétences clés',
    badge: 'Jeunes Diplômés',
    badgeType: 'popular',
    categories: ['all', 'student', 'modern'],
    style: 'Sections aérées valorisant le potentiel, les études et les premiers stages',
    typography: 'Sans-serif moderne et engageant',
    recommendedFor: 'Étudiants en quête de stage, alternants, jeunes diplômés et personnes en reconversion',
    recommendedRoles: ['Stagiaire Marketing', 'Alternant RH', 'Développeur Junior', 'Assistant Chef de Projet', 'Commercial Junior'],
    defaultColor: '#4f46e5',
    atsScore: 99,
    layoutType: '2-columns',
    highlights: [
      'Formation et projets d\'études placés au premier plan pour compenser le manque d\'expérience longue',
      'Structure valorisante pour les stages, projets tuteurés et activités associatives',
      'Formulations claires qui démontrent la motivation et l\'envie d\'apprendre',
      'Format idéal pour décrocher son premier CDI, stage ou alternance'
    ],
    sampleCV: {
      id: 'sample_stud',
      title: 'CV Étudiant en Alternance (Exemple)',
      templateId: 'student',
      isPaid: true,
      language: 'fr',
      personalInfo: {
        firstName: 'Théo',
        lastName: 'Garnier',
        title: 'Étudiant en Master Marketing • Recherche Alternance 12 mois',
        email: 'theo.garnier.etu@email.com',
        phone: '+33 6 99 00 11 22',
        city: 'Lyon',
        country: 'France',
        linkedin: 'linkedin.com/in/theo-garnier',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80'
      },
      summary: 'Étudiant rigoureux et motivé en Master 1 Marketing Digital, à la recherche d\'un contrat d\'apprentissage d\'un an (rythme 3j entreprise / 2j école). Prêt à m\'investir pleinement dans le développement de vos campagnes.',
      experiences: [
        {
          id: 'exp_s1',
          position: 'Assistant Chef de Produit (Stage 6 mois)',
          company: 'L\'Atelier Bio & Gourmand',
          city: 'Lyon',
          startDate: '02/2023',
          endDate: '07/2023',
          current: false,
          description: 'Participation au lancement d\'une nouvelle gamme de produits.',
          tasks: [
            'Veille concurrentielle et analyse des tendances de consommation sur le marché bio',
            'Création de supports commerciaux pour la force de vente et newsletters B2C'
          ]
        }
      ],
      educations: [
        {
          id: 'edu_s1',
          degree: 'Master 1 Marketing & Communication Digitale',
          institution: 'IAE Lyon School of Management',
          city: 'Lyon',
          startDate: '2023',
          endDate: '2024',
          current: true
        },
        {
          id: 'edu_s2',
          degree: 'Licence Économie & Gestion (Mention Bien)',
          institution: 'Université Jean Moulin Lyon 3',
          city: 'Lyon',
          startDate: '2020',
          endDate: '2023',
          current: false
        }
      ],
      skills: [
        { id: 'sk_s1', name: 'Gestion des Réseaux Sociaux & Meta Ads', level: 4 },
        { id: 'sk_s2', name: 'Google Analytics 4 & SEO', level: 4 },
        { id: 'sk_s3', name: 'Canva & Suite Adobe (Ps, Ai)', level: 4 },
        { id: 'sk_s4', name: 'Pack Office & Excel avancé', level: 5 }
      ],
      languages: [
        { id: 'lang_s1', language: 'Français', level: 'Langue maternelle' },
        { id: 'lang_s2', language: 'Anglais', level: 'Avancé (B2 - Score TOEIC 850)' },
        { id: 'lang_s3', language: 'Espagnol', level: 'Intermédiaire (B1)' }
      ],
      certifications: [
        { id: 'cert_s1', title: 'Certification Google Digital Marketing', organization: 'Google', date: '2023' }
      ],
      projects: [
        {
          id: 'proj_s1',
          title: 'Challenge Entrepreneuriat Étudiant',
          role: 'Chef d\'équipe (4 étudiants)',
          description: 'Conception d\'un business plan complet pour une application anti-gaspillage alimentaire (Prix de l\'Innovation).'
        }
      ],
      theme: {
        primaryColor: '#4f46e5',
        fontFamily: 'sans',
        spacing: 'normal',
        showPhoto: true
      }
    }
  },

  {
    id: 'ats',
    name: '08. ATS Friendly',
    title: 'ATS Optimisé & Lisibilité',
    subtitle: 'Structure linéaire 100% calibrée pour passer les filtres des logiciels de recrutement',
    badge: '100% Scan ATS',
    badgeType: 'ats',
    categories: ['all', 'ats', 'professional'],
    style: 'Mise en page 100% linéaire standard avec balises sémantiques universelles',
    typography: 'Typographie standard ultra-compatible (Arial / Sans)',
    recommendedFor: 'Candidatures dans les grandes entreprises, banques, cabinets de conseil et multinationales avec système ATS',
    recommendedRoles: ['Tous métiers pour grandes entreprises', 'Ingénieur Système', 'Comptable', 'Gestionnaire RH', 'Analyste Risques'],
    defaultColor: '#000000',
    atsScore: 100,
    layoutType: 'single-column',
    highlights: [
      'Score de conformité ATS de 100% (Taleo, Workday, BambooHR, Lever, Greenhouse)',
      'Aucun tableau ou élément flottant pouvant induire en erreur les robots de tri',
      'Format de dates et de titres standardisé selon les normes internationales',
      'Garantit que 100% de votre texte est correctement extrait par les recruteurs'
    ],
    sampleCV: {
      id: 'sample_ats',
      title: 'CV Ingénieur Qualité (Exemple ATS)',
      templateId: 'ats',
      isPaid: true,
      language: 'fr',
      personalInfo: {
        firstName: 'Antoine',
        lastName: 'Mercier',
        title: 'Ingénieur Qualité & Méthodes Industrielles',
        email: 'antoine.mercier.qualite@email.com',
        phone: '+33 6 44 55 66 77',
        city: 'Clermont-Ferrand',
        country: 'France',
        linkedin: 'linkedin.com/in/antoine-mercier-qualite'
      },
      summary: 'Ingénieur Qualité certifié avec 8 ans d\'expérience dans l\'industrie automobile et aéronautique. Spécialisé dans le déploiement des normes ISO 9001 et IATF 16949, la résolution de problèmes 8D et l\'amélioration continue.',
      experiences: [
        {
          id: 'exp_a1',
          position: 'Responsable Assurance Qualité Fournisseurs',
          company: 'Michelin Groupe',
          city: 'Clermont-Ferrand',
          startDate: '01/2020',
          endDate: '',
          current: true,
          description: 'Gestion du panel de 35 fournisseurs stratégiques pour l\'Europe.',
          tasks: [
            'Audit des processus fournisseurs et réduction des taux de non-conformité de 28%',
            'Animation des chantiers QRQC et déploiement de plans d\'actions correctives'
          ]
        },
        {
          id: 'exp_a2',
          position: 'Ingénieur Qualité Process',
          company: 'Valeo Systèmes Thermiques',
          city: 'Issoire',
          startDate: '09/2016',
          endDate: '12/2019',
          current: false,
          description: 'Suivi de la qualité des lignes d\'assemblage automatisées.',
          tasks: [
            'Diminution des rebuts de fabrication de 1,8% à 0,6% en 24 mois grâce au Six Sigma'
          ]
        }
      ],
      educations: [
        {
          id: 'edu_a1',
          degree: 'Diplôme d\'Ingénieur Génie Industriel',
          institution: 'SIGMA Clermont',
          city: 'Clermont-Ferrand',
          startDate: '2013',
          endDate: '2016',
          current: false
        }
      ],
      skills: [
        { id: 'sk_a1', name: 'Normes ISO 9001 / IATF 16949' },
        { id: 'sk_a2', name: 'Méthodologies 8D, AMDEC, Ishikawa, 5 Pourquoi' },
        { id: 'sk_a3', name: 'Statistiques de Process (SPC / MSP)' },
        { id: 'sk_a4', name: 'Audit Processus VDA 6.3' }
      ],
      languages: [
        { id: 'lang_a1', language: 'Français', level: 'Maternelle' },
        { id: 'lang_a2', language: 'Anglais', level: 'Courant professionnel (C1)' },
        { id: 'lang_a3', language: 'Allemand', level: 'Intermédiaire technique (B1)' }
      ],
      certifications: [
        { id: 'cert_a1', title: 'Auditeur Certifié IATF 16949', organization: 'AFNOR Certification', date: '2021' }
      ],
      projects: [],
      theme: {
        primaryColor: '#000000',
        fontFamily: 'sans',
        spacing: 'normal',
        showPhoto: false
      }
    }
  },

  {
    id: 'elegant',
    name: '09. Elegant',
    title: 'Élégant & Raffiné',
    subtitle: 'Typographie noble et équilibre soigné pour le luxe, l’hôtellerie et le conseil',
    badge: 'Luxe & Conseil',
    badgeType: 'executive',
    categories: ['all', 'professional', 'creative'],
    style: 'Mise en page centrée raffinée avec typographie serif et ornements subtils',
    typography: 'Serif noble de haute qualité',
    recommendedFor: 'Luxe, Mode, Hôtellerie de Prestige, Immobilier Haut de Gamme, Conseil et Métiers d\'Art',
    recommendedRoles: ['Directeur d\'Hôtel 5*', 'Responsable Boutique Luxe', 'Courtier Immobilier Prestige', 'Consultant Patrimoine'],
    defaultColor: '#1e293b',
    atsScore: 97,
    layoutType: 'header-banner',
    highlights: [
      'Esthétique haute couture inspirée des plus grandes maisons',
      'Typographie serif délicate conférant une distinction immédiate',
      'Format idéal pour les candidatures de prestige et de représentation',
      'Équilibre parfait entre tradition et modernité éditoriale'
    ],
    sampleCV: {
      id: 'sample_eleg',
      title: 'CV Responsable Boutique Luxe (Exemple)',
      templateId: 'elegant',
      isPaid: true,
      language: 'fr',
      personalInfo: {
        firstName: 'Margaux',
        lastName: 'de Saint-Germain',
        title: 'Responsable Boutique & Expérience Client Haute Joaillerie',
        email: 'margaux.saintgermain@prestige-mail.fr',
        phone: '+33 6 61 72 83 94',
        city: 'Paris (Place Vendôme)',
        country: 'France',
        linkedin: 'linkedin.com/in/margaux-saint-germain',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
      },
      summary: 'Professionnelle passionnée du luxe avec 9 ans d\'expérience dans la gestion de boutiques de prestige et le service à une clientèle internationale VIP. Spécialisée dans la haute horlogerie et la joaillerie.',
      experiences: [
        {
          id: 'exp_el1',
          position: 'Store Manager Flagship',
          company: 'Maison Joaillière Vendôme',
          city: 'Paris',
          startDate: '2020',
          endDate: '',
          current: true,
          description: 'Direction d\'une boutique de 18 collaborateurs et CA annuel de 14 M€.',
          tasks: [
            'Dépassement des objectifs de vente de +22% en 2022 et 2023',
            'Organisation de 8 événements privés exclusifs pour les clients VIP'
          ]
        },
        {
          id: 'exp_el2',
          position: 'Senior Sales Associate',
          company: 'Palais de l\'Horlogerie',
          city: 'Genève / Paris',
          startDate: '2016',
          endDate: '2020',
          current: false,
          description: 'Conseil personnalisé et fidélisation d\'une clientèle internationale.',
          tasks: [
            'Développement d\'un portefeuille de 120 clients réguliers haut de gamme'
          ]
        }
      ],
      educations: [
        {
          id: 'edu_el1',
          degree: 'MBA Luxury Brand Management',
          institution: 'Institut Supérieur du Luxe',
          city: 'Paris',
          startDate: '2014',
          endDate: '2016',
          current: false
        }
      ],
      skills: [
        { id: 'sk_el1', name: 'Service Client VIP & Conciergerie' },
        { id: 'sk_el2', name: 'Management d\'Équipe de Vente' },
        { id: 'sk_el3', name: 'Gemmologie & Histoire de l\'Horlogerie' },
        { id: 'sk_el4', name: 'Négociation Multiculturelle' }
      ],
      languages: [
        { id: 'lang_el1', language: 'Français', level: 'Langue maternelle' },
        { id: 'lang_el2', language: 'Anglais', level: 'Bilingue C2' },
        { id: 'lang_el3', language: 'Mandarin', level: 'Notions commerciales (A2)' }
      ],
      certifications: [
        { id: 'cert_el1', title: 'Diplôme de Gemmologie (FGA)', organization: 'Gemmological Association', date: '2017' }
      ],
      projects: [],
      theme: {
        primaryColor: '#1e293b',
        fontFamily: 'serif',
        spacing: 'spacious',
        showPhoto: true
      }
    }
  },

  {
    id: 'corporate',
    name: '10. Corporate',
    title: 'Corporate Multinational',
    subtitle: 'Colonne latérale structurée et densité d’information optimale pour grands groupes',
    badge: 'Grands Groupes',
    badgeType: 'clean',
    categories: ['all', 'professional', 'modern', 'ats'],
    style: 'Disposition latérale structurée avec bloc de synthèse et grille dense',
    typography: 'Sans-serif corporate précis',
    recommendedFor: 'Managers, Ingénieurs, Cadres administratifs et Consultants dans les multinationales et grands comptes',
    recommendedRoles: ['Responsable Ressources Humaines', 'Ingénieur Process', 'Directeur de Projet', 'Responsable Achats'],
    defaultColor: '#1e3a8a',
    atsScore: 98,
    layoutType: '2-columns',
    highlights: [
      'Densité d\'information optimisée pour valoriser un parcours riche sur 1 à 2 pages',
      'Colonne latérale foncée mettant en avant les compétences et certifications',
      'Format standardisé reconnu dans le monde entier (France, UK, USA, Moyen-Orient)',
      'Idéal pour postuler aux offres des entreprises du CAC 40 et Fortune 500'
    ],
    sampleCV: {
      id: 'sample_corp',
      title: 'CV Responsable RH (Exemple)',
      templateId: 'corporate',
      isPaid: true,
      language: 'fr',
      personalInfo: {
        firstName: 'Sébastien',
        lastName: 'Leroy',
        title: 'Responsable Ressources Humaines & Développement des Talents',
        email: 'sebastien.leroy.rh@corp-group.com',
        phone: '+33 6 22 33 44 55',
        city: 'Lille',
        country: 'France',
        linkedin: 'linkedin.com/in/sebastien-leroy-rh',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80'
      },
      summary: 'Responsable RH généraliste avec 8 ans d\'expérience dans le déploiement de politiques de recrutement, de gestion prévisionnelle des emplois et de dialogue social au sein d\'environnements industriels et tertiaires.',
      experiences: [
        {
          id: 'exp_cr1',
          position: 'Responsable Ressources Humaines de Site',
          company: 'Saint-Gobain Distribution',
          city: 'Lille',
          startDate: '2019',
          endDate: '',
          current: true,
          description: 'Gestion RH complète pour un périmètre de 320 salariés.',
          tasks: [
            'Pilotage de 60 recrutements annuels (cadres et non-cadres) avec un taux de rétention de 92% à 1 an',
            'Co-animation du CSE et négociation de 4 accords d\'entreprise majeurs (télétravail, QVT)'
          ]
        },
        {
          id: 'exp_cr2',
          position: 'Chargé de Développement RH',
          company: 'Decathlon International',
          city: 'Villeneuve-d\'Ascq',
          startDate: '2016',
          endDate: '2019',
          current: false,
          description: 'Déploiement du plan de développement des compétences et campus management.',
          tasks: [
            'Refonte du parcours d\'onboarding pour 400 nouveaux collaborateurs'
          ]
        }
      ],
      educations: [
        {
          id: 'edu_cr1',
          degree: 'Master 2 Gestion des Ressources Humaines',
          institution: 'IAE Lille',
          city: 'Lille',
          startDate: '2014',
          endDate: '2016',
          current: false
        }
      ],
      skills: [
        { id: 'sk_cr1', name: 'Recrutement & Marque Employeur', level: 5 },
        { id: 'sk_cr2', name: 'Relations Sociales & Droit du Travail', level: 5 },
        { id: 'sk_cr3', name: 'GPEC & Gestion des Carrières', level: 4 },
        { id: 'sk_cr4', name: 'SIRH Workday & ADP Decidium', level: 4 }
      ],
      languages: [
        { id: 'lang_cr1', language: 'Français', level: 'Langue maternelle' },
        { id: 'lang_cr2', language: 'Anglais', level: 'Professionnel (C1)' }
      ],
      certifications: [
        { id: 'cert_cr1', title: 'Certification Praticien RH', organization: 'ANDRH', date: '2020' }
      ],
      projects: [],
      theme: {
        primaryColor: '#1e3a8a',
        fontFamily: 'sans',
        spacing: 'normal',
        showPhoto: true
      }
    }
  },

  {
    id: 'classic',
    name: '11. Classic',
    title: 'Classique & Intemporel',
    subtitle: 'Structure traditionnelle et rassurante adaptée à tous les métiers',
    badge: 'Standard Universel',
    badgeType: 'clean',
    categories: ['all', 'professional', 'ats'],
    style: 'Mise en page classique avec séparation nette par rubriques',
    typography: 'Serif / Sans classique',
    recommendedFor: 'Tous profils recherchant une présentation sobre, éprouvée et sans fioritures',
    recommendedRoles: ['Tous profils', 'Administration', 'Enseignement', 'Santé', 'Fonction Publique'],
    defaultColor: '#1e293b',
    atsScore: 98,
    layoutType: 'single-column',
    highlights: [
      'Modèle universellement accepté par tous les recruteurs et administrations',
      'Lecture chronologique classique et fluide',
      'Idéal pour les concours, la fonction publique et les candidatures formelles'
    ],
    sampleCV: {
      id: 'sample_classic',
      title: 'CV Responsable Administratif (Exemple)',
      templateId: 'classic',
      isPaid: true,
      language: 'fr',
      personalInfo: {
        firstName: 'Pierre',
        lastName: 'Durand',
        title: 'Attaché d\'Administration & Gestionnaire de Projets Publics',
        email: 'pierre.durand@email.fr',
        phone: '+33 6 33 44 55 66',
        city: 'Strasbourg',
        country: 'France',
        linkedin: 'linkedin.com/in/pierre-durand-admin'
      },
      summary: 'Professionnel rigoureux de l\'administration avec 10 ans d\'expérience dans la gestion des marchés publics, la coordination administrative et le suivi des subventions européennes.',
      experiences: [
        {
          id: 'exp_cl1',
          position: 'Responsable Pôle Administratif & Financier',
          company: 'Collectivité Territoriale Grand Est',
          city: 'Strasbourg',
          startDate: '2018',
          endDate: '',
          current: true,
          description: 'Gestion des dossiers de subventions et contrôle de conformité des marchés.',
          tasks: [
            'Instruction de 120 dossiers de subventions annuels représentant un budget de 8,5 M€'
          ]
        }
      ],
      educations: [
        {
          id: 'edu_cl1',
          degree: 'Master Droit Public & Administration',
          institution: 'Université de Strasbourg',
          city: 'Strasbourg',
          startDate: '2011',
          endDate: '2013',
          current: false
        }
      ],
      skills: [
        { id: 'sk_cl1', name: 'Droit des Marchés Publics' },
        { id: 'sk_cl2', name: 'Comptabilité Publique (M14 / M57)' },
        { id: 'sk_cl3', name: 'Rédaction d\'Actes Administratifs' }
      ],
      languages: [
        { id: 'lang_cl1', language: 'Français', level: 'Langue maternelle' },
        { id: 'lang_cl2', language: 'Allemand', level: 'Courant (C1)' }
      ],
      certifications: [],
      projects: [],
      theme: {
        primaryColor: '#1e293b',
        fontFamily: 'serif',
        spacing: 'normal',
        showPhoto: false
      }
    }
  }
];

export function getTemplateById(id: TemplateId = 'modern'): TemplateDefinition {
  const found = TEMPLATES_CATALOG.find((t) => t.id === id);
  return found || TEMPLATES_CATALOG[0];
}
