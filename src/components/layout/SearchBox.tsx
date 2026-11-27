"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";
import type { Product } from "@/types/product";

interface SearchResponse {
  success: boolean;
  products: Product[];
  count: number;
  message?: string;
}

export default function SearchBox() {
  const router = useRouter();

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState("");

  const trimmedQuery = query.trim();

  // Fetch matching products with debounce.
  useEffect(() => {
    if (trimmedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/products/search?q=${encodeURIComponent(trimmedQuery)}`,
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Unable to search products.");
        }

        const data: SearchResponse = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Search failed.");
        }

        setProducts(data.products);
        setSearchedQuery(trimmedQuery);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setProducts([]);
        setSearchedQuery(trimmedQuery);
        setError("Something went wrong. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [trimmedQuery]);

  // Close suggestions when clicking outside.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigate to the full search page.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!trimmedQuery) return;

    setIsOpen(false);
    inputRef.current?.blur();

    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  }

  // Keyboard controls.
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  // Clear the search input.
  function handleClear() {
    setQuery("");
    setProducts([]);
    setError("");
    setSearchedQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  }

  const showResults =
    isOpen &&
    trimmedQuery.length >= 2 &&
    searchedQuery === trimmedQuery &&
    !isLoading;

  const showEmptyState =
    showResults && products.length === 0 && !error;

    useEffect(() => {
  console.log("SEARCH BOX MOUNTED");

  return () => {
    console.log("SEARCH BOX UNMOUNTED");
  };
}, []);

useEffect(() => {
  const input = inputRef.current;

  const handleFocus = () => console.log("INPUT FOCUSED");
  const handleBlur = () => console.log("INPUT LOST FOCUS");

  input?.addEventListener("focus", handleFocus);
  input?.addEventListener("blur", handleBlur);

  return () => {
    input?.removeEventListener("focus", handleFocus);
    input?.removeEventListener("blur", handleBlur);
  };
}, []);

  return (
    <div
      ref={searchRef}
      className="relative w-full [overflow-anchor:none]"
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center gap-2 border-b border-border py-2"
      >
        <Search
          size={19}
          strokeWidth={1.5}
          className="shrink-0 text-muted"
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setError("");
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search jewellery..."
          autoComplete="off"
          aria-label="Search jewellery products"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
        />

        {isLoading && trimmedQuery.length >= 2 && (
          <Loader2
            size={17}
            className="shrink-0 animate-spin text-muted"
          />
        )}

        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="shrink-0 text-muted transition hover:text-foreground"
          >
            <X size={17} />
          </button>
        )}
      </form>

      {/* Search suggestions */}
      {isOpen && trimmedQuery.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-60 mt-2 overflow-hidden rounded-lg border border-border bg-white shadow-xl">
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-muted">
              <Loader2 size={17} className="animate-spin" />
              Searching products...
            </div>
          )}

          {/* Error */}
          {showResults && error && (
            <div className="px-4 py-6 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {/* No results */}
          {showEmptyState && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm font-medium text-foreground">
                No products found
              </p>
              <p className="mt-1 text-xs text-muted">
                Try searching with another keyword.
              </p>
            </div>
          )}

          {/* Product results */}
          {showResults && products.length > 0 && (
            <div>
              <div className="border-b border-border px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Products
                </p>
              </div>

              <div className="max-h-360px overflow-y-auto">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 border-b border-border p-3 transition hover:bg-background last:border-b-0"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-background">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Search size={18} className="text-muted" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {product.material}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-primary">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  router.push(
                    `/search?q=${encodeURIComponent(trimmedQuery)}`
                  );
                }}
                className="w-full border-t border-border px-4 py-3 text-center text-sm font-medium text-primary transition hover:bg-background"
              >
                View all results
              </button>
            </div>
          )}
        </div>
      )}

      {/* Minimum search length hint */}
      {isOpen &&
        trimmedQuery.length === 1 && (
          <div className="absolute left-0 right-0 top-full z-60 mt-2 rounded-lg border border-border bg-white px-4 py-3 text-xs text-muted shadow-lg">
            Enter at least 2 characters to search.
          </div>
        )}
    </div>
  );
}



















// TESTING CODE GIVE BY CHATGPT FOR SCROLL ISSUE
// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Search, X } from "lucide-react";

// export default function SearchBox() {
//   const router = useRouter();

//   const searchRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const [query, setQuery] = useState("");
//   const [isOpen, setIsOpen] = useState(false);

//   const trimmedQuery = query.trim();

//   // Close suggestions when clicking outside.
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         searchRef.current &&
//         !searchRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Navigate to search results.
//   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     if (!trimmedQuery) return;

//     setIsOpen(false);
//     inputRef.current?.blur();

//     router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
//   }

//   // Handle keyboard input.
//   function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
//     if (event.key === "Escape") {
//       setIsOpen(false);
//       inputRef.current?.blur();
//     }
//   }

//   // Clear search.
//   function handleClear() {
//     setQuery("");
//     setIsOpen(false);
//     inputRef.current?.focus();
//   }

//   return (
//     <div
//       ref={searchRef}
//       className="relative w-full"
//     >
//       <form
//         onSubmit={handleSubmit}
//         className="flex w-full items-center gap-2 border-b border-border py-2"
//       >
//         <Search
//           size={19}
//           strokeWidth={1.5}
//           className="shrink-0 text-muted"
//         />

//         <input
//           ref={inputRef}
//           type="text"
//           value={query}
//           onChange={(event) => {
//             setQuery(event.target.value);
//             setIsOpen(true);
//           }}
//           onFocus={() => setIsOpen(true)}
//           onKeyDown={handleKeyDown}
//           placeholder="Search jewellery..."
//           autoComplete="off"
//           aria-label="Search jewellery products"
//           className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
//         />

//         {query.length > 0 && (
//           <button
//             type="button"
//             onClick={handleClear}
//             aria-label="Clear search"
//             className="shrink-0 text-muted transition hover:text-foreground"
//           >
//             <X size={17} />
//           </button>
//         )}
//       </form>

//       {isOpen && trimmedQuery.length === 1 && (
//         <div className="absolute left-0 right-0 top-full z-[60] mt-2 rounded-lg border border-border bg-white px-4 py-3 text-xs text-muted shadow-lg">
//           Enter at least 2 characters to search.
//         </div>
//       )}

//       {isOpen && trimmedQuery.length >= 2 && (
//         <div className="absolute left-0 right-0 top-full z-[60] mt-2 rounded-lg border border-border bg-white px-4 py-4 text-center text-sm text-muted shadow-lg">
//           Search suggestions are temporarily disabled for testing.
//         </div>
//       )}
//     </div>
//   );
// }


