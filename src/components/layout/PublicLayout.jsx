// ============================================
// LAYOUT PÚBLICO SEGURO PARA ROUTER
// ============================================

import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import styles from './Layout.module.scss';

export default function PublicLayout() {
  const location = useLocation();
  const path = location.pathname;

  // Rutas que deben verse más anchas
  const isWideLanding = path === '/bienvenida' || path === '/ingresar';

  return (
    <div className={styles.layout}>
      <main
        className={
          isWideLanding
            ? `${styles.publicMain} ${styles.wide}`
            : `${styles.publicMain} ${styles.centered}`
        }
      >
        {/* Outlet SIEMPRE se renderiza igual */}
        <div className={isWideLanding ? styles.fullWidthWrapper : styles.container}>
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}

