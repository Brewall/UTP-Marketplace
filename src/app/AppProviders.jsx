// ============================================
// APP PROVIDERS - UTP Marketplace
// Centraliza todos los Context Providers
// ============================================

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../features/cart/context/CartContext';

/**
 * Componente que agrupa todos los providers de la aplicación
 * Esto facilita mantener el código limpio en App.jsx
 * 
 * Orden recomendado (de exterior a interior):
 * 1. AuthProvider (más general)
 * 2. CartProvider (depende de Auth)
 * 3. Otros providers futuros...
 */
const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
};

export default AppProviders;
