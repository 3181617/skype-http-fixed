import { Location } from "../../types/location";
import { FullId } from "./api";
export interface Phone {
    number: string;
    type: number;
}
export interface Contact {
    id: FullId;
    avatarUrl: string | null;
    phones: Phone[];
    emails?: String[];
    name: {
        first: string | null;
        surname: string | null;
        nickname: string;
        displayName: string;
    };
    activityMessage: string | null;
    locations: Location[];
}
export interface Profile {
    fistname: string;
    lastname: string;
    birthday: any | null;
    language: "en" | string;
    country: "us" | string;
    province: any | null;
    city: any | null;
    homepage: any | null;
    about: any | null;
    emails: any[];
    phoneMobile: any | null;
    phoneHome: any | null;
    phoneOffice: any | null;
    mood: any | null;
    richMood: any | null;
    avatarUrl: any | null;
    username: string;
}
