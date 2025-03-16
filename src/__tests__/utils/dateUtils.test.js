// src/__tests__/utils/dateUtils.test.js
import { formatDate, addDays, formatDateForInput } from '../../utils/dateUtils';

describe('Date Utilities', () => {
  // Mock Date constructor
  const RealDate = global.Date;
  
  beforeEach(() => {
    // Mock date to a fixed date for consistent testing
    global.Date = class extends RealDate {
      constructor(...args) {
        if (args.length === 0) {
          // When called with no arguments, return a fixed date
          return new RealDate('2023-05-15T12:00:00Z');
        }
        return new RealDate(...args);
      }
    };
    
    // Preserve static methods
    global.Date.now = RealDate.now;
  });
  
  afterEach(() => {
    // Restore original Date
    global.Date = RealDate;
  });
  
  // Test 1: formatDate formats dates correctly
  test('formatDate formats dates correctly', () => {
    const date = '2023-05-15';
    const result = formatDate(date);
    expect(result).toMatch(/May 15, 2023/i);
  });
  
  // Test 2: addDays adds days correctly
  test('addDays adds days correctly', () => {
    const date = new Date('2023-05-15');
    
    const result1 = addDays(date, 5);
    expect(result1.getDate()).toBe(20);
    expect(result1.getMonth()).toBe(4); // May is 4 (0-indexed)
    
    const result2 = addDays(date, 20);
    expect(result2.getDate()).toBe(4);
    expect(result2.getMonth()).toBe(5); // June is 5
  });
  
  // Test 3: addDays handles month and year boundaries
  test('addDays handles month and year boundaries', () => {
    const endOfYear = new Date('2023-12-31');
    
    const nextYear = addDays(endOfYear, 1);
    expect(nextYear.getDate()).toBe(1);
    expect(nextYear.getMonth()).toBe(0); // January is 0
    expect(nextYear.getFullYear()).toBe(2024);
    
    const endOfFeb = new Date('2023-02-28');
    const marchFirst = addDays(endOfFeb, 1);
    expect(marchFirst.getDate()).toBe(1);
    expect(marchFirst.getMonth()).toBe(2); // March is 2
  });
  
  // Test 4: formatDateForInput formats dates for input elements
  test('formatDateForInput formats dates for input elements', () => {
    const date = new Date('2023-05-15');
    const result = formatDateForInput(date);
    expect(result).toBe('2023-05-15');
  });
  
  // Test 5: formatDateForInput handles single-digit months and days
  test('formatDateForInput pads single-digit months and days', () => {
    const date = new Date('2023-01-05');
    const result = formatDateForInput(date);
    expect(result).toBe('2023-01-05');
    
    const date2 = new Date('2023-10-09');
    const result2 = formatDateForInput(date2);
    expect(result2).toBe('2023-10-09');
  });
});