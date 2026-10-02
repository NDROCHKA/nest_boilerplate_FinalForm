import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types/product.types';
import { STORAGE_KEYS } from '../utils/constants';

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  effectivePrice: number;
  discountPercent: number | null;
  imageUrl: string | null;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  maxStock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, quantity: number) => void;
  removeItem: (productId: number, size: string, color: string) => void;
  updateQuantity: (productId: number, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart data from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage on item change
  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(newItems));
  };

  const addItem = (product: Product, size: string, color: string, quantity: number) => {
    const existingIndex = items.findIndex(
      (item) =>
        item.productId === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    const imageUrl = product.images && product.images.length > 0
      ? [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)[0].url
      : null;

    if (existingIndex > -1) {
      const updated = [...items];
      const newQty = updated[existingIndex].quantity + quantity;
      
      // Stock boundary check
      updated[existingIndex].quantity = Math.min(newQty, product.stock);
      saveCart(updated);
    } else {
      const newItem: CartItem = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        effectivePrice: product.effectivePrice,
        discountPercent: product.discountPercent,
        imageUrl,
        selectedSize: size,
        selectedColor: color,
        quantity: Math.min(quantity, product.stock),
        maxStock: product.stock,
      };
      saveCart([...items, newItem]);
    }

    // Automatically slide open cart drawer when item is added
    openCart();
  };

  const removeItem = (productId: number, size: string, color: string) => {
    const filtered = items.filter(
      (item) =>
        !(item.productId === productId &&
          item.selectedSize === size &&
          item.selectedColor === color)
    );
    saveCart(filtered);
  };

  const updateQuantity = (productId: number, size: string, color: string, quantity: number) => {
    const updated = items.map((item) => {
      if (
        item.productId === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
      ) {
        // Enforce boundary check [1, maxStock]
        const newQty = Math.max(1, Math.min(quantity, item.maxStock));
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  
  const totalAmount = parseFloat(
    items.reduce((acc, item) => acc + item.effectivePrice * item.quantity, 0).toFixed(2)
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
