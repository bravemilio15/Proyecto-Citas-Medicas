import { useAuth } from '../../hooks/useAuth.js';
import './Dashboard.css';

/**
 * Componente de dashboard que se muestra después del login
 */
export const Dashboard = () => {
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Panel de Citas Médicas</h1>
          <p>Bienvenido, {user?.displayName || user?.email}</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="logout-button"
          disabled={loading}
        >
          {loading ? 'Cerrando...' : 'Cerrar Sesión'}
        </button>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Mis Citas</h3>
            <p>Gestiona tus citas médicas</p>
            <button className="card-button">Ver Citas</button>
          </div>

          <div className="dashboard-card">
            <h3>Buscar Doctor</h3>
            <p>Encuentra especialistas disponibles</p>
            <button className="card-button">Buscar</button>
          </div>

          <div className="dashboard-card">
            <h3>Historial Médico</h3>
            <p>Consulta tu historial de citas</p>
            <button className="card-button">Ver Historial</button>
          </div>

          <div className="dashboard-card">
            <h3>Configuración</h3>
            <p>Gestiona tu perfil y preferencias</p>
            <button className="card-button">Configurar</button>
          </div>
        </div>

        <div className="dashboard-info">
          <h2>Información de tu Cuenta</h2>
          <div className="user-info">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Nombre:</strong> {user?.displayName || 'No especificado'}</p>
            <p><strong>ID de Usuario:</strong> {user?.uid}</p>
            <p><strong>Cuenta creada:</strong> {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('es-ES') : 'No disponible'}</p>
          </div>
        </div>
      </main>
    </div>
  );
}; 
export default Dashboard;