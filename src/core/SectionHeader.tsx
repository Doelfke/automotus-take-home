import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  title: string;
  count?: number;
  className?: string;
}

export function SectionHeader({ title, count, className }: SectionHeaderProps) {
  return (
    <div className={`${styles.sectionHeader} ${className || ""}`}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {count !== undefined && (
        <span className={styles.sectionCount}>{count}</span>
      )}
    </div>
  );
}
