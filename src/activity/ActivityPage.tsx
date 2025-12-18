import { ClipboardList, Inbox } from "lucide-react";
import { ActivityItem } from "./ActivityItem";
import { SkeletonCard } from "../core/LoadingState";
import { ErrorState } from "../core/ErrorState";
import { EmptyState } from "../core/EmptyState";
import { Card } from "../core/Card";
import { Page } from "../core/Page";
import { PageTitle } from "../core/PageTitle";
import { useActivity, useZones } from "../hooks/useQueries";

export function ActivityPage() {
  const { data: logs = [], isLoading, error, refetch } = useActivity();
  const { data: zones = [] } = useZones();

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
    <Page>
      <div style={{ marginBottom: "16px" }}>
        <PageTitle>
          <ClipboardList
            size={24}
            style={{ display: "inline", marginRight: "8px" }}
          />
          Activity Log
        </PageTitle>
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
        <Card>
          {logs.map((log) => (
            <ActivityItem
              key={log.id}
              log={log}
              zoneName={getZoneName(log.zoneId)}
              vehiclePlate={getVehiclePlate(log.vehicleId)}
            />
          ))}
        </Card>
      )}
    </Page>
  );
}
