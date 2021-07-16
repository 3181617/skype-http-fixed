import * as api from "./api";
import { Credentials } from "./interfaces/api/api";
import { Context } from "./interfaces/api/context";
export interface StateContainer {
    state: any;
}
export interface ConnectOptions {
    credentials?: Credentials;
    state?: Context.Json;
    verbose?: boolean;
}
/**
 * Authenticate the user and create a new API.
 *
 * @param options
 * @returns The Skype API for the provided user
 * @throws [[LoginError]]
 */
export declare function connect(options: ConnectOptions): Promise<api.Api>;
