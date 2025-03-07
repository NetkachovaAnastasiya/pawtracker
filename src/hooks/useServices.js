import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

// EVIDENCE: Framework React - Custom hooks for better organization (Junior)
export const useServices = () => {
  const context = useContext(AppContext);
  
  if (!context || !context.services) {
    throw new Error('useServices must be used within an AppProvider with services');
  }
  
  return context.services;
};