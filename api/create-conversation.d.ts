import { Context } from "../interfaces/api/context";
import * as io from "../interfaces/http-io";
import { AllUsers } from "../interfaces/native-api/conversation";
export declare function createConversation(io: io.HttpIo, apiContext: Context, allUsers: AllUsers): Promise<any>;
