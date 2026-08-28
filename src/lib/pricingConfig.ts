import { PlanType } from '../types';

export interface PricingPlan {
  id: PlanType | 'pro';
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

export const PRICING_PLANS: Record<'single_cv' | 'monthly' | 'yearly', PricingPlan> = {
  single_cv: {
    id: 'single_cv',
    title: 'Paiement Unique',
    name: 'Pass Flash',
    price: 1.99,
    period: 'unique',
    priceDisplay: '$1.99',
    periodDisplay: '/ CV unique',
    description: 'Idéal pour une candidature ciblée et ponctuelle sans engagement.',
    features: [
      '1 CV complet au format PDF A4 Haute Définition',
      'Sans aucun filigrane',
      'Accès immédiat aux 10 modèles de CV professionnels',
      'Vérification ATS basique',
      'Format A4 vectoriel standard',
      'Paiement unique garanti sans abonnement'
    ],
    cta: 'Télécharger 1 CV ($1.99)',
    isPopular: false
  },
  monthly: {
    id: 'monthly',
    title: 'Abonnement Mensuel',
    name: 'Monthly Pass',
    price: 7.99,
    period: 'month',
    priceDisplay: '$7.99',
    periodDisplay: '/ mois',
    description: 'Pour les candidats actifs en recherche d\'emploi continue.',
    features: [
      'Création illimitée de CVs et variantes métiers',
      'Accès total et permanent aux 10 designs premium',
      'Générateur de lettres de motivation IA',
      'Téléchargements PDF HD instantanés et illimités',
      'Support client prioritaire',
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
    badge: 'SAVE 50%',
    badgeType: 'warning',
    description: 'La solution la plus économique et complète pour piloter toute votre carrière.',
    features: [
      'Tout ce qui est inclus dans le Pass Mensuel',
      'Accès complet pendant 1 an entier (365 jours)',
      'Économisez plus de 50% par rapport au forfait mensuel',
      'Nouveaux modèles et fonctionnalités en avant-première',
      'Générateur illimité de lettres de motivation IA',
      'Garantie satisfait ou remboursé 14 jours'
    ],
    cta: 'Profiter de l\'Offre Annuelle ($39.99/an)',
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
