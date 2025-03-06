import React, { createContext, useState, useEffect } from 'react';

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
    addDog: "Add Dog",
    dogName: "Dog Name",
    breed: "Breed",
    weight: "Weight (kg)",
    age: "Age (years)",
    activityLevel: "Activity Level",
    low: "Low",
    moderate: "Moderate",
    high: "High",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    foodType: "Food Type",
    dryFood: "Dry Food",
    wetFood: "Wet Food",
    mixedFood: "Mixed Food",
    calculate: "Calculate",
    dailyPortion: "Daily Portion",
    mealsPerDay: "Meals per day",
    medicationName: "Medication Name",
    dose: "Dose",
    frequency: "Frequency",
    startDate: "Start Date",
    endDate: "End Date",
    notes: "Notes",
    theme: "Theme",
    language: "Language",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    gramsPerDay: "grams per day",
    perMeal: "per meal",
    daily: "Daily",
    weekly: "Weekly",
    biweekly: "Bi-weekly",
    monthly: "Monthly",
    welcome: "Welcome to PawTracker!",
    welcomeMessage: "This app helps you manage your dog's information, food, and medications."
  },
  uk: {
    appTitle: "PawTracker",
    home: "Головна",
    dogProfiles: "Профілі собак",
    foodCalculator: "Калькулятор їжі",
    medication: "Медикаменти",
    settings: "Налаштування",
    addDog: "Додати собаку",
    dogName: "Ім'я собаки",
    breed: "Порода",
    weight: "Вага (кг)",
    age: "Вік (роки)",
    activityLevel: "Рівень активності",
    low: "Низький",
    moderate: "Середній",
    high: "Високий",
    save: "Зберегти",
    cancel: "Скасувати",
    delete: "Видалити",
    edit: "Редагувати",
    foodType: "Тип їжі",
    dryFood: "Сухий корм",
    wetFood: "Вологий корм",
    mixedFood: "Змішаний корм",
    calculate: "Розрахувати",
    dailyPortion: "Денна порція",
    mealsPerDay: "Прийомів їжі на день",
    medicationName: "Назва ліків",
    dose: "Доза",
    frequency: "Частота",
    startDate: "Дата початку",
    endDate: "Дата закінчення",
    notes: "Примітки",
    theme: "Тема",
    language: "Мова",
    darkMode: "Темний режим",
    lightMode: "Світлий режим",
    gramsPerDay: "грамів на день",
    perMeal: "на прийом",
    daily: "Щодня",
    weekly: "Щотижня",
    biweekly: "Раз на два тижні",
    monthly: "Щомісяця",
    welcome: "Ласкаво просимо до PawTracker!",
    welcomeMessage: "Цей додаток допомагає вам керувати інформацією про собаку, їжу та ліки."
  }
};

// EVIDENCE: Framework React - Data flow management between components (Junior)
export const AppProvider = ({ children }) => {
  // Load saved preferences from localStorage
  // EVIDENCE: JavaScript - Variables and data types (Trainee)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  
  const [activePage, setActivePage] = useState('home');
  
  // Save preferences to localStorage when they change
  // EVIDENCE: Framework React - useEffect for lifecycle (Junior)
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Apply dark mode to document body
    if (darkMode) {
      document.body.classList.add('dark', 'bg-gray-900', 'text-white');
    } else {
      document.body.classList.remove('dark', 'bg-gray-900', 'text-white');
    }
  }, [darkMode]);
  
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  // Translation function
  // EVIDENCE: JavaScript - Function basics (Trainee)
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  // Context value
  const contextValue = {
    darkMode,
    setDarkMode,
    language,
    setLanguage,
    activePage,
    setActivePage,
    t
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};