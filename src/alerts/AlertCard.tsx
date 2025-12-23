import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Bell, MapPin, Clock, Eye } from "lucide-react";
import type { Alert } from "../types";
import { timeUtils } from "../utils/timeUtils";
import { Button } from "../core/buttons/Button";
import styles from "./AlertCard.module.css";

interface AlertCardProps {
  alert: Alert;
  zoneName?: string;
  onAcknowledge: (alertId: string) => Promise<void>;
}

export function AlertCard({ alert, zoneName, onAcknowledge }: AlertCardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const getSeverityIcon = () => {
    switch (alert.severity) {
      case "critical":
        return <AlertTriangle size={14} />;
      case "warning":
        return <Bell size={14} />;
      default:
        return null;
    }
  };

  const handleAcknowledge = async () => {
    setIsLoading(true);
    try {
      await onAcknowledge(alert.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.card} ${styles[alert.severity]}`}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={`${styles.severity} ${styles[alert.severity]}`}>
            {getSeverityIcon()}
            {alert.severity}
          </span>
          <span style={{ fontSize: "12px", color: "var(--color-gray-400)" }}>
            {timeUtils.formatTimeAgo(alert.timestamp)}
          </span>
        </div>

        <p className={styles.message}>{alert.message}</p>

        <div className={styles.meta}>
          {zoneName && (
            <span>
              <MapPin
                size={12}
                style={{ display: "inline", marginRight: "4px" }}
              />
              {zoneName}
            </span>
          )}
          <span>
            <Clock
              size={12}
              style={{ display: "inline", marginRight: "4px" }}
            />
            {timeUtils.formatTimeAgo(alert.timestamp)}
          </span>
        </div>

        <div className={styles.actions}>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/zones/${alert.zoneId}`)}
          >
            <Eye size={16} />
            View Zone
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={handleAcknowledge}
            disabled={isLoading}
          >
            {isLoading ? "Acknowledging..." : "Acknowledge"}
          </Button>
        </div>
      </div>
    </div>
  );
}
