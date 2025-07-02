const Joi = require('joi');
const moment = require('moment-timezone');
const DateUtils = require('./date-utils');

class ValidationUtils {
  /**
   * Valida formato de email
   */
  static esEmailValido(email) {
    const schema = Joi.string().email().required();
    const { error } = schema.validate(email);
    return !error;
  }

  /**
   * Valida formato de teléfono (básico)
   */
  static esTelefonoValido(telefono) {
    const schema = Joi.string().pattern(/^[\d\s\-\+\(\)]+$/).min(7).max(15).required();
    const { error } = schema.validate(telefono);
    return !error;
  }

  /**
   * Valida formato de cédula (básico)
   */
  static esCedulaValida(cedula) {
    const schema = Joi.string().pattern(/^\d{8,12}$/).required();
    const { error } = schema.validate(cedula);
    return !error;
  }

  /**
   * Valida que una fecha no sea en el pasado
   */
  static esFechaFutura(fecha) {
    const fechaActual = DateUtils.getFechaActual();
    return fecha >= fechaActual;
  }

  /**
   * Valida que una cita no esté en el pasado
   */
  static esCitaFutura(fecha, hora) {
    const ahora = moment();
    const fechaCita = moment(`${fecha} ${hora}`, 'YYYY-MM-DD HH:mm');
    return fechaCita.isAfter(ahora);
  }

  /**
   * Valida estado de cita
   */
  static esEstadoValido(estado) {
    const estadosValidos = ['pendiente', 'completada', 'cancelada'];
    return estadosValidos.includes(estado);
  }

  /**
   * Valida día de la semana (0-6)
   */
  static esDiaSemanaValido(dia) {
    return dia >= 0 && dia <= 6;
  }

  /**
   * Valida formato de hora (HH:mm)
   */
  static esHoraValida(hora) {
    return DateUtils.esHoraValida(hora);
  }
}

module.exports = ValidationUtils; 