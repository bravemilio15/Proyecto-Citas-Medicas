const express = require('express');
const { DoctorController } = require('../controllers');

const router = express.Router();
const doctorController = new DoctorController();

// Rutas para doctores
router.post('/', doctorController.crearDoctor);
router.get('/', doctorController.obtenerDoctores);
router.get('/estadisticas', doctorController.obtenerEstadisticas);

// Rutas para horarios disponibles (deben ir antes que las rutas con parámetros)
router.post('/:doctorId/horarios', doctorController.agregarHorarioDisponible);
router.get('/:doctorId/horarios', doctorController.obtenerHorariosDoctor);
router.put('/:doctorId/horarios/:horarioId', doctorController.actualizarHorarioDisponible);
router.delete('/:doctorId/horarios/:horarioId', doctorController.eliminarHorarioDisponible);

// Rutas para disponibilidad
router.get('/:doctorId/disponibilidad/:fecha', doctorController.obtenerDisponibilidad);

router.get('/:id', doctorController.obtenerDoctor);
router.put('/:id', doctorController.actualizarDoctor);
router.delete('/:id', doctorController.eliminarDoctor);

module.exports = router; 