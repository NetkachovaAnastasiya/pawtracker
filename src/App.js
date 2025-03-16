import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './components/pages/HomePage';
import DogProfiles from './components/pages/DogProfiles';
import FoodCalculator from './components/pages/FoodCalculator';
import Medication from './components/pages/Medication';
import Settings from './components/pages/Settings';

// EVIDENCE: Framework React - Component composition (Trainee)
function AppContent() {
  const { t } = useTranslation('common');
  const [activePage, setActivePage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <Header 
        menuOpen={mobileMenuOpen} 
        setMenuOpen={setMobileMenuOpen} 
        activePage={activePage}
        setActivePage={setActivePage}
      />
      
      <div className="flex">
        <Sidebar 
          menuOpen={mobileMenuOpen} 
          activePage={activePage}
          setActivePage={setActivePage}
        />
        
        <main className="flex-grow p-4">
          <div className="container mx-auto">
            {/* Conditional rendering based on active page */}
            {activePage === 'home' && <HomePage setActivePage={setActivePage} />}
            {activePage === 'dogProfiles' && <DogProfiles />}
            {activePage === 'foodCalculator' && <FoodCalculator />}
            {activePage === 'medication' && <Medication />}
            {activePage === 'settings' && <Settings />}
          </div>
        </main>
      </div>
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