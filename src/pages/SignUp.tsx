import { Typography } from "@mui/material";
import {authService } from "../config/service-config"
import InputResult from "../model/InputResult";
import LoginData from "../model/LoginData";
import UserData from "../model/UserData";
import { authActions } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import SignUpForm from "../forms/SignUpForm";
import AccountData from "../model/AccountData";



const SignUp: React.FC = () => {
   
    const dispatch = useDispatch();

    async function submitFn(accData: AccountData) {
        let inputResult: InputResult = {status: 'error',
         message: "Server unavailable, repeat later on"}
        try {
          await authService.signUp(accData);
        } catch (error) {
        }
    }

    async function logInFn(loginData: LoginData): Promise<UserData|undefined>  {
          const res: UserData = await authService.login(loginData);
          dispatch(authActions.set(res));
          return res;
    }

    return <Typography>
        <SignUpForm submitFn={submitFn} logInFn={logInFn}/>
    </Typography>
}
 
 export default SignUp;