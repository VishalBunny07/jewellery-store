
"use client";

import { useMemo, useState } from "react";
import { Filter, X, SlidersHorizontal } from "lucide-react";

import type { Product } from "@/types/product";
import ProductGrid from "./ProductGrid";

interface ProductFiltersProps {
  products: Product[];
}

type SortOption = "featured" | "newest" | "price-low" | "price-high";

const MIN_PRICE = 500;
const MAX_PRICE = 10000;

export default function ProductFilters({
  products,
}: ProductFiltersProps) {
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [priceInput, setPriceInput] = useState(String(MAX_PRICE));
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Get available materials
  const materials = useMemo(() => {
    return Array.from(
      new Set(products.map((product) => product.material))
    );
  }, [products]);

  // Handle slider changes
  const handleSliderChange = (value: number) => {
    setMaxPrice(value);
    setPriceInput(String(value));
  };

  // Handle manual price input
  const handlePriceInputChange = (value: string) => {
    if (!/^\d*$/.test(value)) return;

    setPriceInput(value);

    if (value === "") return;

    const amount = Math.min(MAX_PRICE, Number(value));
    setMaxPrice(amount);
  };

  // Validate price input on blur
  const handlePriceInputBlur = () => {
    const enteredAmount = Number(priceInput);

    const amount = Math.min(
      MAX_PRICE,
      Math.max(MIN_PRICE, enteredAmount || MIN_PRICE)
    );

    setMaxPrice(amount);
    setPriceInput(String(amount));
  };

  // Toggle material filter
  const toggleMaterial = (material: string) => {
    setSelectedMaterials((previous) =>
      previous.includes(material)
        ? previous.filter((item) => item !== material)
        : [...previous, material]
    );
  };

  // Remove individual filter
  const removeFilter = (
    type: "price" | "stock" | "material",
    value?: string
  ) => {
    if (type === "price") {
      setMaxPrice(MAX_PRICE);
      setPriceInput(String(MAX_PRICE));
    }

    if (type === "stock") {
      setInStockOnly(false);
    }

    if (type === "material" && value) {
      setSelectedMaterials((previous) =>
        previous.filter((item) => item !== value)
      );
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedMaterials([]);
    setMaxPrice(MAX_PRICE);
    setPriceInput(String(MAX_PRICE));
    setInStockOnly(false);
    setSortBy("featured");
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Material filter
    if (selectedMaterials.length > 0) {
      result = result.filter((product) =>
        selectedMaterials.includes(product.material)
      );
    }

    // Maximum price filter
    result = result.filter((product) => product.price <= maxPrice);

    // Stock filter
    if (inStockOnly) {
      result = result.filter((product) => product.inStock);
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) => Number(b.isNew) - Number(a.isNew)
        );
        break;

      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "featured":
      default:
        result.sort(
          (a, b) =>
            Number(b.isBestSeller) - Number(a.isBestSeller)
        );
        break;
    }

    return result;
  }, [products, selectedMaterials, maxPrice, inStockOnly, sortBy]);

  // Count active filters
  const activeFilterCount =
    selectedMaterials.length +
    (maxPrice < MAX_PRICE ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  // Reusable filter content
  const renderFilterContent = () => (
    <div className="space-y-7">
      {/* Price Filter */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Price
          </h3>

          <button
            type="button"
            onClick={() => {
              setMaxPrice(MAX_PRICE);
              setPriceInput(String(MAX_PRICE));
            }}
            className="text-xs text-primary hover:underline"
          >
            Reset
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">
              Maximum price
            </span>

            <span className="text-sm font-semibold text-primary">
              ₹{maxPrice.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Price Slider */}
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={100}
            value={maxPrice}
            onChange={(event) =>
              handleSliderChange(Number(event.target.value))
            }
            aria-label="Maximum price slider"
            className="h-1.5 w-full cursor-pointer accent-primary"
          />

          <div className="flex items-center justify-between text-xs text-muted">
            <span>₹{MIN_PRICE.toLocaleString("en-IN")}</span>
            <span>₹{MAX_PRICE.toLocaleString("en-IN")}</span>
          </div>

          {/* Manual Price Input */}
          <div>
            <label
              htmlFor="maximum-price"
              className="mb-2 block text-xs font-medium text-foreground"
            >
              Enter maximum amount
            </label>

            <div className="flex items-center overflow-hidden rounded-md border border-border bg-white transition-colors focus-within:border-primary">
              <span className="border-r border-border px-3 py-2.5 text-sm text-muted">
                ₹
              </span>

              <input
                id="maximum-price"
                type="number"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={100}
                value={priceInput}
                onChange={(event) =>
                  handlePriceInputChange(event.target.value)
                }
                onBlur={handlePriceInputBlur}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
                placeholder="Enter amount"
                className="w-full min-w-0 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none"
              />
            </div>

            <p className="mt-2 text-xs text-muted">
              Products within your budget will be displayed.
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Material Filter */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Material
        </h3>

        <div className="space-y-3">
          {materials.map((material) => (
            <label
              key={material}
              className="flex cursor-pointer items-center gap-3 text-sm text-foreground"
            >
              <input
                type="checkbox"
                checked={selectedMaterials.includes(material)}
                onChange={() => toggleMaterial(material)}
                className="h-4 w-4 cursor-pointer accent-primary"
              />

              {material}
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Availability Filter */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Availability
        </h3>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) =>
              setInStockOnly(event.target.checked)
            }
            className="h-4 w-4 cursor-pointer accent-primary"
          />

          In stock only
        </label>
      </div>
    </div>
  );

  return (
    <section className="section-container py-8 sm:py-12">
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-sm text-muted">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {products.length}
            </span>{" "}
            products
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground lg:hidden"
          >
            <Filter size={16} />
            Filters

            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              size={16}
              className="hidden text-muted sm:block"
            />

            <label
              htmlFor="sort-products"
              className="hidden text-sm text-muted sm:block"
            >
              Sort by:
            </label>

            <select
              id="sort-products"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SortOption)
              }
              className="rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-medium text-foreground">
            Active Filters:
          </span>

          {/* Price Chip */}
          {maxPrice < MAX_PRICE && (
            <button
              type="button"
              onClick={() => removeFilter("price")}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Maximum Price: ₹{maxPrice.toLocaleString("en-IN")}
              <X size={13} />
            </button>
          )}

          {/* Material Chips */}
          {selectedMaterials.map((material) => (
            <button
              key={material}
              type="button"
              onClick={() => removeFilter("material", material)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {material}
              <X size={13} />
            </button>
          ))}

          {/* Stock Chip */}
          {inStockOnly && (
            <button
              type="button"
              onClick={() => removeFilter("stock")}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              In Stock
              <X size={13} />
            </button>
          )}

          {/* Clear All */}
          <button
            type="button"
            onClick={clearAllFilters}
            className="ml-1 text-xs font-semibold text-primary underline underline-offset-4 hover:text-primary-dark"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Desktop Filters + Products */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[230px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-xl text-foreground">
                Filters
              </h2>

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-medium text-primary hover:underline"
              >
                Clear all
              </button>
            </div>

            {renderFilterContent()}
          </div>
        </aside>

        {/* Product Grid */}
        <div>
          <ProductGrid products={filteredProducts} />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-background p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-xl text-foreground">
                Filters
              </h2>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filter panel"
                className="rounded-full p-2 text-foreground hover:bg-secondary"
              >
                <X size={20} />
              </button>
            </div>

            <div className="pb-6">
              {renderFilterContent()}
            </div>

            {/* Drawer Actions */}
            <div className="sticky bottom-0 flex gap-3 border-t border-border bg-background py-4">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 rounded-md border border-border px-4 py-3 text-sm font-medium text-foreground"
              >
                Clear All
              </button>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 rounded-md bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
              >
                Show {filteredProducts.length} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
