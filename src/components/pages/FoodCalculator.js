import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

// EVIDENCE: Framework React - Creating maintainable components (Trainee)
function FoodCalculator() {
  const { t, darkMode } = useContext(AppContext);
  
  // Get stored dogs
  const [dogs] = useState(() => {
    const saved = localStorage.getItem('dogs');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Calculator state
  // EVIDENCE: JavaScript - Variables and data types (Trainee)
  const [selectedDogId, setSelectedDogId] = useState('');
  const [foodType, setFoodType] = useState('dry');
  const [mealCount, setMealCount] = useState(2);
  const [calculatedPortion, setCalculatedPortion] = useState(null);
  
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
    
    setCalculatedPortion({
      daily: dailyAmount,
      perMeal: perMealAmount
    });
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('foodCalculator')}</h2>
      
      <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl mb-4">{t('calculate')}</h3>
            
            {/* Dog selection */}
            <div className="mb-4">
              <label className="block mb-1">{t('dogProfiles')}</label>
              <select
                value={selectedDogId}
                onChange={(e) => setSelectedDogId(e.target.value)}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="">-- {t('selectDog')} --</option>
                {dogs.map(dog => (
                  <option key={dog.id} value={dog.id}>
                    {dog.name} ({dog.breed}, {dog.weight} kg)
                  </option>
                ))}
              </select>
            </div>
            
            {/* Food type */}
            <div className="mb-4">
              <label className="block mb-1">{t('foodType')}</label>
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="dry">{t('dryFood')}</option>
                <option value="wet">{t('wetFood')}</option>
                <option value="mixed">{t('mixedFood')}</option>
                <option value="raw">{t('rawFood')}</option>
              </select>
            </div>
            
            {/* Meals per day */}
            <div className="mb-4">
              <label className="block mb-1">{t('mealsPerDay')}</label>
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
              {t('calculate')}
            </button>
          </div>
          
          <div>
            {/* Results */}
            {calculatedPortion && (
              <div className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-xl mb-4">{t('dailyPortion')}</h3>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold">
                    {calculatedPortion.daily} <span className="text-lg font-normal">{t('gramsPerDay')}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-lg">{t('mealsPerDay')}: {mealCount}</div>
                  <div className="text-xl mt-2">
                    <strong>{calculatedPortion.perMeal}g</strong> {t('perMeal')}
                  </div>
                </div>
                
                <div className="mt-4 text-sm italic">
                  <p>This calculation is an estimate and may need adjustment based on your dog's individual needs.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodCalculator;