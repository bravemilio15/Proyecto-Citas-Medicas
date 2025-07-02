require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  timezone: process.env.TIMEZONE || 'America/Bogota',
  duracionCita: process.env.DURACION_CITA || 30, 
  horarioLaboral: {
    inicio: process.env.HORARIO_INICIO || '08:00',
    fin: process.env.HORARIO_FIN || '18:00'
  }
};

module.exports = config; 