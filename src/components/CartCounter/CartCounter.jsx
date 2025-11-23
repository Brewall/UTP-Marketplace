import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFromLocalStorage } from '../../services/localStorage';
import styles from './CartCounter.module.scss';


const CartCounter = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const count = getFromLocalStorage('cartCount') || 0;
      setCartCount(count);
    };

    updateCartCount();

    const handleCartUpdate = (event) => {
      setCartCount(event.detail.count || 0);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  return (
    <Link to="/cart" className={styles.cartCounter}> {/* ← CAMBIAR div por Link */}
      <i className="bi bi-cart3"></i>
      Carrito
      {cartCount > 0 && (
        <span className={styles.cartBadge}>
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartCounter;