import styles from "./LoadingState.module.css";

interface LoadingSpinnerProps {
  text?: string;
}

export function LoadingSpinner({ text = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className={styles.loadingSpinner}>
      <div className={styles.spinner} />
      <span className={styles.loadingText}>{text}</span>
    </div>
  );
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className={styles.skeletonCard}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${styles.skeleton} ${styles.skeletonLine} ${
            i === 0 ? styles.medium : i === lines - 1 ? styles.short : ""
          }`}
        />
      ))}
    </div>
  );
}

export function ZoneCardSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div
        className={`${styles.skeleton} ${styles.skeletonLine} ${styles.medium}`}
        style={{ height: "24px" }}
      />
      <div
        className={`${styles.skeleton} ${styles.skeletonLine} ${styles.short}`}
        style={{ marginTop: "8px" }}
      />
      <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
        <div
          className={styles.skeleton}
          style={{ width: "60px", height: "40px" }}
        />
        <div
          className={styles.skeleton}
          style={{ width: "60px", height: "40px" }}
        />
        <div
          className={styles.skeleton}
          style={{ width: "60px", height: "40px" }}
        />
      </div>
    </div>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          className={styles.skeleton}
          style={{ width: "100px", height: "24px" }}
        />
        <div
          className={styles.skeleton}
          style={{ width: "70px", height: "24px", borderRadius: "9999px" }}
        />
      </div>
      <div
        className={`${styles.skeleton} ${styles.skeletonLine} ${styles.short}`}
        style={{ marginTop: "12px" }}
      />
      <div
        className={`${styles.skeleton} ${styles.skeletonLine} ${styles.medium}`}
        style={{ marginTop: "8px" }}
      />
    </div>
  );
}
