"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const big_integer_1 = __importDefault(require("big-integer"));
const js_sha256_1 = __importDefault(require("js-sha256"));
const HEX_CHARS = "0123456789abcdef";
const MAX_INT32 = 0x7fffffff; // Math.pow(2, 31) - 1 (the leading sign bit is 0);
/**
 * Creates an uint32 array by copying and shifting the uint8 of the argument by groups of four.
 * @param uint8Array Its length has to be a multiple of 4
 * @returns {Uint32Array}
 */
function uint8ArrayToUint32Array(uint8Array) {
    const len = uint8Array.length;
    if (len % 4 !== 0) {
        throw new Error("uint8Array.length must be a multiple of 4");
    }
    const uint32Array = new Uint32Array(len / 4);
    for (let i = 0, j = 0; i < len; i += 4, j++) {
        uint32Array[j] += uint8Array[i] * (1 << 0);
        uint32Array[j] += uint8Array[i + 1] * (1 << 8);
        uint32Array[j] += uint8Array[i + 2] * (1 << 16);
        uint32Array[j] += uint8Array[i + 3] * (1 << 24);
    }
    return uint32Array;
}
exports.uint8ArrayToUint32Array = uint8ArrayToUint32Array;
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
function int32ToLittleEndianHexString(int32) {
    let result = "";
    for (let i = 0; i < 4; i++) {
        result = result + HEX_CHARS.charAt((int32 >> i * 8 + 4) & 15);
        result = result + HEX_CHARS.charAt((int32 >> i * 8) & 15);
    }
    return result;
}
exports.int32ToLittleEndianHexString = int32ToLittleEndianHexString;
// tslint:disable-next-line:max-line-length
// https://github.com/Demurgos/skype-web-reversed/blob/fe3931c4f091af06f6b2c2e8c14608aebf87448b/skype/latest/decompiled/fullExperience/rjs%24%24msr-crypto/lib/sha256Auth.js#L62
/**
 * Returns 64 bits (an Uint32 array of length 2) computed from the challengeParts and hashParts.
 * This is retrieved from the source of Skype's web application.
 *
 * See _cS64_C in sha256Auth.js at skype-web-reversed for the original implementation:
 *
 * @param challengeParts
 * @param hashParts An Uint32Array of length 4
 * @returns {null}
 */
function checkSum64(challengeParts, hashParts) {
    if (challengeParts.length < 2 || challengeParts.length % 2 !== 0) {
        throw new Error("Invalid parameters");
    }
    const MAGIC = 0x0e79a9c1; // A magic constant
    const HASH_0 = hashParts[0] & MAX_INT32; // Remove the sign bit
    const HASH_1 = hashParts[1] & MAX_INT32;
    const HASH_2 = hashParts[2] & MAX_INT32;
    const HASH_3 = hashParts[3] & MAX_INT32;
    let low = big_integer_1.default.zero; // 0-31 bits of the result
    let high = big_integer_1.default.zero; // 32-63 bits of the result
    let temp;
    const len = challengeParts.length;
    for (let i = 0; i < len; i += 2) {
        temp = big_integer_1.default(challengeParts[i]).multiply(MAGIC).mod(MAX_INT32);
        low = low.add(temp).multiply(HASH_0).add(HASH_1).mod(MAX_INT32);
        high = high.add(low);
        temp = big_integer_1.default(challengeParts[i + 1]);
        low = low.add(temp).multiply(HASH_2).add(HASH_3).mod(MAX_INT32);
        high = high.add(low);
    }
    low = low.add(HASH_1).mod(MAX_INT32);
    high = high.add(HASH_3).mod(MAX_INT32);
    return new Uint32Array([low.toJSNumber(), high.toJSNumber()]);
}
// tslint:disable-next-line:max-line-length
// https://github.com/Demurgos/skype-web-reversed/blob/fe3931c4f091af06f6b2c2e8c14608aebf87448b/skype/latest/decompiled/fullExperience/rjs$$msr-crypto/lib/sha256Auth.js#L48
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
function hmacSha256(input, productId, productKey) {
    let message = Buffer.concat([input, productId]);
    // adjust length to be a multiple of 8 with right-padding of character '0'
    if (message.length % 8 !== 0) {
        const fix = 8 - (message.length % 8);
        const padding = Buffer.alloc(fix, "0", "utf8");
        padding.fill("0");
        message = Buffer.concat([message, padding]);
    }
    const challengeParts = uint8ArrayToUint32Array(message);
    const sha256HexString = js_sha256_1.default.sha256(Buffer.concat([input, productKey]));
    const sha256Buffer = Buffer.from(sha256HexString, "hex");
    // Get half of the sha256 as 4 uint32
    const sha256Parts = uint8ArrayToUint32Array(sha256Buffer.slice(0, 16));
    const checkSumParts = checkSum64(challengeParts, sha256Parts);
    sha256Parts[0] ^= checkSumParts[0];
    sha256Parts[1] ^= checkSumParts[1];
    sha256Parts[2] ^= checkSumParts[0];
    sha256Parts[3] ^= checkSumParts[1];
    return int32ToLittleEndianHexString(sha256Parts[0])
        + int32ToLittleEndianHexString(sha256Parts[1])
        + int32ToLittleEndianHexString(sha256Parts[2])
        + int32ToLittleEndianHexString(sha256Parts[3]);
}
exports.hmacSha256 = hmacSha256;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEYsTUFBTSxZQUFZLEdBQVcsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFakUscUNBQXFDO0lBQ3JDLE1BQU0sV0FBVyxHQUFnQix1QkFBdUIsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXBGLE1BQU0sYUFBYSxHQUFnQixVQUFVLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBRTNFLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25DLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbkMsTUFBTSxDQUFDLDRCQUE0QixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUMvQyw0QkFBNEIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7VUFDNUMsNEJBQTRCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1VBQzVDLDRCQUE0QixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUE3QkQsZ0NBNkJDIiwiZmlsZSI6InV0aWxzL2htYWMtc2hhMjU2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJpZ0ludCBmcm9tIFwiYmlnLWludGVnZXJcIjtcbmltcG9ydCBzaGEyNTYgZnJvbSBcImpzLXNoYTI1NlwiO1xuXG5jb25zdCBIRVhfQ0hBUlM6IHN0cmluZyA9IFwiMDEyMzQ1Njc4OWFiY2RlZlwiO1xuY29uc3QgTUFYX0lOVDMyOiBudW1iZXIgPSAweDdmZmZmZmZmOyAvLyBNYXRoLnBvdygyLCAzMSkgLSAxICh0aGUgbGVhZGluZyBzaWduIGJpdCBpcyAwKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIHVpbnQzMiBhcnJheSBieSBjb3B5aW5nIGFuZCBzaGlmdGluZyB0aGUgdWludDggb2YgdGhlIGFyZ3VtZW50IGJ5IGdyb3VwcyBvZiBmb3VyLlxuICogQHBhcmFtIHVpbnQ4QXJyYXkgSXRzIGxlbmd0aCBoYXMgdG8gYmUgYSBtdWx0aXBsZSBvZiA0XG4gKiBAcmV0dXJucyB7VWludDMyQXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1aW50OEFycmF5VG9VaW50MzJBcnJheSh1aW50OEFycmF5OiBVaW50OEFycmF5KTogVWludDMyQXJyYXkge1xuICBjb25zdCBsZW46IG51bWJlciA9IHVpbnQ4QXJyYXkubGVuZ3RoO1xuICBpZiAobGVuICUgNCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInVpbnQ4QXJyYXkubGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0XCIpO1xuICB9XG4gIGNvbnN0IHVpbnQzMkFycmF5OiBVaW50MzJBcnJheSA9IG5ldyBVaW50MzJBcnJheShsZW4gLyA0KTtcbiAgZm9yIChsZXQgaTogbnVtYmVyID0gMCwgajogbnVtYmVyID0gMDsgaSA8IGxlbjsgaSArPSA0LCBqKyspIHtcbiAgICB1aW50MzJBcnJheVtqXSArPSB1aW50OEFycmF5W2ldICogKDEgPDwgMCk7XG4gICAgdWludDMyQXJyYXlbal0gKz0gdWludDhBcnJheVtpICsgMV0gKiAoMSA8PCA4KTtcbiAgICB1aW50MzJBcnJheVtqXSArPSB1aW50OEFycmF5W2kgKyAyXSAqICgxIDw8IDE2KTtcbiAgICB1aW50MzJBcnJheVtqXSArPSB1aW50OEFycmF5W2kgKyAzXSAqICgxIDw8IDI0KTtcbiAgfVxuICByZXR1cm4gdWludDMyQXJyYXk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHplcm8tcGFkZGVkICg4IGNoYXJzIGxvbmcpIGhleC1zdHJpbmcgb2YgdGhlIGxpdHRsZS1lbmRpYW4gcmVwcmVzZW50YXRpb24gdGhlIGFyZ3VtZW50LlxuICpcbiAqIFRoZSByZWxhdGlvbiBiZXR3ZWVuIHRoZSBjaGFyYWN0ZXJzIG9mIGAudG9TdHJpbmcoMTYpYCAoYmlnLWVuZGlhbikgaXM6XG4gKiAudG9TdHJpbmcoMTYpOiAgICAgICAgICAgICAgICA8NzY1NDMyMTA+XG4gKiBpbnQzMlRvTGl0dGxlRW5kaWFuSGV4U3RyaW5nOiA8MTAzMjU0NzY+XG4gKlxuICogRXhhbXBsZTpcbiAqIC50b1N0cmluZygxNik6ICAgICAgICAgICAgICAgIGVkODFjMTVhXG4gKiBpbnQzMlRvTGl0dGxlRW5kaWFuSGV4U3RyaW5nOiA1YWMxODFlZFxuICpcbiAqIEBwYXJhbSBpbnQzMlxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludDMyVG9MaXR0bGVFbmRpYW5IZXhTdHJpbmcoaW50MzI6IG51bWJlcik6IHN0cmluZyB7XG4gIGxldCByZXN1bHQ6IHN0cmluZyA9IFwiXCI7XG4gIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICByZXN1bHQgPSByZXN1bHQgKyBIRVhfQ0hBUlMuY2hhckF0KChpbnQzMiA+PiBpICogOCArIDQpICYgMTUpO1xuICAgIHJlc3VsdCA9IHJlc3VsdCArIEhFWF9DSEFSUy5jaGFyQXQoKGludDMyID4+IGkgKiA4KSAmIDE1KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4vLyBodHRwczovL2dpdGh1Yi5jb20vRGVtdXJnb3Mvc2t5cGUtd2ViLXJldmVyc2VkL2Jsb2IvZmUzOTMxYzRmMDkxYWYwNmY2YjJjMmU4YzE0NjA4YWViZjg3NDQ4Yi9za3lwZS9sYXRlc3QvZGVjb21waWxlZC9mdWxsRXhwZXJpZW5jZS9yanMlMjQlMjRtc3ItY3J5cHRvL2xpYi9zaGEyNTZBdXRoLmpzI0w2MlxuLyoqXG4gKiBSZXR1cm5zIDY0IGJpdHMgKGFuIFVpbnQzMiBhcnJheSBvZiBsZW5ndGggMikgY29tcHV0ZWQgZnJvbSB0aGUgY2hhbGxlbmdlUGFydHMgYW5kIGhhc2hQYXJ0cy5cbiAqIFRoaXMgaXMgcmV0cmlldmVkIGZyb20gdGhlIHNvdXJjZSBvZiBTa3lwZSdzIHdlYiBhcHBsaWNhdGlvbi5cbiAqXG4gKiBTZWUgX2NTNjRfQyBpbiBzaGEyNTZBdXRoLmpzIGF0IHNreXBlLXdlYi1yZXZlcnNlZCBmb3IgdGhlIG9yaWdpbmFsIGltcGxlbWVudGF0aW9uOlxuICpcbiAqIEBwYXJhbSBjaGFsbGVuZ2VQYXJ0c1xuICogQHBhcmFtIGhhc2hQYXJ0cyBBbiBVaW50MzJBcnJheSBvZiBsZW5ndGggNFxuICogQHJldHVybnMge251bGx9XG4gKi9cbmZ1bmN0aW9uIGNoZWNrU3VtNjQoY2hhbGxlbmdlUGFydHM6IFVpbnQzMkFycmF5LCBoYXNoUGFydHM6IFVpbnQzMkFycmF5KTogVWludDMyQXJyYXkge1xuICBpZiAoY2hhbGxlbmdlUGFydHMubGVuZ3RoIDwgMiB8fCBjaGFsbGVuZ2VQYXJ0cy5sZW5ndGggJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwYXJhbWV0ZXJzXCIpO1xuICB9XG4gIGNvbnN0IE1BR0lDOiBudW1iZXIgPSAweDBlNzlhOWMxOyAvLyBBIG1hZ2ljIGNvbnN0YW50XG4gIGNvbnN0IEhBU0hfMDogbnVtYmVyID0gaGFzaFBhcnRzWzBdICYgTUFYX0lOVDMyOyAvLyBSZW1vdmUgdGhlIHNpZ24gYml0XG4gIGNvbnN0IEhBU0hfMTogbnVtYmVyID0gaGFzaFBhcnRzWzFdICYgTUFYX0lOVDMyO1xuICBjb25zdCBIQVNIXzI6IG51bWJlciA9IGhhc2hQYXJ0c1syXSAmIE1BWF9JTlQzMjtcbiAgY29uc3QgSEFTSF8zOiBudW1iZXIgPSBoYXNoUGFydHNbM10gJiBNQVhfSU5UMzI7XG5cbiAgbGV0IGxvdzogYmlnSW50LkJpZ0ludGVnZXIgPSBiaWdJbnQuemVybzsgLy8gMC0zMSBiaXRzIG9mIHRoZSByZXN1bHRcbiAgbGV0IGhpZ2g6IGJpZ0ludC5CaWdJbnRlZ2VyID0gYmlnSW50Lnplcm87IC8vIDMyLTYzIGJpdHMgb2YgdGhlIHJlc3VsdFxuICBsZXQgdGVtcDogYmlnSW50LkJpZ0ludGVnZXI7XG5cbiAgY29uc3QgbGVuOiBudW1iZXIgPSBjaGFsbGVuZ2VQYXJ0cy5sZW5ndGg7XG4gIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHRlbXAgPSBiaWdJbnQoY2hhbGxlbmdlUGFydHNbaV0pLm11bHRpcGx5KE1BR0lDKS5tb2QoTUFYX0lOVDMyKTtcbiAgICBsb3cgPSBsb3cuYWRkKHRlbXApLm11bHRpcGx5KEhBU0hfMCkuYWRkKEhBU0hfMSkubW9kKE1BWF9JTlQzMik7XG4gICAgaGlnaCA9IGhpZ2guYWRkKGxvdyk7XG5cbiAgICB0ZW1wID0gYmlnSW50KGNoYWxsZW5nZVBhcnRzW2kgKyAxXSk7XG4gICAgbG93ID0gbG93LmFkZCh0ZW1wKS5tdWx0aXBseShIQVNIXzIpLmFkZChIQVNIXzMpLm1vZChNQVhfSU5UMzIpO1xuICAgIGhpZ2ggPSBoaWdoLmFkZChsb3cpO1xuICB9XG5cbiAgbG93ID0gbG93LmFkZChIQVNIXzEpLm1vZChNQVhfSU5UMzIpO1xuICBoaWdoID0gaGlnaC5hZGQoSEFTSF8zKS5tb2QoTUFYX0lOVDMyKTtcblxuICByZXR1cm4gbmV3IFVpbnQzMkFycmF5KFtsb3cudG9KU051bWJlcigpLCBoaWdoLnRvSlNOdW1iZXIoKV0pO1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4vLyBodHRwczovL2dpdGh1Yi5jb20vRGVtdXJnb3Mvc2t5cGUtd2ViLXJldmVyc2VkL2Jsb2IvZmUzOTMxYzRmMDkxYWYwNmY2YjJjMmU4YzE0NjA4YWViZjg3NDQ4Yi9za3lwZS9sYXRlc3QvZGVjb21waWxlZC9mdWxsRXhwZXJpZW5jZS9yanMkJG1zci1jcnlwdG8vbGliL3NoYTI1NkF1dGguanMjTDQ4XG4vKipcbiAqIFRoaXMgY29tcHV0ZXMgdGhlIEhhc2gtYmFzZWQgbWVzc2FnZSBhdXRoZW50aWNhdGlvbiBjb2RlIChITUFDKSBvZiB0aGUgaW5wdXQgYnVmZmVyIGJ5IHVzaW5nXG4gKiBTSEEtMjU2IGFuZCB0aGUgY2hlY2tTdW02NCBmdW5jdGlvbi5cbiAqIFRoaXMgaXMgcmV0cmlldmVkIGZyb20gdGhlIHNvdXJjZSBvZiBTa3lwZSdzIHdlYiBhcHBsaWNhdGlvbi5cbiAqXG4gKiBTZWUgZ2V0TWFjSGFzaCBpbiBzaGEyNTZBdXRoLmpzIGF0IHNreXBlLXdlYi1yZXZlcnNlZCBmb3IgdGhlIG9yaWdpbmFsIGltcGxlbWVudGF0aW9uXG4gKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gKlxuICogQHBhcmFtIGlucHV0XG4gKiBAcGFyYW0gcHJvZHVjdElkXG4gKiBAcGFyYW0gcHJvZHVjdEtleVxuICogQHJldHVybnMge3N0cmluZ30gQW4gaGV4YWRlY2ltYWwgMzItY2hhcnMgbG9uZyBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhtYWNTaGEyNTYoaW5wdXQ6IEJ1ZmZlciwgcHJvZHVjdElkOiBCdWZmZXIsIHByb2R1Y3RLZXk6IEJ1ZmZlcik6IHN0cmluZyB7XG4gIGxldCBtZXNzYWdlOiBCdWZmZXIgPSBCdWZmZXIuY29uY2F0KFtpbnB1dCwgcHJvZHVjdElkXSk7XG4gIC8vIGFkanVzdCBsZW5ndGggdG8gYmUgYSBtdWx0aXBsZSBvZiA4IHdpdGggcmlnaHQtcGFkZGluZyBvZiBjaGFyYWN0ZXIgJzAnXG4gIGlmIChtZXNzYWdlLmxlbmd0aCAlIDggIT09IDApIHtcbiAgICBjb25zdCBmaXg6IG51bWJlciA9IDggLSAobWVzc2FnZS5sZW5ndGggJSA4KTtcbiAgICBjb25zdCBwYWRkaW5nOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoZml4LCBcIjBcIiwgXCJ1dGY4XCIpO1xuICAgIHBhZGRpbmcuZmlsbChcIjBcIik7XG4gICAgbWVzc2FnZSA9IEJ1ZmZlci5jb25jYXQoW21lc3NhZ2UsIHBhZGRpbmddKTtcbiAgfVxuXG4gIGNvbnN0IGNoYWxsZW5nZVBhcnRzOiBVaW50MzJBcnJheSA9IHVpbnQ4QXJyYXlUb1VpbnQzMkFycmF5KG1lc3NhZ2UpO1xuXG4gIGNvbnN0IHNoYTI1NkhleFN0cmluZzogc3RyaW5nID0gc2hhMjU2LnNoYTI1NihCdWZmZXIuY29uY2F0KFtpbnB1dCwgcHJvZHVjdEtleV0pKTtcbiAgY29uc3Qgc2hhMjU2QnVmZmVyOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShzaGEyNTZIZXhTdHJpbmcsIFwiaGV4XCIpO1xuXG4gIC8vIEdldCBoYWxmIG9mIHRoZSBzaGEyNTYgYXMgNCB1aW50MzJcbiAgY29uc3Qgc2hhMjU2UGFydHM6IFVpbnQzMkFycmF5ID0gdWludDhBcnJheVRvVWludDMyQXJyYXkoc2hhMjU2QnVmZmVyLnNsaWNlKDAsIDE2KSk7XG5cbiAgY29uc3QgY2hlY2tTdW1QYXJ0czogVWludDMyQXJyYXkgPSBjaGVja1N1bTY0KGNoYWxsZW5nZVBhcnRzLCBzaGEyNTZQYXJ0cyk7XG5cbiAgc2hhMjU2UGFydHNbMF0gXj0gY2hlY2tTdW1QYXJ0c1swXTtcbiAgc2hhMjU2UGFydHNbMV0gXj0gY2hlY2tTdW1QYXJ0c1sxXTtcbiAgc2hhMjU2UGFydHNbMl0gXj0gY2hlY2tTdW1QYXJ0c1swXTtcbiAgc2hhMjU2UGFydHNbM10gXj0gY2hlY2tTdW1QYXJ0c1sxXTtcblxuICByZXR1cm4gaW50MzJUb0xpdHRsZUVuZGlhbkhleFN0cmluZyhzaGEyNTZQYXJ0c1swXSlcbiAgICArIGludDMyVG9MaXR0bGVFbmRpYW5IZXhTdHJpbmcoc2hhMjU2UGFydHNbMV0pXG4gICAgKyBpbnQzMlRvTGl0dGxlRW5kaWFuSGV4U3RyaW5nKHNoYTI1NlBhcnRzWzJdKVxuICAgICsgaW50MzJUb0xpdHRsZUVuZGlhbkhleFN0cmluZyhzaGEyNTZQYXJ0c1szXSk7XG59XG4iXSwic291cmNlUm9vdCI6Ii4uIn0=
