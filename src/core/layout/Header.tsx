import styles from "./Header.module.css";

interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function Header({ title, subtitle, className }: HeaderProps) {
  return (
    <header className={`${styles.header} ${className || ""}`}>
      <div className={styles.headerContent}>
        <div>
          <div className={styles.headerTitle}>{title}</div>
          {subtitle && <div className={styles.headerSubtitle}>{subtitle}</div>}
        </div>
      </div>
    </header>
  );
}
