// ============================================
// MY ORDERS PAGE - UTP Marketplace
// ============================================
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ordersService } from '../services/orders.service';
import { formatCurrency } from '@/utils/formatters';
import { useLocation } from 'react-router-dom';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const location = useLocation();
  const highlightId = location.state?.highlight;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const list = await ordersService.getAll(user?.id || user?.email);
      setOrders(list);
      setLoading(false);
    };
    load();
  }, [user]);

  if (!user) return <p>Debes iniciar sesión.</p>;

  if (loading) return <p>Cargando órdenes...</p>;

  if (!orders.length) {
    return <div className="text-center py-5"><h2 className="h5 mb-2">No tienes órdenes todavía</h2><p className="text-muted mb-3 small">Compra productos para ver tu historial aquí.</p></div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <h5 className="mb-0">Mis Órdenes</h5>
      </div>
      <ul className="list-group list-group-flush">
        {orders.map(order => (
          <li key={order.id} className={`list-group-item ${order.id === highlightId ? 'bg-light' : ''}`}> 
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Orden #{order.id.slice(0,6)}</strong>
                <div className="small text-muted">{new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <span className="fw-semibold text-danger">{formatCurrency(order.total)}</span>
            </div>
            <div className="mt-2 small text-muted">
              {order.items.map(it => it.name).join(', ')}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
