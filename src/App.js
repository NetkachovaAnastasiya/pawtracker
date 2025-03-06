import React, { useState } from 'react';

function App() {
  const [dogs] = useState([
    { id: 1, name: 'John', info: 'Sample dog information' },
    { id: 2, name: 'Rex', info: 'Sample dog information' },
    { id: 3, name: 'Buddy', info: 'Sample dog information' }
  ]);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">PawTracker</h1>
      </header>
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Welcome to PawTracker!</h2>
          <p className="text-gray-700 mb-4">This app helps you manage your dog's information, food, and medications.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dogs.map(dog => (
            <div key={dog.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-blue-700">{dog.name}</h3>
              <p className="text-gray-600">{dog.info}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;