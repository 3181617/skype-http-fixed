import * as api from "../interfaces/api/api";
import { Context } from "../interfaces/api/context";
import * as io from "../interfaces/http-io";
export declare function sendMessage(io: io.HttpIo, apiContext: Context, message: api.NewMessage, conversationId: string): Promise<api.SendMessageResult>;
