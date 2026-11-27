
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";

import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) /
          product.originalPrice) *
          100
      )
    : 0;

  const handleQuickAdd = () => {
    if (!product.inStock) return;

    addToCart(product, 1);
    setIsAdded(true);
  };

  return (
    <article className="group min-w-0">
      <div className="relative aspect-4/5 overflow-hidden rounded-sm bg-secondary">
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Product Badges */}
        <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-white px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-primary">
              New
            </span>
          )}

          {discount > 0 && (
            <span className="bg-primary px-2 py-1 text-[9px] font-semibold text-white">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Global Wishlist */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
          className={`absolute right-2 top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 transition-colors hover:bg-primary hover:text-white ${
            isWishlisted ? "text-primary" : "text-foreground"
          }`}
        >
          <Heart
            size={17}
            strokeWidth={1.5}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* Quick Add */}
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={!product.inStock}
          className="absolute bottom-0 left-0 z-20 flex w-full items-center justify-center gap-2 bg-white/95 py-3 text-[10px] font-semibold uppercase tracking-wider text-foreground transition-all duration-300 hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:translate-y-full sm:group-hover:translate-y-0"
        >
          {isAdded ? (
            <>
              <Check size={15} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag size={15} />
              {product.inStock ? "Quick Add" : "Out of Stock"}
            </>
          )}
        </button>
      </div>

      {/* Product Details */}
      <div className="pt-3">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-xs font-medium text-foreground transition-colors hover:text-primary sm:text-sm"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          {product.originalPrice && (
            <span className="text-xs text-muted line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
