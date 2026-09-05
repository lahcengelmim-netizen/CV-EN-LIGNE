import React from 'react';
import { LanguageSelector } from './LanguageSelector';

/**
 * Navbar.jsx - Barre de navigation avec traduction exclusive de l'interface
 * RÈGLE STRICTE : Ne traduit que les boutons et menus de l'interface via le dictionnaire `t`.
 */
export const Navbar = ({
  currentLang = 'en',
  onLanguageChange,
  activeView = 'home',
  onNavigate,
  user = null,
  onOpenAuth,
  onSignOut,
  onNewCv,
  t,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Titre */}
        <div 
          onClick={() => onNavigate && onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <img
            src="/images/logo.jpg"
            alt="VITAREY — Online CV Platform"
            className="h-11 sm:h-13 w-auto max-w-[200px] object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Liens de navigation (Interface traduite) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className={`hover:text-blue-600 transition-colors ${activeView === 'home' ? 'text-blue-600 font-bold' : ''}`}
          >
            {t('nav.home', 'Accueil')}
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('templates')}
            className={`hover:text-blue-600 transition-colors ${activeView === 'templates' ? 'text-blue-600 font-bold' : ''}`}
          >
            {t('nav.templates', 'Modèles')}
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('pricing')}
            className={`hover:text-blue-600 transition-colors ${activeView === 'pricing' ? 'text-blue-600 font-bold' : ''}`}
          >
            {t('nav.pricing', 'Tarifs')}
          </button>
          {user && (
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('dashboard')}
              className={`hover:text-blue-600 transition-colors ${activeView === 'dashboard' ? 'text-blue-600 font-bold' : ''}`}
            >
              {t('nav.dashboard', 'Mon Espace')}
            </button>
          )}
        </nav>

        {/* Actions : Sélecteur de langue Dropdown + Boutons UI */}
        <div className="flex items-center gap-3">
          {/* Sélecteur de Langue Vertical Dropdown */}
          <LanguageSelector
            currentLang={currentLang}
            onLanguageChange={onLanguageChange}
          />

          {user ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onNewCv}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all"
              >
                {t('buttons.newCv', 'Nouveau CV')}
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl transition-all"
              >
                {t('nav.logout', 'Déconnexion')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenAuth}
                className="text-slate-700 hover:text-blue-600 text-xs sm:text-sm font-semibold px-3 py-2 transition-colors"
              >
                {t('nav.login', 'Connexion')}
              </button>
              <button
                type="button"
                onClick={onNewCv || onOpenAuth}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all"
              >
                {t('buttons.createCv', 'Créer mon CV')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
