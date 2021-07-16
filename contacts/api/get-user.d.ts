import { DocumentType } from "kryo/types/document";
import { Contact } from "../../types/contact";
import { ContactGroup } from "../../types/contact-group";
/**
 * @internal
 */
export interface GetUserResult {
    contacts: Contact[];
    blocklist: any[];
    groups: ContactGroup[];
    /**
     * `"full" | ...`
     */
    scope: string;
}
/**
 * @internal
 */
export declare const $GetUserResult: DocumentType<GetUserResult>;
