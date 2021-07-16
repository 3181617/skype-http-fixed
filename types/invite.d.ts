import { DocumentType } from "kryo/types/document";
import { DisplayName } from "./display-name";
import { InviteMessage } from "./invite-message";
import { MriKey } from "./mri-key";
import { Url } from "./url";
/**
 * Represents a pending incoming contact invitation.
 */
export interface Invite {
    /**
     * MRI key of the contact
     *
     * @see [[MriKey]]
     */
    mri: MriKey;
    displayname: DisplayName;
    avatarUrl: Url;
    /**
     * All the messages received from this contact.
     *
     * Note: Skype only displays the most recent one (2017-01-09).
     */
    invites: InviteMessage[];
}
/**
 * Runtime representation of the [[Invite]] type.
 */
export declare const $Invite: DocumentType<Invite>;
