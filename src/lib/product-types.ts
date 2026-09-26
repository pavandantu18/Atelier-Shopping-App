export type ProductCategory = "Clothing" | "Bags" | "Accessories" | "Shoes";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  color: string;
  swatch: string;
  image: string;
  alt: string;
  description: string;
  details: string[];
  stockQuantity: number;
  madeToOrder: boolean;
};
