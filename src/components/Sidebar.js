import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Dog, PieChart, Pill, Settings } from 'lucide-react';
import { AppContext } from '../context/AppContext';

// EVIDENCE: Framework React - Component composition (Trainee)
function Sidebar({ menuOpen, activePage, setActivePage }) {
  const { t } = useTranslation('common');
  const { darkMode } = useContext(AppContext);
  
  // Navigation items with icons and translation keys
  // EVIDENCE: JavaScript - Arrays and array operations (Trainee)
  const navItems = [
    { id: 'home', key: 'navigation.home', icon: <Home size={18} /> },
    { id: 'dogProfiles', key: 'navigation.dogProfiles', icon: <Dog size={18} /> },
    { id: 'foodCalculator', key: 'navigation.foodCalculator', icon: <PieChart size={18} /> },
    { id: 'medication', key: 'navigation.medication', icon: <Pill size={18} /> },
    { id: 'settings', key: 'navigation.settings', icon: <Settings size={18} /> }
  ];
  
  return (
    <aside className={`${menuOpen ? 'block' : 'hidden'} md:block w-64 h-screen bg-white dark:bg-gray-800 shadow-lg`}>
      <nav className="p-4">
        <ul>
          {/* Map through navigation items array to render nav links */}
          {/* EVIDENCE: Framework React - List rendering with proper keys (Junior) */}
          {navItems.map(item => (
            <li key={item.id} className="mb-2">
              <button 
                onClick={() => setActivePage(item.id)}
                className={`flex items-center w-full p-2 rounded text-left
                  ${activePage === item.id 
                    ? (darkMode ? 'bg-gray-700' : 'bg-gray-200') 
                    : ''}
                  ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <span className="mr-3">{item.icon}</span>
                {t(item.key)}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;