import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { validateLoginForm } from '../../utils/validation.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { Link } from 'react-router-dom';
import './LoginForm.css';
import medicosImg from '../../assets/medicos.png'; 

/**
 * Componente de formulario de login
 */
export const LoginForm = ({ onSwitchToRegister }) => {
  const { login, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  /**
   * Maneja los cambios en los campos del formulario
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores al escribir
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (error) {
      clearError();
    }
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    // Intentar login
    await login(formData.email, formData.password);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Lado izquierdo: fondo azul y formulario */}
      <div
        style={{
          width: '50%',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h2>Iniciar Sesión</h2>
              <p>Accede a tu cuenta de citas médicas</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  className={validationErrors.email ? 'error' : ''}
                  disabled={loading}
                />
                {validationErrors.email && (
                  <span className="error-message">{validationErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Tu contraseña"
                  className={validationErrors.password ? 'error' : ''}
                  disabled={loading}
                />
                {validationErrors.password && (
                  <span className="error-message">{validationErrors.password}</span>
                )}
              </div>

              {error && (
                <div className="auth-error">
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="login-footer">
              <p>
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="link-button">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Lado derecho: imagen */}
      <div
        style={{
          width: '50%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
        }}
      >
        <img
          src={medicosImg}
          alt="Médicos"
          style={{
            width: '90%',
            height: '90%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
};

export default LoginForm; 
