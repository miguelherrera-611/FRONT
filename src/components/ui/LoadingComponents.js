import React from 'react';

// Loading Spinner personalizado
export const LoadingSpinner = ({ size = 'md', text = 'Cargando...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-blue-200 border-t-blue-600`}></div>
      <p className="mt-2 text-gray-600 text-sm">{text}</p>
    </div>
  );
};

// Skeleton para tarjetas de mascotas
export const MascotaSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="flex space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
      <div className="h-4 bg-gray-200 rounded w-16"></div>
      <div className="h-4 bg-gray-200 rounded w-28"></div>
    </div>
  </div>
);

// Skeleton para tabla de citas
export const CitasTableSkeleton = () => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <th key={i} className="px-6 py-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((row) => (
            <tr key={row}>
              {[1, 2, 3, 4, 5, 6, 7].map((cell) => (
                <td key={cell} className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Loading para formularios
export const FormSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-lg animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i}>
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
    <div className="flex gap-2 pt-6">
      <div className="h-10 bg-gray-200 rounded w-24"></div>
      <div className="h-10 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);

// Loading para productos
export const ProductosSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex space-x-1">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="h-16 bg-gray-200 rounded mb-4"></div>
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

// Error State Component
export const ErrorState = ({ 
  message = 'Ha ocurrido un error', 
  onRetry, 
  showRetry = true 
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="text-6xl mb-4">❌</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">¡Oops!</h3>
    <p className="text-gray-600 mb-6 max-w-md">{message}</p>
    {showRetry && onRetry && (
      <button
        onClick={onRetry}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        🔄 Intentar de nuevo
      </button>
    )}
  </div>
);

// Empty State Component
export const EmptyState = ({ 
  icon = '📭', 
  title = 'Sin datos', 
  description = 'No hay información para mostrar',
  action,
  actionText = 'Agregar nuevo'
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6 max-w-md">{description}</p>
    {action && (
      <button
        onClick={action}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        ➕ {actionText}
      </button>
    )}
  </div>
);