
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Menu,
  X,
  UserRound,
  Search,
  LogOut,
  LayoutDashboard,
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

interface HeaderUser {
  id: number;
  name: string;
  email: string;
}

function HeaderContent() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState<HeaderUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  // Check authentication whenever the route changes.
  useEffect(() => {
    let active = true;

    async function checkAuthentication() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Authentication check failed.");
        }

        const data = await response.json();

        if (active) {
          setUser(data.user ?? null);
        }
      } catch (error) {
        console.error("Header authentication error:", error);

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    }

    checkAuthentication();

    return () => {
      active = false;
    };
  }, [pathname]);

  // Logout current customer.
  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to log out.");
      }

      setUser(null);
      setAccountOpen(false);
      setMenuOpen(false);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to log out. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  }

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
            <div className="relative hidden sm:block">
              {authLoading ? (
                <div className="h-10 w-10" />
              ) : user ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setAccountOpen((previous) => !previous)
                    }
                    aria-label="My account menu"
                    aria-expanded={accountOpen}
                    className="flex h-10 w-10 items-center justify-center"
                  >
                    <UserRound size={21} />
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 top-full z-50 mt-3 w-64 border border-border bg-background p-4 shadow-lg">

                      <div className="border-b border-border pb-3">
                        <p className="text-sm font-medium text-foreground">
                          {user.name}
                        </p>

                        <p className="mt-1 truncate text-xs text-muted">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 py-3 text-sm transition-colors hover:text-primary"
                      >
                        <LayoutDashboard size={17} />
                        My Account
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 border-t border-border pt-3 text-left text-sm text-muted transition-colors hover:text-primary disabled:opacity-50"
                      >
                        <LogOut size={17} />
                        {loggingOut ? "Signing out..." : "Sign out"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  aria-label="Sign in to your account"
                  className="flex h-10 w-10 items-center justify-center"
                >
                  <UserRound size={21} />
                </Link>
              )}
            </div>

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

            {/* Mobile Account */}
            <Link
              href={user ? "/account" : "/login"}
              onClick={() => setMenuOpen(false)}
              className="mt-4 flex items-center gap-2 py-3 text-sm text-primary"
            >
              <UserRound size={18} />

              {authLoading
                ? "Checking account..."
                : user
                  ? "My Account"
                  : "Sign in / My Account"}
            </Link>

            {/* Mobile Logout */}
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-2 py-3 text-left text-sm text-muted hover:text-primary disabled:opacity-50"
              >
                <LogOut size={18} />
                {loggingOut ? "Signing out..." : "Sign out"}
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

// Public Header component with Suspense boundary.
export default function Header() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-50 h-16 bg-background md:h-20">
          <div className="section-container flex h-full items-center justify-center">
            <span className="font-serif text-xl text-primary sm:text-2xl">
              Jewellery Store
            </span>
          </div>
        </header>
      }
    >
      <HeaderContent />
    </Suspense>
  );
}
