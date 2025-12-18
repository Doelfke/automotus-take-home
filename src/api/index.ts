/**
 * Mock API Layer for Parking Enforcement App
 *
 * This module provides a mock API that simulates real backend endpoints.
 * All functions include simulated network delays and optional error states.
 *
 * API Endpoints:
 * - GET /zones - List all zones, sorted by priority
 * - GET /zones/:id - Get zone details
 * - GET /zones/:id/vehicles - Get vehicles in a zone
 * - GET /alerts - Get active alerts
 * - POST /alerts/:id/acknowledge - Acknowledge an alert
 * - GET /activity - Get officer activity logs
 * - POST /activity - Log a new activity
 * - POST /vehicles/:id/warning - Issue a warning to a vehicle
 */

import type { Zone, Vehicle, Alert, ActivityLog } from "../types";
import { mockZones } from "./mock-data/zones";
import { mockVehicles } from "./mock-data/vehicles";
import { mockAlerts } from "./mock-data/alerts";
import { mockActivityLogs } from "./mock-data/activityLogs";
import { currentOfficer } from "./mock-data/officers";
import { withNetworkSimulation } from "./config";

// In-memory state (simulating database)
let zones = [...mockZones];
let vehicles = [...mockVehicles];
let alerts = [...mockAlerts];
let activityLogs = [...mockActivityLogs];

/**
 * GET /zones
 * Returns all zones sorted by priority (high > medium > low)
 * and violation count within each priority level
 */
export const fetchZones = async (): Promise<Zone[]> => {
  return withNetworkSimulation(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...zones].sort((a, b) => {
      const priorityDiff =
        priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.violationCount - a.violationCount;
    });
  });
};

/**
 * GET /zones/:id
 * Returns a single zone by ID
 */
export const fetchZoneById = async (zoneId: string): Promise<Zone | null> => {
  return withNetworkSimulation(() => {
    return zones.find((z) => z.id === zoneId) || null;
  });
};

/**
 * GET /zones/:id/vehicles
 * Returns all vehicles in a zone, sorted by overstay status and arrival time
 */
export const fetchVehiclesByZone = async (
  zoneId: string
): Promise<Vehicle[]> => {
  return withNetworkSimulation(() => {
    return vehicles
      .filter((v) => v.zoneId === zoneId)
      .sort((a, b) => {
        // Overstays first, then by arrival time (oldest first)
        if (a.isOverstay !== b.isOverstay) return a.isOverstay ? -1 : 1;
        return (
          new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime()
        );
      });
  });
};

/**
 * GET /alerts
 * Returns active (unacknowledged) alerts, sorted by severity and timestamp
 */
export const fetchAlerts = async (): Promise<Alert[]> => {
  return withNetworkSimulation(() => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return alerts
      .filter((a) => !a.acknowledged)
      .sort((a, b) => {
        const severityDiff =
          severityOrder[a.severity] - severityOrder[b.severity];
        if (severityDiff !== 0) return severityDiff;
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
  });
};

/**
 * GET /alerts/zone/:zoneId
 * Returns alerts for a specific zone
 */
export const fetchAlertsByZone = async (zoneId: string): Promise<Alert[]> => {
  return withNetworkSimulation(() => {
    return alerts.filter((a) => a.zoneId === zoneId && !a.acknowledged);
  });
};

/**
 * POST /alerts/:id/acknowledge
 * Acknowledges an alert
 */
export const acknowledgeAlert = async (alertId: string): Promise<Alert> => {
  return withNetworkSimulation(() => {
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) throw new Error("Alert not found");

    alert.acknowledged = true;

    // Log the activity
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      officerId: currentOfficer.id,
      action: "alert_acknowledged",
      zoneId: alert.zoneId,
      vehicleId: alert.vehicleId,
      timestamp: new Date().toISOString(),
      notes: null,
    };
    activityLogs.unshift(newLog);

    return alert;
  });
};

/**
 * GET /activity
 * Returns activity logs for the current officer, most recent first
 */
export const fetchActivityLogs = async (limit = 20): Promise<ActivityLog[]> => {
  return withNetworkSimulation(() => {
    return activityLogs
      .filter((log) => log.officerId === currentOfficer.id)
      .slice(0, limit);
  });
};

/**
 * POST /activity
 * Logs a new activity
 */
export const logActivity = async (
  action: ActivityLog["action"],
  zoneId: string | null,
  vehicleId: string | null = null,
  notes: string | null = null
): Promise<ActivityLog> => {
  return withNetworkSimulation(() => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      officerId: currentOfficer.id,
      action,
      zoneId,
      vehicleId,
      timestamp: new Date().toISOString(),
      notes,
    };
    activityLogs.unshift(newLog);

    // Update zone's lastChecked if this is a zone visit
    if (action === "zone_visited" && zoneId) {
      const zone = zones.find((z) => z.id === zoneId);
      if (zone) {
        zone.lastChecked = new Date().toISOString();
      }
    }

    return newLog;
  });
};

/**
 * POST /zones/:id/visit
 * Records a zone visit and updates lastChecked timestamp
 */
export const visitZone = async (
  zoneId: string,
  notes?: string
): Promise<ActivityLog> => {
  return logActivity("zone_visited", zoneId, null, notes || null);
};

/**
 * POST /vehicles/:id/warning
 * Issues a warning to a vehicle
 */
export const issueWarning = async (
  vehicleId: string,
  notes?: string
): Promise<{ vehicle: Vehicle; log: ActivityLog }> => {
  return withNetworkSimulation(() => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) throw new Error("Vehicle not found");

    if (vehicle.warningIssued) {
      throw new Error("Warning already issued to this vehicle");
    }

    vehicle.warningIssued = true;

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      officerId: currentOfficer.id,
      action: "warning_issued",
      zoneId: vehicle.zoneId,
      vehicleId: vehicle.id,
      timestamp: new Date().toISOString(),
      notes: notes || null,
    };
    activityLogs.unshift(newLog);

    return { vehicle, log: newLog };
  });
};

/**
 * POST /vehicles/:id/citation
 * Issues a citation to a vehicle
 */
export const issueCitation = async (
  vehicleId: string,
  notes?: string
): Promise<{ vehicle: Vehicle; log: ActivityLog }> => {
  return withNetworkSimulation(() => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) throw new Error("Vehicle not found");

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      officerId: currentOfficer.id,
      action: "citation_issued",
      zoneId: vehicle.zoneId,
      vehicleId: vehicle.id,
      timestamp: new Date().toISOString(),
      notes: notes || null,
    };
    activityLogs.unshift(newLog);

    return { vehicle, log: newLog };
  });
};

/**
 * Utility: Get current officer info
 */
export const getCurrentOfficer = () => currentOfficer;

/**
 * Utility: Reset all mock data (useful for testing)
 */
export const resetMockData = () => {
  zones = [...mockZones];
  vehicles = [...mockVehicles];
  alerts = [...mockAlerts];
  activityLogs = [...mockActivityLogs];
};
