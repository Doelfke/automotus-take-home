import { ArrowLeft } from "lucide-react";
import styles from "./BackButton.module.css";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function BackButton({
  onClick,
  label = "Back",
  className,
}: BackButtonProps) {
  return (
    <button
      className={`${styles.headerBack} ${className || ""}`}
      onClick={onClick}
    >
      <ArrowLeft size={20} />
      {label}
    </button>
  );
}
