import { CardInfo } from "@/components/CardInfo"
import { Button } from "@/components/ui/button"
import { useDeleteProject, useProjects } from "@/hooks"
import { Project } from "@/types/projects"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/ConfirmDialog";

export function Projects() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useProjects()
  const { mutateAsync: deleteProject } = useDeleteProject()
  const [_, setDeletingIds] = useState<string[]>([])
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    navigate(`/projects/form?projectId=${id}`);
  }

  const handleDelete = async (id: string) => {
    setProjectToDelete(id);
    setConfirmOpen(true);
  }

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setDeletingIds(prev => [...prev, projectToDelete])
    setConfirmOpen(false);
    const id = projectToDelete;
    setProjectToDelete(null);
    queryClient.setQueryData(['projects'], (oldData: Project[] | undefined) => {
      if (!oldData) return []
      return oldData.filter(project => project.id !== id)
    })
    const loadingToast = toast.loading("Deletando projeto...")
    try {
      await deleteProject(id)
      toast.success("Projeto deletado com sucesso", { id: loadingToast })
    } catch (error) {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.error("Erro ao deletar projeto", { id: loadingToast })
    } finally {
      setDeletingIds(prev => prev.filter(deletingId => deletingId !== id))
    }
  }

  const cancelDelete = () => {
    setConfirmOpen(false);
    setProjectToDelete(null);
  }

  const formatData = (project: Project) => {
    return {
      id: project.id,
      "Nome": project.name,
      "Descrição": project.description,
      "Criado em": new Date(project.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      "Atualizado em": new Date(project.updated_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      "Dispositivos": {
        text: 'Ver dispositivos',
        to: `/devices?projectId=${project.id}`,
        isLink: true
      },
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-primary">Projetos</h1>
        <div className="text-sm text-gray-500">
          {data?.length || 0} projeto(s) encontrado(s)
        </div>
        <Button variant="outline" className="w-full sm:w-auto" asChild>
          <Link to="/projects/form">
            Adicionar Projeto
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {data?.map((project: Project) => (
          <div key={project.id} className="w-full">
            <CardInfo
              data={formatData(project)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>

      {(!data || data.length === 0) && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum projeto encontrado.</p>
        </div>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
} 
