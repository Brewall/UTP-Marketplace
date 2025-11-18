import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hook/useCart';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from './Cart.module.scss';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const applyCoupon = () => {
    const coupons = {
      'UTP10': 0.1,
      'STUDENT15': 0.15,
      'WELCOME20': 0.2
    };

    const couponValue = coupons[couponCode.toUpperCase()];
    
    if (couponValue) {
      setDiscount(couponValue);
      setCouponApplied(true);
    } else {
      alert('Código de cupón inválido. Códigos disponibles: UTP10, STUDENT15, WELCOME20');
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setCouponApplied(false);
    setCouponCode('');
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop';
  };

  // Cálculos
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discount;
  const totalBeforeShipping = subtotal - discountAmount;
  const shipping = totalBeforeShipping > 50 || cartItems.length === 0 ? 0 : 5.99;
  const total = totalBeforeShipping + shipping;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.cart}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Mi Carrito</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Inicio</Link>
                  </li>
                  <li className="breadcrumb-item active">Carrito</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="row">
            <div className="col-12">
              <div className={styles.emptyCart}>
                <div className={styles.emptyCartIcon}>
                  <i className="bi bi-cart-x" style={{fontSize: '4rem'}}></i>
                </div>
                <h2>Tu carrito está vacío</h2>
                <p>¡Descubre productos increíbles en nuestro catálogo!</p>
                <div className={styles.emptyCartButtons}>
                  <Link to="/catalog" className="btn btn-primary btn-lg">
                    Explorar Catálogo
                  </Link>
                  <Link to="/" className="btn btn-outline-secondary btn-lg">
                    Volver al Inicio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            {/* Lista de Productos */}
            <div className="col-lg-8">
              <div className={styles.cartItems}>
                <div className={styles.cartHeader}>
                  <h3>Productos en el Carrito ({cartItems.length})</h3>
                  <button 
                    className={`btn btn-outline-danger ${styles.clearCartBtn}`}
                    onClick={clearCart}
                  >
                    <i className="bi bi-trash"></i> Vaciar Carrito
                  </button>
                </div>

                {cartItems.map((item, index) => (
                  <div 
                    key={`${item.id}-${index}`} 
                    className={`${styles.cartItem} fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={styles.itemImage}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        onError={handleImageError}
                      />
                    </div>
                    
                    <div className={styles.itemDetails}>
                      <h4 className={styles.itemName}>{item.name}</h4>
                      <p className={styles.itemDescription}>{item.description}</p>
                      <div className={styles.itemMeta}>
                        <span className={styles.seller}><i className="bi bi-person"></i> {item.seller}</span>
                        <span className={styles.condition}><i className="bi bi-box-seam"></i> {item.condition}</span>
                        {item.rating && (
                          <span className={styles.rating}><i className="bi bi-star-fill"></i> {item.rating}</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.itemPrice}>
                      <span className={styles.priceLabel}>Precio unitario:</span>
                      <span className={styles.priceValue}>${item.price}</span>
                    </div>

                    <div className={styles.itemQuantity}>
                      <span className={styles.quantityLabel}>Cantidad:</span>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityBtn}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          className={styles.quantityBtn}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className={styles.itemTotal}>
                      <span className={styles.totalLabel}>Total:</span>
                      <span className={styles.totalValue}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>

                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Eliminar producto"
                      title="Eliminar producto"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen del Pedido */}
            <div className="col-lg-4">
              <div className={styles.orderSummary}>
                <h3 className={styles.summaryTitle}>Resumen del Pedido</h3>
                
                <div className={styles.summaryDetails}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} productos):</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className={styles.summaryRow}>
                      <span>
                        Descuento ({couponCode.toUpperCase()}):
                        <button 
                          className={styles.removeCouponBtn}
                          onClick={removeCoupon}
                          title="Remover cupón"
                        >
                          ×
                        </button>
                      </span>
                      <span className={styles.discount}>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className={styles.summaryRow}>
                    <span>Costo de envío:</span>
                    <span>
                      {shipping === 0 ? (
                        <span className={styles.freeShipping}><i className="bi bi-gift"></i> Gratis</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {shipping > 0 && (
                    <div className={styles.shippingNote}>
                      <small><i className="bi bi-gift"></i> ¡Agrega ${(50 - totalBeforeShipping).toFixed(2)} más para envío gratis!</small>
                    </div>
                  )}
                  
                  <hr />
                  
                  <div className={`${styles.summaryRow} ${styles.total}`}>
                    <span>
                      <strong>Total a pagar:</strong>
                    </span>
                    <span>
                      <strong>${total.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>

                {/* Cupón de Descuento */}
                {!couponApplied && (
                  <div className={styles.couponSection}>
                    <h4><i className="bi bi-ticket-perforated"></i> Cupón de Descuento</h4>
                    <div className={styles.couponInput}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ingresa tu código"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                      />
                      <button 
                        className="btn btn-outline-primary"
                        onClick={applyCoupon}
                        disabled={!couponCode.trim()}
                      >
                        Aplicar
                      </button>
                    </div>
                    <small className={styles.couponHint}>
                      <strong>Códigos disponibles:</strong><br/>
                      UTP10 - 10% descuento<br/>
                      STUDENT15 - 15% descuento<br/>
                      WELCOME20 - 20% descuento
                    </small>
                  </div>
                )}

                {/* Botones de Acción */}
                <div className={styles.actionButtons}>
                  <button className={`btn btn-primary btn-lg ${styles.checkoutBtn}`}>
                    <i className="bi bi-credit-card"></i> Proceder al Pago
                  </button>
                  <Link to="/catalog" className={`btn btn-outline-secondary ${styles.continueBtn}`}>
                    <i className="bi bi-shop"></i> Seguir Comprando
                  </Link>
                </div>

                {/* Información Adicional */}
                <div className={styles.additionalInfo}>
                  <div className={styles.infoItem}>
                    <i className={`bi bi-truck ${styles.infoIcon}`}></i>
                    <div>
                      <strong>Envío Gratis</strong>
                      <p>En compras mayores a $50</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <i className={`bi bi-shield-lock ${styles.infoIcon}`}></i>
                    <div>
                      <strong>Pago Seguro</strong>
                      <p>Transacciones protegidas SSL</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <i className={`bi bi-arrow-repeat ${styles.infoIcon}`}></i>
                    <div>
                      <strong>Devoluciones</strong>
                      <p>30 días de garantía</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <i className={`bi bi-building ${styles.infoIcon}`}></i>
                    <div>
                      <strong>Recoge en Campus</strong>
                      <p>Sin costo adicional</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;