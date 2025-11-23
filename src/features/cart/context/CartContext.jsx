// ============================================
// CART CONTEXT - UTP Marketplace
// Manejo de estado del carrito (localStorage + derivaciones)
// ============================================
import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';

const CartContext = createContext(null);

const STORAGE_KEY_PREFIX = 'utp_marketplace_cart_';

const initialState = {
  items: [] // { id, name, price, quantity, image }
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(i => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map(i => 
            i.id === action.payload.id 
              ? { ...i, quantity: i.quantity + action.payload.quantity, maxStock: action.payload.maxStock || i.maxStock } 
              : i
          )
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM': {
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    }
    case 'UPDATE_QTY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== id) };
      }
      return {
        ...state,
        items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
      };
    }
    case 'CLEAR': {
      return { ...state, items: [] };
    }
    case 'SET': {
      return { ...state, items: action.payload };
    }
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const storageKey = user ? `${STORAGE_KEY_PREFIX}${user.id || user.email}` : null;

  // Cargar desde localStorage al iniciar sesión
  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'SET', payload: parsed });
        }
      }
    } catch (e) {
      console.warn('No se pudo cargar carrito:', e);
    }
  }, [storageKey]);

  // Persistir cambios en localStorage
  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.items));
    } catch (e) {
      console.warn('No se pudo guardar carrito:', e);
    }
  }, [state.items, storageKey]);

  const addItem = (product, quantity = 1) => {
    if (!product || !product.id) return;
    
    // Validar disponibilidad de stock
    if (product.stock !== undefined && product.stock <= 0) {
      console.warn('Producto sin stock disponible');
      return;
    }
    
    // Validar que no se exceda el stock disponible
    const existingItem = state.items.find(i => i.id === product.id);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const maxAllowed = product.stock || 999;
    
    if (currentQty + quantity > maxAllowed) {
      console.warn(`Solo hay ${maxAllowed} unidades disponibles`);
      return;
    }
    
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.title, // mantener 'name' interno para compatibilidad con UI existente
        price: product.price,
        image: product.imageUrl,
        quantity,
        maxStock: product.stock || 999 // Guardar stock máximo disponible
      }
    });
  };

  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  
  const updateQuantity = (id, quantity) => {
    // Validar contra el stock máximo guardado en el item
    const item = state.items.find(i => i.id === id);
    if (item && item.maxStock && quantity > item.maxStock) {
      console.warn(`Solo hay ${item.maxStock} unidades disponibles`);
      dispatch({ type: 'UPDATE_QTY', payload: { id, quantity: item.maxStock } });
      return;
    }
    dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } });
  };
  
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const derived = useMemo(() => {
    const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
    const totalPrice = state.items.reduce((acc, i) => acc + i.quantity * i.price, 0);
    return { totalItems, totalPrice };
  }, [state.items]);

  const value = {
    items: state.items,
    ...derived,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext debe usarse dentro de CartProvider');
  return ctx;
};

export default CartContext;
