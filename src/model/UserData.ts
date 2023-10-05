import { UserStatusType } from "./UserStatusType";

type UserData = {
    id?: any;
    email: string;
    role?: string;
    name?: string;
    lastName?: string;
    password?: string;
    address?: string;
    status: UserStatusType;
    message?: string
} | null
export default UserData