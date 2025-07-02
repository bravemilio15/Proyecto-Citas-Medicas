class HorarioDisponible {
  constructor({ doctorId, diaSemana, horaInicio, horaFin }) {
    this.doctorId = doctorId;
    this.diaSemana = diaSemana; // 0=lunes, ..., 6=domingo
    this.horaInicio = horaInicio; // 'HH:mm'
    this.horaFin = horaFin; // 'HH:mm'
  }
}

module.exports = HorarioDisponible; 