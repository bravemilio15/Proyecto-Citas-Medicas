import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation.jsx';
import FullCalendarWrapper from '../../components/FullCalendarWrapper.jsx';
import Button from '../../components/ui/Button.jsx';
import { useCitas } from '../../hooks/useCitas.js';
import { useAuth } from '../../hooks/useAuth.js';
import './DoctorCalendar.css';

const DoctorCalendar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { citas, loading, actualizarEstadoCita } = useCitas();
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filtrar citas del doctor actual
  const misCitas = citas.filter(cita => cita.doctorId === user?.uid);

  // Convertir citas al formato que espera FullCalendar
  const eventos = misCitas.map(cita => ({
    id: cita.id,
    title: `Cita con ${cita.pacienteNombre || 'Paciente'}`,
    start: `${cita.fecha}T${cita.hora}`,
    end: `${cita.fecha}T${cita.hora}`,
    backgroundColor: getEventColor(cita.estado),
    borderColor: getEventColor(cita.estado),
    extendedProps: {
      cita: cita
    }
  }));

  function getEventColor(estado) {
    const colors = {
      'pendiente': '#FF9800',
      'confirmada': '#4CAF50',
      'cancelada': '#F44336',
      'completada': '#2196F3'
    };
    return colors[estado] || '#666';
  }

  function getStatusText(estado) {
    const texts = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'cancelada': 'Cancelada',
      'completada': 'Completada'
    };
    return texts[estado] || estado;
  }

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps.cita);
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
  };

  const handleEstadoChange = async (citaId, nuevoEstado) => {
    try {
      await actualizarEstadoCita(citaId, nuevoEstado);
      // Actualizar el evento seleccionado
      if (selectedEvent && selectedEvent.id === citaId) {
        setSelectedEvent(prev => ({ ...prev, estado: nuevoEstado }));
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const handleVerCitasDelDia = () => {
    navigate('/doctor/citas-del-dia');
  };

  const handleConfigurarHorario = () => {
    navigate('/doctor/horario-disponible');
  };

  return (
    <div className="doctor-calendar-page">
      <Navigation />
      
      <div className="doctor-calendar-container">
        <div className="calendar-header">
          <div className="header-content">
            <h1>Calendario de Consultas</h1>
            <p>Gestiona y visualiza todas tus citas médicas</p>
          </div>
          <div className="header-actions">
            <Button 
              onClick={handleVerCitasDelDia}
              variant="secondary"
            >
              Ver Citas del Día
            </Button>
            <Button 
              onClick={handleConfigurarHorario}
              variant="secondary"
            >
              Configurar Horario
            </Button>
          </div>
        </div>

        <div className="calendar-content">
          <div className="calendar-main">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando calendario...</p>
              </div>
            ) : (
              <FullCalendarWrapper
                events={eventos}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
                height="600px"
              />
            )}
          </div>

          <div className="calendar-sidebar">
            <div className="sidebar-section">
              <h3>Leyenda</h3>
              <div className="legend">
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#FF9800' }}></div>
                  <span>Pendiente</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
                  <span>Confirmada</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#2196F3' }}></div>
                  <span>Completada</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#F44336' }}></div>
                  <span>Cancelada</span>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Estadísticas</h3>
              <div className="stats">
                <div className="stat-item">
                  <span className="stat-label">Total de citas:</span>
                  <span className="stat-value">{misCitas.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Pendientes:</span>
                  <span className="stat-value" style={{ color: '#FF9800' }}>
                    {misCitas.filter(c => c.estado === 'pendiente').length}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Confirmadas:</span>
                  <span className="stat-value" style={{ color: '#4CAF50' }}>
                    {misCitas.filter(c => c.estado === 'confirmada').length}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Completadas:</span>
                  <span className="stat-value" style={{ color: '#2196F3' }}>
                    {misCitas.filter(c => c.estado === 'completada').length}
                  </span>
                </div>
              </div>
            </div>

            {selectedEvent && (
              <div className="sidebar-section">
                <h3>Detalles de la Cita</h3>
                <div className="event-details">
                  <div className="detail-item">
                    <span className="detail-label">Paciente:</span>
                    <span className="detail-value">{selectedEvent.pacienteNombre || 'No especificado'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Fecha:</span>
                    <span className="detail-value">{selectedEvent.fecha}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Hora:</span>
                    <span className="detail-value">{selectedEvent.hora}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Estado:</span>
                    <span className="detail-value" style={{ color: getEventColor(selectedEvent.estado) }}>
                      {getStatusText(selectedEvent.estado)}
                    </span>
                  </div>
                  {selectedEvent.motivo && (
                    <div className="detail-item">
                      <span className="detail-label">Motivo:</span>
                      <span className="detail-value">{selectedEvent.motivo}</span>
                    </div>
                  )}
                  
                  <div className="event-actions">
                    <h4>Acciones</h4>
                    {selectedEvent.estado === 'pendiente' && (
                      <div className="action-buttons">
                        <Button
                          onClick={() => handleEstadoChange(selectedEvent.id, 'confirmada')}
                          size="small"
                          variant="success"
                        >
                          Confirmar
                        </Button>
                        <Button
                          onClick={() => handleEstadoChange(selectedEvent.id, 'cancelada')}
                          size="small"
                          variant="danger"
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                    {selectedEvent.estado === 'confirmada' && (
                      <div className="action-buttons">
                        <Button
                          onClick={() => handleEstadoChange(selectedEvent.id, 'completada')}
                          size="small"
                          variant="primary"
                        >
                          Marcar Completada
                        </Button>
                        <Button
                          onClick={() => handleEstadoChange(selectedEvent.id, 'cancelada')}
                          size="small"
                          variant="danger"
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                    {selectedEvent.estado === 'completada' && (
                      <p className="completed-note">✅ Cita completada</p>
                    )}
                    {selectedEvent.estado === 'cancelada' && (
                      <p className="cancelled-note">❌ Cita cancelada</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCalendar;
