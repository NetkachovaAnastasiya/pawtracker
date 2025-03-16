// src/__tests__/mocks/dataGenerators.js
export const generateDog = (overrides = {}) => ({
    id: `dog-${Math.floor(Math.random() * 10000)}`,
    name: `Dog ${Math.floor(Math.random() * 100)}`,
    breed: ['German Shepherd', 'Labrador', 'Golden Retriever', 'Bulldog', 'Poodle'][
      Math.floor(Math.random() * 5)
    ],
    weight: Math.floor(Math.random() * 30) + 5, // 5-35kg
    age: Math.floor(Math.random() * 15) + 1, // 1-15 years
    activityLevel: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
    ...overrides
  });
  
  export const generateMedication = (dogId, overrides = {}) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    
    return {
      id: `med-${Math.floor(Math.random() * 10000)}`,
      dogId,
      name: ['Antibiotics', 'Pain Relief', 'Anti-inflammatory', 'Vitamins', 'Allergy Medicine'][
        Math.floor(Math.random() * 5)
      ],
      dose: `${Math.floor(Math.random() * 3) + 1} tablet(s)`,
      frequency: ['daily', 'weekly', 'biweekly', 'monthly'][Math.floor(Math.random() * 4)],
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      notes: 'Test medication notes',
      nextDose: startDate.toISOString().split('T')[0],
      ...overrides
    };
  };
  
  export const generateCalculation = (dogId, dogName, overrides = {}) => ({
    id: `calc-${Math.floor(Math.random() * 10000)}`,
    timestamp: new Date().toISOString(),
    dogId,
    dogName,
    dogWeight: Math.floor(Math.random() * 30) + 5,
    dogActivityLevel: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
    foodType: ['dry', 'wet', 'mixed', 'raw'][Math.floor(Math.random() * 4)],
    mealCount: Math.floor(Math.random() * 3) + 1,
    dailyAmount: Math.floor(Math.random() * 500) + 200,
    perMealAmount: Math.floor(Math.random() * 200) + 100,
    ...overrides
  });
  
  // Generate a dataset with multiple dogs and related data
  export const generateTestDataset = (numDogs = 3) => {
    const dogs = Array.from({ length: numDogs }, () => generateDog());
    
    const medications = dogs.flatMap(dog => 
      Array.from({ length: 2 }, () => generateMedication(dog.id))
    );
    
    const calculations = dogs.flatMap(dog => 
      Array.from({ length: 2 }, () => generateCalculation(dog.id, dog.name))
    );
    
    return { dogs, medications, calculations };
  };
  
  // Predefined test conditions
  export const testConditions = {
    smallDog: generateDog({ 
      weight: 5, 
      activityLevel: 'low',
      breed: 'Chihuahua'
    }),
    largeDog: generateDog({ 
      weight: 40, 
      activityLevel: 'high',
      breed: 'Great Dane'
    }),
    seniorDog: generateDog({
      age: 12,
      activityLevel: 'low'
    }),
    longTermMedication: generateMedication('dog-id', {
      startDate: '2023-01-01',
      endDate: '2023-12-31'
    }),
    frequentDosage: generateMedication('dog-id', {
      frequency: 'daily',
      dose: '3 tablets'
    })
  };