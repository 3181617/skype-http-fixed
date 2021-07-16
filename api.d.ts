/// <reference types="node" />
import events from "events";
import * as api from "./interfaces/api/api";
import { Contact as _Contact } from "./interfaces/api/contact";
import { Context as ApiContext } from "./interfaces/api/context";
import { Conversation } from "./interfaces/api/conversation";
import * as apiEvents from "./interfaces/api/events";
import { HttpIo } from "./interfaces/http-io";
import { AllUsers } from "./interfaces/native-api/conversation";
import { MessagesPoller } from "./polling/messages-poller";
import { Contact } from "./types/contact";
import { Invite } from "./types/invite";
export interface ApiEvents extends NodeJS.EventEmitter {
}
export declare class Api extends events.EventEmitter implements ApiEvents {
    io: HttpIo;
    context: ApiContext;
    messagesPoller: MessagesPoller;
    private readonly contactsService;
    constructor(context: ApiContext, io: HttpIo);
    acceptContactRequest(contactUsername: string): Promise<this>;
    declineContactRequest(contactUsername: string): Promise<this>;
    getContactInvites(): Promise<Invite[]>;
    getContact(contactId: string): Promise<_Contact>;
    getContacts(): Promise<Contact[]>;
    getConversation(conversationId: string): Promise<Conversation>;
    getConversations(): Promise<Conversation[]>;
    sendMessage(message: api.NewMessage, conversationId: string): Promise<api.SendMessageResult>;
    setConversationTopic(conversationId: string, topic: string): Promise<void>;
    getJoinUrl(conversationId: string): Promise<string>;
    addMemberToConversation(conversationId: string, memberId: string): Promise<void>;
    createConversation(allUsers: AllUsers): Promise<any>;
    sendImage(message: api.NewImage, conversationId: string): Promise<api.SendMessageResult>;
    getState(): ApiContext.Json;
    setStatus(status: api.Status): Promise<void>;
    /**
     * Start polling and emitting events
     */
    listen(): Promise<this>;
    /**
     * Stop polling and emitting events
     */
    stopListening(): Promise<this>;
    protected handlePollingEvent(ev: apiEvents.EventMessage): void;
}
