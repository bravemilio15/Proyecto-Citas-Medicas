import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const getUserRole = (user) => {
    if (user?.email?.includes('doctor')) {
      return 'doctor';
    }
    return 'paciente';
  };

  const userRole = user ? getUserRole(user) : null;

  const getDashboardPath = () => {
    return userRole === 'doctor' ? '/doctor-dashboard' : '/paciente-dashboard';
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/paciente-dashboard': 'Panel del Paciente',
      '/paciente/agendar-cita': 'Agendar Cita',
      '/paciente/mis-citas': 'Mis Citas',
      '/paciente/calendario': 'Calendario',
      '/doctor-dashboard': 'Panel del Doctor',
      '/doctor/horario-disponible': 'Horario Disponible',
      '/doctor/citas-del-dia': 'Citas del Día',
      '/doctor/calendario': 'Calendario',
      '/doctor/estadisticas': 'Estadísticas'
    };
    return titles[path] || 'Página';
  };

  if (!user) return null;

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-left">
          <button 
            onClick={() => navigate(getDashboardPath())}
            className="nav-home-btn"
          >
            🏠 Inicio
          </button>
          <h2 className="nav-title">{getPageTitle()}</h2>
        </div>
        
        <div className="nav-right">
          <div className="user-info">
            <span className="user-name">
              {userRole === 'doctor' ? 'Dr. ' : ''}
              {user?.displayName || user?.email}
            </span>
          </div>
          <button onClick={handleLogout} className="nav-logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 