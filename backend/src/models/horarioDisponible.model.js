class HorarioDisponible {
  constructor({ id, doctorId, fecha, horaInicio, horaFin }) {
    this.id = id; // único por horario
    this.doctorId = doctorId;
    this.fecha = fecha; // 'YYYY-MM-DD' (fecha exacta)
    this.horaInicio = horaInicio; // 'HH:mm'
    this.horaFin = horaFin; // 'HH:mm'
  }
}

module.exports = HorarioDisponible; 