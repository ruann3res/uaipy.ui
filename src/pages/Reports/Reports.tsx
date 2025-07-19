import { BarChart3 } from "lucide-react";
import { ReportGraph } from "./ReportGraph";

export function Reports() {
    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div>
                    <h1 className="text-2xl font-bold text-primary">Relatórios</h1>
                    <p className="text-gray-600">Visualizar relatórios e análises de projetos</p>
                </div>
            </div>
            <ReportGraph/>
        </div>
    )
}

