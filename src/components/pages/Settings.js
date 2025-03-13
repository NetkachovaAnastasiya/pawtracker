// src/components/pages/Settings.js
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

function Settings() {
  const { darkMode, setDarkMode, language, setLanguage, fontSize, setFontSize } = useContext(AppContext);
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">Налаштування</h2>
      
      {/* Тема */}
      <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-xl font-semibold mb-4">Тема</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(false)}
            className={`px-4 py-2 rounded-md ${
              !darkMode 
                ? 'bg-blue-500 text-white' 
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
            } transition-colors duration-200`}
          >
            Світла
          </button>
          <button
            onClick={() => setDarkMode(true)}
            className={`px-4 py-2 rounded-md ${
              darkMode 
                ? 'bg-blue-500 text-white' 
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
            } transition-colors duration-200`}
          >
            Темна
          </button>
        </div>
      </div>
      
      {/* Мова */}
      <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-xl font-semibold mb-4">Мова</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-md ${
              language === 'en' 
                ? 'bg-blue-500 text-white' 
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
            } transition-colors duration-200`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('uk')}
            className={`px-4 py-2 rounded-md ${
              language === 'uk' 
                ? 'bg-blue-500 text-white' 
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
            } transition-colors duration-200`}
          >
            Українська
          </button>
        </div>
      </div>
      
      {/* Розмір шрифту */}
      <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-xl font-semibold mb-4">Розмір шрифту</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setFontSize('small')}
            className={`px-4 py-2 rounded-md text-sm ${
              fontSize === 'small' 
                ? 'bg-blue-500 text-white' 
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
            } transition-colors duration-200`}
          >
            Малий
          </button>
          <button
            onClick={() => setFontSize('medium')}
            className={`px-4 py-2 rounded-md ${
              fontSize === 'medium' 
                ? 'bg-blue-500 text-white' 
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
            } transition-colors duration-200`}
          >
            Середній
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`px-4 py-2 rounded-md text-lg ${
              fontSize === 'large' 
                ? 'bg-blue-500 text-white' 
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
            } transition-colors duration-200`}
          >
            Великий
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;