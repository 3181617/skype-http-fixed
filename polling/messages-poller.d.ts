/// <reference types="node" />
import _events from "events";
import { ParsedConversationId } from "../interfaces/api/api";
import { Context as ApiContext } from "../interfaces/api/context";
import * as resources from "../interfaces/api/resources";
import * as httpIo from "../interfaces/http-io";
import * as nativeMessageResources from "../interfaces/native-api/message-resources";
import * as nativeResources from "../interfaces/native-api/resources";
export declare function parseContactId(contactId: string): ParsedConversationId;
export declare function formatRichTextResource(retObj: resources.Resource, nativeResource: nativeMessageResources.RichText): resources.RichTextResource;
export declare function formatTextResource(retObj: resources.Resource, nativeResource: nativeMessageResources.Text): resources.TextResource;
export declare function formatControlClearTypingResource(retObj: resources.Resource, nativeResource: nativeMessageResources.ControlClearTyping): resources.ControlClearTypingResource;
export declare function formatGenericMessageResource(nativeResource: nativeResources.MessageResource, type: resources.ResourceType): {
    type: resources.ResourceType;
    id: string;
    composeTime: Date;
    arrivalTime: Date;
    from: ParsedConversationId;
    conversation: string;
    native: nativeResources.MessageResource;
};
export declare function formatConversationUpdateResource(nativeResource: nativeResources.ConversationUpdate): resources.ConversationUpdateResource;
export declare function formatControlTypingResource(retObj: resources.Resource, nativeResource: nativeMessageResources.ControlTyping): resources.ControlTypingResource;
export declare function formatSignalFlamingoResource(retObj: resources.Resource, nativeResource: nativeMessageResources.SignalFlamingo): resources.SignalFlamingoResource;
export declare class MessagesPoller extends _events.EventEmitter {
    io: httpIo.HttpIo;
    apiContext: ApiContext;
    intervalId: number | NodeJS.Timer | null;
    constructor(io: httpIo.HttpIo, apiContext: ApiContext);
    isActive(): boolean;
    run(): this;
    stop(): this;
    /**
     * Get the new messages / events from the server.
     * This function always returns a successful promise once the messages are retrieved or an error happens.
     *
     * If any error happens, the message-poller will emit an `error` event with the error.
     */
    protected getMessages(): Promise<void>;
}
