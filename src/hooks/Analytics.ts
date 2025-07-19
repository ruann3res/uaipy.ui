import {AnalyticsService} from "@/services/api/v1/AnalyticsService"
import { useQuery } from "@tanstack/react-query"

export function useUserAnalytics() {
    return useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            return AnalyticsService.get()
        },
    })
}