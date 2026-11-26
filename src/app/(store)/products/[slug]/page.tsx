
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { products } from "@/data/products";
import ProductDetails from "@/components/products/ProductDetails";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function ProductPageContent({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}

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

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductPageContent params={params} />
    </Suspense>
  );
}
