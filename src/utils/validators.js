// ============================================
// VALIDATORS - UTP Marketplace
// Funciones de validación reutilizables
// ============================================

/**
 * Valida si un correo electrónico es válido para UTP/Autónoma
 * Formato esperado: u + 8-9 dígitos + @utp.edu.pe o @autonoma.pe
 * Ejemplos válidos:
 * - u12345678@utp.edu.pe
 * - u123456789@autonoma.pe
 * 
 * @param {string} email - Correo a validar
 * @returns {boolean} - true si es válido, false si no
 */
export const isValidUTPEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Regex: Empieza con 'u', seguido de 8-9 dígitos, termina en @utp.edu.pe o @autonoma.pe
  const utpEmailRegex = /^u\d{8,9}@(utp\.edu\.pe|autonoma\.pe)$/;
  
  return utpEmailRegex.test(email.toLowerCase().trim());
};

/**
 * Valida si una contraseña cumple con requisitos mínimos
 * @param {string} password - Contraseña a validar
 * @returns {boolean} - true si es válida
 */
export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') {
    return false;
  }
  
  // Mínimo 6 caracteres para el mock
  return password.length >= 6;
};

/**
 * Valida si un precio es válido
 * @param {number} price - Precio a validar
 * @returns {boolean} - true si es válido
 */
export const isValidPrice = (price) => {
  return typeof price === 'number' && price > 0 && price <= 10000;
};

/**
 * Valida si un texto no está vacío
 * @param {string} text - Texto a validar
 * @param {number} minLength - Longitud mínima (default: 3)
 * @returns {boolean} - true si es válido
 */
export const isValidText = (text, minLength = 3) => {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  return text.trim().length >= minLength;
};

/**
 * Sanitiza HTML básico (prevenir XSS)
 * @param {string} text - Texto a sanitizar
 * @returns {string} - Texto sin tags HTML
 */
export const sanitizeHTML = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text.replace(/<[^>]*>/g, '');
};
