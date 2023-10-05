import { Box, Button, Modal, Typography} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { ReactNode, useMemo, useRef, useState } from "react";
import { useSelectorAuth } from "../redux/store";
import { useSelectorAccounts } from "../hooks/hooks";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { userSevice } from "../config/service-config";
import SetModalMessages from "./SetModalMessages";


type Props = {
    
}

const ActualUsers: React.FC<Props> = (props) => {
      
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 500,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const columnsActual: GridColDef[] = [
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
        },
         {
            field: 'actions', headerName: 'Show messages', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center', type: "actions", getActions: (params) => {
                    return [
                    <GridActionsCellItem label="show" icon={<LibraryBooksIcon sx={{fontSize:'30px'}} />}
                        onClick={() => {
                          //  props.showMessages(params.id)
                          showIncomingMessages(params.row);
                        setFlDetails(true)
                        }
                        } />,
                    ];
                }
        }
    ];
   
    const userData = useSelectorAuth();
    const accounts = useSelectorAccounts();
    const columns = useMemo(() => getColumns(), [userData, accounts])
    const clientCur = useRef<string>('') 
    const [client, setClient] = useState<string>('qwe') 
    const [openDetails, setFlDetails] = useState(false);
    
    function getColumns(): GridColDef[] {
        let res: GridColDef[] = columnsActual;
        return res;
       }

       function onClickFn (params: any) {
        clientCur.current = params.id;
        const userCur = userData?.email;
        console.log(clientCur.current)
        console.log(userCur);
        }

        function showIncomingMessages(params: any ) {
        console.log(params);  //whole object
        const from = params.id;
        const to = userData?.email;
        setClient(params.id);
        console.log(from, to);    
        const mss = userSevice.getIncomingMessages(from, to);    //return Observable
      //  console.log(mss);
           
         }

       return <Box sx={{
        display: 'flex',
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh', 
    }}>
         <Box sx={{ height: '80vh', width: '95vw', mt: '1vh' }}>
        <DataGrid onRowClick={(params) => onClickFn(params)} columns={columns} rows={accounts} />
    </Box>
    <Modal
    
            open={openDetails}
            onClose={() => setFlDetails(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <SetModalMessages idFrom={client} idTo={userData!.email}></SetModalMessages>
            </Box>
        </Modal>
        </Box>

}

export default ActualUsers;