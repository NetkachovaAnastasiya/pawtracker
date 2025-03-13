// src/components/pages/DogProfiles.js
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

function DogProfiles() {
  const { t, darkMode } = useContext(AppContext);
  
  // State для списку собак
  const [dogs, setDogs] = useState(() => {
    const saved = localStorage.getItem('dogs');
    return saved ? JSON.parse(saved) : [];
  });
  
  // State для форми
  const [showForm, setShowForm] = useState(false);
  const [editingDog, setEditingDog] = useState(null);
  
  // Шаблон порожнього собаки
  const emptyDog = {
    id: '',
    name: '',
    breed: '',
    weight: '',
    age: '',
    activityLevel: 'moderate'
  };
  
  const [formData, setFormData] = useState(emptyDog);
  
  // Обробка змін полів форми
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Збереження собаки
  const saveDog = () => {
    if (!formData.name || !formData.breed || !formData.weight) {
      alert('Будь ласка, заповніть усі обов\'язкові поля');
      return;
    }
    
    let updatedDogs;
    
    if (editingDog) {
      // Оновлення існуючого собаки
      updatedDogs = dogs.map(dog => 
        dog.id === editingDog.id ? { ...formData, id: dog.id } : dog
      );
    } else {
      // Add new dog
      const newDog = {
        ...formData,
        id: Date.now().toString() // unique id
      };
      updatedDogs = [...dogs, newDog];
    }
    
    setDogs(updatedDogs);
    localStorage.setItem('dogs', JSON.stringify(updatedDogs));
    resetForm();
  };
  
  // Dog delete
  const deleteDog = (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей профіль собаки?')) {
      const updatedDogs = dogs.filter(dog => dog.id !== id);
      setDogs(updatedDogs);
      localStorage.setItem('dogs', JSON.stringify(updatedDogs));
    }
  };
  
  // Dog edit
  const editDog = (dog) => {
    setFormData({ ...dog });
    setEditingDog(dog);
    setShowForm(true);
  };
  
 //Form reset
  const resetForm = () => {
    setFormData(emptyDog);
    setEditingDog(null);
    setShowForm(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Профілі собак</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-md ${
            darkMode 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-medium transition-colors duration-200`}
        >
          {showForm ? 'Скасувати' : 'Додати собаку'}
        </button>
      </div>
      
      {/* Форма додавання/редагування */}
      {showForm && (
        <div className={`rounded-lg shadow-md p-6 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } mb-6`}>
          <h3 className="text-xl font-semibold mb-4">
            {editingDog ? 'Редагувати собаку' : 'Додати нового собаку'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Ім'я собаки*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Порода*</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Вага (кг)*</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                min="0.1"
                step="0.1"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Вік (роки)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                min="0.1"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Рівень активності</label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
              >
                <option value="low">Низький</option>
                <option value="moderate">Середній</option>
                <option value="high">Високий</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={resetForm}
              className={`mr-2 px-4 py-2 rounded-md ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              } font-medium transition-colors duration-200`}
            >
              Скасувати
            </button>
            <button
              onClick={saveDog}
              className={`px-4 py-2 rounded-md ${
                darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
              } text-white font-medium transition-colors duration-200`}
            >
              Зберегти
            </button>
          </div>
        </div>
      )}
      
      {/* Список собак */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dogs.length === 0 ? (
          <p className={`col-span-full py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Ще не додано жодного собаки. Натисніть "Додати собаку", щоб розпочати.
          </p>
        ) : (
          dogs.map(dog => (
            <div
              key={dog.id}
              className={`rounded-lg shadow-md p-4 ${
                darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
              } transition-colors duration-200`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{dog.name}</h3>
                <div className="flex">
                  <button
                    onClick={() => editDog(dog)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Редагувати
                  </button>
                  <button
                    onClick={() => deleteDog(dog.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Видалити
                  </button>
                </div>
              </div>
              
              <div className="mt-2 text-sm">
                <p className="flex justify-between py-1 border-b border-gray-700">
                  <span className="font-medium">Порода:</span>
                  <span>{dog.breed}</span>
                </p>
                <p className="flex justify-between py-1 border-b border-gray-700">
                  <span className="font-medium">Вага:</span>
                  <span>{dog.weight} кг</span>
                </p>
                {dog.age && (
                  <p className="flex justify-between py-1 border-b border-gray-700">
                    <span className="font-medium">Вік:</span>
                    <span>{dog.age} років</span>
                  </p>
                )}
                <p className="flex justify-between py-1">
                  <span className="font-medium">Активність:</span>
                  <span>
                    {dog.activityLevel === 'low' ? 'Низька' :
                     dog.activityLevel === 'high' ? 'Висока' : 'Середня'}
                  </span>
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