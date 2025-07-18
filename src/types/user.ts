export type User = {
    id: string;
    username: string;
    email: string;
    hashed_password: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}