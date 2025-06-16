import axios from 'axios';
import { API_BASE_URLS } from '../utils/constants';

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

// Interceptores para manejo de errores
const setupInterceptors = (apiInstance) => {
  // Interceptor de respuesta
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('Error en la API:', error);
      
      if (error.response) {
        // El servidor respondió con un código de error
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        // No se recibió respuesta
        console.error('No response received:', error.request);
      } else {
        // Error en la configuración de la petición
        console.error('Request setup error:', error.message);
      }
      
      return Promise.reject(error);
    }
  );
};

// Aplicar interceptores a todas las instancias
setupInterceptors(usuariosAPI);
setupInterceptors(citasAPI);
setupInterceptors(tiendaAPI);

// Función helper para manejar errores de forma consistente
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