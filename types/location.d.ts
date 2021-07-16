import { DocumentType } from "kryo/types/document";
export interface Location {
    /**
     * `"home" | "work" | ...`
     */
    type: string;
    /**
     * `"BE" | "FR" | "fr" | "gb" |...`
     */
    country?: string;
    city?: string;
    state?: string;
}
export declare const $Location: DocumentType<Location>;
