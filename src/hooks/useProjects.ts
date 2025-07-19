import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/services/api/v1/ProjectsService";

export function useProjects() {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            return ProjectService.get()
        },
    
    })
}

export function useCreateProject() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: {
            name: string;
            description?: string;   
            user_id: string;
        }) => {
            return ProjectService.create(data)
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    })
}

export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return ProjectService.delete(id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    })
}
