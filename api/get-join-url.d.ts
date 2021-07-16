import { Context } from "../interfaces/api/context";
import * as io from "../interfaces/http-io";
export declare function getJoinUrl(io: io.HttpIo, apiContext: Context, conversationId: string): Promise<string>;
