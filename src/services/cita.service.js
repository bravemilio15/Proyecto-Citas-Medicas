const { db } = require('../../firebase/firebase');
const { Cita } = require('../models');
const { DateUtils, ValidationUtils } = require('../utils');
const DisponibilidadService = require('./disponibilidad.service');

class CitaService {
  constructor() {
    this.collection = db.collection('citas');
    this.disponibilidadService = new DisponibilidadService();
  }

  async getNextId() {
    const snapshot = await this.collection.get();
    if (snapshot.empty) return 1;
    const ids = snapshot.docs.map(doc => parseInt(doc.data().id, 10)).filter(Number.isInteger);
    if (ids.length === 0) return 1;
    const maxId = Math.max(...ids);
    return maxId + 1;
  }

  async crearCita(datosCita) {
    if (!this.validarDatosCita(datosCita)) {
      throw new Error('Datos de cita inválidos');
    }
    if (!await this.validarDisponibilidad(datosCita)) {
      throw new Error('Horario no disponible');
    }
    const id = await this.getNextId();
    const idSnap = await this.collection.where('id', '==', id.toString()).get();
    if (!idSnap.empty) throw new Error('ID de cita duplicado, intenta de nuevo');
    const nuevaCita = new Cita({
      id: id.toString(),
      ...datosCita,
      estado: 'pendiente'
    });
    await this.collection.doc(nuevaCita.id).set({ ...nuevaCita });
    return nuevaCita;
  }

  async obtenerCita(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return doc.data();
  }

  async obtenerCitas(filtros = {}) {
    let query = this.collection;
    if (filtros.doctorId) query = query.where('doctorId', '==', filtros.doctorId);
    if (filtros.pacienteId) query = query.where('pacienteId', '==', filtros.pacienteId);
    if (filtros.estado) query = query.where('estado', '==', filtros.estado);
    if (filtros.fecha) query = query.where('fecha', '==', filtros.fecha);
    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data());
  }

  async actualizarCita(id, datosActualizados) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('Cita no encontrada');
    if (datosActualizados.fecha || datosActualizados.hora) {
      const citaActual = doc.data();
      const nuevaFecha = datosActualizados.fecha || citaActual.fecha;
      const nuevaHora = datosActualizados.hora || citaActual.hora;
      if (!await this.validarDisponibilidad({
        doctorId: citaActual.doctorId,
        fecha: nuevaFecha,
        hora: nuevaHora
      }, id)) {
        throw new Error('Nuevo horario no disponible');
      }
    }
    await docRef.update(datosActualizados);
    return (await docRef.get()).data();
  }

  async cancelarCita(id) {
    const cita = await this.obtenerCita(id);
    if (!cita) throw new Error('Cita no encontrada');
    if (cita.estado === 'cancelada') throw new Error('La cita ya está cancelada');
    return this.actualizarCita(id, { estado: 'cancelada' });
  }

  async completarCita(id) {
    const cita = await this.obtenerCita(id);
    if (!cita) throw new Error('Cita no encontrada');
    if (cita.estado === 'completada') throw new Error('La cita ya está completada');
    return this.actualizarCita(id, { estado: 'completada' });
  }

  async obtenerDisponibilidad(doctorId, fecha) {
    return this.disponibilidadService.obtenerDisponibilidad(doctorId, fecha);
  }

  validarDatosCita(datosCita) {
    const { pacienteId, doctorId, fecha, hora } = datosCita;
    if (!pacienteId || !doctorId || !fecha || !hora) return false;
    if (!DateUtils.esFechaValida(fecha)) return false;
    if (!DateUtils.esHoraValida(hora)) return false;
    if (!DateUtils.estaEnHorarioLaboral(hora)) return false;
    if (!ValidationUtils.esFechaFutura(fecha)) return false;
    return true;
  }

  async validarDisponibilidad(datosCita, citaIdExcluir = null) {
    const { doctorId, fecha, hora } = datosCita;
    if (!await this.disponibilidadService.esSlotDisponible(doctorId, fecha, hora)) return false;
    const snapshot = await this.collection.where('doctorId', '==', doctorId).where('fecha', '==', fecha).where('hora', '==', hora).get();
    const citaExistente = snapshot.docs.find(doc => doc.data().estado !== 'cancelada' && doc.id !== citaIdExcluir);
    return !citaExistente;
  }

  async obtenerEstadisticas() {
    const snapshot = await this.collection.get();
    const citas = snapshot.docs.map(doc => doc.data());
    const total = citas.length;
    const pendientes = citas.filter(cita => cita.estado === 'pendiente').length;
    const completadas = citas.filter(cita => cita.estado === 'completada').length;
    const canceladas = citas.filter(cita => cita.estado === 'cancelada').length;
    return { total, pendientes, completadas, canceladas };
  }
}

module.exports = CitaService; 