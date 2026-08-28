import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frTranslation from '../locales/fr/translation.json';
import enTranslation from '../locales/en/translation.json';
import arTranslation from '../locales/ar/translation.json';

const resources = {
  fr: {
    translation: frTranslation,
  },
  en: {
    translation: enTranslation,
  },
  ar: {
    translation: arTranslation,
  },
};

// Retrieve stored language preference or fallback
const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('cvenligne_lang') : null;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage || 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'cvenligne_lang',
      caches: ['localStorage'],
    },
  });

// Handle RTL for Arabic
export const updateDocumentDirection = (lang: string) => {
  if (typeof document !== 'undefined') {
    const isRtl = lang === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    if (isRtl) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }
};

// Set initial direction
updateDocumentDirection(i18n.language || 'fr');

i18n.on('languageChanged', (lng) => {
  updateDocumentDirection(lng);
  if (typeof window !== 'undefined') {
    localStorage.setItem('cvenligne_lang', lng);
  }
});

export default i18n;
