import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ROUTES, APP_CONFIG } from '../utils/constants';
import { authService } from '../services/AuthService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const user = authService.getUserData();
      setUserData(user);
      // Simular notificaciones
      setNotifications([
        { id: 1, message: "Nueva cita programada para Luna", time: "hace 5 min", read: false, type: "appointment" },
        { id: 2, message: "Recordatorio: Vacuna pendiente", time: "hace 1 hora", read: false, type: "reminder" },
        { id: 3, message: "Pago procesado exitosamente", time: "hace 2 horas", read: true, type: "payment" }
      ]);
    }
  }, []);

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    if (item.public) return true;
    if (!authService.isAuthenticated()) return false;
    if (!item.roles) return true;
    const userRole = authService.getUserRole();
    return item.roles.includes(userRole) || userRole === 'ROLE_ADMIN';
  };

  // Cerrar sesión
  const handleLogout = () => {
    authService.logout();
    setUserData(null);
    toast.success('Sesión cerrada exitosamente', {
      icon: '👋'
    });
    navigate(ROUTES.HOME);
  };

  // Obtener color del rol
  const getRoleColor = (role) => {
    const colors = {
      'ROLE_ADMIN': 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
      'ROLE_VETERINARIO': 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
      'ROLE_PROPIETARIO': 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
      'ROLE_USER': 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
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

  // Marcar notificación como leída
  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Obtener icono de notificación por tipo
  const getNotificationIcon = (type) => {
    const icons = {
      appointment: '📅',
      reminder: '⏰',
      payment: '💳',
      default: '🔔'
    };
    return icons[type] || icons.default;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className={`
      fixed top-0 w-full z-50 transition-all duration-300
      ${scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
        : 'bg-white/80 backdrop-blur-sm shadow-sm'
      }
    `}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo y título mejorado */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                🏥
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {APP_CONFIG.APP_NAME}
              </h1>
              <p className="text-xs text-gray-500 font-medium">Sistema Veterinario v{APP_CONFIG.VERSION}</p>
            </div>
          </Link>

          {/* Navegación desktop mejorada */}
          <nav className="hidden lg:flex space-x-1">
            {navigation.filter(canAccess).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 
                  flex items-center space-x-2 group overflow-hidden
                  ${isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }
                `}
              >
                <span className="relative z-10 text-lg">{item.icon}</span>
                <span className="relative z-10">{item.name}</span>
                
                {/* Efecto hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                
                {/* Indicador activo */}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Área de usuario mejorada */}
          <div className="flex items-center space-x-3">
            {userData ? (
              <>
                {/* Notificaciones */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">🔔</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown de notificaciones */}
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                      <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <h3 className="font-semibold">Notificaciones</h3>
                        <p className="text-sm opacity-90">{unreadCount} nuevas</p>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => markNotificationAsRead(notification.id)}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                              <div className="flex-1">
                                <p className={`text-sm ${!notification.read ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-3 bg-gray-50">
                        <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
                          Ver todas las notificaciones
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Menú de usuario */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium text-gray-800">{userData.username}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${getRoleColor(userData.role)}`}>
                        {getRoleName(userData.role)}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform shadow-lg">
                        {userData.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown del usuario */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                      <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-bold text-lg">
                            {userData.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{userData.username}</div>
                            <div className="text-sm opacity-90">{userData.email}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            toast.info('Función de perfil en desarrollo', { icon: '🚧' });
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-colors flex items-center space-x-3"
                        >
                          <span className="text-lg">👤</span>
                          <div>
                            <div className="font-medium">Mi Perfil</div>
                            <div className="text-xs text-gray-500">Configuración de cuenta</div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            toast.info('Función de configuración en desarrollo', { icon: '⚙️' });
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-colors flex items-center space-x-3"
                        >
                          <span className="text-lg">⚙️</span>
                          <div>
                            <div className="font-medium">Configuración</div>
                            <div className="text-xs text-gray-500">Preferencias del sistema</div>
                          </div>
                        </button>
                        
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              handleLogout();
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center space-x-3"
                          >
                            <span className="text-lg">🚪</span>
                            <div>
                              <div className="font-medium">Cerrar Sesión</div>
                              <div className="text-xs text-red-500">Salir de la cuenta</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Usuario no autenticado */
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-lg">🔑</span>
                <span className="font-medium">Iniciar Sesión</span>
              </Link>
            )}

            {/* Botón menú móvil */}
            <button
              className="lg:hidden p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil mejorado */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200/50 mt-4">
            <div className="space-y-2 pt-4">
              {navigation.filter(canAccess).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 
                    flex items-center space-x-3
                    ${isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Información de usuario en móvil */}
              {userData && (
                <div className="pt-4 border-t border-gray-200/50 mt-4">
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold">
                        {userData.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{userData.username}</div>
                        <div className={`text-xs px-2 py-1 rounded-full inline-block ${getRoleColor(userData.role)}`}>
                          {getRoleName(userData.role)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>🚪</span>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cerrar dropdowns al hacer click fuera */}
      {(isUserMenuOpen || isNotificationsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsNotificationsOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;