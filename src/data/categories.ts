
export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Rings",
    slug: "rings",
    image: "/images/categories/rings/category.jpg",
  },
  {
    id: "2",
    name: "Earrings",
    slug: "earrings",
    image: "/images/categories/earrings/category.jpg",
  },
  {
    id: "3",
    name: "Necklaces",
    slug: "necklaces",
    image: "/images/categories/necklaces/category.jpg",
  },
  {
    id: "4",
    name: "Bracelets",
    slug: "bracelets",
    image: "/images/categories/bracelets/category.jpg",
  },
  {
    id: "5",
    name: "Mangalsutra",
    slug: "mangalsutra",
    image: "/images/categories/mangalsutra/category.jpg",
  },
  {
    id: "6",
    name: "Anklets",
    slug: "anklets",
    image: "/images/categories/anklets/category.jpg",
  },
  {
    id: "7",
    name: "Jewellery Sets",
    slug: "jewellery-sets",
    image: "/images/categories/jewellery-sets/category.jpg",
  },
  {
    id: "8",
    name: "Gifts",
    slug: "gifts",
    image: "/images/categories/gifts/category.jpg",
  },
];
