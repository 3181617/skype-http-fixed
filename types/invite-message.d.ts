import { DocumentType } from "kryo/types/document";
/**
 * Example (JSON HTTP response):
 *
 * ```
 * {
 *  "message": "Hi Bob, I'd like to add you as a contact.",
 *  "time": "2018-01-09T14:42:17Z"
 * }
 * ```
 */
export interface InviteMessage {
    message: string;
    time: Date;
}
export declare const $InviteMessage: DocumentType<InviteMessage>;
