
import { Suspense } from "react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <WishlistProvider>
        <AnnouncementBar />
        <Header />

        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>

        <Suspense fallback={null}>
          <MobileBottomNav />
        </Suspense>
      </WishlistProvider>
    </CartProvider>
  );
}
