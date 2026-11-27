
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Menu,
  X,
  UserRound,
  Search,
} from "lucide-react";

import DesktopNavigation from "../navigation/DesktopNavigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import SearchBox from "@/components/layout/SearchBox";

const menuItems = [
  { name: "New In", href: "/collections/new-arrivals" },
  { name: "Rings", href: "/categories/rings" },
  { name: "Earrings", href: "/categories/earrings" },
  { name: "Necklaces", href: "/categories/necklaces" },
  { name: "Bracelets", href: "/categories/bracelets" },
  { name: "Mangalsutra", href: "/categories/mangalsutra" },
  { name: "Gifting", href: "/collections/gifts" },
  { name: "All Collections", href: "/collections" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <header className="sticky top-0 z-50 bg-background [overflow-anchor:none]">
      <div className="section-container">
        {/* Main Header */}
        <div className="relative flex h-16 items-center justify-between gap-2 md:h-20">

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen((previous) => !previous);
              setSearchOpen(false);
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center lg:hidden"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>

          {/* Brand */}
          <Link
            href="/"
            className="flex min-w-0 flex-col items-center lg:items-start"
            aria-label="Jewellery Store home"
          >
            <span className="whitespace-nowrap font-serif text-xl leading-tight text-primary sm:text-2xl">
              Jewellery Store
            </span>

            <span className="mt-1 text-[8px] tracking-[0.24em] text-muted sm:text-[9px]">
              TIMELESS ELEGANCE
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="mx-8 hidden max-w-md flex-1 lg:block">
            <SearchBox />
          </div>

          {/* Header Actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">

            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => {
                setSearchOpen((previous) => !previous);
                setMenuOpen(false);
              }}
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
              className="flex h-10 w-10 items-center justify-center lg:hidden"
            >
              {searchOpen ? <X size={21} /> : <Search size={21} />}
            </button>

            {/* Desktop Search Icon */}
            <Link
              href="/search"
              aria-label="Search products"
              className="hidden h-10 w-10 items-center justify-center lg:flex"
            >
              <Search size={21} />
            </Link>

            {/* Account */}
            <Link
              href="/login"
              aria-label="My account"
              className="hidden h-10 w-10 items-center justify-center sm:flex"
            >
              <UserRound size={21} />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} saved products`}
              className="relative hidden h-10 w-10 items-center justify-center lg:flex"
            >
              <Heart size={21} />

              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] text-white">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label={`Shopping bag, ${cartCount} items`}
              className="relative hidden h-10 w-10 items-center justify-center lg:flex"
            >
              <ShoppingBag size={21} />

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="border-t border-border py-3 lg:hidden">
            <SearchBox />
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <DesktopNavigation />

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-0 top-full max-h-[calc(100dvh-64px)] w-full overflow-y-auto border-t border-border bg-background shadow-lg lg:hidden">
          <nav
            aria-label="Mobile navigation"
            className="section-container py-3"
          >
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-border py-4 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {item.name}
                <span className="text-muted">›</span>
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-4 flex items-center gap-2 py-3 text-sm text-primary"
            >
              <UserRound size={18} />
              Sign in / My Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
