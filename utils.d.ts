import { AllUsers, Members } from "./interfaces/native-api/conversation";
/**
 * Returns the number of seconds since epoch.
 *
 * @returns {number}
 */
export declare function getCurrentTime(): number;
/**
 * Adds zeros to the left of the string representation of number until its length is equal to len.
 * @param number
 * @param len
 * @returns {string}
 */
export declare function zeroPad(number: number | string, len: number): string;
export declare function padLeft(str: any, len: number, char?: string): string;
export declare function padRight(str: any, len: number, char?: string): string;
export declare function stringFromChar(char: string, count: number): string;
export declare function getTimezone(): string;
export declare function stringifyHeaderParams(params: {
    [key: string]: string;
}): string;
export declare function parseHeaderParams(params: string): Map<string, string>;
export declare function getMembers(allUsers: AllUsers): Members[];
