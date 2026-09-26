"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import type { Product } from "@/lib/product-types";
import styles from "./catalogue.module.css";
export function ProductGallery({ product }: { product: Product }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element?.showModal();
    return () => {
      element?.close();
      document.body.style.overflow = previous;
    };
  }, [open]);
  function close() {
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <div className={styles.gallery}>
      <button
        ref={trigger}
        className={styles.imageButton}
        onClick={() => setOpen(true)}
        aria-label={`Enlarge image of ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.alt}
          fill
          preload
          sizes="(max-width:639px) 100vw, 55vw"
        />
        <span className={styles.zoomHint} aria-hidden="true">
          View image +
        </span>
      </button>
      <dialog
        ref={dialog}
        className={styles.zoom}
        aria-label={`Image of ${product.name}`}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {open && (
          <div className={styles.zoomContent}>
            <button className={styles.close} onClick={close}>
              Close image ×
            </button>
            <Image
              src={product.image}
              alt={product.alt}
              fill
              sizes="(max-width:1064px) 94vw, 1000px"
            />
          </div>
        )}
      </dialog>
    </div>
  );
}
