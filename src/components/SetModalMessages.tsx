import { Box, Typography } from "@mui/material";
import Message from "../model/Message";
import MessageItem from "./MessageItem";
import { useSelectorAuth } from "../redux/store";
import { useSelectorMessagesByIds } from "../hooks/hooks";

type Props = {
    idTo: string,
    idFrom: string
}

const SetModalMessages: React.FC<Props> = (props) => {

    const messages = useSelectorMessagesByIds(props.idFrom, props.idTo);

    return <Box sx={{border: '2px solid #3B76D2', borderRadius: '10px', minWidth:'70vw', minHeight:'12vh', mt: '1vh'}}>
        {messages.map(mes => <MessageItem message={mes}></MessageItem>)}
         </Box>
} 

export default SetModalMessages;