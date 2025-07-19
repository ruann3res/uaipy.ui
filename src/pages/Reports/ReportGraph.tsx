import { useState } from "react";
import { useDevices, useRecentSensorData } from "@/hooks/useDevices";
import { useProjects } from "@/hooks";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { ProjectSelect, SensorSelect } from "@/components/Selects";
import { CustomChart } from "./Charts/CustomChart";
import { Device } from "@/types";
import { SensorData } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReadSensor } from "@/hooks/useSensor";
import { SensorChartSwitcher } from "./Charts/SensorChartSwitcher";

export function ReportGraph() {
  const navigate = useNavigate();
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [showSensorSelect, setShowSensorSelect] = useState(false);

  const [sensorChartTypes, setSensorChartTypes] = useState<Record<string, "line" | "bar">>({});

  const { data: projects } = useProjects();
  const { data: devices, isLoading: isLoadingDevices } = useDevices(selectedProjectId || "");
  const { data: recentSensorData, isLoading: isLoadingSensorData } = useRecentSensorData(
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

  function DeviceSelect({ devices, value, onChange, disabled }: DeviceSelectProps) {
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
          <Button onClick={() => navigate('/devices')} variant="outline">
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
                  Adicionar Sensor ({sensorData.filter((item: SensorData) => {
                    const uniqueId = item.sensor_id;
                    return !selectedSensors.includes(uniqueId);
                  }).length} disponíveis)
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
          const selectedSensor = sensorData?.find((s: SensorData) => s.sensor_id === sensorId);
          if (!selectedSensor) return null;
          const onlyBar = isChuva(selectedSensor);
          const chartType = onlyBar ? "bar" : (sensorChartTypes[sensorId] || "line");
          return (
            <div key={sensorId}>
              <SensorChartSwitcher
                chartType={chartType}
                onChange={(type) => setSensorChartTypes((prev) => ({ ...prev, [sensorId]: type }))}
                onlyBar={onlyBar}
              />
              <h2 className="text-lg font-bold mb-2">{selectedSensor.sensor_name}</h2>
              {selectedSensor.recent_data && selectedSensor.recent_data.length > 0 && (
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
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

