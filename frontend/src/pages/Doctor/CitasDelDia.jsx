import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation.jsx';
import CitaCard from '../../components/CitaCard.jsx';
import CitaTable from '../../components/CitaTable.jsx';
import Button from '../../components/ui/Button.jsx';
import { useCitas } from '../../hooks/useCitas.js';
import { useAuth } from '../../hooks/useAuth.js';
import './CitasDelDia.css';

const CitasDelDia = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { citas, loading, actualizarEstadoCita } = useCitas();
  
  const [viewMode, setViewMode] = useState('cards');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

  // Obtener citas del doctor para la fecha seleccionada
  const citasDelDia = citas.filter(cita => 
    cita.doctorId === user?.uid && 
    cita.fecha === fechaSeleccionada &&
    cita.estado !== 'cancelada'
  );

  // Ordenar citas por hora
  const citasOrdenadas = citasDelDia.sort((a, b) => a.hora.localeCompare(b.hora));

  const handleEstadoChange = async (citaId, nuevoEstado) => {
    try {
      await actualizarEstadoCita(citaId, nuevoEstado);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const getStatusColor = (estado) => {
    const colors = {
      'pendiente': '#FF9800',
      'confirmada': '#4CAF50',
      'cancelada': '#F44336',
      'completada': '#2196F3'
    };
    return colors[estado] || '#666';
  };

  const getStatusText = (estado) => {
    const texts = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'cancelada': 'Cancelada',
      'completada': 'Completada'
    };
    return texts[estado] || estado;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="citas-del-dia-page">
      <Navigation />
      
      <div className="citas-del-dia-container">
        <div className="citas-del-dia-header">
          <div className="header-content">
            <h1>Citas del Día</h1>
            <p>Gestiona las citas programadas para hoy</p>
          </div>
          <div className="header-actions">
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="date-selector"
            />
            <Button 
              onClick={() => navigate('/doctor/calendario')}
              variant="secondary"
            >
              Ver Calendario
            </Button>
          </div>
        </div>

        <div className="citas-del-dia-info">
          <h2>{formatDate(fechaSeleccionada)}</h2>
          <div className="citas-stats">
            <div className="stat-item">
              <span className="stat-label">Total de citas:</span>
              <span className="stat-value">{citasOrdenadas.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pendientes:</span>
              <span className="stat-value" style={{ color: getStatusColor('pendiente') }}>
                {citasOrdenadas.filter(c => c.estado === 'pendiente').length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Confirmadas:</span>
              <span className="stat-value" style={{ color: getStatusColor('confirmada') }}>
                {citasOrdenadas.filter(c => c.estado === 'confirmada').length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completadas:</span>
              <span className="stat-value" style={{ color: getStatusColor('completada') }}>
                {citasOrdenadas.filter(c => c.estado === 'completada').length}
              </span>
            </div>
          </div>
        </div>

        <div className="view-controls">
          <Button
            variant={viewMode === 'cards' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('cards')}
          >
            📋 Tarjetas
          </Button>
          <Button
            variant={viewMode === 'table' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('table')}
          >
            📊 Tabla
          </Button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando citas...</p>
          </div>
        ) : citasOrdenadas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No hay citas programadas</h3>
            <p>No tienes citas agendadas para el {formatDate(fechaSeleccionada)}.</p>
            <div className="empty-actions">
              <Button 
                onClick={() => navigate('/doctor/horario-disponible')}
                variant="secondary"
              >
                Configurar Horario
              </Button>
              <Button 
                onClick={() => navigate('/doctor/calendario')}
              >
                Ver Calendario Completo
              </Button>
            </div>
          </div>
        ) : (
          <div className="citas-content">
            {viewMode === 'cards' ? (
              <div className="citas-grid">
                {citasOrdenadas.map(cita => (
                  <CitaCard
                    key={cita.id}
                    cita={cita}
                    isDoctor={true}
                    onEstadoChange={(nuevoEstado) => handleEstadoChange(cita.id, nuevoEstado)}
                    canUpdateStatus={cita.estado !== 'completada'}
                  />
                ))}
              </div>
            ) : (
              <CitaTable
                citas={citasOrdenadas}
                isDoctor={true}
                onEstadoChange={handleEstadoChange}
                canUpdateStatus={(cita) => cita.estado !== 'completada'}
              />
            )}
          </div>
        )}

        <div className="citas-del-dia-summary">
          <h3>Resumen del Día</h3>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">Primera cita:</span>
              <span className="summary-value">
                {citasOrdenadas.length > 0 ? citasOrdenadas[0].hora : 'N/A'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Última cita:</span>
              <span className="summary-value">
                {citasOrdenadas.length > 0 ? citasOrdenadas[citasOrdenadas.length - 1].hora : 'N/A'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Promedio por hora:</span>
              <span className="summary-value">
                {citasOrdenadas.length > 0 ? (citasOrdenadas.length / 8).toFixed(1) : '0'} citas
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitasDelDia;
