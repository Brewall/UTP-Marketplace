// ============================================
// LAYOUT DE APLICACIÓN
// Layout para páginas autenticadas (Dashboard, Catálogo, etc)
// ============================================

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from './Layout.module.scss';

export default function AppLayout() {
  const { user, loading } = useAuth();

  // Mientras carga, mostrar un spinner
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}>
          <div className={styles.spinnerIcon} role="status"></div>
          <p>Cargando UTP Marketplace...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, redirigir a bienvenida
  if (!user) {
    return <Navigate to="/bienvenida" replace />;
  }

  return (
    <div className={styles.layout}>
      {/* Barra de navegación */}
      <Navbar />

      {/* Contenido principal */}
      <main className={styles.appMain}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
