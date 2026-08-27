import { PlanType } from '../types';

export interface PricingPlan {
  id: PlanType;
  title: string;
  name: string;
  price: number;
  period: 'unique' | 'month' | 'year';
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

export const PRICING_PLANS: Record<'single_cv' | 'monthly' | 'yearly', PricingPlan> = {
  single_cv: {
    id: 'single_cv',
    title: 'Paiement Unique',
    name: '1 CV Complet',
    price: 2.00,
    period: 'unique',
    priceDisplay: '2,00 $',
    periodDisplay: '/ CV unique',
    description: 'Idéal pour un besoin ponctuel : créez et téléchargez votre CV pro sans abonnement.',
    features: [
      '1 CV complet au format PDF A4 Haute Définition',
      'Accès immédiat aux 10 modèles de CV professionnels',
      'Assistant IA pour valoriser expériences et compétences',
      'Téléchargement immédiat sans filigrane',
      'Modifications illimitées dans le temps',
      '2 lettres de motivation sur-mesure incluses',
      'Paiement unique garanti sans abonnement'
    ],
    cta: 'Choisir 1 CV (2,00 $)',
    isPopular: false
  },
  monthly: {
    id: 'monthly',
    title: 'Abonnement Mensuel',
    name: 'Pass Mensuel Illimité',
    price: 9.90,
    period: 'month',
    priceDisplay: '9,90 $',
    periodDisplay: '/ mois',
    description: 'Pour les candidats actifs en recherche d\'emploi régulière.',
    features: [
      'Création illimitée de CVs et variantes métiers',
      'Accès total et permanent aux 10 designs premium',
      'Assistant IA sans limite sur tous vos CVs',
      'Téléchargements PDF HD instantanés et illimités',
      'Génération illimitée de lettres de motivation',
      'Sans engagement • Résiliation en 1 clic à tout moment'
    ],
    cta: 'Choisir le Pass Mensuel (9,90 $)',
    isPopular: false
  },
  yearly: {
    id: 'yearly',
    title: 'Abonnement Annuel',
    name: 'Pass Annuel Pro',
    price: 29.90,
    period: 'year',
    priceDisplay: '29,90 $',
    periodDisplay: '/ an',
    subDetail: 'Soit seulement 2,49 $/mois • Économisez 75%',
    monthlyEquivalent: '2,49 $ / mois',
    badge: 'MEILLEURE OFFRE',
    badgeType: 'warning',
    description: 'La solution la plus économique et complète pour piloter toute votre carrière.',
    features: [
      'Tout ce qui est inclus dans le Pass Mensuel',
      'Accès complet pendant 1 an entier (365 jours)',
      'Économisez 75% par rapport au forfait mensuel',
      'Nouveaux modèles et fonctionnalités en avant-première',
      'Support client prioritaire VIP sous 12h',
      'Garantie satisfait ou remboursé 14 jours'
    ],
    cta: 'Profiter de l\'Offre Annuelle (29,90 $)',
    isPopular: true
  }
};

export const PRICING_LIST = [
  PRICING_PLANS.single_cv,
  PRICING_PLANS.monthly,
  PRICING_PLANS.yearly
];

export function getPlanDetails(planId: PlanType = 'single_cv'): PricingPlan {
  if (planId === 'monthly') return PRICING_PLANS.monthly;
  if (planId === 'yearly') return PRICING_PLANS.yearly;
  return PRICING_PLANS.single_cv;
}
