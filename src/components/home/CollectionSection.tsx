
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Product } from "@/types/product";
import ProductGrid from "@/components/products/ProductGrid";

interface CollectionSectionProps {
  products: Product[];
}

export default function CollectionSection({
  products,
}: CollectionSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="section-container py-10 sm:py-14">
      <div className="mb-7 flex items-end justify-between gap-3">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
            Just Arrived
          </span>

          <h2 className="section-heading mt-2">
            New Arrivals
          </h2>

          <p className="mt-2 text-sm text-muted">
            Discover the latest additions to our collection.
          </p>
        </div>

        <Link
          href="/categories/rings"
          className="mb-1 inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-primary hover:text-primary-dark"
        >
          Explore
          <ArrowRight size={15} />
        </Link>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}
