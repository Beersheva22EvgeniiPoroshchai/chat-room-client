import AccountData from "../../model/AccountData";
import LoginData from "../../model/LoginData";
import UserData from "../../model/UserData";

export type NetworkType = {providerName: string, providerIconUrl: string}

export default interface AuthService {
    login(login: LoginData): Promise<UserData>;
    logout(): Promise<void>;
    signUp(accData: AccountData): Promise<UserData>;
  //  getAvailableProvider(): NetworkType[];
   // signUp(loginData: LoginData): Promise<void>;
}