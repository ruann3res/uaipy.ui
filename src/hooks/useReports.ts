import { useQuery } from "@tanstack/react-query"
import { ReportsService } from "@/services/api/v1"

export function useReports() {
    return useQuery({
        queryKey: ['reports'],
        refetchInterval: 3000,
        refetchIntervalInBackground: true,
        queryFn: async () => {
            return ReportsService.get()
        },
    })
}