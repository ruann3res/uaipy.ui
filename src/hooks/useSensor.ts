import { useMutation, useQuery } from "@tanstack/react-query"
import { SensorService } from "@/services/api/v1"
import { SensorType } from "@/types"

export function useReadSensor(sensorId: string) {
    return useQuery({
        enabled: !!sensorId,
        queryKey: ['sensor', sensorId],
        queryFn: async () => {
            return SensorService.readSensor(sensorId)
        },
    })
}

export function useCreateSensor() {
    return useMutation({
        mutationFn: async (sensor: SensorType) => {
            return SensorService.createSensor(sensor)
        },
    })
}

export function useSensors(deviceId: string) {
    return useQuery({
        enabled: !!deviceId,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 10,
        queryKey: ['sensors', deviceId],
        queryFn: async () => {
            return SensorService.getSensors(deviceId)
        },
    })
}
