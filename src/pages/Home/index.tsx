import { EmailButton } from "@/components/EmailButton";
import { DeviceSelect, ProjectSelect } from "@/components/Selects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDevices,
  useGenerateReport,
  useProjects,
  useRecentSensorData,
} from "@/hooks";
import { useUserAnalytics } from "@/hooks/Analytics";
import {
  useAvaregeAnnualData,
  useAvaregeDailyData,
  useAvaregeMonthlyData,
  useAvaregeWeeklyData,
} from "@/hooks/useAvaregeData";
import { useBlockedUser } from "@/hooks/useBlockedUser";
import { SensorData } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { UserAnalytics } from "./UserAnalytics";

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    }
  } catch (error) {
    return dateString;
  }
  return "Data inválida";
};

const formatDateTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch (error) {
    return dateString;
  }
  return dateString;
};

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 dark:text-gray-200">{`Data: ${formatDateTime(
          label
        )}`}</p>
        <p className="text-blue-600 dark:text-blue-400">
          {`${payload[0].name}: ${parseFloat(payload[0].value).toFixed(
            2
          )} ${unit}`}
        </p>
      </div>
    );
  }
  return null;
};

const CustomXAxisTick = ({ x, y, payload }: any) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="currentColor"
        fontSize={12}
        className="text-gray-600 dark:text-gray-400"
      >
        {formatDate(payload.value)}
      </text>
    </g>
  );
};

export const Home = () => {
  const navigate = useNavigate();
  const { isBlocked } = useBlockedUser();
  const { data: userAnalytics } = useUserAnalytics();

  const { data: projects } = useProjects();

  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(isBlocked ? "" : undefined);

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(
    undefined
  );
  const [period, setPeriod] = useState("monthly");
  const [isPeriodChanging, setIsPeriodChanging] = useState(false);

  const { data: devices, isLoading: isLoadingDevices } = useDevices(
    selectedProjectId || ""
  );

  useEffect(() => {
    if (!isBlocked && projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId, isBlocked]);

  useEffect(() => {
    if (devices && devices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(devices[0].id);
    }
  }, [devices, selectedDeviceId]);

  const currentDeviceId = useMemo(() => {
    if (selectedDeviceId) return selectedDeviceId;
    if (devices && devices.length > 0) return devices[0].id;
    return undefined;
  }, [selectedDeviceId, devices]);

  const isDefaultDevice = currentDeviceId === undefined;

  const { data: dailyData, isLoading: dailyLoading } = useAvaregeDailyData(
    isDefaultDevice ? "" : currentDeviceId || ""
  );
  const { data: monthlyData, isLoading: monthlyLoading } =
    useAvaregeMonthlyData(isDefaultDevice ? "" : currentDeviceId || "");
  const { data: weeklyData, isLoading: weeklyLoading } = useAvaregeWeeklyData(
    isDefaultDevice ? "" : currentDeviceId || ""
  );
  const { data: annualData, isLoading: annualLoading } = useAvaregeAnnualData(
    isDefaultDevice ? "" : currentDeviceId || ""
  );

  const { data: recentSensorData, isLoading: recentDataLoading } =
    useRecentSensorData(
      isDefaultDevice ? currentDeviceId || "" : "",
      isDefaultDevice ? 50 : 0
    );

  const sensorData = recentSensorData as SensorData[] | undefined;

  const processData = (data: any[] | undefined, sensorName: string) => {
    if (!data) return [];

    const actualData = Array.isArray(data) ? data : (data as any)?.json || [];

    const processedData = actualData
      .filter((item: any) => item.sensor_name === sensorName)
      .map((item: any) => ({
        ...item,
        average_value: parseFloat(item.average_value),
        date: item.date,
      }))
      .filter((item: any) => {
        const date = new Date(item.date);
        const isValid = !isNaN(date.getTime());
        return isValid;
      })
      .sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );

    return processedData;
  };

  const processRecentData = (
    sensorData: SensorData[] | undefined,
    sensorName: string
  ) => {
    if (!sensorData) return [];

    const sensor = sensorData.find((s) => s.sensor_name === sensorName);
    if (!sensor || !sensor.recent_data) return [];

    return sensor.recent_data
      .map((item: any) => ({
        date: item.timestamp,
        average_value: parseFloat(item.value),
        unit_of_measurement: sensor.unit_of_measurement,
      }))
      .filter((item: any) => {
        const date = new Date(item.date);
        const isValid = !isNaN(date.getTime()) && !isNaN(item.average_value);
        return isValid;
      })
      .sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  };

  const getDataByPeriod = (sensorName: string) => {
    if (isDefaultDevice && sensorData) {
      return processRecentData(sensorData, sensorName);
    }

    let data: any[] | undefined;
    let maxItems: number;

    switch (period) {
      case "daily":
        data = dailyData;
        maxItems = 7;
        break;
      case "weekly":
        data = weeklyData;
        maxItems = 4;
        break;
      case "monthly":
        data = monthlyData;
        maxItems = 12;
        break;
      case "annual":
        data = annualData;
        maxItems = 5;
        break;
      default:
        data = monthlyData;
        maxItems = 12;
    }

    const processedData = processData(data || [], sensorName);

    let filteredData;

    if (period === "daily") {
      const oneDayAgo = new Date();
      oneDayAgo.setHours(oneDayAgo.getHours() - 24);

      filteredData = processedData.filter((item: any) => {
        const itemDate = new Date(item.date);
        return itemDate >= oneDayAgo;
      });
    } else if (period === "weekly") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      filteredData = processedData.filter((item: any) => {
        const itemDate = new Date(item.date);
        return itemDate >= oneWeekAgo;
      });
    } else if (period === "monthly") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

      filteredData = processedData.filter((item: any) => {
        const itemDate = new Date(item.date);
        return itemDate >= oneMonthAgo;
      });
    } else if (period === "annual") {
      const oneYearAgo = new Date();
      oneYearAgo.setDate(oneYearAgo.getDate() - 365);

      filteredData = processedData.filter((item: any) => {
        const itemDate = new Date(item.date);
        return itemDate >= oneYearAgo;
      });
    } else {
      filteredData = processedData
        .sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, maxItems)
        .reverse();
    }

    return filteredData;
  };

  const airHum = useMemo(
    () => getDataByPeriod("air_hum"),
    [
      period,
      dailyData,
      weeklyData,
      monthlyData,
      annualData,
      currentDeviceId,
      isDefaultDevice,
      sensorData,
    ]
  );
  const airTemp = useMemo(
    () => getDataByPeriod("air_tem"),
    [
      period,
      dailyData,
      weeklyData,
      monthlyData,
      annualData,
      currentDeviceId,
      isDefaultDevice,
      sensorData,
    ]
  );
  const soilHum = useMemo(
    () => getDataByPeriod("soil_hum"),
    [
      period,
      dailyData,
      weeklyData,
      monthlyData,
      annualData,
      currentDeviceId,
      isDefaultDevice,
      sensorData,
    ]
  );
  const soilTemp = useMemo(
    () => getDataByPeriod("soil_tem"),
    [
      period,
      dailyData,
      weeklyData,
      monthlyData,
      annualData,
      currentDeviceId,
      isDefaultDevice,
      sensorData,
    ]
  );
  const rain = useMemo(
    () => getDataByPeriod("rain"),
    [
      period,
      dailyData,
      weeklyData,
      monthlyData,
      annualData,
      currentDeviceId,
      isDefaultDevice,
      sensorData,
    ]
  );

  const isLoading = isDefaultDevice
    ? recentDataLoading
    : dailyLoading || monthlyLoading || weeklyLoading || annualLoading;

  const sensorConfigs = {
    airTemp: {
      name: "Temperatura do Ar",
      unit: airTemp[0]?.unit_of_measurement || "°C",
      color: "#ff6b6b",
      chartType: "point",
    },
    airHum: {
      name: "Umidade do Ar",
      unit: airHum[0]?.unit_of_measurement || "%",
      color: "#4ecdc4",
      chartType: "point",
    },
    soilHum: {
      name: "Umidade do Solo",
      unit: soilHum[0]?.unit_of_measurement || "%",
      color: "#45b7d1",
      chartType: "point",
    },
    soilTemp: {
      name: "Temperatura do Solo",
      unit: soilTemp[0]?.unit_of_measurement || "°C",
      color: "#96ceb4",
      chartType: "point",
    },
    rain: {
      name: "Chuva",
      unit: rain[0]?.unit_of_measurement || "mm",
      color: "#feca57",
      chartType: "area",
    },
  };

  const ChartComponent = ({ data, config }: any) => {
    if (!currentDeviceId) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md min-h-[350px] flex items-center justify-center border border-gray-200 dark:border-gray-700">
          <div className="text-gray-500 dark:text-gray-400">
            {isLoadingDevices
              ? "Carregando dispositivos..."
              : "Nenhum dispositivo disponível"}
          </div>
        </div>
      );
    }

    if (isLoading || isPeriodChanging) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md min-h-[350px] flex items-center justify-center border border-gray-200 dark:border-gray-700">
          <div className="text-gray-500 dark:text-gray-400">
            {isPeriodChanging
              ? "Atualizando período..."
              : "Carregando dados..."}
          </div>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md min-h-[350px] flex items-center justify-center border border-gray-200 dark:border-gray-700">
          <div className="text-gray-500 dark:text-gray-400">
            Nenhum dado disponível para este dispositivo
          </div>
        </div>
      );
    }

    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const renderChart = () => {
      switch (config.chartType) {
        case "point":
          return (
            <LineChart {...commonProps}>
              <XAxis dataKey="date" tick={<CustomXAxisTick />} />
              <YAxis />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Tooltip content={<CustomTooltip unit={config.unit} />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="average_value"
                stroke={config.color}
                name={config.name}
                strokeWidth={2}
                dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          );
        case "area":
          return (
            <AreaChart {...commonProps}>
              <XAxis dataKey="date" tick={<CustomXAxisTick />} />
              <YAxis />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Tooltip content={<CustomTooltip unit={config.unit} />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="average_value"
                stroke={config.color}
                fill={config.color}
                name={config.name}
                fillOpacity={0.6}
              />
            </AreaChart>
          );
        default:
          return (
            <LineChart {...commonProps}>
              <XAxis dataKey="date" tick={<CustomXAxisTick />} />
              <YAxis />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Tooltip content={<CustomTooltip unit={config.unit} />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="average_value"
                stroke={config.color}
                name={config.name}
                strokeWidth={2}
                dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          );
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md min-h-[350px] border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          {config.name}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    );
  };

  const { mutate: generateReport } = useGenerateReport();

  const hasSensorData = useMemo(() => {
    if (isDefaultDevice) {
      return (
        sensorData &&
        sensorData.some(
          (sensor) => sensor.recent_data && sensor.recent_data.length > 0
        )
      );
    } else {
      const hasData = (data: any[] | undefined) => data && data.length > 0;
      return (
        hasData(dailyData) ||
        hasData(weeklyData) ||
        hasData(monthlyData) ||
        hasData(annualData)
      );
    }
  }, [
    isDefaultDevice,
    sensorData,
    dailyData,
    weeklyData,
    monthlyData,
    annualData,
  ]);

  const handleSendEmail = (email: string) => {
    if (!hasSensorData) {
      toast.error("Não é possível enviar relatório sem dados dos sensores");
      return;
    }

    generateReport({ id: currentDeviceId || "", email });
    toast.success("Relatório enviado com sucesso!");
  };

  const handlePeriodChange = (newPeriod: string) => {
    setIsPeriodChanging(true);
    setPeriod(newPeriod);

    setTimeout(() => {
      setIsPeriodChanging(false);
    }, 500);
  };

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Página Geral
        </h1>
        <p className="text-gray-700 dark:text-gray-300">Bem-vindo ao UaiPy!</p>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <EmailButton
              onSendEmail={handleSendEmail}
              buttonText="Enviar Relatório por Email"
              placeholder="Digite o email para envio"
              disabled={!hasSensorData}
              disabledTooltip="Não há dados dos sensores para gerar relatório"
            />
            {!hasSensorData && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                ⚠️ Botão desabilitado: Não há dados dos sensores para gerar
                relatório
              </p>
            )}
          </div>
        </div>

        {isBlocked && (
          <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Nota:</strong> Sua conta tem acesso limitado. Para acessar
              todas as funcionalidades, crie uma nova conta em nosso site.
            </p>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-4 mb-6">
          <UserAnalytics
            userAnalytics={
              userAnalytics || {
                user_id: "",
                projects: [],
                username: "",
                total_projects: 0,
                total_devices: 0,
                total_sensors: 0,
                total_sensor_data: 0,
              }
            }
          />
        </div>
        <div className="flex flex-col gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Veja alguns dados que nossos sensores estão coletando do nosso
            dispositivo{" "}
            <span className="text-amber-500 dark:text-amber-400">
              ({devices?.find((device) => device.id === currentDeviceId)?.name})
            </span>
            {!isBlocked && selectedProjectId && (
              <span className="text-blue-600 dark:text-blue-400">
                {" "}
                do projeto{" "}
                {
                  projects?.find((project) => project.id === selectedProjectId)
                    ?.name
                }
              </span>
            )}
            {isDefaultDevice && (
              <span className="text-green-600 dark:text-green-400 text-lg">
                {" "}
                - Dados em Tempo Real
              </span>
            )}
          </h1>
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              {!isDefaultDevice && (
                <Select value={period} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="annual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {!isBlocked && (
                <ProjectSelect
                  projects={projects || []}
                  value={selectedProjectId}
                  onChange={(projectId: string) => {
                    setSelectedProjectId(projectId);
                    setSelectedDeviceId(undefined);
                  }}
                />
              )}

              <DeviceSelect
                selectedProjectId={selectedProjectId}
                selectedDeviceId={currentDeviceId}
                devices={devices || []}
                isLoadingDevices={isLoadingDevices}
                onChange={(value: string) => {
                  setSelectedDeviceId(value);
                }}
                onNavigateToRegister={() => navigate("/devices/form")}
              />
            </div>
          </div>
        </div>

        {!isDefaultDevice && (
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Média no período atual:</strong>{" "}
              {period === "daily"
                ? "Diário (últimas 24 horas)"
                : period === "weekly"
                ? "Semanal (última semana)"
                : period === "monthly"
                ? "Mensal (último mês)"
                : "Anual (último ano)"}
              {isPeriodChanging && (
                <span className="ml-2 text-blue-600 dark:text-blue-300">
                  ⏳ Atualizando...
                </span>
              )}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              {period === "daily"
                ? "Dados filtrados por período: últimas 24 horas"
                : period === "weekly"
                ? "Dados filtrados por período: última semana (7 dias)"
                : period === "monthly"
                ? "Dados filtrados por período: último mês (30 dias)"
                : "Dados filtrados por período: último ano (365 dias)"}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Para acessar os dados exatos, utilize a aba de relatório.
            </p>
          </div>
        )}

        {isDefaultDevice && (
          <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Dados em Tempo Real:</strong> Exibindo os dados mais
              recentes coletados pelos sensores deste dispositivo.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ChartComponent
            data={airTemp}
            config={sensorConfigs.airTemp}
            sensorKey="airTemp"
          />
          <ChartComponent
            data={airHum}
            config={sensorConfigs.airHum}
            sensorKey="airHum"
          />
          <ChartComponent
            data={soilTemp}
            config={sensorConfigs.soilTemp}
            sensorKey="soilTemp"
          />
          <ChartComponent
            data={soilHum}
            config={sensorConfigs.soilHum}
            sensorKey="soilHum"
          />
          <ChartComponent
            data={rain}
            config={sensorConfigs.rain}
            sensorKey="rain"
          />
        </div>
      </div>
    </>
  );
};
