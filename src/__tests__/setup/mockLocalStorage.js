// src/__tests__/setup/mockLocalStorage.js
// EVIDENCE: Code-Based Testing - Test organization using describes and groups (Middle)

// Mock implementation of localStorage for testing
export class MockLocalStorage {
    constructor() {
      this.store = {};
    }
  
    clear() {
      this.store = {};
    }
  
    getItem(key) {
      return this.store[key] || null;
    }
  
    setItem(key, value) {
      this.store[key] = String(value);
    }
  
    removeItem(key) {
      delete this.store[key];
    }
  }
  
  // Setup function to initialize mock localStorage
  export function setupMockLocalStorage() {
    // Save original localStorage
    const originalLocalStorage = window.localStorage;
    
    // Create and set mock localStorage
    const mockStorage = new MockLocalStorage();
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true
    });
    
    // Return function to restore original localStorage
    return () => {
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true
      });
    };
  }