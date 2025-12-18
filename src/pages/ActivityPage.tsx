import { ClipboardList, Inbox } from "lucide-react";
import { ActivityItem } from "../components/ActivityItem";
import { SkeletonCard } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { useActivity, useZones } from "../hooks/useQueries";
import styles from "./Page.module.css";
import cardStyles from "../styles/Card.module.css";

export function ActivityPage() {
  const {
    data: logs = [],
    isLoading: logsLoading,
    error: logsError,
    refetch,
  } = useActivity();
  const { data: zones = [] } = useZones();

  const isLoading = logsLoading;
  const error = logsError;

  // For now, we'll simplify and not fetch all vehicles
  // In a real app, you might want to create a custom hook that fetches vehicles for multiple zones
  const vehicles: any[] = [];

  const getZoneName = (zoneId: string | null) => {
    if (!zoneId) return undefined;
    const zone = zones.find((z) => z.id === zoneId);
    return zone?.name;
  };

  const getVehiclePlate = (vehicleId: string | null) => {
    if (!vehicleId) return undefined;
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle?.licensePlate;
  };

  return (
    <div className={styles.page}>
      <div style={{ marginBottom: "16px" }}>
        <h1 className={styles.pageTitle}>
          <ClipboardList
            size={24}
            style={{ display: "inline", marginRight: "8px" }}
          />
          Activity Log
        </h1>
        <p style={{ color: "var(--color-gray-600)", fontSize: "14px" }}>
          Your recent patrol activity
        </p>
      </div>

      {isLoading ? (
        <>
          <SkeletonCard lines={3} />
          <SkeletonCard lines={3} />
          <SkeletonCard lines={3} />
          <SkeletonCard lines={3} />
        </>
      ) : error ? (
        <ErrorState
          message={
            error instanceof Error ? error.message : "Failed to load activity"
          }
          onRetry={() => refetch()}
        />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={<Inbox size={64} />}
          title="No activity yet"
          message="Start patrolling zones to see your activity history here."
        />
      ) : (
        <div className={cardStyles.card}>
          {logs.map((log) => (
            <ActivityItem
              key={log.id}
              log={log}
              zoneName={getZoneName(log.zoneId)}
              vehiclePlate={getVehiclePlate(log.vehicleId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
