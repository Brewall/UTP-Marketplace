// ============================================
// LAYOUT PÚBLICO
// Layout para páginas públicas (Bienvenida, Ingreso)
// ============================================

import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import styles from './Layout.module.scss';

export default function PublicLayout() {
  const location = useLocation();
  const path = location.pathname;
  const isWideLanding = path === '/bienvenida' || path === '/ingresar';

  return (
    <div className={styles.layout}>
      {/* Contenido principal */}
      <main className={`${styles.publicMain} ${isWideLanding ? styles.wide : styles.centered}`}>
        {isWideLanding ? (
          // Para la landing permitimos ancho completo sin el contenedor que limita el layout
          <Outlet />
        ) : (
          <div className={styles.container}>
            <Outlet />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
