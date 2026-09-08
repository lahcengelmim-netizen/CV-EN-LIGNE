import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frTranslation from '../locales/fr/translation.json';
import enTranslation from '../locales/en/translation.json';
import arTranslation from '../locales/ar/translation.json';

export interface LanguageOption {
  code: 'fr' | 'en' | 'ar';
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

const resources = {
  fr: { translation: frTranslation },
  en: { translation: enTranslation },
  ar: { translation: arTranslation },
};

export const STORAGE_KEY = 'cvenligne_lang';

export const getSavedLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ['fr', 'en', 'ar'].includes(saved)) {
      return saved;
    }
  }
  return 'fr';
};

// Handle RTL and language attribute on <html> and <body>
export const updateDocumentDirection = (lang: string) => {
  if (typeof document !== 'undefined') {
    const isRtl = lang === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    if (document.body) {
      document.body.dir = isRtl ? 'rtl' : 'ltr';
    }

    if (isRtl) {
      document.documentElement.classList.add('rtl');
      document.body?.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
      document.body?.classList.remove('rtl');
    }
  }
};

const initialLang = getSavedLanguage();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en', 'ar'],
    interpolation: {
      escapeValue: false, // React handles XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage'],
    },
  });

// Apply document direction immediately
updateDocumentDirection(initialLang);

// Ensure direction updates automatically whenever language changes
i18n.on('languageChanged', (lng) => {
  const normalized = lng ? lng.split('-')[0] : 'fr';
  updateDocumentDirection(normalized);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, normalized);
  }
});

export default i18n;
