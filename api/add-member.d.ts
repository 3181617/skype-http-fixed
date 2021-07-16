import { Context } from "../interfaces/api/context";
import * as io from "../interfaces/http-io";
export declare function addMemberToConversation(io: io.HttpIo, apiContext: Context, memberId: string, converstionId: string, role?: string): Promise<void>;
