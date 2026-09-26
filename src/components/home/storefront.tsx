"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/catalogue/product-card";
import type { Product, ProductCategory } from "@/lib/product-types";
import { currency } from "@/lib/format";
import styles from "./storefront.module.css";

type IconName = "arrow" | "search" | "heart" | "menu" | "close" | "plus";
function Icon({ name, filled = false }: { name: IconName; filled?: boolean }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M4 12h15M13 6l6 6-6 6" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    heart: (
      <path d="M20.8 4.9a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.3a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    menu: (
      <>
        <path d="M3 7h18M3 17h18" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M6 18 18 6" />
      </>
    ),
    plus: (
      <>
        <path d="M12 4v16M4 12h16" />
      </>
    ),
  };
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const categories = [
  "All pieces",
  "Clothing",
  "Bags",
  "Accessories",
  "Shoes",
] as const;
type Category = (typeof categories)[number];
type Panel = "search" | "menu" | "saved" | Product | null;

export function Storefront({
  products,
  children,
}: {
  products: Product[];
  children?: ReactNode;
}) {
  const [category, setCategory] = useState<Category>("All pieces");
  const [panel, setPanel] = useState<Panel>(null);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const visibleProducts = products.filter(
    (p) => category === "All pieces" || p.category === category,
  );
  const searchedProducts = products.filter((p) =>
    `${p.name} ${p.category} ${p.color}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const selectedProduct = typeof panel === "object" ? panel : null;

  useEffect(() => {
    if (!panel) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    if (panel === "search")
      dialog.querySelector<HTMLInputElement>("input")?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [panel]);

  function openPanel(nextPanel: Panel) {
    if (!panel) opener.current = document.activeElement as HTMLElement;
    setPanel(nextPanel);
  }
  function closePanel() {
    dialogRef.current?.close();
    setPanel(null);
    opener.current?.focus();
  }
  function toggleSaved(slug: string) {
    setSaved((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  }
  function chooseCollection(nextCategory: ProductCategory) {
    setCategory(nextCategory);
  }

  function resultList(items: Product[]) {
    return (
      <div className={styles.resultList}>
        {items.map((product) => (
          <Link
            href={`/products/${product.slug}`}
            key={product.slug}
            className={styles.resultItem}
            onClick={() => setPanel(null)}
          >
            <span className={styles.resultImage}>
              <Image src={product.image} alt="" fill sizes="80px" />
            </span>
            <span>
              <span className={styles.resultName}>{product.name}</span>
              <span className="text-small text-muted">
                {product.color} · {currency.format(product.price)}
              </span>
            </span>
            <Icon name="arrow" />
          </Link>
        ))}
      </div>
    );
  }

  return (
    <>
      <Link className={styles.skipLink} href="#main">
        Skip to content
      </Link>
      <div className={styles.announcement}>
        A new season. A different perspective.{" "}
        <Link href="/#collections">
          Discover the autumn edit <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <div className={styles.headerLeft}>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => openPanel("menu")}
              aria-label="Open navigation menu"
            >
              <Icon name="menu" />
            </button>
            <span className={styles.headerNote}>A WARDROBE, CONSIDERED</span>
          </div>
          <Link className={styles.wordmark} href="/" aria-label="Atelier home">
            ATELIER
          </Link>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Search the collection"
              onClick={() => openPanel("search")}
            >
              <Icon name="search" />
            </button>
            <button
              type="button"
              className={styles.iconButton}
              aria-label={`Saved pieces${saved.length ? `, ${saved.length} saved` : ""}`}
              onClick={() => openPanel("saved")}
            >
              <Icon name="heart" filled={saved.length > 0} />
            </button>
          </div>
        </div>
        <nav className={styles.desktopNav} aria-label="Main navigation">
          <Link href="/new-arrivals">New in</Link>
          <Link href="/#collections">Collections</Link>
          <Link href="/new-arrivals?category=Clothing">Ready-to-wear</Link>
          <Link href="/new-arrivals?category=Bags">Bags</Link>
          <Link href="/new-arrivals?category=Accessories">Accessories</Link>
          <Link href="/#our-world">The world of Atelier</Link>
        </nav>
      </header>

      <main id="main">
        {children ?? (
          <>
            <section className={styles.hero} aria-labelledby="hero-title">
              <div className={styles.heroImage}>
                <Image
                  src="/images/editorial-suit.jpg"
                  alt="Low-angle editorial portrait of a woman in a softly tailored ivory suit"
                  fill
                  preload
                  sizes="(max-width: 639px) 100vw, 65vw"
                />
              </div>
              <div className={styles.heroShade} />
              <div className={styles.heroCopy}>
                <p className="eyebrow">AUTUMN / WINTER 2026</p>
                <h1 id="hero-title">The art of less.</h1>
                <p className={styles.heroDescription}>
                  Quiet confidence. Considered silhouettes.
                  <br />A new perspective on the everyday.
                </p>
                <Link href="/#collections" className={styles.heroLink}>
                  Discover the collection <Icon name="arrow" />
                </Link>
              </div>
              <span className={styles.heroFootnote}>
                THE AUTUMN EDIT — VOL. 01
              </span>
            </section>

            <section
              id="collections"
              className={`${styles.collections} page-container`}
              aria-labelledby="collections-title"
            >
              <div className={styles.sectionHeading}>
                <div>
                  <p className="eyebrow text-muted">THE AUTUMN WARDROBE</p>
                  <h2 id="collections-title" className="text-title">
                    The collections
                  </h2>
                </div>
                <span className={styles.sectionNumber}>01 / 03</span>
              </div>
              <div className={styles.collectionGrid}>
                <Link
                  className={styles.collectionCard}
                  href="#new-in"
                  onClick={() => chooseCollection("Clothing")}
                >
                  <div className={styles.collectionImage}>
                    <Image
                      src="/images/city-trench.jpg"
                      alt="A woman in a light trench coat on a sunlit Copenhagen street"
                      fill
                      sizes="(max-width: 639px) 100vw, 50vw"
                    />
                  </div>
                  <div className={styles.collectionCaption}>
                    <div>
                      <p className="eyebrow">READY-TO-WEAR</p>
                      <h3>A softer structure</h3>
                    </div>
                    <span className={styles.roundArrow}>
                      <Icon name="arrow" />
                    </span>
                  </div>
                </Link>
                <Link
                  className={`${styles.collectionCard} ${styles.collectionBag}`}
                  href="#new-in"
                  onClick={() => chooseCollection("Bags")}
                >
                  <div className={styles.collectionImage}>
                    <Image
                      src="/images/leather-bag.jpg"
                      alt="A cognac satchel with dark leather straps and brass details"
                      fill
                      sizes="(max-width: 639px) 100vw, 50vw"
                    />
                  </div>
                  <div className={styles.collectionCaption}>
                    <div>
                      <p className="eyebrow">EVERYDAY COMPANIONS</p>
                      <h3>The everyday carry</h3>
                    </div>
                    <span className={styles.roundArrow}>
                      <Icon name="arrow" />
                    </span>
                  </div>
                </Link>
              </div>
            </section>

            <section
              id="new-in"
              className={`${styles.newIn} page-container section-space`}
              aria-labelledby="new-in-title"
            >
              <div className={styles.sectionHeading}>
                <div>
                  <p className="eyebrow text-muted">JUST ARRIVED</p>
                  <h2 className="text-title" id="new-in-title">
                    New & noteworthy
                  </h2>
                </div>
                <span className={styles.sectionNumber}>02 / 03</span>
              </div>
              <div className={styles.filterBar}>
                <div
                  className={styles.filters}
                  role="group"
                  aria-label="Filter pieces by category"
                >
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={category === item}
                      onClick={() => setCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <p className="text-label text-muted" aria-live="polite">
                  {visibleProducts.length}{" "}
                  {visibleProducts.length === 1 ? "piece" : "pieces"}
                </p>
              </div>
              <div className={`product-grid ${styles.productGrid}`}>
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    action={
                      <button
                        type="button"
                        className={styles.saveButton}
                        aria-label={`${saved.includes(product.slug) ? "Unsave" : "Save"} ${product.name}`}
                        aria-pressed={saved.includes(product.slug)}
                        onClick={() => toggleSaved(product.slug)}
                      >
                        <Icon
                          name="heart"
                          filled={saved.includes(product.slug)}
                        />
                      </button>
                    }
                  />
                ))}
              </div>
              <div className="mt-10">
                <Link href="/new-arrivals" className="text-link text-small">
                  View all pieces ↗
                </Link>
              </div>
            </section>

            <section
              id="our-world"
              className={styles.story}
              aria-labelledby="story-title"
            >
              <div className={styles.storyImage}>
                <Image
                  src="/images/studio.jpg"
                  alt="A considered palette of light, brown and charcoal garments on a wooden clothing rail"
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                />
              </div>
              <div className={styles.storyCopy}>
                <p className="eyebrow text-muted">
                  THE WORLD OF ATELIER · 03 / 03
                </p>
                <h2 id="story-title">
                  Style is personal.
                  <br />
                  Make room for it.
                </h2>
                <p>
                  We believe the most interesting wardrobes are built slowly.
                  Around the pieces you reach for, the details you notice, and
                  the way you want to feel.
                </p>
                <p>
                  Atelier is an edit of those possibilities. Simple in spirit.
                  Individual by nature.
                </p>
                <Link href="/new-arrivals" className="text-link">
                  Find your everyday essentials{" "}
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.footerTop} page-container`}>
          <div>
            <Link href="/" className={styles.footerBrand}>
              ATELIER
            </Link>
            <p>
              A wardrobe, considered.
              <br />
              An individual point of view.
            </p>
          </div>
          <div>
            <h2 className="eyebrow">EXPLORE</h2>
            <Link href="/new-arrivals">New in</Link>
            <Link href="/#collections">The collections</Link>
            <Link href="/#our-world">Our world</Link>
          </div>
          <div>
            <h2 className="eyebrow">YOUR EDIT</h2>
            <button type="button" onClick={() => openPanel("search")}>
              Find a piece
            </button>
            <button type="button" onClick={() => openPanel("saved")}>
              Saved pieces
            </button>
            <Link href="#main">Back to top ↑</Link>
          </div>
          <div className={styles.footerStatement}>
            <p>
              Considered today.
              <br />
              Worn your way.
            </p>
            <span className="eyebrow">AUTUMN / WINTER 2026</span>
          </div>
        </div>
        <div className={`${styles.footerBottom} page-container`}>
          <span>© 2026 Atelier</span>
          <span>Collection preview · Sample pieces and pricing</span>
          <span>United States · USD $</span>
        </div>
      </footer>

      <dialog
        ref={dialogRef}
        className={`${styles.dialog} ${selectedProduct ? styles.productDialog : ""}`}
        aria-labelledby="dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          closePanel();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePanel();
        }}
      >
        {panel && (
          <div className={styles.dialogInner}>
            <button
              type="button"
              className={`${styles.iconButton} ${styles.closeButton}`}
              aria-label="Close dialog"
              onClick={closePanel}
            >
              <Icon name="close" />
            </button>
            {panel === "menu" && (
              <>
                <p className="eyebrow text-muted">ATELIER</p>
                <h2 id="dialog-title" className="text-title">
                  Explore
                </h2>
                <nav className={styles.menuLinks} aria-label="Menu navigation">
                  {[
                    ["New in", "/new-arrivals"],
                    ["The collections", "/#collections"],
                    ["Our world", "/#our-world"],
                  ].map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => {
                        setCategory("All pieces");
                        closePanel();
                      }}
                    >
                      {label}
                      <Icon name="arrow" />
                    </Link>
                  ))}
                </nav>
              </>
            )}
            {panel === "search" && (
              <>
                <p className="eyebrow text-muted">FIND YOUR NEXT FAVORITE</p>
                <h2 id="dialog-title" className="text-title">
                  Search the edit
                </h2>
                <label className="sr-only" htmlFor="collection-search">
                  Search by name, category or color
                </label>
                <div className={styles.searchField}>
                  <Icon name="search" />
                  <input
                    id="collection-search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Try “coat”, “sage”, or “bags”"
                    type="search"
                    autoComplete="off"
                  />
                </div>
                <p className="text-small text-muted" role="status">
                  {searchedProducts.length}{" "}
                  {searchedProducts.length === 1 ? "piece" : "pieces"} found
                </p>
                {searchedProducts.length ? (
                  resultList(searchedProducts)
                ) : (
                  <p className={styles.emptyState}>
                    No pieces match that search. Try a material, color, or
                    category.
                  </p>
                )}
              </>
            )}
            {panel === "saved" && (
              <>
                <p className="eyebrow text-muted">YOUR PERSONAL EDIT</p>
                <h2 id="dialog-title" className="text-title">
                  Saved pieces
                </h2>
                {saved.length ? (
                  <>
                    {resultList(
                      products.filter((product) =>
                        saved.includes(product.slug),
                      ),
                    )}
                    <p className="text-small text-muted">
                      Your selection is kept while you browse this page.
                    </p>
                  </>
                ) : (
                  <div className={styles.emptyState}>
                    <Icon name="heart" />
                    <p>
                      A little space for your favorites.
                      <br />
                      Tap the heart on a piece to save it here.
                    </p>
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={closePanel}
                    >
                      Keep exploring
                    </button>
                  </div>
                )}
              </>
            )}
            {selectedProduct && (
              <div className={styles.productDetail}>
                <div className={styles.detailImage}>
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.alt}
                    fill
                    sizes="(max-width: 639px) 90vw, 450px"
                  />
                </div>
                <div className={styles.detailCopy}>
                  <p className="eyebrow text-muted">
                    {selectedProduct.category}
                  </p>
                  <h2 id="dialog-title" className="text-title">
                    {selectedProduct.name}
                  </h2>
                  <p>{currency.format(selectedProduct.price)}</p>
                  <hr className="divider" />
                  <p className="text-small">{selectedProduct.description}</p>
                  <p className="text-small text-muted">
                    Color: {selectedProduct.color}
                  </p>
                  <button
                    type="button"
                    className="button"
                    aria-pressed={saved.includes(selectedProduct.slug)}
                    onClick={() => toggleSaved(selectedProduct.slug)}
                  >
                    <Icon
                      name="heart"
                      filled={saved.includes(selectedProduct.slug)}
                    />
                    {saved.includes(selectedProduct.slug)
                      ? "Saved to your edit"
                      : "Save to your edit"}
                  </button>
                  <p className="text-label text-muted">
                    A sample piece from our collection preview.
                    <br />
                    Purchasing is not available yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
