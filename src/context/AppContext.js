import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// EVIDENCE: Framework React - Context API usage to avoid prop drilling (Junior)
export const AppContext = createContext();

// EVIDENCE: Framework React - Data flow management between components (Junior)
export const AppProvider = ({ children }) => {
  // Get i18next translation function and current language
  // EVIDENCE: Libraries React - Integration with third-party libraries (Junior)
  const { i18n } = useTranslation();
  
  // UI settings
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  
  // Get the language from i18next or localStorage
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || 'medium';
  });
  
 
  // Active page (could be replaced with React Router in the future)
  const [activePage, setActivePage] = useState('home');
  
  // Save settings in localStorage
  // EVIDENCE: Framework React - useEffect for lifecycle management (Junior)
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    
    // Apply theme to body
    if (darkMode) {
      document.body.classList.add('dark', 'bg-gray-900', 'text-white');
    } else {
      document.body.classList.remove('dark', 'bg-gray-900', 'text-white');
    }
  }, [darkMode]);
  
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    
    // Apply font size to document
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
  
  // Language change handler - now using i18next
  // EVIDENCE: Framework React - Event handling (Junior)
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language); 
  };
  
  // Context value
  const contextValue = {
    // UI settings
    darkMode,
    setDarkMode,
    fontSize,
    setFontSize,
    // Language functions
    language: i18n.language,
    changeLanguage,
    // Navigation
    activePage,
    setActivePage
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};