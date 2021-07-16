import * as api from "./api";
import * as errors from "./errors/index";
import * as apiInterface from "./interfaces/api/api";
import * as contact from "./interfaces/api/contact";
import * as conversation from "./interfaces/api/conversation";
import * as events from "./interfaces/api/events";
import * as resources from "./interfaces/api/resources";
import { Location as _Location } from "./types/location";
export { connect, ConnectOptions } from "./connect";
export { events };
export { resources };
export declare type Api = api.Api;
export declare namespace Api {
    type NewMessage = apiInterface.NewMessage;
    type SendMessageResult = apiInterface.SendMessageResult;
}
export declare type Contact = contact.Contact;
export declare namespace Contact {
    type Contact = contact.Contact;
    type Phone = contact.Phone;
    type Location = _Location;
}
export declare type Conversation = conversation.Conversation;
export declare namespace Conversation {
    type Conversation = conversation.Conversation;
    type ThreadProperties = conversation.ThreadProperties;
}
export { errors };
