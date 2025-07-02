import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import { AuthPage } from './components/AuthPage.jsx';
import './App.css';

// Importo las páginas
import LoginForm from './pages/Login/LoginForm.jsx';
import RegisterForm from './pages/Register/RegisterForm.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import NotFoundPage from './pages/NotFound/NotFoundPage.jsx';

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

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginForm />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterForm />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
