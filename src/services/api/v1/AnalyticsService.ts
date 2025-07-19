import { Project } from "@/types";
import { httpClient } from "./httpClient"

export class AnalyticsService {
    static async get(): Promise<Analytics> {
        const response = await httpClient.get<Analytics>("/analytics/users/statistics")
        return response.data
    }
}

export type Analytics = {
    user_id: string;
    username: string;
    total_projects: number;
    total_devices: number;
    total_sensors: number;
    total_sensor_data: number;
    projects: Project[];
}
