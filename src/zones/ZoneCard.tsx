import { useNavigate } from "react-router-dom";
import { MapPin, Clock, AlertTriangle } from "lucide-react";
import type { Zone } from "../types";
import { timeUtils } from "../utils/timeUtils";
import styles from "./ZoneCard.module.css";

interface ZoneCardProps {
  zone: Zone;
}

export function ZoneCard({ zone }: ZoneCardProps) {
  const navigate = useNavigate();
  const occupancyPercent = Math.round(
    (zone.currentOccupancy / zone.maxCapacity) * 100
  );
  const isNearCapacity = occupancyPercent >= 90;
  const isStale = zone.lastChecked
    ? Date.now() - new Date(zone.lastChecked).getTime() > 2 * 60 * 60 * 1000 // 2 hours
    : true;

  return (
    <div className={styles.card} onClick={() => navigate(`/zones/${zone.id}`)}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.name}>{zone.name}</h3>
            <p className={styles.location}>
              <MapPin
                size={12}
                style={{ display: "inline", marginRight: "4px" }}
              />
              {zone.location}
            </p>
          </div>
          <span className={`${styles.priorityBadge} ${styles[zone.priority]}`}>
            {zone.priority === "high" && <AlertTriangle size={12} />}
            {zone.priority}
          </span>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Occupancy</span>
            <span
              className={`${styles.statValue} ${
                isNearCapacity ? styles.full : ""
              }`}
            >
              {zone.currentOccupancy}/{zone.maxCapacity}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Violations</span>
            <span
              className={`${styles.statValue} ${
                zone.violationCount > 0 ? styles.violations : ""
              }`}
            >
              {zone.violationCount}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Capacity</span>
            <span
              className={`${styles.statValue} ${
                isNearCapacity ? styles.full : ""
              }`}
            >
              {occupancyPercent}%
            </span>
          </div>
        </div>

        <div
          className={`${styles.lastChecked} ${
            zone.lastChecked ? (isStale ? styles.stale : "") : styles.never
          }`}
        >
          <Clock size={14} />
          <span>
            {zone.lastChecked
              ? `Checked ${timeUtils.formatTimeAgo(zone.lastChecked)}`
              : "Not checked today"}
          </span>
        </div>
      </div>
    </div>
  );
}
