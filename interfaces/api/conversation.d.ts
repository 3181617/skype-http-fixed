export interface ThreadProperties {
    topic?: string;
    lastjoinat?: string;
    version?: string;
}
export interface Conversation {
    threadProperties?: ThreadProperties;
    id: string;
    type: "Conversation" | "Thread" | string;
    version: number;
    members?: string[];
}
