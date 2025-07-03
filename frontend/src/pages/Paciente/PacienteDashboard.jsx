import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../../components/ui/Button.jsx';
import './PacienteDashboard.css';

const PacienteDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  const dashboardCards = [
    {
      title: 'Agendar Cita',
      description: 'Programa una nueva cita médica',
      icon: '📅',
      path: '/paciente/agendar-cita',
      color: '#2193b0'
    },
    {
      title: 'Mis Citas',
      description: 'Consulta y gestiona tus citas',
      icon: '🏥',
      path: '/paciente/mis-citas',
      color: '#4CAF50'
    },
    {
      title: 'Calendario',
      description: 'Vista de calendario de citas',
      icon: '📊',
      path: '/paciente/calendario',
      color: '#FF9800'
    },
    {
      title: 'Perfil',
      description: 'Gestiona tu información personal',
      icon: '👤',
      path: '/paciente/perfil',
      color: '#9C27B0'
    }
  ];

  return (
    <div className="paciente-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <h1>Panel del Paciente</h1>
            <p>Bienvenido, {user?.displayName || user?.email}</p>
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

export default PacienteDashboard;
