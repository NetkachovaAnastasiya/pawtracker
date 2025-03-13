// src/__tests__/setup/customMatchers.js
// EVIDENCE: Code-Based Testing - Custom matchers for specific use cases (Middle)

// Custom matcher for checking if an element has the correct theme-based styling
export const toHaveThemeStyle = (received, darkMode, styleProperty, lightValue, darkValue) => {
    const style = window.getComputedStyle(received);
    const expectedValue = darkMode ? darkValue : lightValue;
    const pass = style[styleProperty] === expectedValue;
    
    return {
      pass,
      message: () => pass
        ? `Expected element not to have ${styleProperty}: ${expectedValue} in ${darkMode ? 'dark' : 'light'} mode`
        : `Expected element to have ${styleProperty}: ${expectedValue} in ${darkMode ? 'dark' : 'light'} mode, but got ${style[styleProperty]}`
    };
  };
  
  // Custom matcher for checking if a component rendered the correct translation
  export const toHaveTranslatedText = (received, text, language) => {
    const textContent = received.textContent || received.innerText;
    const pass = textContent.includes(text);
  
    return {
      pass,
      message: () => pass
        ? `Expected element not to contain translated text "${text}" for language "${language}"`
        : `Expected element to contain translated text "${text}" for language "${language}", but got "${textContent}"`
    };
  };
  
  // Custom matcher for validating form inputs
  export const toBeValidFormInput = (received) => {
    const isValid = !received.validity.valueMissing && 
                    !received.validity.typeMismatch && 
                    !received.validity.patternMismatch;
    
    return {
      pass: isValid,
      message: () => isValid
        ? `Expected form input to be invalid`
        : `Expected form input to be valid, but it has validation errors`
    };
  };
  
  // Custom matcher for checking if localStorage was updated correctly
  export const toHaveLocalStorageItem = (received, key, expectedValue) => {
    const storedValue = localStorage.getItem(key);
    const pass = storedValue === expectedValue;
    
    return {
      pass,
      message: () => pass
        ? `Expected localStorage not to have item "${key}" with value "${expectedValue}"`
        : `Expected localStorage to have item "${key}" with value "${expectedValue}", but got "${storedValue}"`
    };
  };
  
  // Custom matcher for checking calculation results
  export const toHaveCalculatedValue = (received, expected, tolerance = 0) => {
    const pass = Math.abs(received - expected) <= tolerance;
    
    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to equal ${expected} (tolerance: ${tolerance})`
        : `Expected ${received} to equal ${expected} (tolerance: ${tolerance}), but got ${received}`
    };
  };