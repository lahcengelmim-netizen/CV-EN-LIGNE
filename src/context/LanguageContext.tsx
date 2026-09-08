import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import i18n, { SUPPORTED_LANGUAGES, updateDocumentDirection, STORAGE_KEY, type LanguageOption } from '../lib/i18n';

export type LanguageCode = 'fr' | 'en' | 'ar';

export interface LanguageContextType {
  language: LanguageCode;
  currentLang: LanguageCode;
  changeLanguage: (lang: string) => Promise<void>;
  setLanguage: (lang: string) => Promise<void>;
  isRtl: boolean;
  dir: 'rtl' | 'ltr';
  t: (key: string, optionsOrFallback?: any) => string;
  availableLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode; defaultLanguage?: LanguageCode }> = ({
  children,
  defaultLanguage = 'fr',
}) => {
  const { t: i18nT, i18n: i18nInstance } = useI18nextTranslation();

  const getInitialLang = (): LanguageCode => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ['fr', 'en', 'ar'].includes(saved)) {
        return saved as LanguageCode;
      }
    }
    const current = (i18nInstance.language || defaultLanguage).split('-')[0];
    return (['fr', 'en', 'ar'].includes(current) ? current : defaultLanguage) as LanguageCode;
  };

  const [language, setLangState] = useState<LanguageCode>(getInitialLang);

  // Synchronize state when i18n changes language
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      const normalized = (lng ? lng.split('-')[0] : 'fr') as LanguageCode;
      if (['fr', 'en', 'ar'].includes(normalized)) {
        setLangState(normalized);
        updateDocumentDirection(normalized);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, normalized);
        }
      }
    };

    i18nInstance.on('languageChanged', handleLanguageChanged);
    updateDocumentDirection(language);

    return () => {
      i18nInstance.off('languageChanged', handleLanguageChanged);
    };
  }, [i18nInstance, language]);

  const changeLanguage = useCallback(
    async (newLang: string) => {
      const normalized = (newLang ? newLang.split('-')[0] : 'fr') as LanguageCode;
      if (['fr', 'en', 'ar'].includes(normalized)) {
        await i18n.changeLanguage(normalized);
        setLangState(normalized);
        updateDocumentDirection(normalized);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, normalized);
        }
      }
    },
    []
  );

  // Robust translation function with dot-notation and fallback
  const t = useCallback(
    (key: string, optionsOrFallback?: any): string => {
      if (!key) return '';

      // If optionsOrFallback is a string, it might be a fallback text
      const fallback = typeof optionsOrFallback === 'string' ? optionsOrFallback : '';
      const options = typeof optionsOrFallback === 'object' ? optionsOrFallback : {};

      const result = i18nT(key, { defaultValue: fallback || undefined, ...options });

      // If result is the key itself and fallback is provided, return fallback
      if (result === key && fallback) {
        return fallback;
      }

      return typeof result === 'string' ? result : String(result ?? '');
    },
    [i18nT]
  );

  const isRtl = language === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      currentLang: language,
      changeLanguage,
      setLanguage: changeLanguage,
      isRtl,
      dir,
      t,
      availableLanguages: SUPPORTED_LANGUAGES,
    }),
    [language, changeLanguage, isRtl, dir, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if called outside Provider
    const current = (i18n.language ? i18n.language.split('-')[0] : 'fr') as LanguageCode;
    const isRtl = current === 'ar';
    return {
      language: current,
      currentLang: current,
      changeLanguage: async (l: string) => {
        await i18n.changeLanguage(l);
      },
      setLanguage: async (l: string) => {
        await i18n.changeLanguage(l);
      },
      isRtl,
      dir: isRtl ? 'rtl' : 'ltr',
      t: (key: string, fallback?: any) => {
        const res = i18n.t(key, { defaultValue: typeof fallback === 'string' ? fallback : undefined });
        return typeof res === 'string' ? res : key;
      },
      availableLanguages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
};

// Also export useTranslation compatible with custom context
export const useTranslation = () => {
  return useLanguage();
};

export default LanguageContext;
