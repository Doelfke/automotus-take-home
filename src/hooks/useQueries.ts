import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api";

// Query Keys
export const queryKeys = {
  zones: ["zones"] as const,
  zone: (id: string) => ["zone", id] as const,
  vehicles: (zoneId: string) => ["vehicles", zoneId] as const,
  alerts: ["alerts"] as const,
  zoneAlerts: (zoneId: string) => ["alerts", "zone", zoneId] as const,
  activity: ["activity"] as const,
  officer: ["officer"] as const,
};

// Zones
export function useZones() {
  return useQuery({
    queryKey: queryKeys.zones,
    queryFn: api.fetchZones,
  });
}

export function useZone(zoneId: string) {
  return useQuery({
    queryKey: queryKeys.zone(zoneId),
    queryFn: () => api.fetchZoneById(zoneId),
    enabled: !!zoneId,
  });
}

export function useVehicles(zoneId: string) {
  return useQuery({
    queryKey: queryKeys.vehicles(zoneId),
    queryFn: () => api.fetchVehiclesByZone(zoneId),
    enabled: !!zoneId,
  });
}

export function useVisitZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { zoneId: string; notes?: string }) =>
      api.visitZone(params.zoneId, params.notes),
    onSuccess: (_, variables) => {
      // Invalidate and refetch zones and zone detail
      queryClient.invalidateQueries({ queryKey: queryKeys.zones });
      queryClient.invalidateQueries({
        queryKey: queryKeys.zone(variables.zoneId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity });
    },
  });
}

// Alerts
export function useAlerts() {
  return useQuery({
    queryKey: queryKeys.alerts,
    queryFn: api.fetchAlerts,
  });
}

export function useZoneAlerts(zoneId: string) {
  return useQuery({
    queryKey: queryKeys.zoneAlerts(zoneId),
    queryFn: () => api.fetchAlertsByZone(zoneId),
    enabled: !!zoneId,
  });
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.acknowledgeAlert,
    onSuccess: () => {
      // Invalidate all alert queries
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity });
    },
  });
}

// Vehicles
export function useIssueWarning() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, notes }: { vehicleId: string; notes?: string }) =>
      api.issueWarning(vehicleId, notes),
    onSuccess: (data) => {
      // Invalidate vehicles and activity
      queryClient.invalidateQueries({
        queryKey: queryKeys.vehicles(data.vehicle.zoneId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity });
      queryClient.invalidateQueries({ queryKey: queryKeys.zones });
    },
  });
}

export function useIssueCitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, notes }: { vehicleId: string; notes?: string }) =>
      api.issueCitation(vehicleId, notes),
    onSuccess: (data) => {
      // Invalidate vehicles and activity
      queryClient.invalidateQueries({
        queryKey: queryKeys.vehicles(data.vehicle.zoneId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity });
      queryClient.invalidateQueries({ queryKey: queryKeys.zones });
    },
  });
}

// Activity
export function useActivity() {
  return useQuery({
    queryKey: queryKeys.activity,
    queryFn: () => api.fetchActivityLogs(),
  });
}

// Officer
export function useOfficer() {
  return useQuery({
    queryKey: queryKeys.officer,
    queryFn: api.getCurrentOfficer,
    staleTime: Infinity, // Officer data doesn't change
  });
}
