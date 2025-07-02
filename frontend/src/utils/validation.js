/**
 * Utilidades de validación para formularios
 */

/**
 * Valida si un email tiene formato válido
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido, false si no
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si una contraseña cumple con los requisitos mínimos
 * @param {string} password - Contraseña a validar
 * @returns {Object} - Objeto con isValid y message
 */
export const validatePassword = (password) => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'La contraseña debe tener al menos 6 caracteres'
    };
  }

  return {
    isValid: true,
    message: ''
  };
};

/**
 * Valida si un nombre completo es válido
 * @param {string} displayName - Nombre completo a validar
 * @returns {Object} - Objeto con isValid y message
 */
export const validateDisplayName = (displayName) => {
  if (!displayName || displayName.trim().length < 2) {
    return {
      isValid: false,
      message: 'El nombre debe tener al menos 2 caracteres'
    };
  }

  if (displayName.trim().length > 50) {
    return {
      isValid: false,
      message: 'El nombre no puede exceder 50 caracteres'
    };
  }

  return {
    isValid: true,
    message: ''
  };
};

/**
 * Valida un formulario de login
 * @param {Object} formData - Datos del formulario { email, password }
 * @returns {Object} - Objeto con isValid y errors
 */
export const validateLoginForm = (formData) => {
  const errors = {};

  // Validar email
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'El email es requerido';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Ingresa un email válido';
  }

  // Validar contraseña
  if (!formData.password || !formData.password.trim()) {
    errors.password = 'La contraseña es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valida un formulario de registro
 * @param {Object} formData - Datos del formulario { email, password, displayName }
 * @returns {Object} - Objeto con isValid y errors
 */
export const validateRegisterForm = (formData) => {
  const errors = {};

  // Validar nombre completo
  const nameValidation = validateDisplayName(formData.displayName);
  if (!nameValidation.isValid) {
    errors.displayName = nameValidation.message;
  }

  // Validar email
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'El email es requerido';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Ingresa un email válido';
  }

  // Validar contraseña
  const passwordValidation = validatePassword(formData.password);
  if (!formData.password || !formData.password.trim()) {
    errors.password = 'La contraseña es requerida';
  } else if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 