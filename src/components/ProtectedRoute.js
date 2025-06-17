import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/AuthService';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico, verificar
  if (requiredRole && !authService.hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta sección.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Tu rol actual: <span className="font-medium">{userRole}</span><br/>
            Rol requerido: <span className="font-medium">{requiredRole}</span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;