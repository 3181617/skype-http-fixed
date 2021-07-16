import { Contact } from "../interfaces/api/contact";
import { Context } from "../interfaces/api/context";
import * as io from "../interfaces/http-io";
export declare const VIRTUAL_CONTACTS: Set<string>;
export declare function getContact(io: io.HttpIo, apiContext: Context, contactId: string): Promise<Contact>;
