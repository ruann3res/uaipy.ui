import { SensorType } from "@/types"
import { httpClient } from "./httpClient"

export class SensorService {
    static async createSensor(sensor: Omit<SensorType, "id">) {
        const { data: response } = await httpClient.post<SensorType>("/sensors", sensor)
        return response
    }

    static async getSensors(deviceId: string) {
        const { data: response } = await httpClient.get<SensorType[]>("sensors/", {
            params: {
                device_id: deviceId
            }
        })
        return response
    }

    static async readSensor(sensorId: string) {
        const { data: response } = await httpClient.get(`/sensors/${sensorId}`)

        return response
    }

    static async updateSensor(id: string, sensor: Partial<SensorType>) {
        const { data: response } = await httpClient.put<SensorType>(`/sensors/${id}`, sensor)
        return response
    }
    static async getById(id: string) {
        const { data: response } = await httpClient.get<SensorType>(`/sensors/${id}`)
        return response
    }
}