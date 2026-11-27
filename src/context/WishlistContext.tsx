
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import type { Product } from "@/types/product";

interface WishlistContextType {
  wishlistItems: Product[];
  wishlistCount: number;
  isWishlistLoaded: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<
  WishlistContextType | undefined
>(undefined);

const STORAGE_KEY = "jewellery-store-wishlist";

const EMPTY_ITEMS: Product[] = [];

let cachedRaw: string | null | undefined;
let cachedItems: Product[] = EMPTY_ITEMS;

const listeners = new Set<() => void>();

function getWishlistSnapshot(): Product[] {
  if (typeof window === "undefined") return EMPTY_ITEMS;

  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw === cachedRaw) return cachedItems;

  cachedRaw = raw;

  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedItems = Array.isArray(parsed)
      ? (parsed as Product[])
      : EMPTY_ITEMS;
  } catch {
    cachedItems = EMPTY_ITEMS;
  }

  return cachedItems;
}

function getServerSnapshot(): Product[] {
  return EMPTY_ITEMS;
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  function handleStorage(event: StorageEvent) {
    if (event.key !== STORAGE_KEY && event.key !== null) return;

    cachedRaw = undefined;
    getWishlistSnapshot();
    callback();
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function saveWishlist(items: Product[]) {
  try {
    const raw = JSON.stringify(items);
    localStorage.setItem(STORAGE_KEY, raw);

    cachedRaw = raw;
    cachedItems = items;

    listeners.forEach((listener) => listener());
  } catch (error) {
    console.error("Unable to save wishlist:", error);
  }
}

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wishlistItems = useSyncExternalStore(
    subscribe,
    getWishlistSnapshot,
    getServerSnapshot
  );

  const isInWishlist = useCallback(
    (productId: string) =>
      wishlistItems.some((item) => item.id === productId),
    [wishlistItems]
  );

  const toggleWishlist = useCallback((product: Product) => {
    const currentItems = getWishlistSnapshot();

    const exists = currentItems.some(
      (item) => item.id === product.id
    );

    const updatedItems = exists
      ? currentItems.filter((item) => item.id !== product.id)
      : [...currentItems, product];

    saveWishlist(updatedItems);
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    const updatedItems = getWishlistSnapshot().filter(
      (item) => item.id !== productId
    );

    saveWishlist(updatedItems);
  }, []);

  const clearWishlist = useCallback(() => {
    saveWishlist([]);
  }, []);

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isWishlistLoaded: true,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [
      wishlistItems,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside a WishlistProvider"
    );
  }

  return context;
}
