import { Context } from "../interfaces/api/context";
import * as io from "../interfaces/http-io";
export declare function declineContactRequest(io: io.HttpIo, apiContext: Context, contactUsername: string): Promise<void>;
