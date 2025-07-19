import { Analytics } from "@/services/api/v1/AnalyticsService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder, HardDrive, Thermometer, Database } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const UserAnalytics = ({userAnalytics}: {userAnalytics: Analytics}) => {
    const navigate = useNavigate()

    const analyticsData = [
        {
            title: "Total de Projetos",
            value: userAnalytics?.total_projects || 0,
            icon: Folder,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            route: "/projects"
        },
        {
            title: "Total de Dispositivos",
            value: userAnalytics?.total_devices || 0,
            icon: HardDrive,
            color: "text-green-600",
            bgColor: "bg-green-50",
            route: "/devices"
        },
        {
            title: "Total de Sensores",
            value: userAnalytics?.total_sensors || 0,
            icon: Thermometer,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            route: "/sensors"
        },
        {
            title: "Total de Dados de Sensores",
            value: userAnalytics?.total_sensor_data || 0,
            icon: Database,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            route: "/reports"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData.map((item, index) => {
                const IconComponent = item.icon
                return (
                    <Card 
                        key={index} 
                        className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                        onClick={() => navigate(item.route)}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {item.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                                    <IconComponent className={`h-4 w-4 ${item.color}`} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {item.value.toLocaleString('pt-BR')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}