import { SensorService } from "@/services/api/v1";
import { SensorType } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useReadSensor(sensorId: string) {
  return useQuery({
    enabled: !!sensorId,
    queryKey: ["sensor", sensorId],
    queryFn: async () => {
      return SensorService.readSensor(sensorId);
    },
  });
}

export function useCreateSensor() {
  return useMutation({
    mutationFn: async (sensor: SensorType) => {
      return SensorService.createSensor(sensor);
    },
  });
}

export function useSensors(deviceId: string) {
  return useQuery({
    enabled: !!deviceId,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 0, // Sempre considerar dados como stale para permitir atualizações
    queryKey: ["sensors", deviceId],
    queryFn: async () => {
      return SensorService.getSensors(deviceId);
    },
  });
}

export function useDeleteSensor() {
  return useMutation({
    mutationFn: async (id: string) => {
      return SensorService.deleteSensor(id);
    },
    onSuccess: () => {
      // Invalidar queries automaticamente após exclusão bem-sucedida
      // Isso garante que a UI seja atualizada
    },
  });
}
