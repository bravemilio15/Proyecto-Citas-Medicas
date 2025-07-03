import { API_CONFIG } from '../config/api.js';

const API_URL = API_CONFIG.PACIENTES_URL;

// Obtener todos los pacientes (GET /api/pacientes)
export async function obtenerPacientes(filtros = {}) {
  const params = new URLSearchParams(filtros);
  const res = await fetch(`${API_URL}?${params}`);
  if (!res.ok) throw new Error('Error al obtener pacientes');
  return await res.json();
}

// Obtener un paciente por ID (GET /api/pacientes/:id)
export async function obtenerPacientePorId(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener paciente');
  return await res.json();
}

// Crear un paciente (POST /api/pacientes)
export async function crearPaciente(datos) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error('Error al crear paciente');
  return await res.json();
}

// Actualizar datos de un paciente (PUT /api/pacientes/:id)
export async function actualizarPaciente(id, datos) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error('Error al actualizar paciente');
  return await res.json();
}

// Eliminar un paciente (DELETE /api/pacientes/:id)
export async function eliminarPaciente(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar paciente');
  return await res.json();
}
