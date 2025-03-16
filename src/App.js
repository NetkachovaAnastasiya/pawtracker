import React, { useContext } from 'react';
import { AppContext, AppProvider } from './context/AppContext';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './components/pages/HomePage';
import DogProfiles from './components/pages/DogProfiles';
import FoodCalculator from './components/pages/FoodCalculator';
import Medication from './components/pages/Medication';
import Settings from './components/pages/Settings';

// Main component structure
function AppContent() {
  // Use useContext with AppContext, not AppProvider.context
  const { activePage } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      
      <div className="flex">
        <Sidebar menuOpen={menuOpen} />
        
        <main className="flex-grow p-4">
          <div className="container mx-auto">
            {activePage === 'home' && <HomePage />}
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
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AppProvider>
  );
}

export default App;