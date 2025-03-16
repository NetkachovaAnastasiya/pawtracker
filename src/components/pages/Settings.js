import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';

// EVIDENCE: Framework React - Creating maintainable components (Trainee)
function Settings() {
  // Use i18next for translations
  const { t } = useTranslation(['common', 'settings']);
  
  // Get UI settings from Context, including the changeLanguage function
  const { darkMode, setDarkMode, fontSize, setFontSize, language, changeLanguage } = useContext(AppContext);
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('navigation.settings')}</h2>
      
      <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Theme settings */}
        <div className="mb-6">
          <h3 className="text-xl mb-4">{t('settings:theme')}</h3>
          <div className="flex items-center">
            <button
              onClick={() => setDarkMode(false)}
              className={`px-4 py-2 rounded-l ${
                !darkMode 
                  ? 'bg-blue-500 text-white' 
                  : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
              }`}
            >
              {t('settings:lightMode')}
            </button>
            <button
              onClick={() => setDarkMode(true)}
              className={`px-4 py-2 rounded-r ${
                darkMode 
                  ? 'bg-blue-500 text-white' 
                  : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
              }`}
            >
              {t('settings:darkMode')}
            </button>
          </div>
        </div>
        
        {/* Language settings */}
        <div className="mb-6">
          <h3 className="text-xl mb-4">{t('settings:language')}</h3>
          <div className="flex items-center">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-4 py-2 rounded-l ${
                language === 'en' 
                  ? 'bg-blue-500 text-white' 
                  : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
              }`}
            >
              {t('settings:languages.en')}
            </button>
            <button
              onClick={() => changeLanguage('uk')}
              className={`px-4 py-2 rounded-r ${
                language === 'uk' 
                  ? 'bg-blue-500 text-white' 
                  : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
              }`}
            >
              {t('settings:languages.uk')}
            </button>
          </div>
        </div>
        
        {/* Font size settings */}
        <div>
          <h3 className="text-xl mb-4">{t('settings:fontSize')}</h3>
          <div className="flex items-center">
            <button
              onClick={() => setFontSize('small')}
              className={`px-4 py-2 rounded-l ${
                fontSize === 'small'
                  ? 'bg-blue-500 text-white'
                  : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
              }`}
            >
              {t('settings:fontSizes.small')}
            </button>
            <button
              onClick={() => setFontSize('medium')}
              className={`px-4 py-2 ${
                fontSize === 'medium'
                  ? 'bg-blue-500 text-white'
                  : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
              }`}
            >
              {t('settings:fontSizes.medium')}
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-4 py-2 rounded-r ${
                fontSize === 'large'
                  ? 'bg-blue-500 text-white'
                  : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
              }`}
            >
              {t('settings:fontSizes.large')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;