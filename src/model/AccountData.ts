import { UserStatusType } from "./UserStatusType";

type AccountData = {
    email: string,
    password: string,
    roles: string[];
    status: UserStatusType;
}

export default AccountData;