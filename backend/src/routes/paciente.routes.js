const express = require('express');
const { PacienteController } = require('../controllers');

const router = express.Router();
const pacienteController = new PacienteController();

// Rutas para pacientes
router.post('/', pacienteController.crearPaciente);
router.get('/', pacienteController.obtenerPacientes);
router.get('/estadisticas', pacienteController.obtenerEstadisticas);
router.get('/cedula/:cedula', pacienteController.obtenerPacientePorCedula);

// Rutas para historial médico (deben ir antes que las rutas con parámetros)
router.post('/:id/historial', pacienteController.agregarHistorialMedico);
router.get('/:id/historial', pacienteController.obtenerHistorialMedico);

router.get('/:id', pacienteController.obtenerPaciente);
router.put('/:id', pacienteController.actualizarPaciente);
router.delete('/:id', pacienteController.eliminarPaciente);

module.exports = router; 