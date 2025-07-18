import { SensorData } from "@/types";
import { httpClient } from "./httpClient";

export class ReportsService {
    static async get(): Promise<SensorData[]> {
        const response = await httpClient.get<SensorData[]>("/reports")
        return response.data
    }

}
