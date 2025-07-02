Agendador de Citas Médicas - Backend

API REST para gestionar citas médicas con un sistema de agendamiento inteligente.

Estructura del Proyecto

```
src/
├── config/          # Configuración centralizada
├── controllers/     # Controladores (MVC)
├── models/          # Modelos de datos
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
├── utils/           # Utilidades y helpers
├── middlewares/     # Middlewares personalizados
└── validators/      # Validaciones
```

Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env

4. **Crear la carpeta de Firebase y colocar el archivo de credenciales**
```bash
mkdir firebase
# Copia tu serviceAccountKey.json a backend/firebase/
```

5. **Ejecutar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `TIMEZONE` | Zona horaria | `America/Bogota` |
| `DURACION_CITA` | Duración de citas (minutos) | `30` |
| `HORARIO_INICIO` | Hora de inicio laboral | `08:00` |
| `HORARIO_FIN` | Hora de fin laboral | `18:00` |

Endpoints de la API

Citas (`/api/citas`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/` | Crear nueva cita |
| `GET` | `/` | Obtener todas las citas |
| `GET` | `/estadisticas` | Obtener estadísticas |
| `GET` | `/:id` | Obtener cita por ID |
| `PUT` | `/:id` | Actualizar cita |
| `PATCH` | `/:id/cancelar` | Cancelar cita |
| `PATCH` | `/:id/completar` | Completar cita |
| `GET` | `/disponibilidad/:doctorId/:fecha` | Obtener disponibilidad |

Doctores (`/api/doctores`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/` | Crear nuevo doctor |
| `GET` | `/` | Obtener todos los doctores |
| `GET` | `/estadisticas` | Obtener estadísticas |
| `GET` | `/:id` | Obtener doctor por ID |
| `PUT` | `/:id` | Actualizar doctor |
| `DELETE` | `/:id` | Eliminar doctor |
| `POST` | `/:doctorId/horarios` | Agregar horario |
| `GET` | `/:doctorId/horarios` | Obtener horarios |
| `PUT` | `/:doctorId/horarios/:horarioId` | Actualizar horario |
| `DELETE` | `/:doctorId/horarios/:horarioId` | Eliminar horario |
| `GET` | `/:doctorId/disponibilidad/:fecha` | Obtener disponibilidad |

Pacientes (`/api/pacientes`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/` | Crear nuevo paciente |
| `GET` | `/` | Obtener todos los pacientes |
| `GET` | `/estadisticas` | Obtener estadísticas |
| `GET` | `/cedula/:cedula` | Obtener por cédula |
| `GET` | `/:id` | Obtener paciente por ID |
| `PUT` | `/:id` | Actualizar paciente |
| `DELETE` | `/:id` | Eliminar paciente |
| `POST` | `/:id/historial` | Agregar historial médico |
| `GET` | `/:id/historial` | Obtener historial médico |

Modelos de Datos

Paciente
```javascript
{
  id: String,
  nombre: String,
  cedula: String,
  telefono: String,
  email: String,
  historialMedico: Array
}
```

Doctor
```javascript
{
  id: String,
  nombre: String,
  especialidad: String,
  horarioDisponible: Array
}
```

Cita
```javascript
{
  id: String,
  pacienteId: String,
  doctorId: String,
  fecha: String, // YYYY-MM-DD
  hora: String,  // HH:mm
  estado: String, // pendiente, completada, cancelada
  notas: String
}
```

HorarioDisponible
```javascript
{
  doctorId: String,
  diaSemana: Number, // 0=lunes, 6=domingo
  horaInicio: String, // HH:mm
  horaFin: String     // HH:mm
}
```

# Backend - Citas Médicas

## Instalación y configuración

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea la carpeta de Firebase y coloca tu archivo de credenciales:
   ```bash
   mkdir firebase
   # Copia tu serviceAccountKey.json a backend/firebase/
   ```
3. Ejecuta el backend:
   ```bash
   npm run dev
   ```

---

## Pruebas con Postman/cURL

### 1. Crear un paciente
```bash
curl -X POST http://localhost:3000/api/pacientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Perez",
    "cedula": "1234567890",
    "telefono": "3001234567",
    "email": "juan.perez@example.com"
  }'
```

### 2. Crear un doctor
```bash
curl -X POST http://localhost:3000/api/doctores \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Dra. Ana Torres",
    "especialidad": "Cardiología"
  }'
```

### 3. Agregar horario disponible a un doctor
```bash
curl -X POST http://localhost:3000/api/doctores/1/horarios \
  -H "Content-Type: application/json" \
  -d '{
    "diaSemana": 1,           // 0=lunes, ..., 6=domingo
    "horaInicio": "08:00",
    "horaFin": "12:00"
  }'
```

### 4. Consultar horarios disponibles de un doctor
```bash
curl http://localhost:3000/api/doctores/1/horarios
```

### 5. Consultar disponibilidad de un doctor para una fecha
```bash
curl http://localhost:3000/api/doctores/1/disponibilidad/2025-07-10
```

### 6. Agendar una cita en un slot disponible
```bash
curl -X POST http://localhost:3000/api/citas \
  -H "Content-Type: application/json" \
  -d '{
    "pacienteId": "1",
    "doctorId": "1",
    "fecha": "2025-07-10",
    "hora": "09:00"
  }'
```

### 7. Consultar todas las citas de un doctor en una fecha
```bash
curl http://localhost:3000/api/citas?doctorId=1&fecha=2025-07-10
```

### 8. Consultar todos los pacientes, doctores o citas
```bash
curl http://localhost:3000/api/pacientes
curl http://localhost:3000/api/doctores
curl http://localhost:3000/api/citas
```

---

## Notas
- Cambia los IDs por los que correspondan a tus datos reales.
- Puedes importar estos ejemplos en Postman como peticiones tipo POST/GET.
- El backend usa Firestore, así que los datos se guardan en la nube.
- Los horarios de los doctores tienen IDs secuenciales y puedes gestionarlos (agregar, actualizar, eliminar) usando los endpoints correspondientes.
- La lógica de disponibilidad y agendamiento está lista para integrarse con un frontend tipo calendario (ej: FullCalendar).