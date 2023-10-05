type AccountData = {
    email: string,
    password: string,
    roles: string[];
    status: 'online'|'offline'|'blocked';
}

export default AccountData;