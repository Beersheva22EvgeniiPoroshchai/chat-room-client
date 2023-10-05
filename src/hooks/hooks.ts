import { useDispatch } from "react-redux";
import CodeType from "../model/CodeType";
import { codeActions } from "../redux/slices/codeSlice";
import { useEffect, useState } from "react";
import UserData from "../model/UserData";
import { Subscription } from "rxjs";
import { userSevice } from "../config/service-config";
import Message from "../model/Message";
import { useSelectorAuth } from "../redux/store";

export function useDispatchCode() {
    const dispatch = useDispatch();
    return (error: string, successMessage: string) => {
        let code: CodeType = CodeType.OK;
        let message: string = '';
        
        if (error.includes('Authentication')) {
            code = CodeType.AUTH_ERROR;
            message = "Authentication error, mooving to Sign In";
        } else {
            code = error.includes('unavailable') ? CodeType.SERVER_ERROR :
                CodeType.UNKNOWN;
            message = error;
        }
        dispatch(codeActions.set({ code, message: message || successMessage }))
    }
}

export function useSelectorAccounts() {
    const dispatch = useDispatchCode();
    const [users, setUsers] = useState<UserData[]>([]);
    useEffect(() => {

        const subscription: Subscription = userSevice.getAllUsers()
            .subscribe({
                next(usersArray: UserData[] | string) {
                    let errorMessage: string = '';
                    if (typeof usersArray === 'string') {
                        errorMessage = usersArray;
                    } else {
                        setUsers(usersArray);
                    }
                    dispatch(errorMessage, '');

                }
            });
        return () => subscription.unsubscribe();
    }, []);
    return users;
}


export function useSelectorMessages() {
    const dispatch = useDispatchCode();
    const [messages, setMessages] = useState<Message[]>([]);
    useEffect(() => {

        const subscription: Subscription = userSevice.getAllMessages()
            .subscribe({
                next(messArray: Message[] | string) {
                    let errorMessage: string = '';
                    if (typeof messArray === 'string') {
                        errorMessage = messArray;
                    } else {
                        setMessages(messArray);
                    }
                    dispatch(errorMessage, '');

                }
            });
        return () => subscription.unsubscribe();
    }, []);
    return messages;
}




export function useSelectorMessagesByIds(idTo: any, idFrom: any) {
    const dispatch = useDispatchCode()
    const [messages, setMessages] = useState<Message[]>([]);
    useEffect(() => {
        const subscription: Subscription = userSevice.getIncomingMessages(idTo, idFrom)
            .subscribe({
                next(messArray: Message[] | string) {
                    let errorMessage: string = '';
                    if (typeof messArray === 'string') {
                        errorMessage = messArray;
                    } else {
                        setMessages(messArray);
                    }
                    dispatch(errorMessage, '');

                }
            });
        return () => subscription.unsubscribe();
    }, []);
    return messages;


    }
