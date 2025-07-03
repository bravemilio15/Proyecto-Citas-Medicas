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
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://[::1]:5173',
    'http://[::1]:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para manejar preflight requests
app.options('*', cors());

// Middleware adicional para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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