import React from 'react';

const CitasList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          📅 Gestión de Citas
        </h1>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
          ➕ Nueva Cita
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-semibold mb-2">En Desarrollo</h2>
        <p className="text-gray-600">
          Esta sección estará disponible próximamente. Aquí podrás programar, 
          modificar y gestionar todas las citas de la clínica veterinaria.
        </p>
      </div>
    </div>
  );
};

export default CitasList;
