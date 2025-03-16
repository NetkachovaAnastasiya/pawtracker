import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock localStorage
export const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

// Mock Hugging Face API
export const mockAiResponse = {
  generated_text: `
    1. Water intake:
    Based on your dog's weight, they should drink approximately 40-60ml of water per kg of body weight daily. 
    
    2. Exercise needs:
    For a dog with high activity level, aim for 60-90 minutes of exercise daily.
    
    3. Nutritional considerations:
    Consider supplementing with omega-3 fatty acids and ensure protein content is adequate.
    
    4. Health monitoring tips:
    Regular weight checks, dental care, and watch for any changes in energy levels.
  `
};

// Mock server for API requests
export const server = setupServer(
  rest.post('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([mockAiResponse])
    );
  }),
  
  // Add additional handlers for other API endpoints if needed
);