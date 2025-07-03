import { useState, useEffect } from 'react';
import { obtenerDoctores } from '../lib/doctorService.js';

export function useDoctores(filtros = {}) {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    obtenerDoctores(filtros)
      .then(setDoctores)
      .catch(() => setError('Error al cargar doctores'))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filtros)]);

  return { doctores, loading, error };
}
