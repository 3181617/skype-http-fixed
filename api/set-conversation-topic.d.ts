import { Context } from "../interfaces/api/context";
import * as io from "../interfaces/http-io";
export declare function setConversationTopic(io: io.HttpIo, apiContext: Context, conversationId: string, topic: string): Promise<void>;
