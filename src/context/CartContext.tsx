
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  isCartLoaded: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

const CART_STORAGE_KEY = "jewellery-store-cart";

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Load saved cart after the component mounts.
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsedCart: unknown = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart as CartItem[]);
        }
      }
    } catch (error) {
      console.error("Unable to load cart:", error);
    } finally {
      setIsCartLoaded(true);
    }
  }, []);

  // Save cart whenever it changes.
  useEffect(() => {
    if (!isCartLoaded) return;

    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Unable to save cart:", error);
    }
  }, [cartItems, isCartLoaded]);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      if (!product.inStock || quantity < 1) return;

      setCartItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          return currentItems.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  product,
                  quantity: item.quantity + quantity,
                }
              : item
          );
        }

        return [
          ...currentItems,
          {
            product,
            quantity,
          },
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.product.id !== productId
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        removeFromCart(productId);
        return;
      }

      setCartItems((currentItems) =>
        currentItems.map((item) =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [cartItems]
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + item.product.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      subtotal,
      isCartLoaded,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [
      cartItems,
      cartCount,
      subtotal,
      isCartLoaded,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider"
    );
  }

  return context;
}
