class Cita {
  constructor({ id, pacienteId, doctorId, fecha, hora, estado = 'pendiente', notas = '' }) {
    this.id = id;
    this.pacienteId = pacienteId;
    this.doctorId = doctorId;
    this.fecha = fecha; // 'YYYY-MM-DD'
    this.hora = hora; // 'HH:mm'
    this.estado = estado; // pendiente, completada, cancelada
    this.notas = notas;
  }
}

module.exports = Cita; 