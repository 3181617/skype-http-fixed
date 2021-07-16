import toughCookie from "tough-cookie";
import { RegistrationToken, SkypeToken } from "../interfaces/api/context";
import * as io from "../interfaces/http-io";
/**
 * Get the registration token used to subscribe to resources.
 *
 * @param io Cookies and HTTP library to use.
 * @param cookies Cookie jar to use.
 * @param skypeToken The Skype to use for authentication.
 * @param messagesHostname Hostname of the messages server.
 * @param retries Number of request retries before emitting an error. Example: if `retries` is `1`, this function
 *                will send 1 or 2 requests.
 * @return Registration token
 * @throws [[EndpointRegistrationError]]
 */
export declare function registerEndpoint(io: io.HttpIo, cookies: toughCookie.Store, skypeToken: SkypeToken, messagesHostname: string, retries?: number): Promise<RegistrationToken>;
