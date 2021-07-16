import { Incident } from "incident";
import { GetOptions, Response } from "../interfaces/http-io";
export declare type Name = "LoginRateLimitExceeded";
export declare const name: Name;
export interface Data {
    req: GetOptions;
    res: Response;
}
export declare type Cause = undefined;
export declare type Type = Incident<Data, Name, Cause>;
export declare function create(req: GetOptions, res: Response): Incident<Data, Name, Cause>;
