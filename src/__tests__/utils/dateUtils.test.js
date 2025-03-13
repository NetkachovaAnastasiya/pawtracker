// src/__tests__/utils/dateUtils.test.js
// EVIDENCE: Code-Based Testing - Unit testing fundamentals (Junior)
import { formatDate, addDays, formatDateForInput } from '../../utils/dateUtils';

// EVIDENCE: Code-Based Testing - Test organization using describes and groups (Middle)
describe('Date Utility Functions', () => {
  // EVIDENCE: Code-Based Testing - Basic matchers for testing expected values (Junior)
  describe('formatDate function', () => {
    test('formats date correctly for en-US locale', () => {
      // Mock a fixed date to avoid test flakiness
      const testDate = new Date(2023, 5, 15); // June 15, 2023
      
      // Call with fixed language parameter
      const result = formatDate(testDate.toISOString(), 'en');
      
      // Result format might vary by environment, so we'll check parts
      expect(result).toContain('Jun');
      expect(result).toContain('15');
      expect(result).toContain('2023');
    });
    
    test('formats date correctly for uk-UA locale', () => {
      // Mock a fixed date to avoid test flakiness
      const testDate = new Date(2023, 5, 15); // June 15, 2023
      
      // Call with fixed language parameter
      const result = formatDate(testDate.toISOString(), 'uk');
      
      // Result format might vary by environment, so we'll check parts
      expect(result).toContain('черв');
      expect(result).toContain('15');
      expect(result).toContain('2023');
    });
  });
  
  describe('addDays function', () => {
    test('adds positive days correctly', () => {
      const startDate = new Date(2023, 5, 15); // June 15, 2023
      const resultDate = addDays(startDate, 5);
      
      expect(resultDate.getDate()).toBe(20); // 15 + 5 = 20
      expect(resultDate.getMonth()).toBe(5); // Still June (0-indexed)
      expect(resultDate.getFullYear()).toBe(2023);
    });
    
    test('adds negative days correctly', () => {
      const startDate = new Date(2023, 5, 15); // June 15, 2023
      const resultDate = addDays(startDate, -5);
      
      expect(resultDate.getDate()).toBe(10); // 15 - 5 = 10
      expect(resultDate.getMonth()).toBe(5); // Still June (0-indexed)
      expect(resultDate.getFullYear()).toBe(2023);
    });
    
    test('handles month/year transition correctly', () => {
      const startDate = new Date(2023, 5, 28); // June 28, 2023
      const resultDate = addDays(startDate, 5);
      
      expect(resultDate.getDate()).toBe(3); // July 3
      expect(resultDate.getMonth()).toBe(6); // July (0-indexed)
      expect(resultDate.getFullYear()).toBe(2023);
    });
    
    test('handles year transition correctly', () => {
      const startDate = new Date(2023, 11, 29); // December 29, 2023
      const resultDate = addDays(startDate, 5);
      
      expect(resultDate.getDate()).toBe(3); // January 3
      expect(resultDate.getMonth()).toBe(0); // January (0-indexed)
      expect(resultDate.getFullYear()).toBe(2024);
    });
  });
  
  describe('formatDateForInput function', () => {
    test('formats date as YYYY-MM-DD for HTML input', () => {
      const testDate = new Date(2023, 5, 15); // June 15, 2023
      const result = formatDateForInput(testDate);
      
      expect(result).toBe('2023-06-15');
    });
    
    test('adds leading zeros to month and day when needed', () => {
      const testDate = new Date(2023, 0, 5); // January 5, 2023
      const result = formatDateForInput(testDate);
      
      expect(result).toBe('2023-01-05');
    });
  });
});