
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

const WISHLIST_STORAGE_KEY = "jewellery-store-wishlist";

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load wishlist once when initializing in the browser.
  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const savedWishlist = localStorage.getItem(
        WISHLIST_STORAGE_KEY
      );

      if (!savedWishlist) return [];

      const parsedWishlist: unknown = JSON.parse(savedWishlist);

      return Array.isArray(parsedWishlist)
        ? (parsedWishlist as Product[])
        : [];
    } catch (error) {
      console.error("Unable to load wishlist:", error);
      return [];
    }
  });

  const [isWishlistLoaded] = useState(true);

  // Save wishlist whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlistItems)
      );
    } catch (error) {
      console.error("Unable to save wishlist:", error);
    }
  }, [wishlistItems]);

  const isInWishlist = useCallback(
    (productId: string) =>
      wishlistItems.some((item) => item.id === productId),
    [wishlistItems]
  );

  const toggleWishlist = useCallback((product: Product) => {
    setWishlistItems((currentItems) => {
      const alreadyExists = currentItems.some(
        (item) => item.id === product.id
      );

      if (alreadyExists) {
        return currentItems.filter(
          (item) => item.id !== product.id
        );
      }

      return [...currentItems, product];
    });
  }, []);

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlistItems((currentItems) =>
        currentItems.filter((item) => item.id !== productId)
      );
    },
    []
  );

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const wishlistCount = wishlistItems.length;

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount,
      isWishlistLoaded,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [
      wishlistItems,
      wishlistCount,
      isWishlistLoaded,
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
