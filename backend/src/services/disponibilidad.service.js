const { db } = require('../../firebase/firebase');
const { DateUtils } = require('../utils');
const config = require('../config');

class DisponibilidadService {
  constructor() {
    this.doctoresCollection = db.collection('doctores');
    this.citasCollection = db.collection('citas');
  }

  async obtenerDisponibilidad(doctorId, fecha) {
    const diaSemana = DateUtils.getDiaSemana(fecha);
    const docSnap = await this.doctoresCollection.doc(doctorId).get();
    if (!docSnap.exists) {
      return { disponible: false, slots: [] };
    }
    const doctor = docSnap.data();
    const horarioDoctor = (doctor.horarioDisponible || []).find(h => h.diaSemana === diaSemana);
    if (!horarioDoctor) {
      return { disponible: false, slots: [] };
    }
    const slotsDisponibles = DateUtils.generarSlotsDisponibles(
      horarioDoctor.horaInicio,
      horarioDoctor.horaFin,
      config.duracionCita
    );
    const slotsOcupados = await this.obtenerSlotsOcupados(doctorId, fecha);
    const slotsLibres = slotsDisponibles.filter(slot => !slotsOcupados.includes(slot));
    return {
      disponible: slotsLibres.length > 0,
      slots: slotsLibres,
      horario: {
        inicio: horarioDoctor.horaInicio,
        fin: horarioDoctor.horaFin
      }
    };
  }

  async obtenerSlotsOcupados(doctorId, fecha) {
    const snapshot = await this.citasCollection
      .where('doctorId', '==', doctorId)
      .where('fecha', '==', fecha)
      .where('estado', '!=', 'cancelada')
      .get();
    return snapshot.docs.map(doc => doc.data().hora);
  }

  async esSlotDisponible(doctorId, fecha, hora) {
    const disponibilidad = await this.obtenerDisponibilidad(doctorId, fecha);
    return disponibilidad.slots.includes(hora);
  }

  async agregarHorarioDisponible(doctorId, horarioData) {
    const docRef = this.doctoresCollection.doc(doctorId);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('Doctor no encontrado');
    const doctor = doc.data();
    const horarioDisponible = doctor.horarioDisponible || [];
    const nuevoHorario = {
      id: Date.now().toString(),
      ...horarioData
    };
    horarioDisponible.push(nuevoHorario);
    await docRef.update({ horarioDisponible });
    return nuevoHorario;
  }

  async actualizarHorarioDisponible(doctorId, horarioId, datosActualizados) {
    const docRef = this.doctoresCollection.doc(doctorId);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('Doctor no encontrado');
    const doctor = doc.data();
    const horarios = doctor.horarioDisponible || [];
    const index = horarios.findIndex(h => h.id === horarioId);
    if (index === -1) throw new Error('Horario no encontrado');
    Object.assign(horarios[index], datosActualizados);
    await docRef.update({ horarioDisponible: horarios });
    return horarios[index];
  }

  async eliminarHorarioDisponible(doctorId, horarioId) {
    const docRef = this.doctoresCollection.doc(doctorId);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('Doctor no encontrado');
    const doctor = doc.data();
    const horarios = doctor.horarioDisponible || [];
    const index = horarios.findIndex(h => h.id === horarioId);
    if (index === -1) throw new Error('Horario no encontrado');
    horarios.splice(index, 1);
    await docRef.update({ horarioDisponible: horarios });
    return true;
  }

  async obtenerHorariosDoctor(doctorId) {
    const doc = await this.doctoresCollection.doc(doctorId).get();
    if (!doc.exists) throw new Error('Doctor no encontrado');
    return doc.data().horarioDisponible || [];
  }
}

module.exports = DisponibilidadService; 