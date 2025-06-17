import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { usuariosService } from '../../services/CitasService';

const MascotasList = () => {
  // Estados
  const [mascotas, setMascotas] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMascota, setEditingMascota] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    peso: '',
    observaciones: '',
    propietarioId: ''
  });

  // Estados para el formulario de propietario
  const [showPropietarioForm, setShowPropietarioForm] = useState(false);
  const [propietarioData, setPropietarioData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [mascotasData, propietariosData] = await Promise.all([
        usuariosService.mascotas.getAll(),
        usuariosService.propietarios.getAll()
      ]);

      setMascotas(mascotasData);
      setPropietarios(propietariosData);
    } catch (error) {
      toast.error('Error al cargar los datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar mascotas por búsqueda
  const mascotasFiltradas = mascotas.filter(mascota =>
    mascota.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    mascota.especie.toLowerCase().includes(busqueda.toLowerCase()) ||
    (mascota.raza && mascota.raza.toLowerCase().includes(busqueda.toLowerCase()))
  );

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en el formulario de propietario
  const handlePropietarioChange = (e) => {
    const { name, value } = e.target;
    setPropietarioData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Crear nuevo propietario
  const crearPropietario = async (e) => {
    e.preventDefault();
    try {
      const nuevoPropietario = await usuariosService.propietarios.create(propietarioData);
      toast.success('Propietario creado exitosamente');
      
      // Actualizar lista de propietarios
      setPropietarios(prev => [...prev, nuevoPropietario]);
      
      // Seleccionar automáticamente el nuevo propietario
      setFormData(prev => ({
        ...prev,
        propietarioId: nuevoPropietario.id
      }));
      
      // Limpiar y cerrar formulario de propietario
      setPropietarioData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: ''
      });
      setShowPropietarioForm(false);
    } catch (error) {
      toast.error('Error al crear propietario: ' + error.message);
    }
  };

  // Crear o actualizar mascota
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convertir edad y peso a números
      const mascotaData = {
        ...formData,
        edad: parseInt(formData.edad),
        peso: parseFloat(formData.peso)
      };

      if (editingMascota) {
        await usuariosService.mascotas.update(editingMascota.id, mascotaData);
        toast.success('Mascota actualizada exitosamente');
      } else {
        await usuariosService.mascotas.create(mascotaData);
        toast.success('Mascota registrada exitosamente');
      }
      
      setShowForm(false);
      setEditingMascota(null);
      limpiarFormulario();
      cargarDatos();
    } catch (error) {
      toast.error('Error al guardar la mascota: ' + error.message);
    }
  };

  // Editar mascota
  const editarMascota = (mascota) => {
    setFormData({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza || '',
      edad: mascota.edad.toString(),
      peso: mascota.peso.toString(),
      observaciones: mascota.observaciones || '',
      propietarioId: mascota.propietarioId
    });
    setEditingMascota(mascota);
    setShowForm(true);
  };

  // Eliminar mascota
  const eliminarMascota = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
      try {
        await usuariosService.mascotas.delete(id);
        toast.success('Mascota eliminada exitosamente');
        cargarDatos();
      } catch (error) {
        toast.error('Error al eliminar la mascota: ' + error.message);
      }
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      especie: '',
      raza: '',
      edad: '',
      peso: '',
      observaciones: '',
      propietarioId: ''
    });
  };

  // Obtener nombre de propietario
  const getNombrePropietario = (propietarioId) => {
    const propietario = propietarios.find(p => p.id === propietarioId);
    return propietario ? `${propietario.nombre} ${propietario.apellido}` : 'Propietario no encontrado';
  };

  // Calcular edad en años/meses
  const formatearEdad = (meses) => {
    if (meses < 12) {
      return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    } else {
      const años = Math.floor(meses / 12);
      const mesesRestantes = meses % 12;
      if (mesesRestantes === 0) {
        return `${años} ${años === 1 ? 'año' : 'años'}`;
      } else {
        return `${años} ${años === 1 ? 'año' : 'años'} y ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}`;
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🐕 Registro de Mascotas</h1>
          <p className="text-gray-600">Gestiona el registro completo de todas las mascotas</p>
        </div>
        <button
          onClick={() => {
            limpiarFormulario();
            setEditingMascota(null);
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          ➕ Nueva Mascota
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre, especie o raza..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <span className="text-sm text-gray-500">
            {mascotasFiltradas.length} mascota{mascotasFiltradas.length !== 1 ? 's' : ''} encontrada{mascotasFiltradas.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Formulario de mascota */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingMascota ? 'Editar Mascota' : 'Nueva Mascota'}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
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
                placeholder="Nombre de la mascota"
              />
            </div>

            {/* Especie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especie *
              </label>
              <select
                name="especie"
                value={formData.especie}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Seleccionar especie</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Conejo">Conejo</option>
                <option value="Hamster">Hamster</option>
                <option value="Pez">Pez</option>
                <option value="Reptil">Reptil</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* Raza */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raza
              </label>
              <input
                type="text"
                name="raza"
                value={formData.raza}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Raza de la mascota"
              />
            </div>

            {/* Edad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Edad (en meses) *
              </label>
              <input
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Edad en meses"
              />
            </div>

            {/* Peso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg) *
              </label>
              <input
                type="number"
                name="peso"
                value={formData.peso}
                onChange={handleInputChange}
                required
                min="0.1"
                step="0.1"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Peso en kilogramos"
              />
            </div>

            {/* Propietario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Propietario *
              </label>
              <div className="flex space-x-2">
                <select
                  name="propietarioId"
                  value={formData.propietarioId}
                  onChange={handleInputChange}
                  required
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Seleccionar propietario</option>
                  {propietarios.map(propietario => (
                    <option key={propietario.id} value={propietario.id}>
                      {propietario.nombre} {propietario.apellido} - {propietario.email}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowPropietarioForm(true)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                  title="Crear nuevo propietario"
                >
                  ➕
                </button>
              </div>
            </div>

            {/* Observaciones */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Observaciones adicionales sobre la mascota..."
              />
            </div>

            {/* Botones */}
            <div className="md:col-span-2 flex gap-2 pt-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {editingMascota ? 'Actualizar' : 'Registrar'} Mascota
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

      {/* Formulario de propietario */}
      {showPropietarioForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nuevo Propietario</h3>
              <button
                onClick={() => setShowPropietarioForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={crearPropietario} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={propietarioData.nombre}
                  onChange={handlePropietarioChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={propietarioData.apellido}
                  onChange={handlePropietarioChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={propietarioData.email}
                  onChange={handlePropietarioChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={propietarioData.telefono}
                  onChange={handlePropietarioChange}
                  required
                  pattern="[0-9]{10}"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="10 dígitos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={propietarioData.direccion}
                  onChange={handlePropietarioChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Crear Propietario
                </button>
                <button
                  type="button"
                  onClick={() => setShowPropietarioForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de mascotas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mascotasFiltradas.map((mascota) => (
          <div key={mascota.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            {/* Header de la tarjeta */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{mascota.nombre}</h3>
                <p className="text-gray-600">{mascota.especie} {mascota.raza && `- ${mascota.raza}`}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => editarMascota(mascota)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => eliminarMascota(mascota.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Información de la mascota */}
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-16">📅 Edad:</span>
                <span className="text-gray-800">{formatearEdad(mascota.edad)}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-16">⚖️ Peso:</span>
                <span className="text-gray-800">{mascota.peso} kg</span>
              </div>
              
              <div className="flex items-start text-sm">
                <span className="text-gray-500 w-16">👤 Dueño:</span>
                <span className="text-gray-800 flex-1">{getNombrePropietario(mascota.propietarioId)}</span>
              </div>

              {mascota.observaciones && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Observaciones:</strong> {mascota.observaciones}
                  </p>
                </div>
              )}
            </div>

            {/* Footer de la tarjeta */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">ID: {mascota.id}</span>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    mascota.especie === 'Perro' ? 'bg-blue-100 text-blue-800' :
                    mascota.especie === 'Gato' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {mascota.especie}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay mascotas */}
      {mascotasFiltradas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {busqueda ? 'No se encontraron mascotas' : 'No hay mascotas registradas'}
          </h3>
          <p className="text-gray-500 mb-4">
            {busqueda 
              ? `No hay mascotas que coincidan con "${busqueda}"` 
              : 'Comienza registrando la primera mascota'
            }
          </p>
          {!busqueda && (
            <button
              onClick={() => {
                limpiarFormulario();
                setEditingMascota(null);
                setShowForm(true);
              }}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              ➕ Registrar Primera Mascota
            </button>
          )}
        </div>
      )}

      {/* Estadísticas rápidas */}
      {mascotas.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">📊 Estadísticas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{mascotas.length}</div>
              <div className="text-sm text-gray-600">Total Mascotas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mascotas.filter(m => m.especie === 'Perro').length}
              </div>
              <div className="text-sm text-gray-600">Perros</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {mascotas.filter(m => m.especie === 'Gato').length}
              </div>
              <div className="text-sm text-gray-600">Gatos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {mascotas.filter(m => !['Perro', 'Gato'].includes(m.especie)).length}
              </div>
              <div className="text-sm text-gray-600">Otros</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MascotasList;