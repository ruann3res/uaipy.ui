import { Project } from "@/types/projects";
import { httpClient } from "./httpClient";

export class ProjectService {
    static async get(): Promise<Project[]> {
        const response = await httpClient.get<Project[]>("/projects")
        return response.data
    }

    static async create(data: {
        name: string;
        description?: string;
        user_id: string;
    }): Promise<Project> {
        const response = await httpClient.post<Project>("/projects", data)
        return response.data
    }

    static async delete(id: string): Promise<void> {
        await httpClient.delete(`/projects/${id}`)
    }

    static async getById(id: string): Promise<Project> {
        const response = await httpClient.get<Project>(`/projects/${id}`);
        return response.data;
    }
    static async update(id: string, data: { name: string; description?: string; user_id: string }): Promise<Project> {
        const response = await httpClient.put<Project>(`/projects/${id}`, data);
        return response.data;
    }
}
