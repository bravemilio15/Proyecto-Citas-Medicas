import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation.jsx';
import DoctorSelect from '../../components/DoctorSelect.jsx';
import Button from '../../components/ui/Button.jsx';
import { useDoctores } from '../../hooks/useDoctores.js';
import { useCitas } from '../../hooks/useCitas.js';
import { useAuth } from '../../hooks/useAuth.js';
import { getSlotsDisponibles } from '../../lib/citasService.js';
import './AgendarCita.css';

function getDiaSemanaStr(fecha) {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[new Date(fecha).getDay()];
}

function isSlotInNext30Days(slot) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Solo fecha, sin hora
  const slotDate = new Date(slot.fecha);
  slotDate.setHours(0, 0, 0, 0);
  const diff = (slotDate - today) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff < 30;
}

const AgendarCita = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { doctores, loading: loadingDoctores } = useDoctores();
  const { crearCita, loading: loadingCita } = useCitas();

  const [formData, setFormData] = useState({
    doctorId: '',
    fecha: '',
    hora: '',
    motivo: '',
    especialidad: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Obtener doctor seleccionado
  const doctor = useMemo(() => doctores.find(d => d.id === formData.doctorId), [formData.doctorId, doctores]);
  // Resumen de disponibilidad
  const resumenDisponibilidad = useMemo(() => {
    if (!doctor?.horarioDisponible) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return doctor.horarioDisponible
      .filter(h => {
        const fecha = new Date(h.fecha);
        fecha.setHours(0, 0, 0, 0);
        return fecha >= today;
      })
      .map(h => {
        const dia = getDiaSemanaStr(h.fecha);
        return `${dia}: ${h.fecha} — ${h.horaInicio} - ${h.horaFin}`;
      });
  }, [doctor]);

  // Al seleccionar doctor, obtener slots disponibles
  useEffect(() => {
    if (formData.doctorId) {
      setLoadingSlots(true);
      setSlots([]);
      setFormData(prev => ({ ...prev, fecha: '', hora: '' }));
      getSlotsDisponibles(formData.doctorId)
        .then(data => setSlots(data))
        .catch(() => setSlots([]))
        .finally(() => setLoadingSlots(false));
    } else {
      setSlots([]);
      setFormData(prev => ({ ...prev, fecha: '', hora: '' }));
    }
  }, [formData.doctorId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSlotSelect = (slot) => {
    setFormData(prev => ({ ...prev, fecha: slot.fecha, hora: slot.hora }));
    setError('');
  };

  // Filtrar solo slots válidos (próximos 30 días y no pasados)
  const slotsValidos = useMemo(() => {
    return slots.filter(isSlotInNext30Days).sort((a, b) => {
      if (a.fecha === b.fecha) return a.hora.localeCompare(b.hora);
      return a.fecha.localeCompare(b.fecha);
    });
  }, [slots]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!formData.doctorId || !formData.fecha || !formData.hora || !formData.motivo) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }
    // Validar que el slot seleccionado sigue siendo válido
    if (!slotsValidos.some(s => s.fecha === formData.fecha && s.hora === formData.hora)) {
      setError('El horario seleccionado ya no está disponible. Por favor, elige otro.');
      return;
    }

    try {
      const citaData = {
        ...formData,
        pacienteId: user.uid,
        pacienteNombre: user.displayName || user.email,
        estado: 'pendiente'
      };
      await crearCita(citaData);
      setSuccess('Cita agendada correctamente');
      setFormData({
        doctorId: '',
        fecha: '',
        hora: '',
        motivo: '',
        especialidad: ''
      });
      setTimeout(() => {
        navigate('/paciente/mis-citas');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al agendar la cita');
    }
  };

  return (
    <div className="agendar-cita-page">
      <Navigation />
      <div className="agendar-cita-container">
        <div className="agendar-cita-header">
          <h1>Agendar Nueva Cita</h1>
          <p>Completa los datos para programar tu cita médica</p>
        </div>
        <form className="agendar-cita-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Seleccionar Doctor</h3>
            <DoctorSelect
              doctores={doctores}
              loading={loadingDoctores}
              value={formData.doctorId}
              onChange={(doctorId) => {
                const doctor = doctores.find(d => d.id === doctorId);
                handleInputChange('doctorId', doctorId);
                handleInputChange('especialidad', doctor?.especialidad || '');
              }}
            />
            {doctor && resumenDisponibilidad.length > 0 && (
              <div className="doctor-disponibilidad-resumen">
                <strong>Disponibilidad:</strong>
                <ul>
                  {resumenDisponibilidad.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
          </div>
          <div className="form-section">
            <h3>Selecciona Fecha y Hora</h3>
            {loadingSlots && <div className="form-info">Cargando horarios disponibles...</div>}
            {!loadingSlots && slotsValidos.length === 0 && formData.doctorId && (
              <div className="form-info">No hay horarios disponibles para este doctor en los próximos 30 días.</div>
            )}
            <div className="slots-list">
              {slotsValidos.map((slot, idx) => (
                <button
                  type="button"
                  key={slot.fecha + slot.hora + idx}
                  className={`slot-btn${formData.fecha === slot.fecha && formData.hora === slot.hora ? ' selected' : ''}`}
                  onClick={() => handleSlotSelect(slot)}
                >
                  {getDiaSemanaStr(slot.fecha)}, {slot.fecha} — {slot.hora}
                </button>
              ))}
            </div>
          </div>
          <div className="form-section">
            <h3>Motivo de la Consulta</h3>
            <textarea
              value={formData.motivo}
              onChange={(e) => handleInputChange('motivo', e.target.value)}
              placeholder="Describe el motivo de tu consulta..."
              rows="4"
              className="motivo-textarea"
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          <div className="form-actions">
            <Button 
              type="button" 
              onClick={() => navigate('/paciente-dashboard')}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loadingCita}
            >
              {loadingCita ? 'Agendando...' : 'Agendar Cita'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgendarCita;
