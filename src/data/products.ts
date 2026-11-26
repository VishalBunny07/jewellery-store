
import type { Product } from "@/types/product";

interface CategoryProductData {
  category: string;
  prefix: string;
  names: string[];
  prices: number[];
  materials: string[];
  outOfStock: number[];
  bestSellers: number[];
}

const categoryProductData: CategoryProductData[] = [
  {
    category: "rings",
    prefix: "ring",
    names: [
      "Classic Solitaire Ring",
      "Floral Silver Ring",
      "Elegant Heart Ring",
      "Minimal Band Ring",
      "Royal Stone Ring",
      "Twisted Designer Ring",
      "Pearl Accent Ring",
      "Vintage Statement Ring",
      "Everyday Stackable Ring",
    ],
    prices: [1299, 899, 1599, 799, 2499, 1899, 1399, 2999, 999],
    materials: [
      "Silver",
      "Gold Plated",
      "Rose Gold",
      "Oxidised Silver",
      "Silver",
      "Gold Plated",
      "Rose Gold",
      "Oxidised Silver",
      "Silver",
    ],
    outOfStock: [6],
    bestSellers: [2, 4],
  },
  {
    category: "earrings",
    prefix: "earrings",
    names: [
      "Classic Hoop Earrings",
      "Floral Stud Earrings",
      "Pearl Drop Earrings",
      "Elegant Jhumka Earrings",
      "Minimal Daily Wear Studs",
      "Crystal Dangle Earrings",
      "Traditional Chandbali Earrings",
      "Modern Geometric Earrings",
      "Statement Party Earrings",
    ],
    prices: [1199, 899, 1699, 2499, 799, 1899, 2999, 1399, 3499],
    materials: [
      "Silver",
      "Gold Plated",
      "Rose Gold",
      "Oxidised Silver",
      "Silver",
      "Gold Plated",
      "Oxidised Silver",
      "Rose Gold",
      "Silver",
    ],
    outOfStock: [7],
    bestSellers: [2, 5],
  },
  {
    category: "pendants",
    prefix: "pendants",
    names: [
      "Heart Pendant Necklace",
      "Minimal Circle Pendant",
      "Floral Pendant Necklace",
      "Classic Solitaire Pendant",
      "Infinity Pendant",
      "Pearl Pendant Necklace",
      "Butterfly Pendant",
      "Elegant Stone Pendant",
      "Traditional Designer Pendant",
    ],
    prices: [1499, 999, 1799, 2499, 1299, 1899, 1199, 2299, 2999],
    materials: [
      "Silver",
      "Rose Gold",
      "Gold Plated",
      "Silver",
      "Rose Gold",
      "Oxidised Silver",
      "Silver",
      "Gold Plated",
      "Oxidised Silver",
    ],
    outOfStock: [5],
    bestSellers: [1, 4],
  },
  {
    category: "bracelets",
    prefix: "bracelets",
    names: [
      "Classic Chain Bracelet",
      "Heart Charm Bracelet",
      "Minimal Tennis Bracelet",
      "Floral Designer Bracelet",
      "Elegant Link Bracelet",
      "Pearl Charm Bracelet",
      "Infinity Bracelet",
      "Traditional Kada Bracelet",
      "Everyday Silver Bracelet",
    ],
    prices: [1299, 1599, 2499, 1899, 999, 1799, 1399, 2999, 1199],
    materials: [
      "Silver",
      "Gold Plated",
      "Rose Gold",
      "Silver",
      "Oxidised Silver",
      "Gold Plated",
      "Rose Gold",
      "Oxidised Silver",
      "Silver",
    ],
    outOfStock: [8],
    bestSellers: [2, 6],
  },
  {
    category: "mangalsutra",
    prefix: "mangalsutra",
    names: [
      "Traditional Black Bead Mangalsutra",
      "Minimal Daily Wear Mangalsutra",
      "Gold Plated Pendant Mangalsutra",
      "Floral Designer Mangalsutra",
      "Classic Short Mangalsutra",
      "Elegant Diamond Look Mangalsutra",
      "Modern Heart Mangalsutra",
      "Traditional Long Mangalsutra",
      "Contemporary Mangalsutra",
    ],
    prices: [2499, 1799, 2999, 3499, 1999, 3999, 2299, 4499, 2799],
    materials: [
      "Gold Plated",
      "Silver",
      "Gold Plated",
      "Rose Gold",
      "Silver",
      "Gold Plated",
      "Rose Gold",
      "Gold Plated",
      "Silver",
    ],
    outOfStock: [3],
    bestSellers: [1, 5],
  },
  {
    category: "anklets",
    prefix: "anklets",
    names: [
      "Classic Silver Anklet",
      "Minimal Chain Anklet",
      "Floral Charm Anklet",
      "Traditional Payal",
      "Pearl Beaded Anklet",
      "Elegant Double Layer Anklet",
      "Heart Charm Anklet",
      "Oxidised Designer Anklet",
      "Everyday Delicate Anklet",
    ],
    prices: [999, 799, 1299, 1899, 1499, 1699, 1199, 1999, 899],
    materials: [
      "Silver",
      "Gold Plated",
      "Rose Gold",
      "Oxidised Silver",
      "Silver",
      "Gold Plated",
      "Rose Gold",
      "Oxidised Silver",
      "Silver",
    ],
    outOfStock: [4],
    bestSellers: [0, 6],
  },
  {
    category: "jewellery-sets",
    prefix: "jewellery-sets",
    names: [
      "Elegant Necklace Set",
      "Traditional Bridal Jewellery Set",
      "Floral Pendant Jewellery Set",
      "Pearl Designer Jewellery Set",
      "Classic Party Wear Set",
      "Royal Stone Jewellery Set",
      "Minimal Necklace and Earrings Set",
      "Festive Designer Jewellery Set",
      "Contemporary Jewellery Set",
    ],
    prices: [2999, 4999, 3499, 3999, 2799, 5499, 2499, 4499, 3299],
    materials: [
      "Silver",
      "Gold Plated",
      "Rose Gold",
      "Oxidised Silver",
      "Gold Plated",
      "Gold Plated",
      "Silver",
      "Rose Gold",
      "Oxidised Silver",
    ],
    outOfStock: [7],
    bestSellers: [1, 5],
  },
];

// Generate products for all categories
const createProducts = ({
  category,
  prefix,
  names,
  prices,
  materials,
  outOfStock,
  bestSellers,
}: CategoryProductData): Product[] => {
  return names.map((name, index) => {
    const isNew = index === 0 || index === 1;
    const isBestSeller = bestSellers.includes(index);
    const inStock = !outOfStock.includes(index);

    const discount = index % 3 === 0 ? 0.2 : index % 3 === 1 ? 0.15 : 0.1;

    return {
      id: `${category}-${index + 1}`,
      name,
      slug: `${category}-${index + 1}`,
      category,
      image: `/images/reference-giva/categories/${category}/${prefix}-${String(index + 2).padStart(2, "0")}.webp`,
      price: prices[index],
      originalPrice: Math.round(prices[index] / (1 - discount)),
      material: materials[index],
      description: `${name} designed to bring elegance and style to everyday wear and special occasions.`,
      isNew,
      isBestSeller,
      inStock,
    };
  });
};

export const products: Product[] = categoryProductData.flatMap(
  (category) => createProducts(category)
);
