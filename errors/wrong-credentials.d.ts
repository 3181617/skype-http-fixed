import { Incident } from "incident";
export declare namespace WrongCredentialsError {
    type Name = "WrongCredentials";
    const name: Name;
    interface Data {
        username?: string;
    }
    type Cause = undefined;
}
export declare type WrongCredentialsError = Incident<WrongCredentialsError.Data, WrongCredentialsError.Name, WrongCredentialsError.Cause>;
export declare namespace WrongCredentialsError {
    type Type = WrongCredentialsError;
    function format({username}: Data): string;
    function create(username?: string): WrongCredentialsError;
}
