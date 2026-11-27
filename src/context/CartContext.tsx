
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
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

const STORAGE_KEY = "jewellery-store-cart";

const EMPTY_ITEMS: CartItem[] = [];

let cachedRaw: string | null | undefined;
let cachedItems: CartItem[] = EMPTY_ITEMS;

const listeners = new Set<() => void>();

function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") return false;

  const cartItem = item as CartItem;

  return (
    !!cartItem.product &&
    typeof cartItem.product.id === "string" &&
    typeof cartItem.product.name === "string" &&
    typeof cartItem.product.price === "number" &&
    Number.isInteger(cartItem.quantity) &&
    cartItem.quantity > 0
  );
}

function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_ITEMS;

  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw === cachedRaw) return cachedItems;

  cachedRaw = raw;

  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];

    cachedItems = Array.isArray(parsed)
      ? parsed.filter(isValidCartItem)
      : EMPTY_ITEMS;
  } catch {
    cachedItems = EMPTY_ITEMS;
  }

  return cachedItems;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_ITEMS;
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  function handleStorage(event: StorageEvent) {
    if (event.key !== STORAGE_KEY && event.key !== null) return;

    cachedRaw = undefined;
    getCartSnapshot();
    callback();
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function saveCart(items: CartItem[]) {
  try {
    const raw = JSON.stringify(items);
    localStorage.setItem(STORAGE_KEY, raw);

    cachedRaw = raw;
    cachedItems = items;

    listeners.forEach((listener) => listener());
  } catch (error) {
    console.error("Unable to save cart:", error);
  }
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cartItems = useSyncExternalStore(
    subscribe,
    getCartSnapshot,
    getServerSnapshot
  );

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      if (
        !product.inStock ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return;
      }

      const currentItems = getCartSnapshot();
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id
      );

      const updatedItems = existingItem
        ? currentItems.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  product,
                  quantity: item.quantity + quantity,
                }
              : item
          )
        : [...currentItems, { product, quantity }];

      saveCart(updatedItems);
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    const updatedItems = getCartSnapshot().filter(
      (item) => item.product.id !== productId
    );

    saveCart(updatedItems);
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (!Number.isInteger(quantity) || quantity < 1) {
        removeFromCart(productId);
        return;
      }

      const updatedItems = getCartSnapshot().map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );

      saveCart(updatedItems);
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    saveCart([]);
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
      isCartLoaded: true,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [
      cartItems,
      cartCount,
      subtotal,
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
