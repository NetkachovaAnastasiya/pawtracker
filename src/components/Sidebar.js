import React, { useContext } from 'react';
import { Settings } from 'lucide-react';
import { AppContext } from '../context/AppContext';

// EVIDENCE: Framework React - Component composition (Trainee)
function Sidebar({ menuOpen }) {
  const { t, darkMode, activeTab, setActiveTab } = useContext(AppContext);
  
  // EVIDENCE: JavaScript - Arrays and array operations (Trainee)
  const navItems = [
    { id: 'home', label: t('navHome'), icon: <span>🏠</span> },
    { id: 'profiles', label: t('navProfiles'), icon: <span>🐕</span> },
    { id: 'food', label: t('navFood'), icon: <span>🍲</span> },
    { id: 'medication', label: t('navMedication'), icon: <span>💊</span> },
    { id: 'settings', label: t('navSettings'), icon: <Settings size={18} /> }
  ];
  
  return (
    <aside className={`${menuOpen ? 'block' : 'hidden'} md:block w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <nav className="p-4">
        <ul>
          {/* EVIDENCE: Framework React - List rendering with proper keys (Junior) */}
          {navItems.map(item => (
            <li key={item.id} className="mb-2">
              <a 
                href={`#${item.id}`} 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.id);
                }}
                className={`flex items-center p-2 rounded 
                  ${activeTab === item.id 
                    ? (darkMode ? 'bg-gray-700' : 'bg-gray-200') 
                    : ''}
                  ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;