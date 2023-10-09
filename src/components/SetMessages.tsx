import { Box } from "@mui/material";
import Message from "../model/Message";
import MessageItem from "./MessageItem";

type Props = {
    messages: Message[];  
}

const SetMessages: React.FC<Props> = (props) => {
    return <Box sx={{border: '2px solid #3B76D2', borderRadius: '10px', minWidth:'70vw', minHeight:'20vh', mt: '1vh'}}>
            <div style={{ maxHeight:'19vh', maxWidth:'69vw', overflowY: 'auto' }}>
            {props.messages.map(mes => <MessageItem message={mes}></MessageItem>)}
            </div>
            </Box>
} 

export default SetMessages;