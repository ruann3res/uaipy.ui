export type Device = {
    id: string;
    name: string;
    description: string;
    serial_number: string | null;
    device_type: string;
    status: string;
    project_id: string;
    created_at: Date;
    updated_at: Date;
}