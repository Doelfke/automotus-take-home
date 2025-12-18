import type { ReactNode, ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "danger" | "warning" | "success" | "outline";
  size?: "sm" | "md" | "lg";
  block?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  className,
  ...props
}: ButtonProps) {
  const variantClass = {
    primary: styles.btnPrimary,
    danger: styles.btnDanger,
    warning: styles.btnWarning,
    success: styles.btnSuccess,
    outline: styles.btnOutline,
  }[variant];

  const sizeClass = {
    sm: styles.btnSm,
    md: "",
    lg: styles.btnLg,
  }[size];

  const classes = [
    styles.btn,
    variantClass,
    sizeClass,
    block ? styles.btnBlock : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
