import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SensorData } from "@/types";

interface SensorSelectProps {
  sensors: SensorData[];
  selectedSensors: string[];
  onAdd: (id: string) => void;
  show: boolean;
  setShow: (show: boolean) => void;
}

export function SensorSelect({
  sensors,
  selectedSensors,
  onAdd,
  show,
  setShow,
}: SensorSelectProps) {
  if (!show || !sensors || sensors.length === 0) return null;
  return (
    <div className="relative">
      <Select
        onValueChange={(value) => {
          if (!selectedSensors.includes(value)) {
            onAdd(value);
          }
          setShow(false);
        }}
        value=""
        defaultOpen={true}
        onOpenChange={(open) => {
          if (!open) setShow(false);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um sensor" />
        </SelectTrigger>
        <SelectContent>
          {sensors
            .map((item, index) => {
              const uniqueId = item.sensor_id;
              return {
                ...item,
                uniqueId,
                originalIndex: index,
              };
            })
            .filter((item) => !selectedSensors.includes(item.uniqueId))
            .map((item) => (
              <SelectItem key={item.uniqueId} value={item.uniqueId}>
                {item.sensor_name || `Sensor ${item.originalIndex + 1}`}
              </SelectItem>
            ))}
          {sensors.filter((item) => !selectedSensors.includes(item.sensor_id))
            .length === 0 && (
            <SelectItem disabled value="none">
              Todos os sensores já foram adicionados
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
