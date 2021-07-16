import { DocumentType } from "kryo/types/document";
export interface Phone {
    /**
     * `"mobile"`
     */
    type?: string;
    /**
     * Example: `+15553485`
     */
    number: string;
}
export declare const $Phone: DocumentType<Phone>;
