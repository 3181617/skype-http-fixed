import { Context } from "../interfaces/api/context";
import { Conversation } from "../interfaces/api/conversation";
import * as io from "../interfaces/http-io";
export declare function getConversation(io: io.HttpIo, apiContext: Context, conversationId: string): Promise<Conversation>;
