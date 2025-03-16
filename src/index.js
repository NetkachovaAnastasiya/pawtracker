import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './i18n'; // Import i18n configuration
import './index.css';
import App from './App';
import { AppProvider } from './context/AppContext';

// Loading component for Suspense fallback
// EVIDENCE: Framework React - Creating maintainable components (Trainee)
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-2xl font-bold">Loading...</div>
  </div>
);

// EVIDENCE: Framework React - Component composition (Trainee)
const AppWithProviders = () => {
  return (
    <Suspense fallback={<Loading />}>
      <AppProvider>
        <App />
      </AppProvider>
    </Suspense>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>
);