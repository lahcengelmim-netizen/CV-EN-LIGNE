import React, { useState } from 'react';
import './Pricing.css';
import { ENABLE_PAYMENTS } from '../config/features';

/**
 * Pricing Component (USD $)
 * 4 Formulas:
 * - Flash Pass ($1.99): Single Purchase (1 Watermark-Free HD PDF Download + Basic ATS Check)
 * - Pro Pass ($3.99 - MOST POPULAR): 7-Day Full Access + All Templates + AI ATS Check
 * - Monthly Pass ($7.99/mo): Unlimited Monthly Access + AI Cover Letters + Priority Support
 * - Annual Pass ($39.99/yr - SAVE 50%): 1-Year All-Inclusive Access
 */
export const Pricing = ({
  onSelectPlan,
  currency = '$'
}) => {
  if (!ENABLE_PAYMENTS) {
    return null;
  }

  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'flash',
      name: 'Pass Flash',
      tagline: 'Single Purchase',
      price: '1.99',
      period: 'One-time payment',
      description: 'Ideal for a targeted, one-time job application with no ongoing commitment.',
      isPopular: false,
      badgeText: null,
      ctaText: 'Download 1 Resume ($1.99)',
      buttonVariant: 'secondary',
      features: [
        '1 High-Definition PDF Resume Download',
        '100% Watermark-Free',
        'Basic ATS Compatibility Check',
        'Instant Export to Recruiter Format',
        'Standard Vector A4 Format'
      ],
      disabledFeatures: [
        'AI Cover Letter Generator',
        'Unlimited Downloads',
        'Ongoing Revisions & Storage'
      ]
    },
    {
      id: 'pro',
      name: 'Pass Pro',
      tagline: 'Most Recommended',
      price: '3.99',
      period: '7-day full access',
      description: 'The favorite choice for active applicants applying to multiple positions.',
      isPopular: true,
      badgeText: '⭐ MOST POPULAR',
      ctaText: 'Get 7-Day Pro Access ($3.99)',
      buttonVariant: 'primary',
      features: [
        'UNLIMITED Downloads for 7 full days',
        'Full access to all 10 ATS-Certified Templates',
        'Complete AI-Powered ATS Resume Analysis',
        '24/7 Unlimited Edits & Color Customization',
        'High-Resolution Vector A4 PDF Export',
        '1 Custom AI Cover Letter included'
      ],
      disabledFeatures: []
    },
    {
      id: 'monthly',
      name: 'Monthly Pass',
      tagline: 'Maximum Flexibility',
      price: '7.99',
      period: '/ month (cancel anytime)',
      description: 'For career professionals actively pursuing opportunities on an ongoing basis.',
      isPopular: false,
      badgeText: null,
      ctaText: 'Start Monthly Pass ($7.99/mo)',
      buttonVariant: 'secondary',
      features: [
        'Unlimited Resume Creations & Downloads',
        'Unlimited AI Cover Letter Generator',
        'Access to all Current & Upcoming Templates',
        'Priority 24/7 Customer & Career Support',
        'Encrypted Cloud Resume Backups',
        '1-Click cancellation at any moment'
      ],
      disabledFeatures: []
    },
    {
      id: 'annual',
      name: 'Annual Pass',
      tagline: 'Best Career Value',
      price: '39.99',
      period: '/ year (~$3.33/month)',
      description: 'The ultimate all-inclusive toolkit for ongoing career growth and promotions.',
      isPopular: false,
      badgeText: '🔥 SAVE 50%',
      ctaText: 'Get 1-Year Access ($39.99/yr)',
      buttonVariant: 'accent',
      features: [
        'Full 365-Day Unlimited All-Inclusive Access',
        'All 10+ Certified Templates & Future Releases',
        'Unlimited Tailored AI Cover Letters',
        'Multi-Profile & Multi-Version Resume Management',
        'VIP Priority Email Support',
        'Save over 50% compared to the Monthly plan'
      ],
      disabledFeatures: []
    }
  ];

  const handlePlanClick = (plan) => {
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
          <div className="pricing-pill">Transparent &amp; Fair Pricing</div>
          <h2 className="pricing-title">
            Invest in Your Career with the Right Plan
          </h2>
          <p className="pricing-subtitle">
            Build and preview your resume 100% free. Unlock watermark-free, high-definition A4 PDF downloads whenever you are ready.
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
                  <div className="features-title">What is included:</div>
                  <ul className="features-list">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="feature-item enabled">
                        <svg className="feature-icon check" viewBox="0 0 20 20" fill="currentColor">
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
                        <svg className="feature-icon cross" viewBox="0 0 20 20" fill="currentColor">
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
              <span className="reassurance-title">100% Secure Payment (SSL Encryption)</span>
              <span className="reassurance-desc">256-bit Banking Level Security</span>
            </div>
          </div>

          <div className="reassurance-item">
            <div className="reassurance-icon-box">⚡</div>
            <div className="reassurance-text">
              <span className="reassurance-title">Instant High-Quality PDF Download</span>
              <span className="reassurance-desc">Vector A4 format without watermarks</span>
            </div>
          </div>

          <div className="reassurance-item">
            <div className="reassurance-icon-box">🛡️</div>
            <div className="reassurance-text">
              <span className="reassurance-title">Satisfied or Refunded (14 days)</span>
              <span className="reassurance-desc">14-day hassle-free money-back guarantee</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Pricing;
