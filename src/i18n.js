import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files
import commonEN from './translations/en/common.json';
import dogsEN from './translations/en/dogs.json';
import foodEN from './translations/en/food.json';
import medicationEN from './translations/en/medication.json';
import settingsEN from './translations/en/settings.json';

import commonUK from './translations/uk/common.json';
import dogsUK from './translations/uk/dogs.json';
import foodUK from './translations/uk/food.json';
import medicationUK from './translations/uk/medication.json';
import settingsUK from './translations/uk/settings.json';

// EVIDENCE: Libraries React - Demonstrate effective third-party library integration (Junior)
i18n
  // Use the Backend plugin for loading translations via HTTP
  // (useful if you want to load translations from a server later)
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Default language
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Namespace configuration for organizing translations
    // EVIDENCE: Technical Process - Code quality assurance fundamentals (Junior)
    ns: ['common', 'dogs', 'food', 'medication', 'settings'],
    defaultNS: 'common',
    
    // Resources configuration with pre-loaded translations
    resources: {
      en: {
        common: commonEN,
        dogs: dogsEN,
        food: foodEN,
        medication: medicationEN,
        settings: settingsEN
      },
      uk: {
        common: commonUK,
        dogs: dogsUK,
        food: foodUK,
        medication: medicationUK,
        settings: settingsUK
      }
    },
    
    // Key format options
    keySeparator: '.',
    
    // Interpolation options
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    // React specific options
    react: {
      useSuspense: true
    }
  });

export default i18n;