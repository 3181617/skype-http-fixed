export interface Location {
    country: string;
    city?: string;
}
export interface Phone {
    number: string;
    type: number;
}
export interface SearchContact {
    firstname: string;
    lastname: string;
    country: string;
    city: string;
    avatarUrl: string;
    displayname: string;
    username: string;
    mood: string;
    emails: string[];
    gender: string;
}
export interface Contact {
    id: string;
    person_id: string;
    type: "skype" | "agent" | string;
    display_name: string;
    authorized?: boolean;
    suggested?: boolean;
    mood?: string;
    blocked: boolean;
    avatar_url: string;
    locations?: Location[];
    phones?: Phone[];
    name: {
        first: string;
        surname?: string;
        nickname: string;
    };
    agent?: any;
}
