import React, { useContext } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { AppContext } from '../context/AppContext';

// EVIDENCE: Framework React - Creating maintainable components (Trainee)
function Header({ menuOpen, setMenuOpen }) {
  // EVIDENCE: Framework React - Context API usage (Junior)
  const { t, darkMode, setDarkMode } = useContext(AppContext);
  
  return (
    <header className={`flex justify-between items-center p-4 ${darkMode ? 'bg-gray-800' : 'bg-blue-600'} text-white`}>
      <div className="flex items-center">
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="mr-4 p-1 rounded hover:bg-opacity-20 hover:bg-white"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold">{t('appTitle')}</h1>
      </div>
      <div>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded hover:bg-opacity-20 hover:bg-white"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}

export default Header;