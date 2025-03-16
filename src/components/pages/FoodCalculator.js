import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';
import { DataContext } from '../../context/DataContext';
import { getDogRecommendations } from '../../utils/aiUtils';

// EVIDENCE: Framework React - Creating maintainable components (Trainee)
// EVIDENCE: Generative AI - AI integration (Junior)
function FoodCalculator() {
  // Use multiple namespaces for translations
  
  // Get UI settings from AppContext
  const { darkMode } = useContext(AppContext);
  
  // Get data and functions from DataContext
  // EVIDENCE: Framework React - Context API usage (Junior)
  const { dogs, calculations, addCalculation } = useContext(DataContext);
  
  // Calculator state
  // EVIDENCE: JavaScript - Variables and data types (Trainee)
  const [selectedDogId, setSelectedDogId] = useState('');
  const [foodType, setFoodType] = useState('dry');
  const [mealCount, setMealCount] = useState(2);
  const [calculatedPortion, setCalculatedPortion] = useState(null);
  
  // AI recommendations state
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [recommendationError, setRecommendationError] = useState(null);
  
  const { t, i18n } = useTranslation(['common', 'food']);
// Get the current language
const currentLanguage = i18n.language;
  // Calculate food portion
  // EVIDENCE: Mathematics - Using mathematical calculations (related to Technical Process)
  const calculateFoodPortion = () => {
    if (!selectedDogId) return;
    
    const dog = dogs.find(d => d.id === selectedDogId);
    if (!dog) return;
    
    // Use dog weight, activity level and food type to calculate daily portion
    let baseAmount = dog.weight * 20; // 20g per kg of body weight as base
    
    // Activity level multiplier
    const activityMultiplier = 
      dog.activityLevel === 'low' ? 0.8 :
      dog.activityLevel === 'high' ? 1.2 :
      1.0; // moderate
    
    // Food type modifier
    const foodTypeModifier = 
      foodType === 'wet' ? 2.5 : // Wet food has more volume
      foodType === 'mixed' ? 1.5 :
      foodType === 'raw' ? 0.9 :
      1.0; // dry food
    
    // Calculate daily amount
    const dailyAmount = Math.round(baseAmount * activityMultiplier * foodTypeModifier);
    // Calculate per-meal amount
    const perMealAmount = Math.round(dailyAmount / mealCount);
    
    const result = {
      daily: dailyAmount,
      perMeal: perMealAmount,
      mealCount
    };
    
    setCalculatedPortion(result);
    
    // Reset recommendations when calculating new portions
    setRecommendations(null);
    setRecommendationError(null);
    
    // Save calculation to context
    addCalculation({
      dogId: selectedDogId,
      dogName: dog.name,
      dogWeight: dog.weight,
      dogActivityLevel: dog.activityLevel,
      foodType,
      mealCount,
      dailyAmount,
      perMealAmount
    });
  };
  
  // Get AI recommendations for the dog
  // EVIDENCE: Generative AI - AI integration (Junior)
  const getRecommendations = async () => {
    if (!calculatedPortion || !selectedDogId) return;
    
    const dog = dogs.find(d => d.id === selectedDogId);
    if (!dog) return;
    
    setLoadingRecommendations(true);
    setRecommendationError(null);
    
    try {
      const result = await getDogRecommendations(dog, {
        ...calculatedPortion, 
        foodType
      }, currentLanguage);
      
      setRecommendations(result);
    } catch (error) {
      console.error("Failed to get recommendations:", error);
      setRecommendationError("Failed to get AI recommendations. Please try again later.");
    } finally {
      setLoadingRecommendations(false);
    }
  };
  
  // Format AI recommendations for display
  const formatRecommendations = (text) => {
    // Split by numbered list items or line breaks
    return text.split(/\d+\.\s|\n+/).filter(Boolean).map((item, index) => (
      <p key={index} className="mb-2">{item.trim()}</p>
    ));
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('navigation.foodCalculator')}</h2>
      
      <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl mb-4">{t('actions.calculate')}</h3>
            
            {/* Dog selection */}
            <div className="mb-4">
              <label className="block mb-1">{t('navigation.dogProfiles')}</label>
              <select
                value={selectedDogId}
                onChange={(e) => setSelectedDogId(e.target.value)}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="">{`-- ${t('food:selectDog')} --`}</option>
                {dogs.map(dog => (
                  <option key={dog.id} value={dog.id}>
                    {dog.name} ({dog.breed}, {dog.weight} kg)
                  </option>
                ))}
              </select>
            </div>
            
            {/* Food type */}
            <div className="mb-4">
              <label className="block mb-1">{t('food:foodType')}</label>
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="dry">{t('food:foodTypes.dry')}</option>
                <option value="wet">{t('food:foodTypes.wet')}</option>
                <option value="mixed">{t('food:foodTypes.mixed')}</option>
                <option value="raw">{t('food:foodTypes.raw')}</option>
              </select>
            </div>
            
            {/* Meals per day */}
            <div className="mb-4">
              <label className="block mb-1">{t('food:mealsPerDay')}</label>
              <select
                value={mealCount}
                onChange={(e) => setMealCount(parseInt(e.target.value))}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            
            <button
              onClick={calculateFoodPortion}
              disabled={!selectedDogId}
              className={`px-4 py-2 rounded ${
                darkMode 
                  ? selectedDogId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed' 
                  : selectedDogId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
              } text-white`}
            >
              {t('actions.calculate')}
            </button>
          </div>
          
          <div>
            {/* Results */}
            {calculatedPortion && (
              <div className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-xl mb-4">{t('food:dailyPortion')}</h3>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold">
                    {calculatedPortion.daily} <span className="text-lg font-normal">{t('food:gramsPerDay')}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-lg">{t('food:mealsPerDay')}: {mealCount}</div>
                  <div className="text-xl mt-2">
                    <strong>{calculatedPortion.perMeal}g</strong> {t('food:perMeal')}
                  </div>
                </div>
                
                <div className="mt-4 text-sm italic">
                  <p>{t('food:calculationDisclaimer')}</p>
                </div>
                
                {/* AI Recommendations Button */}
                <div className="mt-6">
                  <button
                    onClick={getRecommendations}
                    disabled={loadingRecommendations}
                    className={`w-full px-4 py-2 rounded ${
                      darkMode 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white flex justify-center items-center`}
                  >
                    {loadingRecommendations ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('food:loadingRecommendations')}
                      </>
                    ) : (
                      t('food:getAiRecommendations')
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* AI Recommendations */}
      {recommendations && (
        <div className={`mt-6 rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-xl mb-4">AI Care Recommendations</h3>
          <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {formatRecommendations(recommendations)}
          </div>
        </div>
      )}
      
      {/* Recommendation Error */}
      {recommendationError && (
        <div className="mt-6 rounded-lg shadow-md p-6 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200">
          <h3 className="text-xl mb-2">Error</h3>
          <p>{recommendationError}</p>
        </div>
      )}
      
      {/* Recent calculations section - unchanged */}
      {calculations.length > 0 && (
        <div className={`mt-6 rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-xl mb-4">{t('food:recentCalculations')}</h3>
          {/* Calculations table - unchanged */}
        </div>
      )}
    </div>
  );
}

export default FoodCalculator;