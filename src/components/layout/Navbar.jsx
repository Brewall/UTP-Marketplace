// ============================================
// COMPONENTE NAVBAR
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCartContext } from '../../features/cart/context/CartContext';
import styles from './Navbar.module.scss';
import { FaShoppingCart, FaBox, FaPlus, FaSignOutAlt, FaStore } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCartContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/bienvenida');
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark sticky-top ${styles.navbar}`}>
      <div className={`container ${styles.container}`}>
        <Link className={`navbar-brand ${styles.brand}`} to="/">
          <FaStore /> UTP Marketplace
        </Link>
        
        <button
          className={`navbar-toggler ${styles.toggler}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className={`navbar-nav ms-auto ${styles.navList}`}>
            <li className={styles.navItem}>
              <Link className={styles.navLink} to="/">
                Catálogo
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link className={styles.navLink} to="/publicar">
                <FaPlus /> Publicar
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link className={styles.navLink} to="/carrito">
                <FaShoppingCart /> Carrito
                {totalItems > 0 && (
                  <span className={styles.badge}>{totalItems}</span>
                )}
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link className={styles.navLink} to="/mis-ordenes">
                <FaBox /> Mis Órdenes
              </Link>
            </li>
            {user && (
              <>
                <li className={styles.navItem}>
                  <span className={styles.userInfo}>
                    <i className="bi bi-person-circle"></i>
                    {user.name}
                  </span>
                </li>
                <li className={styles.navItem}>
                  <button
                    className={styles.logoutBtn}
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt /> Salir
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
