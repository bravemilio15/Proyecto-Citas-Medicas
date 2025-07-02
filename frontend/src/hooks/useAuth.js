import { useState, useEffect } from 'react';
import { AuthService } from '../lib/auth.js';

/**
 * Custom hook para manejar la autenticación
 * @returns {Object} - Estado y métodos de autenticación
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      setError(null);
    });

    // Cleanup al desmontar el componente
    return () => unsubscribe();
  }, []);

  /**
   * Inicia sesión con email y contraseña
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    const result = await AuthService.login(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  /**
   * Registra un nuevo usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @param {string} displayName - Nombre completo del usuario
   */
  const register = async (email, password, displayName) => {
    setLoading(true);
    setError(null);
    
    const result = await AuthService.register(email, password, displayName);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  /**
   * Cierra la sesión del usuario
   */
  const logout = async () => {
    setLoading(true);
    setError(null);
    
    const result = await AuthService.logout();
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  /**
   * Limpia el error actual
   */
  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user
  };
}; 