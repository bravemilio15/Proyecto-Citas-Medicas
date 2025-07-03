import { useState, useEffect } from 'react';
import { obtenerPacientes } from '../lib/pacienteService.js';

export function usePacientes(filtros = {}) {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    obtenerPacientes(filtros)
      .then(setPacientes)
      .catch(() => setError('Error al cargar pacientes'))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filtros)]);

  return { pacientes, loading, error };
}
