import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/AuthService';
import { ROUTES } from '../../utils/constants';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Estados del formulario de login
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Estados del formulario de registro
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'USER'
  });

  // Verificar si ya está autenticado
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate(ROUTES.HOME);
    }
  }, [navigate]);

  // Manejar cambios en formulario de login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en formulario de registro
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Procesar login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(loginData);
      toast.success(`¡Bienvenido ${response.username}!`);
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error('Error al iniciar sesión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Procesar registro
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = registerData;
      const response = await authService.register(dataToSend);
      toast.success('¡Registro exitoso! Bienvenido');
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error('Error al registrarse: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar formularios
  const limpiarFormularios = () => {
    setLoginData({ username: '', password: '' });
    setRegisterData({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'USER'
    });
  };

  // Cambiar entre login y registro
  const toggleMode = () => {
    setIsLogin(!isLogin);
    limpiarFormularios();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-4">🏥</div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Veterinaria App
          </h2>
          <p className="text-blue-100">
            {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu nueva cuenta'}
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {isLogin ? (
            /* FORMULARIO DE LOGIN */
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu contraseña"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? '🔄 Iniciando sesión...' : '🔑 Iniciar Sesión'}
              </button>
            </form>
          ) : (
            /* FORMULARIO DE REGISTRO */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  required
                  minLength="3"
                  maxLength="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre de usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={registerData.phone}
                  onChange={handleRegisterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3001234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  name="role"
                  value={registerData.role}
                  onChange={handleRegisterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USER">Usuario</option>
                  <option value="PROPIETARIO">Propietario</option>
                  <option value="VETERINARIO">Veterinario</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                    minLength="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                    minLength="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? '🔄 Creando cuenta...' : '✨ Crear Cuenta'}
              </button>
            </form>
          )}

          {/* Toggle entre login y registro */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {isLogin 
                ? '¿No tienes cuenta? Regístrate aquí' 
                : '¿Ya tienes cuenta? Inicia sesión aquí'
              }
            </button>
          </div>

          {/* Información adicional */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>🔒 Tus datos están seguros con nosotros</p>
          </div>
        </div>

        {/* Información del sistema */}
        <div className="text-center text-blue-100 text-sm">
          <p>Sistema de Gestión Veterinaria v2.0</p>
          <p>Desarrollado para el cuidado de tus mascotas 🐾</p>
        </div>
      </div>
    </div>
  );
};

export default Login;