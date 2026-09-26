import type { Product } from "./product-types";
export type StockState = "available" | "low" | "unavailable" | "made-to-order";
export function stockState(
  product: Pick<Product, "stockQuantity" | "madeToOrder">,
): StockState {
  if (product.madeToOrder) return "made-to-order";
  if (product.stockQuantity <= 0) return "unavailable";
  return product.stockQuantity <= 3 ? "low" : "available";
}
export const stockCopy: Record<StockState, string> = {
  available: "In stock",
  low: "Only a few left",
  unavailable: "Out of stock",
  "made-to-order": "Made to order",
};
export const stockTone: Record<StockState, string> = {
  available: "available",
  low: "low",
  unavailable: "unavailable",
  "made-to-order": "order",
};
