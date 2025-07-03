const { CitaService } = require('../services');
const DateUtils = require('../utils/date-utils');

class CitaController {
  constructor() {
    this.citaService = new CitaService();
  }

  /**
   * Crear una nueva cita
   */
  crearCita = async (req, res) => {
    try {
      const nuevaCita = this.citaService.crearCita(req.body);
      res.status(201).json({
        success: true,
        data: nuevaCita,
        message: 'Cita creada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Obtener una cita por ID
   */
  obtenerCita = async (req, res) => {
    try {
      const { id } = req.params;
      const cita = this.citaService.obtenerCita(id);
      
      if (!cita) {
        return res.status(404).json({
          success: false,
          error: 'Cita no encontrada'
        });
      }

      res.json({
        success: true,
        data: cita
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Obtener todas las citas con filtros opcionales
   */
  obtenerCitas = async (req, res) => {
    try {
      const filtros = req.query;
      const citas = await this.citaService.obtenerCitas(filtros);
      console.log('Citas encontradas (backend):', citas);
      res.json({
        success: true,
        data: citas,
        count: citas.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Actualizar una cita
   */
  actualizarCita = async (req, res) => {
    try {
      const { id } = req.params;
      const citaActualizada = this.citaService.actualizarCita(id, req.body);
      
      res.json({
        success: true,
        data: citaActualizada,
        message: 'Cita actualizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Cancelar una cita
   */
  cancelarCita = async (req, res) => {
    try {
      const { id } = req.params;
      const citaCancelada = this.citaService.cancelarCita(id);
      
      res.json({
        success: true,
        data: citaCancelada,
        message: 'Cita cancelada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Marcar una cita como completada
   */
  completarCita = async (req, res) => {
    try {
      const { id } = req.params;
      const citaCompletada = this.citaService.completarCita(id);
      
      res.json({
        success: true,
        data: citaCompletada,
        message: 'Cita marcada como completada'
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
      const disponibilidad = this.citaService.obtenerDisponibilidad(doctorId, fecha);
      
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
   * Obtener estadísticas de citas
   */
  obtenerEstadisticas = async (req, res) => {
    try {
      const estadisticas = this.citaService.obtenerEstadisticas();
      
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

  /**
   * Obtener todos los slots disponibles para un doctor en los próximos 30 días
   */
  obtenerSlotsDisponibles = async (req, res) => {
    try {
      const { doctorId } = req.params;
      const dias = 30;
      const slots = await this.citaService.obtenerSlotsDisponibles(doctorId, dias);
      res.json({ success: true, data: slots });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}

module.exports = CitaController; 