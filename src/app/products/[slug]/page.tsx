import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Storefront } from "@/components/home/storefront";
import { ProductCard } from "@/components/catalogue/product-card";
import { ProductGallery } from "@/components/catalogue/product-gallery";
import { getProduct, getProducts } from "@/lib/products";
import { currency } from "@/lib/format";
import { stockCopy, stockState, stockTone } from "@/lib/stock";
import styles from "@/components/catalogue/catalogue.module.css";
export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return {
    title: product ? `${product.name} — Atelier` : "Piece not found — Atelier",
    description: product?.description,
  };
}
export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const products = getProducts();
  const state = stockState(product);
  const categoryHref = `/new-arrivals?category=${encodeURIComponent(product.category)}`;
  return (
    <Storefront products={products}>
      <div className="page-container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/new-arrivals">The collection</Link>
          <span aria-hidden="true">/</span>
          <Link href={categoryHref}>{product.category}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>
        <section className={styles.detail} aria-labelledby="product-title">
          <ProductGallery product={product} />
          <div className={styles.copy}>
            <Link href={categoryHref} className="eyebrow text-muted">
              {product.category}
            </Link>
            <h1 id="product-title">{product.name}</h1>
            <p className={styles.price}>{currency.format(product.price)}</p>
            <p className={styles.description}>{product.description}</p>
            <p className={styles.color}>
              <span
                className={styles.swatch}
                style={{ backgroundColor: product.swatch }}
                aria-hidden="true"
              />
              Color: {product.color}
            </p>
            <p className={styles.stock} data-tone={stockTone[state]}>
              {stockCopy[state]}
            </p>
            <details open>
              <summary>Product details</summary>
              <ul className={styles.specifications}>{product.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
            </details>
            <Link href={categoryHref} className="text-link text-small">
              Explore {product.category.toLowerCase()} ↗
            </Link>
          </div>
        </section>
        <section className={styles.related} aria-labelledby="related-title">
          <div className={styles.relatedHeading}>
            <h2 id="related-title">Also in the edit</h2>
            <Link href="/new-arrivals" className="text-link">
              View all pieces ↗
            </Link>
          </div>
          <div className={styles.grid}>
            {products
              .filter((p) => p.slug !== product.slug)
              .map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
          </div>
        </section>
      </div>
    </Storefront>
  );
}
