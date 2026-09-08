import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Mail, ShieldCheck, Sparkles, Shield } from 'lucide-react';
import { ENABLE_PAYMENTS } from '../../config/features';

interface FooterProps {
  lang?: string;
  onNavigate?: (view: 'landing' | 'dashboard' | 'builder' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="bg-white px-3.5 py-2 rounded-2xl shadow-sm inline-flex items-center">
                <img
                  src="/images/logo.jpg"
                  alt={`${t('brand.name', 'VITAREY')} - ${t('brand.tagline', 'Créateur de CV')}`}
                  className="h-10 sm:h-12 w-auto max-w-[200px] object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footer.brandDesc', 'La plateforme intelligente VITAREY pour concevoir un CV professionnel d\'exception et une lettre de motivation sur-mesure prêts pour l\'embauche.')}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{t('footer.atsCompliance', 'Conforme ATS & Protection des données')}</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">
              {t('footer.navigation', 'Navigation')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#templates-section" className="hover:text-white transition-colors">
                  {t('footer.templates21', 'Nos Modèles de CV')}
                </a>
              </li>
              <li>
                <a href="#workflow-section" className="hover:text-white transition-colors">
                  {t('footer.howItWorks', 'Comment ça marche')}
                </a>
              </li>
              {ENABLE_PAYMENTS ? (
                <li>
                  <a href="#pricing-section" className="hover:text-white transition-colors">
                    {t('footer.pricingGrid', 'Grille Tarifaire ($1.99 - $39.99)')}
                  </a>
                </li>
              ) : (
                <li>
                  <span className="text-emerald-400 font-bold">
                    {t('footer.freePlatform', 'Plateforme 100% Gratuite (Test 1 Mois)')}
                  </span>
                </li>
              )}
              <li>
                <a href="#faq-section" className="hover:text-white transition-colors">
                  {t('footer.faq', 'Questions Fréquentes')}
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">
              {t('footer.keyFeatures', 'Fonctionnalités Clés')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{t('footer.aiMissionOpt', 'Optimisation IA des missions')}</span>
              </li>
              <li>{t('footer.aiIntro', 'Accroche professionnelle assistée')}</li>
              <li>{t('footer.aiCoverLetter', 'Générateur de lettre de motivation indépendant')}</li>
              <li>{t('footer.exportHd', 'Export PDF A4 Haute Définition')}</li>
              <li>{t('footer.multilingualRtl', 'Traduction FR, EN et Arabe RTL')}</li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">
              {t('footer.supportContact', 'Support & Contact')}
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              {t('footer.supportPrompt', 'Une question ou besoin d\'assistance ? L\'équipe VITAREY est à votre écoute.')}
            </p>
            <a
              href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL || 'vitareysupport@gmail.com'}`}
              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors border border-slate-700"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{import.meta.env.VITE_SUPPORT_EMAIL || 'vitareysupport@gmail.com'}</span>
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {t('footer.copyright', 'VITAREY - Créateur de CV & Lettre de Motivation. Tous droits réservés.')}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="hover:text-slate-400 cursor-pointer">{t('footer.terms', 'Conditions Générales')}</span>
            <span className="hover:text-slate-400 cursor-pointer">{t('footer.privacy', 'Politique de Confidentialité')}</span>
            <span className="hover:text-slate-400 cursor-pointer">{t('footer.legal', 'Mentions Légales')}</span>
            {onNavigate && (
              <button
                onClick={() => onNavigate('admin')}
                className="hover:text-blue-400 text-slate-400 flex items-center gap-1 transition-colors font-medium ml-2"
              >
                <Shield className="w-3 h-3 text-blue-400 shrink-0" />
                <span>{t('footer.adminSpace', 'Espace Administrateur')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
