
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Truck,
  ShoppingCart,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    cartCount,
    subtotal,
    isCartLoaded,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const formatPrice = (price: number) =>
    `₹${price.toLocaleString("en-IN")}`;

  // Loading state
  if (!isCartLoaded) {
    return (
      <main className="section-container min-h-[60vh] py-16">
        <div className="animate-pulse">
          <div className="mx-auto h-8 w-48 rounded bg-secondary" />
          <div className="mt-10 h-40 rounded bg-secondary" />
          <div className="mt-4 h-40 rounded bg-secondary" />
        </div>
      </main>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <main className="section-container flex min-h-[65vh] items-center justify-center py-16">
        <div className="mx-auto max-w-md text-center">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
            <ShoppingBag
              size={38}
              strokeWidth={1.3}
              className="text-primary"
            />
          </div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Your Shopping Bag
          </p>

          <h1 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl">
            Your cart is empty
          </h1>

          <p className="mt-4 text-sm leading-7 text-muted">
            Looks like you haven`t discovered your favourite
            jewellery yet. Explore our collections and find
            something beautiful.
          </p>

          <Link
            href="/"
            className="primary-button mt-8 inline-flex min-h-12 items-center justify-center gap-2 px-8"
          >
            <ShoppingBag size={17} />
            Explore Jewellery
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="section-container py-8 sm:py-12">

      {/* Page Heading */}
      <div className="mb-8 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Your Selection
        </p>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
              Shopping Cart
            </h1>

            <p className="mt-2 text-sm text-muted">
              {cartCount} {cartCount === 1 ? "item" : "items"} in your bag
            </p>
          </div>

          <Link
            href="/"
            className="hidden items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-dark sm:flex"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Cart Layout */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">

        {/* Cart Items */}
        <section aria-label="Cart items">

          <div className="hidden grid-cols-[1fr_120px_110px] gap-4 border-b border-border pb-3 text-xs font-semibold uppercase tracking-wider text-muted sm:grid">
            <span>Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Subtotal</span>
          </div>

          <div className="divide-y divide-border">

            {cartItems.map((item) => (
              <article
                key={item.product.id}
                className="grid grid-cols-[104px_1fr] gap-4 py-6 sm:grid-cols-[120px_1fr_120px_110px] sm:items-center sm:gap-5"
              >

                {/* Product Image */}
                <Link
                  href={`/products/${item.product.slug}`}
                  className="relative aspect-4/5 overflow-hidden rounded-sm bg-secondary"
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </Link>

                {/* Product Information */}
                <div className="flex min-w-0 flex-col justify-center">

                  <Link
                    href={`/products/${item.product.slug}`}
                    className="line-clamp-2 font-serif text-base text-foreground transition-colors hover:text-primary sm:text-lg"
                  >
                    {item.product.name}
                  </Link>

                  <p className="mt-2 text-xs text-muted">
                    Material: {item.product.material}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {formatPrice(item.product.price)}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">

                    {/* Mobile Quantity Controls */}
                    <div className="flex h-9 items-center border border-border bg-white sm:hidden">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                        aria-label={`Decrease ${item.product.name} quantity`}
                        className="flex h-full w-9 items-center justify-center hover:text-primary"
                      >
                        <Minus size={13} />
                      </button>

                      <span className="min-w-7 text-center text-xs font-medium">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        aria-label={`Increase ${item.product.name} quantity`}
                        className="flex h-full w-9 items-center justify-center hover:text-primary"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(item.product.id)
                      }
                      className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-red-600"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>

                  </div>
                </div>

                {/* Desktop Quantity Controls */}
                <div className="hidden justify-center sm:flex">
                  <div className="flex h-10 items-center border border-border bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity - 1
                        )
                      }
                      aria-label={`Decrease ${item.product.name} quantity`}
                      className="flex h-full w-9 items-center justify-center hover:text-primary"
                    >
                      <Minus size={13} />
                    </button>

                    <span className="min-w-8 text-center text-xs font-medium">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity + 1
                        )
                      }
                      aria-label={`Increase ${item.product.name} quantity`}
                      className="flex h-full w-9 items-center justify-center hover:text-primary"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* Item Subtotal */}
                <div className="col-span-2 flex items-center justify-between border-t border-border pt-3 sm:col-span-1 sm:justify-end sm:border-0 sm:pt-0">
                  <span className="text-xs text-muted sm:hidden">
                    Item Subtotal
                  </span>

                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(
                      item.product.price * item.quantity
                    )}
                  </span>
                </div>

              </article>
            ))}

          </div>

          {/* Continue Shopping - Mobile */}
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark sm:hidden"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>

        </section>

        {/* Order Summary */}
        <aside className="border border-border bg-white p-5 sm:p-6 lg:sticky lg:top-32">

          <h2 className="font-serif text-2xl text-foreground">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4 border-b border-border pb-5">

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">
                Subtotal ({cartCount} items)
              </span>

              <span className="font-medium text-foreground">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">
                Shipping
              </span>

              <span className="text-xs text-muted">
                Calculated at checkout
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">
                Taxes
              </span>

              <span className="text-xs text-muted">
                Included in product prices
              </span>
            </div>

          </div>

          {/* Total */}
          <div className="flex items-center justify-between py-5">
            <span className="text-base font-semibold text-foreground">
              Estimated Total
            </span>

            <span className="text-xl font-bold text-foreground">
              {formatPrice(subtotal)}
            </span>
          </div>

          <p className="mb-5 text-xs leading-5 text-muted">
            Final shipping charges and order details will be
            confirmed during checkout.
          </p>

          {/* Checkout */}
          <Link
            href="/checkout"
            className="primary-button flex min-h-12 w-full items-center justify-center gap-2"
          >
            Proceed to Checkout
            <ShoppingCart size={17} />
          </Link>

          {/* Trust Information */}
          <div className="mt-6 space-y-4 border-t border-border pt-5">

            <div className="flex items-center gap-3">
              <ShieldCheck
                size={19}
                className="shrink-0 text-primary"
              />

              <span className="text-xs text-muted">
                Secure shopping experience
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Truck
                size={19}
                className="shrink-0 text-primary"
              />

              <span className="text-xs text-muted">
                Delivery details confirmed at checkout
              </span>
            </div>

          </div>

        </aside>
      </div>
    </main>
  );
}
