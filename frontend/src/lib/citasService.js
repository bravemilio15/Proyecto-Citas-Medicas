import { API_CONFIG } from '../config/api.js';

const API_URL = API_CONFIG.CITAS_URL;

// Obtener citas de un paciente
export async function obtenerCitasPaciente(pacienteId, filtros = {}) {
  const params = new URLSearchParams({ pacienteId, ...filtros });
  const res = await fetch(`${API_URL}?${params}`);
  if (!res.ok) throw new Error('Error al obtener citas');
  const response = await res.json();
  
  // El backend devuelve {success: true, data: [...]}
  if (response.success && response.data) {
    return Array.isArray(response.data) ? response.data : [];
  }
  
  // Si no tiene la estructura esperada, devolver como array
  return Array.isArray(response) ? response : [];
}

// Obtener citas de un doctor
export async function obtenerCitasDoctor(doctorId, filtros = {}) {
  const params = new URLSearchParams({ doctorId, ...filtros });
  const res = await fetch(`${API_URL}?${params}`);
  if (!res.ok) throw new Error('Error al obtener citas');
  const response = await res.json();
  
  // El backend devuelve {success: true, data: [...]}
  if (response.success && response.data) {
    return Array.isArray(response.data) ? response.data : [];
  }
  
  // Si no tiene la estructura esperada, devolver como array
  return Array.isArray(response) ? response : [];
}

// Obtener una cita por ID
export async function obtenerCitaPorId(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener cita');
  return await res.json();
}

// Agendar una cita
export async function agendarCita(datos) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error('Error al agendar cita');
  return await res.json();
}

// Cancelar una cita
export async function cancelarCita(citaId) {
  const res = await fetch(`${API_URL}/${citaId}/cancelar`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Error al cancelar cita');
  return await res.json();
}

// Marcar cita como completada
export async function completarCita(citaId) {
  const res = await fetch(`${API_URL}/${citaId}/completar`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Error al completar cita');
  return await res.json();
}

// Obtener horas disponibles para un doctor en una fecha
export async function obtenerHorasDisponibles(doctorId, fecha) {
  const res = await fetch(`${API_URL}/disponibilidad/${doctorId}/${fecha}`);
  if (!res.ok) throw new Error('Error al obtener disponibilidad');
  const response = await res.json();
  
  // El backend devuelve {success: true, data: [...]}
  if (response.success && response.data) {
    return Array.isArray(response.data) ? response.data : [];
  }
  
  // Si no tiene la estructura esperada, devolver como array
  return Array.isArray(response) ? response : [];
}

// Obtener estadísticas de citas
export async function obtenerEstadisticasCitas() {
  const res = await fetch(`${API_URL}/estadisticas`);
  if (!res.ok) throw new Error('Error al obtener estadísticas');
  return await res.json();
}

// Obtener todos los slots disponibles para un doctor
export async function getSlotsDisponibles(doctorId) {
  const res = await fetch(`${API_URL}/slots/${doctorId}`);
  if (!res.ok) throw new Error('Error al obtener slots disponibles');
  const response = await res.json();
  if (response.success && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
}
