import { Box, Typography } from "@mui/material";
import Message from "../model/Message";
import MessageItem from "./MessageItem";

type Props = {
    messages: Message[];  
}

const SetMessages: React.FC<Props> = (props) => {
    return <Box sx={{border: '1px solid #3B76D2', borderRadius: '10px', minWidth:'70vw', minHeight:'12vh', mt: '1vh'}}>
        {props.messages.map(mes => <MessageItem message={mes}></MessageItem>)}
         </Box>
} 

export default SetMessages;