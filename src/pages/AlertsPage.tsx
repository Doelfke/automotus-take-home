import { Bell, CheckCircle } from "lucide-react";
import { AlertCard } from "../components/AlertCard";
import { SkeletonCard } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { showToast } from "../components/Toast";
import { useAlerts, useZones, useAcknowledgeAlert } from "../hooks/useQueries";
import styles from "./Page.module.css";

export function AlertsPage() {
  const {
    data: alerts = [],
    isLoading: alertsLoading,
    error: alertsError,
    refetch,
  } = useAlerts();
  const { data: zones = [] } = useZones();
  const acknowledgeMutation = useAcknowledgeAlert();

  const isLoading = alertsLoading;
  const error = alertsError;

  const handleAcknowledge = async (alertId: string) => {
    try {
      await acknowledgeMutation.mutateAsync(alertId);
      showToast("Alert acknowledged", "success");
    } catch (err) {
      showToast("Failed to acknowledge alert", "error");
      throw err;
    }
  };

  const getZoneName = (zoneId: string) => {
    const zone = zones.find((z) => z.id === zoneId);
    return zone?.name;
  };

  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const warningAlerts = alerts.filter((a) => a.severity === "warning");
  const infoAlerts = alerts.filter((a) => a.severity === "info");

  return (
    <div className={styles.page}>
      <div style={{ marginBottom: "16px" }}>
        <h1 className={styles.pageTitle}>
          <Bell size={24} style={{ display: "inline", marginRight: "8px" }} />
          Alerts
        </h1>
        <p style={{ color: "var(--color-gray-600)", fontSize: "14px" }}>
          {alerts.length} active alert{alerts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {isLoading ? (
        <>
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
        </>
      ) : error ? (
        <ErrorState
          message={
            error instanceof Error ? error.message : "Failed to load alerts"
          }
          onRetry={() => refetch()}
        />
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={<CheckCircle size={64} />}
          title="All caught up!"
          message="No active alerts at the moment. Keep patrolling to stay on top of violations."
        />
      ) : (
        <>
          {/* Critical alerts first */}
          {criticalAlerts.length > 0 && (
            <>
              <div className={styles.sectionHeader}>
                <h2 className={`${styles.sectionTitle} text-danger`}>
                  Critical
                </h2>
                <span
                  className={styles.sectionCount}
                  style={{
                    backgroundColor: "#fef2f2",
                    color: "var(--color-danger)",
                  }}
                >
                  {criticalAlerts.length}
                </span>
              </div>
              {criticalAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  zoneName={getZoneName(alert.zoneId)}
                  onAcknowledge={handleAcknowledge}
                />
              ))}
            </>
          )}

          {/* Warning alerts */}
          {warningAlerts.length > 0 && (
            <>
              <div className={styles.sectionHeader}>
                <h2 className={`${styles.sectionTitle} text-warning`}>
                  Warnings
                </h2>
                <span
                  className={styles.sectionCount}
                  style={{
                    backgroundColor: "#fffbeb",
                    color: "var(--color-warning)",
                  }}
                >
                  {warningAlerts.length}
                </span>
              </div>
              {warningAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  zoneName={getZoneName(alert.zoneId)}
                  onAcknowledge={handleAcknowledge}
                />
              ))}
            </>
          )}

          {/* Info alerts */}
          {infoAlerts.length > 0 && (
            <>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Info</h2>
                <span className={styles.sectionCount}>{infoAlerts.length}</span>
              </div>
              {infoAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  zoneName={getZoneName(alert.zoneId)}
                  onAcknowledge={handleAcknowledge}
                />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
