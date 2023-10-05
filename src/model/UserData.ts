import { StringLiteral } from "typescript";

type UserData = {
    id?: any;
    email: string;
    role?: string;
    name?: string;
    lastName?: string;
    password?: string;
    address?: string;
    status?: 'online'| 'offline'| 'blocked';
    message?: string
} | null
export default UserData