import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

// EVIDENCE: Framework React - Creating maintainable components (Trainee)
function HomePage() {
  const { t, darkMode } = useContext(AppContext);
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('navHome')}</h2>
      
      {/* Placeholder content - will be expanded later */}
      <div className={`rounded-lg shadow-md p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-xl font-semibold mb-3">Welcome to PawTracker!</h3>
        <p>This application helps you manage your dogs' profiles, calculate food portions, and track medications.</p>
        <p className="mt-2">To get started, add a dog profile in the {t('navProfiles')} section.</p>
      </div>
    </div>
  );
}

export default HomePage;