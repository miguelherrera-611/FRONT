import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ROUTES, APP_CONFIG } from '../utils/constants';
import { authService } from '../services/AuthService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const user = authService.getUserData();
      setUserData(user);
    }
  }, []);

  const navigation = [
    { name: 'Inicio', href: ROUTES.HOME, icon: '🏠', public: true },
    { name: 'Mascotas', href: ROUTES.MASCOTAS, icon: '🐕', roles: ['ROLE_USER', 'ROLE_PROPIETARIO', 'ROLE_VETERINARIO', 'ROLE_ADMIN'] },
    { name: 'Citas', href: ROUTES.CITAS, icon: '📅', roles: ['ROLE_USER', 'ROLE_PROPIETARIO', 'ROLE_VETERINARIO', 'ROLE_ADMIN'] },
    { name: 'Agenda', href: ROUTES.AGENDA, icon: '🗓️', roles: ['ROLE_VETERINARIO', 'ROLE_ADMIN'] },
    { name: 'Tienda', href: ROUTES.TIENDA, icon: '🛒', public: true },
    { name: 'Historias', href: ROUTES.HISTORIAS, icon: '📋', roles: ['ROLE_VETERINARIO', 'ROLE_ADMIN'] }
  ];

  const isActive = (path) => location.pathname === path;

  // Verificar si el usuario puede ver un elemento de navegación
  const canAccess = (item) => {
    // Si es público, siempre se puede acceder
    if (item.public) return true;
    
    // Si no está autenticado y no es público, no puede acceder
    if (!authService.isAuthenticated()) return false;
    
    // Si no tiene roles específicos, cualquier usuario autenticado puede acceder
    if (!item.roles) return true;
    
    // Verificar si el usuario tiene alguno de los roles requeridos
    const userRole = authService.getUserRole();
    return item.roles.includes(userRole) || userRole === 'ROLE_ADMIN';
  };

  // Cerrar sesión
  const handleLogout = () => {
    authService.logout();
    setUserData(null);
    toast.success('Sesión cerrada exitosamente');
    navigate(ROUTES.HOME);
  };

  // Obtener color del rol
  const getRoleColor = (role) => {
    const colors = {
      'ROLE_ADMIN': 'bg-red-100 text-red-800',
      'ROLE_VETERINARIO': 'bg-blue-100 text-blue-800',
      'ROLE_PROPIETARIO': 'bg-green-100 text-green-800',
      'ROLE_USER': 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  // Obtener nombre del rol
  const getRoleName = (role) => {
    const names = {
      'ROLE_ADMIN': 'Administrador',
      'ROLE_VETERINARIO': 'Veterinario',
      'ROLE_PROPIETARIO': 'Propietario',
      'ROLE_USER': 'Usuario'
    };
    return names[role] || 'Usuario';
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo y título */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="text-2xl">🏥</div>
            <div>
              <h1 className="text-xl font-bold text-blue-600">
                {APP_CONFIG.APP_NAME}
              </h1>
              <p className="text-sm text-gray-500">Sistema de gestión veterinaria</p>
            </div>
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden md:flex space-x-1">
            {navigation.filter(canAccess).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Área de usuario / login */}
          <div className="flex items-center space-x-4">
            {userData ? (
              /* Usuario autenticado */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium">{userData.username}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getRoleColor(userData.role)}`}>
                      {getRoleName(userData.role)}
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
                    {userData.username.charAt(0).toUpperCase()}
                  </div>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown del usuario */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">{userData.username}</div>
                      <div className="text-sm text-gray-500">{userData.email}</div>
                    </div>
                    
                    <button
                      onClick={() => {
                        // Aquí podrías navegar a un perfil de usuario
                        setIsUserMenuOpen(false);
                        toast.info('Función de perfil en desarrollo');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      👤 Mi Perfil
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🚪 Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Usuario no autenticado */
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>🔑</span>
                <span>Iniciar Sesión</span>
              </Link>
            )}

            {/* Botón menú móvil */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-1">
              {navigation.filter(canAccess).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Botones de usuario en móvil */}
              {userData ? (
                <div className="pt-4 border-t border-gray-200">
                  <div className="px-3 py-2">
                    <div className="text-sm font-medium text-gray-900">{userData.username}</div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getRoleColor(userData.role)}`}>
                      {getRoleName(userData.role)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🔑 Iniciar Sesión
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cerrar dropdown al hacer click fuera */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;