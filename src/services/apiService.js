// src/services/apiService.js
// EVIDENCE: Framework React - API integration (Junior)

export const createApiService = (authService, logger) => {
    const baseUrl = 'https://api.example.com'; // Імітація базового URL для API
    
    const handleResponse = async (response) => {
      if (!response.ok) {
        const error = await response.json();
        logger.error('API request failed', { status: response.status, error });
        throw new Error(error.message || 'API request failed');
      }
      return response.json();
    };
    
    return {
      get: async (endpoint, options = {}) => {
        logger.log('API GET request', { endpoint });
        
        // Імітація запиту (в реальному додатку це був би fetch)
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Повертаємо мок-дані залежно від endpoint
        if (endpoint === '/dogs') {
          return JSON.parse(localStorage.getItem('dogs')) || [];
        }
        if (endpoint === '/medications') {
          return JSON.parse(localStorage.getItem('medications')) || [];
        }
        
        return [];
      },
      
      post: async (endpoint, data, options = {}) => {
        logger.log('API POST request', { endpoint, data });
        
        // Імітація запиту
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Логіка зберігання даних у localStorage (імітація POST)
        if (endpoint === '/dogs') {
          const dogs = JSON.parse(localStorage.getItem('dogs')) || [];
          const newDog = { ...data, id: Date.now().toString() };
          const updatedDogs = [...dogs, newDog];
          localStorage.setItem('dogs', JSON.stringify(updatedDogs));
          return newDog;
        }
        
        if (endpoint === '/medications') {
          const medications = JSON.parse(localStorage.getItem('medications')) || [];
          const newMed = { ...data, id: Date.now().toString() };
          const updatedMeds = [...medications, newMed];
          localStorage.setItem('medications', JSON.stringify(updatedMeds));
          return newMed;
        }
        
        return data;
      },
      
      put: async (endpoint, data, options = {}) => {
        logger.log('API PUT request', { endpoint, data });
        
        // Імітація запиту
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Логіка оновлення даних у localStorage (імітація PUT)
        if (endpoint.startsWith('/dogs/')) {
          const dogs = JSON.parse(localStorage.getItem('dogs')) || [];
          const updatedDogs = dogs.map(dog => 
            dog.id === data.id ? { ...data } : dog
          );
          localStorage.setItem('dogs', JSON.stringify(updatedDogs));
          return data;
        }
        
        if (endpoint.startsWith('/medications/')) {
          const medications = JSON.parse(localStorage.getItem('medications')) || [];
          const updatedMeds = medications.map(med => 
            med.id === data.id ? { ...data } : med
          );
          localStorage.setItem('medications', JSON.stringify(updatedMeds));
          return data;
        }
        
        return data;
      },
      
      delete: async (endpoint, options = {}) => {
        logger.log('API DELETE request', { endpoint });
        
        // Імітація запиту
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Логіка видалення даних з localStorage (імітація DELETE)
        if (endpoint.startsWith('/dogs/')) {
          const id = endpoint.split('/').pop();
          const dogs = JSON.parse(localStorage.getItem('dogs')) || [];
          const updatedDogs = dogs.filter(dog => dog.id !== id);
          localStorage.setItem('dogs', JSON.stringify(updatedDogs));
          return { success: true };
        }
        
        if (endpoint.startsWith('/medications/')) {
          const id = endpoint.split('/').pop();
          const medications = JSON.parse(localStorage.getItem('medications')) || [];
          const updatedMeds = medications.filter(med => med.id !== id);
          localStorage.setItem('medications', JSON.stringify(updatedMeds));
          return { success: true };
        }
        
        return { success: true };
      }
    };
  };