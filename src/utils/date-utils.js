const moment = require('moment-timezone');
const config = require('../config');

class DateUtils {
  /**
   * Convierte una fecha y hora a UTC
   */
  static toUTC(fecha, hora, timezone = config.timezone) {
    const fechaHora = moment.tz(`${fecha} ${hora}`, timezone);
    return fechaHora.utc();
  }

  /**
   * Convierte UTC a zona horaria local
   */
  static fromUTC(utcDate, timezone = config.timezone) {
    return moment.utc(utcDate).tz(timezone);
  }

  /**
   * Obtiene el día de la semana (0=lunes, 6=domingo)
   */
  static getDiaSemana(fecha) {
    const momentDate = moment(fecha);
    return momentDate.day() === 0 ? 6 : momentDate.day() - 1;
  }

  /**
   * Valida si una hora está dentro del horario laboral
   */
  static estaEnHorarioLaboral(hora) {
    const horaMoment = moment(hora, 'HH:mm');
    const inicio = moment(config.horarioLaboral.inicio, 'HH:mm');
    const fin = moment(config.horarioLaboral.fin, 'HH:mm');
    
    return horaMoment.isBetween(inicio, fin, null, '[]');
  }

  /**
   * Genera slots de tiempo disponibles
   */
  static generarSlotsDisponibles(horaInicio, horaFin, duracion = config.duracionCita) {
    const slots = [];
    const inicio = moment(horaInicio, 'HH:mm');
    const fin = moment(horaFin, 'HH:mm');
    
    let slotActual = inicio.clone();
    
    while (slotActual.isBefore(fin)) {
      slots.push(slotActual.format('HH:mm'));
      slotActual.add(duracion, 'minutes');
    }
    
    return slots;
  }

  /**
   * Valida formato de fecha (YYYY-MM-DD)
   */
  static esFechaValida(fecha) {
    return moment(fecha, 'YYYY-MM-DD', true).isValid();
  }

  /**
   * Valida formato de hora (HH:mm)
   */
  static esHoraValida(hora) {
    return moment(hora, 'HH:mm', true).isValid();
  }

  /**
   * Obtiene la fecha actual en formato YYYY-MM-DD
   */
  static getFechaActual() {
    return moment().format('YYYY-MM-DD');
  }

  /**
   * Obtiene la hora actual en formato HH:mm
   */
  static getHoraActual() {
    return moment().format('HH:mm');
  }
}

module.exports = DateUtils; 