import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, LogOut, Plus, LayoutDashboard, Shield } from 'lucide-react';
import { adminService } from '../../lib/adminService';
import { LanguageSelector } from '../common/LanguageSelector';
import { ENABLE_PAYMENTS } from '../../config/features';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'builder' | 'admin';
  onNavigate: (view: 'landing' | 'dashboard' | 'builder' | 'admin') => void;
  onNavigateToTab?: (tab: 'cvs' | 'cover-letters') => void;
  lang?: string;
  onLanguageChange?: (lang: any) => void;
  user: any;
  onOpenAuth: () => void;
  onOpenAdminLogin?: () => void;
  onSignOut: () => void;
  onNewCV: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onNavigateToTab,
  user,
  onOpenAuth,
  onSignOut,
  onNewCV
}) => {
  const { t } = useLanguage();
  const isAdmin = user?.email && adminService.isAdminEmail(user.email);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center cursor-pointer group select-none py-1 shrink-0"
          title={`${t('brand.name')} - ${t('brand.tagline')}`}
        >
          <img
            src="/images/logo.jpg"
            alt={`${t('brand.name')} - ${t('brand.tagline')}`}
            className="h-12 sm:h-14 md:h-15 w-auto max-w-[190px] sm:max-w-[240px] md:max-w-[280px] object-contain group-hover:scale-[1.02] transition-transform duration-200"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('landing')}
            className={`hover:text-blue-600 transition-colors ${currentView === 'landing' ? 'text-blue-600 font-bold' : ''}`}
          >
            {t('nav.home', 'Accueil')}
          </button>
          <button
            onClick={() => {
              if (currentView === 'landing') {
                const el = document.getElementById('templates-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              } else {
                onNavigate('landing');
              }
            }}
            className="hover:text-blue-600 transition-colors"
          >
            {t('nav.templates', 'Modèles')}
          </button>
          <button
            onClick={() => {
              if (onNavigateToTab) {
                onNavigateToTab('cover-letters');
              } else {
                onNavigate('dashboard');
              }
            }}
            className="hover:text-purple-600 transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-slate-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>{t('nav.coverLetters', 'Lettre de Motivation')}</span>
          </button>
          {ENABLE_PAYMENTS && (
            <button
              onClick={() => {
                if (currentView === 'landing') {
                  const el = document.getElementById('pricing-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  onNavigate('landing');
                }
              }}
              className="hover:text-blue-600 transition-colors"
            >
              {t('nav.pricing', 'Tarifs')}
            </button>
          )}
          <button
            onClick={() => {
              if (currentView === 'landing') {
                const el = document.getElementById('faq-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              } else {
                onNavigate('landing');
              }
            }}
            className="hover:text-blue-600 transition-colors"
          >
            {t('nav.faq', 'FAQ')}
          </button>
          <button
            onClick={() => {
              if (currentView === 'landing') {
                const el = document.getElementById('contact-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              } else {
                onNavigate('landing');
              }
            }}
            className="hover:text-blue-600 transition-colors"
          >
            {t('nav.contact', 'Contact')}
          </button>
        </nav>

        {/* Right CTA / Language / Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <LanguageSelector className="shadow-2xs" />

          {/* User Auth or CTA */}
          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 border border-purple-400/30"
                  title="Accéder au panneau d'administration"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t('nav.adminBadge', 'ADMIN')}</span>
                </button>
              )}
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('nav.dashboard', 'Mon Espace')}</span>
              </button>
              <button
                onClick={onNewCV}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('nav.newCv', 'Nouveau CV')}</span>
              </button>
              <button
                onClick={onSignOut}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title={t('nav.logout', 'Déconnexion')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-3 py-2 text-slate-700 hover:text-blue-600 text-xs font-bold transition-colors"
              >
                {t('nav.login', 'Connexion')}
              </button>
              <button
                onClick={onNewCV}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{t('hero.ctaPrimary', 'Créer mon CV')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
