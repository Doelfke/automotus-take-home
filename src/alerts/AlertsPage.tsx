import { Bell, CheckCircle } from "lucide-react";
import { AlertCard } from "./AlertCard";
import { SkeletonCard } from "../core/LoadingState";
import { ErrorState } from "../core/ErrorState";
import { EmptyState } from "../core/EmptyState";
import { showToast } from "../core/Toast";
import { Page } from "../core/Page";
import { PageTitle } from "../core/PageTitle";
import { SectionHeader } from "../core/SectionHeader";
import { useAlerts, useZones, useAcknowledgeAlert } from "../hooks/useQueries";

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
    <Page>
      <div style={{ marginBottom: "16px" }}>
        <PageTitle>
          <Bell size={24} style={{ display: "inline", marginRight: "8px" }} />
          Alerts
        </PageTitle>
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
              <SectionHeader title="Critical" count={criticalAlerts.length} />
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
              <SectionHeader title="Warnings" count={warningAlerts.length} />
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
              <SectionHeader title="Info" count={infoAlerts.length} />
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
    </Page>
  );
}
