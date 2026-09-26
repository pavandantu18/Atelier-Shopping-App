import "server-only";
import type { Product } from "@/lib/product-types";

// Sample catalogue. Replace this source with database queries when the
// catalogue is implemented; consumers already receive the mapped Product shape.
type ProductRecord = Omit<Product, "price"> & {
  priceCents: number;
  createdAt: string;
};
const records: ProductRecord[] = [
  {
    slug: "sculpted-wrap-coat",
    name: "The sculpted wrap coat",
    category: "Clothing",
    priceCents: 48500,
    color: "Camel",
    swatch: "#a87b4f",
    image: "/images/wool-coat.jpg",
    alt: "Belted camel coat with wide lapels, worn over a black outfit",
    description:
      "A camel wrap coat with wide lapels and a self-tie belt. The relaxed silhouette layers easily over everyday separates.",
    details: ["Wide lapel collar", "Self-tie waist belt", "Longline silhouette"],
    stockQuantity: 8,
    madeToOrder: false,
    createdAt: "2026-09-25",
  },
  {
    slug: "everyday-satchel",
    name: "The everyday satchel",
    category: "Bags",
    priceCents: 29500,
    color: "Cognac",
    swatch: "#ac673e",
    image: "/images/leather-bag.jpg",
    alt: "Cognac shoulder satchel with dark straps and brass buckles",
    description:
      "A cognac satchel with contrasting dark straps and brass-tone buckle details. Finished with a shoulder strap and a structured flap.",
    details: ["Flap-front silhouette", "Twin buckle details", "Contrasting shoulder strap"],
    stockQuantity: 2,
    madeToOrder: false,
    createdAt: "2026-09-24",
  },
  {
    slug: "round-frame",
    name: "The round frame",
    category: "Accessories",
    priceCents: 14500,
    color: "Gold / Forest",
    swatch: "#556d65",
    image: "/images/sunglasses.jpg",
    alt: "Round gold-tone sunglasses with dark green lenses",
    description:
      "Round sunglasses with a fine gold-tone frame and forest-green lenses. A curved bridge and slender temples complete the profile.",
    details: ["Round forest-green lenses", "Gold-tone frame", "Curved bridge and slender temples"],
    stockQuantity: 0,
    madeToOrder: false,
    createdAt: "2026-09-23",
  },
  {
    slug: "suede-derby",
    name: "The suede derby",
    category: "Shoes",
    priceCents: 22500,
    color: "Sage",
    swatch: "#6b938b",
    image: "/images/leather-shoes.jpg",
    alt: "Sage suede derby shoe with a low wooden heel",
    description:
      "A sage lace-up derby with decorative perforations and a low stacked-look heel. A classic shape in a soft green shade.",
    details: ["Lace-up fastening", "Decorative perforations", "Low heel"],
    stockQuantity: 0,
    madeToOrder: true,
    createdAt: "2026-09-22",
  },
];

function mapProduct({
  priceCents,
  createdAt: _createdAt,
  ...product
}: ProductRecord): Product {
  void _createdAt;
  return { ...product, price: priceCents / 100 };
}

export function getProducts(): Product[] {
  return [...records]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(mapProduct);
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((product) => product.slug === slug);
}
