import { Context } from "../interfaces/api/context";
import { Conversation } from "../interfaces/api/conversation";
import * as io from "../interfaces/http-io";
export declare function getConversations(io: io.HttpIo, apiContext: Context): Promise<Conversation[]>;
