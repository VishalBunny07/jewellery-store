
import { Suspense } from "react";

import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import CollectionSection from "@/components/home/CollectionSection";
import BestSellers from "@/components/home/BestSellers";

import {
  getActiveCategories,
  getNewArrivals,
  getBestSellers,
} from "@/services/product.service";

async function HomePageCollections() {
  const [categories, newArrivals, bestSellers] = await Promise.all([
    getActiveCategories(),
    getNewArrivals(8),
    getBestSellers(8),
  ]);

  return (
    <>
      <CategorySection categories={categories} />
      <CollectionSection products={newArrivals} />
      <BestSellers products={bestSellers} />
    </>
  );
}

function HomePageFallback() {
  return (
    <div className="space-y-12 px-4 py-12">
      <div className="mx-auto h-8 max-w-48 animate-pulse rounded bg-stone-200" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square animate-pulse rounded-xl bg-stone-200"
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="aspect-3/4 animate-pulse rounded-xl bg-stone-200"
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <Suspense fallback={<HomePageFallback />}>
        <HomePageCollections />
      </Suspense>
    </>
  );
}
