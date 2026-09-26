"use client";
import { useState, type ReactNode } from "react";
import styles from "./catalogue.module.css";
export function FilterPanel({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div>
    <button type="button" className={styles.filterToggle} aria-expanded={open} aria-controls="catalogue-filters" onClick={() => setOpen(!open)}>Filter & sort <span aria-hidden="true">{open ? "−" : "+"}</span></button>
    <div id="catalogue-filters" className={`${styles.filterPanel} ${open ? styles.filterOpen : ""}`}>{children}</div>
  </div>;
}
