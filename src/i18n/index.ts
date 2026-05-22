import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import es from './locales/es.json';
import en from './locales/en.json';
import pt from './locales/pt.json';

export const SUPPORTED_LANGS = ['es', 'en', 'pt'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      pt: { translation: pt },
    },
    supportedLngs: [...SUPPORTED_LANGS],
    fallbackLng: 'es',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'xpendia.lang',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
    returnNull: false,
  });

export default i18n;
