import { ProjectSelect, SensorSelect } from "@/components/Selects";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/hooks";
import { useDevices, useRecentSensorData } from "@/hooks/useDevices";
import { useReadSensor } from "@/hooks/useSensor";
import { Device, SensorData } from "@/types";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomChart } from "./Charts/CustomChart";
import { SensorChartSwitcher } from "./Charts/SensorChartSwitcher";

export function ReportGraph() {
  const navigate = useNavigate();
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(undefined);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(
    undefined
  );
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [showSensorSelect, setShowSensorSelect] = useState(false);

  const [sensorChartTypes, setSensorChartTypes] = useState<
    Record<string, "line" | "bar">
  >({});

  const { data: projects } = useProjects();
  const { data: devices, isLoading: isLoadingDevices } = useDevices(
    selectedProjectId || ""
  );
  const { data: recentSensorData, isLoading: isLoadingSensorData } =
    useRecentSensorData(
      selectedDeviceId ? selectedDeviceId : "",
      selectedDeviceId ? 24 : 0
    );
  const { data: readSensorData } = useReadSensor(selectedSensors[0]);

  const sensorData = recentSensorData as SensorData[] | undefined;
  function isChuva(sensor: SensorData) {
    return sensor.sensor_name?.toLowerCase().includes("rain");
  }

  interface DeviceSelectProps {
    devices: Device[];
    value?: string;
    onChange: (id: string) => void;
    disabled?: boolean;
  }

  function DeviceSelect({
    devices,
    value,
    onChange,
    disabled,
  }: DeviceSelectProps) {
    return (
      <Select onValueChange={onChange} value={value} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um dispositivo" />
        </SelectTrigger>
        <SelectContent>
          {devices?.map((device) => (
            <SelectItem key={device.id} value={device.id}>
              {device.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <>
      <div className="flex gap-4 mb-4">
        <ProjectSelect
          projects={projects || []}
          value={selectedProjectId}
          onChange={(value) => {
            setSelectedProjectId(value);
            setSelectedDeviceId(undefined);
            setSelectedSensors([]);
            setShowSensorSelect(false);
          }}
        />
        {selectedProjectId && !isLoadingDevices && devices?.length === 0 ? (
          <Button onClick={() => navigate("/devices")} variant="outline">
            Cadastrar dispositivos
          </Button>
        ) : (
          <DeviceSelect
            devices={devices || []}
            value={selectedDeviceId}
            onChange={(value: string) => {
              setSelectedDeviceId(value);
              setSelectedSensors([]);
              setShowSensorSelect(false);
            }}
            disabled={!selectedProjectId}
          />
        )}
        {selectedDeviceId && (
          <>
            {isLoadingSensorData ? (
              <Button variant="outline" disabled>
                Carregando sensores...
              </Button>
            ) : sensorData && sensorData.length > 0 && !showSensorSelect ? (
              sensorData.filter((item: SensorData) => {
                const uniqueId = item.sensor_id;
                return !selectedSensors.includes(uniqueId);
              }).length > 0 ? (
                <Button
                  onClick={() => setShowSensorSelect(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Sensor (
                  {
                    sensorData.filter((item: SensorData) => {
                      const uniqueId = item.sensor_id;
                      return !selectedSensors.includes(uniqueId);
                    }).length
                  }{" "}
                  disponíveis)
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  Todos os sensores adicionados
                </Button>
              )
            ) : sensorData && sensorData.length === 0 ? (
              <Button variant="outline" disabled>
                Nenhum sensor encontrado
              </Button>
            ) : null}
            <SensorSelect
              sensors={sensorData || []}
              selectedSensors={selectedSensors}
              onAdd={(id) => setSelectedSensors([...selectedSensors, id])}
              show={showSensorSelect}
              setShow={setShowSensorSelect}
            />
          </>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 mt-6">
        {selectedSensors.map((sensorId) => {
          const selectedSensor = sensorData?.find(
            (s: SensorData) => s.sensor_id === sensorId
          );
          if (!selectedSensor) return null;
          const onlyBar = isChuva(selectedSensor);
          const chartType = onlyBar
            ? "bar"
            : sensorChartTypes[sensorId] || "line";
          return (
            <div key={sensorId} className="relative">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">
                  {selectedSensor.sensor_name}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSelectedSensors(
                      selectedSensors.filter((id) => id !== sensorId)
                    )
                  }
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SensorChartSwitcher
                chartType={chartType}
                onChange={(type) =>
                  setSensorChartTypes((prev) => ({ ...prev, [sensorId]: type }))
                }
                onlyBar={onlyBar}
              />
              {selectedSensor.recent_data &&
              selectedSensor.recent_data.length > 0 ? (
                <CustomChart
                  data={selectedSensor.recent_data}
                  chartType={chartType}
                  xKey={"timestamp"}
                  yKey={"value"}
                  legendName={selectedSensor.sensor_name}
                  unit={readSensorData?.unit_of_measurement}
                  dataMax={readSensorData?.max_value}
                  dataMin={readSensorData?.min_value}
                />
              ) : (
                <div className="flex items-center justify-center h-32 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      Este sensor não possui dados
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Nenhum dado foi coletado ainda
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
