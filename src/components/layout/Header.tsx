
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  UserRound,
} from "lucide-react";

import DesktopNavigation from "../navigation/DesktopNavigation";
import { useCart } from "@/context/CartContext";

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

  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="section-container">
        {/* Main Header */}
        <div className="flex h-68px items-center justify-between gap-3 md:h-82px">

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(!menuOpen);
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
            <span className="whitespace-nowrap font-serif text-[20px] leading-tight text-primary sm:text-2xl">
              Jewellery Store
            </span>

            <span className="mt-1 text-[8px] tracking-[0.24em] text-muted sm:text-[9px]">
              TIMELESS ELEGANCE
            </span>
          </Link>

          {/* Desktop Search */}
          <form
            action="/search"
            className="mx-8 hidden max-w-md flex-1 items-center border-b border-border py-2 lg:flex"
          >
            <Search size={18} className="shrink-0 text-muted" />

            <input
              type="search"
              name="q"
              placeholder="Search jewellery..."
              aria-label="Search jewellery"
              className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </form>

          {/* Header Actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">

            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => {
                setSearchOpen(!searchOpen);
                setMenuOpen(false);
              }}
              aria-label="Toggle search"
              className="flex h-10 w-10 items-center justify-center lg:hidden"
            >
              <Search size={21} />
            </button>

            {/* Desktop Search Icon */}
            <Link
              href="/search"
              aria-label="Search"
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
              aria-label="Wishlist"
              className="flex h-10 w-10 items-center justify-center"
            >
              <Heart size={21} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label={`Shopping bag, ${cartCount} items`}
              className="relative flex h-10 w-10 items-center justify-center"
            >
              <ShoppingBag size={21} />

              <span className="absolute right-0 top-0 flex h-16px min-w-16px items-center justify-center rounded-full bg-primary px-1 text-[9px] text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Field */}
        {searchOpen && (
          <form
            action="/search"
            className="flex items-center gap-3 border-t border-border py-3 lg:hidden"
          >
            <Search size={19} className="shrink-0 text-muted" />

            <input
              type="search"
              name="q"
              autoFocus
              placeholder="Search rings, earrings, necklaces..."
              aria-label="Search jewellery"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </form>
        )}
      </div>

      {/* Desktop Navigation */}
      <DesktopNavigation />

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-0 top-full max-h-[calc(100dvh-68px)] w-full overflow-y-auto border-t border-border bg-background shadow-lg lg:hidden">
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
