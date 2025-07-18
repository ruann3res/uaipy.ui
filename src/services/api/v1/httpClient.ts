import { storageKeys } from "@/configs"
import axios from "axios"

export const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

httpClient.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem(storageKeys.accessToken)
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})