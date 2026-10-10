import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Cart, CartItem } from '../types';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';
import { STATIC_PRODUCTS } from '../lib/catalogData';

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
  isMutating: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMutating, setIsMutating] = useState<boolean>(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setIsLoading(true);
      const data = await api.cart.get();
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const addItem = async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated) return;
    try {
      setIsMutating(true);
      const updatedCart = await api.cart.addItem(productId, quantity);
      setCart(updatedCart);
    } catch (err) {
      console.warn('Backend cart sync failed, applying local fallback:', err);
      const prod = STATIC_PRODUCTS.find((p) => p.id === productId);
      if (prod) {
        setCart((prev) => {
          const currentItems = prev ? [...prev.items] : [];
          const existingIndex = currentItems.findIndex((i) => i.product.id === productId);
          if (existingIndex > -1) {
            const nextQty = currentItems[existingIndex].quantity + quantity;
            currentItems[existingIndex] = {
              ...currentItems[existingIndex],
              quantity: nextQty,
              subtotal: nextQty * prod.price,
            };
          } else {
            currentItems.push({
              id: `local-item-${productId}`,
              quantity,
              subtotal: quantity * prod.price,
              product: prod,
            });
          }
          const totalItems = currentItems.reduce((sum, item) => sum + item.quantity, 0);
          const subtotal = currentItems.reduce((sum, item) => sum + item.subtotal, 0);
          return {
            id: prev?.id || 'local-cart',
            items: currentItems,
            totalItems,
            subtotal,
          };
        });
      }
    } finally {
      setIsMutating(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated) return;
    try {
      setIsMutating(true);
      if (quantity <= 0) {
        const updatedCart = await api.cart.removeItem(productId);
        setCart(updatedCart);
      } else {
        const updatedCart = await api.cart.updateQuantity(productId, quantity);
        setCart(updatedCart);
      }
    } catch (err) {
      console.warn('Backend cart update failed, applying local fallback:', err);
      setCart((prev) => {
        if (!prev) return null;
        let currentItems = [...prev.items];
        if (quantity <= 0) {
          currentItems = currentItems.filter((i) => i.product.id !== productId);
        } else {
          currentItems = currentItems.map((item) => {
            if (item.product.id === productId) {
              return {
                ...item,
                quantity,
                subtotal: quantity * item.product.price,
              };
            }
            return item;
          });
        }
        const totalItems = currentItems.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = currentItems.reduce((sum, item) => sum + item.subtotal, 0);
        return {
          ...prev,
          items: currentItems,
          totalItems,
          subtotal,
        };
      });
    } finally {
      setIsMutating(false);
    }
  };

  const removeItem = async (productId: string) => {
    if (!isAuthenticated) return;
    try {
      setIsMutating(true);
      const updatedCart = await api.cart.removeItem(productId);
      setCart(updatedCart);
    } catch (err) {
      console.warn('Backend cart remove failed, applying local fallback:', err);
      setCart((prev) => {
        if (!prev) return null;
        const currentItems = prev.items.filter((i) => i.product.id !== productId);
        const totalItems = currentItems.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = currentItems.reduce((sum, item) => sum + item.subtotal, 0);
        return {
          ...prev,
          items: currentItems,
          totalItems,
          subtotal,
        };
      });
    } finally {
      setIsMutating(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    try {
      setIsMutating(true);
      await api.cart.clear();
      setCart({
        id: cart?.id || '',
        items: [],
        totalItems: 0,
        subtotal: 0,
      });
    } finally {
      setIsMutating(false);
    }
  };

  const getItemQuantity = (productId: string): number => {
    if (!cart || !cart.items) return 0;
    const item = cart.items.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const items = cart?.items || [];
  const totalItems = cart?.totalItems || 0;
  const subtotal = cart?.subtotal || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        totalItems,
        subtotal,
        isLoading,
        isMutating,
        fetchCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
