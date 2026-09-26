import Link from "next/link";
import { FilterPanel } from "@/components/catalogue/filter-panel";
import type { Metadata } from "next";
import { Storefront } from "@/components/home/storefront";
import { ProductCard } from "@/components/catalogue/product-card";
import { getProducts } from "@/lib/products";
import { stockState } from "@/lib/stock";
import styles from "@/components/catalogue/catalogue.module.css";

export const metadata: Metadata = {
  title: "The collection — Atelier",
  description:
    "Explore considered clothing, bags, shoes and accessories from the Atelier sample collection.",
};
const categories = ["Clothing", "Bags", "Accessories", "Shoes"];
const single = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : "";
export default async function CollectionPage({
  searchParams,
}: PageProps<"/new-arrivals">) {
  const params = await searchParams;
  const category = categories.includes(single(params.category))
    ? single(params.category)
    : "";
  const query = single(params.q).trim().slice(0, 100);
  const availability =
    single(params.availability) === "available" ? "available" : "";
  const sort = ["price-low", "price-high"].includes(single(params.sort))
    ? single(params.sort)
    : "newest";
  const products = getProducts();
  const visible = products.filter(
    (p) =>
      (!category || p.category === category) &&
      (!availability || ["available", "low"].includes(stockState(p))) &&
      `${p.name} ${p.category} ${p.color}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  if (sort !== "newest")
    visible.sort((a, b) =>
      sort === "price-low" ? a.price - b.price : b.price - a.price,
    );
  const filtered = !!(category || query || availability || sort !== "newest");
  return (
    <Storefront products={products}>
      <div className={`page-container ${styles.listing}`}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>The collection</span>
        </nav>
        <header className={styles.intro}>
          <div>
            <p className="eyebrow text-muted">AUTUMN / WINTER 2026</p>
            <h1>{category || "The collection"}</h1>
          </div>
          <p>
            Soft structure. Everyday companions.
            <br />
            Pieces to make your own.
          </p>
        </header>
        <FilterPanel><form
          action="/new-arrivals"
          className={styles.filters}
          key={`${category}-${query}-${availability}-${sort}`}
        >
          <label>
            Category
            <select name="category" defaultValue={category}>
              <option value="">All pieces</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Availability
            <select name="availability" defaultValue={availability}>
              <option value="">All availability</option>
              <option value="available">In stock</option>
            </select>
          </label>
          <label className={styles.search}>
            Find a piece
            <input
              type="search"
              name="q"
              placeholder="Name, category or color"
              defaultValue={query}
              maxLength={100}
            />
          </label>
          <label>
            Sort by
            <select name="sort" defaultValue={sort}>
              <option value="newest">Newest first</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
          <button className="button button-secondary" type="submit">
            Apply
          </button>
        </form></FilterPanel>
        <div className={styles.results}>
          <p role="status">
            {visible.length} {visible.length === 1 ? "piece" : "pieces"}
            {category ? ` / ${category}` : ""}
            {query ? ` / “${query}”` : ""}
          </p>
          {filtered && (
            <Link href="/new-arrivals" className="text-link">
              Clear filters
            </Link>
          )}
        </div>
        {visible.length ? (
          <div className={styles.grid}>
            {visible.map((p) => (
              <ProductCard key={p.slug} product={p} showStock />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <h2>No pieces found</h2>
            <p>Try another category or a different search.</p>
            <Link className="button button-secondary" href="/new-arrivals">
              View all pieces
            </Link>
          </div>
        )}
        <p className={styles.sample}>
          Collection preview · Sample products, prices and availability.
        </p>
      </div>
    </Storefront>
  );
}
