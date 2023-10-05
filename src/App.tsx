import './App.css'
import { useMemo } from 'react';
import routesConf from './config/routes-config.json'
import UserData from './model/UserData';
import { RouteType } from './navigators/Navigator';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavigatorDispatcher from './navigators/NavigatorDispatcher';
import { useSelectorAuth, useSelectorCode } from './redux/store';
import CodeType from './model/CodeType';
import {useDispatch} from "react-redux";
import { StatusType } from './model/StatusType';
import { authActions } from './redux/slices/authSlice';
import { authService } from './config/service-config';
import SignIn from './pages/SignIn';
import SignOut from './pages/SignOut';
import SignUp from './pages/SignUp';
import AboutUs from './pages/AboutUs';
import OutcomingMessages from './pages/OutcomingMessages';
import Contacts from './pages/Contacts';
import IncomingMessages from './pages/IncomingMessages';
import Chat from './pages/Chat';
import AdminManagement from './pages/AdminManagement';
import NotFound from './pages/NotFound';
import { codeActions } from './redux/slices/codeSlice';
import { Alert, Snackbar } from '@mui/material';

//const {noauthenticated, user, admin} = routesConfig;

const {always, authenticated, admin, noadmin, noauthenticated} = routesConf;

type RouteTypeOrder = RouteType & {order? : number}
function getRoutes(userData: UserData): RouteType[] {
  const res: RouteTypeOrder[] = [];
  res.push(...always);
  if (userData) {
    res.push(...authenticated);
    
    if (userData.role === 'admin') {
      res.push(...admin);
    } else {
      res.push(...noadmin);
    }
} else {
  res.push(...noauthenticated);
}
res.sort((r1, r2) => {
  let res = 0;
if (r1.order && r2.order) {
  res = r1.order - r2.order
}
return res;
});
if (userData) {
  res[res.length-1].label = userData!.email;
}
return res;
}

const App: React.FC = () => {
  const userData = useSelectorAuth();
  const code = useSelectorCode();
  const dispatch = useDispatch();

 const [alertMessage, severity] = useMemo(() => codeProcessing(), [code]);
  const routes = useMemo(() => getRoutes(userData), [userData]);
  
  function codeProcessing(): [string, StatusType] {
    const res: [string, StatusType] = [code.message, 'success'];
    switch (code.code) {
      case CodeType.OK: res[1] = 'success'; break;
      case CodeType.SERVER_ERROR: res[1] = 'error'; break;
      case CodeType.UNKNOWN: res[1] = 'error'; break;
      case CodeType.AUTH_ERROR: res[1] = 'error';
      dispatch(authActions.reset()); 
      authService.logout()
    }
    
    return res;
  }
  
  return <BrowserRouter>
  <Routes>
    <Route path="/" element={<NavigatorDispatcher routes={routes}/>}>
        <Route index element={<Contacts/>}/>
        <Route path="signin" element={<SignIn/>}/>
        <Route path="signup" element={<SignUp/>}/>
        <Route path="aboutus" element={<AboutUs/>}/>
        <Route path="inmessages" element={<IncomingMessages/>}/>
        <Route path="outmessages" element={<OutcomingMessages/>}/>
        <Route path="chat" element={<Contacts/>}/>
        <Route path="signout" element={<SignOut/>}/>
        <Route path="signup" element={<SignUp/>}/>
        <Route path="/*" element={<NotFound/>}/>
    </Route>
  </Routes>
  <Snackbar open={!!alertMessage} autoHideDuration={20000}
                     onClose={() => dispatch(codeActions.reset())}>
                        <Alert  onClose = {() => dispatch(codeActions.reset())} severity={severity} sx={{ width: '100%' }}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
  </BrowserRouter>
}
export default App;


