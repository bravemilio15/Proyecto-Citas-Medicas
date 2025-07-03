import { API_CONFIG } from '../config/api.js';

const API_URL = API_CONFIG.DOCTORES_URL;

// Obtener todos los doctores (GET /api/doctores)
export async function obtenerDoctores(filtros = {}) {
  try {
    const params = new URLSearchParams(filtros);
    const res = await fetch(`${API_URL}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors'
    });
    
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
    }
    
    const response = await res.json();
    
    // El backend devuelve {success: true, data: [...]}
    if (response.success && response.data) {
      return Array.isArray(response.data) ? response.data : [];
    }
    
    // Si no tiene la estructura esperada, devolver como array
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Error en obtenerDoctores:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión: No se pudo conectar con el servidor');
    }
    throw error;
  }
}

// Obtener un doctor por ID (GET /api/doctores/:id)
export async function obtenerDoctorPorId(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener doctor');
  return await res.json();
}

// Crear un doctor (POST /api/doctores)
export async function crearDoctor(datos) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error('Error al crear doctor');
  return await res.json();
}

// Actualizar datos de un doctor (PUT /api/doctores/:id)
export async function actualizarDoctor(id, datos) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error('Error al actualizar doctor');
  return await res.json();
}

// Eliminar un doctor (DELETE /api/doctores/:id)
export async function eliminarDoctor(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar doctor');
  return await res.json();
}

// Obtener horario disponible del doctor (GET /api/doctores/:id/horarios)
export async function obtenerHorarioDoctor(doctorId) {
  const res = await fetch(`${API_URL}/${doctorId}/horarios`);
  if (!res.ok) throw new Error('Error al obtener horario');
  return await res.json();
}

// Actualizar horario disponible del doctor (PUT /api/doctores/:id/horarios)
export async function actualizarHorarioDoctor(doctorId, horario) {
  const res = await fetch(`${API_URL}/${doctorId}/horarios`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(horario),
  });
  if (!res.ok) throw new Error('Error al actualizar horario');
  return await res.json();
}
