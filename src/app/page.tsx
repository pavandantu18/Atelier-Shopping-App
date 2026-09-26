import { Storefront } from "@/components/home/storefront";
import { getProducts } from "@/lib/products";

export default function Home() {
  return <Storefront products={getProducts()} />;
}
