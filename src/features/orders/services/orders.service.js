// ============================================
// ORDERS SERVICE - UTP Marketplace
// Manejo de órdenes en LocalStorage (por usuario)
// ============================================
import { generateId } from '@/utils/formatters';
import { productService } from '@/services/products.service';

const STORAGE_PREFIX = 'utp_marketplace_orders_';

function getStorageKey(userId) {
  return `${STORAGE_PREFIX}${userId}`;
}

export const ordersService = {
  /** Obtener todas las órdenes del usuario */
  async getAll(userId) {
    if (!userId) return [];
    try {
      const raw = localStorage.getItem(getStorageKey(userId));
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('No se pudieron leer órdenes:', e);
      return [];
    }
  },

  /** Crear una nueva orden */
  async create(userId, items) {
    if (!userId) throw new Error('Usuario requerido');
    if (!Array.isArray(items) || items.length === 0) throw new Error('Carrito vacío');

    // Decrementar stock de cada producto
    for (const item of items) {
      try {
        const product = await productService.getById(item.id);
        const newStock = (product.stock || 1) - item.quantity;
        
        if (newStock <= 0) {
          // Si se agota, marcar como vendido o eliminar
          await productService.delete(item.id);
        } else {
          // Actualizar stock
          await productService.update(item.id, { stock: newStock });
        }
      } catch (e) {
        console.warn(`No se pudo actualizar stock del producto ${item.id}:`, e);
      }
    }

    const now = new Date();
    const order = {
      id: generateId(),
      userId,
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      total: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      status: 'created',
      createdAt: now.toISOString()
    };

    const existing = await ordersService.getAll(userId);
    const updated = [order, ...existing];
    localStorage.setItem(getStorageKey(userId), JSON.stringify(updated));
    return order;
  }
};

export default ordersService;