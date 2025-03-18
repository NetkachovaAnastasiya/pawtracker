import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import '@testing-library/jest-dom';
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

global.BroadcastChannel = class {
  postMessage() {}
  addEventListener() {}
  removeEventListener() {}
  close() {}
};

afterEach(() => {
  jest.clearAllMocks();
});

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

