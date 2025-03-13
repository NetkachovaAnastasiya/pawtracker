// src/services/authService.js
// EVIDENCE: Framework React - API integration (Junior)

export const createAuthService = (logger) => {
    // Мок для користувача (в реальному додатку це було б пов'язано з API)
    let currentUser = JSON.parse(localStorage.getItem('user')) || null;
    
    return {
      getCurrentUser: () => currentUser,
      
      login: async (username, password) => {
        logger.log('Attempting login', { username });
        
        // Імітація API-запиту
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (username === 'demo' && password === 'password') {
          currentUser = { 
            id: '1', 
            username: 'demo',
            name: 'Demo User',
            preferences: {
              fontSize: 'medium'
            }
          };
          localStorage.setItem('user', JSON.stringify(currentUser));
          logger.log('Login successful', { username });
          return { success: true, user: currentUser };
        }
        
        logger.error('Login failed', { username });
        return { success: false, error: 'Invalid credentials' };
      },
      
      logout: () => {
        logger.log('User logged out', { user: currentUser?.username });
        currentUser = null;
        localStorage.removeItem('user');
      },
      
      updateUserPreferences: (preferences) => {
        if (!currentUser) return false;
        
        currentUser = {
          ...currentUser,
          preferences: {
            ...currentUser.preferences,
            ...preferences
          }
        };
        
        localStorage.setItem('user', JSON.stringify(currentUser));
        logger.log('User preferences updated', { preferences });
        return true;
      }
    };
  };