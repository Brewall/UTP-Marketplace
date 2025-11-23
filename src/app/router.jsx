// ============================================
// CONFIGURACIÓN REACT ROUTER
// ============================================

import { createBrowserRouter, redirect } from 'react-router-dom';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import AppLayout from '../components/layout/AppLayout';

// Páginas Públicas y Autenticación
import WelcomePage from '../features/public/WelcomePage';
import LoginPage from '../features/auth/LoginPage';

// Páginas de Catálogo
import CatalogPage from '../features/catalog/CatalogPage';

// Páginas de Producto
import ProductDetailPage from '../features/product/ProductDetailPage';
import ProductFormPage from '../features/product/ProductFormPage';
// Páginas de Carrito
import CartPage from '../features/cart/pages/CartPage';
// Páginas de Órdenes
import MyOrdersPage from '../features/orders/pages/MyOrdersPage';

// ============================================
// CONFIGURACIÓN DEL ROUTER
// ============================================

// Loader para rutas protegidas: verifica la sesión en sessionStorage
function requireAuth() {
  const stored = sessionStorage.getItem('utp_user');
  if (!stored) {
    return redirect('/bienvenida');
  }
  return null; // permitido
}

export const router = createBrowserRouter([
  // ========== RUTAS PÚBLICAS ==========
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        path: 'bienvenida',
        element: <WelcomePage />
      },
      {
        path: 'ingresar',
        element: <LoginPage />
      }
    ]
  },

  // ========== RUTAS PROTEGIDAS (APP) ==========
  {
    path: '/',
    element: <AppLayout />,
    loader: requireAuth,
    children: [
      {
        index: true,
        element: <CatalogPage />
      },
      {
        path: 'producto/:id',
        element: <ProductDetailPage />
      },
      {
        path: 'publicar',
        element: <ProductFormPage />
      }
      ,
      {
        path: 'carrito',
        element: <CartPage />
      },
      {
        path: 'mis-ordenes',
        element: <MyOrdersPage />
      }
    ]
  }
]);
