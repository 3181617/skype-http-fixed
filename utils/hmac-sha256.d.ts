/// <reference types="node" />
/**
 * Creates an uint32 array by copying and shifting the uint8 of the argument by groups of four.
 * @param uint8Array Its length has to be a multiple of 4
 * @returns {Uint32Array}
 */
export declare function uint8ArrayToUint32Array(uint8Array: Uint8Array): Uint32Array;
/**
 * Returns a zero-padded (8 chars long) hex-string of the little-endian representation the argument.
 *
 * The relation between the characters of `.toString(16)` (big-endian) is:
 * .toString(16):                <76543210>
 * int32ToLittleEndianHexString: <10325476>
 *
 * Example:
 * .toString(16):                ed81c15a
 * int32ToLittleEndianHexString: 5ac181ed
 *
 * @param int32
 * @returns {string}
 */
export declare function int32ToLittleEndianHexString(int32: number): string;
/**
 * This computes the Hash-based message authentication code (HMAC) of the input buffer by using
 * SHA-256 and the checkSum64 function.
 * This is retrieved from the source of Skype's web application.
 *
 * See getMacHash in sha256Auth.js at skype-web-reversed for the original implementation
 * tslint:disable-next-line:max-line-length
 *
 * @param input
 * @param productId
 * @param productKey
 * @returns {string} An hexadecimal 32-chars long string
 */
export declare function hmacSha256(input: Buffer, productId: Buffer, productKey: Buffer): string;
