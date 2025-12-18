import { useEffect, useState, useCallback } from "react";
import styles from "./Toast.module.css";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
const listeners: Array<(toast: Toast | null) => void> = [];

export function showToast(message: string, type: ToastType = "info") {
  const toast: Toast = { id: ++toastId, message, type };
  listeners.forEach((listener) => listener(toast));

  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    listeners.forEach((listener) => listener(null));
  }, 3000);
}

export function Toast() {
  const [toast, setToast] = useState<Toast | null>(null);

  const handleToast = useCallback((newToast: Toast | null) => {
    setToast(newToast);
  }, []);

  useEffect(() => {
    listeners.push(handleToast);
    return () => {
      const index = listeners.indexOf(handleToast);
      if (index > -1) listeners.splice(index, 1);
    };
  }, [handleToast]);

  if (!toast) return null;

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      {toast.message}
    </div>
  );
}
