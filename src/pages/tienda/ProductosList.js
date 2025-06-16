import React from 'react';

const ProductosList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          🐾 Tienda Veterinaria
        </h1>
        <div className="flex space-x-2">
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
            ➕ Nuevo Producto
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            🛍️ Ver Carrito
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">🏪</div>
        <h2 className="text-2xl font-semibold mb-2">En Desarrollo</h2>
        <p className="text-gray-600">
          Esta sección estará disponible próximamente. Aquí podrás gestionar 
          el inventario de productos, realizar ventas y procesar pagos.
        </p>
      </div>
    </div>
  );
};

export default ProductosList;