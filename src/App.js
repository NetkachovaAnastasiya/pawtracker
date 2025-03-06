// src/App.js
import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import DogProfiles from './components/pages/DogProfiles';
import FoodCalculator from './components/pages/FoodCalculator';
import Medication from './components/pages/Medication';
import Settings from './components/pages/Settings';

// EVIDENCE: Framework React - Component composition (Trainee)
function AppContent() {
  const { darkMode, t, activePage, setActivePage } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Navigation items
  // EVIDENCE: JavaScript - Arrays and array operations (Trainee)
  const navItems = [
    { id: 'home', label: t('home'), icon: '🏠' },
    { id: 'dogProfiles', label: t('dogProfiles'), icon: '🐕' },
    { id: 'foodCalculator', label: t('foodCalculator'), icon: '🍲' },
    { id: 'medication', label: t('medication'), icon: '💊' },
    { id: 'settings', label: t('settings'), icon: '⚙️' }
  ];
  
  // Home page content
  const HomePage = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-2xl font-bold mb-4">{t('welcome')}</h2>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
          {t('welcomeMessage')}
        </p>
      </div>
      
      {/* Quick links */}
      <div className="grid md:grid-cols-3 gap-4">
        {navItems.slice(1).map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`p-4 rounded-lg shadow-md text-center ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="font-medium">{item.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Header */}
      <header className={`p-4 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-blue-600 text-white'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">{t('appTitle')}</h1>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {navItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setActivePage(item.id)}
                    className={`px-2 py-1 rounded ${
                      activePage === item.id 
                        ? (darkMode ? 'bg-gray-700' : 'bg-blue-700') 
                        : 'hover:bg-opacity-80'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <ul className="py-2">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActivePage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 ${
                    activePage === item.id 
                      ? (darkMode ? 'bg-gray-700' : 'bg-gray-100')
                      : ''
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
      
      {/* Main content */}
      <main className="container mx-auto p-4 mt-4">
        {/* Conditional rendering based on active page */}
        {/* EVIDENCE: Framework React - Conditional rendering with various approaches (Junior) */}
        {activePage === 'home' && <HomePage />}
        {activePage === 'dogProfiles' && <DogProfiles />}
        {activePage === 'foodCalculator' && <FoodCalculator />}
        {activePage === 'medication' && <Medication />}
        {activePage === 'settings' && <Settings />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;