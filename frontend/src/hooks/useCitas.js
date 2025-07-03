import { useState, useEffect } from 'react';
import { 
  obtenerCitasPaciente, 
  obtenerCitasDoctor, 
  agendarCita as crearCitaService, 
  cancelarCita as cancelarCitaService, 
  completarCita as completarCitaService 
} from '../lib/citasService';
import { useAuth } from './useAuth.js';

/**
 * Hook para gestionar citas médicas.
 * @param {Object} [params] - Parámetros opcionales para filtrar citas.
 * @param {string} [params.userId] - ID del paciente.
 * @param {string} [params.doctorId] - ID del doctor.
 * @returns {Object} - Estado y acciones relacionadas con las citas.
 */
export function useCitas(params = {}) {
  const { userId, doctorId } = params;
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar citas al montar o cuando cambian los filtros
  useEffect(() => {
    setLoading(true);
    setError('');
    
    const cargarCitas = async () => {
      try {
        let data;
        if (userId) {
          data = await obtenerCitasPaciente(userId);
        } else if (doctorId) {
          data = await obtenerCitasDoctor(doctorId);
        } else {
          data = [];
        }
        setCitas(data);
      } catch (err) {
        setError(err.message || 'Error al cargar citas');
      } finally {
        setLoading(false);
      }
    };
    
    cargarCitas();
  }, [userId, doctorId]);

  // Crear una nueva cita
  const crearCita = async (citaData) => {
    setLoading(true);
    setError('');
    try {
      const nuevaCita = await crearCitaService(citaData);
      setCitas(prev => [...prev, nuevaCita]);
      return nuevaCita;
    } catch (err) {
      setError(err.message || 'Error al crear cita');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar una cita
  const cancelarCita = async (citaId) => {
    setLoading(true);
    setError('');
    try {
      await cancelarCitaService(citaId);
      setCitas(prev => prev.map(c => c.id === citaId ? { ...c, estado: 'cancelada' } : c));
    } catch (err) {
      setError(err.message || 'Error al cancelar cita');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Completar una cita
  const completarCita = async (citaId) => {
    setLoading(true);
    setError('');
    try {
      await completarCitaService(citaId);
      setCitas(prev => prev.map(c => c.id === citaId ? { ...c, estado: 'completada' } : c));
    } catch (err) {
      setError(err.message || 'Error al completar cita');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    citas,
    loading,
    error,
    crearCita,
    cancelarCita,
    completarCita,
  };
}

// Hook para agendar una cita
export function useAgendarCita() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const agendar = async (datos) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await crearCitaService(datos);
      setSuccess('¡Cita agendada con éxito!');
    } catch (err) {
      setError(err.message || 'Error al agendar cita');
    }
    setLoading(false);
  };

  return { agendar, loading, error, success };
}

// Hook para cancelar una cita
export function useCancelarCita() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const cancelar = async (citaId) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await cancelarCitaService(citaId);
      setSuccess('Cita cancelada');
    } catch (err) {
      setError(err.message || 'Error al cancelar cita');
    }
    setLoading(false);
  };

  return { cancelar, loading, error, success };
}
