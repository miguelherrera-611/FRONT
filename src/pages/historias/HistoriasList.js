import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { historiasService, citasService, usuariosService } from '../../services/CitasService';

const HistoriasList = () => {
  // Estados
  const [historias, setHistorias] = useState([]);
  const [citas, setCitas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHistoria, setEditingHistoria] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroVeterinario, setFiltroVeterinario] = useState('TODOS');
  const [showDetalle, setShowDetalle] = useState(false);
  const [historiaDetalle, setHistoriaDetalle] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    idCita: '',
    idVeterinario: '',
    idPaciente: '',
    motivo: '',
    diagnostico: '',
    tratamiento: '',
    proceder: '',
    observaciones: ''
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [historiasData, citasData, veterinariosData, mascotasData] = await Promise.all([
        historiasService.getAll(),
        citasService.getAll(),
        usuariosService.veterinarios.getAll(),
        usuariosService.mascotas.getAll()
      ]);

      setHistorias(historiasData);
      setCitas(citasData);
      setVeterinarios(veterinariosData);
      setMascotas(mascotasData);
    } catch (error) {
      toast.error('Error al cargar los datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar historias
  const historiasFiltradas = historias.filter(historia => {
    const matchBusqueda = busqueda === '' || 
      getNombreMascota(historia.idPaciente).toLowerCase().includes(busqueda.toLowerCase()) ||
      getNombreVeterinario(historia.idVeterinario).toLowerCase().includes(busqueda.toLowerCase()) ||
      historia.diagnostico.toLowerCase().includes(busqueda.toLowerCase()) ||
      historia.motivo.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchVeterinario = filtroVeterinario === 'TODOS' || historia.idVeterinario === filtroVeterinario;
    
    return matchBusqueda && matchVeterinario;
  });

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si se selecciona una cita, autocompletar algunos campos
    if (name === 'idCita' && value) {
      const citaSeleccionada = citas.find(c => c.idCita.toString() === value);
      if (citaSeleccionada) {
        setFormData(prev => ({
          ...prev,
          idVeterinario: citaSeleccionada.idVeterinario,
          idPaciente: citaSeleccionada.idPaciente,
          motivo: citaSeleccionada.motivo || '',
          fecha: citaSeleccionada.fecha,
          hora: citaSeleccionada.hora
        }));
      }
    }
  };

  // Crear o actualizar historia clínica
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingHistoria) {
        await historiasService.update(editingHistoria.id, formData);
        toast.success('Historia clínica actualizada exitosamente');
      } else {
        await historiasService.create(formData);
        toast.success('Historia clínica creada exitosamente');
      }
      
      setShowForm(false);
      setEditingHistoria(null);
      limpiarFormulario();
      cargarDatos();
    } catch (error) {
      toast.error('Error al guardar la historia clínica: ' + error.message);
    }
  };

  // Editar historia
  const editarHistoria = (historia) => {
    setFormData({
      fecha: historia.fecha,
      hora: historia.hora,
      idCita: historia.idCita?.toString() || '',
      idVeterinario: historia.idVeterinario,
      idPaciente: historia.idPaciente,
      motivo: historia.motivo,
      diagnostico: historia.diagnostico,
      tratamiento: historia.tratamiento,
      proceder: historia.proceder,
      observaciones: historia.observaciones
    });
    setEditingHistoria(historia);
    setShowForm(true);
  };

  // Ver detalle de historia
  const verDetalle = (historia) => {
    setHistoriaDetalle(historia);
    setShowDetalle(true);
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      fecha: '',
      hora: '',
      idCita: '',
      idVeterinario: '',
      idPaciente: '',
      motivo: '',
      diagnostico: '',
      tratamiento: '',
      proceder: '',
      observaciones: ''
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

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  // Obtener citas atendidas (para el formulario)
  const citasAtendidas = citas.filter(cita => cita.estado === 'ATENDIDA');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Cargando historias clínicas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📋 Historias Clínicas</h1>
          <p className="text-gray-600">Gestiona las historias clínicas de todas las mascotas</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              limpiarFormulario();
              setEditingHistoria(null);
              setShowForm(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            ➕ Nueva Historia
          </button>
          <button
            onClick={() => window.print()}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            🖨️ Imprimir
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Buscar por mascota, veterinario, diagnóstico..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <select
              value={filtroVeterinario}
              onChange={(e) => setFiltroVeterinario(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="TODOS">Todos los veterinarios</option>
              {veterinarios.map(veterinario => (
                <option key={veterinario.id} value={veterinario.id}>
                  Dr. {veterinario.nombre} {veterinario.apellido}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-500">
              {historiasFiltradas.length} historias encontradas
            </span>
          </div>
        </div>
      </div>

      {/* Formulario de historia clínica */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingHistoria ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cita relacionada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cita Relacionada
              </label>
              <select
                name="idCita"
                value={formData.idCita}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Seleccionar cita (opcional)</option>
                {citasAtendidas.map(cita => (
                  <option key={cita.idCita} value={cita.idCita}>
                    {getNombreMascota(cita.idPaciente)} - {formatearFecha(cita.fecha)} - {cita.hora}
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

            {/* Motivo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de Consulta *
              </label>
              <textarea
                name="motivo"
                value={formData.motivo}
                onChange={handleInputChange}
                required
                rows="2"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Describe el motivo de la consulta..."
              />
            </div>

            {/* Diagnóstico */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnóstico *
              </label>
              <textarea
                name="diagnostico"
                value={formData.diagnostico}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Diagnóstico médico detallado..."
              />
            </div>

            {/* Tratamiento */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tratamiento *
              </label>
              <textarea
                name="tratamiento"
                value={formData.tratamiento}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Tratamiento prescrito, medicamentos, dosis..."
              />
            </div>

            {/* Proceder */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proceder *
              </label>
              <textarea
                name="proceder"
                value={formData.proceder}
                onChange={handleInputChange}
                required
                rows="2"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Próximos pasos, seguimiento, recomendaciones..."
              />
            </div>

            {/* Observaciones */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones Adicionales
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                rows="2"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Observaciones adicionales, notas especiales..."
              />
            </div>

            {/* Botones */}
            <div className="md:col-span-2 flex gap-2 pt-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                {editingHistoria ? 'Actualizar' : 'Crear'} Historia Clínica
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

      {/* Lista de historias clínicas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {historiasFiltradas.map((historia) => (
          <div key={historia.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            {/* Header de la historia */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {getNombreMascota(historia.idPaciente)}
                </h3>
                <p className="text-sm text-gray-600">
                  {getNombreVeterinario(historia.idVeterinario)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatearFecha(historia.fecha)} - {historia.hora}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => verDetalle(historia)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Ver detalle"
                >
                  👁️
                </button>
                <button
                  onClick={() => editarHistoria(historia)}
                  className="text-green-600 hover:text-green-800"
                  title="Editar"
                >
                  ✏️
                </button>
              </div>
            </div>

            {/* Contenido resumido */}
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Motivo:</span>
                <p className="text-sm text-gray-600 line-clamp-2">{historia.motivo}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Diagnóstico:</span>
                <p className="text-sm text-gray-600 line-clamp-2">{historia.diagnostico}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => verDetalle(historia)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Ver historia completa →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay historias */}
      {historiasFiltradas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {busqueda || filtroVeterinario !== 'TODOS' ? 'No se encontraron historias' : 'No hay historias clínicas'}
          </h3>
          <p className="text-gray-500">
            {busqueda || filtroVeterinario !== 'TODOS' 
              ? 'Intenta con otros criterios de búsqueda' 
              : 'Comienza creando la primera historia clínica'
            }
          </p>
        </div>
      )}

      {/* Modal de detalle */}
      {showDetalle && historiaDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header del modal */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold">Historia Clínica Completa</h3>
                <p className="text-gray-600">
                  {getNombreMascota(historiaDetalle.idPaciente)} - {formatearFecha(historiaDetalle.fecha)}
                </p>
              </div>
              <button
                onClick={() => setShowDetalle(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información general */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">🐾 Información del Paciente</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p><strong>Mascota:</strong> {getNombreMascota(historiaDetalle.idPaciente)}</p>
                      <p><strong>Veterinario:</strong> {getNombreVeterinario(historiaDetalle.idVeterinario)}</p>
                      <p><strong>Fecha:</strong> {formatearFecha(historiaDetalle.fecha)}</p>
                      <p><strong>Hora:</strong> {historiaDetalle.hora}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">🩺 Motivo de Consulta</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p>{historiaDetalle.motivo}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">📋 Diagnóstico</h4>
                    <div className="bg-blue-50 p-3 rounded-md">
                      <p>{historiaDetalle.diagnostico}</p>
                    </div>
                  </div>
                </div>

                {/* Tratamiento y seguimiento */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">💊 Tratamiento</h4>
                    <div className="bg-green-50 p-3 rounded-md">
                      <p>{historiaDetalle.tratamiento}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">📌 Proceder</h4>
                    <div className="bg-yellow-50 p-3 rounded-md">
                      <p>{historiaDetalle.proceder}</p>
                    </div>
                  </div>

                  {historiaDetalle.observaciones && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">📝 Observaciones</h4>
                      <div className="bg-purple-50 p-3 rounded-md">
                        <p>{historiaDetalle.observaciones}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="border-t p-6 flex justify-end space-x-4">
              <button
                onClick={() => editarHistoria(historiaDetalle)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                ✏️ Editar Historia
              </button>
              <button
                onClick={() => setShowDetalle(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoriasList;