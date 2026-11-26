
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { categories } from "@/data/categories";
import { products } from "@/data/products";
import ProductFilters from "@/components/products/ProductFilters";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static routes for all categories
export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// Loading fallback
function CategoryLoading() {
  return (
    <div className="section-container animate-pulse py-10">
      <div className="h-4 w-32 rounded bg-secondary" />

      <div className="mt-6 h-220px rounded-sm bg-secondary sm:h-300px lg:h-380px" />

      <div className="mx-auto mt-12 h-8 w-48 rounded bg-secondary" />
      <div className="mx-auto mt-4 h-4 w-72 max-w-full rounded bg-secondary" />
    </div>
  );
}

// Category page content
async function CategoryContent({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  // Find selected category
  const category = categories.find(
    (item) => item.slug === slug
  );

  if (!category) {
    notFound();
  }

  // Get products belonging to this category
  const categoryProducts = products.filter(
    (product) => product.category === category.slug
  );

  return (
    <main className="min-h-screen">

      {/* Breadcrumb */}
      <section className="section-container pt-5 pb-4">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted"
        >
          <Link
            href="/"
            className="transition-colors hover:text-primary"
          >
            Home
          </Link>

          <span>/</span>

          <span className="font-medium text-foreground">
            {category.name}
          </span>
        </nav>
      </section>

      {/* Category Banner */}
      <section className="section-container">
        <div className="relative w-full overflow-hidden rounded-sm bg-secondary">
          <Image
            src={category.bannerImage}
            alt={`${category.name} jewellery collection`}
            width={1920}
            height={600}
            priority
            unoptimized
            sizes="100vw"
            className="block h-220px w-full object-cover sm:h-300px lg:h-380px"
          />

          {/* Image Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-black/15" />

          {/* Banner Text */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-5 text-center">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white sm:text-xs">
                Discover Our Collection
              </span>

              <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl lg:text-6xl">
                {category.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Category Introduction */}
      <section className="section-container py-10 sm:py-14">
        <div className="text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
            Explore Our Collection
          </span>

          <h2 className="section-heading mt-2">
            {category.name}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
            Discover beautiful{" "}
            {category.name.toLowerCase()} designed to complement
            every style and occasion.
          </p>
        </div>
      </section>

      {/* Product Sorting and Filtering */}
      <ProductFilters products={categoryProducts} />

    </main>
  );
}

// Main category page
export default function CategoryPage({
  params,
}: CategoryPageProps) {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}
