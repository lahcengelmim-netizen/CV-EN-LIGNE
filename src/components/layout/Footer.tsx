import React from 'react';
import { LanguageCode } from '../../types';
import { translations } from '../../lib/translations';
import { FileText, Mail, ShieldCheck, Heart, Sparkles, Shield } from 'lucide-react';
import { ENABLE_PAYMENTS } from '../../config/features';

interface FooterProps {
  lang?: LanguageCode;
  onNavigate?: (view: 'landing' | 'dashboard' | 'builder' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ lang = 'fr', onNavigate }) => {
  const t = translations[lang] || translations.fr;

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
                  alt="VITAREY — Online CV Platform"
                  className="h-10 sm:h-12 w-auto max-w-[200px] object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              La plateforme intelligente VITAREY pour transformer vos informations en un CV professionnel, moderne et percutant prêt pour l'embauche.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Conforme ATS & Protection des données</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#templates-section" className="hover:text-white transition-colors">Nos 21 Modèles de CV</a>
              </li>
              <li>
                <a href="#workflow-section" className="hover:text-white transition-colors">Comment ça marche</a>
              </li>
              {ENABLE_PAYMENTS ? (
                <li>
                  <a href="#pricing-section" className="hover:text-white transition-colors">Grille Tarifaire ($1.99 - $39.99)</a>
                </li>
              ) : (
                <li>
                  <span className="text-emerald-400 font-bold">Plateforme 100% Gratuite (Test 1 Mois)</span>
                </li>
              )}
              <li>
                <a href="#faq-section" className="hover:text-white transition-colors">Questions Fréquentes</a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">Fonctionnalités Clés</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Optimisation IA des missions</span>
              </li>
              <li>Accroche professionnelle assistée</li>
              <li>Générateur de lettre de motivation</li>
              <li>Export PDF A4 Haute Définition</li>
              <li>Traduction FR, EN et Arabe RTL</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">Support & Contact</h4>
            <p className="text-xs text-slate-400 mb-3">
              Une question ou besoin d'assistance ? Notre équipe dédiée est à votre écoute.
            </p>
            <a
              href="mailto:support@vitarey.com"
              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors border border-slate-700"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>support@vitarey.com</span>
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} VITAREY — Online CV Platform. Tous droits réservés.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Conditions Générales</span>
            <span className="hover:text-slate-400 cursor-pointer">Politique de Confidentialité</span>
            <span className="hover:text-slate-400 cursor-pointer">Mentions Légales</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
