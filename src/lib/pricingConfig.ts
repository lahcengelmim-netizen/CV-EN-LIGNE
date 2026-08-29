import { PlanType } from '../types';

export interface PricingPlan {
  id: PlanType | 'pro' | 'flash' | 'annual';
  title: string;
  name: string;
  price: number;
  period: 'unique' | 'week' | 'month' | 'year';
  priceDisplay: string;
  periodDisplay: string;
  subDetail?: string;
  monthlyEquivalent?: string;
  badge?: string;
  badgeType?: 'primary' | 'success' | 'warning';
  description: string;
  features: string[];
  notIncluded?: string[];
  cta: string;
  isPopular?: boolean;
}

export const PRICING_PLANS: Record<'single_cv' | 'pro' | 'monthly' | 'yearly', PricingPlan> = {
  single_cv: {
    id: 'single_cv',
    title: 'Paiement Unique',
    name: 'Pass Flash',
    price: 1.99,
    period: 'unique',
    priceDisplay: '$1.99',
    periodDisplay: '/ 1 CV PDF',
    description: '1 seul téléchargement de CV en HD A4 sans filigrane. Idéal pour une candidature ciblée.',
    features: [
      '1 Téléchargement unique de CV au format PDF HD A4',
      'Crédit = 1 PDF Haute Résolution vectoriel',
      'Sans aucun filigrane publicitaire',
      'Accès aux 10 modèles de CV professionnels',
      'Vérification de base de la conformité ATS',
      'Paiement unique sans abonnement'
    ],
    notIncluded: [
      'Téléchargements illimités',
      'Générateur de Lettres de Motivation',
      'Modifications ultérieures après téléchargement'
    ],
    cta: 'Télécharger 1 CV ($1.99)',
    isPopular: false
  },
  pro: {
    id: 'pro',
    title: 'Pass Pro (7 Jours)',
    name: 'Pass Pro 7 Jours',
    price: 3.99,
    period: 'week',
    priceDisplay: '$3.99',
    periodDisplay: '/ 7 jours complets',
    subDetail: 'Accès illimité pendant 7 jours',
    badge: '⭐ PLUS POPULAIRE',
    badgeType: 'primary',
    description: 'Téléchargements illimités pendant 7 jours entiers avec accès inclus aux lettres de motivation.',
    features: [
      'Téléchargements ILLIMITÉS pendant 7 jours',
      'Lettres de Motivation IA & Modèles incluses',
      'Accès illimité à tous les 10 modèles ATS',
      'Modifications et exports illimités 24/7',
      'Exports PDF Haute Définition vectoriels',
      'Accès complet sans engagement'
    ],
    cta: 'Activer le Pass Pro 7 Jours ($3.99)',
    isPopular: true
  },
  monthly: {
    id: 'monthly',
    title: 'Abonnement Mensuel',
    name: 'Monthly Pass',
    price: 7.99,
    period: 'month',
    priceDisplay: '$7.99',
    periodDisplay: '/ mois',
    description: 'Pour les candidats actifs en recherche d\'emploi continue avec accès permanent illimité.',
    features: [
      'Téléchargements ILLIMITÉS de CVs',
      'Générateur de lettres de motivation inclus',
      'Accès total et permanent aux 10 designs premium',
      'Sauvegarde cloud chiffrée et multi-profils',
      'Support client prioritaire 24/7',
      'Sans engagement • Résiliation en 1 clic à tout moment'
    ],
    cta: 'Choisir le Pass Mensuel ($7.99/mois)',
    isPopular: false
  },
  yearly: {
    id: 'yearly',
    title: 'Abonnement Annuel',
    name: 'Annual Pass',
    price: 39.99,
    period: 'year',
    priceDisplay: '$39.99',
    periodDisplay: '/ an',
    subDetail: 'Soit seulement ~$3.33/mois • Économisez 50%',
    monthlyEquivalent: '$3.33 / mois',
    badge: '🔥 SAVE 50%',
    badgeType: 'warning',
    description: 'La solution la plus économique et complète pour piloter toute votre carrière.',
    features: [
      'Téléchargements ILLIMITÉS pendant 1 an (365 jours)',
      'Générateur de lettres de motivation inclus en illimité',
      'Tout ce qui est inclus dans le Pass Mensuel',
      'Économisez plus de 50% par rapport au forfait mensuel',
      'Nouveaux modèles et fonctionnalités en avant-première',
      'Garantie satisfait ou remboursé 14 jours'
    ],
    cta: 'Profiter du Pass Annuel ($39.99/an)',
    isPopular: false
  }
};

export const PRICING_LIST = [
  PRICING_PLANS.single_cv,
  PRICING_PLANS.pro,
  PRICING_PLANS.monthly,
  PRICING_PLANS.yearly
];

export function getPlanDetails(planId: string = 'single_cv'): PricingPlan {
  if (planId === 'pro') return PRICING_PLANS.pro;
  if (planId === 'monthly') return PRICING_PLANS.monthly;
  if (planId === 'yearly' || planId === 'annual') return PRICING_PLANS.yearly;
  if (planId === 'flash' || planId === 'single_cv') return PRICING_PLANS.single_cv;
  return PRICING_PLANS.single_cv;
}
