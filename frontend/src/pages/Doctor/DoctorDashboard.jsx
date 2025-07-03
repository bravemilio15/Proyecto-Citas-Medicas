import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  const dashboardCards = [
    {
      title: 'Citas del Día',
      description: 'Ver citas programadas para hoy',
      icon: '📋',
      path: '/doctor/citas-del-dia',
      color: '#2193b0'
    },
    {
      title: 'Calendario',
      description: 'Vista completa del calendario',
      icon: '📅',
      path: '/doctor/calendario',
      color: '#4CAF50'
    },
    {
      title: 'Horario Disponible',
      description: 'Configurar horarios de atención',
      icon: '⏰',
      path: '/doctor/horario-disponible',
      color: '#FF9800'
    },
    {
      title: 'Estadísticas',
      description: 'Ver estadísticas de consultas',
      icon: '📊',
      path: '/doctor/estadisticas',
      color: '#9C27B0'
    }
  ];

  return (
    <div className="doctor-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <h1>Panel del Doctor</h1>
            <p>Bienvenido, Dr. {user?.displayName || user?.email}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          {dashboardCards.map((card, index) => (
            <div 
              key={index} 
              className="dashboard-card"
              onClick={() => navigate(card.path)}
              style={{ borderLeftColor: card.color }}
            >
              <div className="card-icon" style={{ backgroundColor: card.color }}>
                {card.icon}
              </div>
              <div className="card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>

        <div className="dashboard-info">
          <h2>Información de tu Cuenta</h2>
          <div className="user-info">
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Nombre:</span>
              <span className="value">{user?.displayName || 'No especificado'}</span>
            </div>
            <div className="info-item">
              <span className="label">ID de Usuario:</span>
              <span className="value">{user?.uid}</span>
            </div>
            <div className="info-item">
              <span className="label">Cuenta creada:</span>
              <span className="value">
                {user?.metadata?.creationTime 
                  ? new Date(user.metadata.creationTime).toLocaleDateString('es-ES') 
                  : 'No disponible'
                }
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
