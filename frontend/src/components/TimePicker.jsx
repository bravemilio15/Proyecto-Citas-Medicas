import React, { useEffect, useState } from 'react';
import { obtenerHorasDisponibles } from '../lib/citasService.js';

const TimePicker = ({ doctorId, fecha, value, onChange }) => {
  const [horas, setHoras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarHoras = async () => {
      if (doctorId && fecha) {
        try {
          setLoading(true);
          setError('');
          const data = await obtenerHorasDisponibles(doctorId, fecha);
          // Asegurar que data sea un array
          const horasArray = Array.isArray(data) ? data : [];
          setHoras(horasArray);
        } catch (err) {
          console.error('Error al cargar horas disponibles:', err);
          setError('Error al cargar horas disponibles');
          setHoras([]);
        } finally {
          setLoading(false);
        }
      } else {
        setHoras([]);
        setLoading(false);
        setError('');
      }
    };

    cargarHoras();
  }, [doctorId, fecha]);

  if (loading) {
    return (
      <div className="form-group">
        <label htmlFor="hora">Hora</label>
        <select disabled>
          <option>Cargando horas disponibles...</option>
        </select>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-group">
        <label htmlFor="hora">Hora</label>
        <select disabled>
          <option>Error al cargar horas</option>
        </select>
      </div>
    );
  }

  if (!loading && doctorId && fecha && horas.length === 0) {
    return (
      <div className="form-group">
        <label htmlFor="hora">Hora</label>
        <select disabled>
          <option>No hay horarios disponibles</option>
        </select>
      </div>
    );
  }

  return (
    <div className="form-group">
      <label htmlFor="hora">Hora</label>
      <select
        id="hora"
        name="hora"
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        disabled={!doctorId || !fecha}
      >
        <option value="">Selecciona una hora</option>
        {horas.map(hora => (
          <option key={hora} value={hora}>{hora}</option>
        ))}
      </select>
    </div>
  );
};

export default TimePicker;
