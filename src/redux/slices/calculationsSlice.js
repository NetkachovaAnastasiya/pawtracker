import { createSlice } from '@reduxjs/toolkit';

// EVIDENCE: Technical Process - Technical debt management (Middle)
const calculationsSlice = createSlice({
  name: 'calculations',
  initialState: {
    foodCalculations: [],
    recentCalculations: [],
    savedCalculations: []
  },
  reducers: {
    // Додавання розрахунку порції їжі
    addFoodCalculation: (state, action) => {
      const calculation = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload
      };
      
      state.foodCalculations.push(calculation);
      
      // Зберігаємо останні 5 розрахунків
      state.recentCalculations = [
        calculation,
        ...state.recentCalculations.slice(0, 4)
      ];
    },
    
    // Збереження розрахунку
    saveCalculation: (state, action) => {
      const calculationId = action.payload;
      const calculation = state.foodCalculations.find(calc => calc.id === calculationId);
      
      if (calculation && !state.savedCalculations.some(calc => calc.id === calculationId)) {
        state.savedCalculations.push(calculation);
      }
    },
    
    // Видалення збереженого розрахунку
    removeSavedCalculation: (state, action) => {
      const calculationId = action.payload;
      state.savedCalculations = state.savedCalculations.filter(calc => calc.id !== calculationId);
    }
  }
});

export const { 
  addFoodCalculation, 
  saveCalculation, 
  removeSavedCalculation 
} = calculationsSlice.actions;

export default calculationsSlice.reducer;