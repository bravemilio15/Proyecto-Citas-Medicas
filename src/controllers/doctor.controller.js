const { DoctorService } = require('../services');

class DoctorController {
  constructor() {
    this.doctorService = new DoctorService();
  }

  /**
   * Crear un nuevo doctor
   */
  crearDoctor = async (req, res) => {
    try {
      const nuevoDoctor = this.doctorService.crearDoctor(req.body);
      res.status(201).json({
        success: true,
        data: nuevoDoctor,
        message: 'Doctor creado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Obtener un doctor por ID
   */
  obtenerDoctor = async (req, res) => {
    try {
      const { id } = req.params;
      const doctor = this.doctorService.obtenerDoctor(id);
      
      if (!doctor) {
        return res.status(404).json({
          success: false,
          error: 'Doctor no encontrado'
        });
      }

      res.json({
        success: true,
        data: doctor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Obtener todos los doctores con filtros opcionales
   */
  obtenerDoctores = async (req, res) => {
    try {
      const filtros = req.query;
      const doctores = this.doctorService.obtenerDoctores(filtros);
      
      res.json({
        success: true,
        data: doctores,
        count: doctores.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Actualizar un doctor
   */
  actualizarDoctor = async (req, res) => {
    try {
      const { id } = req.params;
      const doctorActualizado = this.doctorService.actualizarDoctor(id, req.body);
      
      res.json({
        success: true,
        data: doctorActualizado,
        message: 'Doctor actualizado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Eliminar un doctor
   */
  eliminarDoctor = async (req, res) => {
    try {
      const { id } = req.params;
      const doctorEliminado = this.doctorService.eliminarDoctor(id);
      
      res.json({
        success: true,
        data: doctorEliminado,
        message: 'Doctor eliminado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Agregar horario disponible para un doctor
   */
  agregarHorarioDisponible = async (req, res) => {
    try {
      const { doctorId } = req.params;
      const nuevoHorario = this.doctorService.agregarHorarioDisponible(doctorId, req.body);
      
      res.status(201).json({
        success: true,
        data: nuevoHorario,
        message: 'Horario agregado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Actualizar horario disponible de un doctor
   */
  actualizarHorarioDisponible = async (req, res) => {
    try {
      const { doctorId, horarioId } = req.params;
      const horarioActualizado = this.doctorService.actualizarHorarioDisponible(
        doctorId, 
        horarioId, 
        req.body
      );
      
      res.json({
        success: true,
        data: horarioActualizado,
        message: 'Horario actualizado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Eliminar horario disponible de un doctor
   */
  eliminarHorarioDisponible = async (req, res) => {
    try {
      const { doctorId, horarioId } = req.params;
      const horarioEliminado = this.doctorService.eliminarHorarioDisponible(doctorId, horarioId);
      
      res.json({
        success: true,
        data: horarioEliminado,
        message: 'Horario eliminado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Obtener disponibilidad de un doctor
   */
  obtenerDisponibilidad = async (req, res) => {
    try {
      const { doctorId, fecha } = req.params;
      const disponibilidad = this.doctorService.obtenerDisponibilidad(doctorId, fecha);
      
      res.json({
        success: true,
        data: disponibilidad
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Obtener horarios de un doctor
   */
  obtenerHorariosDoctor = async (req, res) => {
    try {
      const { doctorId } = req.params;
      const horarios = this.doctorService.obtenerHorariosDoctor(doctorId);
      
      res.json({
        success: true,
        data: horarios,
        count: horarios.length
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Obtener estadísticas de doctores
   */
  obtenerEstadisticas = async (req, res) => {
    try {
      const estadisticas = this.doctorService.obtenerEstadisticas();
      
      res.json({
        success: true,
        data: estadisticas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
}

module.exports = DoctorController; 