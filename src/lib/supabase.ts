import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { CVData, UserProfile, CoverLetterData } from '../types';

const rawSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawSupabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

function isValidSupabaseUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  if (url.includes('your-project') || url.includes('placeholder') || url.includes('example.com')) return false;
  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && parsed.hostname.length > 3;
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = Boolean(
  isValidSupabaseUrl(rawSupabaseUrl) && 
  rawSupabaseAnonKey && 
  rawSupabaseAnonKey !== 'your-anon-key' &&
  rawSupabaseAnonKey.length > 10
);

function initSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  try {
    return createClient(rawSupabaseUrl, rawSupabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

// Initialize Supabase Client safely
export const supabase: SupabaseClient | null = initSupabase();

// Local storage keys for resilient fallback & caching
const LOCAL_STORAGE_KEY_CVS = 'cv_en_ligne_cvs_v1';
const LOCAL_STORAGE_KEY_PROFILE = 'cv_en_ligne_profile_v1';
const LOCAL_STORAGE_KEY_LETTERS = 'cv_en_ligne_letters_v1';
const LOCAL_STORAGE_KEY_SESSION = 'cv_en_ligne_session_v1';

// Default initial CV data
export const createEmptyCV = (userId?: string): CVData => ({
  id: 'cv_' + Math.random().toString(36).substring(2, 9) + Date.now(),
  userId: userId || 'guest',
  title: 'Mon CV Professionnel',
  personalInfo: {
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    city: '',
    country: 'France',
    photoUrl: '',
    linkedin: '',
    website: ''
  },
  summary: '',
  experiences: [
    {
      id: 'exp_1',
      position: '',
      company: '',
      city: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      tasks: ['']
    }
  ],
  educations: [
    {
      id: 'edu_1',
      degree: '',
      institution: '',
      city: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
  ],
  skills: [],
  languages: [
    { id: 'lang_1', language: 'Français', level: 'Langue maternelle' }
  ],
  certifications: [],
  projects: [],
  templateId: 'modern',
  theme: {
    primaryColor: '#2563eb',
    secondaryColor: '#1e293b',
    fontFamily: 'sans',
    spacing: 'normal',
    showPhoto: true
  },
  isPaid: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Sample realistic initial CV for showcase/demo
export const sampleDemoCV: CVData = {
  id: 'demo_cv_1',
  userId: 'guest',
  title: 'CV Développeur Full Stack Senior',
  personalInfo: {
    firstName: 'Thomas',
    lastName: 'Laurent',
    title: 'Développeur Full Stack Senior & Tech Lead',
    email: 'thomas.laurent@email.com',
    phone: '+33 6 12 34 56 78',
    city: 'Paris',
    country: 'France',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    linkedin: 'linkedin.com/in/thomaslaurent',
    website: 'thomaslaurent.dev'
  },
  summary: 'Développeur Full Stack passionné avec 6 ans d\'expérience dans la conception d\'applications web scalables et ergonomiques. Spécialisé en React, TypeScript et architectures cloud, avec une expertise éprouvée dans le mentorat d\'équipes agiles.',
  experiences: [
    {
      id: 'exp_demo_1',
      position: 'Lead Frontend Developer',
      company: 'TechVision Solutions',
      city: 'Paris',
      startDate: '2022-03',
      endDate: '',
      current: true,
      description: 'Direction technique de l\'équipe frontend (6 ingénieurs) sur la plateforme SaaS B2B.',
      tasks: [
        'Architecture et refonte complète du portail client sous React 19 et Tailwind CSS, augmentant la vitesse de chargement de 45%.',
        'Mise en place de tests automatisés et de pipelines CI/CD garantissant un taux de couverture de 90%.',
        'Coordination avec les équipes Produit et UX/UI pour délivrer 12 fonctionnalités majeures dans les délais.'
      ]
    },
    {
      id: 'exp_demo_2',
      position: 'Développeur Full Stack',
      company: 'Nova Digital Agency',
      city: 'Lyon',
      startDate: '2019-09',
      endDate: '2022-02',
      current: false,
      description: 'Développement d\'applications web et d\'APIs REST performantes pour des clients grands comptes.',
      tasks: [
        'Conception de plus de 15 applications e-commerce et dashboards métier haute performance.',
        'Intégration d\'API de paiement sécurisées et synchronisation en temps réel de bases de données.',
        'Optimisation SEO et accessibilité WCAG AA, propulsant le trafic organique de +60%.'
      ]
    }
  ],
  educations: [
    {
      id: 'edu_demo_1',
      degree: 'Master en Ingénierie Logicielle & Systèmes d\'Information',
      institution: 'École Polytechnique / Université Paris-Saclay',
      city: 'Paris',
      startDate: '2017',
      endDate: '2019',
      current: false,
      description: 'Major de promotion — Spécialisation architectures distribuées et sécurité.'
    },
    {
      id: 'edu_demo_2',
      degree: 'Licence en Informatique',
      institution: 'Université de Lyon',
      city: 'Lyon',
      startDate: '2014',
      endDate: '2017',
      current: false,
      description: 'Bases solides en algorithmique, structures de données et génie logiciel.'
    }
  ],
  skills: [
    { id: 'sk_1', name: 'React / Next.js', level: 5 },
    { id: 'sk_2', name: 'TypeScript', level: 5 },
    { id: 'sk_3', name: 'Node.js / Express', level: 4 },
    { id: 'sk_4', name: 'Tailwind CSS', level: 5 },
    { id: 'sk_5', name: 'PostgreSQL / Supabase', level: 4 },
    { id: 'sk_6', name: 'Docker / CI/CD', level: 4 },
    { id: 'sk_7', name: 'Gestion de projet Agile', level: 5 }
  ],
  languages: [
    { id: 'lang_1', language: 'Français', level: 'Langue maternelle' },
    { id: 'lang_2', language: 'Anglais', level: 'Courant professionnel (C1)' },
    { id: 'lang_3', language: 'Espagnol', level: 'Intermédiaire (B1)' }
  ],
  certifications: [
    { id: 'cert_1', title: 'AWS Certified Solutions Architect', organization: 'Amazon Web Services', date: '2023' },
    { id: 'cert_2', title: 'Professional Scrum Master (PSM I)', organization: 'Scrum.org', date: '2021' }
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'DevPortal Open Source',
      role: 'Créateur & Mainteneur',
      link: 'github.com/thomas/devportal',
      description: 'Outil de documentation et de partage d\'APIs ayant dépassé 2 500 stars sur GitHub.'
    }
  ],
  templateId: 'modern',
  theme: {
    primaryColor: '#2563eb',
    secondaryColor: '#0f172a',
    fontFamily: 'sans',
    spacing: 'normal',
    showPhoto: true
  },
  isPaid: true,
  paidAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Data persistence service with Supabase + resilient local fallback
export const storageService = {
  // Load all CVs for current user
  async getCVs(userId: string = 'guest'): Promise<CVData[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('cvs')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(item => item.cv_data || item);
        }
      } catch (err) {
        console.warn('Supabase fetch failed, fallback to local storage:', err);
      }
    }

    // Fallback: LocalStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_CVS);
      if (stored) {
        const parsed: CVData[] = JSON.parse(stored);
        const userCvs = parsed.filter(cv => cv.userId === userId || !cv.userId || userId === 'demo-user-id' || userId === 'guest');
        if (userCvs.length > 0) return userCvs;
      }
    } catch {
      // ignore
    }

    return [sampleDemoCV];
  },

  // Save single CV
  async saveCV(cv: CVData): Promise<void> {
    const updatedCV: CVData = {
      ...cv,
      updatedAt: new Date().toISOString()
    };

    // Save to LocalStorage immediately
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_CVS);
      let list: CVData[] = stored ? JSON.parse(stored) : [];
      const index = list.findIndex(item => item.id === updatedCV.id);
      if (index >= 0) {
        list[index] = updatedCV;
      } else {
        list.unshift(updatedCV);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY_CVS, JSON.stringify(list));
    } catch (err) {
      console.warn('Local storage save error:', err);
    }

    // Sync to Supabase if configured
    if (isSupabaseConfigured && supabase && updatedCV.userId && updatedCV.userId !== 'guest') {
      try {
        await supabase
          .from('cvs')
          .upsert({
            id: updatedCV.id,
            user_id: updatedCV.userId,
            title: updatedCV.title,
            template_id: updatedCV.templateId,
            is_paid: updatedCV.isPaid,
            cv_data: updatedCV,
            updated_at: updatedCV.updatedAt
          });
      } catch (err) {
        console.warn('Supabase upsert CV failed:', err);
      }
    }
  },

  // Delete CV
  async deleteCV(cvId: string, userId: string = 'guest'): Promise<void> {
    // Local storage delete
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_CVS);
      if (stored) {
        const list: CVData[] = JSON.parse(stored);
        const filtered = list.filter(item => item.id !== cvId);
        localStorage.setItem(LOCAL_STORAGE_KEY_CVS, JSON.stringify(filtered));
      }
    } catch {
      // ignore
    }

    // Supabase delete
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('cvs')
          .delete()
          .eq('id', cvId)
          .eq('user_id', userId);
      } catch (err) {
        console.warn('Supabase delete CV failed:', err);
      }
    }
  },

  // Duplicate CV
  async duplicateCV(cv: CVData, userId: string = 'guest'): Promise<CVData> {
    const duplicated: CVData = {
      ...cv,
      id: 'cv_' + Math.random().toString(36).substring(2, 9) + Date.now(),
      title: `${cv.title} (Copie)`,
      userId,
      isPaid: false, // Must be paid individually or copied as draft
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await this.saveCV(duplicated);
    return duplicated;
  },

  // Get user profile
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            email: data.email,
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            phone: data.phone || '',
            city: data.city || '',
            country: data.country || '',
            photoUrl: data.photo_url || '',
            title: data.title || '',
            summary: data.summary || '',
            coverLetterUsageCount: data.cover_letter_usage_count || 0,
            plan: data.plan || 'free',
            subscriptionStatus: data.subscription_status || 'none',
            subscriptionStart: data.subscription_start,
            subscriptionEnd: data.subscription_end
          };
        }
      } catch {
        // fallback
      }
    }

    // Local profile fallback
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE + '_' + userId);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }

    return null;
  },

  // Save user profile
  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE + '_' + profile.id, JSON.stringify(profile));
    } catch {
      // ignore
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: profile.id,
            email: profile.email,
            first_name: profile.firstName,
            last_name: profile.lastName,
            phone: profile.phone,
            city: profile.city,
            country: profile.country,
            photo_url: profile.photoUrl,
            title: profile.title,
            summary: profile.summary,
            cover_letter_usage_count: profile.coverLetterUsageCount,
            updated_at: new Date().toISOString()
          });
      } catch (err) {
        console.warn('Supabase save profile failed:', err);
      }
    }
  },

  // Cover letters persistence
  async getCoverLetters(userId: string = 'guest'): Promise<CoverLetterData[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('cover_letters')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase cover letters fetch failed:', err);
      }
    }

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_LETTERS);
      if (stored) {
        const list: CoverLetterData[] = JSON.parse(stored);
        return list;
      }
    } catch {
      // ignore
    }

    // Default sample cover letter for initial empty state
    return [
      {
        id: 'sample_letter_1',
        userId,
        title: 'Candidature spontanée - Tech Innovations',
        jobTitle: 'Chef de Projet Digital',
        companyName: 'Tech Innovations SAS',
        recipientName: 'Madame, Monsieur les Responsables du Recrutement',
        content: `Madame, Monsieur,\n\nAyant suivi avec un vif intérêt le développement et les réussites récentes de Tech Innovations SAS, je me permets de vous adresser ma candidature pour rejoindre vos équipes en tant que Chef de Projet Digital.\n\nFort d'un parcours riche et diversifié dans la gestion de projets web et la coordination d'équipes agiles, j'ai développé une solide expertise autour du pilotage stratégique et de la conduite du changement. Reconnu pour ma rigueur, ma proactivité et mon sens de l'écoute, je souhaite mettre mon énergie au service de votre dynamique d'innovation.\n\nJe reste à votre entière disposition pour convenir d'un entretien au cours duquel je pourrai vous exposer plus en détail mes motivations et l'adéquation de mon profil avec vos ambitions.\n\nDans cette attente, je vous prie d'agréer l'expression de mes salutations distinguées.`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  },

  async saveCoverLetter(letter: CoverLetterData, userId: string = 'guest'): Promise<void> {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_LETTERS);
      let list: CoverLetterData[] = stored ? JSON.parse(stored) : [];
      const index = list.findIndex((item) => item.id === letter.id);
      if (index >= 0) {
        list[index] = { ...letter, updatedAt: new Date().toISOString() };
      } else {
        list.unshift({ ...letter, updatedAt: new Date().toISOString() });
      }
      localStorage.setItem(LOCAL_STORAGE_KEY_LETTERS, JSON.stringify(list));
    } catch {
      // ignore
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('cover_letters').upsert({
          id: letter.id,
          user_id: userId,
          title: letter.title,
          job_title: letter.jobTitle,
          company_name: letter.companyName,
          recipient_name: letter.recipientName,
          content: letter.content,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase save cover letter failed:', err);
      }
    }
  },

  async deleteCoverLetter(letterId: string, userId: string = 'guest'): Promise<void> {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_LETTERS);
      if (stored) {
        const list: CoverLetterData[] = JSON.parse(stored);
        const filtered = list.filter((item) => item.id !== letterId);
        localStorage.setItem(LOCAL_STORAGE_KEY_LETTERS, JSON.stringify(filtered));
      }
    } catch {
      // ignore
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('cover_letters').delete().eq('id', letterId).eq('user_id', userId);
      } catch (err) {
        console.warn('Supabase delete cover letter failed:', err);
      }
    }
  }
};
