import {
  MapPin,
  AlertTriangle,
  FileText,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import type { ActivityLog } from "../types";
import { timeUtils } from "../utils/timeUtils";
import styles from "./ActivityItem.module.css";

interface ActivityItemProps {
  log: ActivityLog;
  zoneName?: string;
  vehiclePlate?: string;
}

export function ActivityItem({
  log,
  zoneName,
  vehiclePlate,
}: ActivityItemProps) {
  const getActionConfig = () => {
    switch (log.action) {
      case "zone_visited":
        return {
          icon: <MapPin size={18} />,
          label: "Zone Visited",
          detail: zoneName || log.zoneId,
        };
      case "warning_issued":
        return {
          icon: <AlertTriangle size={18} />,
          label: "Warning Issued",
          detail: vehiclePlate || log.vehicleId,
        };
      case "citation_issued":
        return {
          icon: <FileText size={18} />,
          label: "Citation Issued",
          detail: vehiclePlate || log.vehicleId,
        };
      case "alert_acknowledged":
        return {
          icon: <CheckCircle size={18} />,
          label: "Alert Acknowledged",
          detail: zoneName || log.zoneId,
        };
      case "note_added":
        return {
          icon: <MessageSquare size={18} />,
          label: "Note Added",
          detail: zoneName || log.zoneId,
        };
      default:
        return {
          icon: <MapPin size={18} />,
          label: log.action,
          detail: "",
        };
    }
  };

  const config = getActionConfig();

  // Convert snake_case to camelCase for CSS modules
  const actionClass = log.action.replace(/_([a-z])/g, (g) =>
    g[1].toUpperCase()
  );

  return (
    <div className={styles.item}>
      <div className={`${styles.icon} ${styles[actionClass]}`}>
        {config.icon}
      </div>
      <div className={styles.content}>
        <div className={styles.action}>{config.label}</div>
        <div className={styles.details}>
          {config.detail}
          {log.notes && <span> — {log.notes}</span>}
        </div>
        <div className={styles.time}>
          {timeUtils.formatTimeAgo(log.timestamp)}
        </div>
      </div>
    </div>
  );
}
