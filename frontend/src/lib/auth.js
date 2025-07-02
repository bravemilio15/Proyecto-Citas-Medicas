import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth } from "./firebase.js";

/**
 * Servicio de autenticación para manejar login, registro y logout
 */
export class AuthService {
  /**
   * Inicia sesión con email y contraseña
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} - Usuario autenticado
   */
  static async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        user: null,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  /**
   * Registra un nuevo usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @param {string} displayName - Nombre completo del usuario
   * @returns {Promise<Object>} - Usuario registrado
   */
  static async register(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar el perfil con el nombre completo
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      return {
        success: true,
        user: userCredential.user,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        user: null,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  /**
   * Cierra la sesión del usuario
   * @returns {Promise<Object>} - Resultado del logout
   */
  static async logout() {
    try {
      await signOut(auth);
      return {
        success: true,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  /**
   * Obtiene el usuario actual
   * @returns {Object|null} - Usuario actual o null si no hay sesión
   */
  static getCurrentUser() {
    return auth.currentUser;
  }

  /**
   * Escucha cambios en el estado de autenticación
   * @param {Function} callback - Función a ejecutar cuando cambie el estado
   * @returns {Function} - Función para cancelar la suscripción
   */
  static onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Convierte códigos de error de Firebase a mensajes legibles
   * @param {string} errorCode - Código de error de Firebase
   * @returns {string} - Mensaje de error en español
   */
  static getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'No existe una cuenta con este email',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-email': 'Email inválido',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/email-already-in-use': 'Ya existe una cuenta con este email',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/operation-not-allowed': 'Esta operación no está permitida',
      'auth/invalid-credential': 'Credenciales inválidas'
    };

    return errorMessages[errorCode] || 'Ocurrió un error inesperado';
  }
} 