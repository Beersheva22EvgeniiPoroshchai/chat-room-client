import { useMediaQuery, useTheme } from "@mui/material";
import { RouteType } from "./Navigator";
import Navigator from "./Navigator";
import NavigatorPortrait from "./NavigatorPortrait";

const NavigatorDispatcher: React.FC <{routes: RouteType[]}> = ({routes}) => {
    const theme = useTheme();
    const isPortrait = useMediaQuery(theme.breakpoints.down ('sm'));
    return !isPortrait ? <Navigator routes={routes}/> : <NavigatorPortrait routes={routes}/>

} 


export default NavigatorDispatcher;