// src/components/pages/FoodCalculator.js
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

function FoodCalculator() {
  const { darkMode, language } = useContext(AppContext);
  
  // Localized texts
  const texts = {
    title: language === 'uk' ? 'Калькулятор корму' : 'Food Calculator',
    selectDog: language === 'uk' ? 'Оберіть собаку' : 'Select a dog',
    noDogs: language === 'uk' ? 'Не знайдено жодної собаки. Будь ласка, спочатку додайте профіль собаки.' : 'No dogs found. Please add a dog profile first.',
    foodType: language === 'uk' ? 'Тип корму' : 'Food Type',
    dryFood: language === 'uk' ? 'Сухий корм' : 'Dry Food',
    wetFood: language === 'uk' ? 'Вологий корм' : 'Wet Food',
    mixedFood: language === 'uk' ? 'Змішаний корм' : 'Mixed Food',
    rawFood: language === 'uk' ? 'Сира їжа' : 'Raw Diet',
    mealsPerDay: language === 'uk' ? 'Прийомів їжі на день' : 'Meals per day',
    calculate: language === 'uk' ? 'Розрахувати' : 'Calculate',
    dailyPortion: language === 'uk' ? 'Денна порція' : 'Daily Portion',
    gramsPerDay: language === 'uk' ? 'грам на день' : 'grams per day',
    perMeal: language === 'uk' ? 'на прийом їжі' : 'per meal',
    disclaimer: language === 'uk' ? 'Цей розрахунок є приблизним і може потребувати коригування в залежності від індивідуальних потреб вашого собаки та рекомендацій ветеринара.' : 'This calculation is an estimate and may need adjustment based on your dog\'s individual needs and your veterinarian\'s recommendations.',
    recentCalculations: language === 'uk' ? 'Нещодавні розрахунки' : 'Recent Calculations',
    saveCalculation: language === 'uk' ? 'Зберегти розрахунок' : 'Save Calculation',
    savedCalculations: language === 'uk' ? 'Збережені розрахунки' : 'Saved Calculations',
    noRecentCalculations: language === 'uk' ? 'Немає нещодавніх розрахунків' : 'No recent calculations',
    noSavedCalculations: language === 'uk' ? 'Немає збережених розрахунків' : 'No saved calculations',
    getMoreRecommendations: language === 'uk' ? 'Отримати більше рекомендацій' : 'Get More Recommendations',
    nutritionRecommendations: language === 'uk' ? 'Рекомендації з харчування' : 'Nutrition Recommendations',
    loadingRecommendations: language === 'uk' ? 'Завантаження рекомендацій...' : 'Loading recommendations...',
    aiGeneratedNote: language === 'uk' ? 'Ці рекомендації згенеровані штучним інтелектом на основі даних вашого собаки.' : 'These recommendations are AI-generated based on your dog\'s data.',
    fallbackNote: language === 'uk' ? 'Використано резервний генератор через недоступність API.' : 'Using fallback generator due to API unavailability.',
    errorFetchingRecommendations: language === 'uk' ? 'Помилка при отриманні рекомендацій. Будь ласка, спробуйте ще раз пізніше.' : 'Error fetching recommendations. Please try again later.'
  };
  
  // Load dogs list from localStorage
  const [dogs, setDogs] = useState(() => {
    const saved = localStorage.getItem('dogs');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Calculator state
  const [selectedDogId, setSelectedDogId] = useState('');
  const [foodType, setFoodType] = useState('dry');
  const [mealCount, setMealCount] = useState(2);
  const [calculatedPortion, setCalculatedPortion] = useState(null);
  
  // Recommendations state
  const [recommendations, setRecommendations] = useState(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendationError, setRecommendationError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  
  // Calculation history
  const [recentCalculations, setRecentCalculations] = useState(() => {
    const saved = localStorage.getItem('recentCalculations');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [savedCalculations, setSavedCalculations] = useState(() => {
    const saved = localStorage.getItem('savedCalculations');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Effect to save calculation history
  useEffect(() => {
    localStorage.setItem('recentCalculations', JSON.stringify(recentCalculations));
  }, [recentCalculations]);
  
  useEffect(() => {
    localStorage.setItem('savedCalculations', JSON.stringify(savedCalculations));
  }, [savedCalculations]);
  
  // Calculate food portion
  const calculateFoodPortion = () => {
    if (!selectedDogId) return;
    
    const dog = dogs.find(d => d.id === selectedDogId);
    if (!dog) return;
    
    // Base amount: 20g per kg of weight
    let baseAmount = dog.weight * 20;
    
    // Activity multiplier
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
    
    // Calculate amount per meal
    const perMealAmount = Math.round(dailyAmount / mealCount);
    
    const calculation = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      dog: {
        id: dog.id,
        name: dog.name,
        breed: dog.breed,
        weight: dog.weight,
        activityLevel: dog.activityLevel
      },
      foodType,
      mealCount,
      dailyAmount,
      perMealAmount
    };
    
    setCalculatedPortion(calculation);
    
    // Add to calculation history
    setRecentCalculations([calculation, ...recentCalculations.slice(0, 4)]);
    
    // Reset previous recommendations
    setRecommendations(null);
    setRecommendationError(null);
    setUsingFallback(false);
  };
  
  // Get recommendations from Hugging Face API via our server
  const getRecommendations = async () => {
    if (!calculatedPortion) return;
    
    setIsLoadingRecommendations(true);
    setRecommendations(null);
    setRecommendationError(null);
    setUsingFallback(false);
    
    try {
      // Server API URL
      const apiUrl = 'http://localhost:3001/api/huggingface-recommendations';
      
      console.log('Sending request to recommendation API...');
      console.log('Request data:', {
        dogName: calculatedPortion.dog.name,
        dogBreed: calculatedPortion.dog.breed,
        foodType: getFoodTypeText(calculatedPortion.foodType)
      });
      
      // Send request to server
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dogData: calculatedPortion.dog,
          foodType: getFoodTypeText(calculatedPortion.foodType),
          calculatedPortion: {
            dailyAmount: calculatedPortion.dailyAmount,
            mealCount: calculatedPortion.mealCount
          },
          language: language
        })
      });
      
      // Get response data
      const data = await response.json();
      
      // If server sent an error but still provided fallback recommendations
      if (data.error && data.fallback) {
        console.log('API error with fallback:', data.error);
        setUsingFallback(true);
        setRecommendations(data.recommendations);
      } else if (data.error) {
        // If there's an error without fallback
        throw new Error(data.error);
      } else {
        // Success case
        console.log('Recommendation received successfully');
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendationError(
        language === 'uk' 
          ? `Помилка при отриманні рекомендацій: ${error.message}. Будь ласка, спробуйте ще раз пізніше.` 
          : `Error fetching recommendations: ${error.message}. Please try again later.`
      );
    } finally {
      setIsLoadingRecommendations(false);
    }
  };
  
  // Add calculation to saved list
  const addToSavedCalculations = (calculation) => {
    if (!savedCalculations.some(calc => calc.id === calculation.id)) {
      setSavedCalculations([...savedCalculations, calculation]);
    }
  };
  
  // Remove calculation from saved list
  const removeSavedCalculation = (id) => {
    setSavedCalculations(savedCalculations.filter(calc => calc.id !== id));
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'uk' ? 'uk-UA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get localized text for activity level
  const getActivityLevelText = (level) => {
    if (language === 'uk') {
      return level === 'low' ? 'Низька' : 
             level === 'high' ? 'Висока' : 'Середня';
    } else {
      return level === 'low' ? 'Low' : 
             level === 'high' ? 'High' : 'Moderate';
    }
  };
  
  // Get localized text for food type
  const getFoodTypeText = (type) => {
    if (language === 'uk') {
      switch(type) {
        case 'wet': return 'Вологий корм';
        case 'mixed': return 'Змішаний корм';
        case 'raw': return 'Сира їжа';
        default: return 'Сухий корм';
      }
    } else {
      switch(type) {
        case 'wet': return 'Wet Food';
        case 'mixed': return 'Mixed Food';
        case 'raw': return 'Raw Diet';
        default: return 'Dry Food';
      }
    }
  };
  
  // Render calculation item
  const renderCalculation = (calculation, isSaved = false) => (
    <div 
      key={calculation.id}
      className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-lg">{calculation.dog.name}</h4>
          <div className="text-sm opacity-75">{formatDate(calculation.timestamp)}</div>
        </div>
        
        {isSaved ? (
          <button
            onClick={() => removeSavedCalculation(calculation.id)}
            className="text-red-500 hover:text-red-700"
          >
            {language === 'uk' ? 'Видалити' : 'Remove'}
          </button>
        ) : (
          <button
            onClick={() => addToSavedCalculations(calculation)}
            className={`text-blue-500 hover:text-blue-700 ${
              savedCalculations.some(calc => calc.id === calculation.id) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={savedCalculations.some(calc => calc.id === calculation.id)}
          >
            {texts.saveCalculation}
          </button>
        )}
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <div><span className="font-medium">{language === 'uk' ? 'Порода:' : 'Breed:'}</span> {calculation.dog.breed}</div>
        <div><span className="font-medium">{language === 'uk' ? 'Вага:' : 'Weight:'}</span> {calculation.dog.weight} kg</div>
        <div><span className="font-medium">{language === 'uk' ? 'Активність:' : 'Activity:'}</span> {getActivityLevelText(calculation.dog.activityLevel)}</div>
        <div><span className="font-medium">{language === 'uk' ? 'Тип корму:' : 'Food Type:'}</span> {getFoodTypeText(calculation.foodType)}</div>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-4 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold">{calculation.dailyAmount} {language === 'uk' ? 'г/день' : 'g/day'}</div>
          <div className="text-xs opacity-75">{language === 'uk' ? 'Денна норма' : 'Daily portion'}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">{calculation.perMealAmount} {language === 'uk' ? 'г/прийом' : 'g/meal'}</div>
          <div className="text-xs opacity-75">{calculation.mealCount} {language === 'uk' ? 'прийоми їжі' : 'meals'}</div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">{texts.title}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator */}
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} lg:col-span-2`}>
          <h3 className="text-xl font-semibold mb-4">{texts.calculate}</h3>
          
          {dogs.length === 0 ? (
            <p className="text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
              {texts.noDogs}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Dog selection */}
                <div>
                  <label className="block mb-1 font-medium">{texts.selectDog}</label>
                  <select
                    value={selectedDogId}
                    onChange={(e) => setSelectedDogId(e.target.value)}
                    className={`w-full p-2 border rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                  >
                    <option value="">-- {texts.selectDog} --</option>
                    {dogs.map(dog => (
                      <option key={dog.id} value={dog.id}>
                        {dog.name} ({dog.breed}, {dog.weight} kg)
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Food type */}
                <div>
                  <label className="block mb-1 font-medium">{texts.foodType}</label>
                  <select
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    className={`w-full p-2 border rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                  >
                    <option value="dry">{texts.dryFood}</option>
                    <option value="wet">{texts.wetFood}</option>
                    <option value="mixed">{texts.mixedFood}</option>
                    <option value="raw">{texts.rawFood}</option>
                  </select>
                </div>
                
                {/* Meals per day */}
                <div>
                  <label className="block mb-1 font-medium">{texts.mealsPerDay}</label>
                  <select
                    value={mealCount}
                    onChange={(e) => setMealCount(parseInt(e.target.value))}
                    className={`w-full p-2 border rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={calculateFoodPortion}
                disabled={!selectedDogId}
                className={`px-4 py-2 rounded-md ${
                  darkMode 
                    ? selectedDogId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed' 
                    : selectedDogId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
                } text-white font-medium transition-colors duration-200`}
              >
                {texts.calculate}
              </button>
              
              {/* Calculation results */}
              {calculatedPortion && (
                <div className={`mt-6 border rounded-lg p-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h4 className="text-xl font-semibold mb-4">{texts.dailyPortion}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                      <div className="text-3xl font-bold mb-1">
                        {calculatedPortion.dailyAmount}
                      </div>
                      <div className="text-sm opacity-75">{texts.gramsPerDay}</div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-50 dark:bg-green-900/30">
                      <div className="text-3xl font-bold mb-1">
                        {calculatedPortion.perMealAmount}
                      </div>
                      <div className="text-sm opacity-75">{mealCount} {language === 'uk' ? 'прийоми — ' : 'meals — '}{texts.perMeal}</div>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm italic opacity-75">
                    {texts.disclaimer}
                  </p>
                  
                  {/* "Get More Recommendations" button */}
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={getRecommendations}
                      disabled={isLoadingRecommendations}
                      className={`px-4 py-2 rounded-md ${
                        darkMode 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white font-medium transition-colors duration-200 flex items-center`}
                    >
                      {isLoadingRecommendations && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {isLoadingRecommendations ? texts.loadingRecommendations : texts.getMoreRecommendations}
                    </button>
                  </div>
                  
                  {/* Error message if present */}
                  {recommendationError && (
                    <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300">
                      {recommendationError}
                    </div>
                  )}
                  
                  {/* Display recommendations */}
                  {recommendations && (
                    <div className={`mt-6 border rounded-lg p-6 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                      <h4 className="text-xl font-semibold mb-4">{texts.nutritionRecommendations}</h4>
                      
                      <div 
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: recommendations }}
                      ></div>
                      
                      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 italic text-center">
                        {usingFallback ? texts.fallbackNote : texts.aiGeneratedNote}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Calculation history */}
        <div className="space-y-6">
          {/* Recent calculations */}
          <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-4">{texts.recentCalculations}</h3>
            
            {recentCalculations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {texts.noRecentCalculations}
              </p>
            ) : (
              <div className="space-y-4">
                {recentCalculations.map(calculation => 
                  renderCalculation(calculation)
                )}
              </div>
            )}
          </div>
          
          {/* Saved calculations */}
          <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-4">{texts.savedCalculations}</h3>
            
            {savedCalculations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {texts.noSavedCalculations}
              </p>
            ) : (
              <div className="space-y-4">
                {savedCalculations.map(calculation => 
                  renderCalculation(calculation, true)
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodCalculator;