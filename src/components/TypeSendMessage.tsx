import React, { useRef, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import Message from "../model/Message";
import { useSelectorAuth } from "../redux/store";


type Props = {
    onClickFn: (message: Message) => void;
    onChangeFn: (event: any) => void;
    value: string;
    message: Message;
}
  

const TypeSendMessage: React.FC<Props> = (props) => {
const showSendButton = useRef<boolean>(true);
const account = useSelectorAuth();

return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "70vw",
            gap: "5px",
            mt: '1vh'
          }}
        >
          <TextField
            type="text"
            required
            fullWidth
            label="Type the message"
            onChange={props.onChangeFn}
            value={props.value}
          />
          {account?.status != 'blocked' && showSendButton? 
          <Button
            onClick={() => props.onClickFn(props.message)}
            variant="contained"
            color="primary"
          
          >
            Send message
          </Button> : 
           
          <Typography variant="h6" fontSize="1.8em" fontFamily="monospace" color="red">
           
          You has been blocked by admin 😕 </Typography>}
        </Box>
      );
}

 export default TypeSendMessage;