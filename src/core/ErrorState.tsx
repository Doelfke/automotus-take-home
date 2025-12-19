import { AlertCircle, RefreshCw } from "lucide-react";
import styles from "./ErrorState.module.css";
import { Button } from "./buttons/Button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={styles.errorState}>
      <AlertCircle className={styles.errorIcon} />
      <h3 className={styles.errorTitle}>{title}</h3>
      <p className={styles.errorMessage}>{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          <RefreshCw size={18} />
          Try Again
        </Button>
      )}
    </div>
  );
}
