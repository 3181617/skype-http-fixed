import { Incident } from "incident";
export declare type Name = "RedirectionLimit";
export declare const name: Name;
export interface Data {
    limit?: number;
}
export declare type Cause = undefined;
export declare type Type = Incident<Data, Name, Cause>;
export declare function create(limit?: number): Incident<Data, Name, Cause>;
