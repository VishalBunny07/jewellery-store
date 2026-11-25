
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";

export default function CategorySection() {
  return (
    <section className="section-container py-10 sm:py-14">
      <div className="mb-7 text-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
          Find Your Style
        </span>

        <h2 className="section-heading mt-2">
          Shop by Category
        </h2>

        <p className="mt-2 text-sm text-muted">
          Discover something beautiful for every moment.
        </p>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-4 sm:gap-8 lg:grid-cols-8 lg:gap-5">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group flex w-100px shrink-0 flex-col items-center sm:w-full"
          >
            <div className="relative aspect-square w-100px overflow-hidden rounded-full bg-secondary sm:w-full">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100px, 150px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <span className="mt-3 text-center text-xs font-medium text-foreground transition-colors group-hover:text-primary sm:text-sm">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
