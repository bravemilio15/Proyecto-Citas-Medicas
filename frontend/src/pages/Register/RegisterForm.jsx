import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { validateRegisterForm } from '../../utils/validation.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { Link } from 'react-router-dom';
import './RegisterForm.css';

/**
 * Componente de formulario de registro
 */
export const RegisterForm = () => {
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
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
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    // Intentar registro
    await register(formData.email, formData.password, formData.displayName);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Crear Cuenta</h2>
          <p>Regístrate para acceder a citas médicas</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="displayName">Nombre Completo</label>
            <Input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="Tu nombre completo"
              className={validationErrors.displayName ? 'error' : ''}
              disabled={loading}
            />
            {validationErrors.displayName && (
              <span className="error-message">{validationErrors.displayName}</span>
            )}
          </div>

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
              placeholder="Mínimo 6 caracteres"
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
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </form>

        <div className="login-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="link-button">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 