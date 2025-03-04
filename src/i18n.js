// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true, // Set to false in production
    ns: ['tarot', 'counsellor', 'auth', 'home', 'routes_titles', 'misc'], // Add your namespaces here
    defaultNS: 'misc', // Default namespace if none specified
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'  // Path to translation files
    }
  });

export default i18n;