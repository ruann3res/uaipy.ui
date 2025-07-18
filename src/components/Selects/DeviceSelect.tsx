import { Button } from "../ui/button";
import { SelectItem, Select, SelectContent, SelectTrigger, SelectValue } from "../ui/select";

export function DeviceSelect({
    selectedProjectId,
    selectedDeviceId,
    devices,
    isLoadingDevices,
    onChange,
    onNavigateToRegister
  }:any) {
    if (selectedProjectId && !isLoadingDevices && devices?.length === 0) {
      return (
        <Button onClick={onNavigateToRegister} variant="outline">
          Cadastrar dispositivos
        </Button>
      );
    }
  
    return (
      <Select value={selectedDeviceId} onValueChange={onChange} disabled={!selectedProjectId}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um dispositivo" />
        </SelectTrigger>
        <SelectContent>
          {devices?.map((device:any) => (
            <SelectItem key={device.id} value={device.id}>
              {device.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }