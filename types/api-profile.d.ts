import { DocumentType } from "kryo/types/document";
import { Url } from "./url";
/**
 * Represents a profile returned by the general API (api.skype.com)
 *
 * Examples:
 * ```
 * {
 *   "firstname": "Bob",
 *   "lastname": null,
 *   "birthday": null,
 *   "gender": null,
 *   "language": null,
 *   "country": null,
 *   "province": null,
 *   "city": null,
 *   "homepage": null,
 *   "about": null,
 *   "emails": [
 *     "bob@example.com"
 *   ],
 *   "jobtitle": null,
 *   "phoneMobile": null,
 *   "phoneHome": null,
 *   "phoneOffice": null,
 *   "mood": null,
 *   "richMood": null,
 *   "avatarUrl": "https://avatar.skype.com/v1/avatars/bob?auth_key=-2078211408",
 *   "username": "bob"
 * }
 * ```
 *
 * ```
 * {
 *   "firstname": "Pavel",
 *   "lastname": "Georgiy",
 *   "birthday": null,
 *   "gender": null,
 *   "language": null,
 *   "country": null,
 *   "province": null,
 *   "city": null,
 *   "homepage": null,
 *   "about": null,
 *   "emails": [
 *     "pavel.georgiy@yandex.ru"
 *   ],
 *   "jobtitle": null,
 *   "phoneMobile": null,
 *   "phoneHome": null,
 *   "phoneOffice": null,
 *   "mood": null,
 *   "richMood": null,
 *   "avatarUrl": null,
 *   "username": "live:pavel.georgiy"
 * }
 * ```
 *
 */
export interface ApiProfile {
    firstname: string;
    lastname: string | null;
    birthday: any | null;
    gender: any | null;
    language: any | null;
    country: any | null;
    province: any | null;
    city: any | null;
    homepage: any | null;
    about: any | null;
    emails: string[];
    jobtitle: any | null;
    phoneMobile: any | null;
    phoneHome: any | null;
    phoneOffice: any | null;
    mood: any | null;
    richMood: any | null;
    avatarUrl: Url;
    username: string;
}
export declare const $ApiProfile: DocumentType<ApiProfile>;
