const { PacienteService } = require('../services');

class PacienteController {
  constructor() {
    this.pacienteService = new PacienteService();
  }

  /**
   * Crear un nuevo paciente
   */
  crearPaciente = async (req, res) => {
    try {
      const nuevoPaciente = this.pacienteService.crearPaciente(req.body);
      res.status(201).json({
        success: true,
        data: nuevoPaciente,
        message: 'Paciente creado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Obtener un paciente por ID
   */
  obtenerPaciente = async (req, res) => {
    try {
      const { id } = req.params;
      const paciente = this.pacienteService.obtenerPaciente(id);
      
      if (!paciente) {
        return res.status(404).json({
          success: false,
          error: 'Paciente no encontrado'
        });
      }

      res.json({
        success: true,
        data: paciente
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Obtener un paciente por cédula
   */
  obtenerPacientePorCedula = async (req, res) => {
    try {
      const { cedula } = req.params;
      const paciente = this.pacienteService.obtenerPacientePorCedula(cedula);
      
      if (!paciente) {
        return res.status(404).json({
          success: false,
          error: 'Paciente no encontrado'
        });
      }

      res.json({
        success: true,
        data: paciente
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Obtener todos los pacientes con filtros opcionales
   */
  obtenerPacientes = async (req, res) => {
    try {
      const filtros = req.query;
      const pacientes = this.pacienteService.obtenerPacientes(filtros);
      
      res.json({
        success: true,
        data: pacientes,
        count: pacientes.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Actualizar un paciente
   */
  actualizarPaciente = async (req, res) => {
    try {
      const { id } = req.params;
      const pacienteActualizado = this.pacienteService.actualizarPaciente(id, req.body);
      
      res.json({
        success: true,
        data: pacienteActualizado,
        message: 'Paciente actualizado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Eliminar un paciente
   */
  eliminarPaciente = async (req, res) => {
    try {
      const { id } = req.params;
      const pacienteEliminado = this.pacienteService.eliminarPaciente(id);
      
      res.json({
        success: true,
        data: pacienteEliminado,
        message: 'Paciente eliminado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Agregar registro al historial médico
   */
  agregarHistorialMedico = async (req, res) => {
    try {
      const { id } = req.params;
      const nuevoRegistro = this.pacienteService.agregarHistorialMedico(id, req.body);
      
      res.status(201).json({
        success: true,
        data: nuevoRegistro,
        message: 'Registro agregado al historial médico'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Obtener historial médico de un paciente
   */
  obtenerHistorialMedico = async (req, res) => {
    try {
      const { id } = req.params;
      const historial = this.pacienteService.obtenerHistorialMedico(id);
      
      res.json({
        success: true,
        data: historial,
        count: historial.length
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Obtener estadísticas de pacientes
   */
  obtenerEstadisticas = async (req, res) => {
    try {
      const estadisticas = this.pacienteService.obtenerEstadisticas();
      
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

module.exports = PacienteController; 