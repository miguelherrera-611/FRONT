import axios from 'axios';

// Actualiza tus URLs existentes con las correctas según tu backend
export const API_BASE_URLS = {
  USUARIOS: 'http://localhost:8080/api',
  CITAS: 'http://localhost:8081',
  NOTIFICACIONES: 'http://localhost:8000',
  PAGOS: 'http://localhost:5000',
  TIENDA: 'http://localhost:5050/api/tienda'  // Puerto correcto según tu Django
};

// Configuración de Axios para usuarios
export const usuariosAPI = axios.create({
  baseURL: API_BASE_URLS.USUARIOS,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Configuración de Axios para citas
export const citasAPI = axios.create({
  baseURL: API_BASE_URLS.CITAS,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Configuración de Axios para tienda
export const tiendaAPI = axios.create({
  baseURL: API_BASE_URLS.TIENDA,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptores para manejo de errores (mantén tu código existente)
const setupInterceptors = (apiInstance) => {
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('Error en la API:', error);
      
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request setup error:', error.message);
      }
      
      return Promise.reject(error);
    }
  );
};

setupInterceptors(usuariosAPI);
setupInterceptors(citasAPI);
setupInterceptors(tiendaAPI);

// Función helper para manejar errores (mantén tu código existente)
export const handleAPIError = (error) => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'Error en el servidor',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    return {
      message: 'No se pudo conectar con el servidor',
      status: 0,
      data: null
    };
  } else {
    return {
      message: error.message || 'Error desconocido',
      status: -1,
      data: null
    };
  }
};

// Estados de citas según tu backend
export const ESTADOS_CITA = {
  PROGRAMADA: 'PROGRAMADA',
  ATENDIDA: 'ATENDIDA',
  CANCELADA: 'CANCELADA',
  REPROGRAMADA: 'REPROGRAMADA',
  EN_CURSO: 'EN_CURSO'
};