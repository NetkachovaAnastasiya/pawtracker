// src/App.js
import React, { useContext, useState } from 'react';
import { AppContext } from './context/AppContext';
import DogProfiles from './components/pages/DogProfiles';
import FoodCalculator from './components/pages/FoodCalculator';
import Settings from './components/pages/Settings';

// EVIDENCE: Framework React - Component composition (Trainee)
function App() {
  const { darkMode, setDarkMode, language, setLanguage, fontSize } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('dogProfiles');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Локалізовані тексти
  const texts = {
    home: language === 'uk' ? 'Головна' : 'Home',
    dogProfiles: language === 'uk' ? 'Профілі собак' : 'Dog Profiles',
    foodCalculator: language === 'uk' ? 'Калькулятор корму' : 'Food Calculator',
    medication: language === 'uk' ? 'Медикаменти' : 'Medication',
    settings: language === 'uk' ? 'Налаштування' : 'Settings',
    welcome: language === 'uk' ? 'Ласкаво просимо до PawTracker!' : 'Welcome to PawTracker!',
    welcomeMessage: language === 'uk' 
      ? 'Цей додаток допомагає вам керувати інформацією про ваших собак, розраховувати норми харчування та відстежувати прийом ліків.' 
      : 'This app helps you manage your dogs\' information, calculate food portions, and track medications.',
    startMessage: language === 'uk'
      ? 'Почніть з додавання профілю вашого собаки у розділі "Профілі собак".'
      : 'Start by adding your dog\'s profile in the "Dog Profiles" section.',
    medicationComingSoon: language === 'uk'
      ? 'Функціональність відстеження ліків буде додана скоро.'
      : 'Medication tracking functionality coming soon.'
  };


  // EVIDENCE: JavaScript - Arrays and array operations (Trainee)
  const navItems = [
    { id: 'home', label: texts.home, icon: '🏠' },
    { id: 'dogProfiles', label: texts.dogProfiles, icon: '🐕' },
    { id: 'foodCalculator', label: texts.foodCalculator, icon: '🍲' },
    { id: 'medication', label: texts.medication, icon: '💊' },
    { id: 'settings', label: texts.settings, icon: '⚙️' }
  ];

  // EVIDENCE: JavaScript - Function basics (Trainee)
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} ${
      fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base'
    }`}>
      {/* EVIDENCE: Markup and Styling - CSS approaches with utility-first methodology (Junior) */}
      <header className={`px-4 py-3 shadow-md fixed top-0 left-0 right-0 z-10 ${
        darkMode ? 'bg-gray-800' : 'bg-blue-600 text-white'
      }`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden mr-3 p-1 rounded-md hover:bg-white/10 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
            <h1 className="text-xl font-bold">PawTracker</h1>
          </div>
          
          {/* EVIDENCE: Framework React - Component composition (Trainee) */}
          <div className="flex items-center space-x-4">
            {/* Перемикач мови */}
            <div className="flex border rounded overflow-hidden">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-sm ${
                  language === 'en' 
                    ? 'bg-white text-blue-600' 
                    : 'bg-transparent text-white hover:bg-white/10'
                } transition-colors`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('uk')}
                className={`px-2 py-1 text-sm ${
                  language === 'uk' 
                    ? 'bg-white text-blue-600' 
                    : 'bg-transparent text-white hover:bg-white/10'
                } transition-colors`}
              >
                UA
              </button>
            </div>
            
            {/* Light/dark theme switch */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>
      
      {/* Main container */}
      <div className="flex pt-16 min-h-screen">
        {/* Мобільне меню */}
        {/* EVIDENCE: Framework React - Conditional rendering (Junior) */}
        {mobileMenuOpen && (
          <div className={`fixed inset-0 z-20 ${darkMode ? 'bg-black/50' : 'bg-black/30'}`} onClick={toggleMobileMenu}>
            <div 
              className={`w-64 h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg">PawTracker</h2>
                <button 
                  onClick={toggleMobileMenu}
                  className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>
              <nav>
                <ul className="space-y-2">
                  {/* EVIDENCE: Framework React - List rendering with proper keys */}
                  {navItems.map(item => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                          activeTab === item.id
                            ? (darkMode ? 'bg-gray-700' : 'bg-blue-100 text-blue-800')
                            : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                        } transition-colors`}
                      >
                        <span className="mr-3 text-xl">{item.icon}</span>
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
        
        {/* Side navigation */}
        <aside className={`w-64 p-4 hidden md:block ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <nav>
            <ul className="space-y-2">
              {navItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeTab === item.id
                        ? (darkMode ? 'bg-gray-700' : 'bg-blue-100 text-blue-800')
                        : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                    } transition-colors`}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        <main className="flex-grow p-6">
          <div className="container mx-auto">
            {/* EVIDENCE: Framework React - Conditional rendering with various approaches */}
            {activeTab === 'home' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">{texts.welcome}</h2>
                
                <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <p className="mb-4">{texts.welcomeMessage}</p>
                  <p>{texts.startMessage}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {navItems.slice(1).map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`p-4 rounded-lg shadow-md text-center ${
                        darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <div className="text-3xl mb-3">{item.icon}</div>
                      <div className="font-medium">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'dogProfiles' && <DogProfiles />}
            {activeTab === 'foodCalculator' && <FoodCalculator />}
            
            {activeTab === 'medication' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{texts.medication}</h2>
                <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <p>{texts.medicationComingSoon}</p>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && <Settings />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;