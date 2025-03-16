import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';

// EVIDENCE: Framework React - Creating maintainable components (Trainee)
function FoodCalculator() {
  // Use multiple namespaces for translations
  const { t } = useTranslation(['common', 'food']);
  const { darkMode } = useContext(AppContext);
  
  // Get dog data from localStorage instead of Redux
  // EVIDENCE: JavaScript - Variables and data types (Trainee)
  const [dogs, setDogs] = useState(() => {
    const saved = localStorage.getItem('dogs');
    return saved ? JSON.parse(saved) : [];
  });
  
  // State for calculation history
  const [calculations, setCalculations] = useState(() => {
    const saved = localStorage.getItem('foodCalculations');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Calculator state
  const [selectedDogId, setSelectedDogId] = useState('');
  const [foodType, setFoodType] = useState('dry');
  const [mealCount, setMealCount] = useState(2);
  const [calculatedPortion, setCalculatedPortion] = useState(null);
  
  // Save calculations to localStorage when they change
  // EVIDENCE: Framework React - useEffect for side effects (Junior)
  useEffect(() => {
    localStorage.setItem('foodCalculations', JSON.stringify(calculations));
  }, [calculations]);
  
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
    // EVIDENCE: JavaScript - Math operations (Trainee)
    const dailyAmount = Math.round(baseAmount * activityMultiplier * foodTypeModifier);
    // Calculate per-meal amount
    const perMealAmount = Math.round(dailyAmount / mealCount);
    
    const result = {
      daily: dailyAmount,
      perMeal: perMealAmount
    };
    
    setCalculatedPortion(result);
    
    // Save calculation to local state instead of Redux
    // EVIDENCE: JavaScript - Object manipulation (Junior)
    const newCalculation = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      dogId: selectedDogId,
      dogName: dog.name,
      dogWeight: dog.weight,
      dogActivityLevel: dog.activityLevel,
      foodType,
      mealCount,
      dailyAmount,
      perMealAmount
    };
    
    // Add to calculations history
    setCalculations(prevCalculations => [newCalculation, ...prevCalculations]);
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
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent calculations section - optional enhancement */}
      {calculations.length > 0 && (
        <div className={`mt-6 rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-xl mb-4">{t('food:recentCalculations')}</h3>
          <div className="overflow-x-auto">
            <table className={`w-full ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              <thead>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className="text-left py-2">{t('dogs:dogName')}</th>
                  <th className="text-left py-2">{t('food:foodType')}</th>
                  <th className="text-right py-2">{t('food:dailyPortion')}</th>
                  <th className="text-right py-2">{t('food:mealsPerDay')}</th>
                </tr>
              </thead>
              <tbody>
                {calculations.slice(0, 5).map(calc => (
                  <tr key={calc.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="py-2">{calc.dogName}</td>
                    <td className="py-2">{t(`food:foodTypes.${calc.foodType}`)}</td>
                    <td className="text-right py-2">{calc.dailyAmount}g</td>
                    <td className="text-right py-2">{calc.mealCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodCalculator;