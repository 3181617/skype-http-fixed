import { Context } from "../interfaces/api/context";
import * as io from "../interfaces/http-io";
import { Contact } from "../types/contact";
import { Invite } from "../types/invite";
export interface ContactsInterface {
    /**
     * Get the pending incoming contact invitations.
     *
     * @param apiContext Current API context: with the skype token, cookies and username
     * @return The list of currently pending incoming contact invitations.
     */
    getInvites(apiContext: Context): Promise<Invite[]>;
    /**
     * Get the contacts of the current user.
     *
     * @param apiContext Current API context: with the skype token, cookies and username
     * @return The list of contacts.
     */
    getContacts(apiContext: Context): Promise<Contact[]>;
}
/**
 * @internal
 */
export declare class ContactsService {
    private readonly httpIo;
    constructor(httpIo: io.HttpIo);
    getInvites(apiContext: Context): Promise<Invite[]>;
    getContacts(apiContext: Context): Promise<Contact[]>;
}
