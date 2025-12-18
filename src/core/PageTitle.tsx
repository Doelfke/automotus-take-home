import type { ReactNode } from "react";
import styles from "./PageTitle.module.css";

interface PageTitleProps {
  children: ReactNode;
  className?: string;
}

export function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1 className={`${styles.pageTitle} ${className || ""}`}>{children}</h1>
  );
}
