import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useCreateDevice } from "@/hooks/useDevices";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DevicesService } from "@/services/api/v1/DevicesService";
import { useEffect, useState } from "react";

const formSchema = z.object({
    name: z.string()
        .min(1, "Nome é obrigatório")
        .min(3, "Nome deve ter pelo menos 3 caracteres")
        .max(100, "Nome não pode ter mais de 100 caracteres"),
    description: z.string()
        .max(500, "Descrição não pode ter mais de 500 caracteres")
        .optional(),
    device_type: z.string()
        .min(1, "Tipo de dispositivo é obrigatório")
        .min(3, "Tipo de dispositivo deve ter pelo menos 3 caracteres")
        .max(100, "Tipo de dispositivo não pode ter mais de 100 caracteres"),
    status: z.enum(["online", "offline"]).optional(),
});

type FormData = z.infer<typeof formSchema>;

export function DeviceForm() {
    const navigate = useNavigate();
    const { mutateAsync: createDevice, isPending } = useCreateDevice();
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("projectId");
    const deviceId = searchParams.get("deviceId");
    const [isEdit, setIsEdit] = useState(false);
    const [loadingDevice, setLoadingDevice] = useState(false);

    const {
        register, 
        handleSubmit, 
        formState: { errors },
        reset,
        watch,
        setValue
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            device_type: "",
            status: "offline",
        },
    });

    useEffect(() => {
        if (deviceId) {
            setIsEdit(true);
            setLoadingDevice(true);
            DevicesService.getById(deviceId)
                .then(device => {
                    reset({
                        name: device.name,
                        description: device.description,
                        device_type: device.device_type,
                        status: device.status as "online" | "offline",
                    });
                })
                .finally(() => setLoadingDevice(false));
        }
    }, [deviceId, reset]);

    const onSubmit = async (data: FormData) => {
        try {
            if (isEdit && deviceId) {
                await DevicesService.update(deviceId, {
                    name: data.name,
                    description: data.description || "",
                    device_type: data.device_type,
                    status: data.status || "offline",
                    project_id: projectId || "",
                });
                toast.success("Dispositivo atualizado com sucesso!");
            } else {
                await createDevice({
                    name: data.name,
                    description: data.description || "",
                    device_type: data.device_type,
                    status: data.status || "offline",
                    project_id: projectId || "",
                });
                toast.success("Dispositivo criado com sucesso!");
            }
            reset();
            navigate('/devices');
        } catch (error) {
            toast.error(isEdit ? "Erro ao atualizar dispositivo. Tente novamente." : "Erro ao criar dispositivo. Tente novamente.");
        }
    };

    const handleStatusChange = (value: string) => {
        setValue("status", value as "online" | "offline");
    };

    const descriptionValue = watch("description") || "";

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4">
                    <Link to="/devices">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        {isEdit ? "Editar Dispositivo" : "Criar Novo Dispositivo"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {isEdit ? "Altere as informações do dispositivo" : "Preencha as informações para criar um novo dispositivo"}
                    </p>
                </CardHeader>
                <CardContent>
                    {loadingDevice ? (
                        <div className="text-center py-8 text-gray-400">Carregando dados do dispositivo...</div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Nome do Dispositivo *
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Digite o nome do dispositivo"
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
                                    placeholder="Descreva o dispositivo..."
                                    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                        errors.description ? "border-red-500" : ""
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
                            <div className="space-y-2">

                                <label htmlFor="device_type" className="text-sm font-medium">
                                    Tipo de Dispositivo *
                                </label>
                                <Input
                                    id="device_type"
                                    type="text"
                                    placeholder="Digite o tipo de dispositivo"
                                    {...register("device_type")}
                                    className={errors.device_type ? "border-red-500" : ""}
                                    disabled={isPending}
                                />
                                {errors.device_type && (
                                    <p className="text-sm text-red-600">
                                        {errors.device_type.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="status" className="text-sm font-medium">
                                    Status *
                                </label>
                                <Select
                                    onValueChange={handleStatusChange}
                                    value={watch("status") || "offline"}
                                    disabled={isPending}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="online">Online</SelectItem>
                                        <SelectItem value="offline">Offline</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                        isEdit ? "Atualizar Dispositivo" : "Criar Dispositivo"
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
}