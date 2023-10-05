import { Box, Typography } from "@mui/material";
import Message from "../model/Message"

type Props = {
    message: Message;
}

const MessageItem: React.FC<Props> = (props) => {
    return <Box sx={{paddingLeft:'12px', paddingTop:'5px', paddingBottom:'5px'}}>
        <Typography color="grey" variant="button">
                {`${props.message.from}: `}
                <span style={{ color: 'black' }}>{props.message.text}</span>
            </Typography>
        </Box>
    
} 
export default MessageItem;