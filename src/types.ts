export type TemplateId =
  | 'modern'
  | 'minimal'
  | 'professional'
  | 'executive'
  | 'creative'
  | 'tech'
  | 'student'
  | 'ats'
  | 'elegant'
  | 'corporate'
  | 'classic'
  | 'bold'
  | 'compact'
  | 'timeline'
  | 'nordic'
  | 'infographic'
  | 'stockholm-modern'
  | 'casablanca-bilingual'
  | 'zurich-executive'
  | 'dubai-luxury-rtl'
  | 'silicon-tech';

export type PlanType = 'free' | 'single_cv' | 'flash' | 'pro' | 'monthly' | 'yearly' | 'annual';
export type PassType = 'none' | 'flash' | 'pro' | 'monthly' | 'annual' | 'single_cv' | 'yearly';
export type SubscriptionStatus = 'active' | 'expired' | 'canceled' | 'none';

export interface UserPassState {
  activePass: PassType;
  downloadCredits: number; // 1 for flash, 999999 for pro/monthly/annual, 0 for none/consumed
  passExpiresAt?: string | null;
  unlockedCoverLetters: boolean;
  totalDownloads: number;
  isUnlimited: boolean;
  canDownload: boolean;
  canEdit: boolean;
}

export type LanguageCode = 'en' | 'fr' | 'ar' | 'es' | 'de' | 'it' | 'pt' | 'zh';

export type SectionKey =
  | 'personalInfo'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'certifications'
  | 'projects'
  | 'achievements'
  | 'interests'
  | 'references'
  | 'custom';

export interface ReferenceItem {
  id: string;
  name: string;
  title: string;
  company: string;
  email?: string;
  phone?: string;
}

export interface Experience {
  id: string;
  position: string;
  jobTitle?: string;
  company: string;
  city: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  tasks: string[];
  bullets?: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  city: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  grade?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: number; // 1 to 5
}

export interface LanguageSkill {
  id: string;
  language: string;
  name?: string;
  level: string; // e.g. "Langue maternelle", "Courant (C1)", "Intermédiaire (B2)", "Débutant (A2)"
  cefr?: string;
}

export interface Certification {
  id: string;
  title: string;
  name?: string;
  organization: string;
  issuer?: string;
  date: string;
}

export interface Project {
  id: string;
  title: string;
  name?: string;
  role?: string;
  link?: string;
  description: string;
  date?: string;
  technologies?: string[];
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  address?: string;
  photoUrl?: string;
  linkedin?: string;
  website?: string;
  github?: string;
}

export interface CVTheme {
  primaryColor: string; // Hex e.g. '#2563eb'
  secondaryColor?: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  spacing: 'compact' | 'normal' | 'spacious';
  margins?: 'compact' | 'normal' | 'wide';
  lineSpacing?: 'compact' | 'normal' | 'spacious';
  isRtl?: boolean;
  sectionOrder?: SectionKey[];
  showPhoto: boolean;
}

export interface CVSectionTitles {
  contact?: string;
  profile?: string;
  experience?: string;
  education?: string;
  skills?: string;
  languages?: string;
  certifications?: string;
  projects?: string;
  references?: string;
}

export interface CVData {
  id: string;
  userId?: string;
  title: string; // Title of the CV document e.g. "CV Développeur Web"
  language?: LanguageCode;
  sectionTitles?: CVSectionTitles;
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  experience?: Experience[];
  educations: Education[];
  education?: Education[];
  skills: Skill[];
  languages: LanguageSkill[];
  certifications: Certification[];
  projects: Project[];
  references?: ReferenceItem[];
  activeSections?: Record<string, boolean>;
  design?: any;
  templateId: TemplateId;
  theme: CVTheme;
  isPaid: boolean;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CoverLetterData {
  id: string;
  userId?: string;
  cvId?: string;
  title: string;
  recipientName: string;
  recipientTitle?: string;
  companyName: string;
  jobTitle: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
  country?: string;
  photoUrl?: string;
  title?: string;
  summary?: string;
  skills?: string[];
  coverLetterUsageCount: number;
  plan: PlanType;
  activePass?: PassType;
  downloadCredits?: number;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  passExpiresAt?: string;
  canEdit?: boolean;
}

export interface AIImprovementResult {
  originalText: string;
  improvedText: string;
  bulletPoints?: string[];
  explanation?: string;
}

// --- ADMIN TYPES & SCHEMAS ---

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  plan: PlanType;
  activePass?: PassType;
  downloadCredits?: number;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  passExpiresAt?: string;
  cvCount: number;
  status: 'active' | 'suspended';
  role: 'user' | 'admin';
  lastLogin?: string;
}

export interface AdminCV {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  title: string;
  templateId: TemplateId;
  isPaid: boolean;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  status: 'paid' | 'draft';
  cvData?: CVData;
}

export interface AdminPayment {
  id: string;
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  cvId?: string;
  cvTitle?: string;
  planType: PlanType;
  planName: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending';
  reference: string;
  createdAt: string;
  paymentMethod: string;
}

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'nouveau' | 'lu' | 'traite';
  createdAt: string;
  repliedAt?: string;
  notes?: string;
}

export interface AdminTemplateInfo {
  id: TemplateId;
  name: string;
  description: string;
  tag: string;
  style: string;
  usageCount: number;
  active: boolean;
  bgStyle: string;
}

export interface AdminStats {
  totalUsers: number;
  newUsersToday: number;
  newUsersMonth: number;
  // Plan counts
  freeUsersCount: number;
  singleCvUsersCount: number;
  monthlySubscribersCount: number;
  yearlySubscribersCount: number;
  activeSubscriptionsCount: number;
  expiredSubscriptionsCount: number;
  // Revenue breakdown by offer
  revenueSingleCv: number;
  revenueMonthly: number;
  revenueYearly: number;
  totalCVs: number;
  cvsToday: number;
  cvsMonth: number;
  totalPayments: number;
  totalRevenue: number;
  averageBasket: number;
  totalAIUsage: number;
  aiUsageToday: number;
  aiUsageMonth: number;
  coverLettersGenerated: number;
  activeAIUsers: number;
  mostUsedTemplates: Array<{
    templateId: TemplateId;
    name: string;
    count: number;
    percentage: number;
  }>;
  dailyRevenue: Array<{
    date: string;
    amount: number;
    sales: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    amount: number;
    sales: number;
  }>;
  userGrowth: Array<{
    date: string;
    users: number;
    cvs: number;
  }>;
}

export interface AdminSettings {
  platformName: string;
  contactEmail: string;
  supportNotificationEmail: string;
  cvPrice: number;
  currency: string;
  maintenanceMode: boolean;
  aiEnhancementEnabled: boolean;
  coverLetterEnabled: boolean;
}
