import { Incident } from "incident";
import { GetOptions, Response } from "../interfaces/http-io";
import { MissingHeaderError, UnexpectedHttpStatusError } from "./http";
import { Type as LoginRateLimitExceeded } from "./login-rate-limit-exceeded";
import { Type as RedirectionLimit } from "./redirection-limit";
export declare namespace EndpointRegistrationError {
    type Name = "EndpointRegistration";
    interface HttpExchange {
        req: GetOptions;
        res: Response;
    }
    interface Data {
        tries: HttpExchange[];
    }
    type Cause = LoginRateLimitExceeded | MissingHeaderError | UnexpectedHttpStatusError | RedirectionLimit;
}
export declare type Name = EndpointRegistrationError.Name;
export declare const NAME: Name;
export declare type HttpExchange = EndpointRegistrationError.HttpExchange;
export declare type Data = EndpointRegistrationError.Data;
export declare type Cause = EndpointRegistrationError.Cause;
export declare class EndpointRegistrationError extends Incident<Data, Name, Cause> {
    static NAME: Name;
    constructor(cause: Cause, tries: HttpExchange[]);
}
