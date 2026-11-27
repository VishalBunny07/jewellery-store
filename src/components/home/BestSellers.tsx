
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Product } from "@/types/product";
import ProductGrid from "@/components/products/ProductGrid";

interface BestSellersProps {
  products: Product[];
}

export default function BestSellers({
  products,
}: BestSellersProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-secondary/40 py-12 sm:py-16">
      <div className="section-container">
        <div className="mb-7 flex items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
              Customer Favourites
            </span>

            <h2 className="section-heading mt-2">
              Best Sellers
            </h2>

            <p className="mt-2 text-sm text-muted">
              Jewellery pieces everyone loves.
            </p>
          </div>

          <Link
            href="/categories/earrings"
            className="mb-1 inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-primary hover:text-primary-dark"
          >
            Explore
            <ArrowRight size={15} />
          </Link>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
