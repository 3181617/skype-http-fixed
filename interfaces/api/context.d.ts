import toughCookie from "tough-cookie";
/**
 * Represents the OAuth token used for most calls to the Skype API.
 */
export interface SkypeToken {
    value: string;
    expirationDate: Date;
}
export declare namespace SkypeToken {
    /**
     * JSON-safe representation of `SkypeToken`, used for serialization.
     */
    interface Json {
        value: string;
        expirationDate: string;
    }
    /**
     * Export a SkypeToken to a JSON-safe object.
     */
    function toJson(token: SkypeToken): Json;
    /**
     * Import a SkypeToken from a JSON-safe object.
     */
    function fromJson(token: Json): SkypeToken;
}
/**
 * Represents the OAuth registration token.
 * Here are some of the actions requiring a registration token:
 * - set status
 * - send message
 * - get conversations list
 */
export interface RegistrationToken {
    value: string;
    expirationDate: Date;
    endpointId: string;
    host: string;
    raw: string;
}
export declare namespace RegistrationToken {
    /**
     * JSON-safe representation of `RegistrationToken`, used for serialization.
     */
    interface Json {
        value: string;
        expirationDate: string;
        endpointId: string;
        host: string;
        raw: string;
    }
    /**
     * Export a RegistrationToken to a JSON-safe object.
     */
    function toJson(token: RegistrationToken): Json;
    /**
     * Import a RegistrationToken from a JSON-safe object.
     */
    function fromJson(token: Json): RegistrationToken;
}
/**
 * API context (state).
 */
export interface Context {
    username: string;
    cookies: toughCookie.Store;
    skypeToken: SkypeToken;
    registrationToken: RegistrationToken;
}
export declare namespace Context {
    /**
     * JSON-safe representation of `Context`.
     */
    interface Json {
        username: string;
        cookies: toughCookie.CookieJar.Serialized;
        skypeToken: SkypeToken.Json;
        registrationToken: RegistrationToken.Json;
    }
    function toJson(context: Context): Json;
    function fromJson(context: Json): Context;
}
