import React from "react";
import { Box, Button, TextField } from "@mui/material";
import Message from "../model/Message";

type Props = {
    onClickFn: (message: Message) => void;
    onChangeFn: (event: any) => void;
    value: string;
    message: Message;
}

const TypeSendMessage: React.FC<Props> = (props) => {
    return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "70vw",
            gap: "5px",
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
          <Button
            onClick={() => props.onClickFn(props.message)}
            variant="contained"
            color="primary"
          >
            Send message
          </Button>
        </Box>
      );
}

export default TypeSendMessage;