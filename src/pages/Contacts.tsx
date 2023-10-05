import { Block, Delete,  } from "@mui/icons-material";
import { Box, Button, Grid, TextField, colors, useTheme } from "@mui/material"
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { useDispatchCode, useSelectorAccounts, useSelectorMessages } from "../hooks/hooks";
import { useSelectorAuth } from "../redux/store";
import { useMemo, useRef, useState } from "react";
import UserData from "../model/UserData";
import { userSevice } from "../config/service-config";
import { Confirmation } from "../common/Confirmation";
import InputResult from "../model/InputResult";
import Message from "../model/Message";
import TypeSendMessage from "../components/TypeSendMessage";
import SetMessages from "../components/SetMessages";

import { UserStatusType } from "../model/UserStatusType";



// const style = {
//     position: 'absolute' as 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
// };

const initialMessage: Message = {
    to: '', from: '', text: ''
}

// type Props = {
//     submitFn: (message: Message) => void
// }


const Contacts: React.FC = () => {
    const showBlockIcon = useRef<boolean>(true);

    const columnsAdmin: GridColDef[] = [
        {
            field: 'actions', headerName: 'Actions', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center', type: "actions", getActions: (params) => {
               if (params.id.toString().includes('admin')) {
                return [];
               } 
               const findUser = accounts.find(acc => acc?.id == params.id);
               accounts.find(acc => acc?.status == 'blocked');
      
      const actions = [
        <GridActionsCellItem label="remove" icon={<Delete />}
          onClick={() => removeUser(params.id)}
        />,
      ];

      if (findUser?.status != 'blocked' && showBlockIcon) {
        actions.push(
          <GridActionsCellItem label="block" icon={<Block />}
            onClick={() => blockUser(params.row)}
          />
        );
      }

      return actions;
    },
  },
];



       const columnsCommon: GridColDef[] = [
        {
            field: "id", headerName: 'Username', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        
        {
            field: "status", headerName: 'Connection status', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center', renderCell: params => {
                const textColor = params.value == "online" ? 'green' : params.value == "offline" ? 'blue' : 'red';
                return <span style={{ color: textColor }}>{params.value}</span>;
            }
        }
    ];
  
       const [message, setMessage] = useState<Message>(initialMessage);
       const dispatch = useDispatchCode();
       const userData = useSelectorAuth();
       const messageArray = useSelectorMessages();
       const accounts = useSelectorAccounts();
       const theme = useTheme();
       const columns = useMemo(() => getColumns(), [userData, accounts])   
       const [openConfirm, setOpenConfirm] = useState(false);
       const title = useRef('');
       const content = useRef('');
       const userId = useRef('');
       const confirmFn = useRef<any>(null);
       const user = useRef<UserData | undefined>();
       const client = useRef<string>('');
       
       
       function getColumns(): GridColDef[] {
        let res: GridColDef[] = columnsCommon;
        if (userData && userData.role == 'admin') {
            res = res.concat(columnsAdmin);
        }
   //     message.from = userData!.email
        setMessage((prevMessage) => ({
        ...prevMessage,
        from: userData ? userData.email : '',
    }));
        return res;
       }

        function removeUser(id: any) {
        title.current = 'Are you sure to remove user?';
        const user = accounts.find(acc => acc?.id == id);
        content.current = `You are going to remove user: ${user?.id}`;
        userId.current = id;
        confirmFn.current = actualRemove;
        setOpenConfirm(true);
        }

        async function actualRemove(isOk: boolean) {
            let errorMessage: string = '';
            if (isOk) {
              try {
                 await userSevice.deleteUser(userId.current);
              } catch (error: any) {
                errorMessage = error;
            }
        } 
        dispatch(errorMessage, '');
        setOpenConfirm(false);

   }


   function blockUser(userData: UserData): Promise<InputResult> {
    const res: InputResult = { status: 'error', message: '' };
    title.current = 'Are you sure to block user?';
        content.current = `You are going to block user: ${userData?.id}`;
        user.current = userData;
        confirmFn.current = actualBlock;
        setOpenConfirm(true);
        return Promise.resolve(res);
   }

   async function actualBlock(isOk:boolean) {
    let errorMessage: string = '';
    if (isOk) {
      try {
         await userSevice.blockUser(user.current!);
      } catch (error: any) {
        errorMessage = error;
    }
} 
dispatch(errorMessage, '');
setOpenConfirm(false);
   }

    function onClickFn (params: any) {
    client.current = params.id;
    setMessage((prevMessage) => ({
        ...prevMessage,
        to: client.current,
    }));
    console.log(message);
    }

    function handlerMessage(event: any) {
    const text = event.target.value;
    setMessage((prevMessage) => ({
        ...prevMessage,
        text: text,
    }));
    
    }

    function onClickButtonFn(message: Message) {
        userSevice.sendMessage(message);
        setMessage((prevMessage) => ({
            ...prevMessage,
            text: '',
        })) 
    }

   return <Box sx={{
    display: 'flex',
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',
    height: '90vh', 
}}>
    
 <TypeSendMessage onClickFn={onClickButtonFn} onChangeFn={handlerMessage} value={message.text} message={message}/>
 <SetMessages messages={messageArray}></SetMessages>
    <Box sx={{ height: '80vh', width: '95vw', mt: '1vh' }}>
        <DataGrid onRowClick={(params) => onClickFn(params)} columns={columns} rows={accounts} />
    </Box>

    <Confirmation
        confirmFn={confirmFn.current}
        open={openConfirm}
        title={title.current}
        content={content.current}
    ></Confirmation>
</Box>




}

export default Contacts;