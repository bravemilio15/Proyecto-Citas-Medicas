import { useState } from 'react';
import LoginForm from '../pages/Login/LoginForm.jsx';
import RegisterForm from '../pages/Register/RegisterForm.jsx';
import './AuthPage.css';

/**
 * Página principal de autenticación que maneja login y registro
 */
export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToRegister = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-content">
          <div className="auth-logo">
            <h1>Citas Médicas</h1>
            <p>Tu salud, nuestra prioridad</p>
          </div>
          
          {isLogin ? (
            <LoginForm onSwitchToRegister={handleSwitchToRegister} />
          ) : (
            <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
          )}
        </div>
      </div>
    </div>
  );
}; 