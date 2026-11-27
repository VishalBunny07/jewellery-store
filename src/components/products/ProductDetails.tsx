
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Maximize2,
} from "lucide-react";

import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const galleryImages =
    product.images?.length
      ? product.images
      : [product.image];

  const imageCount = galleryImages.length;
  const currentImage = galleryImages[selectedImage] ?? product.image;

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) /
          product.originalPrice) *
          100
      )
    : 0;

  // Close full-screen viewer using Escape key
  useEffect(() => {
    if (!isViewerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsViewerOpen(false);
      }

      if (event.key === "ArrowLeft" && imageCount > 1) {
        setSelectedImage((previous) =>
          previous === 0 ? imageCount - 1 : previous - 1
        );
      }

      if (event.key === "ArrowRight" && imageCount > 1) {
        setSelectedImage((previous) =>
          previous === imageCount - 1 ? 0 : previous + 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isViewerOpen, imageCount]);

  // Image navigation
  const showPreviousImage = () => {
    setSelectedImage((previous) =>
      previous === 0 ? imageCount - 1 : previous - 1
    );
  };

  const showNextImage = () => {
    setSelectedImage((previous) =>
      previous === imageCount - 1 ? 0 : previous + 1
    );
  };

  // PIN code validation
  const handlePincodeCheck = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryMessage(
        "Please enter a valid 6-digit PIN code."
      );
      return;
    }

    setDeliveryMessage(
      "PIN code accepted. Delivery availability will be confirmed at checkout."
    );
  };

  // Add product to shared cart
  const handleAddToCart = () => {
    if (!product.inStock) return;

    addToCart(product, quantity);

    setCartMessage(
      `${quantity} × ${product.name} added to your cart.`
    );
  };

  return (
    <>
      <main className="section-container py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted sm:text-sm">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>

          <ChevronRight size={14} />

          <Link
            href={`/categories/${product.category}`}
            className="capitalize hover:text-primary"
          >
            {product.category.replaceAll("-", " ")}
          </Link>

          <ChevronRight size={14} />

          <span className="text-foreground">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">

          {/* PRODUCT GALLERY */}
          <div className="min-w-0">

            {/* Main Image */}
            <div className="group relative aspect-4/5 overflow-hidden rounded-sm bg-secondary">

              {/* Click image to open full-screen viewer */}
              <button
                type="button"
                onClick={() => setIsViewerOpen(true)}
                aria-label="Open full-screen product image"
                className="absolute inset-0 z-0 cursor-zoom-in"
              >
                <Image
                  key={currentImage}
                  src={currentImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </button>

              {/* New Arrival Badge */}
              {product.isNew && (
                <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-sm bg-white px-3 py-1.5 text-xs font-semibold text-primary">
                  NEW ARRIVAL
                </span>
              )}

              {/* Out of Stock */}
              {!product.inStock && (
                <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/35 text-sm font-semibold tracking-widest text-white">
                  OUT OF STOCK
                </span>
              )}

              {/* Previous Image */}
              <button
                type="button"
                onClick={showPreviousImage}
                disabled={imageCount <= 1}
                aria-label="Previous product image"
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ChevronLeft size={22} />
              </button>

              {/* Next Image */}
              <button
                type="button"
                onClick={showNextImage}
                disabled={imageCount <= 1}
                aria-label="Next product image"
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ChevronRight size={22} />
              </button>

              {/* Full Screen Button */}
              <button
                type="button"
                onClick={() => setIsViewerOpen(true)}
                aria-label="View image full screen"
                className="absolute bottom-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md transition hover:bg-white"
              >
                <Maximize2 size={18} />
              </button>

              {/* Image Counter */}
              <span className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white">
                {selectedImage + 1} / {imageCount}
              </span>
            </div>

            {/* Thumbnail Gallery */}
            {imageCount > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View product image ${index + 1}`}
                    aria-pressed={selectedImage === index}
                    className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-sm border-2 bg-secondary transition sm:h-24 sm:w-20 ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-accent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {imageCount === 1 && (
              <p className="mt-3 text-center text-xs text-muted">
                Click the image to view it in full screen.
              </p>
            )}
          </div>

          {/* PRODUCT INFORMATION */}
          <div className="lg:py-5">

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {product.material} Collection
            </p>

            <h1 className="font-serif text-2xl leading-tight text-foreground sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            <p className="mt-3 text-sm leading-7 text-muted">
              {product.description}
            </p>

            {/* Price */}
            <div className="mt-6 border-b border-border pb-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl font-semibold text-foreground">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>

                {product.originalPrice && (
                  <>
                    <span className="text-base text-muted line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>

                    {discount > 0 && (
                      <span className="rounded-sm bg-secondary px-2 py-1 text-xs font-semibold text-primary">
                        {discount}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>

              <p className="mt-2 text-xs text-muted">
                Inclusive of applicable taxes
              </p>
            </div>

            {/* Material */}
            <div className="border-b border-border py-5">
              <p className="text-sm font-semibold text-foreground">
                Material
              </p>

              <span className="mt-2 inline-block rounded-sm border border-border bg-white px-4 py-2 text-sm text-foreground">
                {product.material}
              </span>
            </div>

            {/* Availability */}
            <div className="border-b border-border py-5">
              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <Check size={16} className="text-green-700" />
                    <span className="text-sm font-medium text-green-700">
                      In Stock
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-red-600">
                    Currently Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="py-5">
              <p className="mb-3 text-sm font-semibold text-foreground">
                Quantity
              </p>

              <div className="flex h-11 w-32 items-center justify-between border border-border bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((previous) =>
                      Math.max(1, previous - 1)
                    )
                  }
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-full w-10 items-center justify-center text-foreground hover:text-primary disabled:opacity-40"
                >
                  <Minus size={15} />
                </button>

                <span className="text-sm font-medium text-foreground">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((previous) =>
                      Math.min(10, previous + 1)
                    )
                  }
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                  className="flex h-full w-10 items-center justify-center text-foreground hover:text-primary disabled:opacity-40"
                >
                  <Plus size={15} />
                </button>
              </div>

              <p className="mt-2 text-xs text-muted">
                Maximum 10 items per order.
              </p>
            </div>

            {/* Cart and Wishlist */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="primary-button flex min-h-12 flex-1 items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={18} />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={
                  isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                aria-pressed={isWishlisted}
                className={`flex h-12 w-12 shrink-0 items-center justify-center border transition-colors ${
                  isWishlisted
                    ? "border-primary bg-secondary text-primary"
                    : "border-border bg-white text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                <Heart
                  size={20}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Cart Confirmation */}
            {cartMessage && (
              <div
                className="mt-3 flex flex-wrap items-center justify-between gap-2 border border-border bg-secondary p-3"
                role="status"
              >
                <span className="text-xs text-foreground">
                  <Check
                    size={14}
                    className="mr-1 inline text-green-700"
                  />
                  {cartMessage}
                </span>

                <Link
                  href="/cart"
                  className="text-xs font-semibold text-primary underline underline-offset-4"
                >
                  View Cart
                </Link>
              </div>
            )}

            {/* Delivery Checker */}
            <div className="mt-8 border border-border bg-white p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <Truck size={19} className="text-primary" />

                <h2 className="text-sm font-semibold text-foreground">
                  Check Delivery Availability
                </h2>
              </div>

              <div className="mt-4 flex">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(event) => {
                    setPincode(
                      event.target.value.replace(/\D/g, "")
                    );
                    setDeliveryMessage("");
                  }}
                  placeholder="Enter 6-digit PIN code"
                  className="min-w-0 flex-1 border border-border px-3 py-3 text-sm text-foreground outline-none focus:border-primary"
                />

                <button
                  type="button"
                  onClick={handlePincodeCheck}
                  className="bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  Check
                </button>
              </div>

              {deliveryMessage && (
                <p className="mt-3 text-xs text-muted" role="status">
                  {deliveryMessage}
                </p>
              )}
            </div>

            {/* Service Information */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Truck size={19} className="text-primary" />
                <span className="text-sm text-muted">
                  Delivery details available at checkout
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck size={19} className="text-primary" />
                <span className="text-sm text-muted">
                  Product quality information
                </span>
              </div>

              <div className="flex items-center gap-3">
                <RotateCcw size={19} className="text-primary" />
                <span className="text-sm text-muted">
                  Return policy available at checkout
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FULL-SCREEN IMAGE VIEWER */}
      {isViewerOpen && (
        <div
          className="fixed inset-0 z-200 flex items-center justify-center bg-black/95 p-3 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Product image viewer"
          onClick={() => setIsViewerOpen(false)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsViewerOpen(false)}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 z-220 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
          >
            <X size={24} />
          </button>

          {/* Image Counter */}
          <span className="absolute left-4 top-5 z-220 rounded-full bg-white/15 px-4 py-2 text-sm text-white">
            {selectedImage + 1} / {imageCount}
          </span>

          {/* Viewer Content */}
          <div
            className="relative flex h-full w-full max-w-6xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Previous */}
            <button
              type="button"
              onClick={showPreviousImage}
              disabled={imageCount <= 1}
              aria-label="Previous full-screen image"
              className="absolute left-0 top-1/2 z-220 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-30 sm:left-2"
            >
              <ChevronLeft size={26} />
            </button>

            {/* Full-Screen Image */}
            <div className="relative h-[82vh] w-full">
              <Image
                key={currentImage}
                src={currentImage}
                alt={`${product.name} full-screen image`}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {/* Next */}
            <button
              type="button"
              onClick={showNextImage}
              disabled={imageCount <= 1}
              aria-label="Next full-screen image"
              className="absolute right-0 top-1/2 z-220 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-30 sm:right-2"
            >
              <ChevronRight size={26} />
            </button>
          </div>

          {/* Full-Screen Thumbnails */}
          {imageCount > 1 && (
            <div
              className="absolute bottom-4 left-0 right-0 z-220 flex justify-center gap-2 overflow-x-auto px-4"
              onClick={(event) => event.stopPropagation()}
            >
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View full-screen image ${index + 1}`}
                  className={`relative h-14 w-11 shrink-0 overflow-hidden rounded border-2 ${
                    selectedImage === index
                      ? "border-white"
                      : "border-white/30"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
