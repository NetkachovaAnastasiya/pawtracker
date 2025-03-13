// src/__tests__/components/FoodCalculator.test.js
// EVIDENCE: Code-Based Testing - Unit testing fundamentals (Component vs. unit testing) (Junior)
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import FoodCalculator from '../../components/pages/FoodCalculator';
import { AppContext } from '../../context/AppContext';
import { setupMockLocalStorage } from '../setup/mockLocalStorage';

// EVIDENCE: Code-Based Testing - Custom matchers for complex validations (Middle)
expect.extend({
  toHaveCalculatedValue: (received, expected, tolerance = 0) => {
    const pass = Math.abs(received - expected) <= tolerance;
    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to equal ${expected} (tolerance: ${tolerance})`
        : `Expected ${received} to equal ${expected} (tolerance: ${tolerance}), but got ${received}`
    };
  }
});

// EVIDENCE: Code-Based Testing - Test organization using describes and groups (Middle)
describe('FoodCalculator Component', () => {
  // EVIDENCE: Code-Based Testing - Setup/teardown implementation (Middle)
  let restoreLocalStorage;
  
  beforeEach(() => {
    restoreLocalStorage = setupMockLocalStorage();
    
    // Initialize with sample data
    localStorage.setItem('dogs', JSON.stringify([
      { id: '1', name: 'Max', breed: 'Labrador', weight: 25, age: 3, activityLevel: 'high' },
      { id: '2', name: 'Bella', breed: 'Poodle', weight: 10, age: 5, activityLevel: 'low' }
    ]));
  });
  
  afterEach(() => {
    restoreLocalStorage();
    jest.clearAllMocks();
  });
  
  // Mock fetch for API calls
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ recommendations: '<h4>Test Recommendations</h4>' }),
    })
  );
  
  // Mock context provider for testing
  const renderWithContext = (ui, contextValues = {}) => {
    return render(
      <AppContext.Provider 
        value={{ 
          darkMode: false, 
          language: 'en', 
          t: key => key,
          ...contextValues 
        }}
      >
        {ui}
      </AppContext.Provider>
    );
  };
  
  test('renders food calculator form', () => {
    renderWithContext(<FoodCalculator />);
    
    expect(screen.getByText(/food calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/select a dog/i)).toBeInTheDocument();
    expect(screen.getByText(/food type/i)).toBeInTheDocument();
    expect(screen.getByText(/meals per day/i)).toBeInTheDocument();
  });
  
  test('displays dog options correctly', () => {
    renderWithContext(<FoodCalculator />);
    
    const select = screen.getByLabelText(/select a dog/i);
    expect(select).toBeInTheDocument();
    
    // Check if both dogs are listed
    expect(select.innerHTML).toContain('Max');
    expect(select.innerHTML).toContain('Labrador');
    expect(select.innerHTML).toContain('Bella');
    expect(select.innerHTML).toContain('Poodle');
  });
  
  test('calculates food portion correctly for high activity dog', async () => {
    renderWithContext(<FoodCalculator />);
    
    // Select a dog with high activity
    const select = screen.getByLabelText(/select a dog/i);
    userEvent.selectOptions(select, '1'); // Max, the Labrador
    
    // Select food type
    const foodTypeSelect = screen.getByLabelText(/food type/i);
    userEvent.selectOptions(foodTypeSelect, 'dry');
    
    // Set meals per day
    const mealsSelect = screen.getByLabelText(/meals per day/i);
    userEvent.selectOptions(mealsSelect, '2');
    
    // Click calculate button
    const calculateButton = screen.getByText(/calculate/i);
    userEvent.click(calculateButton);
    
    // Check results - Base amount is 25kg * 20g = 500g
    // High activity multiplier is 1.2, so expected is 500 * 1.2 = 600g
    await waitFor(() => {
      const dailyAmount = screen.getByText('600');
      expect(dailyAmount).toBeInTheDocument();
      
      // Per meal amount should be 600g / 2 meals = 300g per meal
      const perMealAmount = screen.getByText('300');
      expect(perMealAmount).toBeInTheDocument();
    });
  });
  
  test('calculates food portion correctly for low activity dog', async () => {
    renderWithContext(<FoodCalculator />);
    
    // Select a dog with low activity
    const select = screen.getByLabelText(/select a dog/i);
    userEvent.selectOptions(select, '2'); // Bella, the Poodle
    
    // Select food type
    const foodTypeSelect = screen.getByLabelText(/food type/i);
    userEvent.selectOptions(foodTypeSelect, 'dry');
    
    // Set meals per day
    const mealsSelect = screen.getByLabelText(/meals per day/i);
    userEvent.selectOptions(mealsSelect, '3');
    
    // Click calculate button
    const calculateButton = screen.getByText(/calculate/i);
    userEvent.click(calculateButton);
    
    // Check results - Base amount is 10kg * 20g = 200g
    // Low activity multiplier is 0.8, so expected is 200 * 0.8 = 160g
    await waitFor(() => {
      const dailyAmount = screen.getByText('160');
      expect(dailyAmount).toBeInTheDocument();
      
      // Per meal amount should be 160g / 3 meals = 53g per meal (rounded)
      const perMealAmount = screen.getByText('53');
      expect(perMealAmount).toBeInTheDocument();
    });
  });
  
  test('calculates wet food portion correctly', async () => {
    renderWithContext(<FoodCalculator />);
    
    // Select a dog
    const select = screen.getByLabelText(/select a dog/i);
    userEvent.selectOptions(select, '1'); // Max, the Labrador
    
    // Select wet food type
    const foodTypeSelect = screen.getByLabelText(/food type/i);
    userEvent.selectOptions(foodTypeSelect, 'wet');
    
    // Set meals per day
    const mealsSelect = screen.getByLabelText(/meals per day/i);
    userEvent.selectOptions(mealsSelect, '2');
    
    // Click calculate button
    const calculateButton = screen.getByText(/calculate/i);
    userEvent.click(calculateButton);
    
    // Check results - Base amount is 25kg * 20g = 500g
    // High activity multiplier is 1.2, wet food modifier is 2.5
    // so expected is 500 * 1.2 * 2.5 = 1500g
    await waitFor(() => {
      const dailyAmount = screen.getByText('1500');
      expect(dailyAmount).toBeInTheDocument();
      
      // Per meal amount should be 1500g / 2 meals = 750g per meal
      const perMealAmount = screen.getByText('750');
      expect(perMealAmount).toBeInTheDocument();
    });
  });
  
  test('adds calculation to recent calculations', async () => {
    renderWithContext(<FoodCalculator />);
    
    // Select a dog
    const select = screen.getByLabelText(/select a dog/i);
    userEvent.selectOptions(select, '1'); // Max, the Labrador
    
    // Click calculate button
    const calculateButton = screen.getByText(/calculate/i);
    userEvent.click(calculateButton);
    
    // Check if calculation was added to recent calculations
    await waitFor(() => {
      const recentCalculations = JSON.parse(localStorage.getItem('recentCalculations'));
      expect(recentCalculations).toHaveLength(1);
      expect(recentCalculations[0].dog.name).toBe('Max');
    });
  });
  
  test('handles API recommendations request', async () => {
    renderWithContext(<FoodCalculator />);
    
    // Select a dog
    const select = screen.getByLabelText(/select a dog/i);
    userEvent.selectOptions(select, '1'); // Max, the Labrador
    
    // Click calculate button
    const calculateButton = screen.getByText(/calculate/i);
    userEvent.click(calculateButton);
    
    // Wait for calculation to complete
    await waitFor(() => {
      expect(screen.getByText(/daily portion/i)).toBeInTheDocument();
    });
    
    // Click get recommendations button
    const recommendationsButton = screen.getByText(/get more recommendations/i);
    userEvent.click(recommendationsButton);
    
    // Check if fetch was called with correct data
    expect(fetch).toHaveBeenCalled();
    
    // Check if recommendations are displayed
    await waitFor(() => {
      expect(screen.getByText(/Test Recommendations/i)).toBeInTheDocument();
    });
  });
});