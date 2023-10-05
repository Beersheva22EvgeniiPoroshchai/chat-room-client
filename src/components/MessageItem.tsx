import { Box, Typography } from "@mui/material";
import Message from "../model/Message"

type Props = {
    message: Message;
}

const MessageItem: React.FC<Props> = (props) => {
    return <Box>
        <Typography color='grey' variant="button">{props.message.text}</Typography>
    </Box>
    
} 
export default MessageItem;