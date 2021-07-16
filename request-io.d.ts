import * as io from "./interfaces/http-io";
/**
 * Send a GET request
 *
 * @param options
 */
export declare function get(options: io.GetOptions): Promise<io.Response>;
/**
 * Send a POST request
 *
 * @param options
 */
export declare function post(options: io.PostOptions): Promise<io.Response>;
/**
 * Send a PUT request
 *
 * @param options
 */
export declare function put(options: io.PutOptions): Promise<io.Response>;
export declare const requestIo: io.HttpIo;
