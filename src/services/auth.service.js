// ============================================
// AUTH SERVICE - UTP Marketplace
// Servicio de autenticación simulada
// ============================================

import { isValidUTPEmail, isValidPassword } from '../utils/validators';

// Expresión regular estricta para correos institucionales UTP
const UTP_EMAIL_REGEX = /^[a-zA-Z0-9._-]+@utp\.edu\.pe$/;

// Clave para sessionStorage
const AUTH_STORAGE_KEY = 'utp_marketplace_auth';

/**
 * Servicio de autenticación
 * Simula un sistema de login sin backend real
 */
const authService = {
  /**
   * Inicia sesión de un usuario
   * @param {string} email - Correo institucional
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} - Usuario autenticado
   */
  login: async (email, password) => {
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 300));

    if (!email || !UTP_EMAIL_REGEX.test(email)) {
      throw new Error('Utiliza tu correo institucional @utp.edu.pe');
    }

    // Si se suministra contraseña y deseas validarla, mantener lógica anterior opcional
    if (password && !isValidPassword(password)) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const studentCode = email.split('@')[0];
    const user = {
      id: studentCode,
      email,
      name: studentCode,
      institution: 'UTP',
      role: 'student',
      createdAt: new Date().toISOString()
    };

    // Persistir bajo clave del servicio y una clave genérica usada por router loader
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    sessionStorage.setItem('utp_user', JSON.stringify(user));

    return user;
  },

  /**
   * Cierra la sesión del usuario actual
   * @returns {Promise<void>}
   */
  logout: async () => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));

    // Limpiar sessionStorage
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  },

  /**
   * Obtiene el usuario actualmente autenticado
   * @returns {Object|null} - Usuario autenticado o null
   */
  getCurrentUser: () => {
    try {
      const userJson = sessionStorage.getItem(AUTH_STORAGE_KEY);
      
      if (!userJson) {
        return null;
      }

      return JSON.parse(userJson);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  },

  /**
   * Verifica si hay un usuario autenticado
   * @returns {boolean} - true si hay sesión activa
   */
  isAuthenticated: () => {
    return authService.getCurrentUser() !== null;
  },

  /**
   * Registra un nuevo usuario (simulado)
   * En un sistema real, esto haría una llamada al backend
   * @param {string} email - Correo institucional
   * @param {string} password - Contraseña
   * @param {string} name - Nombre completo
   * @returns {Promise<Object>} - Usuario registrado
   */
  register: async (email, password, name) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    // Validaciones
    if (!isValidUTPEmail(email)) {
      throw new Error('Correo institucional inválido');
    }

    if (!isValidPassword(password)) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    if (!name || name.trim().length < 3) {
      throw new Error('El nombre debe tener al menos 3 caracteres');
    }

    // Verificar si el usuario ya existe (simulado)
    const existingUsers = JSON.parse(
      localStorage.getItem('utp_marketplace_users') || '[]'
    );

    const userExists = existingUsers.some(u => u.email === email);

    if (userExists) {
      throw new Error('Este correo ya está registrado');
    }

    // Crear nuevo usuario
    const studentCode = email.split('@')[0];
    const newUser = {
      id: studentCode,
      email: email,
      name: name.trim(),
      code: studentCode.toUpperCase(),
      institution: email.includes('utp.edu.pe') ? 'UTP' : 'Autónoma',
      role: 'student',
      createdAt: new Date().toISOString()
    };

    // Guardar en localStorage (simulando DB)
    existingUsers.push(newUser);
    localStorage.setItem('utp_marketplace_users', JSON.stringify(existingUsers));

    // Auto-login después del registro
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));

    return newUser;
  }
};

export default authService;
