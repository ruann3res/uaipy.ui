import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { SensorService } from "@/services/api/v1";

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(100),
    unit_of_measurement: z.string().min(1, "Unidade é obrigatória").max(20),
    min_value: z.preprocess((v) => v === '' ? null : Number(v), z.number().nullable().default(null)),
    max_value: z.preprocess((v) => v === '' ? null : Number(v), z.number().nullable().default(null)),
});

type FormData = z.infer<typeof formSchema>;

export function SensorForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sensorId = searchParams.get("sensorId") || "";
    const deviceId = searchParams.get("deviceId") || "";
    const [isEdit, setIsEdit] = useState(false);
    const [loadingSensor, setLoadingSensor] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            unit_of_measurement: "",
            min_value: null,
            max_value: null,
        },
    });

    useEffect(() => {
        if (sensorId) {
            setIsEdit(true);
            setLoadingSensor(true);
            SensorService.getById(sensorId)
                .then(sensor => {
                    reset({
                        name: sensor.name,
                        unit_of_measurement: sensor.unit_of_measurement,
                        min_value: sensor.min_value ?? null,
                        max_value: sensor.max_value ?? null,
                    });
                })
                .finally(() => setLoadingSensor(false));
        }
    }, [sensorId, reset]);

    const onSubmit = async (data: FormData) => {
        try {
            const payload = {
                ...data,
                min_value: data.min_value ?? null,
                max_value: data.max_value ?? null,
            };
            if (isEdit && sensorId) {
                await SensorService.updateSensor(sensorId, payload);
                toast.success("Sensor atualizado com sucesso!");
            } else {
                await SensorService.createSensor({
                    ...payload,
                    device_id: deviceId,
                });
                toast.success("Sensor criado com sucesso!");
            }
            reset();
            navigate('/sensors'); // Limpa a query string
        } catch (error) {
            toast.error(isEdit ? "Erro ao atualizar sensor. Tente novamente." : "Erro ao criar sensor. Tente novamente.");
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4">
                    <Link to="/sensors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para Sensores
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        {isEdit ? "Editar Sensor" : "Criar Novo Sensor"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {isEdit ? "Altere as informações do sensor" : "Preencha as informações para criar um novo sensor"}
                    </p>
                </CardHeader>
                <CardContent>
                    {loadingSensor ? (
                        <div className="text-center py-8 text-gray-400">Carregando dados do sensor...</div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Nome do Sensor *
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Digite o nome do sensor"
                                    {...register("name")}
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="unit_of_measurement" className="text-sm font-medium">
                                    Unidade de Medida *
                                </label>
                                <Input
                                    id="unit_of_measurement"
                                    type="text"
                                    placeholder="Ex: °C, %, mm"
                                    {...register("unit_of_measurement")}
                                    className={errors.unit_of_measurement ? "border-red-500" : ""}
                                />
                                {errors.unit_of_measurement && (
                                    <p className="text-sm text-red-600">{errors.unit_of_measurement.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="min_value" className="text-sm font-medium">
                                    Valor mínimo (alerta)
                                </label>
                                <Input
                                    id="min_value"
                                    type="number"
                                    step="any"
                                    placeholder="Valor mínimo para alerta"
                                    {...register("min_value")}
                                    className={errors.min_value ? "border-red-500" : ""}
                                />
                                {errors.min_value && (
                                    <p className="text-sm text-red-600">{errors.min_value.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="max_value" className="text-sm font-medium">
                                    Valor máximo (alerta)
                                </label>
                                <Input
                                    id="max_value"
                                    type="number"
                                    step="any"
                                    placeholder="Valor máximo para alerta"
                                    {...register("max_value")}
                                    className={errors.max_value ? "border-red-500" : ""}
                                />
                                {errors.max_value && (
                                    <p className="text-sm text-red-600">{errors.max_value.message}</p>
                                )}
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button type="submit" className="flex-1">
                                    {loadingSensor ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            {isEdit ? "Atualizando..." : "Criando..."}
                                        </>
                                    ) : (
                                        isEdit ? "Atualizar Sensor" : "Criar Sensor"
                                    )}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => reset()}>
                                    Limpar
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
