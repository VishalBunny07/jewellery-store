
"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const {
    wishlistItems,
    wishlistCount,
    clearWishlist,
    removeFromWishlist,
    isWishlistLoaded,
  } = useWishlist();

  const { addToCart } = useCart();

  if (!isWishlistLoaded) {
    return (
      <main className="section-container min-h-[60vh] py-16">
        <div className="mx-auto h-8 max-w-48 animate-pulse rounded bg-secondary" />
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[3/4] animate-pulse rounded bg-secondary"
            />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="section-container min-h-[65vh] py-10 sm:py-14">
      {/* Page Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Heart size={19} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
              Your Collection
            </span>
          </div>

          <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
            My Wishlist
          </h1>

          <p className="mt-2 text-sm text-muted">
            {wishlistCount} {wishlistCount === 1 ? "item" : "items"} saved
            for later
          </p>
        </div>

        {wishlistCount > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:text-red-600"
          >
            <Trash2 size={15} />
            Clear Wishlist
          </button>
        )}
      </div>

      {/* Empty Wishlist */}
      {wishlistCount === 0 ? (
        <div className="flex min-h-[45vh] flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <Heart size={34} strokeWidth={1.2} className="text-primary" />
          </div>

          <h2 className="font-serif text-2xl text-foreground">
            Your wishlist is waiting
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-7 text-muted">
            Save the jewellery you love and keep all your favourite pieces
            together in one place.
          </p>

          <Link
            href="/"
            className="primary-button mt-7 inline-flex items-center gap-2"
          >
            Explore Jewellery
            <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <>
          {/* Wishlist Products */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {wishlistItems.map((product) => (
              <article key={product.id} className="group min-w-0">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-secondary">
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

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-primary shadow-sm transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Heart size={17} fill="currentColor" />
                  </button>

                  {!product.inStock && (
                    <span className="absolute bottom-0 left-0 w-full bg-black/65 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-white">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="pt-3">
                  <Link
                    href={`/products/${product.slug}`}
                    className="line-clamp-2 text-sm font-medium text-foreground hover:text-primary"
                  >
                    {product.name}
                  </Link>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    {product.originalPrice && (
                      <span className="text-xs text-muted line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!product.inStock}
                    onClick={() => addToCart(product, 1)}
                    className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 border border-primary px-2 text-[10px] font-semibold uppercase tracking-wider text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingBag size={15} />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
