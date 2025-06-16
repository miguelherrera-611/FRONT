import React from 'react';

const MascotasList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          🐕 Registro de Mascotas
        </h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          ➕ Nueva Mascota
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">🐾</div>
        <h2 className="text-2xl font-semibold mb-2">En Desarrollo</h2>
        <p className="text-gray-600">
          Esta sección estará disponible próximamente. Aquí podrás gestionar 
          el registro completo de todas las mascotas del sistema.
        </p>
      </div>
    </div>
  );
};

export default MascotasList;