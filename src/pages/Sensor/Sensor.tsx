import { Button } from "@/components/ui/button";
import { useDevices, useProjects, useSensors } from "@/hooks";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DeviceSelect, ProjectSelect } from "@/components/Selects";
import { CardInfo } from "@/components/CardInfo";
import { SensorType } from "@/types";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export const Sensor = () => {
    const navigate = useNavigate();
    const { data: projects } = useProjects();
    const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [sensorToDelete, setSensorToDelete] = useState<SensorType | null>(null);
    const { data: devices, isLoading: isLoadingDevices } = useDevices(selectedProjectId || "");

    const { data: sensors, isLoading: isLoadingSensors } = useSensors(selectedDeviceId || "");
console.log(sensors)

const formatData = (sensor: SensorType) => {
    return {
        "Nome": sensor.name,
        "Unidade de medida": sensor.unit_of_measurement,
        "Valor mínimo (alerta)": sensor.min_value || "N/A",
        "Valor máximo (alerta)": sensor.max_value || "N/A",
        "Dispositivo": devices?.find(device => device.id === sensor.device_id)?.name || "N/A",
    }
}

const handleDelete = (sensor: SensorType) => {
    setSensorToDelete(sensor);
    setConfirmOpen(true);
}

const confirmDelete = async () => {
    if (!sensorToDelete) return;
    setConfirmOpen(false);
    setSensorToDelete(null);
}

const cancelDelete = () => {
    setConfirmOpen(false);
    setSensorToDelete(null);
}

    return (
        <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-primary">Sensores</h1>
                <div className="text-sm text-gray-500">
                    {sensors?.length || 0} sensor(es) encontrado(s)
                </div>
                <Button variant="outline" className="w-full sm:w-auto" disabled={!selectedDeviceId}>
                    <Link to={`/sensors/form?deviceId=${selectedDeviceId}`}>
                        Adicionar Sensor
                    </Link>
                </Button>
            </div>
            <div className="flex gap-4 mb-4">
        <ProjectSelect
          projects={projects || []}
          value={selectedProjectId}
          onChange={(value: string) => {
            setSelectedProjectId(value);
            setSelectedDeviceId(undefined);
          }}
        />
        {selectedProjectId && !isLoadingDevices && devices?.length === 0 ? (
          <Button onClick={() => navigate('/devices')} variant="outline">
            Cadastrar dispositivos
          </Button>
        ) : (
          <DeviceSelect
            selectedProjectId={selectedProjectId}
            selectedDeviceId={selectedDeviceId}
            devices={devices || []}
            isLoadingDevices={isLoadingDevices}
            onChange={(value: string) => {
              setSelectedDeviceId(value);
            }}
            onNavigateToRegister={() => navigate('/devices/form')}
          />
        )}
        </div>
      <div className="space-y-4">
          <div  className="w-full">
            {sensors?.map((sensor: SensorType) => (
              <CardInfo
                data={formatData(sensor)}
                onEdit={() => navigate(`/sensors/form?sensorId=${sensor.id}`)}
                onDelete={() => handleDelete(sensor)}
              />
            ))}
          </div>
      </div>
      {(!sensors || sensors.length === 0) && !isLoadingSensors && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum sensor encontrado.</p>
        </div>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir este sensor? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      </div>
    )
}       