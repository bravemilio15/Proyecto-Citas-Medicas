class Paciente {
  constructor({ id, nombre, cedula, telefono, email, historialMedico = [] }) {
    this.id = id;
    this.nombre = nombre;
    this.cedula = cedula;
    this.telefono = telefono;
    this.email = email;
    this.historialMedico = historialMedico;
  }
}

module.exports = Paciente; 