import React, { useState } from 'react';

export const AdvancedSearch = ({ 
  onSearch, 
  placeholder = "Buscar...", 
  filters = [],
  onFilterChange 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value, activeFilters);
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
    onSearch(searchTerm, newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
    onSearch('', {});
  };

  const activeFilterCount = Object.values(activeFilters).filter(v => v && v !== 'TODOS').length;

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      {/* Barra de búsqueda principal */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </div>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg transition-colors relative ${
            showFilters 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🔧 Filtros
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {(searchTerm || activeFilterCount > 0) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            ✖️ Limpiar
          </button>
        )}
      </div>

      {/* Panel de filtros avanzados */}
      {showFilters && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                
                {filter.type === 'select' && (
                  <select
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Todos</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {filter.type === 'date' && (
                  <input
                    type="date"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                )}

                {filter.type === 'dateRange' && (
                  <div className="space-y-2">
                    <input
                      type="date"
                      placeholder="Desde"
                      value={activeFilters[`${filter.key}_desde`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.key}_desde`, e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                    <input
                      type="date"
                      placeholder="Hasta"
                      value={activeFilters[`${filter.key}_hasta`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.key}_hasta`, e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                )}

                {filter.type === 'number' && (
                  <input
                    type="number"
                    placeholder={filter.placeholder}
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    min={filter.min}
                    max={filter.max}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros activos */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Filtros activos:</span>
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value || value === 'TODOS') return null;
            
            const filter = filters.find(f => f.key === key || key.startsWith(f.key));
            const label = filter ? filter.label : key;
            
            return (
              <span
                key={key}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
              >
                {label}: {value}
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Filtros específicos para cada sección
export const citasFilters = [
  {
    key: 'estado',
    label: 'Estado',
    type: 'select',
    options: [
      { value: 'PROGRAMADA', label: 'Programada' },
      { value: 'EN_CURSO', label: 'En Curso' },
      { value: 'ATENDIDA', label: 'Atendida' },
      { value: 'CANCELADA', label: 'Cancelada' },
      { value: 'REPROGRAMADA', label: 'Reprogramada' }
    ]
  },
  {
    key: 'fecha',
    label: 'Fecha',
    type: 'dateRange'
  },
  {
    key: 'urgencia',
    label: 'Urgencia',
    type: 'select',
    options: [
      { value: 'true', label: 'Solo urgencias' },
      { value: 'false', label: 'Sin urgencias' }
    ]
  }
];

export const mascotasFilters = [
  {
    key: 'especie',
    label: 'Especie',
    type: 'select',
    options: [
      { value: 'Perro', label: 'Perro' },
      { value: 'Gato', label: 'Gato' },
      { value: 'Ave', label: 'Ave' },
      { value: 'Conejo', label: 'Conejo' },
      { value: 'Otro', label: 'Otro' }
    ]
  },
  {
    key: 'edad',
    label: 'Edad (meses)',
    type: 'number',
    placeholder: 'Edad máxima',
    min: 1,
    max: 300
  },
  {
    key: 'peso',
    label: 'Peso (kg)',
    type: 'number',
    placeholder: 'Peso máximo',
    min: 0.1,
    max: 100
  }
];

export const productosFilters = [
  {
    key: 'categoria',
    label: 'Categoría',
    type: 'select',
    options: [
      { value: 'Alimento', label: 'Alimento' },
      { value: 'Juguetes', label: 'Juguetes' },
      { value: 'Medicina', label: 'Medicina' },
      { value: 'Accesorios', label: 'Accesorios' },
      { value: 'Higiene', label: 'Higiene' }
    ]
  },
  {
    key: 'precio_min',
    label: 'Precio mínimo',
    type: 'number',
    placeholder: '0',
    min: 0
  },
  {
    key: 'precio_max',
    label: 'Precio máximo',
    type: 'number',
    placeholder: '1000000',
    min: 0
  },
  {
    key: 'stock',
    label: 'Con Stock',
    type: 'select',
    options: [
      { value: 'true', label: 'Solo con stock' },
      { value: 'false', label: 'Sin stock' }
    ]
  }
];