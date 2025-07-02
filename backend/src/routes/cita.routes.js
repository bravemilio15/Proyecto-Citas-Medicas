const express = require('express');
const { CitaController } = require('../controllers');

const router = express.Router();
const citaController = new CitaController();

// Rutas para disponibilidad (deben ir antes que las rutas con parámetros)
router.get('/disponibilidad/:doctorId/:fecha', citaController.obtenerDisponibilidad);

// Rutas para citas
router.post('/', citaController.crearCita);
router.get('/', citaController.obtenerCitas);
router.get('/estadisticas', citaController.obtenerEstadisticas);
router.get('/:id', citaController.obtenerCita);
router.put('/:id', citaController.actualizarCita);
router.patch('/:id/cancelar', citaController.cancelarCita);
router.patch('/:id/completar', citaController.completarCita);

module.exports = router; 