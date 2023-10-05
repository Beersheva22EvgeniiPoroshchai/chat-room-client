import Message from "../../model/Message";
import UserData from "../../model/UserData";
import { Observable } from "rxjs";

export default interface UserService {
    addUser(userData: UserData): Promise<UserData>;
    getAllUsers(): Observable<UserData[] | string>;
    deleteUser(id: any): Promise<void>;
  //  updateUser(userData: UserData): Promise<UserData>;
   blockUser(userData: UserData): Promise<UserData>;
   sendMessage(message: Message): void;
   getAllMessages(): Observable<Message[] | string>
}