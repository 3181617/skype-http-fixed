import { EndpointPresenceResource, MessageResource, Resource, UserPresenceResource } from "./resources";
export interface EventMessage {
    id: number;
    type: "EventMessage";
    resourceType: "NewMessage" | "UserPresence" | "EndpointPresence" | string;
    time: string;
    resourceLink: string;
    resource: Resource;
}
export interface EventNewMessage extends EventMessage {
    resourceType: "NewMessage";
    resource: MessageResource;
}
export interface EventUserPresence extends EventMessage {
    resourceType: "UserPresence";
    resource: UserPresenceResource;
}
export interface EventEndpointPresence extends EventMessage {
    resourceType: "EndpointPresence";
    resource: EndpointPresenceResource;
}
