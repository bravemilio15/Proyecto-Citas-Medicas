import React, { useEffect, useState } from 'react';
import { obtenerDoctores } from '../lib/doctorService.js';

const DoctorSelect = ({ value, onChange }) => {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDoctores = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await obtenerDoctores();
        // Asegurar que data sea un array
        const doctoresArray = Array.isArray(data) ? data : [];
        setDoctores(doctoresArray);
      } catch (err) {
        console.error('Error al cargar doctores:', err);
        setError('Error al cargar doctores: ' + err.message);
        setDoctores([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDoctores();
  }, []);

  if (loading) {
    return (
      <div className="form-group">
        <label htmlFor="doctor">Doctor</label>
        <select disabled>
          <option>Cargando doctores...</option>
        </select>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-group">
        <label htmlFor="doctor">Doctor</label>
        <select disabled>
          <option>Error al cargar doctores</option>
        </select>
      </div>
    );
  }

  return (
    <div className="form-group">
      <label htmlFor="doctor">Doctor</label>
      <select
        id="doctor"
        name="doctor"
        value={value}
        onChange={e => onChange(e.target.value)}
        required
      >
        <option value="">Selecciona un doctor</option>
        {doctores.map(doc => (
          <option key={doc.id} value={doc.id}>
            {doc.nombre} ({doc.especialidad})
          </option>
        ))}
      </select>
    </div>
  );
};

export default DoctorSelect;
