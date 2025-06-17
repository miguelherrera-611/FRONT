import { tiendaAPI, handleAPIError } from './api';

// =====================================================
// 🛒 SERVICIOS PARA TIENDA
// =====================================================

// Productos
export const productosService = {
  // Obtener todos los productos
  getAll: async () => {
    try {
      const response = await tiendaAPI.get('/productos/');
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Obtener producto por ID
  getById: async (id) => {
    try {
      const response = await tiendaAPI.get(`/productos/${id}/`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Crear nuevo producto
  create: async (productoData) => {
    try {
      const response = await tiendaAPI.post('/productos/', productoData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Actualizar producto
  update: async (id, productoData) => {
    try {
      const response = await tiendaAPI.put(`/productos/${id}/`, productoData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Eliminar producto
  delete: async (id) => {
    try {
      const response = await tiendaAPI.delete(`/productos/${id}/`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }
};

// Carritos
export const carritosService = {
  // Obtener todos los carritos
  getAll: async () => {
    try {
      const response = await tiendaAPI.get('/carritos/');
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Obtener carrito por ID
  getById: async (id) => {
    try {
      const response = await tiendaAPI.get(`/carritos/${id}/`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Crear nuevo carrito
  create: async (carritoData = {}) => {
    try {
      const response = await tiendaAPI.post('/carritos/', carritoData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Generar link de pago para un carrito
  generarPago: async (carritoId) => {
    try {
      const response = await tiendaAPI.post(`/carritos/${carritoId}/generar-pago/`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }
};

// Productos del carrito
export const carritoProductosService = {
  // Obtener todos los productos de carrito
  getAll: async () => {
    try {
      const response = await tiendaAPI.get('/carrito-productos/');
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Agregar producto al carrito
  create: async (carritoProductoData) => {
    try {
      const response = await tiendaAPI.post('/carrito-productos/', carritoProductoData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Actualizar cantidad de producto en carrito
  update: async (id, carritoProductoData) => {
    try {
      const response = await tiendaAPI.put(`/carrito-productos/${id}/`, carritoProductoData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Eliminar producto del carrito
  delete: async (id) => {
    try {
      const response = await tiendaAPI.delete(`/carrito-productos/${id}/`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }
};

// Helper para trabajar con el carrito completo
export const carritoHelpers = {
  // Calcular total del carrito
  calcularTotal: (carrito) => {
    if (!carrito?.productos) return 0;
    
    return carrito.productos.reduce((total, item) => {
      return total + (item.producto.precio * item.cantidad);
    }, 0);
  },

  // Contar items en el carrito
  contarItems: (carrito) => {
    if (!carrito?.productos) return 0;
    
    return carrito.productos.reduce((total, item) => {
      return total + item.cantidad;
    }, 0);
  },

  // Formatear precio para mostrar
  formatearPrecio: (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  },

  // Preparar datos para el pago
  prepararDatosPago: (carrito) => {
    if (!carrito?.productos) return [];
    
    return carrito.productos.map(item => ({
      nombre: item.producto.nombre,
      precio: item.producto.precio,
      cantidad: item.cantidad
    }));
  }
};