import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useCreateProject } from "@/hooks";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { decodeToken } from "@/utils";
import { ProjectService } from "@/services/api/v1";
import { useEffect, useState } from "react";

const formSchema = z.object({
    name: z.string()
        .min(1, "Nome é obrigatório")
        .min(3, "Nome deve ter pelo menos 3 caracteres")
        .max(100, "Nome não pode ter mais de 100 caracteres"),
    description: z.string()
        .max(500, "Descrição não pode ter mais de 500 caracteres")
        .optional(),
});

type FormData = z.infer<typeof formSchema>;

export function ProjectForm() {
    const navigate = useNavigate();
    const { mutateAsync: createProject, isPending } = useCreateProject();
    const { sub: userId } = decodeToken(localStorage.getItem("access_token") || "");
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("projectId");
    const [isEdit, setIsEdit] = useState(false);
    const [_, setLoadingProject] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (projectId) {
            setIsEdit(true);
            setLoadingProject(true);
            ProjectService.getById(projectId)
                .then(project => {
                    reset({
                        name: project.name,
                        description: project.description,
                    });
                })
                .finally(() => setLoadingProject(false));
        }
    }, [projectId, reset]);

    const onSubmit = async (data: FormData) => {
        try {
            const loadingToast = toast.loading(isEdit ? "Atualizando projeto..." : "Criando projeto...");
            if (isEdit && projectId) {
                await ProjectService.update(projectId, {
                    name: data.name,
                    description: data.description,
                    user_id: userId || "",
                });
                toast.success("Projeto atualizado com sucesso!", { id: loadingToast });
            } else {
                await createProject({
                    name: data.name,
                    description: data.description,
                    user_id: userId || "",
                });
                toast.success("Projeto criado com sucesso!", { id: loadingToast });
            }
            navigate('/projects');
        } catch (error) {
            toast.error(isEdit ? "Erro ao atualizar projeto. Tente novamente." : "Erro ao criar projeto. Tente novamente.");
        }
    };

    const descriptionValue = watch("description") || "";

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4">
                    <Link to="/projects">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para Projetos
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        {isEdit ? "Editar Projeto" : "Criar Novo Projeto"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {isEdit ? "Altere as informações do projeto" : "Preencha as informações para criar um novo projeto"}
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Nome do Projeto *
                            </label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Digite o nome do projeto"
                                {...register("name")}
                                className={errors.name ? "border-red-500" : ""}
                                disabled={isPending}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">
                                Descrição (opcional)
                            </label>
                            <textarea
                                id="description"
                                placeholder="Descreva o projeto..."
                                className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? "border-red-500" : ""
                                    }`}
                                {...register("description")}
                                disabled={isPending}
                            />
                            <div className="flex justify-between items-center">
                                {errors.description && (
                                    <p className="text-sm text-red-600">
                                        {errors.description.message}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground ml-auto">
                                    {descriptionValue.length}/500 caracteres
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="flex-1"
                            >
                                {isPending ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        {isEdit ? "Atualizando..." : "Criando..."}
                                    </>
                                ) : (
                                    isEdit ? "Atualizar Projeto" : "Criar Projeto"
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => reset()}
                                disabled={isPending}
                            >
                                Limpar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}