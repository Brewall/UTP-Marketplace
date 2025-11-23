// ============================================
// CART PAGE - UTP Marketplace
// ============================================
import React, { useState } from 'react';
import useCart from '../hooks/useCart';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ordersService } from '@/features/orders/services/orders.service';

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validar que ningún ítem exceda su stock
      const invalidItems = items.filter(item => item.maxStock && item.quantity > item.maxStock);
      if (invalidItems.length > 0) {
        setError(`Algunos productos exceden el stock disponible. Verifica las cantidades.`);
        setLoading(false);
        return;
      }
      
      const order = await ordersService.create(user.id || user.email, items);
      clearCart();
      navigate('/mis-ordenes', { state: { highlight: order.id } });
    } catch (e) {
      setError(e.message || 'Error al crear la orden');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="text-center py-5">
        <h2 className="h4 mb-3">Tu carrito está vacío</h2>
        <p className="text-muted mb-4">Agrega productos desde el catálogo.</p>
        <Link to="/" className="btn btn-danger">Ir al Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-lg-8 mb-4 mb-lg-0">
        <div className="card shadow-sm">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Carrito ({totalItems} items)</h5>
            <button className="btn btn-sm btn-outline-danger" onClick={clearCart}>Vaciar</button>
          </div>
          <ul className="list-group list-group-flush">
            {items.map(item => (
              <li key={item.id} className="list-group-item d-flex align-items-center gap-3">
                <img src={item.image} alt={item.name} style={{width: 64, height: 64, objectFit: 'cover', borderRadius: 8}} />
                <div className="flex-grow-1">
                  <strong className="d-block mb-1" style={{fontSize: '.9rem'}}>{item.name}</strong>
                  <span className="text-muted" style={{fontSize: '.8rem'}}>S/ {item.price.toFixed(2)}</span>
                  {item.maxStock && (
                    <span className="d-block text-muted" style={{fontSize: '.75rem'}}>Stock: {item.maxStock}</span>
                  )}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={item.maxStock || 999}
                    value={item.quantity}
                    onChange={e => {
                      const val = parseInt(e.target.value, 10) || 1;
                      const maxAllowed = item.maxStock || 999;
                      updateQuantity(item.id, Math.min(val, maxAllowed));
                    }}
                    className="form-control form-control-sm"
                    style={{width: 70}}
                  />
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => removeItem(item.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Resumen</h5>
            <p className="mb-1 d-flex justify-content-between"><span>Items:</span><span>{totalItems}</span></p>
            <p className="mb-3 d-flex justify-content-between fw-semibold"><span>Total:</span><span>S/ {totalPrice.toFixed(2)}</span></p>
            {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
            <button 
              className="btn btn-danger w-100" 
              onClick={handleCheckout} 
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Finalizar Compra'}
            </button>
            <Link to="/" className="btn btn-link w-100 mt-2 small">Seguir Comprando</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
