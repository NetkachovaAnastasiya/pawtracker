// src/__tests__/components/pages/FoodCalculator.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FoodCalculator from '../../../components/pages/FoodCalculator';
import { AppContext } from '../../../context/AppContext';
import { DataContext } from '../../../context/DataContext';
import { generateDog } from '../../mocks/dataGenerators';
import { server } from '../../mocks/serviceMocks';
import * as aiUtils from '../../../utils/aiUtils';

// Mock AI utils module
jest.mock('../../../utils/aiUtils', () => ({
  getDogRecommendations: jest.fn()
}));

// Setup mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('FoodCalculator Component', () => {
  const mockAppContextValue = {
    darkMode: false,
    language: 'en'
  };
  
  const testDogs = [
    generateDog({ id: 'dog1', name: 'Rex', breed: 'German Shepherd', weight: 30, activityLevel: 'high' }),
    generateDog({ id: 'dog2', name: 'Buddy', breed: 'Golden Retriever', weight: 25, activityLevel: 'moderate' })
  ];
  
  const mockDataContextValue = {
    dogs: testDogs,
    calculations: [],
    addCalculation: jest.fn()
  };
  
  // Test 1: Renders the component correctly
  test('renders the component with dog dropdown', () => {
    render(
      <AppContext.Provider value={mockAppContextValue}>
        <DataContext.Provider value={mockDataContextValue}>
          <FoodCalculator />
        </DataContext.Provider>
      </AppContext.Provider>
    );
    
    expect(screen.getByText(/Food Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Rex \(German Shepherd, 30 kg\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Buddy \(Golden Retriever, 25 kg\)/i)).toBeInTheDocument();
  });
  
  // Test 2: Calculates food portion correctly
  test('calculates food portion correctly', () => {
    render(
      <AppContext.Provider value={mockAppContextValue}>
        <DataContext.Provider value={mockDataContextValue}>
          <FoodCalculator />
        </DataContext.Provider>
      </AppContext.Provider>
    );
    
    // Select dog
    fireEvent.change(screen.getByLabelText(/Dog Profiles/i), { target: { value: 'dog1' } });
    
    // Click calculate
    fireEvent.click(screen.getByText(/Calculate/i));
    
    // Check results (30kg * 20g * 1.2 activity = 720g daily)
    expect(screen.getByText(/720/)).toBeInTheDocument();
    expect(screen.getByText(/360g/)).toBeInTheDocument(); // 720g / 2 meals
    
    // Verify addCalculation was called
    expect(mockDataContextValue.addCalculation).toHaveBeenCalled();
  });
  
  // Test 3: Food type affects calculations
  test('different food types affect calculations', () => {
    render(
      <AppContext.Provider value={mockAppContextValue}>
        <DataContext.Provider value={mockDataContextValue}>
          <FoodCalculator />
        </DataContext.Provider>
      </AppContext.Provider>
    );
    
    // Select dog
    fireEvent.change(screen.getByLabelText(/Dog Profiles/i), { target: { value: 'dog1' } });
    
    // Select wet food
    fireEvent.change(screen.getByLabelText(/Food Type/i), { target: { value: 'wet' } });
    
    // Click calculate
    fireEvent.click(screen.getByText(/Calculate/i));
    
    // For wet food, we multiply by 2.5 (30kg * 20g * 1.2 activity * 2.5 = 1800g daily)
    expect(screen.getByText(/1800/)).toBeInTheDocument();
  });
  
  // Test 4: AI recommendations button shows up after calculation
  test('AI recommendations button appears after calculation', () => {
    render(
      <AppContext.Provider value={mockAppContextValue}>
        <DataContext.Provider value={mockDataContextValue}>
          <FoodCalculator />
        </DataContext.Provider>
      </AppContext.Provider>
    );
    
    // AI button should not be visible initially
    expect(screen.queryByText(/Get AI Recommendations/i)).not.toBeInTheDocument();
    
    // Select dog and calculate
    fireEvent.change(screen.getByLabelText(/Dog Profiles/i), { target: { value: 'dog1' } });
    fireEvent.click(screen.getByText(/Calculate/i));
    
    // AI button should now be visible
    expect(screen.getByText(/Get AI Recommendations/i)).toBeInTheDocument();
  });
  
  // Test 5: Fetches AI recommendations when button is clicked
  test('fetches AI recommendations when button is clicked', async () => {
    // Mock the AI recommendations function
    aiUtils.getDogRecommendations.mockResolvedValue(`
      1. Water intake: Your dog should drink plenty of water.
      2. Exercise needs: Regular exercise is important.
      3. Nutritional considerations: Balance is key.
      4. Health monitoring tips: Regular check-ups are essential.
    `);
    
    render(
      <AppContext.Provider value={mockAppContextValue}>
        <DataContext.Provider value={mockDataContextValue}>
          <FoodCalculator />
        </DataContext.Provider>
      </AppContext.Provider>
    );
    
    // Select dog and calculate
    fireEvent.change(screen.getByLabelText(/Dog Profiles/i), { target: { value: 'dog1' } });
    fireEvent.click(screen.getByText(/Calculate/i));
    
    // Click AI recommendations button
    fireEvent.click(screen.getByText(/Get AI Recommendations/i));
    
    // Wait for recommendations to load
    await waitFor(() => {
      expect(screen.getByText(/AI Care Recommendations/i)).toBeInTheDocument();
      expect(screen.getByText(/Water intake/i)).toBeInTheDocument();
    });
    
    // Verify AI function was called with correct parameters
    expect(aiUtils.getDogRecommendations).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'dog1', name: 'Rex' }),
      expect.objectContaining({ daily: 720, perMeal: 360 }),
      'en'
    );
  });
});