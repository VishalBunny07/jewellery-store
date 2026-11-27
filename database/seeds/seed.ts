
import "dotenv/config";
import { Pool } from "pg";

import { categories } from "../../src/data/categories";
import { products } from "../../src/data/products";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing from .env");
}

const pool = new Pool({
  connectionString,
});

// Generate URL-friendly slugs.
function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Handle duplicate product names.
const slugCounts = new Map<string, number>();

for (const product of products) {
  const baseSlug = slugify(product.name);
  slugCounts.set(baseSlug, (slugCounts.get(baseSlug) ?? 0) + 1);
}

function generateProductSlug(
  name: string,
  category: string,
  index: number
): string {
  const baseSlug = slugify(name);

  if ((slugCounts.get(baseSlug) ?? 0) > 1) {
    return `${baseSlug}-${slugify(category)}-${index}`;
  }

  return baseSlug;
}

async function seedDatabase() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("Starting jewellery store seed...");

    // 1. Insert or update categories.
    const categoryIds = new Map<string, number>();

    for (const category of categories) {
      const result = await client.query(
        `
          INSERT INTO "Category"
            (
              "name",
              "slug",
              "image",
              "bannerImage",
              "isActive",
              "sortOrder",
              "createdAt",
              "updatedAt"
            )
          VALUES ($1, $2, $3, $4, true, $5, NOW(), NOW())

          ON CONFLICT ("slug")
          DO UPDATE SET
            "name" = EXCLUDED."name",
            "image" = EXCLUDED."image",
            "bannerImage" = EXCLUDED."bannerImage",
            "updatedAt" = NOW()

          RETURNING "id"
        `,
        [
          category.name,
          category.slug,
          category.image,
          category.bannerImage,
          Number(category.id),
        ]
      );

      categoryIds.set(category.slug, result.rows[0].id);
    }

    console.log(`Categories processed: ${categoryIds.size}`);

    // 2. Insert or update products.
    for (const [index, product] of products.entries()) {
      const categoryId = categoryIds.get(product.category);

      if (!categoryId) {
        throw new Error(`Category not found: ${product.category}`);
      }

      // Preserve existing SKU generation.
      const productIndex =
        Number(product.slug.split("-").pop()) || index + 1;

      const sku = `${product.category.toUpperCase()}-${String(
        productIndex
      ).padStart(3, "0")}`;

      // Generate SEO-friendly product slug.
      const seoSlug = generateProductSlug(
        product.name,
        product.category,
        productIndex
      );

      const productResult = await client.query(
        `
          INSERT INTO "Product"
            (
              "name",
              "slug",
              "sku",
              "description",
              "categoryId",
              "price",
              "compareAtPrice",
              "material",
              "isActive",
              "isNew",
              "isBestSeller",
              "createdAt",
              "updatedAt"
            )
          VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, true, $9, $10, NOW(), NOW())

          ON CONFLICT ("sku")
          DO UPDATE SET
            "name" = EXCLUDED."name",
            "slug" = EXCLUDED."slug",
            "description" = EXCLUDED."description",
            "categoryId" = EXCLUDED."categoryId",
            "price" = EXCLUDED."price",
            "compareAtPrice" = EXCLUDED."compareAtPrice",
            "material" = EXCLUDED."material",
            "isActive" = true,
            "isNew" = EXCLUDED."isNew",
            "isBestSeller" = EXCLUDED."isBestSeller",
            "updatedAt" = NOW()

          RETURNING "id"
        `,
        [
          product.name,
          seoSlug,
          sku,
          product.description,
          categoryId,
          product.price,
          product.originalPrice ?? null,
          product.material,
          product.isNew ?? false,
          product.isBestSeller ?? false,
        ]
      );

      const productId = productResult.rows[0].id;

      // 3. Synchronize product images.
      await client.query(
        `
          DELETE FROM "ProductImage"
          WHERE "productId" = $1
        `,
        [productId]
      );

      await client.query(
        `
          INSERT INTO "ProductImage"
            (
              "productId",
              "imageUrl",
              "altText",
              "sortOrder",
              "isPrimary",
              "createdAt"
            )
          VALUES ($1, $2, $3, 0, true, NOW())
        `,
        [productId, product.image, product.name]
      );

      // 4. Insert inventory without resetting existing stock.
      await client.query(
        `
          INSERT INTO "Inventory"
            (
              "productId",
              "sourceCode",
              "sourceType",
              "quantity",
              "reserved",
              "reorderLevel",
              "createdAt",
              "updatedAt"
            )
          VALUES
            ($1, 'OWN-WAREHOUSE', 'OWN', $2, 0, 2, NOW(), NOW())

          ON CONFLICT ("productId", "sourceCode")
          DO NOTHING
        `,
        [productId, product.inStock ? 10 : 0]
      );
    }

    await client.query("COMMIT");

    console.log("================================");
    console.log("Jewellery store seed completed!");
    console.log(`Categories: ${categories.length}`);
    console.log(`Products: ${products.length}`);
    console.log("SEO-friendly slugs generated.");
    console.log("Product images synchronized.");
    console.log("Existing inventory preserved.");
    console.log("================================");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Seed failed. Transaction rolled back:", error);

    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

