import { citasAPI, usuariosAPI, handleAPIError } from './api';

// =====================================================
// 📅 SERVICIOS PARA CITAS
// =====================================================
export const citasService = {
  // Obtener todas las citas
  getAll: async () => {
    try {
      const response = await citasAPI.get('/agenda/cita/allCitas');
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Obtener cita por ID
  getById: async (id) => {
    try {
      const response = await citasAPI.get(`/agenda/cita/${id}`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Crear nueva cita
  create: async (citaData) => {
    try {
      const response = await citasAPI.post('/agenda/crear', citaData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Actualizar cita
  update: async (id, citaData) => {
    try {
      const response = await citasAPI.put(`/agenda/actualizar/${id}`, citaData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Cambiar estado de cita
  cambiarEstado: async (id, estado) => {
    try {
      const response = await citasAPI.put(`/agenda/estado/cita/${id}`, estado);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Obtener citas por estado
  getByEstado: async (estado) => {
    try {
      const response = await citasAPI.get(`/agenda/cita/estado/${estado}`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Obtener citas por fecha
  getByFecha: async (fecha) => {
    try {
      const response = await citasAPI.get(`/agenda/cita/fecha/${fecha}`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Obtener citas por veterinario
  getByVeterinario: async (veterinarioId) => {
    try {
      const response = await citasAPI.get(`/agenda/cita/veterinario/${veterinarioId}`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Obtener citas por paciente (mascota)
  getByPaciente: async (pacienteId) => {
    try {
      const response = await citasAPI.get(`/agenda/cita/paciente/${pacienteId}`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }
};

// =====================================================
// 🏥 SERVICIOS PARA SERVICIOS VETERINARIOS
// =====================================================
export const serviciosService = {
  // Obtener todos los servicios
  getAll: async () => {
    try {
      const response = await citasAPI.get('/servicios');
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Obtener servicio por ID
  getById: async (id) => {
    try {
      const response = await citasAPI.get(`/servicios/${id}`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Crear nuevo servicio
  create: async (servicioData) => {
    try {
      const response = await citasAPI.post('/servicios', servicioData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Actualizar servicio
  update: async (id, servicioData) => {
    try {
      const response = await citasAPI.put(`/servicios/actualizar/${id}`, servicioData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }
};

// =====================================================
// 📋 SERVICIOS PARA HISTORIAS CLÍNICAS
// =====================================================
export const historiasService = {
  // Obtener todas las historias
  getAll: async () => {
    try {
      const response = await citasAPI.get('/historiaClinica');
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Obtener historia por ID
  getById: async (id) => {
    try {
      const response = await citasAPI.get(`/historiaClinica/historia/${id}`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Obtener historia por paciente
  getByPaciente: async (idPaciente) => {
    try {
      const response = await citasAPI.get(`/historiaClinica/paciente/${idPaciente}`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Obtener historia por cita
  getByCita: async (idCita) => {
    try {
      const response = await citasAPI.get(`/historiaClinica/cita/${idCita}`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Crear nueva historia clínica
  create: async (historiaData) => {
    try {
      const response = await citasAPI.post('/historiaClinica/crear', historiaData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Actualizar historia clínica
  update: async (id, historiaData) => {
    try {
      const response = await citasAPI.put(`/historiaClinica/editar/${id}`, historiaData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }
};

// =====================================================
// 👥 SERVICIOS PARA USUARIOS (conecta con tu módulo de usuarios)
// =====================================================
export const usuariosService = {
  // Propietarios
  propietarios: {
    getAll: async () => {
      try {
        const response = await usuariosAPI.get('/usuarios');
        return response.data;
      } catch (error) {
        throw handleAPIError(error);
      }
    },

    getById: async (id) => {
      try {
        const response = await usuariosAPI.get(`/usuarios/${id}`);
        return response.data;
      } catch (error) {
        throw handleAPIError(error);
      }
    },

    create: async (propietarioData) => {
      try {
        const response = await usuariosAPI.post('/usuarios', propietarioData);
        return response.data;
      } catch (error) {
        throw handleAPIError(error);
      }
    }
  },

  // Mascotas
  mascotas: {
    getAll: async () => {
      try {
        const response = await usuariosAPI.get('/mascotas');
        return response.data;
      } catch (error) {
        throw handleAPIError(error);
      }
    },

    getByPropietario: async (propietarioId) => {
      try {
        const response = await usuariosAPI.get(`/mascotas/propietario/${propietarioId}`);
        return response.data;
      } catch (error) {
        throw handleAPIError(error);
      }
    },

    create: async (mascotaData) => {
      try {
        const response = await usuariosAPI.post('/mascotas', mascotaData);
        return response.data;
      } catch (error) {
        throw handleAPIError(error);
      }
    },

    getNombreById: async (id) => {
      try {
        const response = await usuariosAPI.get(`/mascotas/nombre/${id}`);
        return response.data;
      } catch (error) {
        throw handleAPIError(error);
      }
    }
  },

  // Veterinarios
  veterinarios: {
    getAll: async () => {
      try {
        const response = await usuariosAPI.get('/veterinarios');
        return response.data;
      } catch (error) {
        throw handleAPIError(error);
      }
    },

    getById: async (id) => {
      try {
        const response = await usuariosAPI.get(`/veterinarios/${id}`);
        return response.data;
      } catch (error) {
        throw handleAPIError(error);
      }
    },

    getNombreById: async (id) => {
      try {
        const response = await usuariosAPI.get(`/veterinarios/nombre/${id}`);
        return response.data;
      } catch (error) {
        throw handleAPIError(error);
      }
    }
  },

  // Disponibilidades
  disponibilidades: {
    verificar: async (veterinarioId, fecha, hora) => {
      try {
        const response = await usuariosAPI.get(
          `/disponibilidades/verificar/${veterinarioId}?fecha=${fecha}&hora=${hora}`
        );
        return response.data;
      } catch (error) {
        throw handleAPIError(error);
      }
    },

    getByVeterinario: async (veterinarioId) => {
      try {
        const response = await usuariosAPI.get(`/disponibilidades/veterinario/${veterinarioId}`);
        return response.data;
      } catch (error) {
        throw handleAPIError(error);
      }
    }
  }
};