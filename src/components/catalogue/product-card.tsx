import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Product } from "@/lib/product-types";
import { currency } from "@/lib/format";
import { stockCopy, stockState } from "@/lib/stock";
import styles from "../home/storefront.module.css";

export function ProductCard({
  product,
  action,
  showStock = false,
}: {
  product: Product;
  action?: ReactNode;
  showStock?: boolean;
}) {
  return (
    <article className={styles.productCard}>
      <div className={styles.productVisual}>
        <Link
          href={`/products/${product.slug}`}
          className={styles.productImage}
          aria-label={`View ${product.name}`}
        >
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes="(max-width: 1023px) 50vw, 25vw"
          />
          <span className={styles.quickView}>
            Discover piece <span aria-hidden="true">↗</span>
          </span>
        </Link>
        {action}
      </div>
      <div className={styles.productInfo}>
        <div>
          <Link
            href={`/products/${product.slug}`}
            className={styles.productName}
          >
            {product.name}
          </Link>
          <p className="text-small text-muted">{product.color}</p>
        </div>
        <p className={styles.price}>{currency.format(product.price)}</p>
      </div>
      <span
        className={styles.swatch}
        style={{ "--swatch": product.swatch } as CSSProperties}
        aria-label={`Color: ${product.color}`}
      />
      {showStock && (
        <p className="text-label text-muted mt-4">
          {stockCopy[stockState(product)]}
        </p>
      )}
    </article>
  );
}
