
"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Heart,
  UserRound,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Categories", href: "/categories", icon: LayoutGrid },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
  { name: "Account", href: "/account", icon: UserRound },
  { name: "Cart", href: "/cart", icon: ShoppingBag },
];

const subscribe = () => () => {};

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}



export default function MobileBottomNav() {
  const pathname = usePathname();

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const isHydrated = useSyncExternalStore(
  subscribe,
  getClientSnapshot,
  getServerSnapshot
);


  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="grid grid-cols-5">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-label={item.name}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-62px flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? "text-primary" : "text-muted"
              }`}
            >
              <div className="relative">
                <Icon size={21} strokeWidth={isActive ? 2.2 : 1.7} />

                {isHydrated && item.name === "Wishlist" && wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-white">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}

                {isHydrated && item.name === "Cart" && cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
