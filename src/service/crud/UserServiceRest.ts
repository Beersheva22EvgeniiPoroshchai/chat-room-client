import { Observable, Subscriber } from "rxjs";
import UserData from "../../model/UserData";
import { AUTH_DATA_JWT } from "../auth/AuthServiceJwt";
import UserService from "../crud/UserService";
import Message from "../../model/Message";


class Cache {
    cacheMessage: Message[] = [];
    addToCache(message: Message) {
        this.cacheMessage.push(message);
}
    getCache() {
        return this.cacheMessage;
}

}

async function getResponseText(response: Response): Promise<string> {
    let res = '';
    if (!response.ok) {
        const { status } = response;
        res = status == 401 || status == 403 ? 'Authentication' : await response.text();
    }
    return res;
}

function getHeaders(): HeadersInit {
    const res: HeadersInit = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(AUTH_DATA_JWT) || ''}`
    }
    return res;
}

async function fetchRequest(url: string, options: RequestInit, userData?: UserData): Promise<Response> {
    options.headers = getHeaders();
    if (userData) {
        options.body = JSON.stringify(userData);
    }
    let flUpdate = true;
    let responseText = '';
    try {
        if (options.method == "DELETE" || options.method == "PUT") {
            flUpdate = false;
            await fetchRequest(url, {method: "GET"});
            flUpdate = true;
        }
        const response = await fetch(url, options);
        responseText = await getResponseText(response);
        if (responseText) {
            throw responseText;
        }
        return response;
    } catch (error: any) {
        if (!flUpdate) {
            throw error;
        }
        throw responseText ? responseText : "Server is unavailable. Repeat later on";
    }
}

async function fetchAllUsers(url: string):Promise <UserData[]|string> {
    const response = await fetchRequest(url+'/users/allusers', {});
    return await response.json()
}

export default class UserServiceRest implements UserService {
    private observable: Observable<UserData[] | string> | null = null;
    private subscriber: Subscriber<string|UserData[]> | undefined;
    private observableMessages: Observable<Message[] | string> | null = null;
    private subscriberMessages: Subscriber<string|Message[]> | undefined;
    private observableMessagesIncom: Observable<Message[] | string> | null = null;
    private subscriberMessagesIncom: Subscriber<string|Message[]> | undefined;
    private cache = new Cache();
    private urlService:string;
    private urlWebsocket:string;
    private webSocket: WebSocket | undefined;
    constructor( baseUrl: string) {
        this.urlService = `http://${baseUrl}`;
        this.urlWebsocket = `ws://${baseUrl}/contacts/websocket`;
}
   

async blockUser(userData: UserData): Promise<UserData> {
     const response = await fetchRequest(`${this.urlService}/users/${userData?.id}`,
       { method: 'PUT' }, userData);
        this.subscriberNext();
    return await response.json();
}

        private subscriberNext(): void {
        fetchAllUsers(this.urlService).then(users => {
                this.subscriber?.next(users);
                console.log(users);
                
        })
        .catch(error => this.subscriber?.next(error));
    }

    async deleteUser(id: any): Promise<void> {
            await fetchRequest(`${this.urlService}/users/${id}`, {
                method: 'DELETE',
            });
            this.subscriberNext()
    }

    getAllUsers(): Observable<UserData[] | string> {
      //  if (!this.observable) {
            this.observable = new Observable<UserData[] | string>(subscriber => {
                this.subscriber = subscriber;
                this.subscriberNext();
                this.connectWS()
                return () => this.disconnectWS();
            })
        //}
        return this.observable;
    }

    private disconnectWS(): void {
       this.webSocket?.close();
       this.webSocket = undefined;
    }

    private connectWS() {
       if (!this.webSocket) {
        this.webSocket = new WebSocket(this.urlWebsocket, localStorage.getItem(AUTH_DATA_JWT) || ''); 
       }
       this.webSocket.onmessage = message => {
         let actMessageObj = JSON.parse(message.data);
         console.log(actMessageObj);
         this.getActions(actMessageObj);
       }
}


    private getActions(actMessageObj: any) {
        switch (actMessageObj.type) {
            case 'client':
                this.subscriberNext();
                break;
                case 'message':
                    this.cache.addToCache((actMessageObj));
                    this.subscriberMessages?.next(this.cache.getCache());
                    break;
            default:
                break;
        }
    }

    async addUser(userData: UserData): Promise<UserData> {
            if (userData?.id == 0) {
                delete userData.id;
            }
            const response = await fetchRequest(this.urlService, {
                method: 'POST',
               }, userData)
           ;
           const respJson =  response.json();
           this.subscriberNext();
           return respJson;
    }

    sendMessage(message: Message): void {
        this.webSocket?.send(JSON.stringify(message));
    
         
    }

    getIncomingMessages(idTo: any, idFrom: any): Observable<Message[]|string> {
       // if (!this.observableMessagesIncom) {
            this.observableMessagesIncom = new Observable<Message[] | string>(subscriber => {
                this.subscriberMessagesIncom = subscriber;
                this.subscriberNextIncom(idTo, idFrom);
              
            })    
       // }
            return this.observableMessagesIncom;
        }

        async subscriberNextIncom(idFrom: any, idTo: any): Promise<void> {
            const response = await fetchRequest(`${this.urlService}/messages/incoming?from=${idFrom}&to=${idTo}`,
             {method: "GET"})
             this.subscriberMessagesIncom?.next(await response.json())
             // /incoming?from=...&to=...  
         }

    
         getAllMessages(): Observable<Message[] | string> {
            if (!this.observableMessages) {
                this.observableMessages = new Observable<Message[] | string>(subscriber => {
                    this.subscriberMessages = subscriber;
                   // this.subscriberNextMessages();
                    this.connectWS()
                    return () => this.disconnectWS();
                })
            }
            return this.observableMessages;
        }


   async subscriberNextMessages(): Promise<void> {
        // const response = await fetchRequest(`${this.urlService}/messages/all`,
        //  {method: "GET"})
        //  this.subscriberMessages?.next(await response.json())
         
     }




    

}

