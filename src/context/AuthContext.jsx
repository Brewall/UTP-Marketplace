// ============================================
// AUTH CONTEXT - UTP Marketplace
// Contexto global de autenticación
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

// ============================================
// CREAR CONTEXTO
// ============================================

const AuthContext = createContext(undefined);

// ============================================
// HOOK PERSONALIZADO PARA CONSUMIR EL CONTEXTO
// ============================================

/**
 * Hook personalizado para acceder al contexto de autenticación
 * Uso: const { user, login, logout, loading } = useAuth();
 * @throws {Error} Si se usa fuera del AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

// ============================================
// COMPONENTE PROVIDER
// ============================================

/**
 * Provider del contexto de autenticación
 * Envuelve la aplicación para proveer estado de auth global
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================
  // INICIALIZACIÓN: Restaurar sesión al cargar
  // ============================================
  
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Intentar obtener usuario del sessionStorage
        const currentUser = authService.getCurrentUser();
        
        if (currentUser) {
          console.log(' Sesión restaurada:', currentUser.email);
          setUser(currentUser);
        } else {
          console.log(' No hay sesión activa');
        }
      } catch (error) {
        console.error(' Error al inicializar autenticación:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ============================================
  // FUNCIONES DE AUTENTICACIÓN
  // ============================================

  /**
   * Inicia sesión de un usuario
   * @param {string} email - Correo institucional
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} - Usuario autenticado
   */
  const login = async (email, password) => {
    try {
      setLoading(true);

      // Llamar al servicio de autenticación
      const authenticatedUser = await authService.login(email, password);

      // Actualizar estado
      setUser(authenticatedUser);

      console.log(' Login exitoso:', authenticatedUser.email);

      return authenticatedUser;
    } catch (error) {
      console.error(' Error en login:', error.message);
      throw error; // Re-lanzar para que el componente pueda manejarlo
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cierra la sesión del usuario actual
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      setLoading(true);

      // Llamar al servicio de autenticación
      await authService.logout();

      // Limpiar estado
      setUser(null);

      console.log(' Logout exitoso');
    } catch (error) {
      console.error(' Error en logout:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registra un nuevo usuario
   * @param {string} email - Correo institucional
   * @param {string} password - Contraseña
   * @param {string} name - Nombre completo
   * @returns {Promise<Object>} - Usuario registrado
   */
  const register = async (email, password, name) => {
    try {
      setLoading(true);

      // Llamar al servicio de autenticación
      const newUser = await authService.register(email, password, name);

      // Actualizar estado (auto-login después del registro)
      setUser(newUser);

      console.log(' Registro exitoso:', newUser.email);

      return newUser;
    } catch (error) {
      console.error(' Error en registro:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza la información del usuario
   * @param {Object} updates - Datos a actualizar
   */
  const updateUser = (updates) => {
    if (!user) {
      console.warn(' No hay usuario para actualizar');
      return;
    }

    const updatedUser = { ...user, ...updates };
    
    // Actualizar en sessionStorage
    sessionStorage.setItem('utp_marketplace_auth', JSON.stringify(updatedUser));
    
    // Actualizar estado
    setUser(updatedUser);

    console.log(' Usuario actualizado');
  };

  // ============================================
  // VALOR DEL CONTEXTO
  // ============================================

  const value = {
    // Estado
    user,                           // Usuario actual (null si no autenticado)
    loading,                        // Estado de carga
    isAuthenticated: !!user,        // Boolean: ¿está autenticado?
    
    // Funciones
    login,                          // Iniciar sesión
    logout,                         // Cerrar sesión
    register,                       // Registrar nuevo usuario
    updateUser                      // Actualizar datos del usuario
  };

  // ============================================
  // RENDERIZADO
  // ============================================

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// EXPORTACIÓN POR DEFECTO
// ============================================

export default AuthContext;
