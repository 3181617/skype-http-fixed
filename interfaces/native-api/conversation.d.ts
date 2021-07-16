import { MessageResource } from "./resources";
export interface ThreadProperties {
    topic?: string;
    lastjoinat?: string;
    version?: string;
}
export interface Join {
    Blob: string;
    Id: string;
    JoinUrl: string;
    ThreadId: string;
}
export interface Conversation {
    targetLink: string;
    threadProperties?: ThreadProperties;
    id: string;
    type: "Conversation" | string;
    version: number;
    properties: {
        consumptionhorizon?: string;
    };
    lastMessage: {} | MessageResource;
    messages: string;
}
export declare type Capability = "AddMember" | "ChangeTopic" | "ChangePicture" | "EditMsg" | "CallP2P" | "SendText" | "SendSms" | "SendContacts" | "SendVideoMsg" | "SendMediaMsg" | "ChangeModerated";
export interface ThreadMember {
    id: string;
    userLink: string;
    role: "User" | "Admin" | string;
    capabilities: any[];
    linkedMri: string;
    userTile: string;
    friendlyName: string;
}
export interface AllUsers {
    [type: string]: string[];
}
export interface Members {
    id: string;
    role: "Admin" | "User" | string;
}
export interface Thread {
    id: string;
    type: "Thread" | string;
    properties: {
        createdat: string;
        creator: string;
        topic: string;
        joiningenabled: "true" | "false" | string;
        capabilities: Capability[];
        lastjoinat?: string;
        version?: string;
    };
    members: ThreadMember[];
    version: number;
    messages: string;
}
