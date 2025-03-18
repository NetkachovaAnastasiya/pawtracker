import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the i18next instance to avoid errors
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key) => key,
      i18n: {
        language: 'en',
        changeLanguage: jest.fn()
      }
    };
  }
}));

// Mock localStorage to prevent null reference errors
const mockLocalStorage = {
  getItem: jest.fn().mockImplementation(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

test('renders without crashing', () => {
  render(<App />);
  // Look for the app title element
  const appElement = screen.getByText(/appTitle/i);
  expect(appElement).toBeInTheDocument();
});