import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation.jsx';
import Button from '../../components/ui/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { actualizarHorarioDoctor, obtenerHorarioDoctor } from '../../lib/doctorService.js';
import './HorarioDisponible.css';

function getDiaSemanaStr(fecha) {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[new Date(fecha).getDay()];
}

const HorarioDisponible = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bloques, setBloques] = useState([]); // [{fecha, horaInicio, horaFin}]
  const [nuevoBloque, setNuevoBloque] = useState({ fecha: '', horaInicio: '', horaFin: '' });
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Cargar bloques actuales del doctor
  useEffect(() => {
    const cargarHorario = async () => {
      if (!user || !user.uid) {
        setLoadingInitial(false);
        return;
      }
      try {
        const response = await obtenerHorarioDoctor(user.uid);
        if (response && response.data && response.data.length > 0) {
          setBloques(response.data.map(h => ({
            fecha: h.fecha,
            horaInicio: h.horaInicio,
            horaFin: h.horaFin
          })));
        }
      } catch (err) {
        console.error('Error al cargar horario:', err);
      } finally {
        setLoadingInitial(false);
      }
    };
    cargarHorario();
  }, [user]);

  // Validar que no se solapen bloques en la misma fecha
  function haySolapamiento(fecha, horaInicio, horaFin, ignorarIdx = -1) {
    return bloques.some((b, idx) =>
      idx !== ignorarIdx &&
      b.fecha === fecha &&
      (
        (horaInicio >= b.horaInicio && horaInicio < b.horaFin) ||
        (horaFin > b.horaInicio && horaFin <= b.horaFin) ||
        (horaInicio <= b.horaInicio && horaFin >= b.horaFin)
      )
    );
  }

  const handleAgregarBloque = () => {
    const { fecha, horaInicio, horaFin } = nuevoBloque;
    if (!fecha || !horaInicio || !horaFin) {
      setError('Completa todos los campos para agregar un bloque');
      return;
    }
    if (horaInicio >= horaFin) {
      setError('La hora de inicio debe ser menor que la de fin');
      return;
    }
    if (haySolapamiento(fecha, horaInicio, horaFin)) {
      setError('El bloque se solapa con otro existente para esa fecha');
      return;
    }
    setBloques(prev => [...prev, { fecha, horaInicio, horaFin }]);
    setNuevoBloque({ fecha: '', horaInicio: '', horaFin: '' });
    setError('');
  };

  const handleEliminarBloque = (idx) => {
    setBloques(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      if (!user || !user.uid) throw new Error('Usuario no autenticado');
      if (bloques.length === 0) throw new Error('Agrega al menos un bloque de disponibilidad');
      // Enviar al backend
      await actualizarHorarioDoctor(user.uid, { horarios: bloques });
      setSuccess('Disponibilidad guardada correctamente');
    } catch (err) {
      setError(err.message || 'Error al guardar la disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="horario-disponible-page">
      <Navigation />
      <div className="horario-disponible-container">
        <div className="horario-disponible-header">
          <h1>Configurar Disponibilidad</h1>
          <p>Agrega bloques de disponibilidad por fecha exacta y hora. Puedes agregar varios bloques en el mismo día.</p>
        </div>
        {loadingInitial ? (
          <div className="loading-container">
            <p>Cargando disponibilidad actual...</p>
          </div>
        ) : (
          <form className="horario-form" onSubmit={handleSubmit}>
            <div className="horario-instructions">
              <h3>Agregar bloque de disponibilidad</h3>
              <div className="bloque-form-row">
                <input
                  type="date"
                  value={nuevoBloque.fecha}
                  onChange={e => setNuevoBloque(prev => ({ ...prev, fecha: e.target.value }))}
                  className="bloque-input"
                />
                <input
                  type="time"
                  value={nuevoBloque.horaInicio}
                  onChange={e => setNuevoBloque(prev => ({ ...prev, horaInicio: e.target.value }))}
                  className="bloque-input"
                />
                <span className="time-separator">a</span>
                <input
                  type="time"
                  value={nuevoBloque.horaFin}
                  onChange={e => setNuevoBloque(prev => ({ ...prev, horaFin: e.target.value }))}
                  className="bloque-input"
                />
                <Button type="button" onClick={handleAgregarBloque} style={{ marginLeft: 8 }}>
                  Agregar
                </Button>
              </div>
            </div>
            <div className="bloques-list">
              <h3>Bloques agregados</h3>
              {bloques.length === 0 && <div className="form-info">No hay bloques agregados.</div>}
              {bloques.map((b, idx) => (
                <div className="bloque-item" key={idx}>
                  <span>
                    <strong>{b.fecha}</strong> ({getDiaSemanaStr(b.fecha)}) — {b.horaInicio} a {b.horaFin}
                  </span>
                  <Button type="button" variant="secondary" onClick={() => handleEliminarBloque(idx)} style={{ marginLeft: 12 }}>
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
            {error && <div className="form-error">{error}</div>}
            {success && <div className="form-success">{success}</div>}
            <div className="form-actions">
              <Button 
                type="button" 
                onClick={() => navigate('/doctor-dashboard')}
                variant="secondary"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Disponibilidad'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default HorarioDisponible;
