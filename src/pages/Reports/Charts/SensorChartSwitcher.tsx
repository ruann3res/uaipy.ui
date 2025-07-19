import { Button } from "@/components/ui/button";

interface SensorChartSwitcherProps {
  chartType: "line" | "bar";
  onChange: (type: "line" | "bar") => void;
  onlyBar?: boolean;
}

export function SensorChartSwitcher({ chartType, onChange, onlyBar }: SensorChartSwitcherProps) {
  if (onlyBar) return null;
  return (
    <div className="flex gap-2 mb-2">
      <Button onClick={() => onChange("line")} variant={chartType === "line" ? "default" : "outline"}>Linha</Button>
      <Button onClick={() => onChange("bar")} variant={chartType === "bar" ? "default" : "outline"}>Barra</Button>
    </div>
  );
}
