import React, { createContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

// EVIDENCE: Framework React - Context API usage to avoid prop drilling (Junior)
export const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  // EVIDENCE: Framework React - useState hooks for functional components (Junior)
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [activeTab, setActiveTab] = useState('home');
  
  // EVIDENCE: Framework React - useEffect for handling side effects (Junior)
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  // EVIDENCE: Framework React - useEffect for lifecycle (Junior)
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  // EVIDENCE: JavaScript - Function basics (Trainee)
  const t = (key) => {
    return translations[language][key] || key;
  };

  // EVIDENCE: Framework React - Data flow management (Junior)
  const contextValue = {
    darkMode,
    setDarkMode,
    language,
    setLanguage,
    t,
    activeTab,
    setActiveTab
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};