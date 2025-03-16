// src/context/AppContext.js
import React, { createContext, useState, useEffect, useMemo } from 'react';
import { createLoggerService } from '../services/loggerService';
import { createAuthService } from '../services/authService';
import { createApiService } from '../services/apiService';

// EVIDENCE: Framework React - Context API usage to avoid prop drilling (Junior)
export const AppContext = createContext();

// Translation dictionary
// EVIDENCE: Generative AI - AI-assisted content generation for translations
const translations = {
  en: {
    appTitle: "PawTracker",
    home: "Home",
    dogProfiles: "Dog Profiles",
    foodCalculator: "Food Calculator",
    medication: "Medication",
    settings: "Settings",
    fontSize: "Font Size",
    fontSizeSmall: "Small",
    fontSizeMedium: "Medium",
    fontSizeLarge: "Large",
    // Інші переклади...
  },
  uk: {
    appTitle: "PawTracker",
    home: "Головна",
    dogProfiles: "Профілі собак",
    foodCalculator: "Калькулятор їжі",
    medication: "Медикаменти",
    settings: "Налаштування",
    fontSize: "Розмір шрифту",
    fontSizeSmall: "Малий",
    fontSizeMedium: "Середній",
    fontSizeLarge: "Великий",
    // Інші переклади...
  }
};

// EVIDENCE: Framework React - Data flow management between components 
export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || 'medium';
  });
  
  // Ініціалізація сервісів з використанням useMemo для запобігання непотрібних перестворень
  // EVIDENCE: JavaScript - Optimization techniques (Junior)
  const services = useMemo(() => {
    const logger = createLoggerService();
    const auth = createAuthService(logger);
    const api = createApiService(auth, logger);
    
    return { logger, auth, api };
  }, []);
  
  // Активна сторінка (може бути замінена на React Router в майбутньому)
  const [activePage, setActivePage] = useState('home');
  
  // Зберігаємо налаштування в localStorage
  // EVIDENCE: Framework React - useEffect for lifecycle (Junior)
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    
    // Застосовуємо тему до body
    if (darkMode) {
      document.body.classList.add('dark', 'bg-gray-900', 'text-white');
    } else {
      document.body.classList.remove('dark', 'bg-gray-900', 'text-white');
    }
  }, [darkMode]);
  
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    
    // Font size
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    
    switch (fontSize) {
      case 'small':
        document.documentElement.classList.add('text-sm');
        break;
      case 'large':
        document.documentElement.classList.add('text-lg');
        break;
      default: // medium
        document.documentElement.classList.add('text-base');
    }
  }, [fontSize]);
  
  // Функція перекладу
  const t = (key) => translations[language][key] || key;
  
  // Контекстне значення
  const contextValue = {
    // UI налаштування
    darkMode,
    setDarkMode,
    language,
    setLanguage,
    fontSize,
    setFontSize,
    // Навігація
    activePage,
    setActivePage,
    // Функціонал
    t,
    // Сервіси
    services
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};