/**
 * Represents a well-formed MRI key.
 */
export declare type MriKey = string;
/**
 * Represents a parsed MRI key
 */
export interface ParsedMriKey {
    /**
     * MRI type.
     */
    type: MriType;
    /**
     * MRI id, cannot begin by `\d+:`.
     */
    id: string;
}
export declare enum MriType {
    Agent = "agent",
    Lync = "lync",
    Msn = "msn",
    Skype = "skype",
    /**
     * Public switched telephone network
     */
    Pstn = "pstn",
    /**
     * This is not the official name (but it is likely).
     * This MRI type was added to properly handle the type code `19`.
     */
    GroupConversation = "group_conversation",
}
/**
 * Represents a valid MRI type code.
 *
 * @internal
 */
export declare type MriTypeCode = "1" | "2" | "4" | "8" | "19" | "28";
/**
 * Represents a valid MRI type name.
 *
 * @internal
 */
export declare type MriTypeName = "agent" | "lync" | "msn" | "skype" | "pstn" | "group_conversation";
/**
 * Converts an MRI type to the corresponding MRI type code.
 *
 * @param type The MRI type.
 * @return The corresponding MRI type code.
 * @internal
 */
export declare function mriTypeToTypeCode(type: MriType): MriTypeCode;
/**
 * Converts an MRI type code to the corresponding MRI type.
 *
 * @param typeCode The MRI type code.
 * @return The corresponding MRI type.
 * @internal
 */
export declare function mriTypeFromTypeCode(typeCode: MriTypeCode): MriType;
/**
 * Converts an MRI type to the corresponding MRI type name.
 *
 * @param type The MRI type.
 * @return The corresponding MRI type name.
 * @internal
 */
export declare function mriTypeToTypeName(type: MriType): MriTypeName;
/**
 * Converts an MRI type name to the corresponding MRI type.
 *
 * @param typeName The MRI type name.
 * @return The corresponding MRI type.
 * @internal
 */
export declare function mriTypeFromTypeName(typeName: MriTypeName): MriType;
export declare function getId(mriKey: MriKey): string;
export declare function getType(mriKey: MriKey): MriType;
/**
 * Tests if an id is Phone Switched Telephone Network (PSTN) identifier (a phone number).
 *
 * A PSTN id is a decimal number, optionally prefixed by a plus sign (`+`).
 *
 * @param id ID to test
 * @return Boolean indicating if `id` is a PSTN id
 */
export declare function isPstnId(id: string): boolean;
/**
 * Tests if an id is guest identifier.
 *
 * A guest id starts by `guest:`.
 *
 * @param id ID to test
 * @return Boolean indicating if `id` is a guest id
 */
export declare function isGuestId(id: string): boolean;
/**
 * Tests if a string is a well-formed MRI key.
 *
 * @param str The string to test
 * @return Boolean indicating if `str` is a well-formed MRI key
 */
export declare function isMriKey(str: string): str is MriKey;
/**
 * Creates an MRI key if needed
 *
 * If `mriKeyOrId` is already an MRI key, returns it immediately.
 * Otherwise, creates an MRI key with the type `type` and id `mriKeyOrId`.
 *
 * @param {MriKey | string} mriKeyOrId
 * @param {MriType} type
 * @return {string}
 */
export declare function asMriKey(mriKeyOrId: MriKey | string, type: MriType): MriKey;
export declare function format(mri: ParsedMriKey): MriKey;
export declare function parse(mri: MriKey): ParsedMriKey;
