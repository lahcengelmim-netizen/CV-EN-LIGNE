import React from 'react';
import { LanguageCode } from '../../types';
import { translations } from '../../lib/translations';
import { FileText, Sparkles, User, LogOut, Globe, Plus, LayoutDashboard, Shield } from 'lucide-react';
import { adminService } from '../../lib/adminService';
import { LanguageSelector } from '../common/LanguageSelector';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'builder' | 'admin';
  onNavigate: (view: 'landing' | 'dashboard' | 'builder' | 'admin') => void;
  lang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  user: any;
  onOpenAuth: () => void;
  onOpenAdminLogin?: () => void;
  onSignOut: () => void;
  onNewCV: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  lang,
  onLanguageChange,
  user,
  onOpenAuth,
  onOpenAdminLogin,
  onSignOut,
  onNewCV
}) => {
  const t = translations[lang] || translations.fr;
  const isAdmin = user?.email && adminService.isAdminEmail(user.email);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>CV EN LIGNE</span>
              <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">IA</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block -mt-0.5">
              {t.brandTagline}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('landing')}
            className={`hover:text-blue-600 transition-colors ${currentView === 'landing' ? 'text-blue-600' : ''}`}
          >
            {t.navHome}
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
            {t.navTemplates}
          </button>
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
            {t.navPricing}
          </button>
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
            {t.navFAQ}
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
            {t.navContact}
          </button>
        </nav>

        {/* Right CTA / Language / Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Horizontal Language Selector with 8 Flags */}
          <LanguageSelector
            currentLang={lang}
            onLanguageChange={onLanguageChange}
            className="shadow-2xs"
          />

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
                  <span>ADMIN</span>
                </button>
              )}
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.navDashboard}</span>
              </button>
              <button
                onClick={onNewCV}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.btnNewCv}</span>
              </button>
              <button
                onClick={onSignOut}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Déconnexion"
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
                {t.login}
              </button>
              <button
                onClick={onNewCV}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{t.heroCtaPrimary}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
