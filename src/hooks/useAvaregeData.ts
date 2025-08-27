import { DevicesService } from "@/services/api/v1";
import { useQuery } from "@tanstack/react-query";

export function useAvaregeDailyData(id: string) {
  return useQuery({
    queryKey: ["device_id", id],
    queryFn: async () => {
      return DevicesService.deviceSensorDailyAverage(id);
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
}

export function useAvaregeMonthlyData(id: string) {
  return useQuery({
    queryKey: ["device_id", id],
    queryFn: async () => {
      return DevicesService.deviceSensorMonthlyAverage(id);
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
}

export function useAvaregeWeeklyData(id: string) {
  return useQuery({
    queryKey: ["device_id", id],
    queryFn: async () => {
      return DevicesService.deviceSensorWeeklyAverage(id);
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
}

export function useAvaregeAnnualData(id: string) {
  return useQuery({
    queryKey: ["device_id", id],
    queryFn: async () => {
      return DevicesService.deviceSensorAnnualAverage(id);
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
}
