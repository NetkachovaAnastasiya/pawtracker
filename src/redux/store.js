// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import dogsReducer from './slices/dogsSlice';

// EVIDENCE: Technical Process - Technical debt management (Middle)
const createStore = (services) => {
  return configureStore({
    reducer: {
      dogs: dogsReducer,
      // Додайте інші редюсери по мірі створення
    },
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
        thunk: {
          extraArgument: services
        }
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export default createStore;