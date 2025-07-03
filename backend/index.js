require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./src/config');
const { citaRoutes, doctorRoutes, pacienteRoutes } = require('./src/routes');

const app = express();
const PORT = config.port;

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para manejar preflight requests
app.options('*', cors());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API de Agendador de Citas Médicas',
    version: '1.0.0',
    status: 'Activo',
    endpoints: {
      citas: '/api/citas',
      doctores: '/api/doctores',
      pacientes: '/api/pacientes'
    }
  });
});

// Rutas de la API
app.use('/api/citas', citaRoutes);
app.use('/api/doctores', doctorRoutes);
app.use('/api/pacientes', pacienteRoutes);

// Middleware para manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Error interno del servidor'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Agendador de Citas Médicas - API v1.0.0`);
  console.log(`Entorno: ${config.nodeEnv}`);
  console.log(`Zona horaria: ${config.timezone}`);
}); 