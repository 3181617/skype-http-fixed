export declare const DEFAULT_USER: string;
export declare const DEFAULT_ENDPOINT: string;
export declare function threads(host: string): string;
export declare function thread(host: string, threadId: string): string;
export declare function member(host: string, threadId: string, member: string): string;
export declare function properties(host: string, threadId: string): string;
export declare function users(host: string): string;
export declare function user(host: string, userId?: string): string;
/**
 * Build the URI for the endpoints of a user.
 *
 * Template: `https://{host}/v1/users/{userId}/endpoints`
 *
 * @param host Hostname of the messages server.
 * @param userId Id of the user. Default: `"ME"`.
 * @return Formatted URI.
 */
export declare function endpoints(host: string, userId?: string): string;
export declare function endpoint(host: string, userId?: string, endpointId?: string): string;
export declare function poll(host: string, userId?: string, endpointId?: string, subscriptionId?: number): string;
/**
 * Returns https://{host}/v1/users/{userId}/endpoints/{endpointId}/subscriptions
 * @param host
 * @param userId
 * @param endpointId
 */
export declare function subscriptions(host: string, userId?: string, endpointId?: string): string;
export declare function conversations(host: string, user: string): string;
export declare function conversation(host: string, user: string, conversationId: string): string;
/**
 * Returns https://{host}/v1/users/{user}/conversations/{conversationId}/messages
 * @param host
 * @param user
 * @param conversationId
 */
export declare function messages(host: string, user: string, conversationId: string): string;
export declare function objects(host: string): string;
export declare function object(host: string, objectId: string): string;
export declare function objectContent(host: string, objectId: string, content: string): string;
export declare function objectView(host: string, objectId: string, view: string): string;
export declare function userMessagingService(host: string, user?: string): string;
export declare function endpointMessagingService(host: string, user?: string, endpoint?: string): string;
export interface MessageUri {
    host: string;
    user: string;
    conversation: string;
    message: string;
}
export declare function parseMessage(uri: string): MessageUri;
export interface ContactUri {
    host: string;
    user: string;
    contact: string;
}
export declare function parseContact(uri: string): ContactUri;
export interface ConversationUri {
    host: string;
    user: string;
    conversation: string;
}
export declare function parseConversation(uri: string): ConversationUri;
