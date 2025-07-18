import { Device } from "@/types";
import { httpClient } from "./httpClient";

export class DevicesService {
    static async get(projectId: string): Promise<Device[]> {
        const response = await httpClient.get<Device[]>("/devices", {
            params: {
                project_id: projectId
            }
        })
        return response.data
    }
    static async getRecentSensorData(deviceId: string, limit: number = 10): Promise<Report[]> {
        const response = await httpClient.get<Report[]>(`/devices/${deviceId}/recent-sensor-data`, {
            params: {
                limit
            }
        })
        return response.data
    }

    static async create(device: Omit<Device, "id" | "created_at" | "updated_at" | "serial_number">): Promise<Device> {
        const response = await httpClient.post<Device>("/devices", device)
        return response.data
    }

    static async update(id: string, device: Omit<Device, "id" | "created_at" | "updated_at" | "serial_number">): Promise<Device> {
        const response = await httpClient.put<Device>(`/devices/${id}`, device);
        return response.data;
    }

    static async getById(id: string): Promise<Device> {
        const response = await httpClient.get<Device>(`/devices/${id}`);
        return response.data;
    }
}
