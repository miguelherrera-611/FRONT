import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { citasService, usuariosService } from '../../services/CitasService';
import { ESTADOS_CITA } from '../../services/api';

const AgendaView = () => {
  // Estados
  const [citas, setCitas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [vistaActual, setVistaActual] = useState('dia'); // 'dia' o 'semana'
  const [veterinarioFiltro, setVeterinarioFiltro] = useState('TODOS');

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  // Cargar citas cuando cambia la fecha
  useEffect(() => {
    if (fechaSeleccionada) {
      cargarCitasPorFecha();
    }
  }, [fechaSeleccionada]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [veterinariosData, mascotasData] = await Promise.all([
        usuariosService.veterinarios.getAll(),
        usuariosService.mascotas.getAll()
      ]);

      setVeterinarios(veterinariosData);
      setMascotas(mascotasData);
      
      if (fechaSeleccionada) {
        await cargarCitasPorFecha();
      }
    } catch (error) {
      toast.error('Error al cargar los datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarCitasPorFecha = async () => {
    try {
      const citasData = await citasService.getByFecha(fechaSeleccionada);
      setCitas(citasData);
    } catch (error) {
      toast.error('Error al cargar citas: ' + error.message);
    }
  };

  // Cambiar estado de cita
  const cambiarEstadoCita = async (idCita, nuevoEstado) => {
    try {
      await citasService.cambiarEstado(idCita, nuevoEstado);
      toast.success('Estado actualizado');
      cargarCitasPorFecha();
    } catch (error) {
      toast.error('Error al cambiar estado: ' + error.message);
    }
  };

  // Filtrar citas por veterinario
  const citasFiltradas = veterinarioFiltro === 'TODOS' 
    ? citas 
    : citas.filter(cita => cita.idVeterinario === veterinarioFiltro);

  // Agrupar citas por hora
  const citasPorHora = citasFiltradas.reduce((grupos, cita) => {
    const hora = cita.hora;
    if (!grupos[hora]) {
      grupos[hora] = [];
    }
    grupos[hora].push(cita);
    return grupos;
  }, {});

  // Generar horas del día (8:00 - 18:00)
  const horasDelDia = [];
  for (let i = 8; i <= 18; i++) {
    const hora = `${i.toString().padStart(2, '0')}:00`;
    horasDelDia.push(hora);
    if (i < 18) {
      const horaMedia = `${i.toString().padStart(2, '0')}:30`;
      horasDelDia.push(horaMedia);
    }
  }

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

  // Obtener color del estado
  const getColorEstado = (estado) => {
    const colores = {
      'PROGRAMADA': 'bg-blue-500 border-blue-600',
      'EN_CURSO': 'bg-yellow-500 border-yellow-600',
      'ATENDIDA': 'bg-green-500 border-green-600',
      'CANCELADA': 'bg-red-500 border-red-600',
      'REPROGRAMADA': 'bg-purple-500 border-purple-600'
    };
    return colores[estado] || 'bg-gray-500 border-gray-600';
  };

  // Navegar fecha
  const cambiarFecha = (dias) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaSeleccionada(nuevaFecha.toISOString().split('T')[0]);
  };

  // Formatear fecha para mostrar
  const formatearFecha = (fecha) => {
    const opciones = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  // Obtener estadísticas del día
  const estadisticasDia = {
    total: citasFiltradas.length,
    programadas: citasFiltradas.filter(c => c.estado === 'PROGRAMADA').length,
    enCurso: citasFiltradas.filter(c => c.estado === 'EN_CURSO').length,
    atendidas: citasFiltradas.filter(c => c.estado === 'ATENDIDA').length,
    canceladas: citasFiltradas.filter(c => c.estado === 'CANCELADA').length,
    urgencias: citasFiltradas.filter(c => c.esUrgencia).length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Cargando agenda...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🗓️ Agenda Diaria</h1>
          <p className="text-gray-600">Visualiza y gestiona las citas programadas</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFechaSeleccionada(new Date().toISOString().split('T')[0])}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            📅 Hoy
          </button>
          <button
            onClick={() => setVistaActual(vistaActual === 'dia' ? 'semana' : 'dia')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            📊 Vista {vistaActual === 'dia' ? 'Semanal' : 'Diaria'}
          </button>
        </div>
      </div>

      {/* Navegación de fecha y filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          {/* Navegación de fecha */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => cambiarFecha(-1)}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
              title="Día anterior"
            >
              ◀️
            </button>
            
            <div className="text-center">
              <input
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                className="text-lg font-semibold border border-gray-300 rounded-md px-3 py-2"
              />
              <p className="text-sm text-gray-600 mt-1">
                {formatearFecha(fechaSeleccionada)}
              </p>
            </div>
            
            <button
              onClick={() => cambiarFecha(1)}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
              title="Día siguiente"
            >
              ▶️
            </button>
          </div>

          {/* Filtro por veterinario */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Veterinario:</label>
            <select
              value={veterinarioFiltro}
              onChange={(e) => setVeterinarioFiltro(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="TODOS">Todos los veterinarios</option>
              {veterinarios.map(veterinario => (
                <option key={veterinario.id} value={veterinario.id}>
                  Dr. {veterinario.nombre} {veterinario.apellido}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas del día */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-gray-800">{estadisticasDia.total}</div>
          <div className="text-sm text-gray-600">Total Citas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{estadisticasDia.programadas}</div>
          <div className="text-sm text-gray-600">Programadas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-yellow-600">{estadisticasDia.enCurso}</div>
          <div className="text-sm text-gray-600">En Curso</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">{estadisticasDia.atendidas}</div>
          <div className="text-sm text-gray-600">Atendidas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-red-600">{estadisticasDia.canceladas}</div>
          <div className="text-sm text-gray-600">Canceladas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-orange-600">{estadisticasDia.urgencias}</div>
          <div className="text-sm text-gray-600">Urgencias</div>
        </div>
      </div>

      {/* Vista de agenda */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">
            Agenda del {formatearFecha(fechaSeleccionada)}
          </h3>
        </div>

        {/* Timeline de horas */}
        <div className="max-h-[600px] overflow-y-auto">
          {horasDelDia.map(hora => (
            <div key={hora} className="border-b border-gray-100">
              <div className="flex">
                {/* Columna de hora */}
                <div className="w-20 flex-shrink-0 p-4 bg-gray-50 border-r">
                  <div className="text-sm font-medium text-gray-700">{hora}</div>
                </div>

                {/* Columna de citas */}
                <div className="flex-1 p-4 min-h-[80px]">
                  {citasPorHora[hora] ? (
                    <div className="space-y-2">
                      {citasPorHora[hora].map(cita => (
                        <div
                          key={cita.idCita}
                          className={`p-3 rounded-lg border-l-4 text-white ${getColorEstado(cita.estado)} relative`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold text-sm">
                                {getNombreMascota(cita.idPaciente)}
                                {cita.esUrgencia && <span className="ml-2">⚠️ URGENTE</span>}
                              </div>
                              <div className="text-xs opacity-90">
                                {getNombreVeterinario(cita.idVeterinario)}
                              </div>
                              <div className="text-xs opacity-80 mt-1">
                                {cita.motivo && `${cita.motivo.substring(0, 50)}${cita.motivo.length > 50 ? '...' : ''}`}
                              </div>
                            </div>
                            
                            <div className="flex space-x-1 ml-2">
                              {cita.estado === 'PROGRAMADA' && (
                                <>
                                  <button
                                    onClick={() => cambiarEstadoCita(cita.idCita, 'EN_CURSO')}
                                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-xs"
                                    title="Iniciar consulta"
                                  >
                                    ▶️
                                  </button>
                                  <button
                                    onClick={() => cambiarEstadoCita(cita.idCita, 'CANCELADA')}
                                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-xs"
                                    title="Cancelar"
                                  >
                                    ❌
                                  </button>
                                </>
                              )}
                              
                              {cita.estado === 'EN_CURSO' && (
                                <button
                                  onClick={() => cambiarEstadoCita(cita.idCita, 'ATENDIDA')}
                                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-xs"
                                  title="Finalizar consulta"
                                >
                                  ✅
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm italic">
                      Sin citas programadas
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen de citas por veterinario */}
      {citasFiltradas.length > 0 && veterinarioFiltro === 'TODOS' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">📊 Resumen por Veterinario</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {veterinarios.map(veterinario => {
              const citasVeterinario = citasFiltradas.filter(c => c.idVeterinario === veterinario.id);
              if (citasVeterinario.length === 0) return null;

              return (
                <div key={veterinario.id} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Dr. {veterinario.nombre} {veterinario.apellido}
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">{citasVeterinario.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Programadas:</span>
                      <span className="text-blue-600">
                        {citasVeterinario.filter(c => c.estado === 'PROGRAMADA').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Atendidas:</span>
                      <span className="text-green-600">
                        {citasVeterinario.filter(c => c.estado === 'ATENDIDA').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Urgencias:</span>
                      <span className="text-orange-600">
                        {citasVeterinario.filter(c => c.esUrgencia).length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay citas */}
      {citasFiltradas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No hay citas programadas
          </h3>
          <p className="text-gray-500 mb-4">
            {veterinarioFiltro === 'TODOS' 
              ? `No hay citas para el ${formatearFecha(fechaSeleccionada)}`
              : `No hay citas para este veterinario el ${formatearFecha(fechaSeleccionada)}`
            }
          </p>
          <button
            onClick={() => window.location.href = '/citas'}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            ➕ Programar Nueva Cita
          </button>
        </div>
      )}
    </div>
  );
};

export default AgendaView;