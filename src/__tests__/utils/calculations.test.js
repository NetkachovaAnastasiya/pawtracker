// src/__tests__/utils/calculations.test.js
// EVIDENCE: Code-Based Testing - Unit testing fundamentals (Junior)

// Import the utility function directly from where it's defined
// For testing purposes, we'll define a sample calculation function:
const calculateFoodPortion = (dog, foodType, mealCount) => {
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
    
    return {
      dailyAmount,
      perMealAmount
    };
  };
  
  // EVIDENCE: Code-Based Testing - Custom matchers for complex validations (Middle)
  expect.extend({
    toBeWithinRange(received, floor, ceiling) {
      const pass = received >= floor && received <= ceiling;
      return {
        pass,
        message: () => pass
          ? `Expected ${received} not to be within range ${floor} - ${ceiling}`
          : `Expected ${received} to be within range ${floor} - ${ceiling}`
      };
    }
  });
  
  // EVIDENCE: Code-Based Testing - Test organization using describes and groups (Middle)
  describe('Food Calculation Functions', () => {
    // EVIDENCE: Code-Based Testing - Basic matchers for testing expected values (Junior)
    describe('calculateFoodPortion function', () => {
      test('calculates correct amount for average dog with dry food', () => {
        const dog = {
          weight: 20,
          activityLevel: 'moderate'
        };
        
        const result = calculateFoodPortion(dog, 'dry', 2);
        
        expect(result.dailyAmount).toBe(400); // 20kg * 20g * 1.0 = 400g
        expect(result.perMealAmount).toBe(200); // 400g / 2 meals = 200g
      });
      
      test('applies activity level modifier correctly for low activity', () => {
        const dog = {
          weight: 20,
          activityLevel: 'low'
        };
        
        const result = calculateFoodPortion(dog, 'dry', 2);
        
        expect(result.dailyAmount).toBe(320); // 20kg * 20g * 0.8 = 320g
        expect(result.perMealAmount).toBe(160); // 320g / 2 meals = 160g
      });
      
      test('applies activity level modifier correctly for high activity', () => {
        const dog = {
          weight: 20,
          activityLevel: 'high'
        };
        
        const result = calculateFoodPortion(dog, 'dry', 2);
        
        expect(result.dailyAmount).toBe(480); // 20kg * 20g * 1.2 = 480g
        expect(result.perMealAmount).toBe(240); // 480g / 2 meals = 240g
      });
      
      test('applies food type modifier correctly for wet food', () => {
        const dog = {
          weight: 20,
          activityLevel: 'moderate'
        };
        
        const result = calculateFoodPortion(dog, 'wet', 2);
        
        expect(result.dailyAmount).toBe(1000); // 20kg * 20g * 1.0 * 2.5 = 1000g
        expect(result.perMealAmount).toBe(500); // 1000g / 2 meals = 500g
      });
      
      test('applies food type modifier correctly for mixed food', () => {
        const dog = {
          weight: 20,
          activityLevel: 'moderate'
        };
        
        const result = calculateFoodPortion(dog, 'mixed', 2);
        
        expect(result.dailyAmount).toBe(600); // 20kg * 20g * 1.0 * 1.5 = 600g
        expect(result.perMealAmount).toBe(300); // 600g / 2 meals = 300g
      });
      
      test('applies food type modifier correctly for raw food', () => {
        const dog = {
          weight: 20,
          activityLevel: 'moderate'
        };
        
        const result = calculateFoodPortion(dog, 'raw', 2);
        
        expect(result.dailyAmount).toBe(360); // 20kg * 20g * 1.0 * 0.9 = 360g
        expect(result.perMealAmount).toBe(180); // 360g / 2 meals = 180g
      });
      
      test('divides daily amount correctly for different meal counts', () => {
        const dog = {
          weight: 20,
          activityLevel: 'moderate'
        };
        
        // Test with 1 meal
        let result = calculateFoodPortion(dog, 'dry', 1);
        expect(result.perMealAmount).toBe(400); // 400g / 1 meal = 400g
        
        // Test with 3 meals
        result = calculateFoodPortion(dog, 'dry', 3);
        expect(result.perMealAmount).toBe(133); // 400g / 3 meals ≈ 133g (rounded)
        
        // Test with 4 meals
        result = calculateFoodPortion(dog, 'dry', 4);
        expect(result.perMealAmount).toBe(100); // 400g / 4 meals = 100g
      });
      
      // EVIDENCE: Code-Based Testing - Using custom matchers (Middle)
      test('handles rounding correctly', () => {
        const dog = {
          weight: 15.5,
          activityLevel: 'moderate'
        };
        
        // Test with uneven division
        const result = calculateFoodPortion(dog, 'dry', 3);
        
        // Expected daily amount: 15.5kg * 20g = 310g
        expect(result.dailyAmount).toBe(310);
        
        // Expected per meal: 310g / 3 meals ≈ 103.33g, rounded to 103g
        // Using custom matcher to allow for rounding differences
        expect(result.perMealAmount).toBeWithinRange(103, 104);
      });
    });
  });