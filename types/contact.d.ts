import { DocumentType } from "kryo/types/document";
import { Agent } from "./agent";
import { ContactProfile } from "./contact-profile";
import { DisplayName } from "./display-name";
import { DisplayNameSource } from "./display-name-source";
import { MriKey } from "./mri-key";
import { Phone } from "./phone";
import { RelationshipHistory } from "./relationship-history";
export interface Contact {
    /**
     * This seems to always have the same value as `mri`, prefer to use `mri` to identify
     * the user.
     */
    personId: MriKey;
    /**
     * MRI key of this contact, this serves as the unique id for this contact.
     */
    mri: MriKey;
    displayName: DisplayName;
    displayNameSource: DisplayNameSource;
    /**
     * Phones are normally defined in `profile.phone` but I had one case where it was defined
     * here instead (old inactive contact):
     * ```
     * [
     *   {
     *     "number": "+33666666666",
     *     "type": "mobile"
     *   }
     * ]
     * ```
     */
    phones?: Phone[];
    profile: ContactProfile;
    agent?: Agent;
    authorized: boolean;
    /**
     * Base64 string, seems to depend on the value of `authorized` (absent when `false`)
     */
    authCertificate?: string;
    blocked: boolean;
    creationTime: Date;
    relationshipHistory?: RelationshipHistory;
    suggested?: boolean;
    phoneHashes?: any[];
}
export declare const $Contact: DocumentType<Contact>;
