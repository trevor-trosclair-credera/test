import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { Cart } from '../types';
import * as api from '../api/client';

interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = () => !!localStorage.getItem('token');

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn()) return;
    setLoading(true);
    try {
      const res = await api.getCart();
      setCart(res.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: number, quantity: number) => {
    await api.addToCart(productId, quantity);
    await fetchCart();
  };

  const updateItem = async (itemId: number, quantity: number) => {
    await api.updateCartItem(itemId, quantity);
    await fetchCart();
  };

  const removeItem = async (itemId: number) => {
    await api.removeCartItem(itemId);
    await fetchCart();
  };

  const clearCart = async () => {
    await api.clearCart();
    setCart(null);
  };

  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, loading, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
