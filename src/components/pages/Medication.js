import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { formatDate, formatDateForInput, addDays } from '../../utils/dateUtils';

// EVIDENCE: Framework React - Creating maintainable components (Trainee)
function Medication() {
  const { t, darkMode } = useContext(AppContext);
  
  // Get stored dogs
  const [dogs] = useState(() => {
    const saved = localStorage.getItem('dogs');
    return saved ? JSON.parse(saved) : [];
  });
  
  // State for medications
  // EVIDENCE: JavaScript - Variables and data types (Trainee)
  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showForm, setShowForm] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  
  // Today's date for default values
  const today = formatDateForInput(new Date());
  const nextMonth = formatDateForInput(addDays(new Date(), 30));
  
  // Empty medication template
  const emptyMed = {
    id: '',
    dogId: '',
    name: '',
    dose: '',
    frequency: 'daily',
    startDate: today,
    endDate: nextMonth,
    notes: '',
    nextDose: today
  };
  
  // Form state
  const [formData, setFormData] = useState(emptyMed);
  
  // Save medications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);
  
  // Handle input changes
  // EVIDENCE: JavaScript - Event handling (Junior)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Calculate next dose based on frequency
  // EVIDENCE: JavaScript - Function basics (Trainee)
  const calculateNextDose = (med) => {
    const today = new Date();
    const startDate = new Date(med.startDate);
    
    // If start date is in future, next dose is start date
    if (startDate > today) {
      return med.startDate;
    }
    
    // Based on frequency, calculate next dose
    switch (med.frequency) {
      case 'daily':
        return formatDateForInput(addDays(today, 1));
      case 'weekly':
        return formatDateForInput(addDays(today, 7));
      case 'biweekly':
        return formatDateForInput(addDays(today, 14));
      case 'monthly':
        return formatDateForInput(addDays(today, 30));
      default:
        return med.startDate;
    }
  };
  
  // Save medication
  const saveMedication = () => {
    if (!formData.dogId || !formData.name || !formData.dose) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Calculate next dose
    const medWithNextDose = {
      ...formData,
      nextDose: calculateNextDose(formData)
    };
    
    let updatedMeds;
    
    if (editingMed) {
      // Update existing medication
      updatedMeds = medications.map(med => 
        med.id === editingMed.id ? { ...medWithNextDose, id: med.id } : med
      );
    } else {
      // Add new medication
      const newMed = {
        ...medWithNextDose,
        id: Date.now().toString() // Simple unique ID
      };
      updatedMeds = [...medications, newMed];
    }
    
    setMedications(updatedMeds);
    resetForm();
  };
  
  // Delete medication
  // EVIDENCE: JavaScript - Error handling (Junior)
  const deleteMedication = (id) => {
    try {
      if (window.confirm(t('confirmDelete'))) {
        const updatedMeds = medications.filter(med => med.id !== id);
        setMedications(updatedMeds);
      }
    } catch (error) {
      console.error('Error deleting medication:', error);
      alert('Failed to delete medication');
    }
  };
  
  // Edit medication
  const editMedication = (med) => {
    setFormData({ ...med });
    setEditingMed(med);
    setShowForm(true);
  };
  
  // Reset form
  const resetForm = () => {
    setFormData(emptyMed);
    setEditingMed(null);
    setShowForm(false);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('medication')}</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded ${
            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {showForm ? t('cancel') : `${t('add')} ${t('medication')}`}
        </button>
      </div>
      
      {/* Add/Edit medication form */}
      {/* EVIDENCE: Framework React - Conditional rendering (Junior) */}
      {showForm && (
        <div className={`mb-6 p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-xl mb-4">{editingMed ? t('edit') : `${t('add')} ${t('medication')}`}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">{t('dogProfiles')}*</label>
              <select
                name="dogId"
                value={formData.dogId}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                required
              >
                <option value="">-- {t('selectDog')} --</option>
                {dogs.map(dog => (
                  <option key={dog.id} value={dog.id}>{dog.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1">{t('medicationName')}*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">{t('dose')}*</label>
              <input
                type="text"
                name="dose"
                value={formData.dose}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                required
                placeholder="e.g., 1 tablet, 5 ml"
              />
            </div>
            
            <div>
              <label className="block mb-1">{t('frequency')}</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="daily">{t('daily')}</option>
                <option value="weekly">{t('weekly')}</option>
                <option value="biweekly">{t('biweekly')}</option>
                <option value="monthly">{t('monthly')}</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1">{t('startDate')}</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            
            <div>
              <label className="block mb-1">{t('endDate')}</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-1">{t('notes')}</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                rows="3"
              ></textarea>
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
              onClick={saveMedication}
              className={`px-4 py-2 rounded ${
                darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {t('save')}
            </button>
          </div>
        </div>
      )}
      
      {/* Medications list */}
      <div className="grid grid-cols-1 gap-4">
        {medications.length === 0 ? (
          <p>{`No medications added yet. Click "${t('add')} ${t('medication')}" to get started.`}</p>
        ) : (
          /* EVIDENCE: Framework React - List rendering with proper keys (Junior) */
          medications.map(med => {
            // Find which dog this medication is for
            const dog = dogs.find(d => d.id === med.dogId);
            
            return (
              <div
                key={med.id}
                className={`rounded-lg shadow-md p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{med.name}</h3>
                    {dog && <div className="text-sm">{`for ${dog.name}`}</div>}
                  </div>
                  <div>
                    <button
                      onClick={() => editMedication(med)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      {t('edit')}
                    </button>
                    <button
                      onClick={() => deleteMedication(med.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p><strong>{t('dose')}:</strong> {med.dose}</p>
                  <p>
                    <strong>{t('frequency')}:</strong> {
                      med.frequency === 'daily' ? t('daily') :
                      med.frequency === 'weekly' ? t('weekly') :
                      med.frequency === 'biweekly' ? t('biweekly') :
                      t('monthly')
                    }
                  </p>
                  <p><strong>{t('startDate')}:</strong> {formatDate(med.startDate)}</p>
                  <p><strong>{t('endDate')}:</strong> {formatDate(med.endDate)}</p>
                  <p><strong>{t('nextDose')}:</strong> {formatDate(med.nextDose)}</p>
                </div>
                
                {med.notes && (
                  <div className="mt-2">
                    <p><strong>{t('notes')}:</strong> {med.notes}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Medication;