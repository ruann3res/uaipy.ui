import { Button } from "@/components/ui/button";
import { ProjectSelect } from "../Reports/TestProjects/ProjectSelect";
import { useProjects } from "@/hooks";
import { useDevices } from "@/hooks/useDevices";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CardInfo } from "@/components/CardInfo";
import { Device } from "@/types/devices";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export const Devices = () => {
    const navigate = useNavigate();
    const { data: projects } = useProjects();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const initialProjectId = searchParams.get("projectId") || undefined;
    const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(initialProjectId);
    const { data: devices, isLoading: isLoadingDevices } = useDevices(selectedProjectId || "");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: ['devices'] });
        };
    }, [queryClient]);

    const colorSwitcher = (status: string) => {
        switch (status) {
            case "online":
                return "green";
            case "offline":
                return "red";
        }
    }

    const handleEdit = (device: Device) => {
        navigate(`/devices/form?projectId=${selectedProjectId}&deviceId=${device.id}`);
    }

    const handleDelete = (device: Device) => {
        setDeviceToDelete(device);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!deviceToDelete) return;
        // Aqui você deve chamar o service de deleção do device
        // Exemplo: await DevicesService.delete(deviceToDelete.id)
        setConfirmOpen(false);
        setDeviceToDelete(null);
        // Atualize a lista de devices se necessário
    };

    const cancelDelete = () => {
        setConfirmOpen(false);
        setDeviceToDelete(null);
    };

    const formatData = (device: Device) => {
        return {
            "Nome": device.name,
            "Descrição": device.description,
            "Projeto": projects?.find((project) => project.id === device.project_id)?.name,
            "Criado em": new Date(device.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
            "Atualizado em": new Date(device.updated_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
            "Status": {
                tag: device.status || "offline",
                color: colorSwitcher(device.status || "offline")
            }
        }
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-primary">Dispositivos</h1>
                <div className="text-sm text-gray-500">
                    {devices?.length || 0} dispositivo(s) encontrado(s)
                </div>
                <Button variant="outline" className="w-full sm:w-auto" disabled={!selectedProjectId}>
                    <Link to={`/devices/form?projectId=${selectedProjectId}`}>
                        Adicionar Dispositivo
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <ProjectSelect
                    projects={projects || []}
                    value={selectedProjectId}
                    onChange={(value) => {
                        setSelectedProjectId(value);
                    }}
                />
            </div>

            {(!devices || devices.length === 0) && !isLoadingDevices && (
                <div className="text-center py-12">
                    <p className="text-gray-500">Nenhum dispositivo encontrado.</p>
                </div>
            )}
            <div className="space-y-4">
                {isLoadingDevices ? (
                    <div className="flex justify-center py-8">
                        <span className="text-gray-400 animate-pulse">Carregando dispositivos...</span>
                    </div>
                ) : (
                    devices?.map((device) => (
                        <div key={device.id} className="w-full">
                            <CardInfo data={formatData(device)} onEdit={() => handleEdit(device)} onDelete={() => handleDelete(device)} />
                        </div>
                    ))
                )}
            </div>
            <ConfirmDialog
                open={confirmOpen}
                title="Confirmar exclusão"
                description="Tem certeza que deseja excluir este dispositivo? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    )
}       