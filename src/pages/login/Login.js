import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/AuthService';
import { ROUTES } from '../../utils/constants';
import { AnimatedButton } from '../../components/ui/Animations';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentBackground, setCurrentBackground] = useState(0);

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

  // Fondos rotativos
  const backgrounds = [
    'from-blue-600 via-purple-600 to-indigo-700',
    'from-green-500 via-teal-600 to-blue-600',
    'from-purple-600 via-pink-600 to-red-600',
    'from-yellow-500 via-orange-600 to-red-600',
    'from-indigo-600 via-purple-600 to-pink-600'
  ];

  // Verificar si ya está autenticado
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate(ROUTES.HOME);
    }
  }, [navigate]);

  // Cambiar fondo cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground(prev => (prev + 1) % backgrounds.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
      toast.success(`🎉 ¡Bienvenido ${response.username}!`, {
        icon: '👋',
        style: {
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      });
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error('❌ Error al iniciar sesión: ' + error.message, {
        icon: '🚫'
      });
    } finally {
      setLoading(false);
    }
  };

  // Procesar registro
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validaciones mejoradas
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('🔐 Las contraseñas no coinciden', {
        icon: '⚠️'
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('🔒 La contraseña debe tener al menos 6 caracteres', {
        icon: '📏'
      });
      return;
    }

    if (!registerData.email.includes('@')) {
      toast.error('📧 El email no es válido', {
        icon: '⚠️'
      });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = registerData;
      const response = await authService.register(dataToSend);
      toast.success('🎉 ¡Registro exitoso! Bienvenido a nuestra familia', {
        icon: '🚀',
        style: {
          background: 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)',
          color: 'white'
        }
      });
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error('❌ Error al registrarse: ' + error.message, {
        icon: '🚫'
      });
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
    setShowPassword(false);
  };

  // Demo login
  const demoLogin = async (role) => {
    const demoAccounts = {
      admin: { username: 'admin', password: 'admin123' },
      vet: { username: 'veterinario', password: 'vet123' },
      owner: { username: 'propietario', password: 'owner123' }
    };

    setLoginData(demoAccounts[role]);
    toast.info(`🎭 Iniciando sesión como ${role}...`, {
      icon: '🔧'
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgrounds[currentBackground]} transition-all duration-1000 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}>
      {/* Elementos decorativos animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header animado */}
        <div className="text-center animate-slideInDown">
          <div className="relative mb-6">
            <div className="text-8xl mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
              🏥
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-2 text-shadow-lg">
            Veterinaria App
          </h2>
          <p className="text-blue-100 text-lg">
            {isLogin ? 'Bienvenido de vuelta' : 'Únete a nuestra familia'}
          </p>
          
          {/* Indicador de modo */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full transition-all ${isLogin ? 'bg-white' : 'bg-white/50'}`}></div>
            <div className={`w-2 h-2 rounded-full transition-all ${!isLogin ? 'bg-white' : 'bg-white/50'}`}></div>
          </div>
        </div>

        {/* Formulario */}
        <div className="glass-effect rounded-2xl shadow-2xl p-8 animate-slideInUp border border-white/20">
          {/* Botones de demo (solo en desarrollo) */}
          <div className="mb-6 p-4 bg-white/10 rounded-xl border border-white/20">
            <p className="text-white text-sm mb-3 text-center">🎭 Cuentas de demostración:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => demoLogin('admin')}
                className="text-xs bg-red-500/20 text-white px-3 py-2 rounded-lg hover:bg-red-500/30 transition-colors border border-red-400/30"
              >
                👑 Admin
              </button>
              <button
                onClick={() => demoLogin('vet')}
                className="text-xs bg-blue-500/20 text-white px-3 py-2 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-400/30"
              >
                👨‍⚕️ Veterinario
              </button>
              <button
                onClick={() => demoLogin('owner')}
                className="text-xs bg-green-500/20 text-white px-3 py-2 rounded-lg hover:bg-green-500/30 transition-colors border border-green-400/30"
              >
                👤 Propietario
              </button>
            </div>
          </div>

          {isLogin ? (
            /* FORMULARIO DE LOGIN MEJORADO */
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-sm font-medium text-white mb-2 flex items-center space-x-2">
                    <span>👤</span>
                    <span>Usuario</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={loginData.username}
                      onChange={handleLoginChange}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="Ingresa tu usuario"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-white mb-2 flex items-center space-x-2">
                    <span>🔒</span>
                    <span>Contraseña</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="Ingresa tu contraseña"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-white/80">
                  <input
                    type="checkbox"
                    className="rounded border-white/30 bg-white/10 text-blue-600 focus:ring-white/50"
                  />
                  <span>Recordarme</span>
                </label>
                <button
                  type="button"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <AnimatedButton
                type="submit"
                variant="ghost"
                size="lg"
                loading={loading}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <span>🔑</span>
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </AnimatedButton>
            </form>
          ) : (
            /* FORMULARIO DE REGISTRO MEJORADO */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    👤 Nombre
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    👤 Apellido
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  🏷️ Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  required
                  minLength="3"
                  maxLength="20"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Nombre de usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  📧 Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 backdrop-blur-sm"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  📱 Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={registerData.phone}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 backdrop-blur-sm"
                  placeholder="3001234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  👥 Rol
                </label>
                <select
                  name="role"
                  value={registerData.role}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="USER" className="text-gray-800">👤 Usuario</option>
                  <option value="PROPIETARIO" className="text-gray-800">🏠 Propietario</option>
                  <option value="VETERINARIO" className="text-gray-800">👨‍⚕️ Veterinario</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    🔒 Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                      minLength="6"
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 backdrop-blur-sm"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    🔒 Confirmar
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                    minLength="6"
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-white/80 text-sm">
                  <input
                    type="checkbox"
                    required
                    className="rounded border-white/30 bg-white/10 text-blue-600 focus:ring-white/50"
                  />
                  <span>Acepto los términos y condiciones</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {showPassword ? '🙈 Ocultar' : '👁️ Mostrar'}
                </button>
              </div>

              <AnimatedButton
                type="submit"
                variant="ghost"
                size="lg"
                loading={loading}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Crear Cuenta</span>
                  </>
                )}
              </AnimatedButton>
            </form>
          )}

          {/* Toggle entre login y registro */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-white/80 hover:text-white font-medium transition-colors group"
            >
              <span className="border-b border-white/30 group-hover:border-white/60 transition-colors">
                {isLogin 
                  ? '¿No tienes cuenta? Regístrate aquí' 
                  : '¿Ya tienes cuenta? Inicia sesión aquí'
                }
              </span>
            </button>
          </div>

          {/* Separador */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/30"></div>
            <span className="px-4 text-white/60 text-sm">o</span>
            <div className="flex-1 border-t border-white/30"></div>
          </div>

          {/* Botones de redes sociales */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center space-x-2 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/30"
            >
              <span>🔍</span>
              <span className="text-sm">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center space-x-2 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/30"
            >
              <span>📘</span>
              <span className="text-sm">Facebook</span>
            </button>
          </div>

          {/* Información adicional */}
          <div className="mt-6 text-center text-sm text-white/70">
            <p>🔒 Tus datos están seguros con nosotros</p>
            <p>🚀 Acceso instantáneo a todas las funciones</p>
          </div>
        </div>

        {/* Información del sistema */}
        <div className="text-center text-white/80 text-sm animate-fadeIn" style={{ animationDelay: '0.8s' }}>
          <p className="mb-2">Sistema de Gestión Veterinaria v2.0</p>
          <p className="flex items-center justify-center space-x-2">
            <span>Desarrollado con</span>
            <span className="text-red-400 animate-pulse">❤️</span>
            <span>para el cuidado de tus mascotas</span>
            <span className="animate-bounce">🐾</span>
          </p>
          
          {/* Características destacadas */}
          <div className="mt-4 grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl mb-1">🏥</div>
              <div className="text-xs">Gestión completa</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🔒</div>
              <div className="text-xs">100% Seguro</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-xs">Super rápido</div>
            </div>
          </div>
        </div>

        {/* Indicadores de estado */}
        <div className="fixed bottom-4 left-4 text-white/60 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Sistema online</span>
          </div>
        </div>

        <div className="fixed bottom-4 right-4 text-white/60 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Soporte 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;