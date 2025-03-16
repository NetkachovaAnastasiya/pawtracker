import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataContext, DataProvider } from '../../context/DataContext';
import { mockLocalStorage } from '../mocks/serviceMocks';
import { generateTestDataset } from '../mocks/dataGenerators';

// Mock localStorage
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('DataContext', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });
  
  // Test 1: Initializes with empty data when localStorage is empty
  test('initializes with empty data when localStorage is empty', () => {
    let contextValue;
    
    render(
      <DataProvider>
        <DataContext.Consumer>
          {value => {
            contextValue = value;
            return null;
          }}
        </DataContext.Consumer>
      </DataProvider>
    );
    
    expect(contextValue.dogs).toEqual([]);
    expect(contextValue.medications).toEqual([]);
    expect(contextValue.calculations).toEqual([]);
    
    // Check localStorage was accessed
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('dogs');
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('medications');
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('foodCalculations');
  });
  
  // Test 2: Loads data from localStorage on initialization
  test('loads data from localStorage on initialization', () => {
    const testData = generateTestDataset();
    
    // Set up localStorage with test data
    mockLocalStorage.getItem.mockImplementation(key => {
      if (key === 'dogs') return JSON.stringify(testData.dogs);
      if (key === 'medications') return JSON.stringify(testData.medications);
      if (key === 'foodCalculations') return JSON.stringify(testData.calculations);
      return null;
    });
    
    let contextValue;
    
    render(
      <DataProvider>
        <DataContext.Consumer>
          {value => {
            contextValue = value;
            return null;
          }}
        </DataContext.Consumer>
      </DataProvider>
    );
    
    expect(contextValue.dogs).toEqual(testData.dogs);
    expect(contextValue.medications).toEqual(testData.medications);
    expect(contextValue.calculations).toEqual(testData.calculations);
  });
  
  // Test 3: Adds a dog with auto-generated ID
  test('adds a dog with auto-generated ID', () => {
    // Mock Date.now for predictable IDs
    const realDateNow = Date.now;
    Date.now = jest.fn(() => 1234567890);
    
    let contextValue;
    
    render(
      <DataProvider>
        <DataContext.Consumer>
          {value => {
            contextValue = value;
            return null;
          }}
        </DataContext.Consumer>
      </DataProvider>
    );
    
    // Clear localStorage mock calls from initialization
    mockLocalStorage.setItem.mockClear();
    
    // Add a dog
    act(() => {
      contextValue.addDog({ name: 'Max', breed: 'Labrador', weight: 28 });
    });
    
    // Check the dog was added with the correct ID
    expect(contextValue.dogs).toEqual([
      expect.objectContaining({
        id: '1234567890',
        name: 'Max',
        breed: 'Labrador',
        weight: 28
      })
    ]);
    
    // Check localStorage was updated
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('dogs', JSON.stringify(contextValue.dogs));
    
    // Restore Date.now
    Date.now = realDateNow;
  });
  
  // Test 4: Updates a dog correctly
  test('updates a dog correctly', () => {
    const testDogs = [
      { id: 'dog1', name: 'Max', breed: 'Labrador', weight: 28 }
    ];
    
    // Set up localStorage
    mockLocalStorage.getItem.mockImplementation(key => {
      if (key === 'dogs') return JSON.stringify(testDogs);
      return null;
    });
    
    let contextValue;
    
    render(
      <DataProvider>
        <DataContext.Consumer>
          {value => {
            contextValue = value;
            return null;
          }}
        </DataContext.Consumer>
      </DataProvider>
    );
    
    // Clear localStorage mock calls from initialization
    mockLocalStorage.setItem.mockClear();
    
    // Update the dog
    act(() => {
      contextValue.updateDog({
        id: 'dog1',
        name: 'Max',
        breed: 'Labrador Retriever', // Changed
        weight: 30 // Changed
      });
    });
    
    // Check the dog was updated correctly
    expect(contextValue.dogs[0]).toEqual({
      id: 'dog1',
      name: 'Max',
      breed: 'Labrador Retriever',
      weight: 30
    });
    
    // Check localStorage was updated
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('dogs', JSON.stringify(contextValue.dogs));
  });
  
  // Test 5: Deletes a dog correctly
  test('deletes a dog correctly', () => {
    const testDogs = [
      { id: 'dog1', name: 'Max', breed: 'Labrador', weight: 28 },
      { id: 'dog2', name: 'Buddy', breed: 'Golden Retriever', weight: 25 }
    ];
    
    // Set up localStorage
    mockLocalStorage.getItem.mockImplementation(key => {
      if (key === 'dogs') return JSON.stringify(testDogs);
      return null;
    });
    
    let contextValue;
    
    render(
      <DataProvider>
        <DataContext.Consumer>
          {value => {
            contextValue = value;
            return null;
          }}
        </DataContext.Consumer>
      </DataProvider>
    );
    
    // Clear localStorage mock calls from initialization
    mockLocalStorage.setItem.mockClear();
    
    // Delete a dog
    act(() => {
      contextValue.deleteDog('dog1');
    });
    
    // Check the dog was deleted
    expect(contextValue.dogs).toHaveLength(1);
    expect(contextValue.dogs[0].id).toBe('dog2');
    
    // Check localStorage was updated
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('dogs', JSON.stringify(contextValue.dogs));
  });
});