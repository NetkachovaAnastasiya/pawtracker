// src/context/DataContext.js
import React, { createContext, useState, useEffect } from 'react';

// EVIDENCE: Framework React - Context API usage to avoid prop drilling (Junior)
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Dogs data
  // EVIDENCE: JavaScript - Variables and data types (Trainee)
  const [dogs, setDogs] = useState(() => {
    const saved = localStorage.getItem('dogs');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Medications data
  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Food calculations data
  const [calculations, setCalculations] = useState(() => {
    const saved = localStorage.getItem('foodCalculations');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Save data to localStorage whenever it changes
  // EVIDENCE: Framework React - useEffect for side effects (Junior)
  useEffect(() => {
    localStorage.setItem('dogs', JSON.stringify(dogs));
  }, [dogs]);
  
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);
  
  useEffect(() => {
    localStorage.setItem('foodCalculations', JSON.stringify(calculations));
  }, [calculations]);
  
  // Dog-related functions
  // EVIDENCE: JavaScript - Function basics (Trainee)
  const addDog = (dog) => {
    const newDog = {
      ...dog,
      id: Date.now().toString() // Simple unique ID
    };
    setDogs(prevDogs => [...prevDogs, newDog]);
    return newDog;
  };
  
  const updateDog = (updatedDog) => {
    setDogs(prevDogs => 
      prevDogs.map(dog => dog.id === updatedDog.id ? updatedDog : dog)
    );
  };
  
  const deleteDog = (id) => {
    setDogs(prevDogs => prevDogs.filter(dog => dog.id !== id));
  };
  
  // Medication-related functions
  const addMedication = (medication) => {
    const newMedication = {
      ...medication,
      id: Date.now().toString() // Simple unique ID
    };
    setMedications(prevMeds => [...prevMeds, newMedication]);
    return newMedication;
  };
  
  const updateMedication = (updatedMedication) => {
    setMedications(prevMeds => 
      prevMeds.map(med => med.id === updatedMedication.id ? updatedMedication : med)
    );
  };
  
  const deleteMedication = (id) => {
    setMedications(prevMeds => prevMeds.filter(med => med.id !== id));
  };
  
  // Food calculation-related functions
  const addCalculation = (calculation) => {
    const newCalculation = {
      ...calculation,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setCalculations(prevCalcs => [newCalculation, ...prevCalcs]);
    return newCalculation;
  };
  
  // Context value
  const contextValue = {
    // Data
    dogs,
    medications,
    calculations,
    // Dog functions
    addDog,
    updateDog,
    deleteDog,
    // Medication functions
    addMedication,
    updateMedication,
    deleteMedication,
    // Calculation functions
    addCalculation
  };
  
  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};