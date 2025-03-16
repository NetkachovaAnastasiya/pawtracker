import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';

// EVIDENCE: Framework React - Creating maintainable components (Trainee)
function HomePage({ setActivePage }) {  // Accept setActivePage as a prop
  const { t } = useTranslation('common');
  const { darkMode } = useContext(AppContext);
  
  // Quick navigation data with translation keys
  const navCards = [
    { id: 'dogProfiles', key: 'navigation.dogProfiles', descKey: 'home.dogProfilesDescription' },
    { id: 'foodCalculator', key: 'navigation.foodCalculator', descKey: 'home.foodCalculatorDescription' },
    { id: 'medication', key: 'navigation.medication', descKey: 'home.medicationDescription' },
    { id: 'settings', key: 'navigation.settings', descKey: 'home.settingsDescription' }
  ];
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('navigation.home')}</h2>
      
      <div className={`rounded-lg shadow-md p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-2xl font-bold mb-4">{t('welcome')}</h3>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
          {t('welcomeMessage')}
        </p>
      </div>
      
      {/* Quick navigation cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {navCards.map(card => (
          <div 
            key={card.id}
            onClick={() => setActivePage(card.id)}
            className={`p-6 rounded-lg shadow-md cursor-pointer ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">{t(card.key)}</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {t(card.descKey)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;