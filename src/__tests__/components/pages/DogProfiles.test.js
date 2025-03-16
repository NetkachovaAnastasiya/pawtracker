// src/__tests__/components/pages/DogProfiles.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DogProfiles from '../../../components/pages/DogProfiles';
import { AppContext } from '../../../context/AppContext';
import { DataContext } from '../../../context/DataContext';
import { generateDog, generateTestDataset } from '../../mocks/dataGenerators';

// Mock contexts
const mockAppContextValue = {
  darkMode: false,
  language: 'en',
  setActivePage: jest.fn()
};

describe('DogProfiles Component', () => {
  // Test 1: Renders empty state correctly
  test('renders empty state when no dogs exist', () => {
    const mockDataContextValue = {
      dogs: [],
      addDog: jest.fn(),
      updateDog: jest.fn(),
      deleteDog: jest.fn()
    };
    
    render(
      <AppContext.Provider value={mockAppContextValue}>
        <DataContext.Provider value={mockDataContextValue}>
          <DogProfiles />
        </DataContext.Provider>
      </AppContext.Provider>
    );
    
    expect(screen.getByText(/No dogs added yet/i)).toBeInTheDocument();
  });
  
  // Test 2: Renders dog list correctly
  test('renders list of dogs correctly', () => {
    const testDogs = [
      generateDog({ name: 'Rex', breed: 'German Shepherd' }),
      generateDog({ name: 'Buddy', breed: 'Golden Retriever' })
    ];
    
    const mockDataContextValue = {
      dogs: testDogs,
      addDog: jest.fn(),
      updateDog: jest.fn(),
      deleteDog: jest.fn()
    };
    
    render(
      <AppContext.Provider value={mockAppContextValue}>
        <DataContext.Provider value={mockDataContextValue}>
          <DogProfiles />
        </DataContext.Provider>
      </AppContext.Provider>
    );
    
    expect(screen.getByText('Rex')).toBeInTheDocument();
    expect(screen.getByText('Buddy')).toBeInTheDocument();
    expect(screen.getByText('German Shepherd')).toBeInTheDocument();
    expect(screen.getByText('Golden Retriever')).toBeInTheDocument();
  });
  
  // Test 3: Shows form when add button is clicked
  test('shows form when add button is clicked', () => {
    const mockDataContextValue = {
      dogs: [],
      addDog: jest.fn(),
      updateDog: jest.fn(),
      deleteDog: jest.fn()
    };
    
    render(
      <AppContext.Provider value={mockAppContextValue}>
        <DataContext.Provider value={mockDataContextValue}>
          <DogProfiles />
        </DataContext.Provider>
      </AppContext.Provider>
    );
    
    // Form should not be visible initially
    expect(screen.queryByText(/Dog Name/i)).not.toBeInTheDocument();
    
    // Click add button
    fireEvent.click(screen.getByText(/Add Dog/i));
    
    // Form should now be visible
    expect(screen.getByText(/Dog Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Breed/i)).toBeInTheDocument();
  });
  
  // Test 4: Calls addDog when form is submitted
  test('calls addDog when form is submitted with valid data', async () => {
    const addDogMock = jest.fn();
    const mockDataContextValue = {
      dogs: [],
      addDog: addDogMock,
      updateDog: jest.fn(),
      deleteDog: jest.fn()
    };
    
    render(
      <AppContext.Provider value={mockAppContextValue}>
        <DataContext.Provider value={mockDataContextValue}>
          <DogProfiles />
        </DataContext.Provider>
      </AppContext.Provider>
    );
    
    // Open form
    fireEvent.click(screen.getByText(/Add Dog/i));
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/Dog Name/i), { target: { value: 'Fido' } });
    fireEvent.change(screen.getByLabelText(/Breed/i), { target: { value: 'Mixed' } });
    fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: '15' } });
    
    // Submit form
    fireEvent.click(screen.getByText(/Save/i));
    
    // Verify addDog was called with correct data
    expect(addDogMock).toHaveBeenCalledWith({
      name: 'Fido',
      breed: 'Mixed',
      weight: '15',
      age: '',
      activityLevel: 'moderate'
    });
  });
  
  // Test 5: Shows validation error for incomplete form
  test('shows validation error for incomplete form', () => {
    const mockDataContextValue = {
      dogs: [],
      addDog: jest.fn(),
      updateDog: jest.fn(),
      deleteDog: jest.fn()
    };
    
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(
      <AppContext.Provider value={mockAppContextValue}>
        <DataContext.Provider value={mockDataContextValue}>
          <DogProfiles />
        </DataContext.Provider>
      </AppContext.Provider>
    );
    
    // Open form
    fireEvent.click(screen.getByText(/Add Dog/i));
    
    // Submit without filling required fields
    fireEvent.click(screen.getByText(/Save/i));
    
    // Check alert was called
    expect(alertMock).toHaveBeenCalled();
    
    // Cleanup
    alertMock.mockRestore();
  });
});