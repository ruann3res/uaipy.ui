import { User } from "./user";

export type Project = {
    id: string;
    name: string;
    description: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
    owner: User;
}