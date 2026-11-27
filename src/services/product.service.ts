
import "server-only";
import { Pool } from "pg";

import type { Product } from "@/types/product";
import {
  categories as staticCategories,
  type Category,
} from "@/data/categories";

// Reuse the PostgreSQL connection during development.
const globalForPostgres = globalThis as typeof globalThis & {
  jewelleryPool?: Pool;
};

const pool =
  globalForPostgres.jewelleryPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.jewelleryPool = pool;
}

// Database result types.
interface CategoryRow {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  bannerImage: string | null;
}

interface ProductRow {
  id: number;
  name: string;
  slug: string;
  category: string;
  image: string | null;
  images: string[] | null;
  price: string;
  originalPrice: string | null;
  material: string | null;
  description: string | null;
  isNew: boolean;
  isBestSeller: boolean;
  quantity: number | null;
}

// Convert database product into the existing storefront Product type.
function mapProduct(row: ProductRow): Product {
  return {
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    category: row.category,
    image: row.image || "/images/placeholder.webp",
    images: row.images?.length ? row.images : undefined,
    price: Number(row.price),
    originalPrice: row.originalPrice
      ? Number(row.originalPrice)
      : undefined,
    material: row.material || "Jewellery",
    description: row.description || "",
    isNew: row.isNew,
    isBestSeller: row.isBestSeller,
    inStock: (row.quantity ?? 0) > 0,
  };
}

// Shared product query.
const PRODUCT_SELECT = `
  SELECT
    p."id",
    p."name",
    p."slug",
    c."slug" AS "category",

    (
      SELECT pi."imageUrl"
      FROM "ProductImage" pi
      WHERE pi."productId" = p."id"
      ORDER BY
        pi."isPrimary" DESC,
        pi."sortOrder" ASC,
        pi."id" ASC
      LIMIT 1
    ) AS "image",

    ARRAY(
      SELECT pi."imageUrl"
      FROM "ProductImage" pi
      WHERE pi."productId" = p."id"
      ORDER BY
        pi."isPrimary" DESC,
        pi."sortOrder" ASC,
        pi."id" ASC
    ) AS "images",

    p."price"::text AS "price",
    p."compareAtPrice"::text AS "originalPrice",
    p."material",
    p."description",
    p."isNew",
    p."isBestSeller",

    COALESCE(
      (
        SELECT SUM(i."quantity" - i."reserved")
        FROM "Inventory" i
        WHERE i."productId" = p."id"
      ),
      0
    )::int AS "quantity"

  FROM "Product" p

  INNER JOIN "Category" c
    ON c."id" = p."categoryId"

  WHERE
    p."isActive" = true
    AND c."isActive" = true
`;

// Fetch all active categories.
export async function getActiveCategories(): Promise<Category[]> {
  const result = await pool.query<CategoryRow>(
    `
      SELECT
        "id",
        "name",
        "slug",
        "image",
        "bannerImage"
      FROM "Category"
      WHERE "isActive" = true
      ORDER BY "sortOrder" ASC, "id" ASC
    `
  );

  return result.rows.map((row) => {
    const staticCategory = staticCategories.find(
      (category) => category.slug === row.slug
    );

    return {
      id: String(row.id),
      name: row.name,
      slug: row.slug,
      image: row.image || staticCategory?.image || "",
      bannerImage:
        row.bannerImage || staticCategory?.bannerImage || "",
    };
  });
}

// Fetch one active category from PostgreSQL.
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const result = await pool.query<CategoryRow>(
    `
      SELECT
        "id",
        "name",
        "slug",
        "image",
        "bannerImage"
      FROM "Category"
      WHERE
        "slug" = $1
        AND "isActive" = true
      LIMIT 1
    `,
    [slug]
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  const staticCategory = staticCategories.find(
    (category) => category.slug === row.slug
  );

  return {
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    image: row.image || staticCategory?.image || "",
    bannerImage:
      row.bannerImage || staticCategory?.bannerImage || "",
  };
}

// Fetch products belonging to a category.
export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const result = await pool.query<ProductRow>(
    `
      ${PRODUCT_SELECT}
      AND c."slug" = $1
      ORDER BY p."id" ASC
    `,
    [categorySlug]
  );

  return result.rows.map(mapProduct);
}

// Fetch new arrivals.
export async function getNewArrivals(
  limit = 8
): Promise<Product[]> {
  const result = await pool.query<ProductRow>(
    `
      ${PRODUCT_SELECT}
      AND p."isNew" = true
      ORDER BY p."createdAt" DESC, p."id" DESC
      LIMIT $1
    `,
    [limit]
  );

  return result.rows.map(mapProduct);
}

// Fetch best sellers.
export async function getBestSellers(
  limit = 8
): Promise<Product[]> {
  const result = await pool.query<ProductRow>(
    `
      ${PRODUCT_SELECT}
      AND p."isBestSeller" = true
      ORDER BY p."id" ASC
      LIMIT $1
    `,
    [limit]
  );

  return result.rows.map(mapProduct);
}

// Fetch featured products.
export async function getFeaturedProducts(
  limit = 8
): Promise<Product[]> {
  const result = await pool.query<ProductRow>(
    `
      ${PRODUCT_SELECT}
      AND (
        p."isFeatured" = true
        OR p."isBestSeller" = true
      )
      ORDER BY
        p."isFeatured" DESC,
        p."id" ASC
      LIMIT $1
    `,
    [limit]
  );

  return result.rows.map(mapProduct);
}

// Fetch one product using its slug.
export async function getProductBySlug(
  productSlug: string
): Promise<Product | null> {
  const result = await pool.query<ProductRow>(
    `
      ${PRODUCT_SELECT}
      AND p."slug" = $1
      LIMIT 1
    `,
    [productSlug]
  );

  const row = result.rows[0];

  return row ? mapProduct(row) : null;
}


// Search active products by name, description, material or category.
export async function searchProducts(
  searchTerm: string,
  limit = 8
): Promise<Product[]> {
  const term = searchTerm.trim();

  if (!term) {
    return [];
  }

  const searchPattern = `%${term}%`;

  const result = await pool.query<ProductRow>(
    `
      ${PRODUCT_SELECT}
      AND (
        p."name" ILIKE $1
        OR p."description" ILIKE $1
        OR p."material" ILIKE $1
        OR c."name" ILIKE $1
        OR c."slug" ILIKE $1
      )
      ORDER BY
        CASE
          WHEN p."name" ILIKE $2 THEN 0
          WHEN c."name" ILIKE $2 THEN 1
          ELSE 2
        END,
        p."id" ASC
      LIMIT $3
    `,
    [searchPattern, term, limit]
  );

  return result.rows.map(mapProduct);
}
