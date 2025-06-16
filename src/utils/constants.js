// Configuración de URLs de tus microservicios
export const API_BASE_URLS = {
  USUARIOS: 'http://localhost:8080/api',
  CITAS: 'http://localhost:8081',
  NOTIFICACIONES: 'http://localhost:8000',
  PAGOS: 'http://localhost:5000',
  TIENDA: 'http://localhost:8000/api/tienda'
};

// Estados de las citas
export const ESTADOS_CITA = {
  PROGRAMADA: 'PROGRAMADA',
  ATENDIDA: 'ATENDIDA',
  CANCELADA: 'CANCELADA',
  REPROGRAMADA: 'REPROGRAMADA',
  EN_CURSO: 'EN_CURSO'
};

// Rutas de navegación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  MASCOTAS: '/mascotas',
  CITAS: '/citas',
  AGENDA: '/agenda',
  TIENDA: '/tienda',
  HISTORIAS: '/historias'
};

// Configuración de la aplicación
export const APP_CONFIG = {
  APP_NAME: 'Veterinaria App',
  VERSION: '2.0',
  ITEMS_PER_PAGE: 10
};