import React, { useState } from 'react';
import { href, Link, Route, useLocation } from 'react-router-dom';
import { ROUTES, APP_CONFIG } from '../utils/constants';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Inicio', href: ROUTES.HOME, icon: '🏠' },
    { name: 'Mascotas', href: ROUTES.MASCOTAS, icon: '🐕' },
    { name: 'Citas', href: ROUTES.CITAS, icon: '📅' },
    { name: 'Agenda', href: ROUTES.AGENDA, icon: '🗓️' },
    { name: 'Tienda', href: ROUTES.TIENDA, icon: '🛒' },
    { name: 'Historias', href: ROUTES.HISTORIAS, icon: '📋' },
    { name: 'iniciar sesión', href: '/login', icon: '👥' },
    
  ];

  const isActive = (path) => location.pathname === path;

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
            {navigation.map((item) => (
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

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-1">
              {navigation.map((item) => (
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
            </div>
          </div>
        )}
      </div>    
      
    </header>
  );
};

export default Header;