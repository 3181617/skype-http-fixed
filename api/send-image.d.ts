import * as api from "../interfaces/api/api";
import { Context } from "../interfaces/api/context";
import * as io from "../interfaces/http-io";
export declare function sendImage(io: io.HttpIo, apiContext: Context, img: api.NewImage, conversationId: string): Promise<api.SendMessageResult>;
