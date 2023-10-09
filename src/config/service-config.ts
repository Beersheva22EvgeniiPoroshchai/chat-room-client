import AuthService from "../service/auth/AuthService";
import AuthServiceJwt from "../service/auth/AuthServiceJwt";
import UserService from "../service/crud/UserService";
import UserServiceRest from "../service/crud/UserServiceRest";

export const authService: AuthService = new AuthServiceJwt('http://localhost:3500/users');  

export const userSevice: UserService = new UserServiceRest('localhost:3500');   //REST!!!
