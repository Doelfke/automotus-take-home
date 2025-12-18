import type { ActivityLog } from "../../types";

// Mock activity logs
export const mockActivityLogs: ActivityLog[] = [
  {
    id: "log-001",
    officerId: "officer-001",
    action: "zone_visited",
    zoneId: "zone-002",
    vehicleId: null,
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    notes: null,
  },
  {
    id: "log-002",
    officerId: "officer-001",
    action: "warning_issued",
    zoneId: "zone-001",
    vehicleId: "veh-002",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    notes: "First warning issued",
  },
  {
    id: "log-003",
    officerId: "officer-001",
    action: "zone_visited",
    zoneId: "zone-004",
    vehicleId: null,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    notes: "All clear",
  },
  {
    id: "log-004",
    officerId: "officer-001",
    action: "citation_issued",
    zoneId: "zone-003",
    vehicleId: "veh-005",
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    notes: "Second violation this week",
  },
  {
    id: "log-005",
    officerId: "officer-001",
    action: "alert_acknowledged",
    zoneId: "zone-001",
    vehicleId: "veh-001",
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    notes: null,
  },
];
