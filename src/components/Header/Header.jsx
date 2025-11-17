
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.scss';

const Header = ({ cartCount }) => {
  const location = useLocation();

  return (
    <header className={`${styles.header} navbar navbar-expand-lg navbar-dark`}>
      <div className="container">
        <Link className={`${styles.logo} navbar-brand`} to="/">
          UTP Marketplace
        </Link>
        
        <button 
          className="navbar-toggler" 
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
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
              >
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/catalog' ? 'active' : ''}`} 
                to="/catalog"
              >
                Catálogo
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`} 
                to="/cart"
              >
                Carrito 
                {cartCount > 0 && (
                  <span className={styles.cartBadge}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;