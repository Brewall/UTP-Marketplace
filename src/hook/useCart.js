import { useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../services/localStorage';
export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  const getCartFromStorage = () => {
    try {
      const savedCart = getFromLocalStorage('cart');
      
      if (savedCart === 0 || savedCart === null || savedCart === undefined) {
        return [];
      }
      
      if (!Array.isArray(savedCart)) {
        console.warn('Cart data is not an array, returning empty array:', savedCart);
        return [];
      }
      
      return savedCart;
    } catch (error) {
      console.error('Error getting cart from storage:', error);
      return [];
    }
  };

  const updateCartCounter = (items) => {
    const safeItems = Array.isArray(items) ? items : [];
    const totalItems = safeItems.reduce((total, item) => total + (item.quantity || 0), 0);
    
    saveToLocalStorage('cartCount', totalItems);
    
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { count: totalItems, items: safeItems }
    }));
  };

  const addToCart = (product) => {
    const currentCart = getCartFromStorage();
    
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
    
    let updatedCart;
    if (existingItemIndex >= 0) {
      updatedCart = currentCart.map((item, index) =>
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + (product.quantity || 1) }
          : item
      );
    } else {
      updatedCart = [...currentCart, { ...product, quantity: product.quantity || 1 }];
    }
    
    setCartItems(updatedCart);
    saveToLocalStorage('cart', updatedCart);
    updateCartCounter(updatedCart);
    
    return updatedCart;
  };

  const removeFromCart = (productId) => {
    const currentCart = getCartFromStorage();
    const updatedCart = currentCart.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    saveToLocalStorage('cart', updatedCart);
    updateCartCounter(updatedCart);
    
    return updatedCart;
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      return removeFromCart(productId);
    }

    const currentCart = getCartFromStorage();
    const updatedCart = currentCart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    saveToLocalStorage('cart', updatedCart);
    updateCartCounter(updatedCart);
    
    return updatedCart;
  };

  const clearCart = () => {
    const emptyCart = [];
    setCartItems(emptyCart);
    saveToLocalStorage('cart', emptyCart);
    updateCartCounter(emptyCart);
    
    return emptyCart;
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  // Cargar el carrito al inicializar
  useEffect(() => {
    const savedCart = getCartFromStorage();
    setCartItems(savedCart);
    updateCartCounter(savedCart);
  }, []);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    updateCartCounter
  };
};