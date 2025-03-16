import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Moon, Sun ,Globe } from 'lucide-react';
import { AppContext } from '../context/AppContext';

// EVIDENCE: Framework React - Creating maintainable components (Trainee)
function Header({ menuOpen, setMenuOpen }) {
  const { t } = useTranslation('common');
  const { darkMode, setDarkMode, language, changeLanguage, activePage, setActivePage } = useContext(AppContext);
  
  // Navigation items with translation keys
  const navItems = [
    { id: 'home', key: 'navigation.home' },
    { id: 'dogProfiles', key: 'navigation.dogProfiles' },
    { id: 'foodCalculator', key: 'navigation.foodCalculator' },
    { id: 'medication', key: 'navigation.medication' },
    { id: 'settings', key: 'navigation.settings' }
  ];

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'uk' : 'en';
    changeLanguage(newLanguage);
  };
  
  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 dark:bg-gray-800 text-white">
      <div className="flex items-center">
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="mr-4 p-1 rounded md:hidden hover:bg-white hover:bg-opacity-20"
          aria-label={menuOpen ? t('accessibility.closeMenu') : t('accessibility.openMenu')}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold">{t('appTitle')}</h1>
      </div>
      
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
                {t(item.key)}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="flex items-center space-x-2">
        {/* Language toggle */}
        <button 
          onClick={toggleLanguage}
          className="p-2 rounded hover:bg-white hover:bg-opacity-20"
          aria-label="Toggle language"
          title={language === 'en' ? 'Switch to Ukrainian' : 'Switch to English'}
        >
          <Globe size={20} />
          <span className="ml-1 text-xs font-bold">{language.toUpperCase()}</span>
        </button>
        
        {/* Theme toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded hover:bg-white hover:bg-opacity-20"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}

export default Header;