import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import './App.css';

// Importo las páginas de autenticación
import LoginForm from './pages/Login/LoginForm.jsx';
import RegisterForm from './pages/Register/RegisterForm.jsx';
import NotFoundPage from './pages/NotFound/NotFoundPage.jsx';

// Importo las páginas del paciente
import PacienteDashboard from './pages/Paciente/PacienteDashboard.jsx';
import AgendarCita from './pages/Paciente/AgendarCita.jsx';
import MisCitas from './pages/Paciente/MisCitas.jsx';
import PacienteCalendar from './pages/Paciente/PacienteCalendar.jsx';

// Importo las páginas del doctor
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx';
import HorarioDisponible from './pages/Doctor/HorarioDisponible.jsx';
import CitasDelDia from './pages/Doctor/CitasDelDia.jsx';
import DoctorCalendar from './pages/Doctor/DoctorCalendar.jsx';

/**
 * Componente principal de la aplicación
 * Maneja la lógica de autenticación y renderiza el contenido apropiado
 */
function App() {
  const { user, loading } = useAuth();

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Iniciando aplicación...</p>
      </div>
    );
  }

  // Función para determinar el rol del usuario (simplificado por ahora)
  const getUserRole = (user) => {
    // Por ahora, asumimos que si el email contiene "doctor" es doctor, sino paciente
    // En un sistema real, esto vendría de la base de datos o claims de Firebase
    if (user?.email?.includes('doctor')) {
      return 'doctor';
    }
    return 'paciente';
  };

  const userRole = user ? getUserRole(user) : null;

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={user ? <Navigate to={`/${userRole}-dashboard`} /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to={`/${userRole}-dashboard`} /> : <LoginForm />} />
        <Route path="/register" element={user ? <Navigate to={`/${userRole}-dashboard`} /> : <RegisterForm />} />
        
        {/* Rutas del paciente */}
        <Route path="/paciente-dashboard" element={user && userRole === 'paciente' ? <PacienteDashboard /> : <Navigate to="/login" />} />
        <Route path="/paciente/agendar-cita" element={user && userRole === 'paciente' ? <AgendarCita /> : <Navigate to="/login" />} />
        <Route path="/paciente/mis-citas" element={user && userRole === 'paciente' ? <MisCitas /> : <Navigate to="/login" />} />
        <Route path="/paciente/calendario" element={user && userRole === 'paciente' ? <PacienteCalendar /> : <Navigate to="/login" />} />
        
        {/* Rutas del doctor */}
        <Route path="/doctor-dashboard" element={user && userRole === 'doctor' ? <DoctorDashboard /> : <Navigate to="/login" />} />
        <Route path="/doctor/horario-disponible" element={user && userRole === 'doctor' ? <HorarioDisponible /> : <Navigate to="/login" />} />
        <Route path="/doctor/citas-del-dia" element={user && userRole === 'doctor' ? <CitasDelDia /> : <Navigate to="/login" />} />
        <Route path="/doctor/calendario" element={user && userRole === 'doctor' ? <DoctorCalendar /> : <Navigate to="/login" />} />
        
        {/* Ruta de error */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
