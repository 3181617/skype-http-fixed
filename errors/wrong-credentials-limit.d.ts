import { Incident } from "incident";
export declare namespace WrongCredentialsLimitError {
    type Name = "WrongCredentialsLimit";
    const name: Name;
    interface Data {
    }
    type Cause = undefined;
}
export declare type WrongCredentialsLimitError = Incident<WrongCredentialsLimitError.Data, WrongCredentialsLimitError.Name, WrongCredentialsLimitError.Cause>;
export declare namespace WrongCredentialsLimitError {
    type Type = WrongCredentialsLimitError;
    function format(): string;
    function create(username?: string): WrongCredentialsLimitError;
}
