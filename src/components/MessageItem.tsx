import { Box, Typography } from "@mui/material";
import Message from "../model/Message"
import { useSelectorAuth } from "../redux/store";

type Props = {
    message: Message;
}

const MessageItem: React.FC<Props> = (props) => {
    const curUser = useSelectorAuth();
    const isCurUserSender = props.message.from === curUser!.email;   
    
    return <Box sx={{paddingLeft:'12px', paddingTop:'5px', paddingBottom:'5px'}}>
        
        <Typography color="grey" variant="button">
            
                {isCurUserSender? 'From you: ' : `${props.message.from}: `}
                <span style={{ color: 'black' }}>{props.message.text}</span>
            </Typography>
            
        </Box>

    
} 
export default MessageItem;