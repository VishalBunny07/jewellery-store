
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getProductBySlug } from "@/services/product.service";
import ProductDetails from "@/components/products/ProductDetails";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Fetch product from PostgreSQL.
async function ProductPageContent({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  // console.log("PRODUCT IMAGE DEBUG:", {
  //   slug,
  //   productFound: Boolean(product),
  //   image: product?.image,
  //   images: product?.images,
  // });

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}

// Loading skeleton.
function ProductLoading() {
  return (
    <div className="section-container animate-pulse py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="aspect-4/5 rounded-sm bg-secondary" />

        <div className="space-y-5">
          <div className="h-4 w-32 rounded bg-secondary" />
          <div className="h-10 w-3/4 rounded bg-secondary" />
          <div className="h-5 w-1/3 rounded bg-secondary" />
          <div className="h-12 w-full rounded bg-secondary" />
        </div>
      </div>
    </div>
  );
}

// Main product page.
export default function ProductPage({
  params,
}: ProductPageProps) {
  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductPageContent params={params} />
    </Suspense>
  );
}
