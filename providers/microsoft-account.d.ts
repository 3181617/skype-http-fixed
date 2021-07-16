import toughCookie from "tough-cookie";
import { SkypeToken } from "../interfaces/api/context";
import * as io from "../interfaces/http-io";
export declare const skypeWebUri: string;
export declare const skypeLoginUri: string;
export declare const liveLoginUri: string;
export declare const webClientLiveLoginId: string;
/**
 * Checks if the user `username` exists
 */
export interface Credentials {
    /**
     * Skype username or email address
     */
    login: string;
    password: string;
}
export interface LoginOptions {
    credentials: Credentials;
    httpIo: io.HttpIo;
    cookies: toughCookie.Store;
}
export declare function login(options: LoginOptions): Promise<SkypeToken>;
export interface LoadLiveKeysOptions {
    httpIo: io.HttpIo;
    cookies: toughCookie.Store;
}
export interface LiveKeys {
    /**
     * MicroSoft P Requ ?
     *
     * Examples:
     * - `"$uuid-46f6d2b2-ff98-4446-aafb-2ba99c0c0638"`
     */
    MSPRequ: string;
    /**
     * MicroSoft P OK ?
     *
     * Examples:
     * - `"lt=1483826635&co=1&id=293290"`
     */
    MSPOK: string;
    /**
     * PPF Token ?
     *
     * Examples: (see spec)
     */
    PPFT: string;
}
export declare function getLiveKeys(options: LoadLiveKeysOptions): Promise<LiveKeys>;
/**
 * Retrieves the PPFT key from the HTML response from login.live.com to get the Live keys.
 *
 * @param html The html body to scrap
 * @returns The PPFT key
 */
export declare function scrapLivePpftKey(html: string): string;
export interface GetLiveTokenOptions {
    username: string;
    password: string;
    liveKeys: LiveKeys;
    httpIo: io.HttpIo;
    cookies: toughCookie.Store;
}
export declare function getLiveToken(options: GetLiveTokenOptions): Promise<string>;
export declare function requestLiveToken(options: GetLiveTokenOptions): Promise<io.Response>;
/**
 * Scrap the result of a sendCredentials requests to retrieve the value of the `t` parameter
 * @param html
 * @returns The token provided by Live for Skype
 */
export declare function scrapLiveToken(html: string): string;
export interface GetSkypeTokenOptions {
    liveToken: string;
    httpIo: io.HttpIo;
    cookies: toughCookie.Store;
}
/**
 * Complete the OAuth workflow and get the Skype token
 *
 * @param options
 */
export declare function getSkypeToken(options: GetSkypeTokenOptions): Promise<SkypeToken>;
export declare function requestSkypeToken(options: GetSkypeTokenOptions): Promise<io.Response>;
export interface SkypeTokenResponse {
    skypetoken: string;
    expires_in: number | undefined;
}
/**
 * Scrap to get the Skype OAuth token
 *
 * @param html
 * @returns {string}
 */
export declare function scrapSkypeTokenResponse(html: string): SkypeTokenResponse;
