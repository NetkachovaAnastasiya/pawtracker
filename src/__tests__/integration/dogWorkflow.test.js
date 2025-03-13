// src/__tests__/integration/dogWorkflow.test.js
// EVIDENCE: Code-Based Testing - Integration testing approach (Middle)
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { AppContext, AppProvider } from '../../context/AppContext';
import { setupMockLocalStorage } from '../setup/mockLocalStorage';

// EVIDENCE: Code-Based Testing - Test organization using describes and groups (Middle)
describe('Dog Management Workflow Integration', () => {
  // EVIDENCE: Code-Based Testing - Setup/teardown implementation (Middle)
  let restoreLocalStorage;
  
  beforeEach(() => {
    restoreLocalStorage = setupMockLocalStorage();
    // Clear any existing data
    localStorage.clear();
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
  
  // This test follows the entire workflow from adding a dog to calculating food
  // EVIDENCE: Code-Based Testing - Unit testing optimization techniques (Middle)
  test('end-to-end workflow: create dog profile and calculate food', async () => {
    // Render the full app with context
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );
    
    // 1. Navigate to dog profiles page
    const navLinks = screen.getAllByText(/dog profiles/i);
    userEvent.click(navLinks[0]);
    
    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText(/add dog/i)).toBeInTheDocument();
    });
    
    // 2. Open add dog form
    userEvent.click(screen.getByText(/add dog/i));
    
    // 3. Fill out the form
    await waitFor(() => {
      const nameInput = screen.getByLabelText(/dog name/i);
      userEvent.type(nameInput, 'Buddy');
      
      const breedInput = screen.getByLabelText(/breed/i);
      userEvent.type(breedInput, 'Golden Retriever');
      
      const weightInput = screen.getByLabelText(/weight/i);
      userEvent.type(weightInput, '30');
      
      const activitySelect = screen.getByLabelText(/activity level/i);
      userEvent.selectOptions(activitySelect, ['high']);
    });
    
    // 4. Submit the form
    userEvent.click(screen.getByText(/save/i));
    
    // 5. Verify dog was added
    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.getByText('Golden Retriever')).toBeInTheDocument();
    });
    
    // 6. Navigate to food calculator page
    const calculatorLinks = screen.getAllByText(/food calculator/i);
    userEvent.click(calculatorLinks[0]);
    
    // 7. Wait for calculator page to load
    await waitFor(() => {
      expect(screen.getByText(/select a dog/i)).toBeInTheDocument();
    });
    
    // 8. Select the dog we just created
    const select = screen.getByLabelText(/select a dog/i);
    userEvent.selectOptions(select, [select.options[1].value]); // First option is placeholder
    
    // 9. Choose food type and meals per day
    const foodTypeSelect = screen.getByLabelText(/food type/i);
    userEvent.selectOptions(foodTypeSelect, ['dry']);
    
    const mealsSelect = screen.getByLabelText(/meals per day/i);
    userEvent.selectOptions(mealsSelect, ['2']);
    
    // 10. Calculate food portion
    const calculateButton = screen.getByText(/calculate/i);
    userEvent.click(calculateButton);
    
    // 11. Verify calculation results
    // Expected: 30kg * 20g * 1.2 (high activity) = 720g daily
    // 720g / 2 meals = 360g per meal
    await waitFor(() => {
      const dailyAmount = screen.getByText('720');
      expect(dailyAmount).toBeInTheDocument();
      
      const perMealAmount = screen.getByText('360');
      expect(perMealAmount).toBeInTheDocument();
    });
    
    // 12. Get AI recommendations
    const recommendationsButton = screen.getByText(/get more recommendations/i);
    userEvent.click(recommendationsButton);
    
    // 13. Verify recommendations were fetched
    expect(fetch).toHaveBeenCalled();
    
    // 14. Check if recommendations are displayed
    await waitFor(() => {
      expect(screen.getByText(/Test Recommendations/i)).toBeInTheDocument();
    });
  });
});