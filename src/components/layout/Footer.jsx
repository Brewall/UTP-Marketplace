// ============================================
// COMPONENTE FOOTER
// ============================================

import styles from './Footer.module.scss';
import { FaHeart, FaLinkedin, FaEnvelope, FaStore } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          {/* Sección 1: Información */}
          <div className={styles.section}>
            <h5><FaStore /> UTP Marketplace</h5>
            <p>
              Plataforma de compra y venta exclusiva para la comunidad UTP.
              Compra y vende de forma segura entre estudiantes.
            </p>
          </div>

          {/* Sección 2: Enlaces rápidos */}
          <div className={styles.section}>
            <h5>Enlaces Rápidos</h5>
            <ul className={styles.links}>
              <li><a href="/">Catálogo</a></li>
              <li><a href="/publicar">Publicar Producto</a></li>
              <li><a href="/mis-ordenes">Mis Órdenes</a></li>
              <li><a href="/carrito">Carrito</a></li>
            </ul>
          </div>

          {/* Sección 3: Contacto */}
          <div className={styles.section}>
            <h5>Contáctanos</h5>
            <p className="mb-2">Estamos aquí para ayudarte</p>
            <div className={styles.socialIcons}>
              <a href="mailto:soporte@utp.edu.pe" title="Email" aria-label="Email">
                <FaEnvelope />
              </a>
              <a href="https://www.linkedin.com/school/utp-peru/" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.copyright}>
          <p>
            © {currentYear} Universidad Tecnológica del Perú
          </p>
          <p>
            Hecho con <FaHeart className={styles.heart} /> por estudiantes UTP
          </p>
        </div>
      </div>
    </footer>
  );
}
