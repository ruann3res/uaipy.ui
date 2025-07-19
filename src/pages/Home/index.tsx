import { DeviceSelect, ProjectSelect } from "@/components/Selects";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDevices, useProjects } from "@/hooks";
import { useAvaregeDailyData, useAvaregeMonthlyData, useAvaregeWeeklyData } from "@/hooks/useAvaregeData";
import { useBlockedUser } from "@/hooks/useBlockedUser";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, AreaChart, Area, ResponsiveContainer } from "recharts";
import { UserAnalytics } from "./UserAnalytics";
import { useUserAnalytics } from "@/hooks/Analytics";


const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            });
        }
    } catch (error) {
        console.warn('Erro ao formatar data:', dateString, error);
    }
    return "Data inválida";
};


const formatDateTime = (dateString: string) => {
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    } catch (error) {
        console.warn('Erro ao formatar data no tooltip:', dateString, error);
    }
    return dateString;
};

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 dark:text-gray-200">{`Data: ${formatDateTime(label)}`}</p>
        <p className="text-blue-600 dark:text-blue-400">
          {`${payload[0].name}: ${parseFloat(payload[0].value).toFixed(2)} ${unit}`}
        </p>
      </div>
    );
  }
  return null;
};

const CustomXAxisTick = ({ x, y, payload }: any) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="middle" fill="currentColor" fontSize={12} className="text-gray-600 dark:text-gray-400">
                {formatDate(payload.value)}
            </text>
        </g>
    );
};

export const Home = () => {
    const navigate = useNavigate();
    const { isBlocked } = useBlockedUser();
    const {data: userAnalytics} = useUserAnalytics()
    
    const defaultProjectId = "679f4282-072d-4e90-bf6b-80709a3605eb"
    
    const { data: projects } = useProjects();
    
    const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(
        isBlocked ? defaultProjectId : undefined
    );
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
    const { data: devices, isLoading: isLoadingDevices } = useDevices(selectedProjectId || "");
    const [period, setPeriod] = useState("monthly")

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

    const { data: dailyData, isLoading: dailyLoading } = useAvaregeDailyData(currentDeviceId || "")
    const { data: monthlyData, isLoading: monthlyLoading } = useAvaregeMonthlyData(currentDeviceId || "")
    const { data: weeklyData, isLoading: weeklyLoading } = useAvaregeWeeklyData(currentDeviceId || "")

    const processData = (data: any[] | undefined, sensorName: string) => {
        if (!data) return [];

        const processedData = data
            .filter((item) => item.sensor_name === sensorName)
            .map((item) => ({
                ...item,
                average_value: parseFloat(item.average_value),
                date: item.date
            }))
            .filter((item) => {
                const date = new Date(item.date);
                const isValid = !isNaN(date.getTime());
                if (!isValid) {
                    console.warn(`Data inválida encontrada para sensor ${sensorName}:`, item.date);
                }
                return isValid;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return processedData;
    };

    const getDataByPeriod = (sensorName: string) => {
        let data;
        switch (period) {
            case "daily":
                data = dailyData;
                break;
            case "weekly":
                data = weeklyData;
                break;
            case "monthly":
                data = monthlyData;
                break;
            default:
                data = monthlyData;
        }
        return processData(data || [], sensorName);
    };

    const airHum =  useMemo(() => getDataByPeriod("air_hum"), [period, dailyData, weeklyData, monthlyData, currentDeviceId]);
    const airTemp = useMemo(() => getDataByPeriod("air_tem"), [period, dailyData, weeklyData, monthlyData, currentDeviceId]);
    const soilHum = useMemo(() => getDataByPeriod("soil_hum"), [period, dailyData, weeklyData, monthlyData, currentDeviceId]);
    const soilTemp = useMemo(() => getDataByPeriod("soil_tem"), [period, dailyData, weeklyData, monthlyData, currentDeviceId]);
    const rain = useMemo(() => getDataByPeriod("rain"), [period, dailyData, weeklyData, monthlyData, currentDeviceId]);

    const isLoading = dailyLoading || monthlyLoading || weeklyLoading;

    const sensorConfigs = {
        airTemp: { name: "Temperatura do Ar", unit: airTemp[0]?.unit_of_measurement || "°C", color: "#ff6b6b", chartType: "point" },
        airHum: { name: "Umidade do Ar", unit: airHum[0]?.unit_of_measurement || "%", color: "#4ecdc4", chartType: "point" },
        soilHum: { name: "Umidade do Solo", unit: soilHum[0]?.unit_of_measurement || "%", color: "#45b7d1", chartType: "point" },
        soilTemp: { name: "Temperatura do Solo", unit: soilTemp[0]?.unit_of_measurement || "°C", color: "#96ceb4", chartType: "point" },
        rain: { name: "Chuva", unit: rain[0]?.unit_of_measurement || "mm", color: "#feca57", chartType: "area" },
    };

    const ChartComponent = ({ data, config }: any) => {
        if (!currentDeviceId) {
            return (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md min-h-[350px] flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400">
                        {isLoadingDevices ? "Carregando dispositivos..." : "Nenhum dispositivo disponível"}
                    </div>
                </div>
            );
        }

        if (isLoading) {
            return (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md min-h-[350px] flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400">Carregando dados...</div>
                </div>
            );
        }

        if (!data || data.length === 0) {
            return (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md min-h-[350px] flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400">Nenhum dado disponível para este dispositivo</div>
                </div>
            );
        }

        const commonProps = {
            data,
            margin: { top: 5, right: 30, left: 20, bottom: 5 }
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
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{config.name}</h2>
                <ResponsiveContainer width="100%" height={300}>
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        );
    };


    return (
        <>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Página Geral</h1>
                <p className="text-gray-700 dark:text-gray-300">Bem-vindo ao UaiPy!</p>
                {isBlocked && (
                    <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                            <strong>Nota:</strong> Sua conta tem acesso limitado. Para acessar todas as funcionalidades, 
                            crie uma nova conta em nosso site.
                        </p>
                    </div>
                )}
                
            </div>

            <div className="p-6">
                <div className="flex flex-col gap-4 mb-6">
                    <UserAnalytics userAnalytics={userAnalytics || {
                        user_id: "",
                        projects: [],
                        username: "",
                        total_projects: 0,
                        total_devices: 0,
                        total_sensors: 0,
                        total_sensor_data: 0,
                    }}/>
                </div>
                <div className="flex flex-col gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Veja alguns dados que nossos sensores estão coletando do nosso dispositivo{' '}
                        <span className="text-amber-500 dark:text-amber-400">({devices?.find(device => device.id === currentDeviceId)?.name})</span>
                        {!isBlocked && selectedProjectId && (
                            <span className="text-blue-600 dark:text-blue-400"> do projeto {projects?.find(project => project.id === selectedProjectId)?.name}</span>
                        )}
                    </h1>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Selecione o período" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Diário</SelectItem>
                                    <SelectItem value="weekly">Semanal</SelectItem>
                                    <SelectItem value="monthly">Mensal</SelectItem>
                                </SelectContent>
                            </Select>
                            
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
                                onNavigateToRegister={() => navigate('/devices/form')}
                            />
                        </div>
                    </div>
                </div>

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
    )
}