import { usuariosAPI, handleAPIError } from './api';

// =====================================================
// 🔐 SERVICIOS DE AUTENTICACIÓN
// =====================================================

export const authService = {
  // Registrar nuevo usuario
  register: async (userData) => {
    try {
      const response = await usuariosAPI.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Iniciar sesión
  login: async (credentials) => {
    try {
      const response = await usuariosAPI.post('/auth/login', credentials);
      const { token, role, username, userId, email } = response.data;
      
      // Guardar datos en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', username);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', email);
      
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await usuariosAPI.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Validar token
  validateToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }

      const response = await usuariosAPI.get('/auth/validate', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Obtener token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Obtener rol del usuario
  getUserRole: () => {
    return localStorage.getItem('userRole');
  },

  // Obtener datos del usuario
  getUserData: () => {
    return {
      token: localStorage.getItem('token'),
      role: localStorage.getItem('userRole'),
      username: localStorage.getItem('username'),
      userId: localStorage.getItem('userId'),
      email: localStorage.getItem('userEmail')
    };
  },

  // Verificar si el usuario tiene un rol específico
  hasRole: (requiredRole) => {
    const userRole = localStorage.getItem('userRole');
    return userRole === requiredRole || userRole === 'ROLE_ADMIN';
  }
};

// =====================================================
// 🔐 INTERCEPTOR PARA AGREGAR TOKEN AUTOMÁTICAMENTE
// =====================================================

// Interceptor para agregar el token a todas las peticiones
usuariosAPI.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de autenticación
usuariosAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado o inválido
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);