
import { Suspense } from "react";
import { connection } from "next/server";

import SearchResults from "@/components/products/SearchResults";
import {
  getActiveCategories,
  searchProducts,
} from "@/services/product.service";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default function SearchPage({
  searchParams,
}: SearchPageProps) {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchPageContent({
  searchParams,
}: SearchPageProps) {
  await connection();

  const params = await searchParams;
  const query = params.q?.trim().slice(0, 100) ?? "";

  const [categories, products] = await Promise.all([
    getActiveCategories(),
    query
      ? searchProducts(query, 100)
      : Promise.resolve([]),
  ]);

  return (
    <SearchResults
      query={query}
      products={products}
      categories={categories}
    />
  );
}

function SearchPageFallback() {
  return (
    <div className="section-container animate-pulse py-16">
      <div className="h-8 w-64 rounded bg-secondary" />

      <div className="mt-4 h-4 w-40 rounded bg-secondary" />

      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-4/5 rounded-sm bg-secondary" />
            <div className="mt-3 h-4 w-3/4 rounded bg-secondary" />
            <div className="mt-2 h-4 w-1/3 rounded bg-secondary" />
          </div>
        ))}
      </div>
    </div>
  );
}
