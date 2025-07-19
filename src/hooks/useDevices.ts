import { DevicesService } from "@/services/api/v1"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Device } from "@/types"

export function useDevices(projectId: string) {
    return useQuery({
        enabled: !!projectId,
        queryKey: ['devices', projectId],
        staleTime: 10,
        queryFn: async () => {
            return DevicesService.get(projectId)
        },
    })
}

export function useRecentSensorData(deviceId: string, limit: number = 10) {
    return useQuery({
        enabled: !!deviceId,
        queryKey: ['recent-sensor-data'],
        queryFn: async () => {
            return DevicesService.getRecentSensorData(deviceId, limit)
        },
    })
}

export function useCreateDevice() {
    return useMutation({
        mutationFn: async (device: Omit<Device, "id" | "created_at" | "updated_at" | "serial_number">) => {
            return DevicesService.create(device)
        },
    })
}

export function useDeleteDevice() {
    return useMutation({
        mutationFn: async (deviceId: string) => {
            return DevicesService.delete(deviceId)
        },
    })
}

export function useGenerateReport(){
    return useMutation({
        mutationFn: async ({ id, email }: { id: string; email: string }) => {
            return DevicesService.generateReport(id, email)
        }
    })
}