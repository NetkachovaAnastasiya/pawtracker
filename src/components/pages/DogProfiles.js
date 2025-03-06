import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

// EVIDENCE: Framework React - Component composition (Trainee)
function DogProfiles() {
  const { t, darkMode } = useContext(AppContext);
  
  // State for dogs list
  // EVIDENCE: JavaScript - Variables and data types (Trainee)
  const [dogs, setDogs] = useState(() => {
    const saved = localStorage.getItem('dogs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showForm, setShowForm] = useState(false);
  const [editingDog, setEditingDog] = useState(null);
  
  // Empty dog template
  const emptyDog = {
    id: '',
    name: '',
    breed: '',
    weight: '',
    age: '',
    activityLevel: 'moderate'
  };
  
  // Form state
  const [formData, setFormData] = useState(emptyDog);
  
  // Save dogs to localStorage when they change
  // EVIDENCE: Framework React - useEffect for side effects (Junior)
  useEffect(() => {
    localStorage.setItem('dogs', JSON.stringify(dogs));
  }, [dogs]);
  
  // Handle form input changes
  // EVIDENCE: JavaScript - Event handling (Junior)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save dog
  // EVIDENCE: JavaScript - Function basics (Trainee)
  const saveDog = () => {
    // Validate required fields
    if (!formData.name || !formData.breed || !formData.weight) {
      alert('Please fill in all required fields');
      return;
    }
    
    let updatedDogs;
    
    if (editingDog) {
      // Update existing dog
      updatedDogs = dogs.map(dog => 
        dog.id === editingDog.id ? { ...formData, id: dog.id } : dog
      );
    } else {
      // Add new dog
      const newDog = {
        ...formData,
        id: Date.now().toString() // Simple unique ID
      };
      updatedDogs = [...dogs, newDog];
    }
    
    setDogs(updatedDogs);
    resetForm();
  };
  
  // Delete dog
  // EVIDENCE: JavaScript - Error handling (Junior)
  const deleteDog = (id) => {
    try {
      if (window.confirm(t('confirmDelete'))) {
        const updatedDogs = dogs.filter(dog => dog.id !== id);
        setDogs(updatedDogs);
      }
    } catch (error) {
      console.error('Error deleting dog:', error);
      alert('Failed to delete dog');
    }
  };
  
  // Edit dog
  const editDog = (dog) => {
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
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('dogProfiles')}</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded ${
            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {showForm ? t('cancel') : t('addDog')}
        </button>
      </div>
      
      {/* Add/Edit form */}
      {/* EVIDENCE: Framework React - Conditional rendering (Junior) */}
      {showForm && (
        <div className={`mb-6 p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-xl mb-4">{editingDog ? t('edit') : t('addDog')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">{t('dogName')}*</label>
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
              <label className="block mb-1">{t('breed')}*</label>
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
              <label className="block mb-1">{t('weight')}*</label>
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
              <label className="block mb-1">{t('age')}</label>
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
              <label className="block mb-1">{t('activityLevel')}</label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="low">{t('low')}</option>
                <option value="moderate">{t('moderate')}</option>
                <option value="high">{t('high')}</option>
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
              {t('cancel')}
            </button>
            <button
              onClick={saveDog}
              className={`px-4 py-2 rounded ${
                darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {t('save')}
            </button>
          </div>
        </div>
      )}
      
      {/* Dogs list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dogs.length === 0 ? (
          <p>{`No dogs added yet. Click "${t('addDog')}" to get started.`}</p>
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
                    onClick={() => editDog(dog)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => deleteDog(dog.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
              
              <div className="mt-2">
                <p><strong>{t('breed')}:</strong> {dog.breed}</p>
                <p><strong>{t('weight')}:</strong> {dog.weight} kg</p>
                {dog.age && <p><strong>{t('age')}:</strong> {dog.age} years</p>}
                <p>
                  <strong>{t('activityLevel')}:</strong> {
                    dog.activityLevel === 'low' ? t('low') :
                    dog.activityLevel === 'high' ? t('high') :
                    t('moderate')
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