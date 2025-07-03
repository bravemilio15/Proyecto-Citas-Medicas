import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation.jsx';
import CitaCard from '../../components/CitaCard.jsx';
import CitaTable from '../../components/CitaTable.jsx';
import Button from '../../components/ui/Button.jsx';
import { useCitas } from '../../hooks/useCitas.js';
import { useAuth } from '../../hooks/useAuth.js';
import './MisCitas.css';

const MisCitas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { citas, loading, cancelarCita } = useCitas();
  
  const [viewMode, setViewMode] = useState('cards'); // 'cards' o 'table'
  const [filterStatus, setFilterStatus] = useState('todas');

  // Filtrar citas del usuario actual
  const misCitas = citas.filter(cita => cita.pacienteId === user?.uid);

  // Filtrar por estado
  const citasFiltradas = filterStatus === 'todas' 
    ? misCitas 
    : misCitas.filter(cita => cita.estado === filterStatus);

  const handleCancelarCita = async (citaId) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      try {
        await cancelarCita(citaId);
      } catch (error) {
        console.error('Error al cancelar cita:', error);
      }
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

  return (
    <div className="mis-citas-page">
      <Navigation />
      
      <div className="mis-citas-container">
        <div className="mis-citas-header">
          <div className="header-content">
            <h1>Mis Citas</h1>
            <p>Gestiona y consulta tus citas médicas</p>
          </div>
          <Button 
            onClick={() => navigate('/paciente/agendar-cita')}
            className="nueva-cita-btn"
          >
            + Nueva Cita
          </Button>
        </div>

        <div className="mis-citas-controls">
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

          <div className="filter-controls">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="status-filter"
            >
              <option value="todas">Todas las citas</option>
              <option value="pendiente">Pendientes</option>
              <option value="confirmada">Confirmadas</option>
              <option value="completada">Completadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando citas...</p>
          </div>
        ) : citasFiltradas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No tienes citas</h3>
            <p>
              {filterStatus === 'todas' 
                ? 'Aún no has agendado ninguna cita médica.'
                : `No tienes citas ${getStatusText(filterStatus).toLowerCase()}.`
              }
            </p>
            <Button 
              onClick={() => navigate('/paciente/agendar-cita')}
              className="agendar-primera-cita-btn"
            >
              Agendar mi primera cita
            </Button>
          </div>
        ) : (
          <div className="citas-content">
            {viewMode === 'cards' ? (
              <div className="citas-grid">
                {citasFiltradas.map(cita => (
                  <CitaCard
                    key={cita.id}
                    cita={cita}
                    onCancelar={() => handleCancelarCita(cita.id)}
                    canCancel={cita.estado === 'pendiente' || cita.estado === 'confirmada'}
                  />
                ))}
              </div>
            ) : (
              <CitaTable
                citas={citasFiltradas}
                onCancelar={handleCancelarCita}
                canCancel={(cita) => cita.estado === 'pendiente' || cita.estado === 'confirmada'}
              />
            )}
          </div>
        )}

        <div className="mis-citas-summary">
          <h3>Resumen</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total de citas:</span>
              <span className="stat-value">{misCitas.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pendientes:</span>
              <span className="stat-value" style={{ color: getStatusColor('pendiente') }}>
                {misCitas.filter(c => c.estado === 'pendiente').length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Confirmadas:</span>
              <span className="stat-value" style={{ color: getStatusColor('confirmada') }}>
                {misCitas.filter(c => c.estado === 'confirmada').length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completadas:</span>
              <span className="stat-value" style={{ color: getStatusColor('completada') }}>
                {misCitas.filter(c => c.estado === 'completada').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisCitas;
