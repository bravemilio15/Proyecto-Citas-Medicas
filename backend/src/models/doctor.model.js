class Doctor {
  constructor({ id, nombre, especialidad, horarioDisponible = [] }) {
    this.id = id;
    this.nombre = nombre;
    this.especialidad = especialidad;
    this.horarioDisponible = horarioDisponible; // Array de objetos HorarioDisponible
  }
}

module.exports = Doctor; 