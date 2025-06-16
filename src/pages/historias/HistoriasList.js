import React from 'react';

const HistoriasList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          📋 Historias Clínicas
        </h1>
        <div className="flex space-x-2">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            ➕ Nueva Historia
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            🔍 Buscar
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">🏥</div>
        <h2 className="text-2xl font-semibold mb-2">En Desarrollo</h2>
        <p className="text-gray-600">
          Esta sección estará disponible próximamente. Aquí podrás gestionar 
          las historias clínicas completas de todas las mascotas.
        </p>
      </div>
    </div>
  );
};

export default HistoriasList;