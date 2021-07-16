import { DocumentType } from "kryo/types/document";
import { Invite } from "../../types/invite";
/**
 * @internal
 */
export interface GetInvitesResult {
    inviteList: Invite[];
}
/**
 * @internal
 */
export declare const $GetInvitesResult: DocumentType<GetInvitesResult>;
