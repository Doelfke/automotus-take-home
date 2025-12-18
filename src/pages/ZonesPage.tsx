import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MapPinOff } from "lucide-react";
import { setSimulateErrors, getSimulateErrors } from "../api/config";
import { ZoneCard } from "../components/ZoneCard";
import { ZoneCardSkeleton } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { useZones } from "../hooks/useQueries";
import styles from "./Page.module.css";

export function ZonesPage() {
  const queryClient = useQueryClient();
  const { data: zones = [], isLoading, error, refetch } = useZones();
  const [simulateErrors, setSimulateErrorsState] = useState(
    getSimulateErrors()
  );

  const toggleErrorSimulation = () => {
    const newValue = !simulateErrors;
    setSimulateErrors(newValue);
    setSimulateErrorsState(newValue);
    // Invalidate all queries to force refetch with new error simulation setting
    queryClient.invalidateQueries();
  };

  // Count high priority zones
  const highPriorityCount = zones.filter((z) => z.priority === "high").length;
  const totalViolations = zones.reduce((sum, z) => sum + z.violationCount, 0);

  return (
    <div className={styles.page}>
      {/* Error simulation toggle for demo */}
      <div className={styles.errorDemoBanner}>
        <span className={styles.errorDemoText}>
          {simulateErrors ? "⚠️ Error simulation ON" : "Demo: Toggle errors"}
        </span>
        <div className={styles.toggleContainer}>
          <div
            className={`${styles.toggle} ${
              simulateErrors ? styles.active : ""
            }`}
            onClick={toggleErrorSimulation}
          >
            <div className={styles.toggleKnob} />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ marginBottom: "16px" }}>
        <h1 className={styles.pageTitle}>Patrol Zones</h1>
        <p style={{ color: "var(--color-gray-600)", fontSize: "14px" }}>
          {highPriorityCount} high priority • {totalViolations} total violations
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <>
          <ZoneCardSkeleton />
          <ZoneCardSkeleton />
          <ZoneCardSkeleton />
        </>
      ) : error ? (
        <ErrorState
          message={
            error instanceof Error ? error.message : "Failed to load zones"
          }
          onRetry={() => refetch()}
        />
      ) : zones.length === 0 ? (
        <EmptyState
          icon={<MapPinOff size={64} />}
          title="No zones assigned"
          message="You don't have any patrol zones assigned to you today."
        />
      ) : (
        zones.map((zone) => <ZoneCard key={zone.id} zone={zone} />)
      )}
    </div>
  );
}
