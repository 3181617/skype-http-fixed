import { Contact } from "../interfaces/api/contact";
import { Conversation } from "../interfaces/api/conversation";
import { Contact as NativeContact, SearchContact as NativeSearchContact } from "../interfaces/native-api/contact";
import { Conversation as NativeConversation, Thread as NativeThread } from "../interfaces/native-api/conversation";
export declare function formatConversation(native: NativeConversation): Conversation;
export declare function formatThread(native: NativeThread): Conversation;
export declare function formatSearchContact(native: NativeSearchContact): Contact;
export declare function formatContact(native: NativeContact): Contact;
