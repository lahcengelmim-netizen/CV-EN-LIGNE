import React, { useState } from 'react';
import './Pricing.css';
import { ENABLE_PAYMENTS } from '../config/features';
import { useLanguage } from '../context/LanguageContext';

export interface PricingProps {
  onSelectPlan?: (planId: string, plan: any) => void;
  currency?: string;
}

export const Pricing: React.FC<PricingProps> = ({
  onSelectPlan,
  currency = '$'
}) => {
  if (!ENABLE_PAYMENTS) {
    return null;
  }

  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'flash',
      name: t('pricing.flashTitle', 'Pass Flash'),
      tagline: t('pricing.flashTagline', 'Achat Unique'),
      price: '1.99',
      period: t('pricing.flashPeriod', 'Paiement unique'),
      description: t('pricing.flashDesc', 'Idéal pour une candidature ciblée et ponctuelle sans engagement dans la durée.'),
      isPopular: false,
      badgeText: null,
      ctaText: t('pricing.flashCta', 'Télécharger 1 CV ($1.99)'),
      buttonVariant: 'secondary',
      features: [
        t('pricing.features.flash1', '1 Téléchargement PDF Haute Définition'),
        t('pricing.features.flash2', '100% Sans Filigrane'),
        t('pricing.features.flash3', 'Vérification ATS Basique'),
        t('pricing.features.flash4', 'Export Instantané au Format Recruteur'),
        t('pricing.features.flash5', 'Format A4 Vectoriel Standard')
      ],
      disabledFeatures: [
        t('pricing.features.monthly3', 'Générateur de Lettres de Motivation IA'),
        t('pricing.features.pro1', 'Téléchargements ILLIMITÉS')
      ]
    },
    {
      id: 'pro',
      name: t('pricing.proTitle', 'Pass Pro'),
      tagline: t('pricing.proTagline', 'Le Plus Recommandé'),
      price: '3.99',
      period: t('pricing.proPeriod', 'Accès complet 7 jours'),
      description: t('pricing.proDesc', 'Le choix favori des candidats actifs postulant à plusieurs offres d\'emploi.'),
      isPopular: true,
      badgeText: t('pricing.mostPopular', '⭐ PLUS POPULAIRE'),
      ctaText: t('pricing.proCta', 'Activer le Pass Pro 7 Jours ($3.99)'),
      buttonVariant: 'primary',
      features: [
        t('pricing.features.pro1', 'Téléchargements ILLIMITÉS pendant 7 jours'),
        t('pricing.features.pro2', '100% Sans Filigrane & Résolution Maximale'),
        t('pricing.features.pro3', 'Audit de Compatibilité ATS par IA'),
        t('pricing.features.pro4', 'Accès aux 10 Modèles Premium ATS'),
        t('pricing.features.pro5', 'Assistant IA pour CV & Lettre de Motivation')
      ],
      disabledFeatures: []
    },
    {
      id: 'monthly',
      name: t('pricing.monthlyTitle', 'Pass Mensuel'),
      tagline: t('pricing.monthlyTagline', 'Recherche Intensive'),
      price: '7.99',
      period: t('pricing.monthlyPeriod', '/ mois'),
      description: t('pricing.monthlyDesc', 'Idéal pour les transitions de carrière et réorientations nécessitant des adaptations continues.'),
      isPopular: false,
      badgeText: null,
      ctaText: t('pricing.monthlyCta', 'Choisir le Pass Mensuel ($7.99/m)'),
      buttonVariant: 'secondary',
      features: [
        t('pricing.features.monthly1', 'Téléchargements ILLIMITÉS chaque mois'),
        t('pricing.features.monthly2', 'Modèles Premium Débloqués en continu'),
        t('pricing.features.monthly3', 'Générateur de Lettres de Motivation IA'),
        t('pricing.features.monthly4', 'Audit ATS Avancé avec score de compatibilité'),
        t('pricing.features.monthly5', 'Support prioritaire par email 7j/7')
      ],
      disabledFeatures: []
    },
    {
      id: 'annual',
      name: t('pricing.annualTitle', 'Pass Annuel'),
      tagline: t('pricing.annualTagline', 'Tranquillité Totale'),
      price: '39.99',
      period: t('pricing.annualPeriod', '/ an'),
      description: t('pricing.annualDesc', 'Pour cadres, freelances et professionnels souhaitant maintenir leurs dossiers à jour toute l\'année.'),
      isPopular: false,
      badgeText: t('pricing.annualSaveBadge', '⭐ ÉCONOMISEZ 50%'),
      ctaText: t('pricing.annualCta', 'Activer le Pass Annuel ($39.99/an)'),
      buttonVariant: 'accent',
      features: [
        t('pricing.features.annual1', 'Accès ILLIMITÉ pendant 1 an complet'),
        t('pricing.features.annual2', 'Tous les modèles actuels et futurs inclus'),
        t('pricing.features.annual3', 'Générateur de Lettres de Motivation Illimité'),
        t('pricing.features.annual4', 'Optimiseur IA de CV sans restriction'),
        t('pricing.features.annual5', 'Gestion multi-CVs illimitée dans le cloud')
      ],
      disabledFeatures: []
    }
  ];

  const handlePlanClick = (plan: any) => {
    setSelectedPlan(plan.id);
    if (typeof onSelectPlan === 'function') {
      onSelectPlan(plan.id, plan);
    }
  };

  return (
    <section className="pricing-section" id="pricing-section">
      <div className="pricing-container">
        
        {/* Section Header */}
        <div className="pricing-header">
          <div className="pricing-pill">
            {t('pricing.pill', 'Tarification Transparente & Équitable')}
          </div>
          <h2 className="pricing-title">
            {t('pricing.title', 'Des formules adaptées à chaque étape de votre recherche d\'emploi')}
          </h2>
          <p className="pricing-subtitle">
            {t('pricing.subtitle', 'Créez et prévisualisez votre CV gratuitement. Débloquez les exports haute définition dès que vous êtes prêt.')}
          </p>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="pricing-grid">
          {plans.map((plan) => {
            const isFeatured = plan.isPopular;
            const isCardSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`pricing-card ${isFeatured ? 'featured' : ''} ${isCardSelected ? 'selected' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {/* Top Badge */}
                {plan.badgeText && (
                  <div className={`card-top-badge ${isFeatured ? 'badge-primary' : 'badge-accent'}`}>
                    {plan.badgeText}
                  </div>
                )}

                {/* Card Header */}
                <div className="card-header">
                  <div className="plan-tagline">{plan.tagline}</div>
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-description">{plan.description}</p>
                </div>

                {/* Price Box */}
                <div className="card-price-box">
                  <div className="price-row">
                    <span className="price-currency">{currency}</span>
                    <span className="price-value">{plan.price}</span>
                  </div>
                  <div className="price-period">{plan.period}</div>
                </div>

                {/* Call to Action Button */}
                <button
                  type="button"
                  className={`pricing-btn btn-${plan.buttonVariant}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanClick(plan);
                  }}
                >
                  {plan.ctaText}
                </button>

                {/* Divider */}
                <div className="card-divider" />

                {/* Features List */}
                <div className="card-features">
                  <div className="features-title">
                    {t('pricing.includedTitle', 'Inclus dans cette formule :')}
                  </div>
                  <ul className="features-list">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="feature-item enabled">
                        <svg className="feature-icon check shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                    {plan.disabledFeatures.map((feat, idx) => (
                      <li key={`dis-${idx}`} className="feature-item disabled">
                        <svg className="feature-icon cross shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            );
          })}
        </div>

        {/* Reassurance Badges Banner */}
        <div className="reassurance-banner">
          <div className="reassurance-item">
            <div className="reassurance-icon-box">🔒</div>
            <div className="reassurance-text">
              <span className="reassurance-title">
                {t('pricing.guarantee1', 'Paiement Sécurisé SSL')}
              </span>
              <span className="reassurance-desc">{t('pricing.guarantee1Sub', 'Sécurité bancaire 256 bits')}</span>
            </div>
          </div>

          <div className="reassurance-item">
            <div className="reassurance-icon-box">⚡</div>
            <div className="reassurance-text">
              <span className="reassurance-title">
                {t('pricing.guarantee2', 'Format A4 Vectoriel Haute Définition')}
              </span>
              <span className="reassurance-desc">{t('pricing.guarantee2Sub', 'Conforme A4 & ATS')}</span>
            </div>
          </div>

          <div className="reassurance-item">
            <div className="reassurance-icon-box">🛡️</div>
            <div className="reassurance-text">
              <span className="reassurance-title">
                {t('pricing.guarantee3', '100% Sans Filigrane')}
              </span>
              <span className="reassurance-desc">{t('pricing.guarantee3Sub', 'Export sans filigrane')}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Pricing;
