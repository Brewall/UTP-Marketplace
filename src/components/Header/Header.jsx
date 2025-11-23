import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CartCounter from '../CartCounter/CartCounter'; // ← IMPORTAR DESDE LA CARPETA
import styles from './Header.module.scss';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`${styles.header} navbar navbar-expand-lg navbar-dark`}>
      <div className="container">
        <Link className={`${styles.logo} navbar-brand`} to="/" onClick={closeMenu}>
          <div className={styles.logoCircle}>
            <img 
              src="/logo-utp.jpg" 
              alt="UTP Marketplace"
              className={styles.logoImage}
            />
          </div>
        </Link>
        
        <button 
          className={`navbar-toggler ${styles.navbarToggler}`}
          type="button" 
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.hamburger}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        
        <div className={`${styles.navbarCollapse} ${isMenuOpen ? styles.show : ''}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
                onClick={closeMenu}
              >
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/catalog' ? 'active' : ''}`} 
                to="/catalog"
                onClick={closeMenu}
              >
                Catálogo
              </Link>
            </li>
            <li className="nav-item">
              {/* USAR CartCounter aquí */}
              <CartCounter />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;