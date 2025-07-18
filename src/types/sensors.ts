export type SensorData = {
    sensor_id: string;
    sensor_name: string;
    unit_of_measurement: string;
    recent_data: {
        value: string;
        timestamp: string;
        id: string;
        sensor_id: string;
    }[];
}

export type SensorType = {
    id: string;
    name: string;
    unit_of_measurement: string;
    min_value: number | null;
    max_value: number | null;
    device_id: string;
}