"use strict";
// tslint:disable:max-line-length
/**
 * This module handles MRI keys
 *
 * MRI may stand for MSN Resource Identifier (open an issue if you have a better idea).
 *
 * An MRI key is a string of the format: `${type}:${id}` where `id` can be a string of (at least)
 * ascii letters and digits (it cannot start by `\d+:`) and `type` is a decimal code.
 *
 * Examples:
 * - `1:bob`
 * - `4:+15553485`
 * - `8:bob`
 * - `8:guest:bob`
 * - `8:live:bob`
 *
 * @see https://github.com/demurgos/skype-web-reversed/tree/bb30da685fb7d2d06f1ba740283d6cbbaeb2c502/skype/latest/decompiled/fullExperience/rjs%24%24swx-mri/lib
 */
// tslint:enable
Object.defineProperty(exports, "__esModule", { value: true });
const incident_1 = require("incident");
var MriType;
(function (MriType) {
    MriType["Agent"] = "agent";
    MriType["Lync"] = "lync";
    MriType["Msn"] = "msn";
    MriType["Skype"] = "skype";
    /**
     * Public switched telephone network
     */
    MriType["Pstn"] = "pstn";
    /**
     * This is not the official name (but it is likely).
     * This MRI type was added to properly handle the type code `19`.
     */
    MriType["GroupConversation"] = "group_conversation";
})(MriType = exports.MriType || (exports.MriType = {}));
const MRI_TYPE_TO_TYPE_CODE = new Map([
    [MriType.Agent, "28"],
    [MriType.Lync, "2"],
    [MriType.Msn, "1"],
    [MriType.Skype, "8"],
    [MriType.Pstn, "4"],
    [MriType.GroupConversation, "19"],
]);
const MRI_TYPE_FROM_TYPE_CODE = reverseMap(MRI_TYPE_TO_TYPE_CODE);
const MRI_TYPE_TO_TYPE_NAME = new Map([
    [MriType.Agent, "agent"],
    [MriType.Lync, "lync"],
    [MriType.Msn, "msn"],
    [MriType.Skype, "skype"],
    [MriType.Pstn, "pstn"],
    [MriType.GroupConversation, "group_conversation"],
]);
const MRI_TYPE_FROM_TYPE_NAME = reverseMap(MRI_TYPE_TO_TYPE_NAME);
// TODO: Move outside of this module
function reverseMap(source) {
    const result = new Map();
    for (const [key, value] of source.entries()) {
        if (result.has(value)) {
            throw new incident_1.Incident("DuplicateValue", { map: source });
        }
        result.set(value, key);
    }
    return result;
}
/**
 * Converts an MRI type to the corresponding MRI type code.
 *
 * @param type The MRI type.
 * @return The corresponding MRI type code.
 * @internal
 */
function mriTypeToTypeCode(type) {
    const result = MRI_TYPE_TO_TYPE_CODE.get(type);
    if (result === undefined) {
        throw new incident_1.Incident("UnknownMriType", { type });
    }
    return result;
}
exports.mriTypeToTypeCode = mriTypeToTypeCode;
/**
 * Converts an MRI type code to the corresponding MRI type.
 *
 * @param typeCode The MRI type code.
 * @return The corresponding MRI type.
 * @internal
 */
function mriTypeFromTypeCode(typeCode) {
    const result = MRI_TYPE_FROM_TYPE_CODE.get(typeCode);
    if (result === undefined) {
        throw new incident_1.Incident("UnknownMriTypeCode", { typeCode });
    }
    return result;
}
exports.mriTypeFromTypeCode = mriTypeFromTypeCode;
/**
 * Converts an MRI type to the corresponding MRI type name.
 *
 * @param type The MRI type.
 * @return The corresponding MRI type name.
 * @internal
 */
function mriTypeToTypeName(type) {
    const result = MRI_TYPE_TO_TYPE_NAME.get(type);
    if (result === undefined) {
        throw new incident_1.Incident("UnknownMriType", { type });
    }
    return result;
}
exports.mriTypeToTypeName = mriTypeToTypeName;
/**
 * Converts an MRI type name to the corresponding MRI type.
 *
 * @param typeName The MRI type name.
 * @return The corresponding MRI type.
 * @internal
 */
function mriTypeFromTypeName(typeName) {
    const result = MRI_TYPE_FROM_TYPE_NAME.get(typeName);
    if (result === undefined) {
        throw new incident_1.Incident("UnknownMriTypeName", { typeName });
    }
    return result;
}
exports.mriTypeFromTypeName = mriTypeFromTypeName;
/**
 * Pattern matching MRI keys. It has two capture groups:
 * - Group 1: Type code
 * - Group 2: Id
 *
 * The universal matcher for the id part matches the behavior found in
 * skype-web-reversed (v1.107.13).
 * There is still a difference: we assume that there is a single type code prefix while
 * the retrieved regexp is `/^(?:(\d+):)+/`.
 * This means that they can parse `4:8:bob` to the type code `"8"` and id `"bob"`.
 * Instead of that, our pattern parses to the type code `"4"` and id `"8:bob"` (but then
 * the parse function throws an error because the `id` is invalid).
 */
const MRI_KEY_PATTERN = /^(\d+):([\s\S]+)$/;
function getId(mriKey) {
    return parse(mriKey).id;
}
exports.getId = getId;
function getType(mriKey) {
    return parse(mriKey).type;
}
exports.getType = getType;
/**
 * Tests if an id is Phone Switched Telephone Network (PSTN) identifier (a phone number).
 *
 * A PSTN id is a decimal number, optionally prefixed by a plus sign (`+`).
 *
 * @param id ID to test
 * @return Boolean indicating if `id` is a PSTN id
 */
function isPstnId(id) {
    return /^(?:\+)?\d+$/.test(id);
}
exports.isPstnId = isPstnId;
/**
 * Tests if an id is guest identifier.
 *
 * A guest id starts by `guest:`.
 *
 * @param id ID to test
 * @return Boolean indicating if `id` is a guest id
 */
function isGuestId(id) {
    return /^guest:/.test(id);
}
exports.isGuestId = isGuestId;
/**
 * Tests if a string is a well-formed MRI key.
 *
 * @param str The string to test
 * @return Boolean indicating if `str` is a well-formed MRI key
 */
function isMriKey(str) {
    return /^(?:(\d+):)+/.test(str);
}
exports.isMriKey = isMriKey;
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
function asMriKey(mriKeyOrId, type) {
    if (isMriKey(mriKeyOrId)) {
        return mriKeyOrId;
    }
    const id = mriKeyOrId;
    if (isPstnId(id)) {
        // TODO: We are enforcing the PSTN type. We should check the value of `type` and raise a
        //       warning if it is not Pstn.
        return format({ type: MriType.Pstn, id });
    }
    else {
        return format({ type, id });
    }
}
exports.asMriKey = asMriKey;
function isValidId(id) {
    return !MRI_KEY_PATTERN.test(id);
}
function format(mri) {
    if (!isValidId(mri.id)) {
        throw new incident_1.Incident("InvalidMriId", { id: mri.id });
    }
    return `${mriTypeToTypeCode(mri.type)}:${mri.id}`;
}
exports.format = format;
function parse(mri) {
    const match = MRI_KEY_PATTERN.exec(mri);
    if (match === null) {
        throw new incident_1.Incident("InvalidMriKey", { key: mri });
    }
    // We can cast here because `mriTypeFromTypeCode` tests the validity of the MRI code.
    const type = mriTypeFromTypeCode(match[1]);
    const id = match[2];
    if (isValidId(id)) {
        throw new incident_1.Incident("InvalidMriId", { id });
    }
    return { type, id };
}
exports.parse = parse;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Z0JBQXVCLEdBQWlCO0lBQ3RDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxJQUFJLG1CQUFRLENBQUMsY0FBYyxFQUFFLEVBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFDRCxNQUFNLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ3BELENBQUM7QUFMRCx3QkFLQztBQUVELGVBQXNCLEdBQVc7SUFDL0IsTUFBTSxLQUFLLEdBQTJCLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEUsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbkIsTUFBTSxJQUFJLG1CQUFRLENBQUMsZUFBZSxFQUFFLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNELHFGQUFxRjtJQUNyRixNQUFNLElBQUksR0FBWSxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFnQixDQUFDLENBQUM7SUFDbkUsTUFBTSxFQUFFLEdBQVcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsTUFBTSxJQUFJLG1CQUFRLENBQUMsY0FBYyxFQUFFLEVBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFDO0FBQ3BCLENBQUM7QUFaRCxzQkFZQyIsImZpbGUiOiJtcmkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGhcbi8qKlxuICogVGhpcyBtb2R1bGUgaGFuZGxlcyBNUkkga2V5c1xuICpcbiAqIE1SSSBtYXkgc3RhbmQgZm9yIE1TTiBSZXNvdXJjZSBJZGVudGlmaWVyIChvcGVuIGFuIGlzc3VlIGlmIHlvdSBoYXZlIGEgYmV0dGVyIGlkZWEpLlxuICpcbiAqIEFuIE1SSSBrZXkgaXMgYSBzdHJpbmcgb2YgdGhlIGZvcm1hdDogYCR7dHlwZX06JHtpZH1gIHdoZXJlIGBpZGAgY2FuIGJlIGEgc3RyaW5nIG9mIChhdCBsZWFzdClcbiAqIGFzY2lpIGxldHRlcnMgYW5kIGRpZ2l0cyAoaXQgY2Fubm90IHN0YXJ0IGJ5IGBcXGQrOmApIGFuZCBgdHlwZWAgaXMgYSBkZWNpbWFsIGNvZGUuXG4gKlxuICogRXhhbXBsZXM6XG4gKiAtIGAxOmJvYmBcbiAqIC0gYDQ6KzE1NTUzNDg1YFxuICogLSBgODpib2JgXG4gKiAtIGA4Omd1ZXN0OmJvYmBcbiAqIC0gYDg6bGl2ZTpib2JgXG4gKlxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vZGVtdXJnb3Mvc2t5cGUtd2ViLXJldmVyc2VkL3RyZWUvYmIzMGRhNjg1ZmI3ZDJkMDZmMWJhNzQwMjgzZDZjYmJhZWIyYzUwMi9za3lwZS9sYXRlc3QvZGVjb21waWxlZC9mdWxsRXhwZXJpZW5jZS9yanMlMjQlMjRzd3gtbXJpL2xpYlxuICovXG4vLyB0c2xpbnQ6ZW5hYmxlXG5cbmltcG9ydCB7IEluY2lkZW50IH0gZnJvbSBcImluY2lkZW50XCI7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHdlbGwtZm9ybWVkIE1SSSBrZXkuXG4gKi9cbmV4cG9ydCB0eXBlIE1yaUtleSA9IHN0cmluZztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcGFyc2VkIE1SSSBrZXlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQYXJzZWRNcmlLZXkge1xuICAvKipcbiAgICogTVJJIHR5cGUuXG4gICAqL1xuICB0eXBlOiBNcmlUeXBlO1xuXG4gIC8qKlxuICAgKiBNUkkgaWQsIGNhbm5vdCBiZWdpbiBieSBgXFxkKzpgLlxuICAgKi9cbiAgaWQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGVudW0gTXJpVHlwZSB7XG4gIEFnZW50ID0gXCJhZ2VudFwiLFxuICBMeW5jID0gXCJseW5jXCIsXG4gIE1zbiA9IFwibXNuXCIsXG4gIFNreXBlID0gXCJza3lwZVwiLFxuICAvKipcbiAgICogUHVibGljIHN3aXRjaGVkIHRlbGVwaG9uZSBuZXR3b3JrXG4gICAqL1xuICBQc3RuID0gXCJwc3RuXCIsXG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgbm90IHRoZSBvZmZpY2lhbCBuYW1lIChidXQgaXQgaXMgbGlrZWx5KS5cbiAgICogVGhpcyBNUkkgdHlwZSB3YXMgYWRkZWQgdG8gcHJvcGVybHkgaGFuZGxlIHRoZSB0eXBlIGNvZGUgYDE5YC5cbiAgICovXG4gIEdyb3VwQ29udmVyc2F0aW9uID0gXCJncm91cF9jb252ZXJzYXRpb25cIixcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgdmFsaWQgTVJJIHR5cGUgY29kZS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IHR5cGUgTXJpVHlwZUNvZGUgPSBcIjFcIiB8IFwiMlwiIHwgXCI0XCIgfCBcIjhcIiB8IFwiMTlcIiB8IFwiMjhcIjtcblxuY29uc3QgTVJJX1RZUEVfVE9fVFlQRV9DT0RFOiBNYXA8TXJpVHlwZSwgTXJpVHlwZUNvZGU+ID0gbmV3IE1hcDxNcmlUeXBlLCBNcmlUeXBlQ29kZT4oW1xuICBbTXJpVHlwZS5BZ2VudCwgXCIyOFwiXSxcbiAgW01yaVR5cGUuTHluYywgXCIyXCJdLFxuICBbTXJpVHlwZS5Nc24sIFwiMVwiXSxcbiAgW01yaVR5cGUuU2t5cGUsIFwiOFwiXSxcbiAgW01yaVR5cGUuUHN0biwgXCI0XCJdLFxuICBbTXJpVHlwZS5Hcm91cENvbnZlcnNhdGlvbiwgXCIxOVwiXSxcbl0pO1xuXG5jb25zdCBNUklfVFlQRV9GUk9NX1RZUEVfQ09ERTogTWFwPE1yaVR5cGVDb2RlLCBNcmlUeXBlPiA9IHJldmVyc2VNYXAoTVJJX1RZUEVfVE9fVFlQRV9DT0RFKTtcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgdmFsaWQgTVJJIHR5cGUgbmFtZS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IHR5cGUgTXJpVHlwZU5hbWUgPSBcImFnZW50XCIgfCBcImx5bmNcIiB8IFwibXNuXCIgfCBcInNreXBlXCIgfCBcInBzdG5cIiB8IFwiZ3JvdXBfY29udmVyc2F0aW9uXCI7XG5cbmNvbnN0IE1SSV9UWVBFX1RPX1RZUEVfTkFNRTogTWFwPE1yaVR5cGUsIE1yaVR5cGVOYW1lPiA9IG5ldyBNYXA8TXJpVHlwZSwgTXJpVHlwZU5hbWU+KFtcbiAgW01yaVR5cGUuQWdlbnQsIFwiYWdlbnRcIl0sXG4gIFtNcmlUeXBlLkx5bmMsIFwibHluY1wiXSxcbiAgW01yaVR5cGUuTXNuLCBcIm1zblwiXSxcbiAgW01yaVR5cGUuU2t5cGUsIFwic2t5cGVcIl0sXG4gIFtNcmlUeXBlLlBzdG4sIFwicHN0blwiXSxcbiAgW01yaVR5cGUuR3JvdXBDb252ZXJzYXRpb24sIFwiZ3JvdXBfY29udmVyc2F0aW9uXCJdLFxuXSk7XG5cbmNvbnN0IE1SSV9UWVBFX0ZST01fVFlQRV9OQU1FOiBNYXA8TXJpVHlwZU5hbWUsIE1yaVR5cGU+ID0gcmV2ZXJzZU1hcChNUklfVFlQRV9UT19UWVBFX05BTUUpO1xuXG4vLyBUT0RPOiBNb3ZlIG91dHNpZGUgb2YgdGhpcyBtb2R1bGVcbmZ1bmN0aW9uIHJldmVyc2VNYXA8SywgVj4oc291cmNlOiBNYXA8SywgVj4pOiBNYXA8ViwgSz4ge1xuICBjb25zdCByZXN1bHQ6IE1hcDxWLCBLPiA9IG5ldyBNYXAoKTtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2Ygc291cmNlLmVudHJpZXMoKSkge1xuICAgIGlmIChyZXN1bHQuaGFzKHZhbHVlKSkge1xuICAgICAgdGhyb3cgbmV3IEluY2lkZW50KFwiRHVwbGljYXRlVmFsdWVcIiwge21hcDogc291cmNlfSk7XG4gICAgfVxuICAgIHJlc3VsdC5zZXQodmFsdWUsIGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhbiBNUkkgdHlwZSB0byB0aGUgY29ycmVzcG9uZGluZyBNUkkgdHlwZSBjb2RlLlxuICpcbiAqIEBwYXJhbSB0eXBlIFRoZSBNUkkgdHlwZS5cbiAqIEByZXR1cm4gVGhlIGNvcnJlc3BvbmRpbmcgTVJJIHR5cGUgY29kZS5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gbXJpVHlwZVRvVHlwZUNvZGUodHlwZTogTXJpVHlwZSk6IE1yaVR5cGVDb2RlIHtcbiAgY29uc3QgcmVzdWx0OiBNcmlUeXBlQ29kZSB8IHVuZGVmaW5lZCA9IE1SSV9UWVBFX1RPX1RZUEVfQ09ERS5nZXQodHlwZSk7XG4gIGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBJbmNpZGVudChcIlVua25vd25NcmlUeXBlXCIsIHt0eXBlfSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhbiBNUkkgdHlwZSBjb2RlIHRvIHRoZSBjb3JyZXNwb25kaW5nIE1SSSB0eXBlLlxuICpcbiAqIEBwYXJhbSB0eXBlQ29kZSBUaGUgTVJJIHR5cGUgY29kZS5cbiAqIEByZXR1cm4gVGhlIGNvcnJlc3BvbmRpbmcgTVJJIHR5cGUuXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1yaVR5cGVGcm9tVHlwZUNvZGUodHlwZUNvZGU6IE1yaVR5cGVDb2RlKTogTXJpVHlwZSB7XG4gIGNvbnN0IHJlc3VsdDogTXJpVHlwZSB8IHVuZGVmaW5lZCA9IE1SSV9UWVBFX0ZST01fVFlQRV9DT0RFLmdldCh0eXBlQ29kZSk7XG4gIGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBJbmNpZGVudChcIlVua25vd25NcmlUeXBlQ29kZVwiLCB7dHlwZUNvZGV9KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGFuIE1SSSB0eXBlIHRvIHRoZSBjb3JyZXNwb25kaW5nIE1SSSB0eXBlIG5hbWUuXG4gKlxuICogQHBhcmFtIHR5cGUgVGhlIE1SSSB0eXBlLlxuICogQHJldHVybiBUaGUgY29ycmVzcG9uZGluZyBNUkkgdHlwZSBuYW1lLlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtcmlUeXBlVG9UeXBlTmFtZSh0eXBlOiBNcmlUeXBlKTogTXJpVHlwZU5hbWUge1xuICBjb25zdCByZXN1bHQ6IE1yaVR5cGVOYW1lIHwgdW5kZWZpbmVkID0gTVJJX1RZUEVfVE9fVFlQRV9OQU1FLmdldCh0eXBlKTtcbiAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEluY2lkZW50KFwiVW5rbm93bk1yaVR5cGVcIiwge3R5cGV9KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGFuIE1SSSB0eXBlIG5hbWUgdG8gdGhlIGNvcnJlc3BvbmRpbmcgTVJJIHR5cGUuXG4gKlxuICogQHBhcmFtIHR5cGVOYW1lIFRoZSBNUkkgdHlwZSBuYW1lLlxuICogQHJldHVybiBUaGUgY29ycmVzcG9uZGluZyBNUkkgdHlwZS5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gbXJpVHlwZUZyb21UeXBlTmFtZSh0eXBlTmFtZTogTXJpVHlwZU5hbWUpOiBNcmlUeXBlIHtcbiAgY29uc3QgcmVzdWx0OiBNcmlUeXBlIHwgdW5kZWZpbmVkID0gTVJJX1RZUEVfRlJPTV9UWVBFX05BTUUuZ2V0KHR5cGVOYW1lKTtcbiAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEluY2lkZW50KFwiVW5rbm93bk1yaVR5cGVOYW1lXCIsIHt0eXBlTmFtZX0pO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogUGF0dGVybiBtYXRjaGluZyBNUkkga2V5cy4gSXQgaGFzIHR3byBjYXB0dXJlIGdyb3VwczpcbiAqIC0gR3JvdXAgMTogVHlwZSBjb2RlXG4gKiAtIEdyb3VwIDI6IElkXG4gKlxuICogVGhlIHVuaXZlcnNhbCBtYXRjaGVyIGZvciB0aGUgaWQgcGFydCBtYXRjaGVzIHRoZSBiZWhhdmlvciBmb3VuZCBpblxuICogc2t5cGUtd2ViLXJldmVyc2VkICh2MS4xMDcuMTMpLlxuICogVGhlcmUgaXMgc3RpbGwgYSBkaWZmZXJlbmNlOiB3ZSBhc3N1bWUgdGhhdCB0aGVyZSBpcyBhIHNpbmdsZSB0eXBlIGNvZGUgcHJlZml4IHdoaWxlXG4gKiB0aGUgcmV0cmlldmVkIHJlZ2V4cCBpcyBgL14oPzooXFxkKyk6KSsvYC5cbiAqIFRoaXMgbWVhbnMgdGhhdCB0aGV5IGNhbiBwYXJzZSBgNDo4OmJvYmAgdG8gdGhlIHR5cGUgY29kZSBgXCI4XCJgIGFuZCBpZCBgXCJib2JcImAuXG4gKiBJbnN0ZWFkIG9mIHRoYXQsIG91ciBwYXR0ZXJuIHBhcnNlcyB0byB0aGUgdHlwZSBjb2RlIGBcIjRcImAgYW5kIGlkIGBcIjg6Ym9iXCJgIChidXQgdGhlblxuICogdGhlIHBhcnNlIGZ1bmN0aW9uIHRocm93cyBhbiBlcnJvciBiZWNhdXNlIHRoZSBgaWRgIGlzIGludmFsaWQpLlxuICovXG5jb25zdCBNUklfS0VZX1BBVFRFUk46IFJlZ0V4cCA9IC9eKFxcZCspOihbXFxzXFxTXSspJC87XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJZChtcmlLZXk6IE1yaUtleSk6IHN0cmluZyB7XG4gIHJldHVybiBwYXJzZShtcmlLZXkpLmlkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHlwZShtcmlLZXk6IE1yaUtleSk6IE1yaVR5cGUge1xuICByZXR1cm4gcGFyc2UobXJpS2V5KS50eXBlO1xufVxuXG4vKipcbiAqIFRlc3RzIGlmIGFuIGlkIGlzIFBob25lIFN3aXRjaGVkIFRlbGVwaG9uZSBOZXR3b3JrIChQU1ROKSBpZGVudGlmaWVyIChhIHBob25lIG51bWJlcikuXG4gKlxuICogQSBQU1ROIGlkIGlzIGEgZGVjaW1hbCBudW1iZXIsIG9wdGlvbmFsbHkgcHJlZml4ZWQgYnkgYSBwbHVzIHNpZ24gKGArYCkuXG4gKlxuICogQHBhcmFtIGlkIElEIHRvIHRlc3RcbiAqIEByZXR1cm4gQm9vbGVhbiBpbmRpY2F0aW5nIGlmIGBpZGAgaXMgYSBQU1ROIGlkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1BzdG5JZChpZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAvXig/OlxcKyk/XFxkKyQvLnRlc3QoaWQpO1xufVxuXG4vKipcbiAqIFRlc3RzIGlmIGFuIGlkIGlzIGd1ZXN0IGlkZW50aWZpZXIuXG4gKlxuICogQSBndWVzdCBpZCBzdGFydHMgYnkgYGd1ZXN0OmAuXG4gKlxuICogQHBhcmFtIGlkIElEIHRvIHRlc3RcbiAqIEByZXR1cm4gQm9vbGVhbiBpbmRpY2F0aW5nIGlmIGBpZGAgaXMgYSBndWVzdCBpZFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNHdWVzdElkKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIC9eZ3Vlc3Q6Ly50ZXN0KGlkKTtcbn1cblxuLyoqXG4gKiBUZXN0cyBpZiBhIHN0cmluZyBpcyBhIHdlbGwtZm9ybWVkIE1SSSBrZXkuXG4gKlxuICogQHBhcmFtIHN0ciBUaGUgc3RyaW5nIHRvIHRlc3RcbiAqIEByZXR1cm4gQm9vbGVhbiBpbmRpY2F0aW5nIGlmIGBzdHJgIGlzIGEgd2VsbC1mb3JtZWQgTVJJIGtleVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNNcmlLZXkoc3RyOiBzdHJpbmcpOiBzdHIgaXMgTXJpS2V5IHtcbiAgcmV0dXJuIC9eKD86KFxcZCspOikrLy50ZXN0KHN0cik7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBNUkkga2V5IGlmIG5lZWRlZFxuICpcbiAqIElmIGBtcmlLZXlPcklkYCBpcyBhbHJlYWR5IGFuIE1SSSBrZXksIHJldHVybnMgaXQgaW1tZWRpYXRlbHkuXG4gKiBPdGhlcndpc2UsIGNyZWF0ZXMgYW4gTVJJIGtleSB3aXRoIHRoZSB0eXBlIGB0eXBlYCBhbmQgaWQgYG1yaUtleU9ySWRgLlxuICpcbiAqIEBwYXJhbSB7TXJpS2V5IHwgc3RyaW5nfSBtcmlLZXlPcklkXG4gKiBAcGFyYW0ge01yaVR5cGV9IHR5cGVcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzTXJpS2V5KG1yaUtleU9ySWQ6IE1yaUtleSB8IHN0cmluZywgdHlwZTogTXJpVHlwZSk6IE1yaUtleSB7XG4gIGlmIChpc01yaUtleShtcmlLZXlPcklkKSkge1xuICAgIHJldHVybiBtcmlLZXlPcklkO1xuICB9XG4gIGNvbnN0IGlkOiBzdHJpbmcgPSBtcmlLZXlPcklkO1xuICBpZiAoaXNQc3RuSWQoaWQpKSB7XG4gICAgLy8gVE9ETzogV2UgYXJlIGVuZm9yY2luZyB0aGUgUFNUTiB0eXBlLiBXZSBzaG91bGQgY2hlY2sgdGhlIHZhbHVlIG9mIGB0eXBlYCBhbmQgcmFpc2UgYVxuICAgIC8vICAgICAgIHdhcm5pbmcgaWYgaXQgaXMgbm90IFBzdG4uXG4gICAgcmV0dXJuIGZvcm1hdCh7dHlwZTogTXJpVHlwZS5Qc3RuLCBpZH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmb3JtYXQoe3R5cGUsIGlkfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNWYWxpZElkKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuICFNUklfS0VZX1BBVFRFUk4udGVzdChpZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXQobXJpOiBQYXJzZWRNcmlLZXkpOiBNcmlLZXkge1xuICBpZiAoIWlzVmFsaWRJZChtcmkuaWQpKSB7XG4gICAgdGhyb3cgbmV3IEluY2lkZW50KFwiSW52YWxpZE1yaUlkXCIsIHtpZDogbXJpLmlkfSk7XG4gIH1cbiAgcmV0dXJuIGAke21yaVR5cGVUb1R5cGVDb2RlKG1yaS50eXBlKX06JHttcmkuaWR9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKG1yaTogTXJpS2V5KTogUGFyc2VkTXJpS2V5IHtcbiAgY29uc3QgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGwgPSBNUklfS0VZX1BBVFRFUk4uZXhlYyhtcmkpO1xuICBpZiAobWF0Y2ggPT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgSW5jaWRlbnQoXCJJbnZhbGlkTXJpS2V5XCIsIHtrZXk6IG1yaX0pO1xuICB9XG4gIC8vIFdlIGNhbiBjYXN0IGhlcmUgYmVjYXVzZSBgbXJpVHlwZUZyb21UeXBlQ29kZWAgdGVzdHMgdGhlIHZhbGlkaXR5IG9mIHRoZSBNUkkgY29kZS5cbiAgY29uc3QgdHlwZTogTXJpVHlwZSA9IG1yaVR5cGVGcm9tVHlwZUNvZGUobWF0Y2hbMV0gYXMgTXJpVHlwZUNvZGUpO1xuICBjb25zdCBpZDogc3RyaW5nID0gbWF0Y2hbMl07XG4gIGlmIChpc1ZhbGlkSWQoaWQpKSB7XG4gICAgdGhyb3cgbmV3IEluY2lkZW50KFwiSW52YWxpZE1yaUlkXCIsIHtpZH0pO1xuICB9XG4gIHJldHVybiB7dHlwZSwgaWR9O1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
