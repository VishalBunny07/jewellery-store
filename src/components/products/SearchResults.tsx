
"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import ProductFilters from "./ProductFilters";
import type { Product } from "@/types/product";
import type { Category } from "@/data/categories";

interface SearchResultsProps {
  query: string;
  products: Product[];
  categories: Category[];
}

export default function SearchResults({
  query,
  products,
  categories,
}: SearchResultsProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

  if (!query) {
    return (
      <section className="section-container py-12 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Search
            size={32}
            strokeWidth={1.3}
            className="mx-auto text-primary"
          />

          <h1 className="mt-5 font-serif text-3xl text-foreground sm:text-4xl">
            Find Something Beautiful
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            Explore our jewellery collections and discover pieces
            that make every moment special.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group overflow-hidden rounded-sm border border-border bg-white transition hover:border-primary"
            >
              <div className="relative aspect-square overflow-hidden bg-secondary">
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("${category.image}")`,
                  }}
                />
              </div>

              <div className="p-3 text-center">
                <h2 className="text-sm font-medium text-foreground group-hover:text-primary">
                  {category.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="section-container py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 text-xs text-muted"
      >
        <Link href="/" className="hover:text-primary">
          Home
        </Link>

        <span className="mx-2">/</span>

        <span className="text-foreground">Search Results</span>
      </nav>

      {/* Search Heading */}
      <div className="mb-8 border-b border-border pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Search Results
        </p>

        <h1 className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">
          {query}
        </h1>

        <p className="mt-3 text-sm text-muted">
          {products.length}{" "}
          {products.length === 1 ? "product" : "products"} found
          for your search
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label
          htmlFor="search-category"
          className="text-sm font-medium text-foreground"
        >
          Category:
        </label>

        <select
          id="search-category"
          value={selectedCategory}
          onChange={(event) =>
            setSelectedCategory(event.target.value)
          }
          className="min-w-40 rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        >
          <option value="all">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Filters and Grid */}
      <ProductFilters products={filteredProducts} />
    </section>
  );
}
