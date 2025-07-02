import { useAuth } from './hooks/useAuth.js';
import { AuthPage } from './components/AuthPage.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import './App.css';

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

  // Si el usuario está autenticado, mostrar el dashboard
  if (user) {
    return <Dashboard />;
  }

  // Si no está autenticado, mostrar la página de login/registro
  return <AuthPage />;
}

export default App;
