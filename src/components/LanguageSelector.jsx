import React, { useState, useEffect, useRef } from 'react';
import './LanguageSelector.css';

/**
 * 8 Langues mondiales avec drapeaux et configuration de direction RTL / LTR
 * RÈGLE STRICTE : La traduction s'applique UNIQUEMENT aux libellés de l'interface (boutons, titres, menus).
 * Le contenu rédigé par l'utilisateur dans son CV ne doit JAMAIS être traduit ni modifié.
 */
export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', short: 'EN', flag: '🇬🇧', dir: 'ltr' },
  { code: 'fr', name: 'Français', short: 'FR', flag: '🇫🇷', dir: 'ltr' },
  { code: 'ar', name: 'العربية', short: 'AR', flag: '🇸🇦', dir: 'rtl' },
  { code: 'es', name: 'Español', short: 'ES', flag: '🇪🇸', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', short: 'DE', flag: '🇩🇪', dir: 'ltr' },
  { code: 'it', name: 'Italiano', short: 'IT', flag: '🇮🇹', dir: 'ltr' },
  { code: 'pt', name: 'Português', short: 'PT', flag: '🇵🇹', dir: 'ltr' },
  { code: 'zh', name: '中文', short: 'ZH', flag: '🇨🇳', dir: 'ltr' },
];

/**
 * Composant de sélection des langues sous forme de Menu Vertical Déroulant (Dropdown)
 * @param {Object} props
 * @param {string} props.currentLang - Code de la langue active (ex: 'en', 'fr', 'ar', etc.)
 * @param {Function} props.onLanguageChange - Callback lors de la sélection d'une nouvelle langue
 * @param {string} [props.className] - Classes CSS personnalisées
 * @param {boolean} [props.showFullName] - Afficher le nom complet dans le bouton déclencheur
 */
export const LanguageSelector = ({
  currentLang = 'en',
  onLanguageChange,
  className = '',
  showFullName = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeCode = currentLang || 'en';
  const activeLanguage =
    AVAILABLE_LANGUAGES.find((lang) => lang.code === activeCode) ||
    AVAILABLE_LANGUAGES[0];

  // Gestion de la fermeture lors d'un clic à l'extérieur (Click outside)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectLanguage = (lang) => {
    // 1. Mise à jour de la direction HTML (RTL automatique pour l'arabe)
    if (typeof document !== 'undefined') {
      const isRtl = lang.code === 'ar';
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = lang.code;
      if (isRtl) {
        document.documentElement.classList.add('rtl');
      } else {
        document.documentElement.classList.remove('rtl');
      }
    }

    // 2. Mémorisation dans le localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('cvenligne_lang', lang.code);
    }

    // 3. Déclenchement du callback de changement de langue
    if (onLanguageChange) {
      onLanguageChange(lang.code);
    }

    // 4. Fermeture automatique du menu vertical
    setIsOpen(false);
  };

  return (
    <div className={`lang-dropdown-wrapper ${className}`} ref={dropdownRef}>
      {/* Bouton Déclencheur Principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`lang-dropdown-trigger ${isOpen ? 'open' : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Current language: ${activeLanguage.name}. Click to change language`}
      >
        <span className="lang-trigger-flag" role="img" aria-hidden="true">
          {activeLanguage.flag}
        </span>
        <span className="lang-trigger-code">{activeLanguage.short}</span>
        {showFullName && (
          <span className="lang-trigger-name hidden md:inline">
            {activeLanguage.name}
          </span>
        )}
        <svg
          className="lang-trigger-arrow"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Menu Déroulant Vertical */}
      {isOpen && (
        <div
          className="lang-dropdown-menu"
          role="menu"
          aria-orientation="vertical"
          aria-label="Language options"
        >
          {AVAILABLE_LANGUAGES.map((lang) => {
            const isSelected = lang.code === activeCode;
            return (
              <button
                key={lang.code}
                type="button"
                role="menuitem"
                onClick={() => handleSelectLanguage(lang)}
                className={`lang-menu-item ${isSelected ? 'active' : ''}`}
                aria-current={isSelected ? 'true' : 'false'}
              >
                <div className="lang-menu-item-left">
                  <span className="lang-menu-flag" role="img" aria-hidden="true">
                    {lang.flag}
                  </span>
                  <div className="lang-menu-info">
                    <span className="lang-menu-name">{lang.name}</span>
                    <span className="lang-menu-code">{lang.short}</span>
                  </div>
                </div>

                {isSelected && (
                  <svg
                    className="lang-menu-check"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
