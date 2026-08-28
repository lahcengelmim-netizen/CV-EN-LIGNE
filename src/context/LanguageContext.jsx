import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, AVAILABLE_LANGUAGES } from '../utils/translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'cvenligne_lang';

export const LanguageProvider = ({ children, defaultLanguage = 'en' }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && translations[saved]) {
        return saved;
      }
    }
    return defaultLanguage;
  });

  // Met à jour la direction RTL/LTR du document et la langue HTML
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isRtl = currentLang === 'ar';
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = currentLang;
      if (document.body) {
        document.body.dir = isRtl ? 'rtl' : 'ltr';
      }
      if (isRtl) {
        document.documentElement.classList.add('rtl');
      } else {
        document.documentElement.classList.remove('rtl');
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, currentLang);
    }
  }, [currentLang]);

  const changeLanguage = useCallback((langCode) => {
    if (translations[langCode]) {
      setCurrentLang(langCode);
    }
  }, []);

  /**
   * Helper de traduction avec support de la notation par points : t('nav.home') ou t('buttons.download')
   * RÈGLE ABSOLUE : S'applique uniquement aux libellés de l'interface.
   * Ne jamais utiliser ce helper pour formater ou modifier les données du CV saisies par l'utilisateur.
   */
  const t = useCallback((path, fallback = '') => {
    if (!path) return '';

    const currentDict = translations[currentLang] || translations.en;
    const fallbackDict = translations.en;

    const resolve = (dict, keyPath) => {
      const keys = keyPath.split('.');
      let result = dict;
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          return null;
        }
      }
      return typeof result === 'string' ? result : null;
    };

    const resolved = resolve(currentDict, path) ?? resolve(fallbackDict, path);
    return resolved !== null ? resolved : (fallback || path);
  }, [currentLang]);

  const value = {
    currentLang,
    changeLanguage,
    t,
    isRtl: currentLang === 'ar',
    availableLanguages: AVAILABLE_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
