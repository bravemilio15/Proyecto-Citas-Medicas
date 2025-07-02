const { db } = require('../../firebase/firebase');
const { Paciente } = require('../models');
const { ValidationUtils } = require('../utils');

class PacienteService {
  constructor() {
    this.collection = db.collection('pacientes');
  }

  async getNextId() {
    const snapshot = await this.collection.get();
    if (snapshot.empty) return 1;
    const ids = snapshot.docs.map(doc => parseInt(doc.data().id, 10)).filter(Number.isInteger);
    if (ids.length === 0) return 1;
    const maxId = Math.max(...ids);
    return maxId + 1;
  }

  async crearPaciente(datosPaciente) {
    if (!this.validarDatosPaciente(datosPaciente)) {
      throw new Error('Datos de paciente inválidos');
    }
    const cedulaSnap = await this.collection.where('cedula', '==', datosPaciente.cedula).get();
    if (!cedulaSnap.empty) throw new Error('Ya existe un paciente con esa cédula');
    const emailSnap = await this.collection.where('email', '==', datosPaciente.email).get();
    if (!emailSnap.empty) throw new Error('Ya existe un paciente con ese email');
    const id = await this.getNextId();
    const idSnap = await this.collection.where('id', '==', id.toString()).get();
    if (!idSnap.empty) throw new Error('ID de paciente duplicado, intenta de nuevo');
    const nuevoPaciente = new Paciente({
      id: id.toString(),
      ...datosPaciente
    });
    await this.collection.doc(nuevoPaciente.id).set({ ...nuevoPaciente });
    return nuevoPaciente;
  }

  async obtenerPaciente(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return doc.data();
  }

  async obtenerPacientePorCedula(cedula) {
    const snap = await this.collection.where('cedula', '==', cedula).get();
    if (snap.empty) return null;
    return snap.docs[0].data();
  }

  async obtenerPacientePorEmail(email) {
    const snap = await this.collection.where('email', '==', email).get();
    if (snap.empty) return null;
    return snap.docs[0].data();
  }

  async obtenerPacientes(filtros = {}) {
    let query = this.collection;
    if (filtros.nombre) {
      query = query.where('nombre', '>=', filtros.nombre).where('nombre', '<=', filtros.nombre + '\uf8ff');
    }
    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data());
  }

  async actualizarPaciente(id, datosActualizados) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('Paciente no encontrado');
    const datosCompletos = { ...doc.data(), ...datosActualizados };
    if (!this.validarDatosPaciente(datosCompletos)) {
      throw new Error('Datos de paciente inválidos');
    }
    if (datosActualizados.cedula) {
      const cedulaSnap = await this.collection.where('cedula', '==', datosActualizados.cedula).get();
      if (!cedulaSnap.empty && cedulaSnap.docs[0].id !== id) throw new Error('Ya existe un paciente con esa cédula');
    }
    if (datosActualizados.email) {
      const emailSnap = await this.collection.where('email', '==', datosActualizados.email).get();
      if (!emailSnap.empty && emailSnap.docs[0].id !== id) throw new Error('Ya existe un paciente con ese email');
    }
    await docRef.update(datosActualizados);
    return (await docRef.get()).data();
  }

  async eliminarPaciente(id) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('Paciente no encontrado');
    await docRef.delete();
    return doc.data();
  }

  async agregarHistorialMedico(id, registro) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('Paciente no encontrado');
    const paciente = doc.data();
    const nuevoRegistro = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      ...registro
    };
    const historialMedico = paciente.historialMedico || [];
    historialMedico.push(nuevoRegistro);
    await docRef.update({ historialMedico });
    return nuevoRegistro;
  }

  async obtenerHistorialMedico(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) throw new Error('Paciente no encontrado');
    return doc.data().historialMedico || [];
  }

  validarDatosPaciente(datosPaciente) {
    const { nombre, cedula, telefono, email } = datosPaciente;
    if (!nombre || nombre.trim().length < 2) return false;
    if (!ValidationUtils.esCedulaValida(cedula)) return false;
    if (!ValidationUtils.esTelefonoValido(telefono)) return false;
    if (!ValidationUtils.esEmailValido(email)) return false;
    return true;
  }

  async obtenerEstadisticas() {
    const snapshot = await this.collection.get();
    const pacientes = snapshot.docs.map(doc => doc.data());
    const total = pacientes.length;
    const conHistorial = pacientes.filter(p => (p.historialMedico || []).length > 0).length;
    return {
      total,
      conHistorial,
      sinHistorial: total - conHistorial
    };
  }
}

module.exports = PacienteService; 