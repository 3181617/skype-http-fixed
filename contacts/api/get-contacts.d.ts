import { Context } from "../../interfaces/api/context";
import * as io from "../../interfaces/http-io";
import { Contact } from "../../types/contact";
export declare function getContacts(httpIo: io.HttpIo, apiContext: Context): Promise<Contact[]>;
