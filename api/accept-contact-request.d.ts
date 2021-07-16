import { Context } from "../interfaces/api/context";
import * as io from "../interfaces/http-io";
export declare function acceptContactRequest(io: io.HttpIo, apiContext: Context, contactUsername: string): Promise<void>;
