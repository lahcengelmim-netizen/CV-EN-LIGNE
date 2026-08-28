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
  | 'classic';

export type PlanType = 'free' | 'single_cv' | 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'expired' | 'canceled' | 'none';

export type LanguageCode = 'en' | 'fr' | 'ar' | 'es' | 'de' | 'it' | 'pt' | 'zh';

export interface Experience {
  id: string;
  position: string;
  company: string;
  city: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  tasks: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  city: string;
  startDate: string;
  endDate: string;
  current: boolean;
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
  level: string; // e.g. "Langue maternelle", "Courant (C1)", "Intermédiaire (B2)", "Débutant (A2)"
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  date: string;
}

export interface Project {
  id: string;
  title: string;
  role?: string;
  link?: string;
  description: string;
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
  educations: Education[];
  skills: Skill[];
  languages: LanguageSkill[];
  certifications: Certification[];
  projects: Project[];
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
  subscriptionStatus: SubscriptionStatus;
  subscriptionStart?: string;
  subscriptionEnd?: string;
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
  subscriptionStatus: SubscriptionStatus;
  subscriptionStart?: string;
  subscriptionEnd?: string;
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
