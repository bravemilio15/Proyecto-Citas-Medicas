const { db } = require('../../firebase/firebase');
const { Doctor, HorarioDisponible } = require('../models');
const { ValidationUtils } = require('../utils');
const DisponibilidadService = require('./disponibilidad.service');

class DoctorService {
  constructor() {
    this.collection = db.collection('doctores');
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

  async crearDoctor(datosDoctor) {
    if (!this.validarDatosDoctor(datosDoctor)) {
      throw new Error('Datos de doctor inválidos');
    }
    const nombreSnap = await this.collection.where('nombre', '==', datosDoctor.nombre).get();
    if (!nombreSnap.empty) throw new Error('Ya existe un doctor con ese nombre');
    const id = await this.getNextId();
    const idSnap = await this.collection.where('id', '==', id.toString()).get();
    if (!idSnap.empty) throw new Error('ID de doctor duplicado, intenta de nuevo');
    const nuevoDoctor = new Doctor({
      id: id.toString(),
      ...datosDoctor
    });
    await this.collection.doc(nuevoDoctor.id).set({ ...nuevoDoctor });
    return nuevoDoctor;
  }

  async obtenerDoctor(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return doc.data();
  }

  async obtenerDoctorPorNombre(nombre) {
    const snap = await this.collection.where('nombre', '==', nombre).get();
    if (snap.empty) return null;
    return snap.docs[0].data();
  }

  async obtenerDoctores(filtros = {}) {
    let query = this.collection;
    if (filtros.especialidad) {
      query = query.where('especialidad', '>=', filtros.especialidad).where('especialidad', '<=', filtros.especialidad + '\uf8ff');
    }
    if (filtros.nombre) {
      query = query.where('nombre', '>=', filtros.nombre).where('nombre', '<=', filtros.nombre + '\uf8ff');
    }
    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data());
  }

  async actualizarDoctor(id, datosActualizados) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('Doctor no encontrado');
    const datosCompletos = { ...doc.data(), ...datosActualizados };
    if (!this.validarDatosDoctor(datosCompletos)) {
      throw new Error('Datos de doctor inválidos');
    }
    if (datosActualizados.nombre) {
      const nombreSnap = await this.collection.where('nombre', '==', datosActualizados.nombre).get();
      if (!nombreSnap.empty && nombreSnap.docs[0].id !== id) throw new Error('Ya existe un doctor con ese nombre');
    }
    await docRef.update(datosActualizados);
    return (await docRef.get()).data();
  }

  async eliminarDoctor(id) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('Doctor no encontrado');
    await docRef.delete();
    return doc.data();
  }

  async agregarHorarioDisponible(doctorId, datosHorario) {
    const docRef = this.collection.doc(doctorId);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('Doctor no encontrado');
    if (!this.validarHorarioDisponible(datosHorario)) {
      throw new Error('Datos de horario inválidos');
    }
    const doctor = doc.data();
    const horarioDisponible = doctor.horarioDisponible || [];
    // IDs secuenciales
    let nextId = 1;
    if (horarioDisponible.length > 0) {
      const ids = horarioDisponible.map(h => parseInt(h.id, 10)).filter(Number.isInteger);
      if (ids.length > 0) nextId = Math.max(...ids) + 1;
    }
    const horario = {
      id: nextId.toString(),
      doctorId,
      ...datosHorario
    };
    horarioDisponible.push(horario);
    await docRef.update({ horarioDisponible });
    this.disponibilidadService.agregarHorarioDisponible(doctorId, horario);
    return horario;
  }

  async actualizarHorarioDisponible(doctorId, horarioId, datosActualizados) {
    const docRef = this.collection.doc(doctorId);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('Doctor no encontrado');
    const doctor = doc.data();
    const horarios = doctor.horarioDisponible || [];
    const index = horarios.findIndex(h => h.id === horarioId);
    if (index === -1) throw new Error('Horario no encontrado');
    if (!this.validarHorarioDisponible({ ...horarios[index], ...datosActualizados })) {
      throw new Error('Datos de horario inválidos');
    }
    Object.assign(horarios[index], datosActualizados);
    await docRef.update({ horarioDisponible: horarios });
    this.disponibilidadService.actualizarHorarioDisponible(doctorId, horarioId, datosActualizados);
    return horarios[index];
  }

  async eliminarHorarioDisponible(doctorId, horarioId) {
    const docRef = this.collection.doc(doctorId);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('Doctor no encontrado');
    const doctor = doc.data();
    const horarios = doctor.horarioDisponible || [];
    const index = horarios.findIndex(h => h.id === horarioId);
    if (index === -1) throw new Error('Horario no encontrado');
    horarios.splice(index, 1);
    await docRef.update({ horarioDisponible: horarios });
    this.disponibilidadService.eliminarHorarioDisponible(doctorId, horarioId);
    return true;
  }

  async obtenerDisponibilidad(doctorId, fecha) {
    return this.disponibilidadService.obtenerDisponibilidad(doctorId, fecha);
  }

  async obtenerHorariosDoctor(doctorId) {
    const doc = await this.collection.doc(doctorId).get();
    if (!doc.exists) throw new Error('Doctor no encontrado');
    return doc.data().horarioDisponible || [];
  }

  validarDatosDoctor(datosDoctor) {
    const { nombre, especialidad } = datosDoctor;
    if (!nombre || nombre.trim().length < 2) return false;
    if (!especialidad || especialidad.trim().length < 2) return false;
    return true;
  }

  validarHorarioDisponible(datosHorario) {
    const { diaSemana, horaInicio, horaFin } = datosHorario;
    if (typeof diaSemana !== 'number' || diaSemana < 0 || diaSemana > 6) return false;
    if (!horaInicio || !horaFin) return false;
    return true;
  }

  async obtenerEstadisticas() {
    const snapshot = await this.collection.get();
    const doctores = snapshot.docs.map(doc => doc.data());
    const total = doctores.length;
    return { total };
  }
}

module.exports = DoctorService; 