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

    return <Box>
        <div style={{ maxHeight:'500px', maxWidth:'500px', overflowY: 'auto' }}>
        {messages.map(mes => <MessageItem message={mes}></MessageItem>)}
        </div>
         </Box>
} 

export default SetModalMessages;