// src/__tests__/utils/aiUtils.test.js
import { getDogRecommendations } from '../../utils/aiUtils';
import { server } from '../mocks/serviceMocks';
import fetchMock from 'jest-fetch-mock';

// Setup fetch mock
fetchMock.enableMocks();

// Setup mock server
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  fetchMock.resetMocks();
});
afterAll(() => server.close());

describe('AI Utilities', () => {
  // Mock environment variables
  const originalEnv = process.env;
  
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      REACT_APP_HUGGINGFACE_API_KEY: 'test-api-key'
    };
  });
  
  afterEach(() => {
    process.env = originalEnv;
  });
  
  // Test 1: Creates the correct prompt based on dog data
  test('creates the correct prompt based on dog data', async () => {
    // Mock successful response
    fetchMock.mockResponseOnce(JSON.stringify([{ generated_text: 'Test response' }]));
    
    const dogData = {
      breed: 'Labrador',
      weight: 30,
      age: 5,
      activityLevel: 'high'
    };
    
    const foodCalculation = {
      daily: 720,
      perMeal: 360,
      mealCount: 2
    };
    
    await getDogRecommendations(dogData, foodCalculation, 'en');
    
    // Check that fetch was called with the correct arguments
    expect(fetchMock).toHaveBeenCalledTimes(1);
    
    const fetchCall = fetchMock.mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);
    
    // Check prompt content
    expect(requestBody.inputs).toContain('Labrador');
    expect(requestBody.inputs).toContain('30 kg');
    expect(requestBody.inputs).toContain('5 years');
    expect(requestBody.inputs).toContain('high');
    expect(requestBody.inputs).toContain('720 grams');
    expect(requestBody.inputs).toContain('360 grams per meal');
    expect(requestBody.inputs).toContain('2 meals per day');
  });
  
  // Test 2: Includes language instructions in the prompt
  test('includes language instructions in the prompt', async () => {
    // Mock successful response
    fetchMock.mockResponseOnce(JSON.stringify([{ generated_text: 'Test response' }]));
    
    const dogData = { breed: 'Labrador', weight: 30 };
    const foodCalculation = { daily: 600, perMeal: 300, mealCount: 2 };
    
    // Test English
    await getDogRecommendations(dogData, foodCalculation, 'en');
    const enRequest = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(enRequest.inputs).toContain('Please provide the response in English');
    
    // Reset and test Ukrainian
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify([{ generated_text: 'Test response' }]));
    
    await getDogRecommendations(dogData, foodCalculation, 'uk');
    const ukRequest = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(ukRequest.inputs).toContain('українською мовою');
  });
  
  // Test 3: Handles API errors correctly
  test('handles API errors correctly', async () => {
    // Mock error response
    fetchMock.mockRejectOnce(new Error('API Error'));
    
    const dogData = { breed: 'Labrador', weight: 30 };
    const foodCalculation = { daily: 600, perMeal: 300, mealCount: 2 };
    
    // Function should throw an error
    await expect(getDogRecommendations(dogData, foodCalculation, 'en')).rejects.toThrow();
  });
  
  // Test 4: Handles missing API key correctly
  test('handles missing API key correctly', async () => {
    // Remove API key
    delete process.env.REACT_APP_HUGGINGFACE_API_KEY;
    
    const dogData = { breed: 'Labrador', weight: 30 };
    const foodCalculation = { daily: 600, perMeal: 300, mealCount: 2 };
    
    // Function should throw an error about missing API key
    await expect(getDogRecommendations(dogData, foodCalculation, 'en')).rejects.toThrow(/API key is missing/);
  });
  
  // Test 5: Processes response correctly
  test('processes response correctly', async () => {
    // Mock successful response
    const mockResponse = {
      generated_text: 'This is a test response from the AI model.'
    };
    
    fetchMock.mockResponseOnce(JSON.stringify([mockResponse]));
    
    const dogData = { breed: 'Labrador', weight: 30 };
    const foodCalculation = { daily: 600, perMeal: 300, mealCount: 2 };
    
    const result = await getDogRecommendations(dogData, foodCalculation, 'en');
    
    // Check result matches mock response
    expect(result).toBe(mockResponse.generated_text);
  });
});