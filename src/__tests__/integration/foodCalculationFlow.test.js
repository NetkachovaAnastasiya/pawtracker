import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';
import { generateDog } from '../mocks/dataGenerators';
import { mockLocalStorage, server } from '../mocks/serviceMocks';
import * as aiUtils from '../../utils/aiUtils';

// Mock AI utils
jest.mock('../../utils/aiUtils', () => ({
  getDogRecommendations: jest.fn()
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Setup mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('End-to-end Food Calculation Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    
    // Setup test dogs in localStorage
    const testDogs = [
      generateDog({ id: 'dog1', name: 'Rex', breed: 'German Shepherd', weight: 30, activityLevel: 'high' })
    ];
    
    mockLocalStorage.getItem.mockImplementation(key => {
      if (key === 'dogs') return JSON.stringify(testDogs);
      return null;
    });
    
    // Mock AI recommendations
    aiUtils.getDogRecommendations.mockResolvedValue(`
      1. Water intake: Your dog should drink plenty of water.
      2. Exercise needs: Regular exercise is important.
      3. Nutritional considerations: Balance is key.
      4. Health monitoring tips: Regular check-ups are essential.
    `);
  });
  
  // Test the complete flow from home to food calculator to recommendations
  test('complete food calculation and recommendation flow', async () => {
    render(<App />);
    
    // Navigate from home to food calculator
    const foodCalcCard = screen.getByText(/Food Calculator/i).closest('div');
    fireEvent.click(foodCalcCard);
    
    // Verify we're on food calculator page
    await waitFor(() => {
      expect(screen.getByText(/Calculate/i)).toBeInTheDocument();
    });
    
    // Select dog
    fireEvent.change(screen.getByLabelText(/Dog Profiles/i), { target: { value: 'dog1' } });
    
    // Calculate food portion
    fireEvent.click(screen.getByText(/Calculate/i));
    
    // Verify calculation results
    await waitFor(() => {
      expect(screen.getByText(/720/)).toBeInTheDocument(); // 30kg * 20g * 1.2 activity = 720g
    });
    
    // Get AI recommendations
    fireEvent.click(screen.getByText(/Get AI Recommendations/i));
    
    // Verify recommendations displayed
    await waitFor(() => {
      expect(screen.getByText(/AI Care Recommendations/i)).toBeInTheDocument();
      expect(screen.getByText(/Water intake/i)).toBeInTheDocument();
    });
    
    // Verify AI function was called correctly
    expect(aiUtils.getDogRecommendations).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'dog1', name: 'Rex' }),
      expect.objectContaining({ daily: 720 }),
      expect.any(String) // language
    );
  });
});