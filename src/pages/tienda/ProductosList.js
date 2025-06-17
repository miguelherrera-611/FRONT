import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { productosService, carritosService, carritoProductosService, carritoHelpers } from '../../services/TiendaService';

const ProductosList = () => {
  // Estados
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState(null);
  const [carritoProductos, setCarritoProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCarrito, setShowCarrito] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');

  // Estado del formulario de producto
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: ''
  });

  // Categorías disponibles
  const categorias = [
    'Alimento',
    'Juguetes',
    'Medicina',
    'Accesorios',
    'Higiene',
    'Cama y Descanso',
    'Transporte',
    'Entrenamiento'
  ];

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
    inicializarCarrito();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const productosData = await productosService.getAll();
      setProductos(productosData);
    } catch (error) {
      toast.error('Error al cargar productos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const inicializarCarrito = async () => {
    try {
      // Crear un nuevo carrito para la sesión
      const nuevoCarrito = await carritosService.create();
      setCarrito(nuevoCarrito);
    } catch (error) {
      console.error('Error al inicializar carrito:', error);
    }
  };

  const cargarCarritoProductos = async () => {
    if (!carrito) return;
    
    try {
      const carritoCompleto = await carritosService.getById(carrito.id);
      setCarritoProductos(carritoCompleto.productos || []);
    } catch (error) {
      toast.error('Error al cargar carrito: ' + error.message);
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const matchBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                         producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoriaFiltro === 'TODAS' || producto.categoria === categoriaFiltro;
    
    return matchBusqueda && matchCategoria;
  });

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Crear o actualizar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productoData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock)
      };

      if (editingProducto) {
        await productosService.update(editingProducto.id, productoData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await productosService.create(productoData);
        toast.success('Producto creado exitosamente');
      }
      
      setShowForm(false);
      setEditingProducto(null);
      limpiarFormulario();
      cargarDatos();
    } catch (error) {
      toast.error('Error al guardar producto: ' + error.message);
    }
  };

  // Editar producto
  const editarProducto = (producto) => {
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      categoria: producto.categoria
    });
    setEditingProducto(producto);
    setShowForm(true);
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await productosService.delete(id);
        toast.success('Producto eliminado exitosamente');
        cargarDatos();
      } catch (error) {
        toast.error('Error al eliminar producto: ' + error.message);
      }
    }
  };

  // Agregar al carrito
  const agregarAlCarrito = async (producto, cantidad = 1) => {
    if (!carrito) {
      toast.error('Error: No hay carrito disponible');
      return;
    }

    try {
      // Verificar stock
      if (producto.stock < cantidad) {
        toast.error('Stock insuficiente');
        return;
      }

      // Verificar si el producto ya está en el carrito
      const productoEnCarrito = carritoProductos.find(cp => cp.producto.id === producto.id);
      
      if (productoEnCarrito) {
        // Actualizar cantidad
        const nuevaCantidad = productoEnCarrito.cantidad + cantidad;
        if (nuevaCantidad > producto.stock) {
          toast.error('No hay suficiente stock disponible');
          return;
        }
        
        await carritoProductosService.update(productoEnCarrito.id, {
          ...productoEnCarrito,
          cantidad: nuevaCantidad
        });
      } else {
        // Agregar nuevo producto
        await carritoProductosService.create({
          carrito: carrito.id,
          producto: producto.id,
          cantidad: cantidad
        });
      }

      toast.success(`${producto.nombre} agregado al carrito`);
      cargarCarritoProductos();
    } catch (error) {
      toast.error('Error al agregar al carrito: ' + error.message);
    }
  };

  // Actualizar cantidad en carrito
  const actualizarCantidadCarrito = async (carritoProductoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(carritoProductoId);
      return;
    }

    try {
      const carritoProducto = carritoProductos.find(cp => cp.id === carritoProductoId);
      await carritoProductosService.update(carritoProductoId, {
        ...carritoProducto,
        cantidad: nuevaCantidad
      });
      cargarCarritoProductos();
    } catch (error) {
      toast.error('Error al actualizar cantidad: ' + error.message);
    }
  };

  // Eliminar del carrito
  const eliminarDelCarrito = async (carritoProductoId) => {
    try {
      await carritoProductosService.delete(carritoProductoId);
      toast.success('Producto eliminado del carrito');
      cargarCarritoProductos();
    } catch (error) {
      toast.error('Error al eliminar del carrito: ' + error.message);
    }
  };

  // Procesar pago
  const procesarPago = async () => {
    if (!carrito || carritoProductos.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    try {
      const response = await carritosService.generarPago(carrito.id);
      
      if (response.link_pago) {
        // Redirigir a Stripe
        window.open(response.link_pago, '_blank');
        toast.success('Redirigiendo al pago...');
      } else {
        toast.error('Error al generar link de pago');
      }
    } catch (error) {
      toast.error('Error al procesar pago: ' + error.message);
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoria: ''
    });
  };

  // Cargar carrito cuando se abre
  useEffect(() => {
    if (showCarrito && carrito) {
      cargarCarritoProductos();
    }
  }, [showCarrito, carrito]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🛒 Tienda Veterinaria</h1>
          <p className="text-gray-600">Productos y servicios para mascotas</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              limpiarFormulario();
              setEditingProducto(null);
              setShowForm(true);
            }}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            ➕ Nuevo Producto
          </button>
          <button
            onClick={() => setShowCarrito(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors relative"
          >
            🛍️ Ver Carrito
            {carritoProductos.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center">
                {carritoHelpers.contarItems({ productos: carritoProductos })}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="TODAS">Todas las categorías</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-500">
              {productosFiltrados.length} productos encontrados
            </span>
          </div>
        </div>
      </div>

      {/* Formulario de producto */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Nombre del producto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio *
              </label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Cantidad disponible"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Descripción del producto..."
              />
            </div>

            <div className="md:col-span-2 flex gap-2 pt-4">
              <button
                type="submit"
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
              >
                {editingProducto ? 'Actualizar' : 'Crear'} Producto
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            {/* Header del producto */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{producto.nombre}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {producto.categoria}
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => editarProducto(producto)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => eliminarProducto(producto.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Descripción */}
            {producto.descripcion && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {producto.descripcion}
              </p>
            )}

            {/* Precio y stock */}
            <div className="mb-4">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {carritoHelpers.formatearPrecio(producto.precio)}
              </div>
              <div className="text-sm text-gray-500">
                Stock: {producto.stock} unidades
              </div>
            </div>

            {/* Botón agregar al carrito */}
            <button
              onClick={() => agregarAlCarrito(producto)}
              disabled={producto.stock === 0}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                producto.stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {producto.stock === 0 ? 'Sin Stock' : '🛒 Agregar al Carrito'}
            </button>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay productos */}
      {productosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏪</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {busqueda || categoriaFiltro !== 'TODAS' ? 'No se encontraron productos' : 'No hay productos en la tienda'}
          </h3>
          <p className="text-gray-500">
            {busqueda || categoriaFiltro !== 'TODAS' 
              ? 'Intenta con otros criterios de búsqueda' 
              : 'Comienza agregando productos a la tienda'
            }
          </p>
        </div>
      )}

      {/* Modal del carrito */}
      {showCarrito && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header del carrito */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">🛍️ Carrito de Compras</h3>
              <button
                onClick={() => setShowCarrito(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Contenido del carrito */}
            <div className="p-6 overflow-y-auto max-h-96">
              {carritoProductos.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🛒</div>
                  <p className="text-gray-500">Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {carritoProductos.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.producto.nombre}</h4>
                        <p className="text-sm text-gray-500">{item.producto.categoria}</p>
                        <p className="text-green-600 font-medium">
                          {carritoHelpers.formatearPrecio(item.producto.precio)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => actualizarCantidadCarrito(item.id, item.cantidad - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.cantidad}</span>
                        <button
                          onClick={() => actualizarCantidadCarrito(item.id, item.cantidad + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">
                          {carritoHelpers.formatearPrecio(item.producto.precio * item.cantidad)}
                        </p>
                        <button
                          onClick={() => eliminarDelCarrito(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer del carrito */}
            {carritoProductos.length > 0 && (
              <div className="border-t p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {carritoHelpers.formatearPrecio(carritoHelpers.calcularTotal({ productos: carritoProductos }))}
                  </span>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowCarrito(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                  >
                    Seguir Comprando
                  </button>
                  <button
                    onClick={procesarPago}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    💳 Proceder al Pago
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductosList;