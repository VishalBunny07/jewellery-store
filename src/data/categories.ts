
export interface Category {
  id: string;
  name: string;
  slug: string;
  bannerImage: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Rings",
    slug: "rings",
    bannerImage: "/images/reference-giva/categories/rings/ring-01.webp",
    image: "/images/reference-giva/categories/rings/ring-02.webp",
  },
  {
    id: "2",
    name: "Earrings",
    slug: "earrings",
    bannerImage: "/images/reference-giva/categories/earrings/earrings-01.webp",
    image: "/images/reference-giva/categories/earrings/earrings-02.webp",
  },
  {
    id: "3",
    name: "Pendants",
    slug: "pendants",
    bannerImage: "/images/reference-giva/categories/pendants/pendants-01.webp",
    image: "/images/reference-giva/categories/pendants/pendants-02.webp",
  },
  {
    id: "4",
    name: "Bracelets",
    slug: "bracelets",
    bannerImage: "/images/reference-giva/categories/bracelets/bracelets-01.webp",
    image: "/images/reference-giva/categories/bracelets/bracelets-02.webp",
  },
  {
    id: "5",
    name: "Mangalsutra",
    slug: "mangalsutra",
    bannerImage: "/images/reference-giva/categories/mangalsutra/mangalsutra-01.webp",
    image: "/images/reference-giva/categories/mangalsutra/mangalsutra-02.webp",
  },
  {
    id: "6",
    name: "Anklets",
    slug: "anklets",
    bannerImage: "/images/reference-giva/categories/anklets/anklets-01.webp",
    image: "/images/reference-giva/categories/anklets/anklets-02.webp",
  },
  {
    id: "7",
    name: "Jewellery Sets",
    slug: "jewellery-sets",
    bannerImage: "/images/reference-giva/categories/jewellery-sets/jewellery-sets-01.webp",
    image: "/images/reference-giva/categories/jewellery-sets/jewellery-sets-02.webp",
  },
  // {
  //   id: "8",
  //   name: "Gifts",
  //   slug: "gifts",
  //   bannerImage: "/images/reference-giva/categories/gifts/gift-01.webp",
  //   image: "/images/reference-giva/categories/gifts/gift-02.webp",
  // },
];
