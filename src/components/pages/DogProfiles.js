import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';

// EVIDENCE: Framework React - Component composition (Trainee)
function DogProfiles() {
  // Use i18next for translations
  // EVIDENCE: Libraries React - Integration with third-party libraries (Junior)
  const { t } = useTranslation(['common', 'dogs']);
  
  // Get UI settings from Context
  const { darkMode } = useContext(AppContext);
  
  // Use local state with localStorage instead of Redux
  // EVIDENCE: JavaScript - Variables and data types (Trainee)
  const [dogs, setDogs] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('dogs');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Track loading and error states locally
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Local state for the form
  const [showForm, setShowForm] = useState(false);
  const [editingDog, setEditingDog] = useState(null);
  
  // Empty dog template
  const emptyDog = {
    name: '',
    breed: '',
    weight: '',
    age: '',
    activityLevel: 'moderate'
  };
  
  // Form state
  const [formData, setFormData] = useState(emptyDog);
  
  // Save to localStorage whenever dogs change
  // EVIDENCE: Framework React - useEffect for side effects (Junior)
  useEffect(() => {
    try {
      localStorage.setItem('dogs', JSON.stringify(dogs));
    } catch (error) {
      console.error('Error saving dogs to localStorage:', error);
    }
  }, [dogs]);
  
  // Handle form changes
  // EVIDENCE: JavaScript - Event handling (Junior)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save dog
  // EVIDENCE: Framework React - Child-to-parent communication (Junior)
  const saveDog = () => {
    // Validate required fields
    if (!formData.name || !formData.breed || !formData.weight) {
      alert(t('dogs:requiredFields'));
      return;
    }
    
    if (editingDog) {
      // Update existing dog directly in state
      // EVIDENCE: JavaScript - Array methods and operations (Junior)
      setDogs(currentDogs => 
        currentDogs.map(dog => 
          dog.id === editingDog.id ? { ...formData, id: dog.id } : dog
        )
      );
    } else {
      // Add new dog directly to state
      const newDog = {
        ...formData,
        id: Date.now().toString() // Simple unique ID generation
      };
      setDogs(currentDogs => [...currentDogs, newDog]);
    }
    
    resetForm();
  };
  
  // Delete dog
  // EVIDENCE: JavaScript - Error handling (Junior)
  const deleteDogHandler = (id) => {
    try {
      if (window.confirm(t('confirmDelete'))) {
        // Filter out the deleted dog
        setDogs(currentDogs => currentDogs.filter(dog => dog.id !== id));
      }
    } catch (error) {
      console.error('Error deleting dog:', error);
      setError('Failed to delete dog');
    }
  };
  
  // Edit dog
  const editDogHandler = (dog) => {
    setFormData({ ...dog });
    setEditingDog(dog);
    setShowForm(true);
  };
  
  // Reset form
  const resetForm = () => {
    setFormData(emptyDog);
    setEditingDog(null);
    setShowForm(false);
  };
  
  // Display loading state
  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }
  
  // Display error
  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('navigation.dogProfiles')}</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded ${
            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {showForm ? t('actions.cancel') : t('dogs:addDog')}
        </button>
      </div>
      
      {/* Add/Edit form */}
      {/* EVIDENCE: Framework React - Conditional rendering (Junior) */}
      {showForm && (
        <div className={`mb-6 p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-xl mb-4">{editingDog ? t('dogs:editDog') : t('dogs:addDog')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">{t('dogs:dogName')}*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            
            <div>
              <label className="block mb-1">{t('dogs:breed')}*</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            
            <div>
              <label className="block mb-1">{t('dogs:weight')}*</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                min="0.1"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block mb-1">{t('dogs:age')}</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                min="0.1"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block mb-1">{t('dogs:activityLevel')}</label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="low">{t('dogs:activityOptions.low')}</option>
                <option value="moderate">{t('dogs:activityOptions.moderate')}</option>
                <option value="high">{t('dogs:activityOptions.high')}</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetForm}
              className={`mr-2 px-4 py-2 rounded ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {t('actions.cancel')}
            </button>
            <button
              onClick={saveDog}
              className={`px-4 py-2 rounded ${
                darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {t('actions.save')}
            </button>
          </div>
        </div>
      )}
      
      {/* Dogs list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dogs.length === 0 ? (
          <p>{t('dogs:noDogs')}</p>
        ) : (
          /* EVIDENCE: Framework React - List rendering with proper keys (Junior) */
          dogs.map(dog => (
            <div
              key={dog.id}
              className={`rounded-lg shadow-md p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{dog.name}</h3>
                <div>
                  <button
                    onClick={() => editDogHandler(dog)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    {t('actions.edit')}
                  </button>
                  <button
                    onClick={() => deleteDogHandler(dog.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    {t('actions.delete')}
                  </button>
                </div>
              </div>
              
              <div className="mt-2">
                <p><strong>{t('dogs:breed')}:</strong> {dog.breed}</p>
                <p><strong>{t('dogs:weight')}:</strong> {dog.weight} kg</p>
                {dog.age && <p><strong>{t('dogs:age')}:</strong> {dog.age} years</p>}
                <p>
                  <strong>{t('dogs:activityLevel')}:</strong> {
                    t(`dogs:activityOptions.${dog.activityLevel}`)
                  }
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DogProfiles;