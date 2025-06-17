import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { citasService, serviciosService, usuariosService } from '../../services/CitasService';
import { ESTADOS_CITA } from '../../services/api';

const CitasList = () => {
  // Estados
  const [citas, setCitas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCita, setEditingCita] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('TODAS');

  // Estado del formulario
  const [formData, setFormData] = useState({
    idPaciente: '',
    idVeterinario: '',
    fecha: '',
    hora: '',
    esUrgencia: false,
    motivo: '',
    estado: 'PROGRAMADA',
    servicio: { id: '' }
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [citasData, serviciosData, veterinariosData, mascotasData] = await Promise.all([
        citasService.getAll(),
        serviciosService.getAll(),
        usuariosService.veterinarios.getAll(),
        usuariosService.mascotas.getAll()
      ]);

      setCitas(citasData);
      setServicios(serviciosData);
      setVeterinarios(veterinariosData);
      setMascotas(mascotasData);
    } catch (error) {
      toast.error('Error al cargar los datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar citas por estado
  const citasFiltradas = filtroEstado === 'TODAS' 
    ? citas 
    : citas.filter(cita => cita.estado === filtroEstado);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'servicioId') {
      setFormData(prev => ({
        ...prev,
        servicio: { id: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Crear o actualizar cita
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCita) {
        await citasService.update(editingCita.idCita, formData);
        toast.success('Cita actualizada exitosamente');
      } else {
        await citasService.create(formData);
        toast.success('Cita creada exitosamente');
      }
      
      setShowForm(false);
      setEditingCita(null);
      limpiarFormulario();
      cargarDatos();
    } catch (error) {
      toast.error('Error al guardar la cita: ' + error.message);
    }
  };

  // Cambiar estado de cita
  const cambiarEstadoCita = async (idCita, nuevoEstado) => {
    try {
      await citasService.cambiarEstado(idCita, nuevoEstado);
      toast.success('Estado de cita actualizado');
      cargarDatos();
    } catch (error) {
      toast.error('Error al cambiar estado: ' + error.message);
    }
  };

  // Editar cita
  const editarCita = (cita) => {
    setFormData({
      idPaciente: cita.idPaciente,
      idVeterinario: cita.idVeterinario,
      fecha: cita.fecha,
      hora: cita.hora,
      esUrgencia: cita.esUrgencia,
      motivo: cita.motivo,
      estado: cita.estado,
      servicio: { id: cita.servicio?.id || '' }
    });
    setEditingCita(cita);
    setShowForm(true);
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      idPaciente: '',
      idVeterinario: '',
      fecha: '',
      hora: '',
      esUrgencia: false,
      motivo: '',
      estado: 'PROGRAMADA',
      servicio: { id: '' }
    });
  };

  // Obtener nombre de mascota
  const getNombreMascota = (idPaciente) => {
    const mascota = mascotas.find(m => m.id === idPaciente);
    return mascota ? mascota.nombre : 'Mascota no encontrada';
  };

  // Obtener nombre de veterinario
  const getNombreVeterinario = (idVeterinario) => {
    const veterinario = veterinarios.find(v => v.id === idVeterinario);
    return veterinario ? `Dr. ${veterinario.nombre} ${veterinario.apellido}` : 'Veterinario no encontrado';
  };

  // Obtener nombre de servicio
  const getNombreServicio = (servicioId) => {
    const servicio = servicios.find(s => s.id === servicioId);
    return servicio ? servicio.tipo : 'Servicio no encontrado';
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  // Obtener color del estado
  const getColorEstado = (estado) => {
    const colores = {
      'PROGRAMADA': 'bg-blue-100 text-blue-800',
      'EN_CURSO': 'bg-yellow-100 text-yellow-800',
      'ATENDIDA': 'bg-green-100 text-green-800',
      'CANCELADA': 'bg-red-100 text-red-800',
      'REPROGRAMADA': 'bg-purple-100 text-purple-800'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-800">📅 Gestión de Citas</h1>
          <p className="text-gray-600">Gestiona las citas de la clínica veterinaria</p>
        </div>
        <button
          onClick={() => {
            limpiarFormulario();
            setEditingCita(null);
            setShowForm(true);
          }}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          ➕ Nueva Cita
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="TODAS">Todas las citas</option>
            {Object.values(ESTADOS_CITA).map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            Total: {citasFiltradas.length} citas
          </span>
        </div>
      </div>

      {/* Formulario de cita */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingCita ? 'Editar Cita' : 'Nueva Cita'}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mascota */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mascota *
              </label>
              <select
                name="idPaciente"
                value={formData.idPaciente}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Seleccionar mascota</option>
                {mascotas.map(mascota => (
                  <option key={mascota.id} value={mascota.id}>
                    {mascota.nombre} - {mascota.especie}
                  </option>
                ))}
              </select>
            </div>

            {/* Veterinario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Veterinario *
              </label>
              <select
                name="idVeterinario"
                value={formData.idVeterinario}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Seleccionar veterinario</option>
                {veterinarios.map(veterinario => (
                  <option key={veterinario.id} value={veterinario.id}>
                    Dr. {veterinario.nombre} {veterinario.apellido} - {veterinario.especialidad}
                  </option>
                ))}
              </select>
            </div>

            {/* Servicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Servicio *
              </label>
              <select
                name="servicioId"
                value={formData.servicio.id}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Seleccionar servicio</option>
                {servicios.map(servicio => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.tipo} - {servicio.duracion} min
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha *
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora *
              </label>
              <input
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {Object.values(ESTADOS_CITA).map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            {/* Motivo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de la cita
              </label>
              <textarea
                name="motivo"
                value={formData.motivo}
                onChange={handleInputChange}
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Describe el motivo de la consulta..."
              />
            </div>

            {/* Es urgencia */}
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="esUrgencia"
                  checked={formData.esUrgencia}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Marcar como urgencia
                </span>
              </label>
            </div>

            {/* Botones */}
            <div className="md:col-span-2 flex gap-2 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {editingCita ? 'Actualizar' : 'Crear'} Cita
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

      {/* Lista de citas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mascota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Veterinario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {citasFiltradas.map((cita) => (
                <tr key={cita.idCita} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getNombreMascota(cita.idPaciente)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getNombreVeterinario(cita.idVeterinario)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatearFecha(cita.fecha)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {cita.hora}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getNombreServicio(cita.servicio?.id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getColorEstado(cita.estado)}`}>
                      {cita.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {cita.esUrgencia && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        ⚠️ URGENTE
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editarCita(cita)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      
                      {cita.estado === 'PROGRAMADA' && (
                        <>
                          <button
                            onClick={() => cambiarEstadoCita(cita.idCita, 'EN_CURSO')}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Iniciar consulta"
                          >
                            ▶️
                          </button>
                          <button
                            onClick={() => cambiarEstadoCita(cita.idCita, 'CANCELADA')}
                            className="text-red-600 hover:text-red-900"
                            title="Cancelar"
                          >
                            ❌
                          </button>
                        </>
                      )}
                      
                      {cita.estado === 'EN_CURSO' && (
                        <button
                          onClick={() => cambiarEstadoCita(cita.idCita, 'ATENDIDA')}
                          className="text-green-600 hover:text-green-900"
                          title="Finalizar consulta"
                        >
                          ✅
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {citasFiltradas.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">
              {filtroEstado === 'TODAS' 
                ? 'No hay citas registradas' 
                : `No hay citas con estado ${filtroEstado}`
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitasList;